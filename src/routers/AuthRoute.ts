import { Request, Response } from "express"
import { PathFinder, Router, Email, RepoRestActions, Typeorm, Bus } from "typexpress"
import { UserRole } from "../repository/utils"
import { generateName } from "./utils"



class AuthRoute extends Router.Service {

	get defaultConfig(): any {
		return {
			...super.defaultConfig,
			path: "/auth",
			usersPath: "/typeorm/users",
			devicesPath: "/typeorm/devices",
			jwt: "/http/route/jwt-route",
			routers: [
				{ path: "/login/guest", verb: "post", method: "logInGuest" },
			]
		}
	}

	/**
	 * Crea/ricava uno USER e lo mette nel jwt token
	 * deviceInfo: {
			"model": "Moto G (4)",
			"platform": "web",
			"operatingSystem": "android",
			"osVersion": "Android 6.0.1",
			"manufacturer": "Google Inc.",
			"isVirtual": false,
			"webViewVersion": "90.0.4430.212"
		}
	 */
	async logInGuest(req: Request, res: Response) {
		const { usersPath, devicesPath } = this.state
		const { browserId, deviceInfo, pushToken } = req.body
		const clientAddress = req.socket.remoteAddress

		const devicesRepo = new PathFinder(this).getNode<Typeorm.Repo>(devicesPath)
		const usersRepo = new PathFinder(this).getNode<Typeorm.Repo>(usersPath)

		// cerca attraverso la push token e browserid
		let devices = null
		if ( pushToken ) {
			devices = await devicesRepo.dispatch({
				type: Typeorm.Actions.FIND,
				payload: { relations: ["user"], where: { pushToken } }
			})
		}
		// se non lo trova usa il "browserID" (da controllare!!!)
		if ( !devices && browserId ) {
			devices = await devicesRepo.dispatch({
				type: Typeorm.Actions.FIND,
				payload: { relations: ["user"], where: { browserId } }
			})
		}

		// se trova qualcosa prendo lo user
		let user = devices?.[0]?.user ?? null

		// se non lo trova allora creo il device e lo user
		if ( !user ) {
			user = {
				name: generateName(),
				role: UserRole.GUEST,
				devices: [
					{
						platform: deviceInfo?.platform,
						model: deviceInfo?.model,
						pushToken,
					}
				]
			}
			let newUser = await usersRepo.dispatch({
				type: RepoRestActions.SAVE,
				payload: user,
			})
			console.log(newUser)
		}	

		// inserisco user nel payload jwt
		const jwtService = new PathFinder(this).getNode<Router.JWT.Route>("/http/route/route-jwt")
		const token = await jwtService.putPayload(user, res)
		res.json({ token })
	}
}

export default AuthRoute
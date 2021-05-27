import { Request, Response } from "express"
import { PathFinder, Router, Email, RepoRestActions, Typeorm, Bus } from "typexpress"
import crypto from "crypto"
import { Biblio } from "../global"
import { TypeormActions } from "typexpress/dist/services/typeorm"


class UserRoute extends Router.Service {

	get defaultConfig(): any {
		return {
			...super.defaultConfig,
			path: "/user",
			userRepo: "/typeorm/users",
			routers: [
				{ path: "/me", method: "current" },
			]
		}
	}

	async current(req: Request, res: Response) {
		const { userRepo } = this.state
		const payload = req["jwtPayload"]

		// if no jwt
		if ( !payload ) return res.sendStatus(401)

		// get user by jwt
		const user = await new Bus(this, userRepo).dispatch( { 
			type: RepoRestActions.GET_BY_ID, 
			payload: payload.id
		})

		if ( !user ) return res.sendStatus(401)

		res.json({ id: user.id })
	}
}

export default UserRoute
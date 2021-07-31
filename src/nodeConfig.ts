import { Router } from "typexpress"
import path from "path"
import fs from "fs"

import { WSCommands } from "./wsocket"
import repositories from "./repository"
import { AuthRoute, UserRoute, testRoute } from "./routers"
import { ENV } from "./utils"


const PORT = 5001



const buildNodeConfig = () => {

	let dbPath: string
	if (process.env.NODE_ENV == ENV.TEST) {
		try { if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath) }
		catch (e) { console.log(e) }
		dbPath = path.join(__dirname, "../db/database.test.sqlite")
	} else if (process.env.NODE_ENV == ENV.DEV) {
		dbPath = path.join(__dirname, "../db/database.dev.sqlite")
	} else {
		dbPath = path.join(__dirname, "../db/database.sqlite")
	}

	return [
		{
			class: "http",
			port: PORT,
			children: [
				{
					class: "http-router",
					path: "/api",
					cors: {
						"origin": "*",
					},
					children: [

						testRoute,

						{ class: AuthRoute },

						{
							class: "http-router/jwt",
							jwt: "/jwt",
							strategy: Router.JWT.Strategies.Header,
							children: [
								{ class: UserRoute },
							]
						},
					]
				},
				{
					class: "ws/server",
					jwt: "/jwt",
					onConnect: (_client, jwtPayload) => {
						console.log("ws1::onConnect")
					},
					onDisconnect: (client) => {
						console.log("ws1::onDisconnect")
					},
					onMessage: async function (client, message, jwtPayload) {
						console.log(message)
						console.log(jwtPayload)
						// await this.dispatch({
						// 	type: SocketServerActions.SEND,
						// 	payload: { client, message: "from ws1" }
						// })
						// await this.dispatch({
						// 	type: SocketServerActions.DISCONNECT,
						// 	payload: client
						// })
					},
					children: [
						{
							class: WSCommands,
							path: "com",
						}
					]
				}
			]
		},
		{
			class: "typeorm",
			options: {
				type: "sqlite",
				database: dbPath,
				synchronize: true,
			},
			children: repositories,
		},
		{
			class: "email",
			account: {
				// https://ethereal.email/login
				host: 'smtp.ethereal.email',
				port: 587,
				auth: {
					user: 'robin.cummerata65@ethereal.email',
					pass: 'EBnZ54KhH68uUKawGf'
				}
			},
		},
		{
			class: "jwt",
			secret: "secret_word!!!"
		},
	]
}

export default buildNodeConfig
import { Bus, RepoStructActions, Router } from "typexpress"
import path from "path"

import { wsCommands } from "./ws/wsCommands"
import repositories from "./repository"
import AuthRoute from "./routers/AuthRoute"
import UserRoute from "./routers/UserRoute"


const PORT = 8080
const DB_PATH = "../db/database.sqlite"

const buildNodeConfig = (dbPath?: string) => {

	if (!dbPath) dbPath = path.join(__dirname, DB_PATH)

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
						process.env.NODE_ENV == "debug" ? {
							class: "http-router",
							path: "/debug",
							routers: [
								{
									path: "/reset", verb: "post", method: async function (req, res, next) {
										await new Bus(this, "/typeorm/nodes").dispatch({ type: RepoStructActions.SEED })
										await new Bus(this, "/typeorm/users").dispatch({ type: RepoStructActions.SEED })
										res.json({ data: "debug:reset:ok" })
									}
								},
							]
						} : null,

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
							class: wsCommands,
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
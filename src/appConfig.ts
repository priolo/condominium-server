import { Bus, RepoStructActions, Router } from "typexpress"
import path from "path"
import repositories from "./repository"
import AuthRoute from "./routers/AuthRoute"
import UserRoute from "./routers/UserRoute"
import { ENV_TYPE, Global } from "./global"


export default [
	{
		class: "http",
		port: 8080,
		children: [
			{
				class: "http-router",
				path: "/api",
				cors: {
					"origin": "*",
				},
				children: [
					process.env.NODE_ENV == ENV_TYPE.DEBUG ? {
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
				path: "/com",
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
						class: "ws/",
						path: "near",
						onMessage: async function (client, message, jwtPayload) {
							console.log(message)
							console.log(jwtPayload)
						}

					}
				]
			}
		]
	},
	{
		class: "typeorm",
		options: {
			type: "sqlite",
			database: path.join(__dirname, Global.inDebug() ? "../db/_database.sqlite" : "../db/database.sqlite"),
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

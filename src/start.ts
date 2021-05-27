import { Bus, PathFinder, RepoStructActions, RootService, Router } from "typexpress"
import path from "path"

import repositories from "./repository"
import AuthRoute from "./routers/AuthRoute"
import UserRoute from "./routers/UserRoute"
import { log, LOG_LEVEL } from "@priolo/jon-utils"




const ENV_TYPE = {
	PRODUCTION: "production",
	DEVELOP: "develop",
	DEBUG: "debug",
}

RootService.Start([
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
			}
		]
	},
	{
		class: "typeorm",
		options: {
			type: "sqlite",
			database: path.join(__dirname, "../db/database.sqlite"),
			//migrations: ["migration/*.js"],
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
])


log.options.level = LOG_LEVEL.DEBUG
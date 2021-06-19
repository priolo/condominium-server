import appConfig from "appConfig"
import { ENV_TYPE, Global } from "global"
import { Bus, PathFinder, RepoStructActions, RootService } from "typexpress"

let root

beforeAll(async () => {
	
	Global.env = ENV_TYPE.DEBUG

	root = await RootService.Start(appConfig)

	new Bus(root,"typeorm/users").dispatch({ 
		type: RepoStructActions.SEED, 
		payload: [
			{ type: RepoStructActions.TRUNCATE },
			{
				email: "ivano@test.com",
				name: "Ivano",
				password: "111",
				messages: [
					{ text: "row1", latitude: 9.5, longitude: 10.5, range: 3, x: 1, y: 2 },
					{ text: "row2", latitude: 9.5, longitude: 10.5, range: 3, x: 1, y: 2 },
					{ text: "row3", latitude: 9.5, longitude: 10.5, range: 3, x: 1, y: 2 },
				],
			},
			{
				email: "marina@test.com",
				name: "Marina",
				password: "111",
			},
			{
				email: "mattia@test.com",
				name: "Mattia",
				password: "111",
	
			},
		]
	})
})

afterAll(async () => {
	await RootService.Stop(root)
})


test("startup", async () => {
	
})
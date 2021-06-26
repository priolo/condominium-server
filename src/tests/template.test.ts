import buildNodeConfig from "../nodeConfig"
import { Bus, RepoStructActions, RootService } from "typexpress"
import path from "path"



let root
const dbPath = path.join(__dirname, "../../db/_database.sqlite")

beforeAll(async () => {

	// try { if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath) } 
	// catch (e) { console.log(e) }

	const cnf = buildNodeConfig(dbPath)
	root = await RootService.Start(cnf)

	await new Bus(root, "/typeorm/users").dispatch({
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
	// try { if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath) } 
	// catch (e) { console.log(e) }
})

test("check db have message", async () => {
	
})
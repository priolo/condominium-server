import buildNodeConfig from "../nodeConfig"
import { Bus, RepoRestActions, RootService } from "typexpress"
import path from "path"
import fs from "fs"
import { loginAsGuest, getMyInfo } from "./utils/auth"


let root


beforeAll(async () => {
	// try { if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath) }
	// catch (e) { console.log(e) }
	const cnf = buildNodeConfig()
	root = await RootService.Start(cnf)
})

afterAll(async () => {
	await RootService.Stop(root)
	// try { if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath) }
	// catch (e) { console.log(e) }
})

test("register as guest and get info", async () => {
	const token = await loginAsGuest()
	const user = await getMyInfo(token)
	//get user from DB
	const resp = await new Bus(root, "typeorm/users")
		.dispatch({ type: RepoRestActions.GET_BY_ID, payload: user.id })
	
	expect(resp).toMatchObject(user)
})


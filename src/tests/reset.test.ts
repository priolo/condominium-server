import buildNodeConfig from "../nodeConfig"
import { Bus, RepoRestActions, RootService } from "typexpress"
import { reset } from "./utils/rec"


let root

beforeAll(async () => {
	const cnf = buildNodeConfig()
	root = await RootService.Start(cnf)
})

afterAll(async () => {
	await RootService.Stop(root)
})

test("RESET server", async () => {
	await reset()
})


import buildNodeConfig from "../nodeConfig"
import { Bus, PathFinder, RepoRestActions, RootService, WS } from "typexpress"
import path from "path"
import fs from "fs"
import { loginAsGuest } from "./utils/auth"
import { wsConnect, wsSendPosition, wsSendTextMessage, wsConnectPool, wsSendGetMessages } from "./utils/ws"


let root
const dbPath = path.join(__dirname, "../../db/_database.sqlite")


beforeAll(async () => {
	try { if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath) } catch (e) { console.log(e) }

	const cnf = buildNodeConfig(dbPath)
	root = await RootService.Start(cnf)
})

afterAll(async () => {
	await RootService.Stop(root)

	//try { if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath) } catch (e) { console.log(e) }
})

test("connect and send position", async () => {
	const token = await loginAsGuest()
	const ws = await wsConnect(token)
	wsSendPosition(ws, { x: 1, y: 2 })

	await new Promise((res, rej) => setTimeout(res, 300))

	const wsServer = new PathFinder(root).getNode<WS.server>("http/ws-server")
	const clients = wsServer.getClients()

	expect(clients[0]["position"]).toEqual({ x: 1, y: 2 })
})


test("send message near", async () => {
	const resp = []
	const positions = [
		{ x: 1, y: 2 },
		{ x: 2, y: 5 },
		{ x: 20, y: 30 },
	]
	const wss = await wsConnectPool(positions)

	// build event 
	wss.forEach((ws, index) => {
		ws.on("message", (msg: string) => {
			const data = JSON.parse(msg)
			data.index = index
			resp.push(data)
		})
	})
	wsSendTextMessage(wss[0], "ciao!")
	await new Promise((res, rej) => setTimeout(res, 300))

	expect(resp).toMatchObject([
		{ text: "ciao!", index: 1 },
		{ text: "ciao!", index: 0 },
	])
})

test("login and get local messages", async () => {

	const positions = [
		{ x: 1, y: 2 },
		{ x: 2, y: 5 },
		{ x: 20, y: 30 },
	]
	const wss = await wsConnectPool(positions)

	wsSendTextMessage(wss[0], "primo")
	wsSendTextMessage(wss[1], "secondo")
	wsSendTextMessage(wss[2], "terzo")

	await new Promise((res, rej) => setTimeout(res, 300))

	const messages = await wsSendGetMessages(wss[0])

	expect(messages).toMatchObject([
		{ text: "secondo" },
		{ text: "primo" },
	])
})

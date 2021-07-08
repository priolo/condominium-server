import buildNodeConfig from "../nodeConfig"
import { PathFinder, RootService, WS } from "typexpress"
import path from "path"
import fs from "fs"

import { loginAsGuest } from "./utils/auth"
import { wsConnect, wsSendSetPosition, wsSendTextMessage, wsConnectPool, wsSendGetNearMessages, wsSendGetNearClients, waitMessage } from "./utils/ws"
import { ACTIONS_TO_CLIENT } from "../wsocket"


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
	wsSendSetPosition(ws, { x: 1, y: 2 })

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
	// create clients
	const wss = await wsConnectPool(positions)

	// build event for each client
	wss.forEach((ws, index) => {
		ws.on("message", (msg: string) => {
			const data = JSON.parse(msg)
			if (data.action == ACTIONS_TO_CLIENT.MESSAGE) {
				data.index = index
				resp.push(data)
			}
		})
	})

	// client 0 send a text message
	wsSendTextMessage(wss[0], "ciao!")
	await new Promise((res, rej) => setTimeout(res, 300))

	// test!
	expect(resp).toMatchObject([
		{
			action: ACTIONS_TO_CLIENT.MESSAGE,
			payload: { text: "ciao!" },
			index: 1
		},
		{
			action: ACTIONS_TO_CLIENT.MESSAGE,
			payload: { text: "ciao!" },
			index: 0
		},
	])
})

test("login and get local messages", async () => {

	const positions = [
		{ x: 1, y: 2 },
		{ x: 2, y: 5 },
		{ x: 20, y: 30 },
	]
	// create clients
	const wss = await wsConnectPool(positions)

	// create messages
	wsSendTextMessage(wss[0], "primo")
	wsSendTextMessage(wss[1], "secondo")
	wsSendTextMessage(wss[2], "terzo")

	await new Promise((res, rej) => setTimeout(res, 300))

	// get message on position client 0
	wsSendGetNearMessages(wss[0])
	const messages = await waitMessage(wss[0], ACTIONS_TO_CLIENT.MESSAGES_NEAR)

	// test!
	expect(messages).toMatchObject([
		{ text: "secondo" },
		{ text: "primo" },
	])
})


test("login and get local clients", async () => {

	const positions = [
		{ x: 1, y: 2 },
		{ x: 2, y: 5 },
		{ x: 20, y: 30 },
	]
	// create clients
	const wss = await wsConnectPool(positions)

	// get clients near client 0
	wsSendGetNearClients(wss[0])
	const clients = await waitMessage(wss[0], ACTIONS_TO_CLIENT.CLIENTS_NEAR)

	// test!
	expect(clients).toMatchObject([
		{ text: "secondo" },
		{ text: "primo" },
	])
})

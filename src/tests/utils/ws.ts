import WebSocket from "ws"
import { ACTIONS_FROM_CLIENT, ACTIONS_TO_CLIENT, Point } from "../../wsocket"
import { loginAsGuest } from "./auth"



//#region CONNECTION

/** connette  un ws e aspetta che sia connesso */
export async function wsConnect(token: string, port: number = 5001): Promise<WebSocket> {
	return new Promise((res, rej) => {
		const ws = new WebSocket(`ws://localhost:${port}/?token=${token}`)
		ws.once('open', () => res(ws))
	})
}

/** connette un pool di ws */
export async function wsConnectPool(positions: { x: number, y: number }[], port: number = 5001): Promise<WebSocket[]> {

	// login, connection, send position
	const promises = Array.from({ length: positions.length }, async (_, index) => {
		const token = await loginAsGuest()
		const ws = await wsConnect(token)
		wsSendSetPosition(ws, positions[index])
		return ws
	})

	const wss = await Promise.all(promises)
	return wss
}

//#endregion



//#region SEND

export async function wsSendSetPosition(ws: WebSocket, position: Point): Promise<void> {
	ws.send(JSON.stringify({
		path: "com", 
		action: ACTIONS_FROM_CLIENT.POSITION,
		payload: position,
	}))
}

export async function wsSendTextMessage(ws: WebSocket, message: string): Promise<void> {
	ws.send(JSON.stringify({
		path: "com", 
		action: ACTIONS_FROM_CLIENT.MESSAGE,
		payload: message,
	}))
}

export async function wsSendGetNearMessages(ws: WebSocket) {
	ws.send(JSON.stringify({
		path: "com", 
		action: ACTIONS_FROM_CLIENT.MESSAGES,
	}))
}

export async function wsSendGetNearClients(ws: WebSocket) {
	ws.send(JSON.stringify({
		path: "com", 
		action: ACTIONS_FROM_CLIENT.NEAR,
	}))
}

export async function waitMessage ( ws:WebSocket, action:ACTIONS_TO_CLIENT ): Promise<any> {
	return new Promise((res, rej) => {
		const fn = (data) => {
			const jsonData = JSON.parse(data)
			if (jsonData.action != action) return
			ws.off("message", fn)
			res(jsonData)
		}
		ws.on("message", fn)
	})
}

//#endregion
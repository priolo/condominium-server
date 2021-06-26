import WebSocket from "ws"
import { point } from "ws/utils"
import { loginAsGuest } from "./auth"



//#region CONNECTION

/** connette  un ws e aspetta che sia connesso */
export async function wsConnect(token: string, port: number = 8080): Promise<WebSocket> {
	return new Promise((res, rej) => {
		const ws = new WebSocket(`ws://localhost:${port}/?token=${token}`)
		ws.once('open', () => res(ws))
	})
}

/** connette un pool di ws */
export async function wsConnectPool(positions: { x: number, y: number }[], port: number = 8080): Promise<WebSocket[]> {

	// login, connection, send position
	const promises = Array.from({ length: positions.length }, async (_, index) => {
		const token = await loginAsGuest()
		const ws = await wsConnect(token)
		wsSendPosition(ws, positions[index])
		return ws
	})

	const wss = await Promise.all(promises)
	return wss
}

//#endregion



//#region SEND

export async function wsSendPosition(ws: WebSocket, position: point): Promise<void> {
	ws.send(JSON.stringify({
		path: "com", action: "position",
		payload: position,
	}))
}

export async function wsSendTextMessage(ws: WebSocket, message: string): Promise<void> {
	ws.send(JSON.stringify({
		path: "com", action: "message",
		payload: message,
	}))
}

export async function wsSendGetMessages(ws: WebSocket): Promise<any[]> {
	return new Promise((res, rej) => {
		ws.once("message", (data: string) => {
			const jsonData:any[] = JSON.parse(data)
			res(jsonData)
		})
		ws.send(JSON.stringify({
			path: "com", action: "messages",
		}))

	})
}

//#endregion
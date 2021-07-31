import { WS } from "typexpress"
import { WSCommands } from "./WSCommands"


type Rect = {
	right: number,
	left: number,
	top: number,
	bottom: number
}

type Point = {
	x: number,
	y: number,
}

type MessageToClient = {
	action: string,
	payload?: any,
}

enum ACTIONS_TO_CLIENT {
	CLIENTS_NEAR = "clients_near",
	MESSAGES_NEAR = "messages_near",
	MESSAGE = "message"
}
enum ACTIONS_FROM_CLIENT {
	POSITION = "position",
	MESSAGE = "message",
	MESSAGES = "messages",
	NEAR = "near",
}



/** restituisce tutti i client vicini  */
function clientsNearByClient(client: WS.utils.IClient, clients: WS.utils.IClient[], dist: number) {
	const point: Point = client["position"]
	const area: Rect = {
		left: point.x - dist,
		right: point.x + dist,
		top: point.y - dist,
		bottom: point.y + dist
	}
	return clientsNearByRect(area, clients)
}

/** restituisce tutti i client presenti in un determinato `rect` */
function clientsNearByRect(area: Rect, clients: WS.utils.IClient[], except?: WS.utils.IClient) {
	return clients.filter(client => {
		return contain(area, client["position"])
	})
}

/** restituisce true se un `point` ricade dentro un `rect` */
function contain(area: Rect, point: Point) {
	return point.x < area.right && point.x > area.left && point.y > area.top && point.y < area.bottom
}

/** restituisce un rect in base a punto e distanza */
function buildRectByPoint(point: Point, dist: number): Rect {
	return {
		right: point.x + dist,
		left: point.x - dist,
		top: point.y - dist,
		bottom: point.y + dist
	}
}


// export function distancePoints(p1, p2) {
// 	if (!p1.x || !p1.y || !p2.x || !p2.y) throw new Error("invalid parameter")
// 	const res = Math.sqrt(Math.pow(p1.x - p2.x, 2) + (Math.pow(p1.y - p2.y, 2)))
// 	if (isNaN(res)) throw new Error("invalid parameter")
// 	return res
// }

export {
	Rect,
	Point,
	MessageToClient,
	ACTIONS_FROM_CLIENT,
	ACTIONS_TO_CLIENT,
	clientsNearByClient,
	buildRectByPoint,
	WSCommands
}


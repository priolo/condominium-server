import { Bus, RepoRestActions, Typeorm, WS } from "typexpress"
import { point, rect } from "./utils"

const MARGIN:number = 5


export class wsCommands extends WS.route {

	onMessage(client: WS.IClient, message) {
		const commands = {
			position: this.setPosition.bind(this),
			message: this.receiveTextMessage.bind(this),
			near: this.getNearClients.bind(this),
			messages: this.getNearMessages.bind(this),
		}
		commands[message.action](client, message)
	}

	private setPosition(client: WS.IClient, message) {
		client["position"] = message.payload
	}

	private async receiveTextMessage(client: WS.IClient, message) {
		const text = message.payload
		const position: point = client["position"]
		const userId: number = client.jwtPayload.id

		// ricavo i client vicini
		const clients = clientsNearByClient(client, this.getClients(), MARGIN)

		// mando a loro il messaggio ricevuto
		clients.forEach(c => {
			this.sendToClient(c, {
				user: { name: c.jwtPayload.name, id: c.jwtPayload.id },
				text,
			})
		})

		// memorizzo il messaggio nel db
		const results = await new Bus(this, "/typeorm/messages").dispatch({
			type: RepoRestActions.SAVE,
			payload: {
				text,
				latitude: 0, longitude: 0,
				x: position.x, y: position.y,
				user: { id: userId }
			}
		})
	}

	private getNearClients(client: WS.IClient) {
		const clients = clientsNearByClient(client, this.getClients(), MARGIN)
		this.sendToClient(client, {
			clients
		})
	}

	private async getNearMessages(client: WS.IClient) {
		const point = client["position"]
		const area = buildRectByPoint(point, MARGIN)
		const results = await new Bus(this, "/typeorm/messages").dispatch({
			type: Typeorm.Actions.FIND,
			payload: {
				take: 10,
				where: {
					x: { type: "between", from: area.left, to: area.right },
					y: { type: "between", from: area.top, to: area.bottom },
				},
			}
		})
		this.sendToClient(client, results)
	}

}





// export function distancePoints(p1, p2) {
// 	if (!p1.x || !p1.y || !p2.x || !p2.y) throw new Error("invalid parameter")
// 	const res = Math.sqrt(Math.pow(p1.x - p2.x, 2) + (Math.pow(p1.y - p2.y, 2)))
// 	if (isNaN(res)) throw new Error("invalid parameter")
// 	return res
// }

/** restituisce tutti i client vicini  */
function clientsNearByClient(client: WS.IClient, clients: WS.IClient[], dist: number) {
	const point: point = client["position"]
	const area: rect = {
		left: point.x - dist,
		right: point.x + dist,
		top: point.y - dist,
		bottom: point.y + dist
	}
	return clientsNearByRect(area, clients)
}

/** restituisce tutti i client presenti in un determinato `rect` */
function clientsNearByRect(area: rect, clients: WS.IClient[], except?: WS.IClient) {
	return clients.filter(client => {
		return contain(area, client["position"])
	})
}

/** restituisce true se un `point` ricade dentro un `rect` */
function contain(area: rect, point: point) {
	return point.x < area.right && point.x > area.left && point.y > area.top && point.y < area.bottom
}

/** restituisce un rect in base a punto e distanza */
function buildRectByPoint(point: point, dist: number): rect {
	return {
		right: point.x + dist,
		left: point.x - dist,
		top: point.y - dist,
		bottom: point.y + dist
	}
}



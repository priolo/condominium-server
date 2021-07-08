import { Bus, RepoRestActions, Typeorm, WS } from "typexpress"
import { ACTIONS_FROM_CLIENT, ACTIONS_TO_CLIENT, buildRectByPoint, clientsNearByClient, Point, Rect } from "."

const MARGIN:number = 5



export class wsCommands extends WS.route {

	onMessage(client: WS.utils.IClient, message:WS.utils.IMessage) {
		const commands = {
			[ACTIONS_FROM_CLIENT.POSITION]: this.updatePosition.bind(this),
			[ACTIONS_FROM_CLIENT.MESSAGE]: this.textMessage.bind(this),
			[ACTIONS_FROM_CLIENT.NEAR]: this.getNearClients.bind(this),
			[ACTIONS_FROM_CLIENT.MESSAGES]: this.getNearMessages.bind(this),
		}
		commands[message.action]?.(client, message)
	}

	/** 
	 * REQUEST: aggiorna la posizione del client 
	 * */
	private updatePosition(client: WS.utils.IClient, message:WS.utils.IMessage) {
		client["position"] = message.payload
	}

	/** 
	 * REQUEST: ricevo un messaggio da un CLIENT
	 * invio il messaggio a tutti i CLIENT vicini
	*/
	private async textMessage(client: WS.utils.IClient, message:WS.utils.IMessage) {
		const text = message.payload
		const position: Point = client["position"]
		const user = {id: client.jwtPayload.id, name: client.jwtPayload.name}
		const msg = {
			text,
			latitude: 0, longitude: 0,
			x: position.x, y: position.y,
			user
		}
		
		// memorizzo il messaggio nel db
		const results = await new Bus(this, "/typeorm/messages").dispatch({
			type: RepoRestActions.SAVE,
			payload: msg
		})

		// ricavo i client vicini
		const clients = clientsNearByClient(client, this.getClients(), MARGIN)

		// mando a loro il messaggio ricevuto
		clients.forEach(clientDest => {
			this.sendToClient(
				clientDest, 
				{ 
					action: ACTIONS_TO_CLIENT.MESSAGE, 
					payload: {user, text} 
				}
			)
		})
	}

	/** 
	 * REQUEST: restituisco i CLIENTS vicini al DEST 
	 * */
	private getNearClients(clientDest: WS.utils.IClient) {
		const clients = clientsNearByClient(clientDest, this.getClients(), MARGIN)
		this.sendToClient(
			clientDest, 
			{ 
				action: ACTIONS_TO_CLIENT.CLIENTS_NEAR, 
				payload: clients 
			}
		)
	}

	/**
	 * REQUEST: restituisco i messaggi vicini al DEST
	 */
	private async getNearMessages(clientDest: WS.utils.IClient) {
		const point = clientDest["position"]
		const results = this.getNearMessagesFromPoint(point)
		this.sendToClient(
			clientDest, 
			{ 
				action: ACTIONS_TO_CLIENT.MESSAGES_NEAR, 
				payload: results
			}
		)
	}



	/**
	 * Preleva dal DB tutti i messaggi "near" al "point" passato come parametro
	 * @param point 
	 * @returns 
	 */
	private async getNearMessagesFromPoint( point:Point ): Promise<any[]> {
		const area = buildRectByPoint(point, MARGIN)
		const results:any[] = await new Bus(this, "/typeorm/messages").dispatch({
			type: Typeorm.Actions.FIND,
			payload: {
				take: 10,
				where: {
					x: { type: "between", from: area.left, to: area.right },
					y: { type: "between", from: area.top, to: area.bottom },
				},
			}
		})
		return results
	}
}




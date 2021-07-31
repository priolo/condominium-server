import {ajax} from "./ajax"


/** effettua il login come GUEST */
export async function reset() {
	await ajax.post(`/debug/reset`)
}

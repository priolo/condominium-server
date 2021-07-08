
import {ajax} from "./ajax"


/** effettua il login come GUEST */
export async function loginAsGuest() {
	let resp = await ajax.post(
		`/auth/login/guest`,
		{}
	)
	const { token } = resp.data
	return token
}

/** chiede info dell'utente attualmente loggato */
export async function getMyInfo(token) {
	const { data } = await ajax.get(`/user/me`,
		{ headers: { Authorization: `Bearer ${token}` } }
	)
	return data
}


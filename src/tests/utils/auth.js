
import {ajax} from "./ajax"



export async function loginAsGuest() {
	let resp = await ajax.post(
		`/auth/login/guest`,
		{}
	)
	const { token } = resp.data
	return token
}

export async function getMyInfo(token) {
	const { data } = await ajax.get(`/user/me`,
		{ headers: { Authorization: `Bearer ${token}` } }
	)
	return data
}


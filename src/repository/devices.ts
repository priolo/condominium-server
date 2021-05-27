import { Biblio } from "../global"
import { RepoStructActions } from "typexpress"

export enum DevicePlatform {
    UNKNOW = 0,
    ANDROID,
    IOS,
	WEB,
} 

const repo: any = {
	name: "devices",
	class: "typeorm/repo",
	model: {
		name: "devices",
		columns: {
			id: { type: Number, primary: true, generated: true },
			platform: { name: "platform", type: "smallint", default: DevicePlatform.UNKNOW },
			model: { name: "model", type: "varchar", nullable: true },
			pushToken: { name: "push_token", type: "varchar", nullable: true },
			//browserId: { name: "device_id", type: "varchar", nullable: true },			
			//lastIp: { name: "last_ip", type: "varchar", nullable: true },
		},
		relations: {
			user: {
				type: "many-to-one",
				target: "users",
				inverseSide: 'devices',
			},
		},
	}
}

export default repo
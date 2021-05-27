import { Biblio } from "../global"
import { RepoStructActions } from "typexpress"


export enum UserRole {
	GUEST = 0,
	UNACTIVE,
	DEFAULT,
	ADMIN
}


const repo: any = {
	name: "users",
	class: "typeorm/repo",
	model: {
		name: "users",
		// https://typeorm.io/#/separating-entity-definition
		columns: {
			id: { type: Number, primary: true, generated: true },
			email: { type: "varchar", default: "" },
			name: { type: "varchar", default: "" },
			password: { type: "varchar", default: "" },
			salt: { type: "varchar", default: "" },
			role: { type: "smallint", default: UserRole.GUEST },
		},
		// https://typeorm.delightful.studio/interfaces/_entity_schema_entityschemarelationoptions_.entityschemarelationoptions.html
		relations: {
			accounts: {
				type: "one-to-many",
				target: "accounts",
				cascade: true,
				inverseSide: 'users',
			},
			devices: {
				type: "one-to-many",
				target: "devices",
				cascade: true,
				inverseSide: 'users',
			}
		},
	},
	seeds: Biblio.inDebug() && [
		{ type: RepoStructActions.TRUNCATE },
		{
			email: "ivano@test.com",
			name: "Ivano",
			password: "111",
			accounts: [
				{ label: "cap 1" },
				{ label: "cap 2" },
				{ label: "cap 3" },
			]
		},
		{
			email: "marina@test.com",
			name: "Marina",
			password: "111",
			nodes: [
				{ label: "root" },
				{ label: "benessere" },
				{ label: "cap lavoro" },
			]
		},
		{
			email: "mattia@test.com",
			name: "Mattia",
			password: "111",
			nodes: [
				{ label: "sport" },
				{ label: "generale" },
			]
		},
	]
}

export default repo
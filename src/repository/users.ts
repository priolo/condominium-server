

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
				inverseSide: 'user',
			},
			devices: {
				type: "one-to-many",
				target: "devices",
				cascade: true,
				inverseSide: 'user',
			},
			messages: {
				type: "one-to-many",
				target: "messages",
				cascade: true,
				inverseSide: 'user',
			}
		},
	}
}

export default repo
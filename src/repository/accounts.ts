

export enum ProviderCode {
	Unknow = 0,
	Google,
	Facebook,
}

const repo: any = {
	name: "users",
	class: "typeorm/repo",
	model: {
		name: "accounts",
		columns: {
			id: { type: Number, primary: true, generated: true },
			providerCode: { name: "provider_code", type: "smallint", default: ProviderCode.Unknow },
			providerId: { name: "provider_id", type: "varchar", nullable: true },
			createdAt: {
				name: 'created_at',
				type: 'timestamp with time zone',
				createDate: true,
			},
			updatedAt: {
				name: 'updated_at',
				type: 'timestamp with time zone',
				updateDate: true,
			}
		},
		relations: {
			user: {
				type: "many-to-one",
				target: "users",
				inverseSide: 'accounts',
			},
		},
	}
}

export default repo
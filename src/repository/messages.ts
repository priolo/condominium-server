

export enum ProviderCode {
    Unknow = 0,
    Google,
    Facebook,
} 

const repo: any = {
	name: "messages",
	class: "typeorm/repo",
	model: {
		name: "messages",
		columns: {
			id: { type: Number, primary: true, generated: true },
			text: { type: String, nullable: true },
			latitude: { name: "latitude", type: "decimal", precision:8, scale:6, nullable: true },
			longitude: { name: "longitude", type: "decimal", precision:9, scale:6, nullable: true },
			x: { name: "x", type: "int", nullable: true },
			y: { name: "y", type: "int", nullable: true },
			createdAt: {
				name: 'created_at',
				type: 'datetime',
				createDate: true,
			},
			updatedAt: {
				name: 'updated_at',
				type: 'datetime',
				updateDate: true,
			}

		},
		relations: {
			user: {
				type: "many-to-one",
				target: "users",
				inverseSide: 'messages',
			},
		},
	}
}

export default repo


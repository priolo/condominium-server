
const repo: any = {
	name: "comments",
	class: "typeorm/repo",
	model: {
		name: "comments",
		columns: {
			id: { type: Number, primary: true, generated: true },
			text: { type: String, nullable: true },
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
				inverseSide: 'comments',
			},
			message: {
				type: "many-to-one",
				target: "messages",
				inverseSide: 'comments',
			},
		},
	}
}

export default repo


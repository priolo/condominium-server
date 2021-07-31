import { UserRole } from "../../repository/utils";



export default [
	{
		email: "ivano@test.com",
		name: "Ivano",
		password: "111",
		role: UserRole.GUEST,
		messages: [
			{ text: "row1", latitude: 9.5, longitude: 10.5, x: 1, y: 2 },
			{ text: "row2", latitude: 9.5, longitude: 10.5, x: 1, y: 2 },
			{ text: "row3", latitude: 9.5, longitude: 10.5, x: 1, y: 2 },
		],
	},
	{
		email: "marina@test.com",
		name: "Marina",
		password: "111",
	},
	{
		email: "mattia@test.com",
		name: "Mattia",
		password: "111",
	},
]
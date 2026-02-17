export type Role = {
	id: number
	name: string
	department_id: number
	reviewer_id: number
}

export type ApiCreateRole = {
	name: string
	department_id: number
	reviewer_id: number
}

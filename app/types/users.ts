export type CreateUser = {
	name: string
	email: string
	password: string
	department_id: number
	job_id: number
	status: Statuses
}

export type User = {
	id: number
	name: string
	email: string
	password?: string
	department_id: number
	department_name?: string
	job_id: number
	job_name?: string
	reviewer_name?: string
	status: Statuses
	created_at: Date
	updated_at: Date
}

export enum Statuses {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
	INVITED = 'invited',
}

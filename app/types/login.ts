export type LoginData = {
	email: string
	password: string
}

export type AuthUser = {
	id: number
	name: string
	email: string
	role: 'admin' | 'employee'
	department_id: number | null
	department_name: string | null
	job_id: number | null
	status: string
}

export type APILoginResponse = {
	access_token: string
	user: AuthUser
}

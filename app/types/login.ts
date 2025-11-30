export type LoginData = {
	email: string
	password: string
}

export type APILoginResponse = {
	success: boolean
	message: string
	access_token: string
}

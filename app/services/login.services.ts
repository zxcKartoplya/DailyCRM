import Service from './services'

class LoginService extends Service {
	async login() {
		return await this.post('/auth/login', {
			email: 'user@example.com',
			password: 'Secret123',
		})
	}

	async creatAdmin() {
		return await this.post('/admins', {
			email: 'user@example.com',
			full_name: 'Super Admin',
			password: 'Secret123',
		})
	}
}

export default LoginService

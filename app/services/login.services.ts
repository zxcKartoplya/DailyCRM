import type { LoginData } from '~/types/login'
import Service from './services'

class LoginService extends Service {
	async login(userInfo: LoginData) {
		return await this.post('/auth/login', userInfo)
	}

	async creatAdmin() {
		return await this.post('/admins', {
			email: 'user@example.com',
			full_name: 'Super Admin',
			password: 'Secret123',
		})
	}
}

const loginService = new LoginService()
export default loginService

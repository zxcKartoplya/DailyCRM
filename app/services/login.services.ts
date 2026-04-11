import type { APILoginResponse, LoginData } from '~/types/login'
import Service from './services'

class LoginService extends Service {
	async login(userInfo: LoginData) {
		const config = useRuntimeConfig()

		return (await this.post('login', userInfo, {
			baseURL: config.public.authApiBase,
		})) as APILoginResponse
	}

	async creatAdmin() {
		return await this.post('admins', {
			email: 'user@example.com',
			full_name: 'Super Admin',
			password: 'Secret123',
		})
	}
}

const loginService = new LoginService()
export default loginService

import type { APILoginResponse, LoginData } from '~/types/login'
import Service from './services'

class LoginService extends Service {
	async login(userInfo: LoginData) {
		const config = useRuntimeConfig()
		return (await this.post('auth/login', userInfo, {
			baseURL: config.public.authApiBase,
		})) as APILoginResponse
	}
}

const loginService = new LoginService()
export default loginService

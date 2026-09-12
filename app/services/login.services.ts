import type { APILoginResponse, LoginData } from '~/types/login'
import Service from './services'

class LoginService extends Service {
	async login(userInfo: LoginData) {
		return await this.post<APILoginResponse>('auth/login', userInfo)
	}
}

const loginService = new LoginService()
export default loginService

import Service from './services'

class LoginService extends Service {
	async login() {
		return await this.post('/auth/login', {})
	}
}

export default LoginService

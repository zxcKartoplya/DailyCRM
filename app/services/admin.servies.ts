import Service from './services'

class AdminService extends Service {
	async bootstrapAdmin(data: { name: string; email: string; password: string }) {
		const config = useRuntimeConfig()
		return this.post('auth/bootstrap-admin', data, {
			baseURL: config.public.authApiBase,
		})
	}
}

const adminService = new AdminService()
export default adminService

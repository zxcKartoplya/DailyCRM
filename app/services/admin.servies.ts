import Service from './services'

class AdminService extends Service {
	async bootstrapAdmin(data: { name: string; email: string; password: string }) {
		return this.post('auth/bootstrap-admin', data)
	}
}

const adminService = new AdminService()
export default adminService

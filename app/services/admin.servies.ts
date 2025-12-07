import Service from './services'

class AdminService extends Service {
	async fetchAdmins() {
		return this.get('admins')
	}
	async addAdmin() {
		return this.post('admins', {
			email: 'user@example.com',
			password: 'Secret123',
			full_name: 'admin',
		})
	}
}

const adminService = new AdminService()
export default adminService

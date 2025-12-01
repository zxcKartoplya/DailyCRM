import Service from './services'

class AdminService extends Service {
	async fetchAdmins() {
		return this.get('admins')
	}
}

const adminService = new AdminService()
export default adminService

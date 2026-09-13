import type { CreateUser, User, UserDetail } from '~/types/users'
import Service from './services'

class WorkersService extends Service {
	async fetchWorkers() {
		return (await this.get('admin/workers')) as User[]
	}
	async fetchWorker(id: string) {
		return (await this.get(`admin/workers/${id}`)) as UserDetail
	}
	async addWorker(user: CreateUser) {
		return await this.post('admin/workers', user)
	}
	async putWorker(id: string, data: Partial<CreateUser>) {
		return await this.put(`admin/workers/${id}`, data)
	}
	async deleteWorker(id: number) {
		return await this.delete(`admin/workers/${id}`)
	}
	async getAiFeedback(id: string) {
		return (await this.post(`admin/workers/${id}/ai-feedback`, {})) as {
			worker_id: number
			worker_name: string
			feedback: string
		}
	}
}

const workersService = new WorkersService()
export default workersService

import type { CreateUser, User } from '~/types/users'
import Service from './services'

class WorkersService extends Service {
	async fetchWorkers() {
		return (await this.get('workers')) as User[]
	}
	async fetchWorker(id: string) {
		return (await this.get(`workers/${id}`)) as User
	}
	async addWorker(user: CreateUser) {
		return await this.post('workers', user)
	}
	async putWorker(id: string, data: Partial<CreateUser>) {
		return await this.put(`workers/${id}`, data)
	}
	async deleteWorker(id: number) {
		return await this.delete(`workers/${id}`)
	}
	async getAiFeedback(id: string) {
		return (await this.post(`workers/${id}/ai-feedback`, {})) as {
			worker_id: number
			worker_name: string
			feedback: string
		}
	}
}

const workersService = new WorkersService()
export default workersService

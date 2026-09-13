import type { Assessment, WorkerAIFeedback } from '~/types/assessments'
import type { WorkerDailies } from '~/types/dailies'
import type { CreateUser, User, UserDetail, WorkerStatistics } from '~/types/users'
import Service from './services'

class WorkersService extends Service {
	async fetchWorkers() {
		return (await this.get('admin/workers')) as User[]
	}
	async fetchWorker(id: string) {
		return (await this.get(`admin/workers/${id}`)) as UserDetail
	}
	async fetchWorkerStatistics(id: string, dateFrom: string, dateTo: string) {
		return await this.get<WorkerStatistics>(
			`admin/workers/${id}/statistics?date_from=${dateFrom}&date_to=${dateTo}`
		)
	}
	async fetchWorkerDailies(id: string, dateFrom: string, dateTo: string) {
		return await this.get<WorkerDailies>(
			`admin/workers/${id}/dailies?date_from=${dateFrom}&date_to=${dateTo}`
		)
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
	async fetchWorkerAssessments(id: string, limit: number, offset: number) {
		return await this.get<Assessment[]>(
			`admin/workers/${id}/assessments?limit=${limit}&offset=${offset}`
		)
	}
	async getAiFeedback(id: string) {
		return await this.post<WorkerAIFeedback>(`admin/workers/${id}/ai-feedback`, {})
	}
}

const workersService = new WorkersService()
export default workersService

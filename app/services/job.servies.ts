import type { ApiResponse } from '~/types/api/api'
import type { Role } from '~/types/role'
import Service from './services'

class JobService extends Service {
	async fetchJobs() {
		return (await this.get('jobs')) as ApiResponse<Role>
	}
	async addJob(data: any) {
		return await this.post('jobs', data)
	}
	async delJob(id: number) {
		return await this.delete(`jobs/${id}`)
	}

	async fetchJob(id: string) {
		return await this.get(`jobs/${id}`)
	}

	// async putJob(id: string, data: ) {
	// 	return await this.put(`jobs/${id}`, data)
	// }
}

const jobService = new JobService()
export default jobService

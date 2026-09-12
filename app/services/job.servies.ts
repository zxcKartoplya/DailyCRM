import type { Role } from '~/types/role'
import Service from './services'

class JobService extends Service {
	async fetchJobs() {
		return (await this.get('admin/jobs')) as Role[]
	}
	async addJob(data: { name: string; description?: string; department_id: number; reviewer_id: number }) {
		return await this.post('admin/jobs', data)
	}
	async delJob(id: number) {
		return await this.delete(`admin/jobs/${id}`)
	}
	async fetchJob(id: string) {
		return (await this.get(`admin/jobs/${id}`)) as Role
	}
	async putJob(id: string, values: { name?: string; description?: string; department_id?: number; reviewer_id?: number }) {
		return await this.put(`admin/jobs/${id}`, values)
	}
}

const jobService = new JobService()
export default jobService

import jobService from '~/services/job.servies'
import type { Role } from '~/types/role'

export const useJobStore = defineStore('job', () => {
	const jobs = ref<Role[]>()
	const job = ref<Role>()

	const fetchJobs = async () => {
		jobs.value = await jobService.fetchJobs()
	}

	const addJob = async (data: any) => {
		const created = await jobService.addJob(data)
		if (!created) {
			throw new Error('Failed to add department')
		}
		return created
	}

	const delJob = async (id: number) => {
		await jobService.delJob(id)
		fetchJobs()
	}

	const fetchJob = async (id: string) => {
		job.value = await jobService.fetchJob(id)
	}

	// const putDepartament = async (id: string, data: any) => {
	// 	await  jobService.(id, data)
	// }

	return {
		fetchJobs,
		jobs,
		job,
		addJob,
		delJob,
		fetchJob,
	}
})

import jobService from '~/services/job.servies'
import type { Role } from '~/types/role'
import type { ApiResponse } from '~/types/api/api'
import { mapRolePublicData } from '~/utils/mappers/api/jobs'
import { mapArrayResponse } from '~/utils/mappers/api/mapBase'

export const useJobStore = defineStore('job', () => {
	const jobs = ref<Role[]>()

	const fetchJobs = async () => {
		let data = await jobService.fetchJobs()
		jobs.value = mapArrayResponse(data as Role[], mapRolePublicData)
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
		await jobService.fetchJob(id)
	}

	// const putDepartament = async (id: string, data: any) => {
	// 	await  jobService.(id, data)
	// }

	return {
		fetchJobs,
		jobs,
		addJob,
		delJob,
		fetchJob,
	}
})

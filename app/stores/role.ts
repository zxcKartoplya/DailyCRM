import { defineStore } from 'pinia'
import roleService from '~/services/role.servies'

export const useJobStore = defineStore('job', () => {
	const fetchJobs = async () => {
		await roleService.fetchJobs()
	}

	const addJob = async (data: any) => {
		const created = await roleService.addJob(data)
		if (!created) {
			throw new Error('Failed to add department')
		}
		return created
	}

	const delJob = async (id: number) => {
		await roleService.delJob(id)
		fetchJobs()
	}

	const fetchJob = async (id: string) => {
		await roleService.fetchJob(id)
	}

	// const putDepartament = async (id: string, data: any) => {
	// 	await roleService.(id, data)
	// }

	return {
		fetchJobs,
		addJob,
		delJob,
		fetchJob,
	}
})

import workersService from '~/services/workers.servies'
import type { CreateUser, User } from '~/types/users'

export const useWorkerStore = defineStore('workers', () => {
	const workers = ref<User[]>([])
	const worker = ref<User>()
	const isLoading = ref(true)

	const getWorkers = async () => {
		workers.value = await workersService.fetchWorkers()
	}

	const getWorker = async (id: string) => {
		isLoading.value = true
		worker.value = await workersService.fetchWorker(id)
		isLoading.value = false
	}

	const createWorker = async (data: CreateUser) => {
		const created = await workersService.addWorker(data)
		if (!created) throw new Error('Failed to add worker')
		return created
	}

	const updateWorker = async (id: string, data: Partial<CreateUser>) => {
		await workersService.putWorker(id, data)
	}

	const deleteWorker = async (id: number) => {
		await workersService.deleteWorker(id)
		getWorkers()
	}

	return {
		workers,
		worker,
		isLoading,
		getWorkers,
		getWorker,
		createWorker,
		updateWorker,
		deleteWorker,
	}
})

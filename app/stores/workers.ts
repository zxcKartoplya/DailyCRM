import workersService from '~/services/workers.servies'
import type { WorkerDailies } from '~/types/dailies'
import type { CreateUser, User, UserDetail, WorkerStatistics } from '~/types/users'
import { periodRange } from '~/utils/dailyStats'

const DEFAULT_WORKER_PERIOD_DAYS = 30

export const useWorkerStore = defineStore('workers', () => {
	const workers = ref<User[]>([])
	const worker = ref<UserDetail>()
	const isLoading = ref(true)
	const isWorkersLoading = ref(true)
	const hasWorkersError = ref(false)

	const workerPeriodDays = ref(DEFAULT_WORKER_PERIOD_DAYS)
	const workerRange = computed(() => periodRange(workerPeriodDays.value))

	const workerStatistics = ref<WorkerStatistics>()
	const isWorkerStatisticsLoading = ref(true)
	const hasWorkerStatisticsError = ref(false)

	const workerDailies = ref<WorkerDailies>()
	const isWorkerDailiesLoading = ref(true)
	const hasWorkerDailiesError = ref(false)

	let workerRequest = 0
	let statisticsRequest = 0
	let dailiesRequest = 0

	const getWorkers = async () => {
		isWorkersLoading.value = true
		hasWorkersError.value = false

		try {
			workers.value = await workersService.fetchWorkers()
		} catch {
			workers.value = []
			hasWorkersError.value = true
		} finally {
			isWorkersLoading.value = false
		}
	}

	const getWorker = async (id: string) => {
		const request = ++workerRequest

		isLoading.value = true

		try {
			const result = await workersService.fetchWorker(id)
			if (request === workerRequest) worker.value = result
		} finally {
			if (request === workerRequest) isLoading.value = false
		}
	}

	const fetchWorkerStatistics = async (id: string) => {
		const request = ++statisticsRequest
		const { from, to } = workerRange.value

		isWorkerStatisticsLoading.value = true
		hasWorkerStatisticsError.value = false

		try {
			const result = await workersService.fetchWorkerStatistics(id, from, to)
			if (request === statisticsRequest) workerStatistics.value = result
		} catch {
			if (request === statisticsRequest) {
				workerStatistics.value = undefined
				hasWorkerStatisticsError.value = true
			}
		} finally {
			if (request === statisticsRequest) isWorkerStatisticsLoading.value = false
		}
	}

	const fetchWorkerDailies = async (id: string) => {
		const request = ++dailiesRequest
		const { from, to } = workerRange.value

		isWorkerDailiesLoading.value = true
		hasWorkerDailiesError.value = false

		try {
			const result = await workersService.fetchWorkerDailies(id, from, to)
			if (request === dailiesRequest) workerDailies.value = result
		} catch {
			if (request === dailiesRequest) {
				workerDailies.value = undefined
				hasWorkerDailiesError.value = true
			}
		} finally {
			if (request === dailiesRequest) isWorkerDailiesLoading.value = false
		}
	}

	const fetchWorkerPeriod = async (id: string) => {
		await Promise.all([fetchWorkerStatistics(id), fetchWorkerDailies(id)])
	}

	const setWorkerPeriod = async (days: number, id: string) => {
		workerPeriodDays.value = days
		await fetchWorkerPeriod(id)
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
		isWorkersLoading,
		hasWorkersError,
		workerPeriodDays,
		workerRange,
		workerStatistics,
		isWorkerStatisticsLoading,
		hasWorkerStatisticsError,
		workerDailies,
		isWorkerDailiesLoading,
		hasWorkerDailiesError,
		getWorkers,
		getWorker,
		fetchWorkerStatistics,
		fetchWorkerDailies,
		fetchWorkerPeriod,
		setWorkerPeriod,
		createWorker,
		updateWorker,
		deleteWorker,
	}
})

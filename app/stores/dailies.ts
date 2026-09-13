import dailiesService from '~/services/dailies.servies'
import type { DepartmentDailies } from '~/types/dailies'
import { periodRange } from '~/utils/dailyStats'

export const useDailiesStore = defineStore('dailies', () => {
	const dailies = ref<DepartmentDailies>()
	const isLoading = ref(false)
	const hasDailiesError = ref(false)
	const periodDays = ref(7)

	const range = computed(() => periodRange(periodDays.value))

	let dailiesRequest = 0

	const fetchDepartmentDailies = async (departmentId: string) => {
		const request = ++dailiesRequest

		isLoading.value = true
		hasDailiesError.value = false

		try {
			const result = await dailiesService.fetchDepartmentDailies(
				departmentId,
				range.value.from,
				range.value.to
			)
			if (request === dailiesRequest) dailies.value = result
		} catch {
			if (request === dailiesRequest) {
				dailies.value = undefined
				hasDailiesError.value = true
			}
		} finally {
			if (request === dailiesRequest) isLoading.value = false
		}
	}

	const setPeriod = async (days: number, departmentId: string) => {
		periodDays.value = days
		await fetchDepartmentDailies(departmentId)
	}

	return {
		dailies,
		isLoading,
		hasDailiesError,
		periodDays,
		range,
		fetchDepartmentDailies,
		setPeriod,
	}
})

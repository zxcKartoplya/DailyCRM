import dailiesService from '~/services/dailies.servies'
import type { DailyEntry, DepartmentDailies } from '~/types/dailies'
import type { PeriodRange } from '~/utils/dailyStats'
import { periodRange } from '~/utils/dailyStats'

export const useDailiesStore = defineStore('dailies', () => {
	const dailies = ref<DepartmentDailies>()
	const isLoading = ref(false)
	const periodDays = ref(7)

	const entries = ref<DailyEntry[]>([])
	const entriesRange = ref<PeriodRange | null>(null)
	const isEntriesLoading = ref(true)
	const hasEntriesError = ref(false)

	const range = computed(() => periodRange(periodDays.value))

	const fetchDepartmentDailies = async (departmentId: string) => {
		isLoading.value = true
		try {
			dailies.value = await dailiesService.fetchDepartmentDailies(
				departmentId,
				range.value.from,
				range.value.to
			)
		} finally {
			isLoading.value = false
		}
	}

	const setPeriod = async (days: number, departmentId: string) => {
		periodDays.value = days
		await fetchDepartmentDailies(departmentId)
	}

	const fetchEntries = async (days: number) => {
		const nextRange = periodRange(days)

		isEntriesLoading.value = true
		hasEntriesError.value = false

		try {
			entries.value = await dailiesService.fetchEntries(nextRange.from, nextRange.to)
			entriesRange.value = nextRange
		} catch {
			entries.value = []
			entriesRange.value = null
			hasEntriesError.value = true
		} finally {
			isEntriesLoading.value = false
		}
	}

	return {
		dailies,
		isLoading,
		periodDays,
		range,
		fetchDepartmentDailies,
		setPeriod,
		entries,
		entriesRange,
		isEntriesLoading,
		hasEntriesError,
		fetchEntries,
	}
})

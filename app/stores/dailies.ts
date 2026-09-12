import dailiesService from '~/services/dailies.servies'
import type { DepartmentDailies } from '~/types/dailies'

const isoDate = (date: Date) => {
	const month = `${date.getMonth() + 1}`.padStart(2, '0')
	const day = `${date.getDate()}`.padStart(2, '0')
	return `${date.getFullYear()}-${month}-${day}`
}

export const useDailiesStore = defineStore('dailies', () => {
	const dailies = ref<DepartmentDailies>()
	const isLoading = ref(false)
	const periodDays = ref(7)

	const range = computed(() => {
		const to = new Date()
		const from = new Date()
		from.setDate(to.getDate() - (periodDays.value - 1))
		return { from: isoDate(from), to: isoDate(to) }
	})

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

	return {
		dailies,
		isLoading,
		periodDays,
		range,
		fetchDepartmentDailies,
		setPeriod,
	}
})

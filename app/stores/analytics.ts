import analyticsService from '~/services/analytics.servies'
import type { DepartmentAnalytics } from '~/types/analytics'

export const useAnalyticsStore = defineStore('analytics', () => {
	const departments = ref<DepartmentAnalytics[]>([])
	const isLoading = ref(true)
	const hasError = ref(false)

	const departmentsById = computed(
		() => new Map(departments.value.map(item => [item.department_id, item])),
	)

	const fetchDepartments = async () => {
		isLoading.value = true
		hasError.value = false

		try {
			departments.value = await analyticsService.fetchDepartments()
		} catch {
			departments.value = []
			hasError.value = true
		} finally {
			isLoading.value = false
		}
	}

	return {
		departments,
		departmentsById,
		isLoading,
		hasError,
		fetchDepartments,
	}
})

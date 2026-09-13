import analyticsService from '~/services/analytics.servies'
import type { AnalyticsOverview, DepartmentAnalytics } from '~/types/analytics'

export const useAnalyticsStore = defineStore('analytics', () => {
	const departments = ref<DepartmentAnalytics[]>([])
	const isLoading = ref(true)
	const hasError = ref(false)

	const overview = ref<AnalyticsOverview | null>(null)
	const isOverviewLoading = ref(true)
	const hasOverviewError = ref(false)

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

	const fetchOverview = async () => {
		isOverviewLoading.value = true
		hasOverviewError.value = false

		try {
			overview.value = await analyticsService.fetchOverview()
		} catch {
			overview.value = null
			hasOverviewError.value = true
		} finally {
			isOverviewLoading.value = false
		}
	}

	return {
		departments,
		departmentsById,
		isLoading,
		hasError,
		fetchDepartments,
		overview,
		isOverviewLoading,
		hasOverviewError,
		fetchOverview,
	}
})

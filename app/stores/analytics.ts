import analyticsService from '~/services/analytics.servies'
import type {
	AnalyticsOverview,
	AnalyticsTimeseriesPoint,
	DepartmentAnalytics,
} from '~/types/analytics'
import { periodRange } from '~/utils/dailyStats'

const createTimeseriesState = () => {
	const points = ref<AnalyticsTimeseriesPoint[]>([])
	const isLoading = ref(true)
	const hasError = ref(false)

	let lastRequest = 0

	const fetch = async (days: number, departmentId?: string) => {
		const request = ++lastRequest
		const { from, to } = periodRange(days)

		isLoading.value = true
		hasError.value = false

		try {
			const result = await analyticsService.fetchTimeseries(from, to, departmentId)
			if (request === lastRequest) points.value = result
		} catch {
			if (request === lastRequest) {
				points.value = []
				hasError.value = true
			}
		} finally {
			if (request === lastRequest) isLoading.value = false
		}
	}

	return { points, isLoading, hasError, fetch }
}

export const useAnalyticsStore = defineStore('analytics', () => {
	const departments = ref<DepartmentAnalytics[]>([])
	const isLoading = ref(true)
	const hasError = ref(false)

	const overview = ref<AnalyticsOverview | null>(null)
	const isOverviewLoading = ref(true)
	const hasOverviewError = ref(false)

	const teamTimeseries = createTimeseriesState()
	const departmentTimeseries = createTimeseriesState()

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

	const fetchTeamTrend = (days: number) => teamTimeseries.fetch(days)

	const fetchDepartmentTrend = (departmentId: string, days: number) =>
		departmentTimeseries.fetch(days, departmentId)

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
		teamTrend: teamTimeseries.points,
		isTeamTrendLoading: teamTimeseries.isLoading,
		hasTeamTrendError: teamTimeseries.hasError,
		fetchTeamTrend,
		departmentTrend: departmentTimeseries.points,
		isDepartmentTrendLoading: departmentTimeseries.isLoading,
		hasDepartmentTrendError: departmentTimeseries.hasError,
		fetchDepartmentTrend,
	}
})

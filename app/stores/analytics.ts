import analyticsService from '~/services/analytics.servies'
import type {
	AnalyticsOverview,
	AnalyticsTimeseriesPoint,
	DepartmentAnalytics,
	TodayState,
} from '~/types/analytics'
import { periodRange } from '~/utils/dailyStats'
import { todayStatesByUser } from '~/utils/todayState'

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

	const today = ref<TodayState[]>([])
	const isTodayLoading = ref(true)
	const hasTodayError = ref(false)

	let lastTodayRequest = 0

	const departmentsById = computed(
		() => new Map(departments.value.map(item => [item.department_id, item])),
	)

	const todayByUser = computed(() => todayStatesByUser(today.value))

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

	const fetchToday = async (departmentId?: string) => {
		const request = ++lastTodayRequest

		isTodayLoading.value = true
		hasTodayError.value = false

		try {
			const result = await analyticsService.fetchToday(departmentId)
			if (request === lastTodayRequest) today.value = result
		} catch {
			if (request === lastTodayRequest) {
				today.value = []
				hasTodayError.value = true
			}
		} finally {
			if (request === lastTodayRequest) isTodayLoading.value = false
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
		today,
		todayByUser,
		isTodayLoading,
		hasTodayError,
		fetchToday,
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

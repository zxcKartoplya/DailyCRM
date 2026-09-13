import type {
	AnalyticsOverview,
	AnalyticsTimeseriesPoint,
	DepartmentAnalytics,
	TodayState,
	WorkerCompletion,
} from '~/types/analytics'
import Service from './services'

class AnalyticsService extends Service {
	async fetchDepartments() {
		return await this.get<DepartmentAnalytics[]>('admin/analytics/departments')
	}
	async fetchOverview() {
		return await this.get<AnalyticsOverview>('admin/analytics/overview')
	}
	async fetchTimeseries(dateFrom: string, dateTo: string, departmentId?: string) {
		const department = departmentId ? `&department_id=${departmentId}` : ''

		return await this.get<AnalyticsTimeseriesPoint[]>(
			`admin/analytics/timeseries?date_from=${dateFrom}&date_to=${dateTo}${department}`
		)
	}
	async fetchToday(departmentId?: string) {
		const department = departmentId ? `?department_id=${departmentId}` : ''

		return await this.get<TodayState[]>(`admin/analytics/today${department}`)
	}
	async fetchWorkersCompletion(dateFrom: string, dateTo: string) {
		return await this.get<WorkerCompletion[]>(
			`admin/analytics/workers?date_from=${dateFrom}&date_to=${dateTo}`
		)
	}
}

const analyticsService = new AnalyticsService()
export default analyticsService

import type { AnalyticsOverview, DepartmentAnalytics } from '~/types/analytics'
import Service from './services'

class AnalyticsService extends Service {
	async fetchDepartments() {
		return await this.get<DepartmentAnalytics[]>('admin/analytics/departments')
	}
	async fetchOverview() {
		return await this.get<AnalyticsOverview>('admin/analytics/overview')
	}
}

const analyticsService = new AnalyticsService()
export default analyticsService

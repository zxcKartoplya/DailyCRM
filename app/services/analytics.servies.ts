import type { DepartmentAnalytics } from '~/types/analytics'
import Service from './services'

class AnalyticsService extends Service {
	async fetchDepartments() {
		return await this.get<DepartmentAnalytics[]>('admin/analytics/departments')
	}
}

const analyticsService = new AnalyticsService()
export default analyticsService

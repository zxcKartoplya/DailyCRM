import type { DailyEntry, DepartmentDailies } from '~/types/dailies'
import Service from './services'

class DailiesService extends Service {
	async fetchDepartmentDailies(departmentId: string, dateFrom: string, dateTo: string) {
		return await this.get<DepartmentDailies>(
			`admin/departments/${departmentId}/dailies?date_from=${dateFrom}&date_to=${dateTo}`
		)
	}
	async fetchEntries(dateFrom: string, dateTo: string) {
		return await this.get<DailyEntry[]>(
			`admin/reports?date_from=${dateFrom}&date_to=${dateTo}`
		)
	}
}

const dailiesService = new DailiesService()
export default dailiesService

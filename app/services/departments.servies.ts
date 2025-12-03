import Service from './services'

class DepartamentsService extends Service {
	async fetchDepartaments() {
		return this.get('departments')
	}
	async addDepartament(name: string) {
		return this.post('departments', { name: name })
	}
}

const departamentsService = new DepartamentsService()
export default departamentsService

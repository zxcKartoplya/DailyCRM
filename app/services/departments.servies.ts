import type {
	APIAddedDepartament,
	APIFetchDepartament,
	Departament,
} from '~/types/departaments'
import Service from './services'

class DepartamentsService extends Service {
	async fetchDepartaments() {
		return (await this.get('departments')) as APIFetchDepartament
	}
	async addDepartament(name: string) {
		return (await this.post('departments', {
			name: name,
		})) as APIAddedDepartament
	}
	async delDepartament(id: number) {
		return await this.delete(`departments/${id}`)
	}

	async fetchDepartament(id: string) {
		return (await this.get(`departments/${id}`)) as Departament
	}
}

const departamentsService = new DepartamentsService()
export default departamentsService

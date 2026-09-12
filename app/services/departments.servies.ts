import type {
	APIAddedDepartament,
	APIFetchDepartament,
	APIUpdateDepartament,
	Departament,
} from '~/types/departaments'
import Service from './services'

class DepartamentsService extends Service {
	async fetchDepartaments() {
		return (await this.get('admin/departments')) as APIFetchDepartament
	}
	async addDepartament(name: string) {
		return (await this.post('admin/departments', { name })) as APIAddedDepartament
	}
	async delDepartament(id: number) {
		return await this.delete(`admin/departments/${id}`)
	}
	async fetchDepartament(id: string) {
		return (await this.get(`admin/departments/${id}`)) as Departament
	}
	async putDepartament(id: string, data: APIUpdateDepartament) {
		return await this.put(`admin/departments/${id}`, data)
	}
}

const departamentsService = new DepartamentsService()
export default departamentsService

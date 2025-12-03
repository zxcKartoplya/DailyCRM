import type {
	APIAddedDepartament,
	APIFetchDepartament,
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
}

const departamentsService = new DepartamentsService()
export default departamentsService

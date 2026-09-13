import departamentsService from '~/services/departments.servies'
import type { APIUpdateDepartament, Departament } from '~/types/departaments'

export const useDepartamentsStore = defineStore('departaments', () => {
	const departaments = ref<Departament[]>()
	const departament = ref<Departament>()
	const isDepartamentsLoading = ref(true)
	const hasDepartamentsError = ref(false)

	const fetchDepartaments = async () => {
		isDepartamentsLoading.value = true
		hasDepartamentsError.value = false

		try {
			departaments.value = await departamentsService.fetchDepartaments()
		} catch {
			departaments.value = []
			hasDepartamentsError.value = true
		} finally {
			isDepartamentsLoading.value = false
		}
	}

	const addDepartament = async (name: string) => {
		const created = await departamentsService.addDepartament(name)
		if (!created) {
			throw new Error('Failed to add department')
		}
		return created
	}

	const delDepartament = async (id: number) => {
		await departamentsService.delDepartament(id)
		fetchDepartaments()
	}

	const fetchDepartament = async (id: string) => {
		departament.value = await departamentsService.fetchDepartament(id)
	}

	const putDepartament = async (id: string, data: APIUpdateDepartament) => {
		await departamentsService.putDepartament(id, data)
		await fetchDepartament(id)
	}

	return {
		departaments,
		isDepartamentsLoading,
		hasDepartamentsError,
		fetchDepartaments,
		addDepartament,
		delDepartament,
		fetchDepartament,
		departament,
		putDepartament,
	}
})

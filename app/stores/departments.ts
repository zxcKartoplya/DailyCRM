import { defineStore } from 'pinia'
import departamentsService from '~/services/departments.servies'
import type { Departament } from '~/types/departaments'

export const useDepartamentsStore = defineStore('departaments', () => {
	const departaments = ref<Departament[]>()

	const fetchDepartaments = async () => {
		departaments.value = await departamentsService.fetchDepartaments()
	}

	const addDepartament = async (name: string) => {
		const created = await departamentsService.addDepartament(name)
		if (!created) {
			throw new Error('Failed to add department')
		}
		return created
	}

	return { departaments, fetchDepartaments, addDepartament }
})

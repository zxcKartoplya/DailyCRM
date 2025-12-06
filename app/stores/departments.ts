import { defineStore } from 'pinia'
import departamentsService from '~/services/departments.servies'
import type { Departament } from '~/types/departaments'

export const useDepartamentsStore = defineStore('departaments', () => {
	const departaments = ref<Departament[]>()
	const departament = ref<Departament>()

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

	const delDepartament = async (id: number) => {
		await departamentsService.delDepartament(id)
		fetchDepartaments()
	}

	const fetchDepartament = async (id: string) => {
		departament.value = await departamentsService.fetchDepartament(id)
	}

	return {
		departaments,
		fetchDepartaments,
		addDepartament,
		delDepartament,
		fetchDepartament,
		departament,
	}
})

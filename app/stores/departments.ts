import { defineStore } from 'pinia'
import departamentsService from '~/services/departments.servies'

export const useDepartamentsStore = defineStore('departaments', () => {
	const departaments = ref([])

	const fetchDepartaments = async () => {
		departaments.value = await departamentsService.fetchDepartaments()
	}

	const addDepartament = async (name: string) => {
		await departamentsService.addDepartament(name)
	}

	return { departaments, fetchDepartaments, addDepartament }
})

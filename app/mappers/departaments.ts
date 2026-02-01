import type { Departament } from '~/types/departaments'

type DepartamentApi = {
	id: number
	admin_id: number
	name: string
	admin_name: string
	employees_count: number
	jobs_count: number
}

export const mapDepartamentFromApi = (dto: DepartamentApi): Departament => ({
	id: dto.id,
	admin_id: dto.admin_id,
	name: dto.name,
	admin_name: dto.admin_name,
	employees_count: dto.employees_count,
	jobs_count: dto.jobs_count,
})

export const mapDepartamentsFromApi = (
	list: DepartamentApi[] | null | undefined,
): Departament[] => (list ?? []).map(mapDepartamentFromApi)

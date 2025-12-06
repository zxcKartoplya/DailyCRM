export type Departament = {
	id: number
	admin_id: number
	name: string
	admin_name: string
	employees_count: number
}

export type APIAddedDepartament = Departament
export type APIFetchDepartament = Departament[]
export type APIUpdateDepartament = {
	name: string
}

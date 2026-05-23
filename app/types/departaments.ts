export type Departament = {
	id: number
	name: string
	employees_count?: number
	jobs_count?: number
}

export type APIAddedDepartament = Departament
export type APIFetchDepartament = Departament[]
export type APIUpdateDepartament = {
	name: string
}

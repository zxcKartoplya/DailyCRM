import type { Schemas } from '~/types/api'

export type Departament = Schemas['Department']

export type APIAddedDepartament = Departament
export type APIFetchDepartament = Departament[]
export type APIUpdateDepartament = Schemas['DepartmentUpdate']

import type { Schemas } from '~/types/api'

export type User = Schemas['Worker']
export type UserDetail = Schemas['WorkerDetail']
export type CreateUser = Schemas['WorkerCreate']

export enum Statuses {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
	INVITED = 'invited',
}

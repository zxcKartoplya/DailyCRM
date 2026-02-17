import type { AppRoute } from '~/const/routes'

export interface ActionResponse {
	success: boolean
	code: number
	message?: string
	error?: string
}

export interface Paginated<T> {
	items: T[]
	links: PaginationLinks
	meta: PaginationMeta
}

export interface PaginationLinks {
	first: string
	last: string
	next: string
	prev: string
}

export interface PaginationMeta {
	page: number
	perPage: number
	lastPage: number
	total: number
}

export type Media = {
	desktop: string | null
	mobile: string | null
	thumb: string | null
}

export type Breadcrumbs = Array<BreadcrumbItem | AppRoute>

export type BreadcrumbItem = {
	title: string
	to?: string
}

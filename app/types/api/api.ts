export interface ApiSimpleResponse {
	success: boolean
	message?: string
	error?: string
	errors?: Record<string, string>
}

export interface ApiResponse<T> extends ApiSimpleResponse {
	data?: T
}

export interface ApiPaginatedResponse<T> extends ApiSimpleResponse {
	data: T[]
	meta: ApiPaginationMeta
	links: ApiPaginationLinks
}

export interface ApiPaginationMeta {
	current_page: number
	per_page: number
	total: number
	last_page?: number
}

export interface ApiPaginationLinks {
	next: string | null
	prev: string | null
	first: string | null
	last: string | null
}

export enum ApiHttpCode {
	GOOD = 200,
	COMMON_ERROR = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	VALIDATION_ERROR = 422,
	SERVER_ERROR = 500,
}

export type ApiQueryType = string | number | boolean | null | undefined

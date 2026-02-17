import type { ApiPaginationLinks, ApiPaginationMeta } from '~/types/api'
import type { PaginationLinks, PaginationMeta } from '~/types/common'

const mapArrayResponse = <T, R>(data: T[], mapper: (item: T) => R): R[] => {
	return data.map(mapper)
}

const mapPaginationLinks = (dto: ApiPaginationLinks): PaginationLinks => {
	return {
		first: dto.first,
		last: dto.last,
		prev: dto.prev,
		next: dto.next,
	}
}

const mapPaginationMeta = (dto: ApiPaginationMeta): PaginationMeta => {
	return {
		page: dto.current_page,
		perPage: dto.per_page,
		total: dto.total,
		lastPage: dto.last_page ?? dto.current_page,
	}
}

export { mapArrayResponse, mapPaginationLinks, mapPaginationMeta }

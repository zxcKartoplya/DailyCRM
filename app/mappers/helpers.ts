export const mapArray = <T, R>(
	items: T[] | null | undefined,
	mapper: (item: T) => R,
): R[] => (items ?? []).map(mapper)

export const mapNullable = <T, R>(
	item: T | null | undefined,
	mapper: (item: T) => R,
): R | null => (item == null ? null : mapper(item))

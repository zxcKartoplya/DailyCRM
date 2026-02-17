type mapSelectData = {
	name: string
	id: string | number
}

export function mapForSelect(data: mapSelectData[] = []) {
	return data.length
		? data.map(item => ({ name: item.name, value: item.id }))
		: []
}

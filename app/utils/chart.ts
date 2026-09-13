import type { ApexOptions } from 'apexcharts'
import type { ChartColorToken } from '~/composables/useChartTheme'

export type ChartSeries = {
	name: string
	data: (number | null)[]
	color?: ChartColorToken
}

export type ChartHeatmapCell = {
	label: string
	value: number
}

export type ChartHeatmapRow = {
	name: string
	cells: ChartHeatmapCell[]
}

export type ChartHeatmapRange = {
	from: number
	to: number
	color: ChartColorToken
	label?: string
}

type PlainObject = Record<string, unknown>

const numberFormat = new Intl.NumberFormat('ru-RU', {
	maximumFractionDigits: 2,
})

const isPlainObject = (value: unknown): value is PlainObject =>
	typeof value === 'object' && value !== null && !Array.isArray(value)

const mergeObjects = (
	target: PlainObject,
	source: PlainObject,
): PlainObject => {
	const result: PlainObject = { ...target }

	for (const [key, value] of Object.entries(source)) {
		const current = result[key]
		result[key] =
			isPlainObject(value) && isPlainObject(current)
				? mergeObjects(current, value)
				: value
	}

	return result
}

export const mergeChartOptions = (...sources: ApexOptions[]): ApexOptions =>
	sources.reduce<PlainObject>(
		(result, source) => mergeObjects(result, source as PlainObject),
		{},
	) as ApexOptions

export const formatChartValue = (value: number, suffix = ''): string => {
	if (!Number.isFinite(value)) return ''

	return `${numberFormat.format(value)}${suffix}`
}

export const chartSeriesColor = (
	index: number,
	palette: ChartColorToken[],
): ChartColorToken => palette[index % palette.length] as ChartColorToken

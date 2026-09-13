import type { AnalyticsTimeseriesPoint } from '~/types/analytics'
import { formatRate, fromIsoDate } from '~/utils/dailyStats'

export type CompletionTimeseries = {
	categories: string[]
	values: (number | null)[]
	tooltips: string[]
	hasData: boolean
}

const dateLabelFormat = new Intl.DateTimeFormat('ru-RU', {
	day: 'numeric',
	month: 'short',
})

export const completionPercent = (rate?: number | null): number | null =>
	rate === null || rate === undefined ? null : Math.round(rate * 100)

export const completionTooltip = (point: AnalyticsTimeseriesPoint): string => {
	const rate = point.completion_rate ?? null

	if (rate === null) return 'нет рабочих дней по графику'

	return `${formatRate(rate)} — сдали ${point.submitted} из ${point.working_employees}`
}

export const completionTimeseries = (
	points: AnalyticsTimeseriesPoint[],
): CompletionTimeseries => {
	const values = points.map(point => completionPercent(point.completion_rate))

	return {
		categories: points.map(point => dateLabelFormat.format(fromIsoDate(point.date))),
		values,
		tooltips: points.map(completionTooltip),
		hasData: values.some(value => value !== null),
	}
}

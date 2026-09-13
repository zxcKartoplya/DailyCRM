import type { CompletionTrendPoint } from '~/types/analytics'
import { completionPercent } from '~/utils/completionTimeseries'
import { fromIsoDate } from '~/utils/dailyStats'

export type CompletionPoint = {
	label: string
	value: number | null
}

type CompletionSource = {
	working_days: number
	completion_rate?: number | null
}

const dayLabelFormat = new Intl.DateTimeFormat('ru-RU', {
	day: 'numeric',
	month: 'short',
})

const trendLabel = ({ date_from, date_to }: CompletionTrendPoint): string => {
	const start = dayLabelFormat.format(fromIsoDate(date_from))

	if (date_from === date_to) return start

	return `${start} — ${dayLabelFormat.format(fromIsoDate(date_to))}`
}

export const completionRate = (source?: CompletionSource | null): number | null => {
	if (!source || source.working_days === 0) return null

	return source.completion_rate ?? null
}

export const completionTrendPoints = (
	points?: CompletionTrendPoint[] | null,
): CompletionPoint[] =>
	(points ?? []).map(point => ({
		label: trendLabel(point),
		value: completionPercent(point.completion_rate),
	}))

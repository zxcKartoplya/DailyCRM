import type { UIStatItem } from '~/components/UI/StatRow.vue'
import { usePluralize } from '~/composables/usePluralize'
import type { ReviewerUsage } from '~/types/reviewers'
import { formatShortDate } from '~/utils/workerCard'

type UsageMonth = ReviewerUsage['by_month'][number]
type UsageScore = ReviewerUsage['avg_scores'][number]

export type ReviewerUsageBars = {
	categories: string[]
	data: number[]
}

const USAGE_MONTH = /^(\d{4})-(\d{2})$/

const usageMonthFormat = new Intl.DateTimeFormat('ru-RU', {
	month: 'short',
	year: 'numeric',
})

const parseUsageMonth = (month: string): Date | null => {
	const match = USAGE_MONTH.exec(month)
	if (!match) return null

	const monthIndex = Number(match[2]) - 1
	if (monthIndex < 0 || monthIndex > 11) return null

	return new Date(Number(match[1]), monthIndex, 1)
}

const usageMonthKey = (date: Date): string =>
	`${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}`

export const formatUsageMonth = (month: string): string => {
	const date = parseUsageMonth(month)
	if (!date) return month

	const parts = usageMonthFormat.formatToParts(date)
	const name = parts.find(part => part.type === 'month')?.value.replace('.', '') ?? ''
	const year = parts.find(part => part.type === 'year')?.value ?? ''

	return `${name} ${year}`.trim()
}

export const reviewerUsageByMonth = (byMonth: UsageMonth[]): ReviewerUsageBars => {
	const counts = new Map<string, number>()
	const dates: Date[] = []

	for (const entry of byMonth) {
		const date = parseUsageMonth(entry.month)
		if (!date) continue
		const key = usageMonthKey(date)
		counts.set(key, (counts.get(key) ?? 0) + entry.count)
		dates.push(date)
	}

	if (!dates.length) return { categories: [], data: [] }

	const first = new Date(Math.min(...dates.map(date => date.getTime())))
	const last = new Date(Math.max(...dates.map(date => date.getTime())))
	const categories: string[] = []
	const data: number[] = []

	for (
		const cursor = new Date(first);
		cursor.getTime() <= last.getTime();
		cursor.setMonth(cursor.getMonth() + 1)
	) {
		const key = usageMonthKey(cursor)
		categories.push(formatUsageMonth(key))
		data.push(counts.get(key) ?? 0)
	}

	return { categories, data }
}

export type ReviewerScoreBars = ReviewerUsageBars & {
	max: number | undefined
}

const scoreScaleMax = (scoreMax: number): number | undefined =>
	Number.isFinite(scoreMax) && scoreMax > 0 ? scoreMax : undefined

export const reviewerAvgScores = (
	avgScores: UsageScore[],
	scoreMax: ReviewerUsage['score_max'],
): ReviewerScoreBars => {
	const { pluralize } = usePluralize()

	return {
		categories: avgScores.map(score =>
			`${score.display_name} · ${score.samples} ${pluralize(score.samples, ['оценка', 'оценки', 'оценок'])}`,
		),
		data: avgScores.map(score => score.avg_score),
		max: scoreScaleMax(scoreMax),
	}
}

export const reviewerUsageStatItems = (usage: ReviewerUsage): UIStatItem[] => [
	{ key: 'total', label: 'Оценок всего', value: usage.assessments_count },
	{ key: 'last-30-days', label: 'За 30 дней', value: usage.assessments_last_30_days },
	{
		key: 'last',
		label: 'Последняя оценка',
		value: usage.last_assessment_at
			? formatShortDate(usage.last_assessment_at)
			: 'ещё не было',
	},
	{ key: 'workers', label: 'Сотрудников оценено', value: usage.workers_evaluated },
]

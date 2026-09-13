import type { AssessmentMetric, WorkerAssessment } from '~/types/assessments'
import { formatDateTime, formatShortDate } from '~/utils/workerCard'

export type ScoredAssessmentMetric = AssessmentMetric & { score: number }

const EXCERPT_LENGTH = 180

const scoreFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 })

export const assessmentKey = (assessment: WorkerAssessment): string =>
	assessment.id != null
		? `assessment-${assessment.id}`
		: `assessment-new-${assessment.created_at ?? assessment.worker_id}`

export const assessmentExcerpt = (
	text: string,
	maxLength: number = EXCERPT_LENGTH,
): string => {
	const flat = text.replace(/\s+/g, ' ').trim()

	if (flat.length <= maxLength) return flat

	const cut = flat.slice(0, maxLength)
	const lastSpace = cut.lastIndexOf(' ')
	const trimmed = lastSpace > maxLength / 2 ? cut.slice(0, lastSpace) : cut

	return `${trimmed.replace(/[\s.,;:—-]+$/, '')}…`
}

export const assessmentPeriodLabel = (
	from?: string | null,
	to?: string | null,
): string | null => {
	const start = from ? formatShortDate(from) : ''
	const end = to ? formatShortDate(to) : ''

	if (start && end) return start === end ? `за ${start}` : `за ${start} — ${end}`
	if (start) return `с ${start}`
	if (end) return `по ${end}`

	return null
}

const createdTime = (value?: string | null): number => {
	const time = value ? new Date(value).getTime() : Number.NaN

	return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time
}

const compareNewestFirst = (left: WorkerAssessment, right: WorkerAssessment): number => {
	const leftTime = createdTime(left.created_at)
	const rightTime = createdTime(right.created_at)

	if (leftTime !== rightTime) return rightTime > leftTime ? 1 : -1

	return (right.id ?? 0) - (left.id ?? 0)
}

export const sortAssessments = <T extends WorkerAssessment>(assessments: T[]): T[] =>
	[...assessments].sort(compareNewestFirst)

export const mergeAssessments = (
	current: WorkerAssessment[],
	incoming: WorkerAssessment[],
): WorkerAssessment[] => {
	const byKey = new Map(current.map(item => [assessmentKey(item), item]))

	incoming.forEach(item => byKey.set(assessmentKey(item), item))

	return sortAssessments([...byKey.values()])
}

export const scoredMetrics = (
	metrics: AssessmentMetric[] = [],
): ScoredAssessmentMetric[] =>
	metrics.filter((metric): metric is ScoredAssessmentMetric => metric.score != null)

export const formatAssessmentScore = (score: number): string => scoreFormat.format(score)

export type WorkerAssessmentCard = {
	key: string
	date: string | null
	reviewerName: string | null
	period: string | null
	excerpt: string
	feedback: string
	metrics: ScoredAssessmentMetric[]
}

export const workerAssessmentCards = (
	assessments: WorkerAssessment[],
): WorkerAssessmentCard[] =>
	assessments.map(assessment => ({
		key: assessmentKey(assessment),
		date: assessment.created_at ? formatDateTime(assessment.created_at) || null : null,
		reviewerName: assessment.reviewer_name?.trim() || null,
		period: assessmentPeriodLabel(assessment.period_from, assessment.period_to),
		excerpt: assessmentExcerpt(assessment.feedback),
		feedback: assessment.feedback,
		metrics: scoredMetrics(assessment.metrics_snapshot),
	}))

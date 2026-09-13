import type { Schemas } from '~/types/api'

export type Assessment = Schemas['Assessment']
export type AssessmentMetric = Schemas['AssessmentMetric']
export type WorkerAIFeedback = Schemas['WorkerAIFeedback']

export type WorkerAssessment = Assessment | WorkerAIFeedback

export type WorkerAssessments = {
	worker_id: number
	items: WorkerAssessment[]
	hasMore: boolean
}

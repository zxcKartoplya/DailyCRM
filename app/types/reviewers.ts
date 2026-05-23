import type { Job } from './job'

export type Reviewer = {
	id: number
	name: string
	description: string
	metrics: Metric[]
	jobs?: Job[]
}

export type APIFetchReviewers = Reviewer[]
export type APIFetchReviewer = Reviewer
export type APICreatedReviewer = Reviewer

export type APIReviewerPayload = {
	name: string
	description: string
	metrics?: Metric[]
}

export type Metric = {
	value: number
	json_name: string
	display_name: string
	description: string
}

export type AIReviewerResponse = {
	name: string
	summary: string
	what_is_evaluated: string[]
	metrics: Metric[]
}

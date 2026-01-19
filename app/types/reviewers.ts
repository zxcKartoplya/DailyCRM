export type Reviewer = {
	id: number
	name: string
	description: string
}

export type APIFetchReviewers = Reviewer[]
export type APIFetchReviewer = Reviewer
export type APICreatedReviewer = Reviewer

export type APIReviewerPayload = {
	name: string
	description: string
}

export type Metric = {
	value: number
	json_name: string
	display_name: string
	description: string
}

export type Gigachatresponce = {
	name: string
	summary: string
	what_is_eveluated: [string]
	metrics: [Metric]
}

export type APIReviewerDescription = {
	gigachat_response: Gigachatresponce
}

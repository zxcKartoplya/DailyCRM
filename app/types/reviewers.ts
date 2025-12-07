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

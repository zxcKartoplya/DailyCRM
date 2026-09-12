import type { Schemas } from '~/types/api'

export type Reviewer = Schemas['ReviewerWithJobs']
export type Metric = Schemas['Metric']

export type APIFetchReviewers = Reviewer[]
export type APIFetchReviewer = Reviewer
export type APICreatedReviewer = Schemas['Reviewer']
export type APIReviewerPayload = Schemas['ReviewerCreate']

export type AIReviewerResponse = Schemas['ReviewerDescriptionResponse']

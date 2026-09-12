import type {
	AIReviewerResponse,
	APICreatedReviewer,
	APIFetchReviewer,
	APIFetchReviewers,
	APIReviewerPayload,
} from '~/types/reviewers'
import Service from './services'

class ReviewersService extends Service {
	async fetchReviewers() {
		return (await this.get('admin/reviewers')) as APIFetchReviewers
	}
	async addReviewer(data: APIReviewerPayload) {
		return (await this.post('admin/reviewers', data)) as APICreatedReviewer
	}
	async delReviewer(id: number) {
		return await this.delete(`admin/reviewers/${id}`)
	}
	async fetchReviewer(id: string) {
		return (await this.get(`admin/reviewers/${id}`)) as APIFetchReviewer
	}
	async putReviewer(id: string, data: APIReviewerPayload) {
		return await this.put(`admin/reviewers/${id}`, data)
	}
	async fetchDescription(name: string, description: string) {
		return (await this.post('admin/reviewers/description', { name, description })) as AIReviewerResponse
	}
}

const reviewersService = new ReviewersService()
export default reviewersService

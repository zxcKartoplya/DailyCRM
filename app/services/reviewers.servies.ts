import Service from './services'
import type {
	APICreatedReviewer,
	APIFetchReviewer,
	APIFetchReviewers,
	APIReviewerPayload,
} from '~/types/reviewers'

class ReviewersService extends Service {
	async fetchReviewers() {
		return (await this.get('reviewers')) as APIFetchReviewers
	}

	async addReviewer(data: APIReviewerPayload) {
		return (await this.post('reviewers', data)) as APICreatedReviewer
	}

	async delReviewer(id: number) {
		return await this.delete(`reviewers/${id}`)
	}

	async fetchReviewer(id: string) {
		return (await this.get(`reviewers/${id}`)) as APIFetchReviewer
	}

	async putReviewer(id: string, data: APIReviewerPayload) {
		return await this.put(`reviewers/${id}`, data)
	}
}

const reviewersService = new ReviewersService()
export default reviewersService

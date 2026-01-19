import type {
	APICreatedReviewer,
	APIFetchReviewer,
	APIFetchReviewers,
	APIReviewerDescription,
	APIReviewerPayload,
} from '~/types/reviewers'
import Service from './services'

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

	async fetchDescription(name: string, description: string) {
		return (await this.post('reviewers/description', {
			name: name,
			description: description,
		})) as APIReviewerDescription
	}
}

const reviewersService = new ReviewersService()
export default reviewersService

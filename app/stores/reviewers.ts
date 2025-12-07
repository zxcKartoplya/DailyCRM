import { defineStore } from 'pinia'
import reviewersService from '~/services/reviewers.servies'
import type { APIReviewerPayload, Reviewer } from '~/types/reviewers'

export const useReviewersStore = defineStore('reviewers', () => {
	const reviewers = ref<Reviewer[]>()
	const reviewer = ref<Reviewer>()

	const fetchReviewers = async () => {
		reviewers.value = await reviewersService.fetchReviewers()
	}

	const addReviewer = async (data: APIReviewerPayload) => {
		const created = await reviewersService.addReviewer(data)
		if (!created) {
			throw new Error('Failed to add reviewer')
		}
		return created
	}

	const delReviewer = async (id: number) => {
		await reviewersService.delReviewer(id)
		fetchReviewers()
	}

	const fetchReviewer = async (id: string) => {
		reviewer.value = await reviewersService.fetchReviewer(id)
	}

	const putReviewer = async (id: string, data: APIReviewerPayload) => {
		await reviewersService.putReviewer(id, data)
	}

	return {
		reviewers,
		reviewer,
		fetchReviewers,
		addReviewer,
		delReviewer,
		fetchReviewer,
		putReviewer,
	}
})

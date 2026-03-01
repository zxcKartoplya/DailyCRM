import reviewersService from '~/services/reviewers.servies'
import type { APIReviewerPayload, Reviewer } from '~/types/reviewers'

export const useReviewersStore = defineStore('reviewers', () => {
	const reviewers = ref<Reviewer[]>()
	const reviewer = ref<Reviewer>()
	const isLoading = ref(false)

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
		isLoading.value = true
		reviewer.value = await reviewersService.fetchReviewer(id)
		isLoading.value = false
	}

	const putReviewer = async (id: string, data: APIReviewerPayload) => {
		await reviewersService.putReviewer(id, data)
	}

	const fetchDescription = async (name: string, description: string) => {
		isLoading.value = true
		const responce = await reviewersService.fetchDescription(name, description)
		isLoading.value = false
		return responce.gigachat_response.metrics
	}

	return {
		reviewers,
		isLoading,
		fetchDescription,
		reviewer,
		fetchReviewers,
		addReviewer,
		delReviewer,
		fetchReviewer,
		putReviewer,
	}
})

import reviewersService from '~/services/reviewers.servies'
import type { APIReviewerPayload, Reviewer, ReviewerUsage } from '~/types/reviewers'

export const useReviewersStore = defineStore('reviewers', () => {
	const reviewers = ref<Reviewer[]>()
	const reviewer = ref<Reviewer>()
	const isLoading = ref(false)
	const usage = ref<ReviewerUsage>()
	const isUsageLoading = ref(true)
	const hasUsageError = ref(false)
	let usageRequest = 0

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
		reviewer.value = undefined
		try {
			reviewer.value = await reviewersService.fetchReviewer(id)
		} finally {
			isLoading.value = false
		}
	}

	const fetchReviewerUsage = async (id: string) => {
		const request = ++usageRequest
		isUsageLoading.value = true
		hasUsageError.value = false
		usage.value = undefined
		try {
			const result = await reviewersService.fetchReviewerUsage(id)
			if (request === usageRequest) usage.value = result
		} catch {
			if (request === usageRequest) hasUsageError.value = true
		} finally {
			if (request === usageRequest) isUsageLoading.value = false
		}
	}

	const putReviewer = async (id: string, data: APIReviewerPayload) => {
		await reviewersService.putReviewer(id, data)
	}

	const fetchDescription = async (name: string, description: string) => {
		isLoading.value = true
		const response = await reviewersService.fetchDescription(name, description)
		isLoading.value = false
		return response.gigachat_response.metrics
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
		usage,
		isUsageLoading,
		hasUsageError,
		fetchReviewerUsage,
	}
})

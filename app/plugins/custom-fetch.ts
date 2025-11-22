export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig()
	const apiBase = config.public.apiBase || process.env.API_URL || ''

	if (!apiBase && process.dev) {
		console.warn('[customFetch] Missing API base URL. Check .env API_URL')
	}

	const customFetch = $fetch.create({
		baseURL: apiBase,
	})

	return {
		provide: {
			customFetch,
		},
	}
})

import { parseApiError } from '~/utils/apiError'

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig()
	const nuxtApp = useNuxtApp()
	const token = useCookie<string | null>('access_token')
	const route = useRoute()

	const redirectToLogin = async () => {
		if (route.path === '/login' || route.path === '/register') {
			return
		}

		await nuxtApp.runWithContext(() => navigateTo('/login'))
	}

	const $customFetch = $fetch.create({
		baseURL: `${config.public.apiBase.replace(/\/$/, '')}/api`,

		onRequest({ options }) {
			options.headers = new Headers(options.headers || {})
			options.headers.set('Accept', 'application/json')
			if (token.value) {
				options.headers.set('Authorization', `Bearer ${token.value}`)
			}
		},

		async onResponseError({ request, response }) {
			if (response.status === 401) {
				await redirectToLogin()
			}

			throw parseApiError(response.status, String(request), response._data)
		},
	})
	return {
		provide: {
			customFetch: $customFetch,
		},
	}
})

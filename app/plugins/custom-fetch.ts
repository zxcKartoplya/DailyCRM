export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig()
	const nuxtApp = useNuxtApp()
	const token = useCookie<string | null>('access_token')
	const route = useRoute()

	const redirectToLogin = async () => {
		if (route.path === '/login' || route.path === '/register') {
			return
		}

		// token.value = null
		await nuxtApp.runWithContext(() => navigateTo('/login'))
	}

	const $customFetch = $fetch.create({
		baseURL: config.public.apiBase,
		ignoreResponseError: true,

		onRequest({ options }) {
			options.headers = new Headers(options.headers || {})
			options.headers.set('Accept', 'application/json')
			options.headers.set('withCredentials', 'true')
			options.headers.set('credentials', 'omit')
			if (token.value) {
				options.headers.set('Authorization', `Bearer ${token.value}`)
			}
		},

		async onResponse({ response }) {
			if (response.status >= 400) {
				await redirectToLogin()
			}
		},

		async onRequestError() {
			await redirectToLogin()
		},
	})
	return {
		provide: {
			customFetch: $customFetch,
		},
	}
})

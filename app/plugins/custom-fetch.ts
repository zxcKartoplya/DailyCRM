export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig()
	const token = useCookie('access_token')
	const route = useRoute()

	const $customFetch = $fetch.create({
		baseURL: config.public.apiBase,

		onRequest({ options }) {
			options.headers = new Headers(options.headers || {})
			options.headers.set('Accept', 'application/json')
			options.headers.set('withCredentials', 'true')
			options.headers.set('credentials', 'omit')
			if (token.value) {
				options.headers.set('Authorization', `Bearer ${token.value}`)
			}
		},

		onResponse() {
			// response._data = new myBusinessResponse(response._data)
		},

		onResponseError({ response }) {
			// if (response.status === 301) {
			// 	const newURL = response.body.url_redirect
			// 	return navigateTo(newURL)
			// }
			if (
				response.status === 401 &&
				route.path !== '/login' &&
				route.path !== '/register'
			) {
				token.value = null
				// return navigateTo('/login')
			}

			// Прокидываем ошибку дальше, чтобы сработали try/catch в вызовах
			const message =
				(response._data as any)?.message ||
				`Request failed with status ${response.status}`
			throw new Error(message)
		},
	})
	return {
		provide: {
			customFetch: $customFetch,
		},
	}
})

import { useAuthToken } from '~/composables/useAuthToken'
import { parseApiError } from '~/utils/apiError'
import { isLoginPath, loginRedirectLocation } from '~/utils/authRedirect'

const bearer = (token: string | null) => (token ? `Bearer ${token}` : null)

const neverSettle = () => new Promise<never>(() => {})

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig()
	const nuxtApp = useNuxtApp()
	const router = useRouter()
	const { getToken, clearToken } = useAuthToken()

	let loginRedirect: Promise<void> | null = null

	const isLoginFormRequest = (authorization: string | null) =>
		!authorization && isLoginPath(router.currentRoute.value.path)

	const redirectToLogin = async () => {
		clearToken()
		await nextTick()

		const { path, fullPath } = router.currentRoute.value
		if (isLoginPath(path)) return

		await nuxtApp.runWithContext(() =>
			navigateTo(loginRedirectLocation(fullPath), { replace: true }),
		)
	}

	const endSession = async (authorization: string | null) => {
		if (authorization !== bearer(getToken())) return

		loginRedirect ??= redirectToLogin().finally(() => {
			loginRedirect = null
		})
		await loginRedirect
	}

	const $customFetch = $fetch.create({
		baseURL: `${config.public.apiBase.replace(/\/$/, '')}/api`,

		onRequest({ options }) {
			options.headers = new Headers(options.headers || {})
			options.headers.set('Accept', 'application/json')
			const authorization = bearer(getToken())
			if (authorization) {
				options.headers.set('Authorization', authorization)
			}
		},

		async onResponseError({ request, response, options }) {
			const authorization = options.headers.get('Authorization')

			if (response.status === 401 && !isLoginFormRequest(authorization)) {
				await endSession(authorization)
				if (import.meta.client) await neverSettle()
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

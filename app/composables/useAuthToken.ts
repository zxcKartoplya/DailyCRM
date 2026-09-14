const createTokenCookie = () =>
	useCookie<string | null>('access_token', {
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
	})

let clientToken: ReturnType<typeof createTokenCookie> | undefined

export const useAuthToken = () => {
	const token = import.meta.server
		? createTokenCookie()
		: (clientToken ??= createTokenCookie())

	const setToken = (newToken: string | null) => {
		token.value = newToken
	}

	const clearToken = () => {
		token.value = null
	}

	const getToken = (): string | null => {
		return token.value
	}

	const isAuthenticated = computed(() => {
		return !!token.value
	})

	return {
		setToken,
		clearToken,
		getToken,
		isAuthenticated,
	}
}

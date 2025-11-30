export const useAuthToken = () => {
	const token = useCookie<string | null>('access_token', {
		expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
	})

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

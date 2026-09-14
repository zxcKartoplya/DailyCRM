import { useAuthToken } from '~/composables/useAuthToken'
import { isLoginPath, loginRedirectLocation, safeRedirect } from '~/utils/authRedirect'

export default defineNuxtRouteMiddleware(to => {
	const { getToken } = useAuthToken()
	const hasToken = Boolean(getToken())
	const isLoginPage = isLoginPath(to.path)

	if (!hasToken && !isLoginPage) {
		return navigateTo(loginRedirectLocation(to.fullPath), { replace: true })
	}

	if (hasToken && isLoginPage) {
		return navigateTo(safeRedirect(to.query.redirect), { replace: true })
	}
})

const LOGIN_PATH = '/login'
const HOME_PATH = '/'
const UNSAFE_REDIRECT_CHARACTERS = /[\\\s\x00-\x1f\x7f]/

export const isLoginPath = (target: string) => {
	const [path = ''] = target.split(/[?#]/)
	return path.replace(/\/+$/, '').toLowerCase() === LOGIN_PATH
}

export const safeRedirect = (target: unknown) => {
	if (typeof target !== 'string') return HOME_PATH

	const isInternalPath = target.startsWith('/') && !target.startsWith('//')
	if (!isInternalPath || UNSAFE_REDIRECT_CHARACTERS.test(target) || isLoginPath(target)) {
		return HOME_PATH
	}

	return target
}

export const loginRedirectLocation = (fullPath: string) => ({
	path: LOGIN_PATH,
	query: { redirect: fullPath },
})

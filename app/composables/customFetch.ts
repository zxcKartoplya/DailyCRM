export function customFetch(url: string, options: RequestInit = {}) {
	const { $customFetch } = useNuxtApp()
	return $customFetch(url, {
		...options,
	})
}

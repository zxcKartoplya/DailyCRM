import type { NitroFetchOptions } from 'nitropack'

export function customFetch(url: string, options: NitroFetchOptions<string> = {}) {
	const { $customFetch } = useNuxtApp()
	return $customFetch(url, options)
}

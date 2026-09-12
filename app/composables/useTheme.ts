export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'dailycrm-theme'

const resolve = (theme: Theme): 'light' | 'dark' => {
	if (theme !== 'system') return theme
	if (!import.meta.client) return 'light'
	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light'
}

export const useTheme = () => {
	const theme = useState<Theme>('theme', () => 'system')

	const apply = () => {
		document.documentElement.dataset.theme = resolve(theme.value)
	}

	onMounted(() => {
		const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
		if (stored === 'light' || stored === 'dark' || stored === 'system') {
			theme.value = stored
		}
		apply()

		const media = window.matchMedia('(prefers-color-scheme: dark)')
		const onChange = () => theme.value === 'system' && apply()
		media.addEventListener('change', onChange)
		onUnmounted(() => media.removeEventListener('change', onChange))
	})

	const set = (next: Theme) => {
		theme.value = next
		localStorage.setItem(STORAGE_KEY, next)
		apply()
	}

	const toggle = () => set(resolve(theme.value) === 'dark' ? 'light' : 'dark')

	const isDark = computed(() => resolve(theme.value) === 'dark')

	return { theme, isDark, set, toggle }
}

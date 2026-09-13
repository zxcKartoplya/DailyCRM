import type { ApexOptions } from 'apexcharts'

export type ChartColorToken =
	| 'accent'
	| 'accentWeak'
	| 'ok'
	| 'okWeak'
	| 'warn'
	| 'warnWeak'
	| 'err'
	| 'errWeak'
	| 'neutral'
	| 'neutralWeak'
	| 'muted'

export type ChartTheme = {
	mode: 'light' | 'dark'
	colors: Record<ChartColorToken, string>
	text: string
	textSecondary: string
	textMuted: string
	textOnAccent: string
	border: string
	borderStrong: string
	surface: string
	fontFamily: string
	fontMono: string
	fontSize: string
	fontSizeSmall: string
	radius: number
}

const COLOR_VARS: Record<ChartColorToken, string> = {
	accent: '--accent',
	accentWeak: '--accent-weak',
	ok: '--ok',
	okWeak: '--ok-weak',
	warn: '--warn',
	warnWeak: '--warn-weak',
	err: '--err',
	errWeak: '--err-weak',
	neutral: '--border-strong',
	neutralWeak: '--surface-sunken',
	muted: '--text-3',
}

const EMPTY_COLORS = Object.fromEntries(
	Object.keys(COLOR_VARS).map(token => [token, '']),
) as Record<ChartColorToken, string>

const EMPTY_THEME: ChartTheme = {
	mode: 'light',
	colors: EMPTY_COLORS,
	text: '',
	textSecondary: '',
	textMuted: '',
	textOnAccent: '',
	border: '',
	borderStrong: '',
	surface: '',
	fontFamily: '',
	fontMono: '',
	fontSize: '',
	fontSizeSmall: '',
	radius: 0,
}

const resolvedMode = (): 'light' | 'dark' =>
	document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'

const readChartTheme = (): ChartTheme => {
	const styles = getComputedStyle(document.documentElement)
	const value = (name: string) => styles.getPropertyValue(name).trim()

	const colors = Object.fromEntries(
		Object.entries(COLOR_VARS).map(([token, name]) => [token, value(name)]),
	) as Record<ChartColorToken, string>

	return {
		mode: resolvedMode(),
		colors,
		text: value('--text-1'),
		textSecondary: value('--text-2'),
		textMuted: value('--text-3'),
		textOnAccent: value('--text-on-accent'),
		border: value('--border'),
		borderStrong: value('--border-strong'),
		surface: value('--surface'),
		fontFamily: value('--font-ui'),
		fontMono: value('--font-mono'),
		fontSize: value('--t-sm'),
		fontSizeSmall: value('--t-xs'),
		radius: Number.parseFloat(value('--r-sm')) || 0,
	}
}

export const useReducedMotion = () => {
	const query = '(prefers-reduced-motion: reduce)'
	const reduced = ref(import.meta.client && window.matchMedia(query).matches)

	onMounted(() => {
		const media = window.matchMedia(query)
		reduced.value = media.matches

		const onChange = (event: MediaQueryListEvent) => {
			reduced.value = event.matches
		}

		media.addEventListener('change', onChange)
		onUnmounted(() => media.removeEventListener('change', onChange))
	})

	return reduced
}

export const useChartTheme = () => {
	const { theme } = useTheme()
	const reducedMotion = useReducedMotion()

	const chartTheme = shallowRef<ChartTheme>(
		import.meta.client ? readChartTheme() : EMPTY_THEME,
	)

	let lastMode = import.meta.client ? resolvedMode() : ''

	const refresh = () => {
		lastMode = resolvedMode()
		chartTheme.value = readChartTheme()
	}

	const refreshIfChanged = () => {
		if (resolvedMode() === lastMode) return
		refresh()
	}

	watch(theme, () => nextTick(refreshIfChanged))

	onMounted(() => {
		refreshIfChanged()

		const observer = new MutationObserver(refreshIfChanged)
		observer.observe(document.documentElement, {
			attributeFilter: ['data-theme'],
		})

		onUnmounted(() => observer.disconnect())
	})

	const color = (token: ChartColorToken) => chartTheme.value.colors[token]

	const colors = (tokens: ChartColorToken[]) => tokens.map(color)

	const baseOptions = computed<ApexOptions>(() => {
		const current = chartTheme.value

		return {
			chart: {
				fontFamily: current.fontFamily,
				foreColor: current.textSecondary,
				toolbar: { show: false },
				zoom: { enabled: false },
				animations: { enabled: !reducedMotion.value },
				parentHeightOffset: 0,
			},
			dataLabels: { enabled: false },
			grid: {
				borderColor: current.border,
				strokeDashArray: 4,
				padding: { top: 0, right: 8, bottom: 0, left: 8 },
			},
			legend: {
				fontFamily: current.fontFamily,
				fontSize: current.fontSizeSmall,
				labels: { colors: current.textSecondary },
				markers: { size: 6, strokeWidth: 0 },
				itemMargin: { horizontal: 8, vertical: 4 },
			},
			states: {
				hover: { filter: { type: 'lighten', value: 0.08 } },
				active: { filter: { type: 'none' } },
			},
			tooltip: {
				theme: current.mode,
				style: {
					fontFamily: current.fontFamily,
					fontSize: current.fontSizeSmall,
				},
			},
			xaxis: {
				axisBorder: { color: current.border },
				axisTicks: { color: current.border },
				crosshairs: {
					stroke: { color: current.borderStrong, width: 1, dashArray: 3 },
					fill: { type: 'solid', color: current.borderStrong },
				},
				labels: {
					style: {
						colors: current.textMuted,
						fontFamily: current.fontFamily,
						fontSize: current.fontSizeSmall,
					},
				},
			},
			yaxis: {
				labels: {
					style: {
						colors: current.textMuted,
						fontFamily: current.fontFamily,
						fontSize: current.fontSizeSmall,
					},
				},
				crosshairs: {
					stroke: { color: current.borderStrong, width: 1, dashArray: 3 },
				},
			},
			noData: {
				text: '',
			},
		}
	})

	return { chartTheme, baseOptions, color, colors, reducedMotion }
}

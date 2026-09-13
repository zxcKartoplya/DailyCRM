<script lang="ts" setup>
import type { ApexOptions } from 'apexcharts'
import type { ChartColorToken } from '~/composables/useChartTheme'

type Props = {
	categories: string[]
	data: number[]
	seriesName?: string
	color?: ChartColorToken
	colors?: ChartColorToken[]
	height?: number
	max?: number
	valueSuffix?: string
	showValues?: boolean
	loading?: boolean
	horizontal?: boolean
}

const {
	categories,
	data,
	seriesName = '',
	color: colorToken = 'accent',
	colors: colorTokens,
	height,
	max,
	valueSuffix = '',
	showValues = true,
	loading = false,
	horizontal = true,
} = defineProps<Props>()

const VERTICAL_HEIGHT = 240

const { baseOptions, chartTheme, color, colors } = useChartTheme()

const chartHeight = computed(
	() =>
		height ??
		(horizontal ? Math.max(140, categories.length * 36 + 32) : VERTICAL_HEIGHT),
)

const chartSeries = computed(() => [{ name: seriesName, data: [...data] }])

const distributed = computed(() => Boolean(colorTokens?.length))

const barColors = computed(() =>
	colorTokens?.length ? colors(colorTokens) : [color(colorToken)],
)

const horizontalOptions = computed<ApexOptions>(() => ({
	plotOptions: {
		bar: {
			horizontal: true,
			barHeight: '64%',
			borderRadius: chartTheme.value.radius,
			borderRadiusApplication: 'end',
			distributed: distributed.value,
		},
	},
	dataLabels: {
		enabled: showValues,
		textAnchor: 'end',
		offsetX: -8,
		style: {
			fontFamily: chartTheme.value.fontFamily,
			fontSize: chartTheme.value.fontSizeSmall,
			fontWeight: 500,
			colors: [chartTheme.value.textOnAccent],
		},
		formatter: value => formatChartValue(Number(value), valueSuffix),
	},
	grid: {
		xaxis: { lines: { show: true } },
		yaxis: { lines: { show: false } },
	},
	xaxis: {
		categories: [...categories],
		max,
		axisTicks: { show: false },
		labels: { formatter: value => formatChartValue(Number(value)) },
	},
	yaxis: {
		labels: { maxWidth: 180 },
	},
}))

const verticalOptions = computed<ApexOptions>(() => ({
	plotOptions: {
		bar: {
			horizontal: false,
			columnWidth: '56%',
			borderRadius: chartTheme.value.radius,
			borderRadiusApplication: 'end',
			distributed: distributed.value,
			dataLabels: { position: 'top' },
		},
	},
	dataLabels: {
		enabled: showValues,
		offsetY: -20,
		style: {
			fontFamily: chartTheme.value.fontFamily,
			fontSize: chartTheme.value.fontSizeSmall,
			fontWeight: 500,
			colors: [chartTheme.value.text],
		},
		formatter: value => formatChartValue(Number(value), valueSuffix),
	},
	grid: {
		xaxis: { lines: { show: false } },
		yaxis: { lines: { show: true } },
	},
	xaxis: {
		categories: [...categories],
		axisTicks: { show: false },
	},
	yaxis: {
		max,
		labels: { formatter: value => formatChartValue(Number(value)) },
	},
}))

const options = computed<ApexOptions>(() =>
	mergeChartOptions(
		baseOptions.value,
		{
			chart: { type: 'bar' },
			colors: barColors.value,
			legend: { show: false },
			tooltip: {
				y: {
					formatter: value => formatChartValue(value, valueSuffix),
					title: { formatter: () => seriesName },
				},
			},
		},
		horizontal ? horizontalOptions.value : verticalOptions.value,
	),
)
</script>

<template>
	<UIChartSkeleton v-if="loading" :height="chartHeight" />

	<ClientOnly v-else>
		<apexchart
			type="bar"
			:height="chartHeight"
			:options="options"
			:series="chartSeries"
		/>

		<template #fallback>
			<UIChartSkeleton :height="chartHeight" />
		</template>
	</ClientOnly>
</template>

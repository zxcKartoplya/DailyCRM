<script lang="ts" setup>
import type { ApexOptions } from 'apexcharts'
import type { ChartColorToken } from '~/composables/useChartTheme'

type Props = {
	data: (number | null)[]
	labels?: string[]
	type?: 'line' | 'bar'
	color?: ChartColorToken
	width?: number
	height?: number
	seriesName?: string
	valueSuffix?: string
	showTooltip?: boolean
	loading?: boolean
}

const {
	data,
	labels,
	type = 'line',
	color: colorToken = 'accent',
	width = 96,
	height = 28,
	seriesName = '',
	valueSuffix = '',
	showTooltip = true,
	loading = false,
} = defineProps<Props>()

const { baseOptions, chartTheme, color } = useChartTheme()

const chartSeries = computed(() => [{ name: seriesName, data: [...data] }])

const options = computed<ApexOptions>(() =>
	mergeChartOptions(baseOptions.value, {
		chart: { type, sparkline: { enabled: true } },
		colors: [color(colorToken)],
		stroke: { curve: 'smooth', width: 2 },
		markers: { size: 0, hover: { size: 3 } },
		plotOptions: {
			bar: {
				columnWidth: '60%',
				borderRadius: Math.min(2, chartTheme.value.radius),
			},
		},
		grid: { show: false, padding: { top: 0, right: 0, bottom: 0, left: 0 } },
		legend: { show: false },
		xaxis: { categories: labels ? [...labels] : [] },
		tooltip: {
			enabled: showTooltip,
			compact: true,
			x: { show: Boolean(labels?.length) },
			y: {
				formatter: value => formatChartValue(value, valueSuffix),
				title: { formatter: () => seriesName },
			},
		},
	}),
)
</script>

<template>
	<UIChartSkeleton
		v-if="loading"
		:height="height"
		:width="width"
		:radius="4"
	/>

	<ClientOnly v-else>
		<apexchart
			:type="type"
			:width="width"
			:height="height"
			:options="options"
			:series="chartSeries"
		/>

		<template #fallback>
			<UIChartSkeleton :height="height" :width="width" :radius="4" />
		</template>
	</ClientOnly>
</template>

<script lang="ts" setup>
import type { ApexOptions } from 'apexcharts'
import type { ChartColorToken } from '~/composables/useChartTheme'
import type { ChartSeries } from '~/utils/chart'

type Props = {
	series: ChartSeries[]
	categories: string[]
	height?: number
	min?: number
	max?: number
	valueSuffix?: string
	smooth?: boolean
	showLegend?: boolean
	loading?: boolean
	tooltipValue?: (dataPointIndex: number, seriesIndex: number) => string
}

const {
	series,
	categories,
	height = 260,
	min,
	max,
	valueSuffix = '',
	smooth = false,
	showLegend,
	loading = false,
	tooltipValue,
} = defineProps<Props>()

const PALETTE: ChartColorToken[] = ['accent', 'ok', 'warn', 'err']

const { baseOptions, color } = useChartTheme()

const chartSeries = computed(() =>
	series.map(item => ({ name: item.name, data: [...item.data] })),
)

const seriesColors = computed(() =>
	series.map((item, index) =>
		color(item.color ?? chartSeriesColor(index, PALETTE)),
	),
)

const options = computed<ApexOptions>(() =>
	mergeChartOptions(baseOptions.value, {
		chart: { type: 'line' },
		colors: seriesColors.value,
		stroke: { curve: smooth ? 'smooth' : 'straight', width: 2 },
		markers: { size: 4, strokeWidth: 0, hover: { sizeOffset: 2 } },
		legend: { show: showLegend ?? series.length > 1 },
		xaxis: {
			categories: [...categories],
			tooltip: { enabled: false },
			axisTicks: { show: false },
		},
		yaxis: {
			min,
			max,
			forceNiceScale: true,
			labels: { formatter: value => formatChartValue(value, valueSuffix) },
		},
		tooltip: {
			shared: true,
			intersect: false,
			y: {
				formatter: (value, context) =>
					tooltipValue && context
						? tooltipValue(context.dataPointIndex, context.seriesIndex)
						: formatChartValue(value, valueSuffix),
			},
		},
	}),
)
</script>

<template>
	<UIChartSkeleton v-if="loading" :height="height" />

	<ClientOnly v-else>
		<apexchart
			type="line"
			:height="height"
			:options="options"
			:series="chartSeries"
		/>

		<template #fallback>
			<UIChartSkeleton :height="height" />
		</template>
	</ClientOnly>
</template>

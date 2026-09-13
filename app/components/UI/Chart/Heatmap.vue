<script lang="ts" setup>
import type { ApexOptions } from 'apexcharts'
import type { ChartHeatmapRange, ChartHeatmapRow } from '~/utils/chart'

type Props = {
	rows: ChartHeatmapRow[]
	ranges: ChartHeatmapRange[]
	height?: number
	valueSuffix?: string
	showLegend?: boolean
	loading?: boolean
}

const {
	rows,
	ranges,
	height,
	valueSuffix = '',
	showLegend = false,
	loading = false,
} = defineProps<Props>()

const { baseOptions, chartTheme, color } = useChartTheme()

const chartHeight = computed(() => height ?? Math.max(120, rows.length * 32 + 64))

const chartSeries = computed(() =>
	rows.map(row => ({
		name: row.name,
		data: row.cells.map(cell => ({ x: cell.label, y: cell.value })),
	})),
)

const colorScaleRanges = computed(() =>
	ranges.map(range => ({
		from: range.from,
		to: range.to,
		color: color(range.color),
		name: range.label,
	})),
)

const options = computed<ApexOptions>(() =>
	mergeChartOptions(baseOptions.value, {
		chart: { type: 'heatmap' },
		stroke: { width: 2, colors: [chartTheme.value.surface] },
		plotOptions: {
			heatmap: {
				radius: chartTheme.value.radius,
				enableShades: false,
				shadeIntensity: 0,
				useFillColorAsStroke: false,
				colorScale: { ranges: colorScaleRanges.value },
			},
		},
		grid: { show: false, padding: { top: 0, right: 0, bottom: 0, left: 0 } },
		legend: { show: showLegend, position: 'bottom', horizontalAlign: 'left' },
		xaxis: { type: 'category', axisBorder: { show: false }, axisTicks: { show: false } },
		tooltip: {
			y: { formatter: value => formatChartValue(value, valueSuffix) },
		},
	}),
)
</script>

<template>
	<UIChartSkeleton v-if="loading" :height="chartHeight" />

	<ClientOnly v-else>
		<apexchart
			type="heatmap"
			:height="chartHeight"
			:options="options"
			:series="chartSeries"
		/>

		<template #fallback>
			<UIChartSkeleton :height="chartHeight" />
		</template>
	</ClientOnly>
</template>

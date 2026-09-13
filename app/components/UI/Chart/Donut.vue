<script lang="ts" setup>
import type { ApexOptions } from 'apexcharts'
import type { ChartColorToken } from '~/composables/useChartTheme'

type Props = {
	labels: string[]
	data: number[]
	colors?: ChartColorToken[]
	height?: number
	valueSuffix?: string
	totalLabel?: string
	totalValue?: string | number
	showLegend?: boolean
	legendPosition?: 'bottom' | 'right'
	loading?: boolean
}

const {
	labels,
	data,
	colors: colorTokens,
	height = 260,
	valueSuffix = '',
	totalLabel = '',
	totalValue,
	showLegend = true,
	legendPosition = 'bottom',
	loading = false,
} = defineProps<Props>()

const emit = defineEmits<{ select: [index: number] }>()

const PALETTE: ChartColorToken[] = ['accent', 'ok', 'warn', 'err', 'neutral']

const { baseOptions, chartTheme, color } = useChartTheme()

const chartSeries = computed(() => [...data])

const sliceColors = computed(() =>
	data.map((_, index) =>
		color(colorTokens?.[index] ?? chartSeriesColor(index, PALETTE)),
	),
)

const total = computed(() =>
	totalValue === undefined
		? formatChartValue(
				data.reduce((sum, value) => sum + value, 0),
				valueSuffix,
			)
		: String(totalValue),
)

const options = computed<ApexOptions>(() =>
	mergeChartOptions(baseOptions.value, {
		chart: {
			type: 'donut',
			events: {
				dataPointSelection: (_event, _context, options) => {
					const index = options?.dataPointIndex

					if (typeof index === 'number') emit('select', index)
				},
			},
		},
		labels: [...labels],
		colors: sliceColors.value,
		stroke: { width: 2, colors: [chartTheme.value.surface] },
		plotOptions: {
			pie: {
				expandOnClick: false,
				donut: {
					size: '68%',
					labels: {
						show: Boolean(totalLabel),
						name: {
							fontFamily: chartTheme.value.fontFamily,
							fontSize: chartTheme.value.fontSizeSmall,
							color: chartTheme.value.textMuted,
						},
						value: {
							fontFamily: chartTheme.value.fontFamily,
							fontSize: chartTheme.value.fontSize,
							fontWeight: 600,
							color: chartTheme.value.text,
							formatter: value =>
								formatChartValue(Number(value), valueSuffix),
						},
						total: {
							show: true,
							showAlways: true,
							label: totalLabel,
							fontFamily: chartTheme.value.fontFamily,
							fontSize: chartTheme.value.fontSizeSmall,
							color: chartTheme.value.textMuted,
							formatter: () => total.value,
						},
					},
				},
			},
		},
		legend: {
			show: showLegend,
			position: legendPosition,
			horizontalAlign: 'center',
		},
		tooltip: {
			y: { formatter: value => formatChartValue(value, valueSuffix) },
		},
	}),
)
</script>

<template>
	<UIChartSkeleton v-if="loading" :height="height" />

	<ClientOnly v-else>
		<apexchart
			type="donut"
			:height="height"
			:options="options"
			:series="chartSeries"
		/>

		<template #fallback>
			<UIChartSkeleton :height="height" />
		</template>
	</ClientOnly>
</template>

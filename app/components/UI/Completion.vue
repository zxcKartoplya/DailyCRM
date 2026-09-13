<script lang="ts" setup>
import type { CompletionPoint } from '~/utils/completionTrend'
import { formatRate } from '~/utils/dailyStats'

const {
	rate = null,
	trend = [],
	loading = false,
	error = false,
	emptyText = 'нет данных за период',
	errorText = 'не загрузилось',
} = defineProps<{
	rate?: number | null
	trend?: CompletionPoint[]
	loading?: boolean
	error?: boolean
	emptyText?: string
	errorText?: string
}>()

const SPARK_WIDTH = 84
const SPARK_HEIGHT = 24

const points = computed(() => trend.filter(point => point.value !== null))

const values = computed(() => trend.map(point => point.value))

const labels = computed(() => trend.map(point => point.label))

const hasTrend = computed(() => points.value.length > 1)
</script>

<template>
	<div class="ui-completion">
		<template v-if="loading">
			<Skeleton class="ui-completion__bone ui-completion__bone--value" preserveAspectRatio="none">
				<rect x="0" y="0" width="100%" height="100%" rx="4" ry="4" />
			</Skeleton>
			<UIChartSkeleton :width="SPARK_WIDTH" :height="SPARK_HEIGHT" :radius="4" />
		</template>

		<span v-else-if="error" class="ui-completion__note">{{ errorText }}</span>

		<span v-else-if="rate === null" class="ui-completion__note">{{ emptyText }}</span>

		<template v-else>
			<span class="ui-completion__value">{{ formatRate(rate) }}</span>
			<UIChartSparkline
				v-if="hasTrend"
				:data="values"
				:labels="labels"
				:width="SPARK_WIDTH"
				:height="SPARK_HEIGHT"
				series-name="Сдача"
				value-suffix="%"
			/>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.ui-completion {
	display: flex;
	align-items: center;
	gap: var(--s-3);
	min-width: 0;

	&__value {
		@include numeric;
		flex: none;
		color: var(--text-1);
		font-size: var(--t-md);
		font-weight: 500;
	}

	&__note {
		color: var(--text-3);
		font-size: var(--t-xs);
	}

	&__bone {
		flex: none;
		height: 1rem;

		&--value {
			width: 2.5rem;
		}
	}
}
</style>

<script lang="ts" setup>
type Props = {
	height?: number | string
	width?: number | string
	radius?: number
}

const { height = 260, width = '100%', radius = 8 } = defineProps<Props>()

const toSize = (value: number | string) =>
	typeof value === 'number' ? `${value}px` : value

const style = computed(() => ({
	height: toSize(height),
	width: toSize(width),
}))
</script>

<template>
	<div class="chart-skeleton" :style="style" aria-hidden="true">
		<Skeleton class="chart-skeleton__body" preserveAspectRatio="none">
			<rect x="0" y="0" width="100%" height="100%" :rx="radius" :ry="radius" />
		</Skeleton>
	</div>
</template>

<style lang="scss" scoped>
.chart-skeleton {
	display: block;

	&__body {
		width: 100%;
		height: 100%;
	}
}
</style>

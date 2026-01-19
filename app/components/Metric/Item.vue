<script lang="ts" setup>
type Props = {
	value: string | number
	description: string
	display_name: string
}

const { display_name, value, description } = defineProps<Props>()

const isMouse = ref(false)
</script>

<template>
	<div
		class="metric"
		@mouseenter="isMouse = true"
		@mouseleave="isMouse = false"
	>
		<IconClose
			v-if="isMouse"
			class="metric-icon"
			size="18"
			@click="$emit('close')"
		/>

		<div class="metric-wrapper">
			<div class="metric-title">{{ display_name }}</div>
			<div class="metric-info">
				<div>{{ description }}</div>
			</div>
		</div>
		<div class="metric-value">
			<IconPrice />
			<div>{{ value }}</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.metric {
	background-color: $bg-grey;
	position: relative;
	padding: rem(20);
	border-radius: 12px;
	@include flex(row, space-between, center);

	&-icon {
		position: absolute;
		top: rem(8);
		right: rem(8);
	}

	&-wrapper {
		@include flex(column, null, null, rem(12));
	}

	&-title {
		@include h4;
	}
	&-info {
		@include flex(row, space-between, null);
	}
	&-value {
		background-color: $bg-white;
		border-radius: 8px;
		padding: rem(4);
		@include flex(row, center, center, rem(4));
	}
}
</style>

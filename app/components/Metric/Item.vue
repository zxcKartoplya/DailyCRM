<script lang="ts" setup>
type Props = {
	value: string | number
	description: string
	display_name: string
}

const { display_name, value, description } = defineProps<Props>()

const emit = defineEmits<{
	(e: 'open'): void
	(e: 'close'): void
}>()

const isMouse = ref(false)
</script>

<template>
	<div
		class="metric"
		@mouseenter="isMouse = true"
		@mouseleave="isMouse = false"
		@click="emit('open')"
	>
		<IconClose
			v-if="isMouse"
			class="metric-icon"
			size="18"
			@click.stop="emit('close')"
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
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: var(--s-4);
	position: relative;
	padding: var(--s-4);
	border: 1px solid var(--border);
	border-radius: var(--r-md);
	background-color: var(--surface);
	cursor: pointer;
	transition:
		border-color var(--dur-fast) var(--ease),
		background-color var(--dur-fast) var(--ease);

	&:hover {
		border-color: var(--border-strong);
		background-color: var(--surface-hover);
	}

	&-icon {
		position: absolute;
		top: var(--s-2);
		right: var(--s-2);
		color: var(--text-3);

		&:hover {
			color: var(--err);
		}
	}

	&-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--s-1);
		min-width: 0;
	}

	&-title {
		@include h5;
	}

	&-info {
		color: var(--text-2);
		font-size: var(--t-sm);
	}

	&-value {
		display: inline-flex;
		align-items: center;
		gap: var(--s-1);
		flex: none;
		padding: var(--s-1) var(--s-2);
		border-radius: var(--r-sm);
		background-color: var(--accent-weak);
		color: var(--accent-text);
		@include numeric;
		font-size: var(--t-sm);
	}
}
</style>

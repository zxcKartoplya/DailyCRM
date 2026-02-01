<script lang="ts" setup>
type Size = 'sm' | 'md' | 'lg' | number

type Props = {
	size?: Size
	color?: string
	label?: string
	centered?: boolean
}

const {
	size = 'md',
	color = '',
	label = '',
	centered = false,
} = defineProps<Props>()

const sizeMap: Record<Exclude<Size, number>, number> = {
	sm: 16,
	md: 24,
	lg: 32,
}

const resolvedSize = computed(() =>
	typeof size === 'number' ? size : sizeMap[size],
)

const resolvedBorder = computed(() =>
	Math.max(2, Math.round(resolvedSize.value / 8)),
)

const spinnerStyle = computed(() => ({
	'--ui-loading-size': `${resolvedSize.value}px`,
	'--ui-loading-border': `${resolvedBorder.value}px`,
	color: color || undefined,
}))

const ariaLabel = computed(() => label || 'Loading')
</script>

<template>
	<div
		class="ui-loading"
		:class="{ 'ui-loading--centered': centered }"
		role="status"
		aria-live="polite"
		:aria-label="ariaLabel"
	>
		<span
			class="ui-loading__spinner"
			:style="spinnerStyle"
			aria-hidden="true"
		/>
		<span v-if="label" class="ui-loading__label">{{ label }}</span>
	</div>
</template>

<style lang="scss" scoped>
.ui-loading {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	color: $text-grey;

	&--centered {
		justify-content: center;
		width: 100%;
	}

	&__spinner {
		width: var(--ui-loading-size);
		height: var(--ui-loading-size);
		border-radius: 50%;
		border: var(--ui-loading-border) solid rgba($text-base, 0.25);
		border-top-color: currentColor;
		animation: ui-loading-spin 0.8s linear infinite;
	}
}

@keyframes ui-loading-spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>

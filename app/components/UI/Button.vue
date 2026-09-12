<script lang="ts" setup>
type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg' | 'full'
type Color = 'blue' | 'green' | 'orange' | 'red' | 'grey'

const props = withDefaults(
	defineProps<{
		variant?: Variant
		size?: Size
		color?: Color
		isBlock?: boolean
		isLoading?: boolean
		isDisabled?: boolean
		type?: 'button' | 'submit' | 'reset'
	}>(),
	{
		variant: 'primary',
		size: 'md',
		isBlock: false,
		isLoading: false,
		isDisabled: false,
		type: 'button',
	},
)

const emit = defineEmits<{
	(e: 'click', event: MouseEvent): void
}>()

const classes = computed(() => ({
	'ui-button': true,
	[`ui-button--${props.variant}`]: true,
	[`ui-button--${props.size}`]: true,
	[`ui-button--color-${props.color}`]: Boolean(props.color),
	'ui-button--isBlock': props.isBlock,
	'ui-button--isLoading': props.isLoading,
}))

const isDisabl = computed(() => props.isDisabled || props.isLoading)

const handleClick = (event: MouseEvent) => {
	if (isDisabl.value) {
		event.preventDefault()
		return
	}
	emit('click', event)
}
</script>

<template>
	<button
		:class="classes"
		:type="type"
		:disabled="isDisabl"
		:aria-busy="isLoading"
		:aria-disabled="isDisabl"
		@click="handleClick"
	>
		<span v-if="isLoading" class="ui-button__spinner" aria-hidden="true" />

		<span
			v-if="$slots['icon-left']"
			class="ui-button__icon ui-button__icon--left"
		>
			<slot name="icon-left" />
		</span>

		<span class="ui-button__label">
			<slot />
		</span>

		<span
			v-if="$slots['icon-right']"
			class="ui-button__icon ui-button__icon--right"
		>
			<slot name="icon-right" />
		</span>
	</button>
</template>

<style lang="scss" scoped>
.ui-button {
	--btn-tone: var(--accent);
	--btn-tone-hover: var(--accent-hover);
	--btn-tone-active: var(--accent-active);
	--btn-tone-weak: var(--accent-weak);
	--btn-tone-text: var(--accent-text);

	--btn-bg: var(--btn-tone);
	--btn-bg-hover: var(--btn-tone-hover);
	--btn-bg-active: var(--btn-tone-active);
	--btn-color: var(--text-on-accent);
	--btn-border: transparent;

	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: var(--s-2);
	height: var(--control-h);
	padding: 0 var(--s-4);
	border: 1px solid var(--btn-border);
	border-radius: var(--r-md);
	background-color: var(--btn-bg);
	color: var(--btn-color);
	font-size: var(--t-md);
	font-weight: 500;
	white-space: nowrap;
	cursor: pointer;
	user-select: none;
	transition:
		background-color var(--dur-fast) var(--ease),
		border-color var(--dur-fast) var(--ease),
		color var(--dur-fast) var(--ease);

	&--isBlock,
	&--full {
		width: 100%;
	}

	&--sm {
		height: var(--control-h-sm);
		padding: 0 var(--s-3);
		font-size: var(--t-sm);
	}

	&--lg {
		height: 2.5rem;
		padding: 0 var(--s-5);
	}

	&--secondary {
		--btn-bg: var(--surface);
		--btn-bg-hover: var(--surface-hover);
		--btn-bg-active: var(--surface-active);
		--btn-color: var(--text-1);
		--btn-border: var(--border-strong);
	}

	&--outline {
		--btn-bg: transparent;
		--btn-bg-hover: var(--btn-tone-weak);
		--btn-bg-active: var(--btn-tone-weak);
		--btn-color: var(--btn-tone-text);
		--btn-border: var(--border-strong);
	}

	&--ghost {
		--btn-bg: transparent;
		--btn-bg-hover: var(--surface-hover);
		--btn-bg-active: var(--surface-active);
		--btn-color: var(--text-2);
		--btn-border: transparent;
	}

	&--color-green {
		--btn-tone: var(--ok);
		--btn-tone-hover: var(--ok);
		--btn-tone-active: var(--ok);
		--btn-tone-weak: var(--ok-weak);
		--btn-tone-text: var(--ok);
	}

	&--color-orange {
		--btn-tone: var(--warn);
		--btn-tone-hover: var(--warn);
		--btn-tone-active: var(--warn);
		--btn-tone-weak: var(--warn-weak);
		--btn-tone-text: var(--warn);
	}

	&--color-red {
		--btn-tone: var(--err);
		--btn-tone-hover: var(--err-hover);
		--btn-tone-active: var(--err-hover);
		--btn-tone-weak: var(--err-weak);
		--btn-tone-text: var(--err);
	}

	&--color-grey {
		--btn-tone: var(--surface-sunken);
		--btn-tone-hover: var(--surface-hover);
		--btn-tone-active: var(--surface-active);
		--btn-tone-weak: var(--surface-hover);
		--btn-tone-text: var(--text-2);
		--btn-color: var(--text-1);
	}

	&:hover:not(:disabled) {
		background-color: var(--btn-bg-hover);
	}

	&:active:not(:disabled) {
		background-color: var(--btn-bg-active);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	&__label {
		display: inline-flex;
		align-items: center;
		gap: var(--s-2);
	}

	&__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 1.15em;
	}

	&__spinner {
		width: 0.875rem;
		height: 0.875rem;
		border-radius: 50%;
		border: 2px solid currentColor;
		border-top-color: transparent;
		opacity: 0.7;
		animation: ui-button-spin 0.7s linear infinite;
	}

	&--isLoading {
		pointer-events: none;
	}
}

@keyframes ui-button-spin {
	to {
		transform: rotate(360deg);
	}
}

@media (prefers-reduced-motion: reduce) {
	.ui-button__spinner {
		animation-duration: 2s;
	}
}
</style>

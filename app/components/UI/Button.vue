<script lang="ts" setup>
type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'
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
	--btn-bg: $color-primary;
	--btn-bg-hover: lighten($color-primary, 4%);
	--btn-bg-active: darken($color-primary, 4%);
	--btn-color: $text-base;
	--btn-border: transparent;
	--btn-shadow: 0 12px 24px rgba($color-primary, 0.3);

	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	border: 1px solid var(--btn-border);
	border-radius: $radius-md;
	background: var(--btn-bg);
	color: var(--btn-color);
	font-weight: 700;
	letter-spacing: 0.01em;
	text-transform: none;
	cursor: pointer;
	transition:
		transform 0.12s ease,
		box-shadow 0.18s ease,
		background-color 0.18s ease,
		border-color 0.18s ease,
		opacity 0.18s ease;
	box-shadow: var(--btn-shadow);
	user-select: none;
	isolation: isolate;

	&--isBlock {
		width: 100%;
	}

	&--sm {
		padding: 9px 14px;
		font-size: 0.95rem;
	}

	&--md {
		padding: 12px 18px;
		font-size: 1rem;
	}

	&--lg {
		padding: 14px 22px;
		font-size: 1.05rem;
	}

	&--primary {
		--btn-bg: linear-gradient(
			135deg,
			$color-primary,
			lighten($color-primary, 8%)
		);
		--btn-bg-hover: linear-gradient(
			135deg,
			lighten($color-primary, 5%),
			lighten($color-primary, 12%)
		);
		--btn-bg-active: darken($color-primary, 4%);
		--btn-border: rgba($color-primary, 0.8);
		--btn-shadow: 0 12px 26px rgba($color-primary, 0.35);
	}

	&--secondary {
		--btn-bg: linear-gradient(
			135deg,
			$color-secondary,
			lighten($color-secondary, 10%)
		);
		--btn-bg-hover: linear-gradient(
			135deg,
			lighten($color-secondary, 6%),
			lighten($color-secondary, 14%)
		);
		--btn-bg-active: darken($color-secondary, 6%);
		--btn-border: rgba($color-secondary, 0.85);
		--btn-shadow: 0 12px 26px rgba($color-secondary, 0.35);
		color: #0b0f14;
	}

	&--outline {
		--btn-bg: transparent;
		--btn-bg-hover: rgba($color-primary, 0.08);
		--btn-bg-active: rgba($color-primary, 0.12);
		--btn-border: rgba($color-primary, 0.8);
		--btn-shadow: none;
	}

	&--ghost {
		--btn-bg: rgba($text-base, 0.06);
		--btn-bg-hover: rgba($text-base, 0.1);
		--btn-bg-active: rgba($text-base, 0.16);
		--btn-border: rgba($text-base, 0.18);
		--btn-shadow: none;
	}

	&--color-blue {
		$c: $blue;
		--btn-bg: linear-gradient(135deg, $c, lighten($c, 8%));
		--btn-bg-hover: linear-gradient(135deg, lighten($c, 5%), lighten($c, 12%));
		--btn-bg-active: darken($c, 6%);
		--btn-border: rgba($c, 0.85);
		--btn-shadow: 0 12px 26px rgba($c, 0.35);
		--btn-color: $text-base;

		&.ui-button--outline,
		&.ui-button--ghost {
			--btn-bg: transparent;
			--btn-bg-hover: rgba($c, 0.08);
			--btn-bg-active: rgba($c, 0.14);
			--btn-border: rgba($c, 0.75);
			--btn-shadow: none;
			--btn-color: $c;
		}
	}

	&--color-green {
		$c: #22c55e;
		--btn-bg: linear-gradient(135deg, $c, lighten($c, 8%));
		--btn-bg-hover: linear-gradient(135deg, lighten($c, 5%), lighten($c, 12%));
		--btn-bg-active: darken($c, 6%);
		--btn-border: rgba($c, 0.85);
		--btn-shadow: 0 12px 26px rgba($c, 0.35);
		--btn-color: $text-base;

		&.ui-button--outline,
		&.ui-button--ghost {
			--btn-bg: transparent;
			--btn-bg-hover: rgba($c, 0.08);
			--btn-bg-active: rgba($c, 0.14);
			--btn-border: rgba($c, 0.75);
			--btn-shadow: none;
			--btn-color: $c;
		}
	}

	&--color-orange {
		$c: #f97316;
		--btn-bg: linear-gradient(135deg, $c, lighten($c, 8%));
		--btn-bg-hover: linear-gradient(135deg, lighten($c, 5%), lighten($c, 12%));
		--btn-bg-active: darken($c, 6%);
		--btn-border: rgba($c, 0.85);
		--btn-shadow: 0 12px 26px rgba($c, 0.35);
		--btn-color: #0b0f14;

		&.ui-button--outline,
		&.ui-button--ghost {
			--btn-bg: transparent;
			--btn-bg-hover: rgba($c, 0.08);
			--btn-bg-active: rgba($c, 0.14);
			--btn-border: rgba($c, 0.75);
			--btn-shadow: none;
			--btn-color: $c;
		}
	}

	&--color-red {
		$c: #ef4444;
		--btn-bg: linear-gradient(135deg, $c, lighten($c, 8%));
		--btn-bg-hover: linear-gradient(135deg, lighten($c, 5%), lighten($c, 12%));
		--btn-bg-active: darken($c, 6%);
		--btn-border: rgba($c, 0.85);
		--btn-shadow: 0 12px 26px rgba($c, 0.35);
		--btn-color: $text-base;

		&.ui-button--outline,
		&.ui-button--ghost {
			--btn-bg: transparent;
			--btn-bg-hover: rgba($c, 0.08);
			--btn-bg-active: rgba($c, 0.14);
			--btn-border: rgba($c, 0.75);
			--btn-shadow: none;
			--btn-color: $c;
		}
	}

	&--color-grey {
		$c: #f5f5f5;
		--btn-bg: linear-gradient(135deg, $c, lighten($c, 8%));
		--btn-bg-hover: linear-gradient(135deg, lighten($c, 5%), lighten($c, 12%));
		--btn-bg-active: darken($c, 6%);
		--btn-border: rgba($c, 0.85);
		--btn-shadow: 0 12px 26px rgba($c, 0.35);
		--btn-shadow-hover: 0 14px 28px rgba($c, 0.32);
		--btn-color: $text-base;

		&.ui-button--outline,
		&.ui-button--ghost {
			--btn-bg: transparent;
			--btn-bg-hover: rgba($c, 0.08);
			--btn-bg-active: rgba($c, 0.14);
			--btn-border: rgba($c, 0.75);
			--btn-shadow: none;
			--btn-color: $gray-medium;
		}
	}

	&:hover:not(:disabled) {
		background: var(--btn-bg-hover);
		transform: translateY(-1px);
		box-shadow: var(--btn-shadow-hover);
	}

	&:active:not(:disabled) {
		background: var(--btn-bg-active);
		transform: translateY(0);
		box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.25);
	}

	&:focus-visible {
		outline: 2px solid rgba($color-secondary, 0.8);
		outline-offset: 3px;
	}

	&:disabled {
		opacity: 0.55;
		cursor: not-allowed;
		box-shadow: none;
	}

	&__label {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	&__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 1.1em;
	}

	&__spinner {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 2px solid rgba($text-base, 0.3);
		border-top-color: currentColor;
		animation: spin 0.8s linear infinite;
	}

	&--sm &__spinner {
		width: 16px;
		height: 16px;
	}

	&--lg &__spinner {
		width: 20px;
		height: 20px;
	}

	&--isLoading {
		pointer-events: none;
	}
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>

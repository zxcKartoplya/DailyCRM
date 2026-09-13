<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		modelValue?: boolean
		label?: string
		onLabel?: string
		offLabel?: string
		hint?: string
		error?: string
		disabled?: boolean
		id?: string
	}>(),
	{
		modelValue: false,
		label: '',
		onLabel: 'Включён',
		offLabel: 'Выключен',
		hint: '',
		error: '',
		disabled: false,
	},
)

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
	(e: 'change', value: boolean): void
}>()

const uid = useId()
const inputId = computed(() => props.id ?? `ui-toggle-${uid}`)
const messageId = computed(() =>
	props.error || props.hint ? `${inputId.value}-message` : undefined,
)
const stateLabel = computed(() =>
	props.modelValue ? props.onLabel : props.offLabel,
)

const handleChange = (event: Event) => {
	const target = event.target as HTMLInputElement

	emit('update:modelValue', target.checked)
	emit('change', target.checked)
}
</script>

<template>
	<div
		class="ui-toggle"
		:class="{
			'ui-toggle--error': !!error,
			'ui-toggle--disabled': disabled,
		}"
	>
		<label v-if="label" class="ui-toggle__label" :for="inputId">
			{{ label }}
		</label>

		<div class="ui-toggle__shell">
			<label class="ui-toggle__control" :for="inputId">
				<input
					:id="inputId"
					class="ui-toggle__input"
					type="checkbox"
					role="switch"
					:checked="modelValue"
					:disabled="disabled"
					:aria-invalid="!!error"
					:aria-describedby="messageId"
					@change="handleChange"
				/>

				<span class="ui-toggle__track" aria-hidden="true">
					<span class="ui-toggle__thumb" />
				</span>

				<span class="ui-toggle__state">{{ stateLabel }}</span>
			</label>

			<p
				v-if="error || hint"
				:id="messageId"
				class="ui-toggle__message"
				:class="{ 'ui-toggle__message--error': !!error }"
			>
				{{ error || hint }}
			</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.ui-toggle {
	display: flex;
	flex-direction: column;
	width: 100%;

	&__label {
		display: inline-flex;
		align-items: center;
		gap: var(--s-1);
		padding-bottom: var(--s-2);
		font-size: var(--t-sm);
		font-weight: 500;
		color: var(--text-2);
	}

	&__shell {
		display: flex;
		flex-direction: column;
	}

	&__control {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: var(--s-3);
		align-self: flex-start;
		min-height: var(--control-h);
		cursor: pointer;
		user-select: none;
	}

	&__input {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		border: 0;
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		overflow: hidden;
		white-space: nowrap;
	}

	&__track {
		position: relative;
		flex: none;
		width: 2.25rem;
		height: 1.25rem;
		border: 1px solid var(--border-strong);
		border-radius: var(--r-full);
		background-color: var(--surface-sunken);
		transition:
			background-color var(--dur-fast) var(--ease),
			border-color var(--dur-fast) var(--ease),
			box-shadow var(--dur-fast) var(--ease);
	}

	&__thumb {
		position: absolute;
		top: 50%;
		left: 2px;
		width: 0.875rem;
		height: 0.875rem;
		border-radius: var(--r-full);
		background-color: var(--surface);
		box-shadow: 0 1px 2px rgba(20, 24, 31, 0.25);
		transform: translateY(-50%);
		transition: transform var(--dur-fast) var(--ease);
	}

	&__state {
		font-size: var(--t-md);
		color: var(--text-1);
	}

	&__message {
		padding-top: var(--s-2);
		font-size: var(--t-xs);
		color: var(--text-3);

		&--error {
			color: var(--err);
		}
	}

	&__control:hover &__track {
		border-color: var(--text-3);
	}

	&__input:checked + &__track {
		border-color: var(--accent);
		background-color: var(--accent);
	}

	&__input:checked + &__track &__thumb {
		transform: translate(1rem, -50%);
	}

	&__input:focus-visible + &__track {
		box-shadow: var(--focus-ring);
	}

	&--error {
		.ui-toggle__track {
			border-color: var(--err);
		}

		.ui-toggle__input:focus-visible + .ui-toggle__track {
			box-shadow: 0 0 0 3px var(--err-weak);
		}
	}

	&--disabled {
		opacity: 0.6;

		.ui-toggle__control {
			cursor: not-allowed;
		}
	}
}

@media (prefers-reduced-motion: reduce) {
	.ui-toggle__track,
	.ui-toggle__thumb {
		transition: none;
	}
}
</style>

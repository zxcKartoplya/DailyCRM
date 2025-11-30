<script lang="ts" setup>
import { computed, getCurrentInstance, ref, watch } from 'vue'

type ModelValue = string | number | null
type InputType =
	| 'text'
	| 'email'
	| 'password'
	| 'number'
	| 'tel'
	| 'url'
	| 'search'

const props = withDefaults(
	defineProps<{
		modelValue?: ModelValue
		label?: string
		placeholder?: string
		hint?: string
		error?: string
		type?: InputType
		disabled?: boolean
		readonly?: boolean
		clearable?: boolean
		autofocus?: boolean
		id?: string
		required?: boolean
	}>(),
	{
		modelValue: '',
		placeholder: '',
		type: 'text',
		hint: '',
		error: '',
		disabled: false,
		readonly: false,
		clearable: false,
		autofocus: false,
		required: false,
	}
)

const emit = defineEmits<{
	(e: 'update:modelValue', value: ModelValue): void
	(e: 'focus', event: FocusEvent): void
	(e: 'blur', event: FocusEvent): void
	(e: 'input', event: Event): void
	(e: 'clear'): void
}>()

const normalizeValue = (value: ModelValue) =>
	value === null || value === undefined ? '' : String(value)

const internalValue = ref(normalizeValue(props.modelValue))
const isFocused = ref(false)

const uid = getCurrentInstance()?.uid ?? Math.floor(Math.random() * 10000)
const inputId = computed(() => props.id ?? `ui-input-${uid}`)
const messageId = computed(() =>
	props.error || props.hint ? `${inputId.value}-message` : undefined
)
const hasValue = computed(() => internalValue.value.length > 0)

const handleInput = (event: Event) => {
	const target = event.target as HTMLInputElement
	const value = target.value
	internalValue.value = value

	const numericCandidate = Number(value)
	const payload: ModelValue =
		props.type === 'number'
			? value === ''
				? null
				: Number.isNaN(numericCandidate)
					? value
					: numericCandidate
			: value

	emit('update:modelValue', payload)
	emit('input', event)
}

const handleFocus = (event: FocusEvent) => {
	isFocused.value = true
	emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
	isFocused.value = false
	emit('blur', event)
}

const clearValue = () => {
	if (props.disabled || props.readonly) return

	internalValue.value = ''
	emit('update:modelValue', props.type === 'number' ? null : '')
	emit('clear')
}

watch(
	() => props.modelValue,
	value => {
		internalValue.value = normalizeValue(value)
	}
)
</script>

<template>
	<div
		class="ui-input"
		:class="{
			'ui-input--focused': isFocused,
			'ui-input--error': !!error,
			'ui-input--disabled': disabled,
		}"
	>
		<label v-if="label" class="ui-input__label" :for="inputId">
			<span>{{ label }}</span>
			<span v-if="required" class="ui-input__required" aria-hidden="true"
				>*</span
			>
		</label>

		<div class="ui-input__shell">
			<div class="ui-input__field">
				<span
					v-if="$slots.prefix"
					class="ui-input__affix ui-input__affix--prefix"
				>
					<slot name="prefix" />
				</span>

				<input
					:id="inputId"
					class="ui-input__input"
					:type="type"
					:value="internalValue"
					:placeholder="placeholder"
					:disabled="disabled"
					:readonly="readonly"
					:required="required"
					:autofocus="autofocus"
					:aria-invalid="!!error"
					:aria-describedby="messageId"
					@input="handleInput"
					@focus="handleFocus"
					@blur="handleBlur"
				/>

				<span
					v-if="$slots.suffix"
					class="ui-input__affix ui-input__affix--suffix"
				>
					<slot name="suffix" />
				</span>

				<button
					v-if="clearable && hasValue"
					class="ui-input__clear"
					type="button"
					aria-label="Очистить поле"
					@click="clearValue"
				>
					×
				</button>
			</div>

			<transition name="fade">
				<p
					v-if="error || hint"
					:id="messageId"
					class="ui-input__message"
					:class="{ 'ui-input__message--error': !!error }"
				>
					{{ error || hint }}
				</p>
			</transition>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.ui-input {
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 6px;

	&__label {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 0.95rem;
		font-weight: 600;
		color: $gray-light;
		letter-spacing: 0.01em;
	}

	&__required {
		color: $color-secondary;
		font-size: 1rem;
	}

	&__shell {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	&__field {
		position: relative;
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: 52px;
		border-radius: $radius-md;
		background: linear-gradient(
			135deg,
			rgba($color-surface, 0.9),
			rgba($color-surface, 0.82)
		);
		border: 1px solid rgba($gray-light, 0.24);
		box-shadow:
			0 12px 30px rgba(0, 0, 0, 0.28),
			inset 0 1px 0 rgba(255, 255, 255, 0.04);
		padding: 10px 12px;
		transition:
			border-color 0.16s ease,
			box-shadow 0.16s ease,
			transform 0.12s ease;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			inset: -1px;
			pointer-events: none;
			border-radius: inherit;
			background: linear-gradient(
				120deg,
				rgba($color-primary, 0.28),
				rgba($color-secondary, 0.24)
			);
			opacity: 0;
			transition: opacity 0.18s ease;
		}
	}

	&__input {
		flex: 1 1 auto;
		width: 100%;
		border: none;
		background: transparent;
		color: $text-base;
		font-size: 1rem;
		line-height: 1.4;
		font-weight: 500;
		letter-spacing: 0.01em;
		padding: 8px 0;
		outline: none;
		caret-color: $color-primary;

		&::placeholder {
			color: rgba($text-base, 0.5);
		}
	}

	&__affix {
		color: rgba($text-base, 0.7);
		display: inline-flex;
		align-items: center;
		font-size: 0.95rem;

		&--prefix {
			margin-right: 2px;
		}

		&--suffix {
			margin-left: 2px;
		}
	}

	&__clear {
		border: none;
		outline: none;
		padding: 6px 8px;
		border-radius: 10px;
		background: rgba($text-base, 0.08);
		color: $text-base;
		cursor: pointer;
		font-size: 1rem;
		line-height: 1;
		transition: all 0.15s ease;

		&:hover {
			background: rgba($text-base, 0.14);
			color: $color-secondary;
		}

		&:active {
			transform: scale(0.98);
		}
	}

	&__message {
		font-size: 0.85rem;
		line-height: 1.3;
		color: rgba($text-base, 0.65);

		&--error {
			color: lighten(#f87171, 10%);
		}
	}

	&--focused {
		.ui-input__field {
			border-color: rgba($color-primary, 0.7);
			box-shadow:
				0 14px 36px rgba($color-primary, 0.25),
				0 2px 12px rgba($color-primary, 0.14),
				inset 0 1px 0 rgba(255, 255, 255, 0.08);
			transform: translateY(-1px);

			&::before {
				opacity: 1;
			}
		}

		.ui-input__label {
			color: $gray-medium;
		}
	}

	&--error {
		.ui-input__field {
			border-color: rgba(#f87171, 0.9);
			box-shadow:
				0 14px 34px rgba(#f87171, 0.2),
				inset 0 1px 0 rgba(255, 255, 255, 0.04);

			&::before {
				opacity: 0.8;
				background: linear-gradient(
					120deg,
					rgba(#f87171, 0.3),
					rgba($color-surface, 0.08)
				);
			}
		}
	}

	&--disabled {
		opacity: 0.55;
		cursor: not-allowed;

		.ui-input__field {
			box-shadow: none;
			border-color: rgba($gray-light, 0.16);
			background: rgba($color-surface, 0.6);
		}

		.ui-input__input {
			color: rgba($text-base, 0.6);
		}
	}
}

.fade-enter-active,
.fade-leave-active {
	transition:
		opacity 0.16s ease,
		transform 0.16s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-2px);
}
</style>

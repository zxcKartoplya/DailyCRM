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
	padding-bottom: rem(12);
	transition:
		color 0.15s ease-in-out,
		background-color 0.15s ease-in-out,
		border-color 0.15s ease-in-out;

	&__label {
		display: inline-flex;
		align-items: center;
		padding-bottom: rem(6);
		font-size: 0.95rem;
		font-weight: 600;
		color: $text-grey;
		letter-spacing: 0.01em;
	}

	&__required {
		color: $color-secondary;
		font-size: 1rem;
	}

	&__shell {
		display: flex;
		flex-direction: column;
		position: relative;
	}

	&__field {
		position: relative;
		display: flex;
		align-items: center;
		gap: 12px;
		min-height: rem(25);
		border-radius: $radius-md;
		border: 1px solid $icons-grey-light;
		background-color: $bg-grey;
		padding: 10px 12px;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			inset: -1px;
			pointer-events: none;
			border-radius: inherit;
			opacity: 0;
			transition: opacity 0.18s ease;
		}
		&:hover {
			border-color: $icons-grey;
		}
		&:focus {
			border-color: $icons-grey;
			background-color: $bg-white;
		}
		&:disabled {
			cursor: not-allowed;
			&:hover {
				border-color: $icons-grey-light;
			}
		}
	}

	&__input {
		flex: 1 1 auto;
		width: 100%;
		border: none;
		background: transparent;
		font-size: 1rem;
		line-height: 1.4;
		font-weight: 500;
		letter-spacing: 0.01em;
		outline: none;
		@include body-usual-medium;
		::placeholder {
			color: $text-grey-light;
		}
	}

	&__affix {
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
		cursor: pointer;
		font-size: 1rem;
		line-height: 1;
		transition: all 0.15s ease;

		&:hover {
			border-color: $icons-grey;
		}

		&:active {
			transform: scale(0.98);
		}
		&:focus {
			border-color: $icons-grey;
			background-color: $bg-white;
		}
	}

	&__message {
		position: absolute;
		bottom: -30px;
		@include body-label-regular;

		&--error {
			color: lighten(#f87171, 10%);
		}
	}
	&--error {
		.ui-input__field {
			border-color: rgba(#f87171, 0.9);
		}
	}

	&--disabled {
		cursor: not-allowed;
		&:hover {
			border-color: $icons-grey-light;
		}
		::placeholder {
			color: $text-grey-light;
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

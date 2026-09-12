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
					<IconClose size="14" />
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

	&__label {
		display: inline-flex;
		align-items: center;
		gap: var(--s-1);
		padding-bottom: var(--s-2);
		font-size: var(--t-sm);
		font-weight: 500;
		color: var(--text-2);
	}

	&__required {
		color: var(--err);
	}

	&__shell {
		display: flex;
		flex-direction: column;
	}

	&__field {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		height: var(--control-h);
		padding: 0 var(--s-3);
		border: 1px solid var(--border-strong);
		border-radius: var(--r-md);
		background-color: var(--surface);
		transition:
			border-color var(--dur-fast) var(--ease),
			box-shadow var(--dur-fast) var(--ease);

		&:hover {
			border-color: var(--text-3);
		}

		&:focus-within {
			border-color: var(--accent);
			box-shadow: 0 0 0 3px var(--accent-weak);
		}
	}

	&__input {
		flex: 1 1 auto;
		width: 100%;
		min-width: 0;
		border: none;
		background: transparent;
		font-size: var(--t-md);
		color: var(--text-1);
		outline: none;

		&::placeholder {
			color: var(--text-3);
		}
	}

	&__affix {
		display: inline-flex;
		align-items: center;
		color: var(--text-3);
	}

	&__clear {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: 1.25rem;
		height: 1.25rem;
		border: none;
		border-radius: var(--r-sm);
		background: transparent;
		color: var(--text-3);
		line-height: 1;
		cursor: pointer;
		transition:
			background-color var(--dur-fast) var(--ease),
			color var(--dur-fast) var(--ease);

		&:hover {
			background-color: var(--surface-hover);
			color: var(--text-1);
		}
	}

	&__message {
		padding-top: var(--s-2);
		font-size: var(--t-xs);
		color: var(--text-3);

		&--error {
			color: var(--err);
		}
	}

	&--error {
		.ui-input__field {
			border-color: var(--err);

			&:focus-within {
				box-shadow: 0 0 0 3px var(--err-weak);
			}
		}
	}

	&--disabled {
		opacity: 0.6;

		.ui-input__field {
			background-color: var(--surface-sunken);
			cursor: not-allowed;
		}
	}
}

.fade-enter-active,
.fade-leave-active {
	transition:
		opacity var(--dur) var(--ease),
		transform var(--dur) var(--ease);
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-2px);
}
</style>

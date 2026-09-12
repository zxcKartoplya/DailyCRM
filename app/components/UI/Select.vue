<script lang="ts" setup>
type OptionValue = string | number

type Option = {
	name: string
	value: OptionValue
}

type Props = {
	modelValue?: OptionValue | null
	label?: string
	required?: boolean
	placeholder?: string
	options?: Option[]
	error?: string
}

const { modelValue, label, required, placeholder, options, error } =
	defineProps<Props>()

const resolvedModelValue = computed(() =>
	modelValue === '' || modelValue === 0 || modelValue == null ? '' : modelValue,
)

const resolvedPlaceholder = computed(() => placeholder ?? 'Выберите значение')
const resolvedOptions = computed(() => options ?? [])

const emit = defineEmits<{
	(e: 'update:modelValue', value: OptionValue | null): void
}>()

const handleChange = (event: Event) => {
	const target = event.target as HTMLSelectElement
	const raw = target.value

	if (raw === '') {
		emit('update:modelValue', null)
		return
	}

	const matched = resolvedOptions.value.find(o => String(o.value) === raw)
	emit('update:modelValue', matched ? matched.value : raw)
}
</script>

<template>
	<div class="ui-select">
		<label v-if="label" class="ui-select__label">
			<span>{{ label }}</span>
			<span v-if="required" class="ui-select__required" aria-hidden="true"
				>*</span
			>
		</label>

		<select
			class="ui-select__select"
			:class="{
				'ui-select__select--empty': resolvedModelValue === '',
				'ui-select__select--error': !!error,
			}"
			:value="resolvedModelValue"
			@change="handleChange"
		>
			<option value="" disabled hidden>
				{{ resolvedPlaceholder }}
			</option>

			<option
				v-for="option in resolvedOptions"
				:key="option.value"
				:value="option.value"
			>
				{{ option.name }}
			</option>
		</select>

		<p v-if="error" class="ui-select__message ui-select__message--error">
			{{ error }}
		</p>
	</div>
</template>

<style lang="scss" scoped>
.ui-select {
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

	&__select {
		width: 100%;
		height: var(--control-h);
		padding: 0 var(--s-7) 0 var(--s-3);
		border: 1px solid var(--border-strong);
		border-radius: var(--r-md);
		background-color: var(--surface);
		background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
			linear-gradient(135deg, currentColor 50%, transparent 50%);
		background-position:
			right calc(var(--s-4) + 4px) center,
			right var(--s-4) center;
		background-size:
			5px 5px,
			5px 5px;
		background-repeat: no-repeat;
		font-size: var(--t-md);
		color: var(--text-1);
		outline: none;
		appearance: none;
		cursor: pointer;
		transition:
			border-color var(--dur-fast) var(--ease),
			box-shadow var(--dur-fast) var(--ease);

		&:hover {
			border-color: var(--text-3);
		}

		&:focus {
			border-color: var(--accent);
			box-shadow: 0 0 0 3px var(--accent-weak);
		}

		&--empty {
			color: var(--text-3);
		}

		&--error {
			border-color: var(--err);

			&:focus {
				box-shadow: 0 0 0 3px var(--err-weak);
			}
		}
	}

	&__message {
		padding-top: var(--s-2);
		font-size: var(--t-xs);

		&--error {
			color: var(--err);
		}
	}
}
</style>

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
	padding-bottom: rem(12);

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

	&__select {
		width: 100%;
		height: rem(47);
		padding: rem(12) rem(14);
		border-radius: 10px;
		border: 1px solid transparent;
		background-color: $bg-grey;
		font-weight: 500;
		box-sizing: border-box;
		outline: none;
		appearance: none;

		color: $text-black;

		&--empty {
			color: $text-grey;
		}

		&--error {
			border-color: #ff5b5b;
		}
	}

	&__message {
		margin-top: rem(6);
		font-size: rem(12);

		&--error {
			color: #ff5b5b;
		}
	}
}
</style>

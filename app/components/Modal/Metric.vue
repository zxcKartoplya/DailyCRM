<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import type { Metric } from '~/types/reviewers'
import { metricSchema } from '~/utils/validation/metricSchema'

type Props = {
	metric?: Metric
}

const { metric } = defineProps<Props>()

const emit = defineEmits<{
	(e: 'close'): void
	(e: 'create', value: Metric): void
}>()

const options = Array.from({ length: 10 }, (_, i) => ({
	name: `${i + 1}`,
	value: i + 1,
}))

const { transliterate } = useTransliterate()

const { handleSubmit } = useForm<Metric>({
	initialValues: {
		value: metric?.value || 0,
		display_name: metric?.display_name || '',
		description: metric?.description || '',
	},
	validationSchema: metricSchema,
})

const create = handleSubmit(values => {
	const newMetric: Metric = {
		value: values.value ?? 1,
		json_name: transliterate(values.display_name || 'new_metric'),
		display_name: values.display_name || 'Новая метрика',
		description: values.description || '',
	}
	emit('create', newMetric)
})
</script>

<template>
	<Modal title="Редактирование метрики" @close="emit('close')">
		<form class="form" @submit.prevent="create">
			<Field
				v-slot="{ field, errorMessage, handleChange, handleBlur }"
				name="display_name"
			>
				<UIInput
					label="Название"
					placeholder="Введите название метрики"
					:model-value="field.value"
					:error="errorMessage"
					@blur="handleBlur"
					@update:model-value="handleChange"
				/>
			</Field>
			<Field v-slot="{ field, handleChange }" name="value">
				<UISelect
					label="Важность"
					placeholder="Выберите важность метрики"
					:options="options"
					:model-value="field.value"
					@update:model-value="handleChange"
				/>
			</Field>
			<Field
				v-slot="{ field, errorMessage, handleChange, handleBlur }"
				name="description"
			>
				<UITextArea
					label="Описание метрики"
					placeholder="Введите короткое описание метрики"
					:model-value="field.value"
					:error="errorMessage"
					@blur="handleBlur"
					@update:model-value="handleChange"
				/>
			</Field>
			<div class="form-buttons">
				<UIButton is-block color="grey" type="submit">Сохранить</UIButton>
				<UIButton is-block @click="emit('close')">Отмена</UIButton>
			</div>
		</form>
	</Modal>
</template>

<style lang="scss" scoped>
.form {
	min-width: rem(350);
	padding-top: rem(8);
	@include flex(column, null, null, rem(8));
	&-buttons {
		@include flex(row, space-between, null, rem(8));
	}
}
</style>

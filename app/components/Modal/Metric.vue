<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import type { Metric } from '~/types/reviewers'
import { metricSchema } from '~/utils/validation/metricSchema'

type Props = {
	isSaving?: boolean
}

const { isSaving = false } = defineProps<Props>()

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
		value: 0,
		display_name: '',
		description: '',
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

const close = () => {
	if (!isSaving) emit('close')
}
</script>

<template>
	<Modal title="Новая метрика" @close="close">
		<form class="form" @submit.prevent="create">
			<fieldset class="form__fields" :disabled="isSaving">
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
			</fieldset>
			<div class="form-buttons">
				<UIButton is-block type="submit" :is-loading="isSaving">
					Сохранить
				</UIButton>
				<UIButton
					is-block
					variant="secondary"
					:is-disabled="isSaving"
					@click="close"
				>
					Отмена
				</UIButton>
			</div>
		</form>
	</Modal>
</template>

<style lang="scss" scoped>
.form {
	display: flex;
	flex-direction: column;
	gap: var(--s-4);

	&__fields {
		display: flex;
		flex-direction: column;
		gap: var(--s-4);
		margin: 0;
		padding: 0;
		border: 0;
	}

	&-buttons {
		display: flex;
		gap: var(--s-3);
		margin-top: var(--s-2);
	}
}
</style>

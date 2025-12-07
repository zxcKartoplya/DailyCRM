<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import { useAlertStore } from '~/stores/alert'
import { useReviewersStore } from '~/stores/reviewers'
import { Alert } from '~/types/alert'
import type { APIReviewerPayload } from '~/types/reviewers'
import { reviewerSchema } from '~/utils/validation/reviewerSchema'

const reviewersStore = useReviewersStore()
const alertStore = useAlertStore()
const router = useRouter()

const { handleSubmit } = useForm<APIReviewerPayload>({
	validationSchema: reviewerSchema,
	initialValues: {
		name: '',
		description: '',
	},
})

const add = handleSubmit(async formValues => {
	try {
		const created = await reviewersStore.addReviewer(formValues)
		if (created) {
			router.push('/reviewers')
			alertStore.showAlert(Alert.Added)
		}
	} catch (error) {
		alertStore.showAlert(Alert.AddedError)
	}
})
</script>

<template>
	<form class="page" @submit.prevent="add">
		<div class="page__text">Создать обозревателя</div>
		<div class="page__fields">
			<Field
				v-slot="{ field, errorMessage, handleChange, handleBlur }"
				name="name"
			>
				<UIInput
					label="Название обозревателя"
					placeholder="Введите название обозревателя"
					required
					:modelValue="field.value"
					:error="errorMessage"
					@blur="handleBlur"
					@update:model-value="handleChange"
				/>
			</Field>

			<Field
				v-slot="{ field, errorMessage, handleChange, handleBlur }"
				name="description"
			>
				<UIInput
					label="Описание"
					placeholder="Введите описание"
					required
					:modelValue="field.value"
					:error="errorMessage"
					@blur="handleBlur"
					@update:model-value="handleChange"
				/>
			</Field>
		</div>

		<UIButton type="submit" class="page__button">Создать</UIButton>
	</form>
</template>

<style lang="scss" scoped>
.page {
	@include flex(column, null, null);
	gap: rem(16);

	&__text {
		@include h1;
	}

	&__fields {
		@include flex(column, null, null, rem(12));
	}

	&__button {
		align-self: flex-start;
	}
}
</style>

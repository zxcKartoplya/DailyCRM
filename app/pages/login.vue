<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import { useAlertStore } from '~/stores/alert'
import { useLoginStore } from '~/stores/login'
import { Alert } from '~/types/alert'
import type { LoginData } from '~/types/login'
import { safeRedirect } from '~/utils/authRedirect'
import { loginSchema } from '~/utils/validation/loginSchema'

const loginStore = useLoginStore()
const alertStore = useAlertStore()
const route = useRoute()
const router = useRouter()

const isSubmitting = ref(false)

const { handleSubmit, errors } = useForm<LoginData>({
	validationSchema: loginSchema,
	initialValues: {
		email: '',
		password: '',
	},
})

const login = handleSubmit(
	async formValues => {
		isSubmitting.value = true
		try {
			await loginStore.login(formValues)
			alertStore.showAlert(Alert.Authorized)
			await router.replace(safeRedirect(route.query.redirect))
		} catch (error) {
			alertStore.showAlert(Alert.Unauthorized)
		} finally {
			isSubmitting.value = false
		}
	},
	() => {
		alertStore.showAlert(Alert.FormError)
	},
)

useSeoMeta({
	title: 'Авторизация',
})
</script>

<template>
	<div class="login">
		<form class="login__form" @submit.prevent="login">
			<div class="login__brand">
				<IconLogo size="20" />
				<span class="login__wordmark">DailyCRM</span>
			</div>

			<h1 class="login__title">Вход в систему</h1>
			<p class="login__lede">
				Управление структурой компании и оценками сотрудников.
			</p>

			<div class="login__fields">
				<Field
					v-slot="{ field, errorMessage, handleChange, handleBlur }"
					name="email"
				>
					<UIInput
						label="Почта"
						placeholder="name@company.ru"
						type="email"
						:model-value="field.value"
						:error="errorMessage"
						@blur="handleBlur"
						@update:model-value="handleChange"
					/>
				</Field>
				<Field
					v-slot="{ field, errorMessage, handleChange, handleBlur }"
					name="password"
				>
					<UIInput
						label="Пароль"
						placeholder="Введите пароль"
						type="password"
						:model-value="field.value"
						:error="errorMessage"
						@blur="handleBlur"
						@update:model-value="handleChange"
					/>
				</Field>
			</div>

			<UIButton
				type="submit"
				is-block
				:is-loading="isSubmitting"
				:is-disabled="!!errors.email || !!errors.password"
			>
				Войти
			</UIButton>
		</form>
	</div>
</template>

<style lang="scss" scoped>
.login {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	padding: var(--s-5);

	&__form {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 22rem;
	}

	&__brand {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		margin-bottom: var(--s-6);
		color: var(--text-1);
	}

	&__wordmark {
		font-size: var(--t-lg);
		font-weight: 600;
		letter-spacing: var(--tracking-tight);
	}

	&__title {
		@include h2;
	}

	&__lede {
		margin-top: var(--s-2);
		color: var(--text-2);
	}

	&__fields {
		display: flex;
		flex-direction: column;
		gap: var(--s-4);
		margin: var(--s-6) 0;
	}
}
</style>

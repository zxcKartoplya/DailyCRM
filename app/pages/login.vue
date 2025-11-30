<script lang="ts" setup>
import { Field, useForm } from 'vee-validate'
import { useAlertStore } from '~/stores/alert'
import { useLoginStore } from '~/stores/login'
import { Alert } from '~/types/alert'
import type { LoginData } from '~/types/login'
import { loginSchema } from '~/utils/validation/loginSchema'

const loginStore = useLoginStore()
const alertStore = useAlertStore()
const router = useRouter()

const { handleSubmit, errors } = useForm<LoginData>({
	validationSchema: loginSchema,
	initialValues: {
		email: '',
		password: '',
	},
})

const login = handleSubmit(
	async formValues => {
		try {
			await loginStore.login(formValues)
			alertStore.showAlert(Alert.Authorized)
			await router.push('/')
		} catch (error) {
			alertStore.showAlert(Alert.Unauthorized)
		}
	},
	() => {
		alertStore.showAlert(Alert.FormError)
	}
)
</script>

<template>
	<div class="login">
		<div class="login__contener">
			<div class="login__info">
				<div class="login__info--text">Welcome DailyCRM</div>
			</div>
			<div class="login__form">
				<form @submit.prevent="login" class="login__form--contener">
					<Field
						v-slot="{ field, errorMessage, handleChange, handleBlur }"
						name="email"
					>
						<UIInput
							label="Email Address"
							placeholder="Enter email address"
							:modelValue="field.value"
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
							label="Password"
							placeholder="Enter the password"
							:modelValue="field.value"
							:error="errorMessage"
							@blur="handleBlur"
							@update:model-value="handleChange"
						/>
					</Field>
					<UIButton
						type="submit"
						variant="primary"
						size="md"
						:is-disabled="!!errors.email || !!errors.password"
					>
						Login
					</UIButton>
				</form>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.login {
	height: 100vh;
	width: 100%;
	padding: rem(72) rem(81);
	box-sizing: border-box;
	&__contener {
		width: 100%;
		height: 100%;
		border-radius: 12px;
		overflow: hidden;
		@include flex(row, center, center);
	}
	&__form {
		width: 50%;
		height: 100%;
		background-color: $white;
		@include flex(column, center, center, rem(10));
		&--contener {
			width: rem(403);
			@include flex(column, center, center);
		}
	}
	&__info {
		width: 50%;
		height: 100%;
		background-color: $bg-blue;
		color: $white;
		@include flex(column, center, center);
		&--text {
			@include h1;
		}
	}
}
</style>

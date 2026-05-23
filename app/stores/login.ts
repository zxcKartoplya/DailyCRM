import { defineStore } from 'pinia'
import { useAuthToken } from '~/composables/useAuthToken'
import LoginService from '~/services/login.services'
import type { AuthUser, LoginData } from '~/types/login'

export const useLoginStore = defineStore('login', () => {
	const { setToken, clearToken } = useAuthToken()

	const currentUser = ref<AuthUser | null>(null)

	const login = async (userInfo: LoginData) => {
		const response = await LoginService.login(userInfo)

		if (!response?.access_token) {
			throw new Error('Неверный email или пароль')
		}

		setToken(response.access_token)
		currentUser.value = response.user
	}

	const logout = () => {
		clearToken()
		currentUser.value = null
	}

	return { login, logout, currentUser }
})

import { defineStore } from 'pinia'
import { useAuthToken } from '~/composables/useAuthToken'
import LoginService from '~/services/login.services'
import type { LoginData } from '~/types/login'

export const useLoginStore = defineStore('login', () => {
	const { setToken, clearToken } = useAuthToken()

	const login = async (userInfo: LoginData) => {
		const { access_token, message } = await LoginService.login(userInfo)

		if (!access_token) {
			throw new Error(message)
		}

		setToken(access_token)
	}

	const logout = () => {
		clearToken()
	}

	return { login, logout }
})

//  {
// 			email: 'user@example.com',
// 			password: 'Secret123',
// 		}

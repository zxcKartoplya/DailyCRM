import { defineStore } from 'pinia'
import LoginService from '~/services/login.services'
import type { LoginData } from '~/types/login'

export const useLoginStore = defineStore('login', () => {
	const login = async (userInfo: LoginData) => {
		console.log('userInfo', userInfo)
		await LoginService.login(userInfo)
	}

	return { login }
})

//  {
// 			email: 'user@example.com',
// 			password: 'Secret123',
// 		}

import { defineStore } from 'pinia'
import { Alert } from '~/types/alert'

export const useAlertStore = defineStore('alert', () => {
	const isShowAlert = ref(false)
	const alert = ref(Alert.Unauthorized)
	let hideTimeout: ReturnType<typeof setTimeout> | null = null

	const showAlert = (typeAlert: Alert) => {
		if (hideTimeout) {
			clearTimeout(hideTimeout)
			hideTimeout = null
		}
		isShowAlert.value = true
		alert.value = typeAlert
		hideTimeout = setTimeout(() => {
			isShowAlert.value = false
			hideTimeout = null
		}, 3000)
	}
	const closeAlert = () => {
		if (hideTimeout) {
			clearTimeout(hideTimeout)
			hideTimeout = null
		}
		isShowAlert.value = false
	}

	return {
		alert,
		closeAlert,
		isShowAlert,
		showAlert,
	}
})

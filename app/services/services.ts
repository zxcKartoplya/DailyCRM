class Service {
	async get(url: string, options = {}) {
		return await customFetch(url, { method: 'GET', ...options })
	}

	async post(url: string, body: any, options = {}) {
		return await customFetch(url, {
			method: 'POST',
			body,
			...options,
		})
	}

	async put(url: string, body: any, options = {}) {
		try {
			const data = await customFetch(url, {
				method: 'PUT',
				body,
				...options,
			})
			return data
		} catch (error) {
			console.error(`Ошибка PUT ${url}:`, error)
		}
	}

	async patch(url: string, body: any, options = {}) {
		try {
			const data = await customFetch(url, {
				method: 'PATCH',
				body,
				...options,
			})
			return data
		} catch (error) {
			console.error(`Ошибка PATCH ${url}:`, error)
		}
	}

	async delete(url: string, options = {}) {
		try {
			const data = await customFetch(url, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				...options,
			})
			return data
		} catch (error) {
			console.error(`Ошибка DELETE ${url}:`, error)
		}
	}
}

export default Service

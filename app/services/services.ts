class Service {
	async get<T>(url: string, options = {}) {
		return (await customFetch(url, { method: 'GET', ...options })) as T
	}

	async post<T>(url: string, body: unknown, options = {}) {
		return (await customFetch(url, { method: 'POST', body, ...options })) as T
	}

	async put<T>(url: string, body: unknown, options = {}) {
		return (await customFetch(url, { method: 'PUT', body, ...options })) as T
	}

	async patch<T>(url: string, body: unknown, options = {}) {
		return (await customFetch(url, { method: 'PATCH', body, ...options })) as T
	}

	async delete<T>(url: string, options = {}) {
		return (await customFetch(url, { method: 'DELETE', ...options })) as T
	}
}

export default Service

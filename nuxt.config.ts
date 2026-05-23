/// <reference path="./types/env.d.ts" />
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	devtools: { enabled: true },
	app: {
		head: {
			link: [
				{ rel: 'icon', type: 'image/svg+xml', href: '/logo.svg?v=1' },
				{ rel: 'shortcut icon', href: '/logo.svg?v=1' },
			],
		},
	},
	modules: [
		'@nuxt/content',
		'@nuxt/fonts',
		'@nuxt/image',
		'@pinia/nuxt',
		'unplugin-icons/nuxt',
	],
	css: ['@/assets/scss/main.scss'],
	runtimeConfig: {
		public: {
			apiBase: process.env.API_URL || '',
			authApiBase: process.env.AUTH_API_URL || '',
		},
	},
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData:
						'@use \"@/assets/scss/_variables.scss\" as *; @use \"@/assets/scss/_mixins.scss\" as *;',
				},
			},
		},
	},
})

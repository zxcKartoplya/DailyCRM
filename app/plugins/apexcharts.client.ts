import VueApexCharts from 'vue3-apexcharts'

declare module 'vue' {
	interface GlobalComponents {
		apexchart: typeof VueApexCharts
	}
}

export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.use(VueApexCharts)
})

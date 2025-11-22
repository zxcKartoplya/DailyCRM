// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/fonts', '@nuxt/image'],
  css: ['@/assets/scss/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // make variables and mixins available in every <style lang="scss">
          additionalData:
            '@use \"@/assets/scss/_variables.scss\" as *; @use \"@/assets/scss/_mixins.scss\" as *;'
        }
      }
    }
  }
})

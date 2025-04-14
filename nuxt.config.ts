export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', 'nuxt-icons'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      URLPokemon: 'https://pokeapi.co/api/v2/'  
    }
  }
});
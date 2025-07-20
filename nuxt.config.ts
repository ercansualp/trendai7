// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss',
    'notivue/nuxt',
    '@nuxtjs/i18n',
    '@pinia/nuxt'
  ],
  i18n: {
    locales: [
      { code: 'en', name: 'en-US', file: 'en.json' },
      { code: 'tr', name: 'tr-TR', file: 'tr.json' },
      // İhtiyacınız olan diğer dilleri buraya ekleyebilirsiniz
    ],
    defaultLocale: 'tr', // Varsayılan dil
    // Eğer tarayıcı dilini otomatik algılamasını isterseniz:
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // root'ta yönlendirme yapar
			alwaysRedirect: false,   // Her zaman yönlendirilsin mi?
      fallbackLocale: 'tr',    // Tarayıcı dili desteklenmiyorsa ne yapılmalı
    }
  },
  css: [
    'notivue/notification.css', // Only needed if using built-in notifications
    'notivue/animations.css', // Only needed if using built-in animations
		'~/assets/css/main.css'
	]
})

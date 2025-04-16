export default class DarkMode {
    static STORAGE_KEY = 'modoOscuro'
  
    static isDarkModeEnabled() {
      return localStorage.getItem(this.STORAGE_KEY) === 'true'
    }
  
    static enable() {
      document.documentElement.classList.add('dark')
      localStorage.setItem(this.STORAGE_KEY, 'true')
    }
  
    static disable() {
      document.documentElement.classList.remove('dark')
      localStorage.setItem(this.STORAGE_KEY, 'false')
    }
  
    static toggle() {
      const isDark = document.documentElement.classList.contains('dark')
      isDark ? this.disable() : this.enable()
    }
  
    static init() {
      const isDark = this.isDarkModeEnabled()
      document.documentElement.classList.toggle('dark', isDark)
    }
  }
  
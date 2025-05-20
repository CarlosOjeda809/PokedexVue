export async function loading() {
    this.loaderElement = document.createElement('div')
    this.loaderElement.innerHTML = `<div class="fixed inset-0 flex items-center justify-center bg-white z-50" id="loading">
          <img src="/img/pokeball.png" class="animate-spin w-20 h-20" alt="Loading..." /></div>`
    this.loaderElement.style.display = 'none'
    document.body.appendChild(this.loaderElement)
}
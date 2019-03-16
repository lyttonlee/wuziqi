let Drawer = require('./Draw')

window.onload = () => {
  const Draw = new Drawer(400, 'mycanvas')
  Draw.createQiPan(10)
  Draw.mount('wzq')
  const btn = document.getElementById('btn')
  btn.onclick = (ev) => {
    Draw.destroy()
  }
}
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
        <section>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>



        <div class="logo">
            <img src="/image/LogoEstrellas.png"> 
        </div>

        <div class="botones" style="cursor:pointer;">
            
        <button class="juega">
            <a href="/casafolder/inicio.html">INICIAR JUEGO</a>
        </button>

        <button class="opci">OPCIONES
            <a href="https://mi-sitio.com/pagina2"></a>
        </button>

        <button class="tiend"> STORE
            <a href="https://mi-sitio.com/pagina2"></a>
        </button>

        </div>
        


            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </section>

<footer>
    <h6 class="piedepag">Derechos reservados de copy right</h6>
</footer>

    </>
  )
}

export default App

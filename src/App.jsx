import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [lista, setLista] = useState([])
  const [loggedIn, setLoggedIn] = useState(false)

  async function Login() {
    const response = await fetch('http://127.1.1.1:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON'
      },
      body: JSON.stringify({
        username: usernameInput.value,
        password: passwordInput.value
      })
    })
    const result = await response.json()
    sessionStorage.setItem('token', result.token)
    if (response.ok)
      setLoggedIn(true)
    alert(result.message)
  }

  useEffect(() => { LoadData() }, [])

  async function LoadData() {
    const response = await fetch('http://127.1.1.1:3000/artworks')
    const result = await response.json()
    setLista(result)
  }

  async function DeleteArt(id) {
    const response = await fetch('http://127.1.1.1:3000/artworks/' + id, {
      method: "DELETE",
      headers: {
        'authorization': sessionStorage.getItem('token')
      }
    })
    const result = await response.json()
    if (response.ok)
      LoadData()
    else
      alert(result.message)
  }

  async function CreateArt() {
    const response = await fetch('http://127.1.1.1:3000/artworks', {
      method: 'POST',
      headers: {
        'authorization': sessionStorage.getItem('token'),
        'Content-Type': 'Application/JSON'
      },
      body: JSON.stringify({
        title: titleInput.value,
        value: valueInput.value
      })
    })
    const result = await response.json()
    if (response.ok)
      LoadData()
    else
      alert(result.message)
  }

  function Logout(){
    sessionStorage.setItem('token',null)
    setLoggedIn(false)
  }

  return (
    <>
      {/* 
        p: padding
        m: margin
        érték: 0-5
        extra:
         t: top
         b: bottom
         s: left (start)
         e: right (end)
        text-
         center
         start
         end
      */}
      <header className='p-4'>
        <h1 className='text-center'>Műalkotások</h1>
      </header>
      <main className='p-4 mt-2 row'>
        <section className='col-12 col-md-6 col-lg-8'>
          <h2>Műalkotások listázása:</h2>
          <ul>
            {lista.map(item =>
              <li key={item.id}>
                Cím: {item.title} érték: {item.value} pár kolbász
                {loggedIn ? <button onClick={() => DeleteArt(item.id)}>Törlés</button> : ""}
              </li>
            )}
          </ul>
        </section>
        <div className='col-12 col-md-6 col-lg-4'>
          <section>
            {loggedIn ? <button onClick={Logout}>Kijelentkezés</button> : 
            <>
              <h2>Bejelentkezés:</h2>
              <label htmlFor="usernameInput">Felhasználónév: </label><input type="text" name="usernameInput" id="usernameInput" /><br />
              <label htmlFor="passwordInput">Jelszó: </label><input type="password" name="passwordInput" id="passwordInput" /><br />
              <button className='btn btn-primary' onClick={Login}>Bejelentkezés</button>
            </> }

          </section>
          <section>
            <h2>Új műalkotás felvétele:</h2>
            <label htmlFor="titleInput">Név: </label><input type="text" name="titleInput" id="titleInput" /><br />
            <label htmlFor="valueInput">Érték: </label><input type="text" name="valueInput" id="valueInput" /><br />
            {loggedIn ? <button className='btn btn-warning' onClick={CreateArt}>Létrehozás</button> : ""}
          </section>
        </div>
      </main>
      <footer className='text-center p-3 mt-2'>
        Név - 2/14FI
      </footer>
    </>
  )
}

export default App

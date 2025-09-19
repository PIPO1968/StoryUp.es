import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  return (
    <div>
      <h1>StoryUp.es</h1>
      {!usuario ? (
        <>
          {mostrarRegistro ? (
            <Register onRegister={setUsuario} />
          ) : (
            <Login onLogin={setUsuario} />
          )}
          <button onClick={() => setMostrarRegistro(!mostrarRegistro)} style={{marginTop:10}}>
            {mostrarRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </>
      ) : (
        <div>
          <p>¡Bienvenido, {usuario.nombre}!</p>
          <p>Ya puedes acceder al chat y grupos.</p>
        </div>
      )}
    </div>
  );
}

export default App;

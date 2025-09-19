import React, { useState } from 'react';
import Login from './Login';

function App() {
  const [usuario, setUsuario] = useState(null);

  return (
    <div>
      <h1>StoryUp.es</h1>
      {!usuario ? (
        <Login onLogin={setUsuario} />
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

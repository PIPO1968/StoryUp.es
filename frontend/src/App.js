
import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
// URL del backend para socket.io (ajusta si usas otro puerto en local)
const SOCKET_URL = 'https://storyup.es';
// Hook para detectar preferencia de color del sistema
function usePrefersDark() {
  const [prefersDark, setPrefersDark] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = e => setPrefersDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefersDark;
}
import './App.css';

// Toast global
function Toast({ toast, onClose }) {
  if (!toast) return null;
  return (
    <div className={`toast fade-in ${toast.type}`} onClick={onClose}>
      {toast.msg}
    </div>
  );
}

function App() {
  // --- Estados y lógica para grabación de audio (push-to-talk) ---
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Iniciar grabación
  const startRecording = async () => {
    if (isRecording) return;
    setAudioBlob(null);
    setAudioUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      showToast('No se pudo acceder al micrófono', 'error');
    }
  };

  // Detener grabación
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Cancelar grabación
  const cancelRecording = () => {
    setIsRecording(false);
    setAudioBlob(null);
    setAudioUrl(null);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  // Adjuntar audio grabado al chat
  const sendAudioMessage = () => {
    if (audioBlob) {
      setChatFile(audioBlob);
      setAudioBlob(null);
      setAudioUrl(null);
    }
  };
  // Temas de color
  const colorThemes = [
    { name: 'Verde', key: 'green', color: '#25d366' },
    { name: 'Azul', key: 'blue', color: '#2196f3' },
    { name: 'Morado', key: 'purple', color: '#9c27b0' },
    { name: 'Naranja', key: 'orange', color: '#ff9800' }
  ];
  const [colorTheme, setColorTheme] = useState(localStorage.getItem('colorTheme') || 'green');
  useEffect(() => {
    document.body.setAttribute('data-color-theme', colorTheme);
    localStorage.setItem('colorTheme', colorTheme);
  }, [colorTheme]);
  // Detectar si es móvil
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  // Cálculo de badges
  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;
  // Mensajes no leídos: contar chats donde hay mensajes de otros usuarios no leídos
  const mensajesNoLeidos = Object.values(chatMessages).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.filter(m => m.sender.id !== profile?.id && !m.leido).length : 0), 0);
  // --- SOCKET.IO ---
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]); // ids
  const [typingState, setTypingState] = useState({}); // chatKey -> typingId

  // Inicializar socket al hacer login
  useEffect(() => {
    if (jwt && profile) {
      const s = io(SOCKET_URL, { transports: ['websocket'] });
      setSocket(s);
      s.emit('login', profile.id);
      s.on('online-users', setOnlineUsers);
      s.on('typing', ({ chatKey, typingId }) => {
        setTypingState(prev => ({ ...prev, [chatKey]: typingId }));
      });
      return () => { s.disconnect(); };
    }
  }, [jwt, profile]);
  // Estado para modo oscuro/claro
  const prefersDark = usePrefersDark();
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || (prefersDark ? 'dark' : 'light');
  });
  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    document.body.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);
  // Estado para mostrar la pantalla de bienvenida
  const [showWelcome, setShowWelcome] = useState(true);
  // Obtener perfil propio y seguidores/seguidos
  const fetchProfile = async (token) => {
    // Notificaciones
    try {
      const res = await fetch(`${API}/notificaciones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setNotificaciones(data);
    } catch { }
    // Perfil
    try {
      const res = await fetch(`${API}/perfil`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setProfile(data);
    } catch { }
    // Seguidores
    try {
      const res = await fetch(`${API}/seguidores`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setSeguidores(data);
    } catch { }
    // Seguidos
    try {
      const res = await fetch(`${API}/seguidos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setSeguidos(data);
    } catch { }
    // Todos los usuarios (para seguir)
    try {
      const res = await fetch(`${API}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setUsuarios(data);
    } catch { }
  };

  // Seguir usuario
  const handleFollow = async (id) => {
    setFollowMsg('');
    try {
      const res = await fetch(`${API}/seguir/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}` }
      });
      if (res.ok) {
        setFollowMsg('¡Ahora sigues a este usuario!');
        fetchProfile(jwt);
      } else {
        setFollowMsg('Error al seguir');
      }
    } catch {
      setFollowMsg('Error de conexión');
    }
  };

  // Dejar de seguir usuario
  const handleUnfollow = async (id) => {
    setFollowMsg('');
    try {
      const res = await fetch(`${API}/dejar-de-seguir/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}` }
      });
      if (res.ok) {
        setFollowMsg('Has dejado de seguir a este usuario');
        fetchProfile(jwt);
      } else {
        setFollowMsg('Error al dejar de seguir');
      }
    } catch {
      setFollowMsg('Error de conexión');
    }
  };

  // Editar perfil
  const handleEditProfile = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    const formData = new FormData();
    if (editName) formData.append('nombre', editName);
    if (editImg) formData.append('imagen', editImg);
    try {
      const res = await fetch(`${API}/perfil`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${jwt}` },
        body: formData
      });
      if (res.ok) {
        setProfileMsg('¡Perfil actualizado!');
        setEditName(''); setEditImg(null);
        fetchProfile(jwt);
      } else {
        setProfileMsg('Error al actualizar');
      }
    } catch {
      setProfileMsg('Error de conexión');
    }
  };
  const [toast, setToast] = useState(null);
  // --- Estados y funciones para notificaciones y perfil ---
  const [notificaciones, setNotificaciones] = useState([]);
  const [notifMsg, setNotifMsg] = useState('');

  // Función global para marcar notificación como leída
  const handleReadNotif = async (id) => {
    setNotifMsg('');
    try {
      const res = await fetch(`${API}/notificaciones/${id}/leer`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}` }
      });
      if (res.ok) {
        setNotifMsg('Notificación marcada como leída');
        fetchProfile(jwt);
      } else {
        setNotifMsg('Error al marcar como leída');
      }
    } catch {
      setNotifMsg('Error de conexión');
    }
  };
  const toastTimeout = useRef();

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(null), 3000);
  };
  const [view, setView] = useState('home');

  // Estado para registro
  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regMsg, setRegMsg] = useState('');

  // Estado para login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMsg, setLoginMsg] = useState('');
  const [jwt, setJwt] = useState('');
  const [feed, setFeed] = useState([]);
  const [profile, setProfile] = useState(null);
  const [seguidores, setSeguidores] = useState([]);
  const [seguidos, setSeguidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [followMsg, setFollowMsg] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [editName, setEditName] = useState('');
  const [editImg, setEditImg] = useState(null);
  const [likes, setLikes] = useState({}); // postId -> {count, liked}
  const [postContent, setPostContent] = useState('');
  const [postMsg, setPostMsg] = useState('');
  const [comments, setComments] = useState({}); // postId -> array
  const [commentInputs, setCommentInputs] = useState({}); // postId -> texto
  const [commentMsg, setCommentMsg] = useState({}); // postId -> mensaje

  // --- Estado y lógica para chat tipo WhatsApp avanzado ---
  const [chatInput, setChatInput] = useState("");
  // Emitir evento typing al escribir
  useEffect(() => {
    if (!socket || !chatUser || !profile) return;
    const chatKey = [profile.id, chatUser.id].sort().join('-');
    if (chatInput) {
      socket.emit('typing', { chatKey, typingId: profile.id });
    } else {
      socket.emit('typing', { chatKey, typingId: null });
    }
    // Limpiar typing al salir del chat
    return () => { socket.emit('typing', { chatKey, typingId: null }); };
  }, [chatInput, chatUser, socket, profile]);
  const [chatUser, setChatUser] = useState(null); // usuario seleccionado para chatear
  const [chatMessages, setChatMessages] = useState({}); // userId -> array de mensajes
  const [favoritos, setFavoritos] = useState([]); // array de userId favoritos
  const [chatFile, setChatFile] = useState(null); // archivo multimedia a enviar
  const chatEndRef = React.useRef();

  // Añadir/quitar favorito
  const toggleFavorito = (userId) => {
    setFavoritos(favs => favs.includes(userId) ? favs.filter(f => f !== userId) : [...favs, userId]);
  };

  // Cargar historial de chat real al seleccionar usuario
  React.useEffect(() => {
    if (!chatUser || !jwt) return;
    const fetchChat = async () => {
      try {
        const res = await fetch(`${API}/chat/${chatUser.id}`, {
          headers: { Authorization: `Bearer ${jwt}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setChatMessages(msgs => ({
            ...msgs,
            [chatUser.id]: data.map(m => ({
              sender: m.emisor_id === profile.id ? profile : usuarios.find(u => u.id === m.emisor_id) || { id: m.emisor_id, nombre: `#${m.emisor_id}` },
              receiver: m.receptor_id === profile.id ? profile : usuarios.find(u => u.id === m.receptor_id) || { id: m.receptor_id, nombre: `#${m.receptor_id}` },
              text: m.texto,
              date: m.creado_en,
              fileUrl: m.archivo_url || null,
              fileType: m.archivo_tipo || null
            }))
          }));
        }
      } catch { }
    };
    fetchChat();
  }, [chatUser, jwt, profile, usuarios]);

  // Scroll automático al final del chat
  React.useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatUser]);

  // Enviar mensaje real al backend
  const handleSendMsg = async (e) => {
    e.preventDefault();
    if ((!chatInput.trim() && !chatFile) || !chatUser) return;
    const formData = new FormData();
    formData.append('texto', chatInput);
    // Si el archivo es un audio grabado (Blob sin type), asígnale un nombre y tipo
    if (chatFile && chatFile instanceof Blob && (!chatFile.type || chatFile.type === 'audio/webm')) {
      const audioFile = new File([chatFile], `audio_${Date.now()}.webm`, { type: 'audio/webm' });
      formData.append('archivo', audioFile);
    } else if (chatFile) {
      formData.append('archivo', chatFile);
    }
    try {
      const res = await fetch(`${API}/chat/${chatUser.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}` },
        body: formData
      });
      if (res.ok) {
        setChatInput("");
        setChatFile(null);
        // Recargar historial tras enviar
        const data = await res.json();
        setChatMessages(msgs => ({
          ...msgs,
          [chatUser.id]: [...(msgs[chatUser.id] || []), {
            sender: profile,
            receiver: chatUser,
            text: data.texto,
            date: data.creado_en,
            fileUrl: data.archivo_url || null,
            fileType: data.archivo_tipo || null
          }]
        }));
      }
    } catch { }
  };

  // URL backend
  const API = 'https://storyup.es/api';

  // Registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegMsg('');
    try {
      const res = await fetch(`${API}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: regNombre, email: regEmail, password: regPassword })
      });
      let data = null;
      try {
        data = await res.json();
      } catch {
        // Si la respuesta no es JSON
        data = null;
      }
      if (res.ok) {
        setRegMsg('¡Registro exitoso! Ya puedes iniciar sesión.');
        showToast('¡Registro exitoso! Ya puedes iniciar sesión.', 'success');
        setRegNombre(''); setRegEmail(''); setRegPassword('');
      } else if (data && data.error) {
        setRegMsg(data.error);
        showToast(data.error, 'error');
      } else {
        setRegMsg('Error inesperado en el registro. Intenta más tarde.');
        showToast('Error inesperado en el registro', 'error');
      }
    } catch (err) {
      setRegMsg('Error de conexión. Revisa tu red o inténtalo más tarde.');
      showToast('Error de conexión', 'error');
    }
  };

  // Login
  // Cargar feed tras login
  // Cargar likes de un post
  const fetchLikes = async (postId, token) => {
    try {
      const res = await fetch(`${API}/posts/${postId}/likes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLikes(prev => ({ ...prev, [postId]: data }));
    } catch {
      setLikes(prev => ({ ...prev, [postId]: { count: 0, liked: false } }));
    }
  };

  // Dar o quitar like
  const handleLike = async (postId) => {
    try {
      const res = await fetch(`${API}/posts/${postId}/likes`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${jwt}` }
      });
      if (res.ok) fetchLikes(postId, jwt);
    } catch { }
  };

  const fetchFeed = async (token) => {
    try {
      const res = await fetch(`${API}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFeed(Array.isArray(data) ? data : []);
      // Cargar comentarios y likes de todos los posts
      if (Array.isArray(data)) {
        for (const post of data) {
          fetchComments(post.id, token);
          fetchLikes(post.id, token);
        }
      }
    } catch {
      setFeed([]);
    }
  };

  // Obtener comentarios de un post
  const fetchComments = async (postId, token) => {
    try {
      const res = await fetch(`${API}/posts/${postId}/comentarios`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setComments(prev => ({ ...prev, [postId]: Array.isArray(data) ? data : [] }));
    } catch {
      setComments(prev => ({ ...prev, [postId]: [] }));
    }
  };

  // Crear comentario
  const handleCreateComment = async (e, postId) => {
    e.preventDefault();
    setCommentMsg(prev => ({ ...prev, [postId]: '' }));
    try {
      const res = await fetch(`${API}/posts/${postId}/comentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({ contenido: commentInputs[postId] || '' })
      });
      if (res.ok) {
        setCommentMsg(prev => ({ ...prev, [postId]: '¡Comentario publicado!' }));
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        fetchComments(postId, jwt);
      } else {
        const data = await res.json();
        setCommentMsg(prev => ({ ...prev, [postId]: data.error || 'Error al comentar' }));
      }
    } catch {
      setCommentMsg(prev => ({ ...prev, [postId]: 'Error de conexión' }));
    }
  };

  // Crear post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    setPostMsg('');
    try {
      const res = await fetch(`${API}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({ contenido: postContent })
      });
      if (res.ok) {
        setPostMsg('¡Publicación creada!');
        setPostContent('');
        fetchFeed(jwt);
      } else {
        const data = await res.json();
        setPostMsg(data.error || 'Error al publicar');
      }
    } catch {
      setPostMsg('Error de conexión');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMsg('');
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setJwt(data.token);
        setLoginMsg('¡Login correcto!');
        showToast('¡Login correcto!', 'success');
        setLoginEmail(''); setLoginPassword('');
        setView('feed');
        fetchFeed(data.token);
        fetchProfile(data.token);
      } else {
        setLoginMsg((data && data.error) || 'Credenciales incorrectas');
        showToast((data && data.error) || 'Credenciales incorrectas', 'error');
      }
    } catch (err) {
      setLoginMsg('Error de conexión');
      showToast('Error de conexión', 'error');
    }
  };

  return (
    <div className="App">
      <Toast toast={toast} onClose={() => setToast(null)} />
      {/* Pantalla de bienvenida */}
      {showWelcome && !jwt && (
        <div className="welcome-screen fade-in">
          <img src="/logo.png" alt="Logo StoryUp" className="welcome-logo" />
          <h1 className="welcome-title">StoryUp</h1>
          <p className="welcome-msg">Conecta, comparte y chatea con tu comunidad. ¡Bienvenido a la red social diferente!</p>
          <div className="welcome-btns">
            <button className="welcome-btn" onClick={() => { setShowWelcome(false); setView('login'); }}>Iniciar sesión</button>
            <button className="welcome-btn" onClick={() => { setShowWelcome(false); setView('register'); }}>Registrarse</button>
          </div>
        </div>
      )}
      {/* Barra de navegación */}
      {jwt && (
        <>
          {!isMobile && (
            <nav className="main-nav">
              <button onClick={() => setView('feed')} className={view === 'feed' ? 'nav-btn nav-btn-active' : 'nav-btn'} style={{ position: 'relative' }}>
                Feed
                {mensajesNoLeidos > 0 && (
                  <span className="badge-nav">{mensajesNoLeidos > 99 ? '99+' : mensajesNoLeidos}</span>
                )}
              </button>
              <button onClick={() => setView('profile')} className={view === 'profile' ? 'nav-btn nav-btn-active' : 'nav-btn'} style={{ position: 'relative' }}>
                Perfil
                {notificacionesNoLeidas > 0 && (
                  <span className="badge-nav">{notificacionesNoLeidas > 99 ? '99+' : notificacionesNoLeidas}</span>
                )}
              </button>
              {/* Selector de tema de color */}
              <div className="color-theme-selector">
                {colorThemes.map(t => (
                  <button key={t.key} className={colorTheme === t.key ? 'color-btn color-btn-active' : 'color-btn'} style={{ background: t.color }} title={t.name} onClick={() => setColorTheme(t.key)} />
                ))}
              </div>
              <button onClick={() => { setJwt(''); setView('login'); }} className="nav-btn nav-btn-logout">Cerrar sesión</button>
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="nav-btn" style={{ marginLeft: 12 }}>
                {theme === 'dark' ? '☀️ Modo claro' : '🌙 Modo oscuro'}
              </button>
            </nav>
          )}
          {/* Bottom bar solo en móvil */}
          {isMobile && (
            <>
              <nav className="bottom-nav">
                <button onClick={() => setView('feed')} className={view === 'feed' ? 'nav-btn nav-btn-active' : 'nav-btn'} style={{ position: 'relative' }}>
                  📰
                  {mensajesNoLeidos > 0 && (
                    <span className="badge-nav">{mensajesNoLeidos > 99 ? '99+' : mensajesNoLeidos}</span>
                  )}
                </button>
                <button onClick={() => setView('profile')} className={view === 'profile' ? 'nav-btn nav-btn-active' : 'nav-btn'} style={{ position: 'relative' }}>
                  👤
                  {notificacionesNoLeidas > 0 && (
                    <span className="badge-nav">{notificacionesNoLeidas > 99 ? '99+' : notificacionesNoLeidas}</span>
                  )}
                </button>
                {/* Selector de tema de color en bottom bar */}
                <div className="color-theme-selector-mobile">
                  {colorThemes.map(t => (
                    <button key={t.key} className={colorTheme === t.key ? 'color-btn color-btn-active' : 'color-btn'} style={{ background: t.color }} title={t.name} onClick={() => setColorTheme(t.key)} />
                  ))}
                </div>
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="nav-btn">
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                <button onClick={() => { setJwt(''); setView('login'); }} className="nav-btn nav-btn-logout">⏻</button>
              </nav>
              {/* Añadir espacio inferior en móvil para que la bottom bar no tape el contenido */}
              <div style={{ height: 56 }} />
            </>
          )}
        </>
      )}
      <header className="App-header" style={jwt ? { marginTop: 60 } : {}}>
        {/* Solo mostrar el resto si no está la pantalla de bienvenida */}
        {!showWelcome && !jwt && (
          <div className="welcome-fake-space" />
        )}
        {view === 'register' && (
          <div className="form-bg-logo">
            <form onSubmit={handleRegister} className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 250 }}>
              <h2>Registro</h2>
              <input type="text" placeholder="Nombre" value={regNombre} onChange={e => setRegNombre(e.target.value)} required />
              <input type="email" placeholder="Email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
              <input type="password" placeholder="Contraseña" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
              <button type="submit" className="scale-btn">Registrarse</button>
              <div style={{ color: regMsg.startsWith('¡') ? 'lightgreen' : 'salmon', minHeight: 24 }}>{regMsg}</div>
            </form>
          </div>
        )}
        {view === 'login' && (
          <div className="form-bg-logo">
            <form onSubmit={handleLogin} className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 250 }}>
              <h2>Login</h2>
              <input type="email" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
              <input type="password" placeholder="Contraseña" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
              <button type="submit" className="scale-btn">Entrar</button>
              <div style={{ color: loginMsg.startsWith('¡') ? 'lightgreen' : 'salmon', minHeight: 24 }}>{loginMsg}</div>
            </form>
          </div>
        )}
        {view === 'feed' && (
          <div className="fade-in" style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
            <h2>Feed de publicaciones</h2>
            <button onClick={() => setView('profile')} className="scale-btn" style={{ marginBottom: 12 }}>Mi perfil</button>
            <form onSubmit={handleCreatePost} className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <textarea placeholder="¿Qué quieres compartir?" value={postContent} onChange={e => setPostContent(e.target.value)} required rows={3} />
              <button type="submit" className="scale-btn">Publicar</button>
              <div style={{ color: postMsg.startsWith('¡') ? 'lightgreen' : 'salmon', minHeight: 24 }}>{postMsg}</div>
            </form>
            <div style={{ textAlign: 'left' }}>
              {feed.length === 0 && <div>No hay publicaciones aún.</div>}
              {feed.map(post => (
                <div key={post.id} className="fade-in" style={{ border: '1px solid #444', borderRadius: 8, padding: 12, marginBottom: 12, background: '#222' }}>
                  <div style={{ fontWeight: 'bold' }}>Usuario #{post.usuario_id}</div>
                  <div>{post.contenido}</div>
                  <div style={{ fontSize: 12, color: '#aaa' }}>{new Date(post.fecha).toLocaleString()}</div>
                  {/* Likes */}
                  <div style={{ margin: '8px 0' }}>
                    <button onClick={() => handleLike(post.id)} className="scale-btn" style={{ background: likes[post.id]?.liked ? '#4caf50' : '#555', color: 'white', border: 'none', borderRadius: 4, padding: '2px 10px', cursor: 'pointer' }}>
                      {likes[post.id]?.liked ? 'Quitar Like' : 'Like'}
                    </button>
                    <span style={{ marginLeft: 8, fontSize: 13 }}>
                      {likes[post.id]?.count || 0} {likes[post.id]?.count === 1 ? 'me gusta' : 'me gustas'}
                    </span>
                  </div>
                  {/* Comentarios */}
                  <div style={{ marginTop: 8, marginLeft: 8 }}>
                    <strong>Comentarios:</strong>
                    <div style={{ marginBottom: 4 }}>
                      {(comments[post.id] && comments[post.id].length > 0)
                        ? comments[post.id].map(c => (
                          <div key={c.id} style={{ fontSize: 13, marginBottom: 2 }}>
                            <span style={{ color: '#8cf' }}>#{c.usuario_id}</span>: {c.contenido}
                          </div>
                        ))
                        : <span style={{ color: '#888' }}>Sin comentarios</span>}
                    </div>
                    <form onSubmit={e => handleCreateComment(e, post.id)} style={{ display: 'flex', gap: 4 }}>
                      <input
                        type="text"
                        placeholder="Añadir comentario"
                        value={commentInputs[post.id] || ''}
                        onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        required
                        style={{ flex: 1 }}
                      />
                      <button type="submit" className="scale-btn">Comentar</button>
                    </form>
                    <div style={{ color: (commentMsg[post.id] || '').startsWith('¡') ? 'lightgreen' : 'salmon', minHeight: 18, fontSize: 12 }}>{commentMsg[post.id] || ''}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => { setJwt(''); setView('login'); }} className="scale-btn">Cerrar sesión</button>
          </div>
        )}

        {view === 'profile' && profile && (
          <div className="fade-in" style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
            <h2>Mi perfil</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 8 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, marginBottom: 2 }}>Actual</div>
                {profile.imagen_perfil && (
                  <img src={profile.imagen_perfil} alt="perfil" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #888' }} />
                )}
              </div>
              {editImg && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13, marginBottom: 2 }}>Nuevo</div>
                  <img src={URL.createObjectURL(editImg)} alt="preview-avatar" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #4caf50' }} />
                </div>
              )}
            </div>
            <div><strong>Nombre:</strong> {profile.nombre}</div>
            <div><strong>Email:</strong> {profile.email}</div>
            <form onSubmit={handleEditProfile} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input type="text" placeholder="Nuevo nombre" value={editName} onChange={e => setEditName(e.target.value)} />
              <input type="file" accept="image/*" onChange={e => setEditImg(e.target.files[0])} />
              {editImg && (
                <div style={{ color: '#4caf50', fontWeight: 'bold', fontSize: 15, marginBottom: 2 }}>
                  ¡Avatar listo para guardar!
                </div>
              )}
              <button type="submit" className="scale-btn">Actualizar perfil</button>
              <div style={{ color: profileMsg.startsWith('¡') ? 'lightgreen' : 'salmon', minHeight: 18 }}>{profileMsg}</div>
            </form>
            <hr style={{ margin: '18px 0' }} />
            <div>
              <strong>Seguidores:</strong> {seguidores.length}
              <ul style={{ fontSize: 14 }}>
                {seguidores.map(u => <li key={u.id}>#{u.id} {u.nombre}</li>)}
              </ul>
            </div>
            <div>
              <strong>Seguidos:</strong> {seguidos.length}
              <ul style={{ fontSize: 14 }}>
                {seguidos.map(u => (
                  <li key={u.id}>
                    #{u.id} {u.nombre} <button onClick={() => handleUnfollow(u.id)} className="scale-btn" style={{ marginLeft: 8 }}>Dejar de seguir</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Seguir usuarios:</strong>
              <ul style={{ fontSize: 14 }}>
                {usuarios.filter(u => u.id !== profile.id && !seguidos.some(s => s.id === u.id)).map(u => (
                  <li key={u.id}>
                    #{u.id} {u.nombre} <button onClick={() => handleFollow(u.id)} className="scale-btn" style={{ marginLeft: 8 }}>Seguir</button>
                  </li>
                ))}
              </ul>
              <div style={{ color: followMsg.startsWith('¡') ? 'lightgreen' : 'salmon', minHeight: 18 }}>{followMsg}</div>
            </div>
            <hr style={{ margin: '18px 0' }} />
            <div>
              <strong>Notificaciones:</strong>
              <ul style={{ fontSize: 14 }}>
                {notificaciones.length === 0 && <li>No tienes notificaciones.</li>}
                {notificaciones.map(n => (
                  <li key={n.id} style={{ marginBottom: 6, color: n.leida ? '#aaa' : '#fff' }}>
                    <span>{n.mensaje}</span>
                    {!n.leida && (
                      <button onClick={() => handleReadNotif(n.id)} className="scale-btn" style={{ marginLeft: 8 }}>Marcar como leída</button>
                    )}
                  </li>
                ))}
              </ul>
              <div style={{ color: notifMsg.startsWith('Notificación') ? 'lightgreen' : 'salmon', minHeight: 18 }}>{notifMsg}</div>
            </div>
            {/* Chat tipo WhatsApp avanzado */}
            <hr style={{ margin: '18px 0' }} />
            <div className="chat-whatsapp">
              {/* Barra de favoritos */}
              <div className="chat-favs-bar">
                {usuarios.filter(u => u.id !== profile.id).map(u => (
                  <div key={u.id} className={`chat-fav-user${favoritos.includes(u.id) ? ' fav' : ''}${chatUser && chatUser.id === u.id ? ' selected' : ''}`}
                    onClick={() => setChatUser(u)}>
                    <img src={u.imagen_perfil || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(u.nombre)} alt="perfil" className="chat-fav-img" />
                    <span className="chat-fav-nombre">{u.nombre}</span>
                    <button className="chat-fav-star" onClick={e => { e.stopPropagation(); toggleFavorito(u.id); }}>{favoritos.includes(u.id) ? '★' : '☆'}</button>
                  </div>
                ))}
              </div>
              {/* Área de chat */}
              {chatUser ? (
                <>
                  <div className="chat-header">
                    <img src={chatUser.imagen_perfil || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(chatUser.nombre)} alt="perfil" className="chat-fav-img" />
                    <span className={`chat-fav-nombre${typingState[[profile.id, chatUser.id].sort().join('-')] === chatUser.id ? ' typing-glow' : ''}`}>{chatUser.nombre}</span>
                    {/* Estado en línea */}
                    {onlineUsers.includes(chatUser.id) ? (
                      <span style={{ color: '#4caf50', fontSize: 13, marginLeft: 8 }}>● en línea</span>
                    ) : (
                      <span style={{ color: '#aaa', fontSize: 13, marginLeft: 8 }}>● desconectado</span>
                    )}
                  </div>
                  <div className="chat-messages">
                    {(chatMessages[chatUser.id] && chatMessages[chatUser.id].length > 0)
                      ? chatMessages[chatUser.id].map((msg, i) => (
                        <div key={i} className={msg.sender.id === profile.id ? 'chat-msg chat-msg-own animated' : 'chat-msg chat-msg-other animated'}>
                          <img src={msg.sender.imagen_perfil || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(msg.sender.nombre)} alt="perfil" className="chat-msg-img" />
                          <div className="chat-msg-content">
                            <span className="chat-msg-nombre">{msg.sender.nombre}</span>
                            {msg.text && <span>{msg.text}</span>}
                            {msg.fileUrl && msg.fileType && msg.fileType.startsWith('image') && (
                              <img src={msg.fileUrl} alt="img" className="chat-media-img" />
                            )}
                            {msg.fileUrl && msg.fileType && msg.fileType.startsWith('video') && (
                              <video src={msg.fileUrl} controls className="chat-media-video" />
                            )}
                            {msg.fileUrl && msg.fileType && msg.fileType.startsWith('audio') && (
                              <audio src={msg.fileUrl} controls className="chat-media-audio" />
                            )}
                            <span className="chat-msg-date">{new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      ))
                      : <div className="chat-placeholder">No hay mensajes aún.</div>}
                    <div ref={chatEndRef} />
                  </div>
                  <form className="chat-input-row" onSubmit={handleSendMsg}>
                    <input type="text" className="chat-input" placeholder={`Mensaje para ${chatUser.nombre}...`} value={chatInput} onChange={e => setChatInput(e.target.value)} autoComplete="off" />
                    <input type="file" accept="image/*,video/*" onChange={e => setChatFile(e.target.files[0])} className="chat-file-input" />
                    {/* Botón de micrófono push-to-talk */}
                    <button
                      type="button"
                      className={`chat-mic-btn${isRecording ? ' recording' : ''}`}
                      title={isRecording ? 'Grabando...' : 'Mantén pulsado para grabar audio'}
                      style={{ fontSize: 20, margin: '0 4px', background: isRecording ? '#e53935' : undefined, color: isRecording ? '#fff' : undefined }}
                      onMouseDown={startRecording}
                      onMouseUp={stopRecording}
                      onMouseLeave={isRecording ? cancelRecording : undefined}
                      onTouchStart={startRecording}
                      onTouchEnd={stopRecording}
                    >🎤</button>
                    <button type="submit" className="chat-send-btn">Enviar</button>
                  </form>
                  {chatFile && (
                    <div className="chat-file-preview">
                      {chatFile.type && chatFile.type.startsWith('image') ? (
                        <img src={URL.createObjectURL(chatFile)} alt="preview" className="chat-media-img" />
                      ) : chatFile.type && chatFile.type.startsWith('video') ? (
                        <video src={URL.createObjectURL(chatFile)} controls className="chat-media-video" />
                      ) : chatFile.type && chatFile.type.startsWith('audio') ? (
                        <audio src={URL.createObjectURL(chatFile)} controls className="chat-media-audio" />
                      ) : null}
                      <button onClick={() => setChatFile(null)} className="chat-file-cancel">✕</button>
                    </div>
                  )}
                  {/* Previsualización de audio grabado antes de enviar */}
                  {audioUrl && !chatFile && (
                    <div className="chat-file-preview">
                      <audio src={audioUrl} controls className="chat-media-audio" />
                      <button onClick={sendAudioMessage} className="chat-file-send">Enviar audio</button>
                      <button onClick={cancelRecording} className="chat-file-cancel">Cancelar</button>
                    </div>
                  )}
                </>
              ) : (
                <div className="chat-placeholder">Selecciona un usuario para chatear</div>
              )}
            </div>
            <button onClick={() => setView('feed')} className="scale-btn" style={{ marginTop: 16 }}>Volver al feed</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
// Forzar redeploy en Vercel


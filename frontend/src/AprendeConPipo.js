import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';

const ASIGNATURAS = [
    'Matemáticas',
    'Lengua',
    'Literatura',
    'Naturaleza',
    'Geografía e Historia',
    'Vida Real',
    'Real Life English',
    'Extrema General'
];

const CURSOS = ['4ESO', '6ESO', '8ESO'];

function AprendeConPipo() {
    const [asignatura, setAsignatura] = useState('');
    const [curso, setCurso] = useState('6ESO');
    const [pregunta, setPregunta] = useState(null);
    const [respuesta, setRespuesta] = useState('');
    const [tiempo, setTiempo] = useState(600);
    const [timerActivo, setTimerActivo] = useState(false);
    const [resultado, setResultado] = useState('');
    const [likes, setLikes] = useState(0);
    const timerRef = useRef();

    // Simulación de carga de preguntas (luego se cargará desde archivos)
    const preguntasDemo = [
        { texto: '¿Cuánto es 2+2?', respuesta: '4', asignatura: 'Matemáticas', curso: '6ESO', tipo: 'normales' },
        { texto: '¿Capital de España?', respuesta: 'Madrid', asignatura: 'Geografía e Historia', curso: '6ESO', tipo: 'normales' },
        { texto: '¿Quién escribió Don Quijote?', respuesta: 'Cervantes', asignatura: 'Literatura', curso: '6ESO', tipo: 'normales' }
    ];

    useEffect(() => {
        if (timerActivo && tiempo > 0) {
            timerRef.current = setTimeout(() => setTiempo(tiempo - 1), 1000);
        } else if (tiempo === 0) {
            setResultado('¡Tiempo agotado!');
            setTimerActivo(false);
        }
        return () => clearTimeout(timerRef.current);
    }, [timerActivo, tiempo]);

    const iniciarPregunta = () => {
        setResultado('');
        setRespuesta('');
        setTiempo(600);
        setTimerActivo(true);
        // Selección aleatoria de pregunta demo (luego se filtrará por asignatura/curso)
        const filtradas = preguntasDemo.filter(p => (asignatura ? p.asignatura === asignatura : true) && (curso ? p.curso === curso : true));
        setPregunta(filtradas[Math.floor(Math.random() * filtradas.length)] || null);
    };

    const comprobarRespuesta = () => {
        setTimerActivo(false);
        if (!pregunta) return;
        const respUser = respuesta.trim().toLowerCase();
        const respCorrecta = pregunta.respuesta.trim().toLowerCase();
        let likesGanados = 0;
        if (respUser === respCorrecta) {
            if (tiempo > 480) likesGanados = 1;
            else if (tiempo > 240) likesGanados = 0.5;
            else likesGanados = 0.25;
            setResultado('¡Correcto! +' + likesGanados + ' likes');
        } else {
            likesGanados = -0.5;
            setResultado('Incorrecto. Respuesta: ' + pregunta.respuesta);
        }
        setLikes(l => Math.max(0, l + likesGanados));
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            {/* Imagen de Pipo FIJA a la izquierda de la página */}
            <div style={{ width: 200, minWidth: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 60 }}>
                <img src="/assets/Premio1.png" alt="" style={{ width: 160, height: 'auto', borderRadius: 18, boxShadow: '0 4px 16px #ffd54f88', background: '#fff' }} />
            </div>
            {/* Bloque generador centrado */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <div style={{ maxWidth: 900, margin: '40px auto', background: '#fffbe7', borderRadius: 24, boxShadow: '0 8px 24px #ffd54f', padding: 36, border: '3px dashed #ff4081', position: 'relative' }}>
                    <h1 style={{ textAlign: 'center', color: '#ff4081', fontFamily: 'Comic Sans MS, cursive', letterSpacing: 2 }}>Aprende con Pipo</h1>
                    <div style={{ display: 'flex', gap: 32 }}>
                        {/* Sidebar opciones */}
                        <div style={{ width: 220, background: '#fffbe6', borderRadius: 12, boxShadow: '0 2px 8px #ffe06633', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
                            <label style={{ fontWeight: 'bold', color: '#4db6ac' }}>Asignatura</label>
                            <select value={asignatura} onChange={e => setAsignatura(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #4db6ac' }}>
                                <option value="">Todas</option>
                                {ASIGNATURAS.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            <label style={{ fontWeight: 'bold', color: '#4db6ac' }}>Curso</label>
                            <select value={curso} onChange={e => setCurso(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #4db6ac' }}>
                                {CURSOS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <div style={{ fontWeight: 'bold', color: '#ff4081', marginTop: 18 }}>Likes: <span style={{ color: '#28a745' }}>{likes}</span></div>
                        </div>
                        {/* Bloque principal */}
                        <div style={{ flex: 1 }}>
                            <div className="timer" style={{ fontSize: '2em', color: '#ff4081', textAlign: 'center', marginBottom: 18, background: '#fffde7', borderRadius: 12, boxShadow: '0 2px 8px #ffd54f', padding: '10px 0', border: '2px solid #ff4081', cursor: timerActivo ? 'default' : 'pointer' }} onClick={() => !timerActivo && iniciarPregunta()}>
                                {timerActivo ? `Tiempo restante: ${Math.floor(tiempo / 60)}:${(tiempo % 60).toString().padStart(2, '0')}` : 'Mostrar pregunta y empezar cuenta atrás'}
                            </div>
                            {pregunta && (
                                <div className="question-block" style={{ background: '#b3e5fc', borderRadius: 16, padding: 18, boxShadow: '0 2px 8px #4fc3f7', border: '2px dashed #0077cc', marginBottom: 18 }}>
                                    <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>{pregunta.texto}</div>
                                    {timerActivo && (
                                        <>
                                            <input type="text" value={respuesta} onChange={e => setRespuesta(e.target.value)} placeholder="Escribe tu respuesta..." style={{ border: '2px solid #ff4081', borderRadius: 6, padding: 8, fontSize: '1em', marginTop: 10, width: '100%' }} autoFocus />
                                            <button onClick={comprobarRespuesta} style={{ background: '#ff4081', marginTop: 10 }}>Responder</button>
                                        </>
                                    )}
                                    <div className="result" style={{ fontSize: '1.2em', marginTop: 20, color: '#0077cc', background: '#fffde7', borderRadius: 10, padding: 10, boxShadow: '0 2px 8px #ffd54f' }}>{resultado}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AprendeConPipo;

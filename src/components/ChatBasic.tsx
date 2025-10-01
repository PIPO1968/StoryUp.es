import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://kvvsbomvoxvvunxkkjyf.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2dnNib212b3h2dnVueGtranlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzI4NjIsImV4cCI6MjA3NDY0ODg2Mn0.DSriZyytXiCDbutr6XJyV-0DAQh87G5EEVUOR2IvZ8k'
);

function ChatBasic({ currentUser }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Cargar usuarios para seleccionar destinatario
    useEffect(() => {
        async function fetchUsers() {
            const { data, error } = await supabase.from('users').select('*');
            if (data) {
                setUsers(data.filter(u => u.id !== currentUser.id));
            }
        }
        fetchUsers();
    }, [currentUser]);

    // Cargar mensajes entre los dos usuarios
    useEffect(() => {
        if (!selectedUser) return;
        async function fetchMessages() {
            setLoading(true);
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .or(`(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUser.id}),(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUser.id})`)
                .order('timestamp', { ascending: true });
            if (data) {
                setMessages(data);
            }
            setLoading(false);
        }
        fetchMessages();
    }, [selectedUser, currentUser]);

    // Enviar mensaje
    async function sendMessage() {
        setErrorMsg('');
        if (!newMessage.trim() || !selectedUser) return;
        const messageObj = {
            sender_id: currentUser.id,
            receiver_id: selectedUser.id,
            text: newMessage.trim(),
            timestamp: new Date().toISOString(),
        };
        const { error } = await supabase.from('chat_messages').insert(messageObj);
        if (!error) {
            setMessages(prev => [...prev, messageObj]);
            setNewMessage('');
        } else {
            setErrorMsg('Error enviando mensaje: ' + error.message);
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto', padding: 20, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001' }}>
            {errorMsg && (
                <div style={{ color: 'red', marginBottom: 10 }}>{errorMsg}</div>
            )}
            <h2 style={{ marginBottom: 16 }}>Chat básico</h2>
            <div style={{ marginBottom: 16 }}>
                <label>Selecciona usuario para chatear:</label>
                <select value={selectedUser?.id || ''} onChange={e => {
                    const user = users.find(u => u.id === e.target.value);
                    setSelectedUser(user);
                }} style={{ width: '100%', padding: 8, marginTop: 8 }}>
                    <option value="">-- Selecciona --</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>{u.username || u.name || u.email}</option>
                    ))}
                </select>
            </div>
            {selectedUser && (
                <div style={{ marginBottom: 16, minHeight: 120, background: '#f3f4f6', borderRadius: 8, padding: 8 }}>
                    {loading ? <div>Cargando mensajes...</div> : (
                        messages.length === 0 ? <div>No hay mensajes aún.</div> : (
                            messages.map((msg, idx) => (
                                <div key={idx} style={{ marginBottom: 8, textAlign: msg.sender_id === currentUser.id ? 'right' : 'left' }}>
                                    <span style={{ background: msg.sender_id === currentUser.id ? '#dbeafe' : '#fef3c7', padding: '4px 8px', borderRadius: 6 }}>
                                        {msg.text}
                                    </span>
                                    <div style={{ fontSize: 10, color: '#888' }}>{new Date(msg.timestamp).toLocaleString()}</div>
                                </div>
                            ))
                        )
                    )}
                </div>
            )}
            {selectedUser && (
                <div style={{ display: 'flex', gap: 8 }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                        style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
                    />
                    <button onClick={sendMessage} style={{ padding: '8px 16px', borderRadius: 6, background: '#3b82f6', color: '#fff', border: 'none' }}>
                        Enviar
                    </button>
                </div>
            )}
        </div>
    );
}

export default ChatBasic;

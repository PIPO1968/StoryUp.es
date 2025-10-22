import React, { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useNavigate } from 'react-router-dom';
import SidebarHistoria from './SidebarHistoria';

function CrearHistoria({ usuario }) {
    const [title, setTitle] = useState("");
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [image, setImage] = useState(null);
    const [type, setType] = useState("Real");
    const [theme, setTheme] = useState("Aventura");
    const [anonimo, setAnonimo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        const rawContent = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
        if (!title.trim() || !editorState.getCurrentContent().hasText()) {
            setError("Debes completar el título y el contenido.");
            return;
        }
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://storyup-backend.onrender.com/api';
            let imageUrl = null;
            if (image) {
                const formData = new FormData();
                formData.append('image', image);
                const imgRes = await fetch(`${API_URL}/upload`, {
                    method: 'POST',
                    body: formData
                });
                if (imgRes.ok) {
                    const data = await imgRes.json();
                    imageUrl = data.url;
                } else {
                    setError('No se pudo subir la imagen.');
                    setLoading(false);
                    return;
                }
            }
            const res = await fetch(`${API_URL}/stories`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content: rawContent, type, theme, anonimo, authorId: usuario?._id, image: imageUrl })
            });
            // ...manejo de respuesta...
        } catch (err) {
            setError('Error al crear la historia');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* ...campos del formulario y editor... */}
        </form>
    );
}

export default CrearHistoria;

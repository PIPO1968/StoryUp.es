#!/bin/bash

# Script para limpiar las páginas de noticias, estadísticas y concursos
# y dejarlas como páginas "en construcción"

# Crear archivo temporal con las páginas limpias
cat > /tmp/clean_pages.txt << 'EOF'

// Página de Noticias - Limpia
{currentPage === 'noticias' && (
    <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '2rem'
    }}>
        <div style={{
            textAlign: 'center',
            maxWidth: '500px'
        }}>
            <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>📰</div>
            <h1 style={{
                fontSize: '2rem',
                color: '#3b82f6',
                marginBottom: '1rem'
            }}>
                Noticias
            </h1>
            <p style={{
                fontSize: '1.1rem',
                color: '#6b7280',
                marginBottom: '2rem'
            }}>
                Esta sección estará disponible próximamente.
            </p>
            <div style={{
                padding: '1rem 2rem',
                backgroundColor: '#dbeafe',
                borderRadius: '8px',
                border: '1px solid #93c5fd'
            }}>
                <p style={{
                    color: '#1d4ed8',
                    margin: 0,
                    fontSize: '0.9rem'
                }}>
                    🚧 Página en construcción - Se desarrollará junto con las funcionalidades de Perfil
                </p>
            </div>
        </div>
    </div>
)}

// Página de Estadísticas - Limpia
{currentPage === 'estadisticas' && (
    <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '2rem'
    }}>
        <div style={{
            textAlign: 'center',
            maxWidth: '500px'
        }}>
            <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>📊</div>
            <h1 style={{
                fontSize: '2rem',
                color: '#3b82f6',
                marginBottom: '1rem'
            }}>
                Estadísticas
            </h1>
            <p style={{
                fontSize: '1.1rem',
                color: '#6b7280',
                marginBottom: '2rem'
            }}>
                Esta sección estará disponible próximamente.
            </p>
            <div style={{
                padding: '1rem 2rem',
                backgroundColor: '#dbeafe',
                borderRadius: '8px',
                border: '1px solid #93c5fd'
            }}>
                <p style={{
                    color: '#1d4ed8',
                    margin: 0,
                    fontSize: '0.9rem'
                }}>
                    🚧 Página en construcción - Se desarrollará junto con las funcionalidades de Perfil
                </p>
            </div>
        </div>
    </div>
)}

// Página de Concursos - Limpia
{currentPage === 'concursos' && (
    <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '2rem'
    }}>
        <div style={{
            textAlign: 'center',
            maxWidth: '500px'
        }}>
            <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🏆</div>
            <h1 style={{
                fontSize: '2rem',
                color: '#3b82f6',
                marginBottom: '1rem'
            }}>
                Concursos
            </h1>
            <p style={{
                fontSize: '1.1rem',
                color: '#6b7280',
                marginBottom: '2rem'
            }}>
                Esta sección estará disponible próximamente.
            </p>
            <div style={{
                padding: '1rem 2rem',
                backgroundColor: '#dbeafe',
                borderRadius: '8px',
                border: '1px solid #93c5fd'
            }}>
                <p style={{
                    color: '#1d4ed8',
                    margin: 0,
                    fontSize: '0.9rem'
                }}>
                    🚧 Página en construcción - Se desarrollará junto con las funcionalidades de Perfil
                </p>
            </div>
        </div>
    </div>
)}

EOF

echo "Páginas limpias preparadas para implementación"
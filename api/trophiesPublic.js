// API pública para trofeos disponibles
const { TROPHIES } = require('./trophyHelper');

module.exports = async function handler(req, res) {
    if (req.method === 'GET') {
        // Trofeos completos según la tabla propuesta
        const trophies = [
            // Fáciles (pluma, acciones básicas)
            { id: 1, image: 'Premio1.png', name: 'Primer Paso', condition: 'Publica tu primera historia', description: 'Has dado tu primer paso en StoryUp publicando una historia. (Pluma: Escritura)', likes: 5 },
            { id: 2, image: 'Premio4.png', name: 'Escritor', condition: 'Publica 5 historias', description: '¡Ya tienes 5 historias publicadas! Tu creatividad crece. (Pluma: Escritura)', likes: 10 },
            { id: 3, image: 'Premio12.png', name: 'Narrador Estrella', condition: 'Publica 25 historias', description: '¡25 historias! Eres un narrador destacado en la comunidad. (Pluma: Escritura)', likes: 25 },
            { id: 4, image: 'Premio27.png', name: 'Autor Prolífico', condition: 'Publica 5 historias', description: 'Tu constancia te convierte en un autor prolífico. (Pluma: Escritura)', likes: 10 },
            // Comunicación (muñeco con micro, chat, comentarios)
            { id: 5, image: 'Premio2.png', name: 'Colaborador', condition: 'Comenta en 5 historias diferentes', description: 'Has aportado valor comentando en varias historias. (Micro: Comunicación)', likes: 5 },
            { id: 6, image: 'Premio7.png', name: 'Crítico Constructivo', condition: 'Comenta en 25 historias diferentes', description: 'Tus comentarios enriquecen la comunidad. (Micro: Comunicación)', likes: 15 },
            { id: 7, image: 'Premio29.png', name: 'Comunicador', condition: 'Escribe 50 comentarios útiles', description: 'Eres un comunicador activo y constructivo. (Micro: Comunicación)', likes: 30 },
            { id: 8, image: 'Premio5.png', name: 'Conversador', condition: 'Envía 50 mensajes en el chat', description: 'Eres activo en la conversación y el apoyo. (Micro: Comunicación)', likes: 10 },
            { id: 9, image: 'Premio18.png', name: 'Chat Activo', condition: 'Participa en el chat durante 7 días seguidos', description: 'Tu constancia en el chat te hace visible y valorado. (Micro: Comunicación)', likes: 20 },
            // Likes y popularidad (estrella, corazones)
            { id: 10, image: 'Premio6.png', name: 'Primer Like', condition: 'Consigue tu primer like', description: 'Has recibido tu primer reconocimiento de la comunidad. (Estrella: Popularidad)', likes: 2 },
            { id: 11, image: 'Premio25.png', name: 'Popular', condition: 'Consigue 25 likes en total', description: 'Tus historias empiezan a ser populares entre los usuarios. (Estrella: Popularidad)', likes: 10 },
            { id: 12, image: 'Premio30.png', name: 'Leyenda Literaria', condition: 'Consigue 100 likes en total', description: '¡100 likes! Tus historias son legendarias en StoryUp. (Estrella: Popularidad)', likes: 50 },
            { id: 13, image: 'Premio23.png', name: 'Sociable', condition: 'Consigue 10 likes en tus historias', description: 'Tus historias generan interacción y simpatía. (Estrella: Popularidad)', likes: 5 },
            { id: 14, image: 'Premio24.png', name: 'Historia Viral', condition: 'Una historia alcanza 25 likes', description: 'Has creado una historia viral en la plataforma. (Estrella: Popularidad)', likes: 25 },
            // Fidelidad y logros globales (logo StoryUp)
            { id: 15, image: 'Premio11.png', name: '1 Mes de Fidelidad', condition: 'Cumple 1 mes inscrito en StoryUp', description: '¡Gracias por tu primer mes en StoryUp! Sigue participando. (Logo: Fidelidad)', likes: 5 },
            { id: 16, image: 'Premio13.jpg', name: '1 Año de Fidelidad', condition: 'Cumple 1 año inscrito en StoryUp', description: '¡Un año de historias y amistad! Eres parte fundamental. (Logo: Fidelidad)', likes: 20 },
            { id: 17, image: 'Premio15.jpg', name: '3 Años de Fidelidad', condition: 'Cumple 3 años inscrito en StoryUp', description: '¡Tres años de creatividad y comunidad! Eres un veterano. (Logo: Fidelidad)', likes: 50 },
            { id: 18, image: 'Premio10.png', name: '5 Años de Fidelidad', condition: 'Cumple 5 años inscrito en StoryUp', description: '¡Cinco años! Tu fidelidad y participación son ejemplares. (Logo: Fidelidad)', likes: 100 },
            { id: 19, image: 'Premio21.png', name: 'Leyenda', condition: 'Consigue todos los trofeos', description: 'Has alcanzado todos los logros posibles en StoryUp. (Logo: Logro global)', likes: 100 },
            // Concursos y participación
            { id: 20, image: 'Premio22.png', name: 'Campeón Concurso', condition: 'Gana un concurso oficial', description: 'Has demostrado tu talento ganando un concurso. (Trofeo: Concurso)', likes: 50 },
            { id: 21, image: 'Premio32.png', name: 'Participante Concurso', condition: 'Participa en 3 concursos diferentes', description: 'Tu espíritu competitivo te lleva a nuevos retos. (Trofeo: Concurso)', likes: 10 },
            // Amigos y comunidad
            { id: 22, image: 'Premio8.png', name: 'Amigo Ejemplar', condition: 'Consigue 5 amigos en la plataforma', description: 'Has creado lazos y amistades en StoryUp. (Muñeco: Comunidad)', likes: 5 },
            { id: 23, image: 'Premio20.png', name: 'Embajador', condition: 'Consigue 25 amigos', description: 'Eres un verdadero embajador de la comunidad. (Muñeco: Comunidad)', likes: 25 },
            // Secciones y exploración
            { id: 24, image: 'Premio9.png', name: 'Explorador', condition: 'Visita todas las secciones de StoryUp', description: 'Has explorado cada rincón de la plataforma. (Mapa: Exploración)', likes: 10 },
            { id: 25, image: 'Premio19.png', name: 'Multiacción', condition: 'Usas todas las funciones del perfil', description: 'Has probado todas las herramientas de StoryUp. (Herramientas: Multiacción)', likes: 20 },
            { id: 26, image: 'Premio31.png', name: 'Maestro de Géneros', condition: 'Publica historias en 3 géneros diferentes', description: 'Dominas la narrativa en varios géneros. (Pluma: Escritura)', likes: 20 },
            { id: 27, image: 'Premio17.png', name: 'Historia con Imagen', condition: 'Publica 10 historias con imagen', description: 'Tu creatividad visual destaca en StoryUp. (Imagen: Creatividad)', likes: 15 },
            { id: 28, image: 'Premio16.png', name: 'Noticia Destacada', condition: 'Publica una noticia que recibe 20 likes', description: 'Has publicado una noticia relevante para la comunidad. (Noticia: Participación)', likes: 20 },
            // Negativos
            { id: 90, image: 'Negativo1.png', name: 'Inactividad Prolongada', condition: 'Sin conectarse más de 30 días', description: 'Has estado inactivo demasiado tiempo. (Alerta: Inactividad)', likes: -20 },
            { id: 91, image: 'Negativo2.png', name: 'Palabra Prohibida', condition: 'Usar palabra prohibida en historia/chat', description: 'Has usado lenguaje inapropiado en la plataforma. (Alerta: Moderación)', likes: -30 },
            { id: 92, image: 'Negativo3.png', name: 'Mala Escritura', condition: 'Publicar historia con faltas graves de ortografía', description: 'Tu historia fue reportada por mala escritura. (Alerta: Calidad)', likes: -15 },
            { id: 93, image: 'Negativo4.png', name: 'Reporte de Usuario', condition: 'Recibes 3 reportes de otros usuarios', description: 'Tu comportamiento ha sido reportado por la comunidad. (Alerta: Moderación)', likes: -50 },
            { id: 94, image: 'Negativo5.png', name: 'Spam', condition: 'Publicar contenido repetitivo o irrelevante', description: 'Has publicado spam y pierdes reputación. (Alerta: Moderación)', likes: -25 }
        ];
        return res.status(200).json({ trophies });
    }
    return res.status(405).json({ error: 'Método no permitido' });
};

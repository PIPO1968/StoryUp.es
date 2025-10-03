// Script para generar datos de ejemplo para StoryUp.es
// Ejecutar en la consola del navegador

// Datos de ejemplo para historias
const sampleStories = [
    {
        id: 'story-1',
        title: 'La aventura en el bosque mágico',
        content: 'Había una vez un niño llamado Pablo que descubrió un bosque mágico...',
        type: 'Ficticia',
        theme: 'Aventura',
        author: { id: 'user-1', username: 'pablo_writer', name: 'Pablo García' },
        likes: 15,
        likedBy: ['user-2', 'user-3', 'user-4'],
        createdAt: new Date('2025-10-01').toISOString(),
        updatedAt: new Date('2025-10-01').toISOString()
    },
    {
        id: 'story-2',
        title: 'Mi primer día de colegio',
        content: 'Recuerdo perfectamente mi primer día de colegio, estaba muy nervioso...',
        type: 'Real',
        theme: 'Corazón',
        author: { id: 'user-2', username: 'maria_teacher', name: 'María López' },
        likes: 23,
        likedBy: ['user-1', 'user-3', 'user-5', 'user-6'],
        createdAt: new Date('2025-10-02').toISOString(),
        updatedAt: new Date('2025-10-02').toISOString()
    },
    {
        id: 'story-3',
        title: 'El dragón y la princesa valiente',
        content: 'En un reino muy lejano vivía una princesa que no esperaba ser rescatada...',
        type: 'Ficticia',
        theme: 'Fantasía',
        author: { id: 'user-3', username: 'ana_student', name: 'Ana Martín' },
        likes: 8,
        likedBy: ['user-1', 'user-2'],
        createdAt: new Date('2025-10-03').toISOString(),
        updatedAt: new Date('2025-10-03').toISOString()
    }
];

// Datos de ejemplo para noticias
const sampleNews = [
    {
        id: 'news-1',
        title: 'Nueva función de historias colaborativas en StoryUp',
        content: 'Nos complace anunciar que StoryUp ahora permite crear historias colaborativas...',
        summary: 'StoryUp introduce historias colaborativas para fomentar la creatividad grupal',
        author: { id: 'admin-1', username: 'admin', name: 'Administrador', role: 'admin' },
        category: 'StoryUp',
        featured: true,
        likes: 42,
        likedBy: ['user-1', 'user-2', 'user-3', 'user-4', 'user-5'],
        views: 156,
        createdAt: new Date('2025-10-04').toISOString(),
        updatedAt: new Date('2025-10-04').toISOString()
    },
    {
        id: 'news-2',
        title: 'Concurso de cuentos de Halloween 2025',
        content: 'Se abre el concurso anual de cuentos de terror para celebrar Halloween...',
        summary: 'Participa en nuestro concurso de cuentos de Halloween con premios increíbles',
        author: { id: 'teacher-1', username: 'prof_literatura', name: 'Carmen Ruiz', role: 'teacher' },
        category: 'Educación',
        featured: false,
        likes: 28,
        likedBy: ['user-1', 'user-3', 'user-6'],
        views: 89,
        createdAt: new Date('2025-10-03').toISOString(),
        updatedAt: new Date('2025-10-03').toISOString()
    },
    {
        id: 'news-3',
        title: 'Nuevos talleres de escritura creativa',
        content: 'Este mes comenzamos una serie de talleres de escritura creativa...',
        summary: 'Talleres gratuitos de escritura creativa para todas las edades',
        author: { id: 'teacher-2', username: 'prof_arte', name: 'Miguel Torres', role: 'teacher' },
        category: 'Cultura',
        featured: false,
        likes: 19,
        likedBy: ['user-2', 'user-4', 'user-5'],
        views: 67,
        createdAt: new Date('2025-10-02').toISOString(),
        updatedAt: new Date('2025-10-02').toISOString()
    }
];

// Función para cargar datos de ejemplo
console.log('🚀 Cargando datos de ejemplo para StoryUp...');

// Cargar historias
localStorage.setItem('stories', JSON.stringify(sampleStories));
console.log('✅ Historias de ejemplo cargadas:', sampleStories.length);

// Cargar noticias
localStorage.setItem('news', JSON.stringify(sampleNews));
console.log('✅ Noticias de ejemplo cargadas:', sampleNews.length);

console.log('🎉 ¡Datos de ejemplo cargados correctamente!');
console.log('📊 Recarga la página de estadísticas para ver los nuevos datos');
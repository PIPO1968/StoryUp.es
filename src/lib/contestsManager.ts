// Stub temporal para evitar errores de importación
export const getAllContests = () => {
    // TODO: Implementar obtención de concursos vía API/DB
    return [];
};
// Sistema de gestión de concursos para StoryUp.es
export interface Contest {
    id: string;
    title: string;
    description: string;
    creatorId: string;
    creatorUsername: string;
    startDate: string; // Fecha de inicio de inscripciones
    endDate: string;   // Fecha de finalización
    status: 'active' | 'finished';
    winner?: string;   // Username del ganador (opcional)
    createdAt: string;
}





// Crear un nuevo concurso (solo para Padres/Docentes)
export const createContest = (contestData: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    creatorId: string;
    creatorUsername: string;
}): Contest => {
    // TODO: Reemplazar por llamada a la API/DB
    return {
        id: Date.now().toString(),
        ...contestData,
        status: 'active',
        createdAt: new Date().toISOString()
    };
};

// Obtener concursos activos (período de inscripción)
export const getActiveContests = (): Contest[] => {
    // TODO: Reemplazar por llamada a la API/DB
    return [];
};

// Obtener concursos terminados
export const getFinishedContests = (): Contest[] => {
    // TODO: Reemplazar por llamada a la API/DB
    return [];
};

// Actualizar el estado de los concursos (llamar periódicamente)
export const updateContestStatuses = (): void => {
    // TODO: Reemplazar por llamada a la API/DB
};

// Asignar ganador a un concurso (solo el creador)
export const setContestWinner = (contestId: string, winnerUsername: string, userId: string): boolean => {
    // TODO: Reemplazar por llamada a la API/DB
    return false;
};

// Verificar si un usuario puede crear concursos (admin o teacher)
export const canCreateContests = (userRole: string): boolean => {
    return userRole === 'admin' || userRole === 'teacher';
};

// Obtener estadísticas de concursos
export const getContestStats = () => {
    // TODO: Reemplazar por llamada a la API/DB
    return {
        total: 0,
        active: 0,
        finished: 0,
        withWinners: 0,
        pendingWinners: 0
    };
};
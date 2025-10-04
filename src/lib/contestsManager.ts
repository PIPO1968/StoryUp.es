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

// Obtener todos los concursos del localStorage
export const getAllContests = (): Contest[] => {
    try {
        const contests = localStorage.getItem('storyup_contests');
        return contests ? JSON.parse(contests) : [];
    } catch (error) {
        console.error('Error loading contests:', error);
        return [];
    }
};

// Guardar concursos en localStorage
export const saveContests = (contests: Contest[]): void => {
    try {
        localStorage.setItem('storyup_contests', JSON.stringify(contests));
    } catch (error) {
        console.error('Error saving contests:', error);
    }
};

// Crear un nuevo concurso (solo para Padres/Docentes)
export const createContest = (contestData: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    creatorId: string;
    creatorUsername: string;
}): Contest => {
    const newContest: Contest = {
        id: Date.now().toString(),
        ...contestData,
        status: 'active',
        createdAt: new Date().toISOString()
    };

    const contests = getAllContests();
    contests.push(newContest);
    saveContests(contests);

    return newContest;
};

// Obtener concursos activos (período de inscripción)
export const getActiveContests = (): Contest[] => {
    const contests = getAllContests();
    const now = new Date();

    return contests.filter(contest => {
        const startDate = new Date(contest.startDate);
        const endDate = new Date(contest.endDate);

        // Concurso está activo si estamos entre la fecha de inicio y fin
        return now >= startDate && now <= endDate && contest.status === 'active';
    });
};

// Obtener concursos terminados
export const getFinishedContests = (): Contest[] => {
    const contests = getAllContests();
    const now = new Date();

    return contests.filter(contest => {
        const endDate = new Date(contest.endDate);

        // Concurso está terminado si ya pasó la fecha de fin
        return now > endDate || contest.status === 'finished';
    });
};

// Actualizar el estado de los concursos (llamar periódicamente)
export const updateContestStatuses = (): void => {
    const contests = getAllContests();
    const now = new Date();
    let updated = false;

    const updatedContests = contests.map(contest => {
        const endDate = new Date(contest.endDate);

        if (now > endDate && contest.status === 'active') {
            updated = true;
            return { ...contest, status: 'finished' as const };
        }

        return contest;
    });

    if (updated) {
        saveContests(updatedContests);
    }
};

// Asignar ganador a un concurso (solo el creador)
export const setContestWinner = (contestId: string, winnerUsername: string, userId: string): boolean => {
    const contests = getAllContests();
    const contestIndex = contests.findIndex(c => c.id === contestId);

    if (contestIndex === -1) return false;

    const contest = contests[contestIndex];

    // Solo el creador puede asignar el ganador
    if (contest.creatorId !== userId) return false;

    // Solo se puede asignar ganador a concursos terminados
    if (contest.status !== 'finished') return false;

    contests[contestIndex] = { ...contest, winner: winnerUsername };
    saveContests(contests);

    return true;
};

// Verificar si un usuario puede crear concursos (admin o teacher)
export const canCreateContests = (userRole: string): boolean => {
    return userRole === 'admin' || userRole === 'teacher';
};

// Obtener estadísticas de concursos
export const getContestStats = () => {
    const contests = getAllContests();
    const activeContests = getActiveContests();
    const finishedContests = getFinishedContests();

    return {
        total: contests.length,
        active: activeContests.length,
        finished: finishedContests.length,
        withWinners: finishedContests.filter(c => c.winner).length,
        pendingWinners: finishedContests.filter(c => !c.winner).length
    };
};
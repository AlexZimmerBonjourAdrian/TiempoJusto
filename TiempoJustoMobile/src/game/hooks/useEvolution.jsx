// Hook de Evolución del Tamagotchi - Capa de Lógica
// Principio KISS: Keep It Simple, Stupid

import { useState, useEffect, useRef } from 'react';

export const useEvolution = (currentXP, previousXP, petLevel) => {
    const [isEvolving, setIsEvolving] = useState(false);
    const [evolutionLevel, setEvolutionLevel] = useState(null);
    const previousLevelRef = useRef(petLevel);

    // Función para obtener el nivel basado en XP
    const getPetLevel = (xp) => {
        if (xp >= 600) return 4;
        if (xp >= 300) return 3;
        if (xp >= 100) return 2;
        return 1;
    };

    // Detectar cambio de nivel
    useEffect(() => {
        const currentLevel = getPetLevel(currentXP);
        const previousLevel = previousLevelRef.current;

        // Si el nivel cambió y no está evolucionando
        if (currentLevel > previousLevel && !isEvolving) {
            setIsEvolving(true);
            setEvolutionLevel(currentLevel);
            
            // Simular duración de la evolución (2 segundos)
            setTimeout(() => {
                setIsEvolving(false);
                setEvolutionLevel(null);
            }, 2000);
        }

        previousLevelRef.current = currentLevel;
    }, [currentXP, isEvolving]);

    // Función para forzar evolución (para testing)
    const forceEvolution = (targetLevel) => {
        if (!isEvolving) {
            setIsEvolving(true);
            setEvolutionLevel(targetLevel);
            
            setTimeout(() => {
                setIsEvolving(false);
                setEvolutionLevel(null);
            }, 2000);
        }
    };

    return {
        isEvolving,
        evolutionLevel,
        forceEvolution
    };
};

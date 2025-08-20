// Lógica del Tamagotchi - Capa de Lógica
// Principio KISS: Keep It Simple, Stupid

import { petLevelConfig, moodConfig, needsConfig } from '../data/petData';

export function usePetLogic() {
    
    // Obtener el nivel del pet basado en XP
    const getPetLevel = (xp) => {
        for (let level = Object.keys(petLevelConfig).length; level >= 1; level--) {
            if (xp >= petLevelConfig[level].minXP) {
                return level;
            }
        }
        return 1;
    };

    // Obtener el emoji del pet basado en nivel y estado de ánimo
    const getPetEmoji = (level, mood) => {
        const baseEmoji = petLevelConfig[level]?.emoji || "🥚";
        
        // Si está en un estado especial, mostrar emoji del estado
        if (mood === 'hungry') return "😋";
        if (mood === 'thirsty') return "😰";
        
        return baseEmoji;
    };

    // Obtener el estado de ánimo basado en las estadísticas
    const getMoodState = (pet) => {
        const { hunger, thirst, energy, happiness } = pet;
        
        // Estados críticos
        if (hunger < 20) return 'hungry';
        if (thirst < 20) return 'thirsty';
        
        // Estados basados en felicidad
        if (happiness > 80) return 'happy';
        if (happiness > 60) return 'content';
        if (happiness > 40) return 'neutral';
        
        return 'sad';
    };

    // Actualizar estadísticas del pet
    const updatePetStats = (pet) => {
        const now = Date.now();
        const hoursSinceLastUpdate = (now - (pet.lastUpdate || now)) / (1000 * 60 * 60);
        
        if (hoursSinceLastUpdate < 1) return pet; // Solo actualizar cada hora
        
        const updatedPet = { ...pet };
        
        // Decrementar necesidades usando datos de la capa de datos
        updatedPet.hunger = Math.max(0, pet.hunger - (needsConfig.hunger.decreasePerHour * hoursSinceLastUpdate));
        updatedPet.thirst = Math.max(0, pet.thirst - (needsConfig.thirst.decreasePerHour * hoursSinceLastUpdate));
        updatedPet.energy = Math.max(0, pet.energy - (needsConfig.energy.decreasePerHour * hoursSinceLastUpdate));
        updatedPet.happiness = Math.max(0, pet.happiness - (needsConfig.happiness.decreasePerHour * hoursSinceLastUpdate));
        
        // Actualizar estado de ánimo
        updatedPet.mood = getMoodState(updatedPet);
        updatedPet.lastUpdate = now;
        
        return updatedPet;
    };

    // Alimentar al pet
    const feedPet = (pet, foodType) => {
        const updatedPet = { ...pet };
        
        switch (foodType) {
            case 'food':
                updatedPet.hunger = Math.min(100, pet.hunger + 30);
                updatedPet.lastFed = Date.now();
                break;
            case 'water':
                updatedPet.thirst = Math.min(100, pet.thirst + 40);
                updatedPet.lastWatered = Date.now();
                break;
            case 'toy':
                updatedPet.happiness = Math.min(100, pet.happiness + 25);
                break;
        }
        
        // Actualizar estado de ánimo
        updatedPet.mood = getMoodState(updatedPet);
        
        return updatedPet;
    };

    // Verificar si el pet necesita atención
    const needsAttention = (pet) => {
        return pet.hunger < 30 || pet.thirst < 30 || pet.energy < 30 || pet.happiness < 30;
    };

    // Obtener el progreso hacia el siguiente nivel
    const getLevelProgress = (xp) => {
        const currentLevel = getPetLevel(xp);
        const levelData = petLevelConfig[currentLevel];
        const nextLevelData = petLevelConfig[currentLevel + 1];
        
        if (!nextLevelData) return 1; // Máximo nivel
        
        const currentLevelXP = levelData.minXP;
        const nextLevelXP = nextLevelData.minXP;
        const xpInCurrentLevel = xp - currentLevelXP;
        const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
        
        return xpInCurrentLevel / xpNeededForNextLevel;
    };

    return {
        getPetLevel,
        getPetEmoji,
        getMoodState,
        updatePetStats,
        feedPet,
        needsAttention,
        getLevelProgress,
        petLevelConfig,
        moodConfig,
        needsConfig
    };
}

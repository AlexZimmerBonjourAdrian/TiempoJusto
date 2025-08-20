// Configuración de Assets del Juego - Capa de Datos
// Principio KISS: Keep It Simple, Stupid

// Assets principales del Tamagotchi
export const petAssets = {
    // Imagen principal del Tamagotchi (usar Form01 como fallback si Tamagochi.PNG está corrupto)
    main: require('../../../assets/Game/Form01.png'),
    
    // Habitación del Tamagotchi (temporalmente deshabilitada)
    // room: require('../../../assets/Game/Room.PNG'),
    
    // Estados de ánimo y necesidades
    states: {
        // Estados de ánimo
        happy: require('../../../assets/Game/Lleno.png'),
        sad: require('../../../assets/Game/Burla.png'),
        curious: require('../../../assets/Game/Curios.png'),
        
        // Necesidades
        hungry: require('../../../assets/Game/Hambre.png'),
        thirsty: require('../../../assets/Game/Sed.png'),
        playful: require('../../../assets/Game/Jugar.png'),
    },
    
    // Evolución del Tamagotchi por niveles
    evolution: {
        level1: require('../../../assets/Game/Form01.png'), // Organismo unicelular
        level2: require('../../../assets/Game/Form02.png'), // Gusano rosa
        level3: require('../../../assets/Game/Form03.png'), // Ratón gris
        level4: require('../../../assets/Game/Form03.png'), // Forma final (usar Form03 como fallback)
    },
    
    // Estado de muerte
    death: require('../../../assets/Game/Death.png'),
};

// Configuración de tamaños para evitar problemas de rendimiento
export const assetSizes = {
    // Tamaños para la mascota principal
    petMain: {
        width: 120,
        height: 120,
    },
    
    // Tamaños para estados de ánimo
    petState: {
        width: 100,
        height: 100,
    },
    
    // Tamaños para la habitación
    room: {
        width: 300,
        height: 200,
    },
    
    // Tamaños para iconos de recursos
    resourceIcon: {
        width: 40,
        height: 40,
    }
};

// Mapeo de estados a assets
export const stateToAsset = {
    // Estados de ánimo
    happy: petAssets.states.happy,
    content: petAssets.states.happy,
    neutral: petAssets.states.curious,
    sad: petAssets.states.sad,
    
    // Necesidades
    hungry: petAssets.states.hungry,
    thirsty: petAssets.states.thirsty,
    playful: petAssets.states.playful,
    
    // Estado de muerte
    dead: petAssets.death,
    
    // Estado por defecto
    default: petAssets.main
};

// Mapeo de niveles de evolución
export const levelToAsset = {
    1: petAssets.evolution.level1, // Organismo unicelular
    2: petAssets.evolution.level2, // Gusano rosa
    3: petAssets.evolution.level3, // Ratón gris
    4: petAssets.evolution.level3, // Forma final (usar Form03 como fallback)
};

// Configuración de animaciones para los assets
export const assetAnimations = {
    // Animación de respiración para la mascota
    breathing: {
        duration: 2000,
        scale: {
            min: 0.95,
            max: 1.05
        }
    },
    
    // Animación de parpadeo
    blinking: {
        duration: 3000,
        opacity: {
            min: 0.8,
            max: 1.0
        }
    },
    
    // Animación de salto cuando está feliz
    happy: {
        duration: 500,
        scale: {
            min: 1.0,
            max: 1.1
        }
    },
    
    // Animación de Squash and Stretch
    squashAndStretch: {
        duration: 300,
        scale: {
            x: {
                min: 0.8,
                max: 1.2
            },
            y: {
                min: 1.2,
                max: 0.8
            }
        }
    },
    
    // Animación de evolución (estilo Pokémon)
    evolution: {
        duration: 2000,
        flashCount: 6,
        flashDuration: 150,
        whiteOpacity: 0.8,
        scale: {
            min: 0.8,
            max: 1.3
        }
    }
};

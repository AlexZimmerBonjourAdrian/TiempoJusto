// Datos del juego del Tamagotchi - Capa de Datos
// Principio KISS: Keep It Simple, Stupid

// Tipos de recursos disponibles (reducidos a la mitad)
export const resourceTypes = {
    food: {
        name: 'Comida',
        icon: '🍎',
        type: 'food',
        effect: { hunger: +30 },
        adDuration: 15,
        adMessage: 'Mira un anuncio para darle comida a tu mascota',
        color: '#FF6B6B',
        description: 'Alimenta a tu mascota'
    },
    water: {
        name: 'Agua',
        icon: '💧',
        type: 'water',
        effect: { thirst: +40 },
        adDuration: 15,
        adMessage: 'Mira un anuncio para darle agua a tu mascota',
        color: '#4ECDC4',
        description: 'Dale agua fresca'
    },
    toy: {
        name: 'Juguete',
        icon: '🎾',
        type: 'toy',
        effect: { happiness: +25 },
        adDuration: 20,
        adMessage: 'Mira un anuncio para jugar con tu mascota',
        color: '#45B7D1',
        description: 'Juega con tu mascota'
    }
};

// Configuración de niveles del pet (simplificada)
export const petLevelConfig = {
    1: { 
        name: "Bebé", 
        minXP: 0, 
        maxXP: 100, 
        emoji: "🥚",
        description: "Un pequeño huevo que necesita cuidado"
    },
    2: { 
        name: "Niño", 
        minXP: 100, 
        maxXP: 300, 
        emoji: "🐣",
        description: "¡Ha nacido! Un pequeño pollito curioso"
    },
    3: { 
        name: "Adulto", 
        minXP: 300, 
        maxXP: 600, 
        emoji: "🐔",
        description: "Una gallina adulta y productiva"
    },
    4: { 
        name: "Maestro", 
        minXP: 600, 
        maxXP: Infinity, 
        emoji: "🦅",
        description: "Un águila majestuosa y sabia"
    }
};

// Estados de ánimo del pet (simplificados)
export const moodConfig = {
    happy: { 
        emoji: "😊", 
        description: "¡Muy productivo hoy!",
        color: "#10B981"
    },
    content: { 
        emoji: "🙂", 
        description: "Buen trabajo",
        color: "#3B82F6"
    },
    neutral: { 
        emoji: "😐", 
        description: "Día normal",
        color: "#F59E0B"
    },
    sad: { 
        emoji: "😔", 
        description: "Necesita más actividad",
        color: "#EF4444"
    },
    hungry: { 
        emoji: "😋", 
        description: "¡Tiene hambre!",
        color: "#FF6B6B"
    },
    thirsty: { 
        emoji: "😰", 
        description: "¡Tiene sed!",
        color: "#4ECDC4"
    }
};

// Configuración de necesidades del pet (duplicadas para progresión más lenta)
export const needsConfig = {
    hunger: { 
        max: 100, 
        decreasePerHour: 10, // Duplicado de 5 a 10
        name: "Hambre",
        icon: "🍎",
        color: "#FF6B6B"
    },
    thirst: { 
        max: 100, 
        decreasePerHour: 16, // Duplicado de 8 a 16
        name: "Sed",
        icon: "💧",
        color: "#4ECDC4"
    },
    energy: { 
        max: 100, 
        decreasePerHour: 6, // Duplicado de 3 a 6
        name: "Energía",
        icon: "⚡",
        color: "#F59E0B"
    },
    happiness: { 
        max: 100, 
        decreasePerHour: 4, // Duplicado de 2 a 4
        name: "Felicidad",
        icon: "😊",
        color: "#10B981"
    }
};

// Configuración de anuncios (simplificada)
export const adConfig = {
    food: {
        duration: 15,
        reward: { hunger: 30 },
        message: "Mira un anuncio de 15 segundos para alimentar a tu mascota"
    },
    water: {
        duration: 15,
        reward: { thirst: 40 },
        message: "Mira un anuncio de 15 segundos para darle agua a tu mascota"
    },
    toy: {
        duration: 20,
        reward: { happiness: 25 },
        message: "Mira un anuncio de 20 segundos para jugar con tu mascota"
    }
};

// Configuración de XP (simplificada)
export const xpConfig = {
    taskCompleted: 10,
    priorityATask: 25,
    priorityBTask: 15,
    priorityCTask: 8,
    priorityDTask: 3,
    projectCompleted: 100,
    streakDay: 50,
    perfectDay: 200
};

// Nombres sugeridos para mascotas
export const petNames = [
    "Producti", "Tiempo", "Justo", "Focus", "Eficiente"
];

// Mensajes motivacionales para el pet (simplificados)
export const motivationalMessages = {
    levelUp: [
        "¡Felicidades! Tu mascota ha subido de nivel",
        "¡Increíble progreso! Tu mascota está creciendo"
    ],
    achievement: [
        "¡Logro desbloqueado! Tu mascota está orgullosa",
        "¡Buen trabajo! Tu mascota te agradece"
    ],
    encouragement: [
        "Tu mascota cree en ti",
        "Cada tarea te acerca a tu meta"
    ]
};

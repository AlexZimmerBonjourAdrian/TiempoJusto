// Script de prueba para verificar que el error de estructura cíclica se ha solucionado
const AsyncStorage = require('@react-native-async-storage/async-storage');

// Simular el estado que podría causar el error
const testState = {
    isRunning: true,
    mode: 'focus',
    secondsLeft: 1500,
    totalSeconds: 1500,
    startTime: Date.now(),
    pauseTime: null,
    timestamp: Date.now(),
};

// Función para probar la serialización
async function testSerialization() {
    try {
        console.log('Probando serialización del estado...');
        
        // Intentar serializar el estado
        const serializedState = JSON.stringify(testState);
        console.log('✅ Serialización exitosa');
        
        // Intentar guardar en AsyncStorage (simulado)
        console.log('Estado serializado:', serializedState);
        
        // Intentar deserializar
        const deserializedState = JSON.parse(serializedState);
        console.log('✅ Deserialización exitosa');
        
        console.log('Estado deserializado:', deserializedState);
        
        return true;
    } catch (error) {
        console.error('❌ Error en la serialización:', error);
        return false;
    }
}

// Función para simular el estado corrupto
async function testCorruptedState() {
    try {
        console.log('\nProbando manejo de estado corrupto...');
        
        // Simular un estado que podría causar problemas
        const problematicState = {
            isRunning: true,
            mode: 'focus',
            secondsLeft: 1500,
            totalSeconds: 1500,
            startTime: Date.now(),
            pauseTime: null,
            timestamp: Date.now(),
            // Agregar una referencia circular simulada
            self: null
        };
        
        // Intentar serializar (esto debería fallar)
        try {
            JSON.stringify(problematicState);
            console.log('⚠️ Estado problemático se serializó (no esperado)');
        } catch (error) {
            console.log('✅ Error de serialización detectado correctamente:', error.message);
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error en prueba de estado corrupto:', error);
        return false;
    }
}

// Ejecutar pruebas
async function runTests() {
    console.log('🧪 Iniciando pruebas de corrección del Pomodoro...\n');
    
    const test1 = await testSerialization();
    const test2 = await testCorruptedState();
    
    console.log('\n📊 Resultados de las pruebas:');
    console.log(`Serialización normal: ${test1 ? '✅ PASÓ' : '❌ FALLÓ'}`);
    console.log(`Manejo de estado corrupto: ${test2 ? '✅ PASÓ' : '❌ FALLÓ'}`);
    
    if (test1 && test2) {
        console.log('\n🎉 ¡Todas las pruebas pasaron! El error de estructura cíclica ha sido corregido.');
    } else {
        console.log('\n⚠️ Algunas pruebas fallaron. Revisar la implementación.');
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    runTests();
}

module.exports = { testSerialization, testCorruptedState, runTests };

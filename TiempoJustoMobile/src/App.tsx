// ============================================================================
// PUNTO DE ENTRADA PRINCIPAL - TIEMPOJUSTO
// ============================================================================

import React from 'react';
import { View, StyleSheet, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Context Providers
import { AppProvider, useAppContext } from './shared/context/AppContext';

// Components
import { LoadingScreen } from './components/common/LoadingScreen';
import { ErrorScreen } from './components/common/ErrorScreen';
import { MainApp } from './components/layout/MainApp';
import { VersionBadge } from './components/common/VersionBadge';

// ============================================================================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ============================================================================

function AppInner() {
  const insets = useSafeAreaInsets();
  const { isLoading, error } = useAppContext();

  // ============================================================================
  // RENDERIZADO DE ESTADOS
  // ============================================================================

  if (isLoading) {
    return <LoadingScreen message="Inicializando TiempoJusto..." />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  // ============================================================================
  // RENDERIZADO PRINCIPAL
  // ============================================================================

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, RNStatusBar.currentHeight || 12) }]}>
      <StatusBar style="auto" />
      <MainApp />
      <VersionBadge />
    </View>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL EXPORTADO
// ============================================================================

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </SafeAreaProvider>
  );
}

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // slate-900
  },
});

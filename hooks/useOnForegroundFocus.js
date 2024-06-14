import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export const useOnForegroundFocus = (
    onFocus,
    runOnStartup
  ) => {
    const appState = useRef(AppState.currentState);
  
    useEffect(() => {
      const subscription = AppState.addEventListener('change', (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          onFocus();
        }
  
        appState.current = nextAppState;
      });
  
      if (runOnStartup) {
        onFocus();
      }
  
      return () => {
        subscription?.remove();
      };
    }, []);
  };
import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function readJson(key, fallbackValue) {
    try {
        const raw = await AsyncStorage.getItem(key);
        if (raw == null) return fallbackValue;
        return JSON.parse(raw);
    } catch (error) {
        console.warn('AsyncStorage read error for', key, error);
        return fallbackValue;
    }
}

async function writeJson(key, value) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn('AsyncStorage write error for', key, error);
    }
}

export function useAsyncStorageState(key, initialValue) {
    const [value, setValue] = useState(initialValue);
    const isHydratedRef = useRef(false);

    useEffect(() => {
        let isMounted = true;
        (async() => {
            const stored = await readJson(key, initialValue);
            if (isMounted) {
                setValue(stored);
                isHydratedRef.current = true;
            }
        })();
        return () => {
            isMounted = false;
        };
    }, [key]);

    const setPersistedValue = useCallback(
        (updater) => {
            setValue((prev) => {
                const next = typeof updater === 'function' ? updater(prev) : updater;
                if (isHydratedRef.current) {
                    writeJson(key, next);
                }
                return next;
            });
        }, [key]
    );

    return [value, setPersistedValue];
}
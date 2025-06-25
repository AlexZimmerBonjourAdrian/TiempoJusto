import React, { useState } from 'react';

function HourCalculator() {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [duration, setDuration] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const calculateDuration = () => {
        const parseTime = (time) => {
            // Eliminar espacios en blanco y convertir a mayúsculas
            time = time.trim().toUpperCase();

            // Extraer AM/PM si existe
            const hasAM = time.includes('AM');
            const hasPM = time.includes('PM');
            time = time.replace(/[AP]M/, '').trim();

            // Si solo es un número, asumir que son horas
            if (/^\d+$/.test(time)) {
                let hours = parseInt(time);
                if (hasPM && hours !== 12) hours += 12;
                if (hasAM && hours === 12) hours = 0;
                return hours * 60;
            }

            // Si tiene formato HHMM
            if (/^\d{4}$/.test(time)) {
                const hours = parseInt(time.substring(0, 2));
                const minutes = parseInt(time.substring(2));
                let totalMinutes = hours * 60 + minutes;
                if (hasPM && hours !== 12) totalMinutes += 12 * 60;
                if (hasAM && hours === 12) totalMinutes -= 12 * 60;
                return totalMinutes;
            }

            // Si tiene formato HH:MM
            if (time.includes(':')) {
                const [hours, minutes] = time.split(':').map(Number);
                let totalMinutes = hours * 60 + minutes;
                if (hasPM && hours !== 12) totalMinutes += 12 * 60;
                if (hasAM && hours === 12) totalMinutes -= 12 * 60;
                return totalMinutes;
            }

            return NaN;
        };

        if (startTime && endTime) {
            const startMinutes = parseTime(startTime);
            const endMinutes = parseTime(endTime);

            // Si la hora final es menor que la inicial, asumimos que es del día siguiente
            let diff = endMinutes - startMinutes;
            if (diff < 0) {
                diff += 24 * 60; // Agregamos 24 horas en minutos
            }

            const hours = Math.floor(diff / 60);
            const minutes = diff % 60;
            setDuration(`${hours} horas y ${minutes} minutos`);
            setErrorMessage('');
        } else {
            setErrorMessage('Por favor, introduce ambas horas.');
            setDuration('');
        }
    };

    return (
        <div className="minimal-card" style={{ maxWidth: 520 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Calculadora de Horas</h2>
            <div className="input-container">
                <input
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="Hora de inicio (HH:MM)"
                    className="hour-input"
                    style={{ flex: 1 }}
                />
                <input
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="Hora de fin (HH:MM)"
                    className="hour-input"
                    style={{ flex: 1 }}
                />
            </div>
            <button onClick={calculateDuration} style={{ minWidth: 140 }}>Calcular Duración</button>
            {errorMessage && <p style={{ color: 'var(--color-accent)', marginTop: 12 }}>{errorMessage}</p>}
            {duration && <p style={{ color: 'var(--color-text)', fontSize: '1.15rem', marginTop: 12 }}>Duración: {duration}</p>}
            <p style={{ color: 'var(--color-muted)', marginTop: 8 }}>Ingresa las horas en formato HH:MM para calcular la duración o ajustar la hora.</p>
        </div>
    );
}

export default HourCalculator; 
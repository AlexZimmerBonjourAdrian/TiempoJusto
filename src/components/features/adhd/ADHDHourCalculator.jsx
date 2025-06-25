import React, { useState } from 'react';

function ADHDHourCalculator() {
    const [inputHour1, setInputHour1] = useState('');
    const [inputHour2, setInputHour2] = useState('');
    const [adjustedTime1, setAdjustedTime1] = useState('');
    const [adjustedTime2, setAdjustedTime2] = useState('');
    const [remainingHours, setRemainingHours] = useState('');

    const calculateTimes = () => {
        const parseHour = (input) => {
            input = input.trim().toUpperCase();
            const hasAM = input.includes('AM');
            const hasPM = input.includes('PM');
            input = input.replace(/[AP]M/, '').trim();
            if (/^\d+$/.test(input)) {
                let hours = parseInt(input);
                if (hasPM && hours !== 12) hours += 12;
                if (hasAM && hours === 12) hours = 0;
                return hours;
            }
            if (/^\d{4}$/.test(input)) {
                const hours = parseInt(input.substring(0, 2));
                const minutes = parseInt(input.substring(2));
                let totalHours = hours + (minutes / 60);
                if (hasPM && hours !== 12) totalHours += 12;
                if (hasAM && hours === 12) totalHours -= 12;
                return totalHours;
            }
            if (input.includes(':')) {
                const [hours, minutes] = input.split(':').map(Number);
                let totalHours = hours + (minutes / 60);
                if (hasPM && hours !== 12) totalHours += 12;
                if (hasAM && hours === 12) totalHours -= 12;
                return totalHours;
            }
            return NaN;
        };
        const hour1 = parseHour(inputHour1);
        const hour2 = parseHour(inputHour2);
        if (!isNaN(hour1) && hour1 >= 0 && hour1 < 24) {
            const now = new Date();
            const adjusted = new Date(now.setHours(now.getHours() - hour1));
            setAdjustedTime1(`Hora ajustada: ${adjusted.toLocaleTimeString()}`);
        } else {
            setAdjustedTime1('Por favor, introduce una hora válida (0-23).');
        }
        if (!isNaN(hour2) && hour2 >= 0 && hour2 < 24) {
            const now = new Date();
            const adjusted = new Date(now.setHours(now.getHours() - hour2));
            setAdjustedTime2(`Hora ajustada: ${adjusted.toLocaleTimeString()}`);
        } else {
            setAdjustedTime2('Por favor, introduce una hora válida (0-23).');
        }
        if (!isNaN(hour1) && hour1 >= 0 && hour1 < 24 && !isNaN(hour2) && hour2 >= 0 && hour2 < 24) {
            let difference = hour2 - hour1;
            if (difference < 0) {
                difference += 24;
            }
            setRemainingHours(`Faltan ${difference.toFixed(2)} horas para llegar a la segunda hora.`);
        } else {
            setRemainingHours('Por favor, introduce horas válidas (0-23).');
        }
    };

    return (
        <div className="minimal-card" style={{ maxWidth: 520 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Calculadora de Horas (ADHD)</h2>
            <div className="input-container">
                <input
                    value={inputHour1}
                    onChange={(e) => setInputHour1(e.target.value)}
                    placeholder="Introduce una hora (ej. 4:30 AM o 16:30 PM)"
                    style={{ flex: 1 }}
                />
            </div>
            <p style={{ color: 'var(--color-muted)', marginBottom: 8 }}>{adjustedTime1}</p>
            <div className="input-container">
                <input
                    value={inputHour2}
                    onChange={(e) => setInputHour2(e.target.value)}
                    placeholder="Introduce una hora (ej. 4:30 AM o 16:30 PM)"
                    style={{ flex: 1 }}
                />
            </div>
            <p style={{ color: 'var(--color-muted)', marginBottom: 8 }}>{adjustedTime2}</p>
            <div style={{ fontWeight: 600, color: 'var(--color-accent)', margin: '12px 0' }}>Resultado</div>
            <p style={{ color: 'var(--color-text)', fontSize: '1.15rem', marginBottom: 18 }}>{remainingHours}</p>
            <button onClick={calculateTimes} style={{ minWidth: 140 }}>Calcular</button>
        </div>
    );
}

export default ADHDHourCalculator; 
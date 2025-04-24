import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import './TaskBoard.css';

function ADHDHourCalculator() {
    const [inputHour1, setInputHour1] = useState('');
    const [inputHour2, setInputHour2] = useState('');
    const [adjustedTime1, setAdjustedTime1] = useState('');
    const [adjustedTime2, setAdjustedTime2] = useState('');
    const [remainingHours, setRemainingHours] = useState('');

    const calculateTimes = () => {
        const parseHour = (input) => {
            // Eliminar espacios en blanco y convertir a mayúsculas
            input = input.trim().toUpperCase();

            // Extraer AM/PM si existe
            const hasAM = input.includes('AM');
            const hasPM = input.includes('PM');
            input = input.replace(/[AP]M/, '').trim();

            // Si solo es un número, asumir que son horas
            if (/^\d+$/.test(input)) {
                let hours = parseInt(input);
                if (hasPM && hours !== 12) hours += 12;
                if (hasAM && hours === 12) hours = 0;
                return hours;
            }

            // Si tiene formato HHMM
            if (/^\d{4}$/.test(input)) {
                const hours = parseInt(input.substring(0, 2));
                const minutes = parseInt(input.substring(2));
                let totalHours = hours + (minutes / 60);
                if (hasPM && hours !== 12) totalHours += 12;
                if (hasAM && hours === 12) totalHours -= 12;
                return totalHours;
            }

            // Si tiene formato HH:MM
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

    return ( <
        Card title = "Calculadora de Horas (ADHD Optimized)"
        className = "task-board" >
        <
        div className = "input-container" >
        <
        InputText value = { inputHour1 }
        onChange = {
            (e) => setInputHour1(e.target.value)
        }
        placeholder = "Introduce una hora (ej. 4:30 AM o 16:30 PM)" /
        >
        <
        p > { adjustedTime1 } < /p> < /
        div >

        <
        div className = "input-container" >
        <
        InputText value = { inputHour2 }
        onChange = {
            (e) => setInputHour2(e.target.value)
        }
        placeholder = "Introduce una hora (ej. 4:30 AM o 16:30 PM)" /
        >
        <
        p > { adjustedTime2 } < /p> < /
        div >

        <
        div className = "completed-counter" > Resultado < /div> <
        p > { remainingHours } < /p>

        <
        button onClick = { calculateTimes } > Calcular < /button> < /
        Card >
    );
}

export default ADHDHourCalculator;
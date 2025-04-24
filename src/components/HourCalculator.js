import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import './HourCalculator.css';

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

    const adjustTime = () => {
        if (startTime) {
            // const [hours, minutes] = startTime.split(':').map(Number);
            // const adjusted = new Date();
            // adjusted.setHours(hours);
            // adjusted.setMinutes(minutes);
            // adjusted.setMinutes(adjusted.getMinutes() + 30); // Ajuste de 30 minutos

            // setAdjustedTime(`Hora ajustada: ${adjusted.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
        } else {
            // setAdjustedTime('Por favor, introduce una hora de inicio.');
        }
    };

    return ( <
        Card title = "Calculadora de Horas"
        className = "hour-calculator" >
        <
        div className = "hour-calculator-section" >
        <
        h3 > Calcula las horas faltantes desde la hora de inicio hasta la hora de fin < /h3> <
        div className = "input-group" >
        <
        InputText value = { startTime }
        onChange = {
            (e) => setStartTime(e.target.value)
        }
        placeholder = "Hora de inicio (HH:MM)"
        className = "hour-input" /
        >
        <
        InputText value = { endTime }
        onChange = {
            (e) => setEndTime(e.target.value)
        }
        placeholder = "Hora de fin (HH:MM)"
        className = "hour-input" /
        >
        <
        /div> <
        Button label = "Calcular Duración"
        onClick = { calculateDuration }
        className = "p-button-success calculate-button" / > {
            errorMessage && < p className = "error-text" > { errorMessage } < /p>} {
            duration && < p className = "result-text" > Duración: { duration } < /p>} <
            p className = "info-text" > Ingresa las horas en formato HH: MM para calcular la duración o ajustar la hora. < /p> < /
                div >


                <
                /Card>
        );
    }

    export default HourCalculator;
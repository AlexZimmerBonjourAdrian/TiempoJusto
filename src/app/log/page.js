'use client'

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Card } from 'primereact/card';

export default function LogPage() {
    const [completedLog, setCompletedLog] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedLog = Cookies.get('completedLog');
            return savedLog ? JSON.parse(savedLog) : [];
        }
        return [];
    });

    useEffect(() => {
        const now = new Date();
        const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
        const filteredLog = completedLog.filter(log => new Date(log.date) >= sixMonthsAgo);
        setCompletedLog(filteredLog);
        Cookies.set('completedLog', JSON.stringify(filteredLog), { expires: 182 });
    }, [completedLog]);

    return ( <
        Card title = "Productivity Log"
        className = "log-page" >
        <
        h3 > Task Completion Log < /h3> <
        ul > {
            completedLog.map((log, index) => ( <
                li key = { index } >
                <
                p > Fecha: { new Date(log.date).toLocaleDateString() } < /p> <
                p > Tareas Completadas: { log.completedTasks } < /p> <
                p > Tareas Totales: { log.totalTasks } < /p> <
                p > Productividad: { log.productivity.toFixed(2) } % < /p> <
                /li>
            ))
        } <
        /ul> <
        /Card>
    );
}
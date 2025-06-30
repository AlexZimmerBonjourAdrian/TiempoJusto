'use client'

import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ProjectBoard from '../../components/features/projects/ProjectBoard';

export default function ProjectsPage() {
    return ( <
        div >
        <
        Header / >
        <
        main style = {
            {
                minHeight: 'calc(100vh - 120px)',
                padding: '20px',
                backgroundColor: 'var(--color-background)'
            }
        } >
        <
        div style = {
            { maxWidth: '1200px', margin: '0 auto' } } >
        <
        div style = {
            { marginBottom: '24px' } } >
        <
        h1 style = {
            {
                textAlign: 'center',
                marginBottom: '8px',
                color: 'var(--color-text)',
                fontSize: '2.5em'
            }
        } >
        Gestión de Proyectos <
        /h1> <
        p style = {
            {
                textAlign: 'center',
                color: 'var(--color-muted)',
                fontSize: '1.1em',
                maxWidth: '600px',
                margin: '0 auto'
            }
        } >
        Organiza tus tareas en proyectos para una mejor gestión del tiempo y seguimiento de objetivos. <
        /p> <
        /div> <
        ProjectBoard / >
        <
        /div> <
        /main> <
        Footer / >
        <
        /div>
    );
}
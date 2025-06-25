'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import MainView from '../components/layout/MainView'
import ADHDView from '../components/features/adhd/ADHDView'

export default function HomePage() {
    const [hasADHD, setHasADHD] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedPreference = Cookies.get('hasADHD')
            return savedPreference !== undefined ? JSON.parse(savedPreference) : null
        }
        return null
    })

    const toggleADHDMode = () => {
        setHasADHD((prev) => {
            const newMode = !prev
            Cookies.set('hasADHD', newMode, { expires: 182 })
            return newMode
        })
    }

    useEffect(() => {
        if (hasADHD !== null) {
            Cookies.set('hasADHD', hasADHD, { expires: 182 })
        }
    }, [hasADHD])

    if (hasADHD === null) {
        return ( <
            div className = "preference-selection"
            style = {
                { textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' } } >
            <
            h1 style = {
                { color: '#4CAF50', fontSize: '2.5em' } } > ¡Hola!😊 < /h1> <
            p style = {
                { fontSize: '1.2em', color: '#555' } } >
            Antes de comenzar, queremos conocerte un poco mejor.¿Tienes ADHD ? Esto nos ayudará a personalizar tu experiencia. <
            /p> <
            div style = {
                { marginTop: '20px' } } >
            <
            button onClick = {
                () => setHasADHD(true) }
            style = {
                {
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    fontSize: '1em',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '10px'
                }
            } >
            Sí, tengo ADHD <
            /button> <
            button onClick = {
                () => setHasADHD(false) }
            style = {
                {
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    fontSize: '1em',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }
            } >
            No, no tengo ADHD <
            /button> <
            /div> <
            /div>
        )
    }

    return ( <
        >
        <
        Header / > { hasADHD ? < ADHDView / > : < MainView / > } <
        Footer hasADHD = { hasADHD }
        toggleADHDMode = { toggleADHDMode }
        /> <
        />
    )
}
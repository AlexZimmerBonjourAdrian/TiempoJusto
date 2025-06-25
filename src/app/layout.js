import { Inter } from 'next/font/google'
import '../styles/globals.css'

// Importar estilos de PrimeReact
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Tiempo Justo - Gestión de Tareas',
    description: 'Gestiona tus tareas diarias con propósito y claridad. Inspirado en las filosofías de productividad de Brian Tracy y Jordan Peterson.',
    keywords: 'productividad, tareas, ADHD, gestión del tiempo, Brian Tracy, Jordan Peterson',
    authors: [{ name: 'ZimTech' }],
    viewport: 'width=device-width, initial-scale=1',
    robots: 'index, follow',
    openGraph: {
        title: 'Tiempo Justo - Gestión de Tareas',
        description: 'Gestiona tus tareas diarias con propósito y claridad',
        type: 'website',
        locale: 'es_ES',
    },
}

export default function RootLayout({ children }) {
    return ( <
        html lang = "es" >
        <
        body className = { inter.className } > { children } <
        /body> <
        /html>
    )
}
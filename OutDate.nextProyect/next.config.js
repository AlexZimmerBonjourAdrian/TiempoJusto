/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configuración para Netlify
    output: 'standalone',
    trailingSlash: true,

    sassOptions: {
        includePaths: ['./src/styles'],
    },
    // Configuración para PrimeReact
    transpilePackages: ['primereact'],
    // Configuración de imágenes
    images: {
        domains: [],
        unoptimized: true, // Para Netlify
    },
    // Configuración de webpack para PrimeReact
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
        };
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': './src',
            '@components': './src/components',
            '@features': './src/components/features',
            '@ui': './src/components/ui',
            '@layout': './src/components/layout',
            '@utils': './src/utils',
            '@constants': './src/constants',
            '@types': './src/types',
            '@styles': './src/styles',
            '@hooks': './src/hooks',
            '@lib': './src/lib'
        };
        return config;
    },
}

module.exports = nextConfig
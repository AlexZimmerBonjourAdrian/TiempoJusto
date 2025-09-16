Param(
    [ValidateSet('development','preview','production')]
    [string]$Profile = 'production',

    [ValidateSet('android','all')]
    [string]$Platform = 'android',

    [switch]$NoVcs,
    [switch]$ClearCache,
    [switch]$AutoInstall = $true,

    # Opcionales para asegurar entorno estilo Setup.ps1
    [switch]$InstallJdk,
    [switch]$InstallAndroid,
    [switch]$SetUserEnv,
    [string]$AndroidSdkPath,
    [string]$JavaHomePath,

    # EAS local en esta máquina
    [switch]$Local
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Info([string]$Message) { Write-Host "[INFO] $Message" -ForegroundColor Cyan }
function Write-Warn([string]$Message) { Write-Host "[WARN] $Message" -ForegroundColor Yellow }
function Write-Err([string]$Message)  { Write-Host "[ERR ] $Message" -ForegroundColor Red }

function Test-Command([string]$Name) {
    return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

function Install-WithWinget([string]$Id) {
    if (Test-Command 'winget') {
        Write-Info "Instalando con winget: $Id"
        winget install --source winget -e --id $Id --accept-package-agreements --accept-source-agreements --silent | Out-Host
        return
    }
    if (Test-Command 'choco') {
        switch ($Id) {
            'OpenJS.NodeJS.LTS' { Write-Info 'Instalando con choco: nodejs-lts'; choco install -y nodejs-lts | Out-Host; return }
            'EclipseAdoptium.Temurin.17.JDK' { Write-Info 'Instalando con choco: temurin17jdk'; choco install -y temurin17jdk | Out-Host; return }
            'Google.AndroidStudio' { Write-Info 'Instalando con choco: androidstudio'; choco install -y androidstudio | Out-Host; return }
        }
    }
    throw "winget no está disponible. Instala manualmente: $Id"
}

function Ensure-Tool([string]$Command, [scriptblock]$Install) {
    if (Test-Command $Command) { return }
    if (-not $AutoInstall) {
        throw "No se encontró '$Command'. Instálalo o ejecuta con -AutoInstall."
    }
    Write-Info "Instalando $Command..."
    & $Install
}

function Ensure-NodeNpm() {
    if (-not (Test-Command 'node')) {
        if ($AutoInstall) {
            Write-Warn 'Node.js no encontrado. Instalando Node.js LTS...'
            Install-WithWinget 'OpenJS.NodeJS.LTS'
        } else {
            throw 'Node.js no está instalado o no está en el PATH.'
        }
    }
    if (-not (Test-Command 'node')) { throw 'Node.js no se pudo instalar o no está en PATH.' }
    if (-not (Test-Command 'npm'))  { throw 'npm no está disponible.' }
    Write-Info ("Node: " + (node -v))
    Write-Info ("npm:  " + (npm -v))
}

function Detect-JavaHome() {
    if ($JavaHomePath -and (Test-Path $JavaHomePath)) { return $JavaHomePath }
    $adoptium = 'C:\\Program Files\\Eclipse Adoptium'
    if (Test-Path $adoptium) {
        $jdk = Get-ChildItem -LiteralPath $adoptium -Directory -Filter 'jdk-17*' -ErrorAction SilentlyContinue |
            Sort-Object Name -Descending | Select-Object -First 1
        if ($jdk) { return $jdk.FullName }
    }
    return $null
}

function Ensure-Jdk17() {
    $java = Detect-JavaHome
    if (-not $java -and ($InstallJdk -or $AutoInstall)) {
        Write-Info 'Instalando JDK 17 (Eclipse Adoptium)...'
        Install-WithWinget 'EclipseAdoptium.Temurin.17.JDK'
        $java = Detect-JavaHome
    }
    if ($java) {
        Write-Info "JAVA_HOME: $java"
        $env:JAVA_HOME = $java
        if ($SetUserEnv) { [Environment]::SetEnvironmentVariable('JAVA_HOME', $java, 'User') }
    } else {
        Write-Warn 'JDK 17 no detectado. Usa -InstallJdk o pasa -JavaHomePath.'
    }
}

function Detect-AndroidSdk() {
    if ($AndroidSdkPath -and (Test-Path $AndroidSdkPath)) { return $AndroidSdkPath }
    $candidates = @(
        "$env:LOCALAPPDATA\\Android\\Sdk",
        'C:\\Android\\Sdk'
    )
    foreach ($p in $candidates) { if (Test-Path $p) { return $p } }
    return $null
}

function Ensure-Android() {
    $sdk = Detect-AndroidSdk
    if (-not $sdk -and ($InstallAndroid -or $AutoInstall)) {
        Write-Info 'Instalando Android Studio (incluye SDK Manager)...'
        Install-WithWinget 'Google.AndroidStudio'
        $sdk = Detect-AndroidSdk
    }
    if ($sdk) {
        Write-Info "ANDROID_SDK_ROOT: $sdk"
        $env:ANDROID_SDK_ROOT = $sdk
        $env:ANDROID_HOME = $sdk
        if ($SetUserEnv) {
            [Environment]::SetEnvironmentVariable('ANDROID_SDK_ROOT', $sdk, 'User')
            [Environment]::SetEnvironmentVariable('ANDROID_HOME', $sdk, 'User')
        }
        # Sumar rutas comunes a PATH para la sesión actual
        $platformTools = Join-Path $sdk 'platform-tools'
        $cmdlineTools  = Join-Path $sdk 'cmdline-tools\latest\bin'
        foreach ($add in @($platformTools, $cmdlineTools)) {
            if (Test-Path $add) {
                $existsInPath = ($env:PATH -split ';' | Where-Object { $_ -eq $add })
                if (-not $existsInPath) {
                    $env:PATH = "$add;$env:PATH"
                }
            }
        }
    } else {
        Write-Warn 'Android SDK no detectado. Usa -InstallAndroid o pasa -AndroidSdkPath.'
    }
}

Write-Info "Perfil: $Profile | Plataforma: $Platform | Local=$Local"

# 1) Verificar/instalar Node/NPM si falta
Ensure-NodeNpm

# 2) Verificar/usar EAS CLI vía npx (evita depender del PATH)
Ensure-Tool 'eas' { npm install -g eas-cli | Out-Host }
try {
    $easVersion = (& npx --yes eas --version)
    Write-Info ("EAS CLI: " + $easVersion)
} catch {
    Write-Warn 'No se pudo obtener la versión de EAS vía npx. Continuando...'
}

# 3) Asegurar JDK 17 y Android SDK (instalar si falta y está permitido)
Write-Info 'Comprobando JDK 17...'
if ($InstallJdk -or $AutoInstall) { Ensure-Jdk17 } else { Ensure-Jdk17 }

Write-Info 'Comprobando Android SDK...'
if ($InstallAndroid -or $AutoInstall) { Ensure-Android } else { Ensure-Android }

# 4) Instalar dependencias si falta node_modules
if (-not (Test-Path -LiteralPath 'node_modules')) {
    Write-Info 'Instalando dependencias (npm install)...'
    npm install | Out-Host
}

# 5) Limpiar caché de Expo opcional
if ($ClearCache) {
    Write-Info 'Limpiando caché de Metro/Expo (npm start -- --clear)...'
    # Ejecuta y termina (dev server no se mantiene vivo con --non-interactive)
    try { npm start -- --clear --non-interactive | Out-Host } catch { Write-Warn 'Limpieza rápida ejecutada.' }
}

# 6) Ejecutar build con EAS
# Habilitar modo sin VCS si el usuario lo pide o si no hay git instalado
if ($NoVcs -or -not (Test-Command 'git')) { $env:EAS_NO_VCS = '1' }
try {
    $argsList = @('eas','build','--platform', $Platform, '--profile', $Profile, '--non-interactive')
    if ($Local) { $argsList += '--local' }
    $npxArgs = @('--yes') + $argsList
    Write-Info ("Ejecutando: npx " + ($argsList -join ' '))
    & npx @npxArgs
    if ($LASTEXITCODE -ne 0) { throw "Build falló con código $LASTEXITCODE" }
}
finally {
    if (Test-Path Env:\EAS_NO_VCS) { Remove-Item Env:\EAS_NO_VCS -ErrorAction SilentlyContinue }
}

Write-Host ''
Write-Info 'Build iniciado correctamente en EAS. Puedes ver el progreso con:'
Write-Host '  eas build:list' -ForegroundColor Gray
Write-Host '  eas build:view' -ForegroundColor Gray
Write-Host ''
Write-Info 'Dashboard del proyecto (Expo):'
Write-Host '  https://expo.dev/accounts/alexzimmer2/projects/tiempo-justo-mobile' -ForegroundColor Gray


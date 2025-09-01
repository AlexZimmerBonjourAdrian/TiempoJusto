Param(
    [switch]$InstallJdk,
    [switch]$InstallAndroid,
    [switch]$GlobalEas,
    [switch]$SetUserEnv,
    [string]$AndroidSdkPath,
    [string]$JavaHomePath
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
    if (-not (Test-Command 'winget')) {
        throw "winget no está disponible. Instala manualmente: $Id"
    }
    Write-Info "Instalando con winget: $Id"
    winget install --source winget -e --id $Id --accept-package-agreements --accept-source-agreements --silent | Out-Host
}

function Ensure-NodeNpm() {
    if (-not (Test-Command 'node')) {
        Write-Warn 'Node.js no encontrado. Instalando Node.js LTS...'
        Install-WithWinget 'OpenJS.NodeJS.LTS'
    }
    if (-not (Test-Command 'node')) { throw 'Node.js no se pudo instalar o no está en PATH.' }
    if (-not (Test-Command 'npm'))  { throw 'npm no está disponible después de instalar Node.js.' }
    Write-Info ("Node: " + (node -v))
    Write-Info ("npm:  " + (npm -v))
}

function Ensure-EasCli([switch]$InstallGlobal) {
    try {
        $version = (& npx --yes eas --version)
        Write-Info ("EAS (npx): " + $version)
    } catch {
        Write-Warn 'No se pudo obtener la versión de EAS vía npx.'
    }
    if ($InstallGlobal) {
        if (-not (Test-Command 'eas')) {
            Write-Info 'Instalando EAS CLI global (npm i -g eas-cli)...'
            npm install -g eas-cli | Out-Host
        }
        if (Test-Command 'eas') {
            Write-Info ("EAS (global): " + (eas --version))
        }
    }
}

function Ensure-ProjectDependencies() {
    if (-not (Test-Path -LiteralPath 'package.json')) { throw 'package.json no encontrado en el directorio actual.' }
    if (-not (Test-Path -LiteralPath 'node_modules')) {
        Write-Info 'Instalando dependencias del proyecto (npm install)...'
        npm install | Out-Host
    } else {
        Write-Info 'Dependencias detectadas. Verificando estado rápido (npm ci --dry-run)...'
        try { npm ci --dry-run | Out-Null } catch { Write-Warn 'Saltando verificación rápida.' }
    }
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
    if (-not $java -and $InstallJdk) {
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
    if (-not $sdk -and $InstallAndroid) {
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
            if (Test-Path $add -and -not ($env:PATH -split ';' | Where-Object { $_ -eq $add })) {
                $env:PATH = "$add;$env:PATH"
            }
        }
    } else {
        Write-Warn 'Android SDK no detectado. Usa -InstallAndroid o pasa -AndroidSdkPath.'
    }
}

function Verify-Expo() {
    try {
        $expoV = (& npx --yes expo --version)
        Write-Info ("Expo CLI (npx): " + $expoV)
    } catch {
        Write-Warn 'Expo CLI no respondió vía npx.'
    }
}

# Ejecución
Write-Info 'Comprobando Node/npm...'
Ensure-NodeNpm

Write-Info 'Comprobando EAS CLI...'
Ensure-EasCli -InstallGlobal:$GlobalEas

Write-Info 'Instalando dependencias del proyecto...'
Ensure-ProjectDependencies

Write-Info 'Comprobando JDK 17...'
Ensure-Jdk17

Write-Info 'Comprobando Android SDK...'
Ensure-Android

Write-Info 'Verificando Expo (npx)...'
Verify-Expo

Write-Host ''
Write-Info 'Setup completado.'
Write-Host 'Resumen:' -ForegroundColor Gray
Write-Host ("  Node: " + (node -v)) -ForegroundColor Gray
Write-Host ("  npm:  " + (npm -v)) -ForegroundColor Gray
try { Write-Host ("  EAS:  " + (& npx --yes eas --version)) -ForegroundColor Gray } catch { }
try { Write-Host ("  Expo: " + (& npx --yes expo --version)) -ForegroundColor Gray } catch { }
if ($env:JAVA_HOME)       { Write-Host ("  JAVA_HOME=" + $env:JAVA_HOME) -ForegroundColor Gray }
if ($env:ANDROID_SDK_ROOT){ Write-Host ("  ANDROID_SDK_ROOT=" + $env:ANDROID_SDK_ROOT) -ForegroundColor Gray }


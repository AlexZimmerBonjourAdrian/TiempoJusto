Param(
    [switch]$Tunnel,
    [switch]$ClearCache,
    [switch]$Qr,
    [switch]$Web
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Info([string]$Message) { Write-Host "[INFO] $Message" -ForegroundColor Cyan }
function Write-Warn([string]$Message) { Write-Host "[WARN] $Message" -ForegroundColor Yellow }
function Write-Err([string]$Message)  { Write-Host "[ERR ] $Message" -ForegroundColor Red }

function Test-Command([string]$Name) {
    return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

Write-Info 'Comprobando requisitos para Expo Go...'
if (-not (Test-Command 'node')) { throw 'Node.js no está instalado o no está en el PATH.' }
if (-not (Test-Command 'npm'))  { throw 'npm no está instalado o no está en el PATH.' }
Write-Info ("Node: " + (node -v))
Write-Info ("npm:  " + (npm -v))

# Instalar dependencias si es necesario
if (-not (Test-Path -LiteralPath 'node_modules')) {
    Write-Info 'Instalando dependencias (npm install)...'
    npm install | Out-Host
}

# Comandos base de Expo
$expoCmd = 'npx'
$expoArgs = @('expo', 'start')

if ($ClearCache) { $expoArgs += @('--clear') }
if ($Tunnel)     { $expoArgs += @('--tunnel') } else { $expoArgs += @('--lan') }
if ($Qr)         { $expoArgs += @('--qr') }
if ($Web)        { $expoArgs += @('--web') }

Write-Info ("Iniciando Expo para Expo Go: $expoCmd " + ($expoArgs -join ' '))
Write-Info 'Escanea el código QR con Expo Go en tu dispositivo.'

# Ejecuta Expo Start en primer plano (control-C para salir)
& $expoCmd @expoArgs


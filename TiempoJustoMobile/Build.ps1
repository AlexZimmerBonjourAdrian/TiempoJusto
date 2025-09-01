Param(
    [ValidateSet('development','preview','production')]
    [string]$Profile = 'production',

    [ValidateSet('android','all')]
    [string]$Platform = 'android',

    [switch]$NoVcs,
    [switch]$ClearCache,
    [switch]$AutoInstall = $true
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Info([string]$Message) { Write-Host "[INFO] $Message" -ForegroundColor Cyan }
function Write-Warn([string]$Message) { Write-Host "[WARN] $Message" -ForegroundColor Yellow }
function Write-Err([string]$Message)  { Write-Host "[ERR ] $Message" -ForegroundColor Red }

function Test-Command([string]$Name) {
    return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

function Ensure-Tool([string]$Command, [scriptblock]$Install) {
    if (Test-Command $Command) { return }
    if (-not $AutoInstall) {
        throw "No se encontró '$Command'. Instálalo o ejecuta con -AutoInstall."
    }
    Write-Info "Instalando $Command..."
    & $Install
}

Write-Info "Perfil: $Profile | Plataforma: $Platform"

# 1) Verificar Node/NPM
if (-not (Test-Command 'node')) { throw 'Node.js no está instalado o no está en el PATH.' }
if (-not (Test-Command 'npm'))  { throw 'npm no está instalado o no está en el PATH.' }
Write-Info ("Node: " + (node -v))
Write-Info ("npm:  " + (npm -v))

# 2) Verificar/usar EAS CLI vía npx (evita depender del PATH)
Ensure-Tool 'eas' { npm install -g eas-cli | Out-Host }
try {
    $easVersion = (& npx --yes eas --version)
    Write-Info ("EAS CLI: " + $easVersion)
} catch {
    Write-Warn 'No se pudo obtener la versión de EAS vía npx. Continuando...'
}

# 3) Instalar dependencias si falta node_modules
if (-not (Test-Path -LiteralPath 'node_modules')) {
    Write-Info 'Instalando dependencias (npm install)...'
    npm install | Out-Host
}

# 4) Limpiar caché de Expo opcional
if ($ClearCache) {
    Write-Info 'Limpiando caché de Metro/Expo (npm start -- --clear)...'
    # Ejecuta y termina (dev server no se mantiene vivo con --non-interactive)
    try { npm start -- --clear --non-interactive | Out-Host } catch { Write-Warn 'Limpieza rápida ejecutada.' }
}

# 5) Ejecutar build con EAS
if ($NoVcs) { $env:EAS_NO_VCS = '1' }
try {
    $argsList = @('eas','build','--platform', $Platform, '--profile', $Profile, '--non-interactive')
    $npxArgs = @('--yes') + $argsList
    Write-Info ("Ejecutando: npx " + ($argsList -join ' '))
    & npx @npxArgs
    if ($LASTEXITCODE -ne 0) { throw "Build falló con código $LASTEXITCODE" }
}
finally {
    if ($NoVcs) { Remove-Item Env:\EAS_NO_VCS -ErrorAction SilentlyContinue }
}

Write-Host ''
Write-Info 'Build iniciado correctamente en EAS. Puedes ver el progreso con:'
Write-Host '  eas build:list' -ForegroundColor Gray
Write-Host '  eas build:view' -ForegroundColor Gray
Write-Host ''
Write-Info 'Dashboard del proyecto (Expo):'
Write-Host '  https://expo.dev/accounts/alexzimmer2/projects/tiempo-justo-mobile' -ForegroundColor Gray


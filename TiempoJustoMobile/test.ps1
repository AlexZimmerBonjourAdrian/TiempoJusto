Param(
    [switch]$Watch,
    [switch]$Coverage,
    [switch]$UpdateSnapshots,
    [switch]$CI,
    [switch]$Silent,
    [string]$Pattern
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Info([string]$Message) { if (-not $Silent) { Write-Host "[INFO] $Message" -ForegroundColor Cyan } }
function Write-Warn([string]$Message) { if (-not $Silent) { Write-Host "[WARN] $Message" -ForegroundColor Yellow } }
function Write-Err([string]$Message)  { Write-Host "[ERR ] $Message" -ForegroundColor Red }

function Test-Command([string]$Name) { return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue) }

Write-Info 'Verificando Node y npm...'
if (-not (Test-Command 'node')) { throw 'Node.js no está instalado o no está en el PATH.' }
if (-not (Test-Command 'npm'))  { throw 'npm no está instalado o no está en el PATH.' }
Write-Info ("Node: " + (node -v))
Write-Info ("npm:  " + (npm -v))

# Instalar dependencias si falta node_modules
if (-not (Test-Path -LiteralPath 'node_modules')) {
    Write-Info 'Instalando dependencias (npm install)...'
    npm install | Out-Host
}

# Probar jest
try {
    $jestVersion = (& npx --yes jest --version)
    Write-Info ("Jest: " + $jestVersion)
} catch {
    Write-Warn 'Jest no respondió vía npx. Continuando...'
}

# Construir argumentos para jest
$jestArgs = @()
if ($CI)        { $jestArgs += '--ci' }
if ($Watch)     { $jestArgs += '--watch' }
if ($Coverage)  { $jestArgs += '--coverage' }
if ($UpdateSnapshots) { $jestArgs += '--updateSnapshot' }
if ($Pattern)   { $jestArgs += @('--testNamePattern', $Pattern) }

# Ejecutar pruebas
Write-Info ("Ejecutando: npx jest " + ($jestArgs -join ' '))
& npx --yes jest @jestArgs
$code = $LASTEXITCODE
if ($code -ne 0) {
    Write-Err "Pruebas fallidas con código $code"
    exit $code
}

Write-Info 'Pruebas completadas correctamente.'


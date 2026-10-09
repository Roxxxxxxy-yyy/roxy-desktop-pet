$ErrorActionPreference = 'Stop'
$projectDir = Split-Path -Parent $PSScriptRoot

& powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'create-icon.ps1')
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Push-Location $projectDir
try {
    $localElectronDist = Join-Path $projectDir 'node_modules\electron\dist'
    if (-not $env:ROXY_ELECTRON_DIST -and (Test-Path -LiteralPath (Join-Path $localElectronDist 'electron.exe'))) {
        $env:ROXY_ELECTRON_DIST = $localElectronDist
    }
    $builderArgs = @('exec', 'electron-builder', '--win', 'nsis', '--x64')
    if ($env:ROXY_ELECTRON_DIST) {
        $builderArgs += "-c.electronDist=$($env:ROXY_ELECTRON_DIST)"
    }
    & pnpm @builderArgs
    exit $LASTEXITCODE
}
finally {
    Pop-Location
}

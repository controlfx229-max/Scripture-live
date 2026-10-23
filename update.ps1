# Run with: npm run update   (after downloading the newest scripture-live.zip to Downloads)
$ErrorActionPreference = 'Stop'
$proj = $PSScriptRoot
$zip = Get-ChildItem "$env:USERPROFILE\Downloads\scripture-live*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $zip) { Write-Host 'No scripture-live zip found in Downloads.'; exit 1 }
Write-Host "Using $($zip.Name) ($($zip.LastWriteTime))"
$tmp = Join-Path $env:TEMP 'sl-update'
if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
Expand-Archive -Path $zip.FullName -DestinationPath $tmp -Force
Copy-Item -Path (Join-Path $tmp 'scripture-live\*') -Destination $proj -Recurse -Force
Remove-Item $tmp -Recurse -Force
Write-Host 'Updated. Your .env was not touched.'
npm install --silent
Write-Host 'Done. Now run: npm start'

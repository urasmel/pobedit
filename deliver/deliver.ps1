Write-Output "Current location is:"
$PWD.Path
Write-Output "Starting build process..."
# Start-Process npm -ArgumentList "run", "build" -wait
npm run build
Write-Output "Starting run process..."
# Start-Process npm -ArgumentList "run", "dev"
# npm run dev

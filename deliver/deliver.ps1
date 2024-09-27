Write-Output "Current location is:"
$PWD.Path
Write-Output "Starting build process..."
Start-Process npm -ArgumentList "run", "build" -wait
Write-Output "Starting run process..."
Start-Process npm -ArgumentList "run", "dev"

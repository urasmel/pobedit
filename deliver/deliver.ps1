Write-Output "Current location is:"
Write-Output Get-Location
Write-Output "Starting build process..."
Start-Process npm -ArgumentList "run", "build" -wait
Write-Output "Starting run process..."
Start-Process npm -ArgumentList "run", "dev"

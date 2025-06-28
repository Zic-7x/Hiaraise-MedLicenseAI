# Medical License Portal Backup Script
# This script creates a backup of the project excluding node_modules and build files

param(
    [string]$BackupPath = "D:\Backups\med-license-portal",
    [string]$DateFormat = "yyyy-MM-dd_HH-mm-ss"
)

# Get current date for backup folder name
$Date = Get-Date -Format $DateFormat
$BackupFolder = Join-Path $BackupPath $Date

Write-Host "Starting backup of Medical License Portal..." -ForegroundColor Green
Write-Host "Backup location: $BackupFolder" -ForegroundColor Yellow

# Create backup directory if it doesn't exist
if (!(Test-Path $BackupPath)) {
    New-Item -ItemType Directory -Path $BackupPath -Force
    Write-Host "Created backup directory: $BackupPath" -ForegroundColor Green
}

# Create date-specific backup folder
New-Item -ItemType Directory -Path $BackupFolder -Force | Out-Null

# Copy project files excluding node_modules and build directories
$SourcePath = Get-Location
$ExcludeDirs = @("node_modules", "build", "dist", ".git", ".supabase")

Write-Host "Copying project files..." -ForegroundColor Yellow

# Use robocopy for better control over what gets copied
$RobocopyArgs = @(
    $SourcePath,
    $BackupFolder,
    "/E",           # Copy subdirectories including empty ones
    "/XD",          # Exclude directories
    "node_modules",
    "build",
    "dist",
    ".git",
    ".supabase",
    "/XF",          # Exclude files
    "*.log",
    "*.tmp",
    "*.cache",
    "/R:3",         # Retry 3 times
    "/W:1",         # Wait 1 second between retries
    "/NFL",         # No file list
    "/NDL",         # No directory list
    "/NP"           # No progress
)

robocopy @RobocopyArgs

# Check if backup was successful
if ($LASTEXITCODE -le 7) {
    Write-Host "Backup completed successfully!" -ForegroundColor Green
    Write-Host "Backup location: $BackupFolder" -ForegroundColor Cyan
    
    # Create a backup info file
    $BackupInfo = @{
        "BackupDate" = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        "SourcePath" = $SourcePath
        "BackupPath" = $BackupFolder
        "GitCommit" = $(git rev-parse HEAD 2>$null)
        "GitBranch" = $(git branch --show-current 2>$null)
    }
    
    $BackupInfo | ConvertTo-Json | Out-File -FilePath (Join-Path $BackupFolder "backup-info.json") -Encoding UTF8
    
    Write-Host "Backup info saved to: backup-info.json" -ForegroundColor Green
} else {
    Write-Host "Backup completed with warnings or errors. Exit code: $LASTEXITCODE" -ForegroundColor Yellow
}

Write-Host "Backup process finished." -ForegroundColor Green 
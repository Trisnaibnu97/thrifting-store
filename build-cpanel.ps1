Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  MEMULAI PROSES BUILD NEXT.JS UNTUK CPANEL" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host "`n[1/4] Menjalankan npm run build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build gagal! Silakan periksa pesan error di atas." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n[2/4] Menyalin folder 'public' ke dalam 'standalone'..." -ForegroundColor Yellow
Copy-Item -Path ".\public" -Destination ".\.next\standalone\" -Recurse -Force

Write-Host "`n[3/4] Menyalin folder '.next/static' ke dalam 'standalone'..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path ".\.next\standalone\.next\static" | Out-Null
Copy-Item -Path ".\.next\static\*" -Destination ".\.next\standalone\.next\static\" -Recurse -Force

Write-Host "`n[4/4] Membungkus (ZIP) seluruh isi 'standalone'..." -ForegroundColor Yellow
if (Test-Path ".\upload.zip") { 
    Remove-Item ".\upload.zip" -Force 
}
Compress-Archive -Path ".\.next\standalone\*" -DestinationPath ".\upload.zip"

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host " ✅ SELESAI! File upload.zip sudah berhasil dibuat." -ForegroundColor Green
Write-Host " Silakan upload file upload.zip ini ke cPanel kamu." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

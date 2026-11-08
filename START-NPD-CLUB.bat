@echo off
title NPD CLUB Server
color 0b
echo ========================================================
echo        ✦ NPD CLUB STREETWEAR E-COMMERCE SERVER ✦
echo ========================================================
echo.
echo Menjalankan server NPD CLUB di http://localhost:5000 ...
echo (Jangan tutup jendela ini agar website tetap berjalan!)
echo.

cd /d "%~dp0"
start http://localhost:5000
node server/index.js

pause

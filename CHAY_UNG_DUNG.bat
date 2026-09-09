@echo off
chcp 65001 >nul
title SynchroEdu (He Thong Quan Tri Chuyen Mon & Dong Bo Ma Tran 2D)
echo ========================================================
echo   HE THONG QUAN TRI CHUYEN MON & BAO CAO MA TRAN 2D
echo                    SYNCHROEDU
echo ========================================================
echo.
echo [1/2] Dang mo trinh duyet tai http://localhost:3000 ...
start "" "http://localhost:3000"
echo [2/2] May chu HTTP dang hoat dong (Port 3000)...
echo.
echo * Luu y: Giu nguyen cua so nay khi dang su dung web.
echo * Nhan Ctrl + C de tat may chu khi dung xong.
echo.
node scripts/server.mjs
pause

@echo off
echo ============================================
echo   ENGRAVITY - Instalador de imagenes
echo ============================================
echo.

if not exist "D:\Engravity 1\Engravity- website\assets\images" (
    mkdir "D:\Engravity 1\Engravity- website\assets\images"
    echo [OK] Carpeta assets\images creada.
) else (
    echo [OK] Carpeta assets\images ya existe.
)

set SRC=C:\Users\comoe\.gemini\antigravity\brain\66599d87-21f8-4abb-8518-3c18cab0ebbc
set DST=D:\Engravity 1\Engravity- website\assets\images

echo.
echo Copiando imagenes...

copy "%SRC%\ada_sign_premium_1774839172216.png" "%DST%\ada-sign.png" /Y >nul 2>&1
if exist "%DST%\ada-sign.png" (echo   [OK] ada-sign.png) else (echo   [!!] ada-sign.png NO encontrada)

copy "%SRC%\cnc_carving_1774839187516.png" "%DST%\cnc-carving.png" /Y >nul 2>&1
if exist "%DST%\cnc-carving.png" (echo   [OK] cnc-carving.png) else (echo   [!!] cnc-carving.png NO encontrada)

copy "%SRC%\software_ui_mockup_1774840022024.png" "%DST%\software-ui.png" /Y >nul 2>&1
if exist "%DST%\software-ui.png" (echo   [OK] software-ui.png) else (echo   [!!] software-ui.png NO encontrada)

copy "%SRC%\workshop_wide_1774840036436.png" "%DST%\workshop.png" /Y >nul 2>&1
if exist "%DST%\workshop.png" (echo   [OK] workshop.png) else (echo   [!!] workshop.png NO encontrada)

copy "%SRC%\braille_closeup_1774840416092.png" "%DST%\braille-closeup.png" /Y >nul 2>&1
if exist "%DST%\braille-closeup.png" (echo   [OK] braille-closeup.png) else (echo   [!!] braille-closeup.png NO encontrada)

copy "%SRC%\vinyl_cutting_1774840427503.png" "%DST%\vinyl-cutting.png" /Y >nul 2>&1
if exist "%DST%\vinyl-cutting.png" (echo   [OK] vinyl-cutting.png) else (echo   [!!] vinyl-cutting.png NO encontrada)

copy "%SRC%\acrylic_standoff_sign_1774853551364.png" "%DST%\acrylic-sign.png" /Y >nul 2>&1
if exist "%DST%\acrylic-sign.png" (echo   [OK] acrylic-sign.png) else (echo   [!!] acrylic-sign.png NO encontrada)

copy "%SRC%\wood_metal_corporate_sign_1774853565625.png" "%DST%\wood-metal-sign.png" /Y >nul 2>&1
if exist "%DST%\wood-metal-sign.png" (echo   [OK] wood-metal-sign.png) else (echo   [!!] wood-metal-sign.png NO encontrada)

copy "%SRC%\modern_ada_braille_sign_1774853579731.png" "%DST%\modern-ada-sign.png" /Y >nul 2>&1
if exist "%DST%\modern-ada-sign.png" (echo   [OK] modern-ada-sign.png) else (echo   [!!] modern-ada-sign.png NO encontrada)

echo.
echo ============================================
echo   LISTO! Abre index.html en tu navegador.
echo ============================================
pause

# Script para copiar las imagenes generadas al proyecto
$imgDir = "D:\Engravity 1\Engravity- website\assets\images"
$srcDir = "C:\Users\comoe\.gemini\antigravity\brain\66599d87-21f8-4abb-8518-3c18cab0ebbc"

# Crear carpeta si no existe
if (!(Test-Path $imgDir)) { New-Item -ItemType Directory -Force -Path $imgDir }

# Copiar imagenes
Copy-Item "$srcDir\ada_sign_premium_1774839172216.png" "$imgDir\ada-sign.png" -Force
Copy-Item "$srcDir\cnc_carving_1774839187516.png" "$imgDir\cnc-carving.png" -Force
Copy-Item "$srcDir\software_ui_mockup_1774840022024.png" "$imgDir\software-ui.png" -Force
Copy-Item "$srcDir\workshop_wide_1774840036436.png" "$imgDir\workshop.png" -Force
Copy-Item "$srcDir\braille_closeup_1774840416092.png" "$imgDir\braille-closeup.png" -Force
Copy-Item "$srcDir\vinyl_cutting_1774840427503.png" "$imgDir\vinyl-cutting.png" -Force

Write-Host "✅ 6 imagenes copiadas exitosamente a $imgDir" -ForegroundColor Green

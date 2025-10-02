# 🚀 Script de Configuración StoryUp
# Ejecuta estos comandos paso a paso

Write-Host "🎯 Configurando StoryUp..." -ForegroundColor Cyan

# 1. Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

# 2. Verificar que tienes las dependencias principales
Write-Host "🔍 Verificando dependencias críticas..." -ForegroundColor Yellow
npm list react react-dom react-router-dom lucide-react
npm list @radix-ui/react-avatar @radix-ui/react-button @radix-ui/react-card
npm list class-variance-authority clsx tailwind-merge
npm list bcryptjs jsonwebtoken pg

# 3. Instalar dependencias que puedan faltar
Write-Host "➕ Instalando dependencias adicionales si faltan..." -ForegroundColor Yellow
npm install bcryptjs jsonwebtoken pg
npm install -D @types/bcryptjs @types/jsonwebtoken @types/pg

# 4. Crear archivo de entorno
Write-Host "⚙️ Configurando variables de entorno..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Archivo .env creado. ¡EDÍTALO con tus datos de base de datos!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Archivo .env ya existe" -ForegroundColor Orange
}

# 5. Verificar estructura del proyecto
Write-Host "📁 Verificando estructura del proyecto..." -ForegroundColor Yellow
if (Test-Path "api") {
    Write-Host "✅ Carpeta api encontrada" -ForegroundColor Green
} else {
    Write-Host "❌ Falta carpeta api" -ForegroundColor Red
}

if (Test-Path "src/pages/FeedPage.tsx") {
    Write-Host "✅ Páginas principales encontradas" -ForegroundColor Green
} else {
    Write-Host "❌ Faltan páginas principales" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "1. 🗄️ Configura tu base de datos PostgreSQL"
Write-Host "2. ✏️ Edita el archivo .env con tus credenciales"
Write-Host "3. 🚀 Ejecuta: npm run dev"
Write-Host "4. 🌐 Abre: http://localhost:5181"
Write-Host ""
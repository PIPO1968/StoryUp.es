# Despliegue de StoryUp.es en Vercel (Frontend)

Para que el frontend se despliegue correctamente en Vercel, asegúrate de:

1. **Directorio raíz del proyecto en Vercel:**
   - Selecciona la carpeta `frontend` como raíz del proyecto en la configuración de Vercel.

2. **Comando de build:**
   - Usa: `npm run build`

3. **Directorio de salida:**
   - Usa: `build`

4. **Notas:**
   - No es necesario modificar el `package.json` del frontend, ya está correcto.
   - Si tienes un monorepo, asegúrate de que Vercel apunte a la carpeta `frontend` y no a la raíz del repositorio.

---

**Ejemplo de configuración en Vercel:**
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `build`

Esto garantiza que se use Create React App y no los scripts de la raíz del monorepo.

# Checklist de validación para producción

## 1. Visual y UX
- [ ] Animaciones suaves en modales y transiciones.
- [ ] Toasts y feedback visual en acciones clave (enviar mensaje, crear grupo, error, éxito).
- [ ] Indicador de "escribiendo" en chats privados y grupos.
- [ ] Mostrar "última conexión" de usuarios y grupos.
- [ ] Responsive avanzado: experiencia fluida en móvil y escritorio.
- [ ] Accesibilidad: contraste, navegación por teclado, textos alternativos.

## 2. Funcionalidad
- [ ] Crear, editar y eliminar grupos (solo admin puede editar/eliminar).
- [ ] Salir de grupo (no admin).
- [ ] Menciones con @usuario en mensajes de grupo.
- [ ] Mensajes fijados en grupos.
- [ ] Previsualización de enlaces en mensajes.
- [ ] Stickers y GIFs integrados.
- [ ] Temas de color personalizados por usuario.

## 3. Seguridad y robustez
- [ ] Validación de formularios (longitud, archivos, campos obligatorios).
- [ ] Manejo de errores de red y feedback claro.
- [ ] Control de acceso: solo miembros pueden ver mensajes de grupo.
- [ ] Sanitización de entradas para evitar XSS.

## 4. Backend y despliegue
- [ ] Endpoints protegidos y validados.
- [ ] Logs de errores y monitoreo.
- [ ] Variables de entorno seguras (sin credenciales en frontend).
- [ ] Despliegue en Vercel/Render verificado.
- [ ] Dominio y SSL activos.

## 5. Pruebas
- [ ] Pruebas manuales de todos los flujos principales.
- [ ] Pruebas de carga básica (usuarios simultáneos, mensajes rápidos).
- [ ] Pruebas de subida de archivos y multimedia.
- [ ] Pruebas de UX en móvil y escritorio.

---

Marca cada punto tras validarlo. Si necesitas ayuda para automatizar alguna validación, ¡avísame!
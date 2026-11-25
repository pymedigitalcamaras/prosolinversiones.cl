# Informe de entrega F3-A — Prosol Inversiones

**Fecha de cierre:** 26 de octubre de 2026  
**Rama local:** `feature/f3-backend-paneles`  
**Alcance:** base local de autenticación demo, estructura de tres paneles y diseño preliminar de datos y autorización.

## 1. Resultado

F3-A quedó implementada y verificada en un entorno estrictamente local. La entrega no incluye persistencia, gestión operativa del CRM, Supabase remoto, Vercel, migraciones aplicadas, despliegues ni cambios en NAE.

Los módulos que requieren funcionalidad posterior están identificados como **F3-B** o **pendientes de datos**. No se presentan acciones simuladas como si fueran operativas.

## 2. Base y control de versiones

Al iniciar F3-A no estaba disponible el directorio `.git` de F2. Para evitar atribuir un historial inexistente:

- Se compararon 64 archivos del proyecto con `Prosol_F2_codigo_fuente.zip`.
- Los 64 archivos coincidieron y no se encontraron diferencias ni archivos adicionales fuera de `.next`.
- Se reconstituyó una base Git local en `master`, con el commit `b48f0c2` («Base F2 aprobada reconstituida localmente»).
- El commit original documentado para F2 fue `0f8c27888fe0c64f2d214170a72a834ea6a67c15`, pero su historial no se recuperó. El nuevo commit no debe interpretarse como continuación criptográfica de ese historial.
- F3-A se desarrolló en `feature/f3-backend-paneles`.
- No existe remoto Git configurado. No se hizo push, merge ni despliegue.

## 3. Dependencias y compilación

Se mantuvo la línea principal de Next.js 15 y React 19, actualizando las dependencias dentro de versiones compatibles para recoger correcciones de seguridad publicadas:

- `next`: 15.5.28.
- `eslint-config-next`: 15.5.28.
- `react`: 19.1.10.
- `react-dom`: 19.1.10.

No se rotó, revocó, caducó ni invalidó ninguna credencial.

La compilación de producción local terminó correctamente, con validación de tipos y 31 páginas generadas. ESLint terminó sin errores ni advertencias. `git diff --check` no detectó problemas de espacios o conflictos.

## 4. Autenticación demo local

La ruta `/acceso` permite entrar con tres identidades sintéticas:

| Perfil | Correo sintético | Destino |
|---|---|---|
| EMPRESA | `empresa@f3.example` | `/panel/empresa` |
| Administrador | `administrador@f3.example` | `/panel/administrador` |
| Asesor | `asesor@f3.example` | `/panel/asesor` |

La clave común de prueba es `F3A-local-demo`. **No es una credencial real ni debe reutilizarse como contraseña.**

Controles implementados:

- Sesión firmada con HMAC-SHA256 y duración de 30 minutos.
- Cookie `httpOnly`, `SameSite=Strict` y alcance `/`.
- `Secure` configurable; se mantiene desactivado únicamente para la prueba HTTP en localhost.
- Verificación de firma, expiración, emisión, identidad y rol.
- Redirección a `/acceso` cuando no existe una sesión válida.
- Respuesta 404 al intentar entrar a un panel de otro rol, sin revelar su contenido.
- Validación de `Origin` en ingreso y cierre de sesión.
- Límite demo en memoria: cinco intentos fallidos por correo en cinco minutos; el sexto devuelve 429.
- Respuestas privadas con `Cache-Control: private, no-store, max-age=0`.
- Rutas de acceso y paneles con `noindex`; `/panel/` excluido de robots y todos los paneles fuera del sitemap.
- El modo demo se bloquea si existe `VERCEL` o `NEXT_PUBLIC_SUPABASE_URL`.

Esta autenticación es exclusivamente una demostración local. No sustituye Supabase Auth ni un sistema productivo de usuarios, invitaciones, recuperación o revocación de sesiones.

## 5. Estructura de paneles

### EMPRESA

Incluye la estructura visual para bandeja inicial CRM, contenidos, usuarios y permisos, ARSOP y auditoría. No consulta una base de datos ni gestiona contactos todavía.

### Administradores

Presenta un «Edificio de prueba A», sin dirección, comunidad, administrador ni antecedentes reales. Proyectos, presupuestos y bitácora quedan señalados como F3-B. El panel no contiene módulo de comisiones.

### Colaboradores y asesores

Presenta un «Cliente de prueba A», sin datos identificables. No se definieron porcentajes, bases, montos, aprobaciones ni pagos de comisiones. La vista prevé solo los clientes autorizados y la lectura de comisiones legítimas.

Todos los textos e identidades de los paneles son sintéticos.

## 6. Diseño SQL y RLS — archivos no aplicados

Se agregaron dos archivos preliminares:

- `supabase/migrations/202610260001_f3_schema.sql`.
- `supabase/migrations/202610260002_f3_rls.sql`.

El diseño contiene 22 tablas para perfiles, roles, contactos, consentimientos, asignaciones, actividades, avisos, edificios, membresías, clientes de asesores, proyectos, presupuestos, bitácoras, comisiones, contenidos, ARSOP, consentimiento de cookies y auditoría.

Controles centrales del diseño:

- RLS habilitada en las 22 tablas.
- Lectura anónima limitada a contenidos publicados y no demo.
- Contactos aislados por triage, asignación y relación autorizada con el asesor.
- Edificios y proyectos condicionados a membresías.
- Comisiones visibles para el asesor correspondiente; creación y modificación restringidas a triage.
- ARSOP restringido al rol responsable.
- Auditoría sin edición desde clientes.
- Consentimiento con finalidad, versión, hash SHA-256 y fecha; sin registrar IP por defecto.
- Funciones de autorización con `search_path` fijado.
- Imposibilidad de publicar contenido marcado como demo.
- Ningún borrado automático de contactos: la retención aprobada deberá implementarse y probarse posteriormente, sin extenderla a otras categorías.

### Prohibición de comisiones a administradores

El esquema incorpora dos bloqueos independientes:

1. Un trigger exige que el receptor tenga rol de asesor y rechaza cualquier comisión para un usuario con rol de administrador.
2. Otro trigger impide asignar posteriormente el rol de administrador a un usuario que ya tenga comisiones.

**Límite esencial:** el SQL no se ejecutó. Las 22 comprobaciones aprobadas son estáticas y no equivalen a pruebas de PostgreSQL, Supabase o RLS contra una base real.

## 7. Verificación final

### Automatizada

- ESLint: aprobado, sin errores ni advertencias.
- Compilación Next.js: aprobada; 31 páginas.
- Comprobaciones SQL estáticas: 22/22.
- Criterios extraídos de las pruebas Chromium: 28/28.
- Consola del navegador: sin errores.
- Imágenes: ninguna rota ni sin atributo `alt` en los paneles verificados.
- Responsive: sin desborde horizontal a 1440 px ni a 390 px.
- Revisión previa al empaquetado: sin archivos `.env` con valores ni coincidencias de patrones sensibles en los archivos revisados.

### Accesos y seguridad demo

- Panel sin sesión: 307 hacia `/acceso`.
- Panel propio de cada rol: 200.
- Accesos cruzados: 404.
- Cookie alterada: 307 hacia `/acceso`.
- Ingreso sin `Origin` o con origen inválido: 403.
- Intentos fallidos consecutivos: 401, 401, 401, 401, 401 y 429.
- Cierre de sesión: posterior acceso al panel devuelve 307 hacia `/acceso`.
- Cookie: `httpOnly=true`, `SameSite=Strict`; `secure=false` es el resultado esperado en localhost HTTP.

### Regresión pública

La portada, el acceso, el sitemap y robots respondieron 200. Los formularios públicos conservaron su comportamiento F2: respuesta 503 con `F2_DEMO_WITHOUT_PERSISTENCE`, sin mostrar una persistencia inexistente.

### Revisión visual

Se revisaron directamente ocho capturas finales: acceso y los tres paneles, en escritorio y móvil. La jerarquía, legibilidad, navegación, mensajes de alcance y adaptación responsive resultaron coherentes. No se detectaron cortes, solapamientos ni desbordes.

## 8. Ejecución local reproducible

Desde la raíz del proyecto, en un shell compatible con Bash:

```bash
npm ci
export F3_LOCAL_DEMO=true
export F3_DEMO_SESSION_SECRET="$(python3 -c 'import secrets; print(secrets.token_urlsafe(48))')"
export F3_DEMO_SECURE_COOKIE=false
npm run build
npm start
```

Abrir `http://localhost:3000/acceso` e ingresar con una identidad sintética y la clave demo indicada.

El secreto debe proporcionarse solo como variable de entorno y tener al menos 32 caracteres. No se incluye en el código ni en los paquetes. Al generar uno nuevo y reiniciar el servidor, las sesiones demo anteriores dejan de ser válidas; esto no afecta ninguna credencial real.

Comprobaciones disponibles:

```bash
npm run lint
python3 supabase/tests/test_f3_static.py
```

Con el servidor demo activo y Playwright/Chromium disponibles:

```bash
python3 tests/verificar_f3a.py
```

El script de navegador guarda sus resultados en `/mnt/agents/output/evidencia-f3a`, ruta propia del entorno de elaboración. Para ejecutarlo en otro equipo debe ajustarse `OUT` y, si corresponde, la ruta de Chromium.

## 9. Evidencia incluida

- `compilacion.txt`: compilación final.
- `lint.txt`: revisión ESLint final.
- `verificacion-sql-estatica.txt`: 22 comprobaciones estáticas.
- `verificacion-navegador.json`: resultados estructurados de Chromium.
- `verificacion-navegador.txt`: salida completa de la ejecución.
- `criterios-navegador.txt`: evaluación de 28 criterios.
- Ocho capturas PNG de acceso y paneles en escritorio y móvil.

## 10. Fuera de alcance y siguiente decisión

No se realizó ninguna de las siguientes acciones:

- Modificar, consultar productivamente o desplegar NAE.
- Conectar Supabase o Vercel.
- Aplicar migraciones o ejecutar el SQL en PostgreSQL.
- Incorporar datos reales.
- Activar formularios persistentes.
- Implementar CRM, contenidos editables, proyectos, presupuestos, bitácoras, comisiones o ARSOP operativos.
- Hacer merge, push, despliegue o publicación.
- Iniciar F3-B, F3-C o producción.

**La ejecución se detiene aquí. Cualquier trabajo posterior requiere una autorización escrita y acotada del usuario.**

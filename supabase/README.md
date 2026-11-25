# Base F3-A — Supabase Prosol

Estos archivos son un **diseño preliminar local**. No se han aplicado a Supabase ni a PostgreSQL y no contienen datos reales.

## Archivos

1. `migrations/202610260001_f3_schema.sql`: tablas, índices, funciones y restricciones.
2. `migrations/202610260002_f3_rls.sql`: RLS y privilegios por rol.
3. `tests/test_f3_static.py`: comprobaciones estáticas sin conexión.

## Reglas centrales

- `empresa_triage`: Marcelo, Julio y Alejandro cuando se creen sus accesos reales; bandeja completa y asignación.
- `empresa_ventas`: solo contactos asignados.
- `administrador`: solo edificios con membresía.
- `asesor`: solo contactos vinculados y comisiones propias de solo lectura.
- `arsop_manager`: único rol con acceso al módulo ARSOP.
- Público anónimo: solo contenido publicado y no demostrativo.
- `notification_outbox` y `cookie_consents`: sin acceso directo de cliente.
- La base impide comisiones a administradores y exige rol de asesor para toda comisión.
- El contenido demostrativo no puede publicarse desde este esquema.
- No existe borrado automático de contactos en F3-A.

## Prueba estática

```bash
python3 supabase/tests/test_f3_static.py
```

## Pendientes obligatorios antes de aplicar

- Revisión del SQL en un proyecto nuevo y vacío de Prosol.
- Pruebas de sintaxis y migración en desarrollo.
- Pruebas RLS con usuarios simulados de todos los roles.
- Pruebas de acceso cruzado y de acceso anónimo.
- Revisión de funciones `security definer` y privilegios efectivos.
- Confirmación de reglas comerciales, permisos reales y retención.
- Aprobación escrita de la subfase y del entorno donde se aplicaría.

Nunca ejecutar estos archivos en NAE ni en una base con datos existentes.

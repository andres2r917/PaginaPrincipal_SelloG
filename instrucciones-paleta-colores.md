# Instrucciones: Unificar paleta de colores "Púrpura Real & Medianoche"

Objetivo: que **Login, Registro, RegistroFundacion, Denuncia, Adopcion y Perfil**
usen la misma paleta que ya usa el Home (`Header.css`, `Navbar.css`, `Footer.css`,
`Seccion1.css` — estos 4 archivos **no se tocan**, ya están correctos).

Todos los cambios son dentro de: `src/Style/` y `src/index.css`.

---

## Paso 1 — Agregar variables globales en `src/index.css`

El archivo está vacío actualmente. Agregar este bloque completo al inicio:

```css
:root {
  --color-primario: #7C3AED;         /* Púrpura Principal */
  --color-primario-hover: #6D28D9;   /* Variante oscura para :hover/:active */
  --color-fondo: #0F172A;            /* Azul Medianoche */
  --color-superficie: rgba(15, 23, 42, 0.75); /* Cristal/Superficies flotantes */
  --color-acento-suave: #C4B5FD;     /* Lavanda Suave */
  --color-exito: #10B981;            /* Verde Esmeralda */
  --color-error: #E11D48;            /* Rojo Carmesí */
}
```

---

## Paso 2 — `src/Style/Adopcion.css`

Reemplazar el bloque `:root` existente (líneas 1-12) por:

```css
:root {
  --verde-principal: var(--color-primario);
  --verde-hover:     var(--color-primario-hover);
  --fondo-modal:     var(--color-fondo);
  --fondo-izq:       var(--color-fondo);
  --fondo-input:     var(--color-superficie);
  --texto-principal: #f0f0f5;
  --texto-muted:     var(--color-acento-suave);
  --borde-sutil:     rgba(255, 255, 255, 0.08);
  --radio:           16px;
  --radio-sm:        8px;
  --transicion:      0.2s ease;
}
```

Además, buscar y reemplazar en el resto del archivo:

| Buscar | Reemplazar por |
|---|---|
| `rgba(44, 172, 97, 0.15)` (fondo de `.exito-icono` y `.badge-green`) | `rgba(16, 185, 129, 0.15)` |
| `rgba(44, 172, 97, 0.35)`, `rgba(44, 172, 97, 0.3)`, `rgba(44, 172, 97, 0.4)` | `rgba(124, 58, 237, 0.3)` |

> El resto del archivo hereda los cambios automáticamente porque usa las variables `--verde-principal`, `--verde-hover`, etc.

---

## Paso 3 — Los siguientes 5 archivos NO tienen variables `:root`

Aplica esta misma tabla de búsqueda y reemplazo en cada uno de:
`Login.css`, `Registro.css`, `RegistroFundacion.css`, `Denuncia.css`, `Perfil.css`

### 3.1 Color de marca / primario (títulos, botones, bordes de foco, links, checkbox)

| Buscar | Reemplazar por |
|---|---|
| `#20B355` | `var(--color-primario)` |
| `#22c55e` | `var(--color-primario)` |
| `#1bc15b` | `var(--color-primario)` |
| `#14be64` | `var(--color-primario)` |
| `#006d32` | `var(--color-primario)` |
| `#1fc744` | `var(--color-primario)` |

### 3.2 Estados hover / activo (versión oscura del morado)

| Buscar | Reemplazar por |
|---|---|
| `#15803d` | `var(--color-primario-hover)` |
| Cualquier `#22c55e` usado específicamente en un selector `:hover` o `:active` | `var(--color-primario-hover)` |

### 3.3 Sombra de foco en inputs (`box-shadow` al hacer focus)

| Buscar | Reemplazar por |
|---|---|
| `rgba(34, 197, 94, 0.15)` | `rgba(124, 58, 237, 0.15)` |
| `rgba(32, 179, 85, 0.1)` | `rgba(124, 58, 237, 0.1)` |
| `rgba(32, 179, 85, 0.12)` | `rgba(124, 58, 237, 0.12)` |
| `rgba(32, 179, 85, 0.2)` / `0.3)` | `rgba(124, 58, 237, 0.2)` / `0.3)` |

### 3.4 Fondos oscuros / overlays

| Buscar | Reemplazar por |
|---|---|
| `#0e0f0f`, `#1a1a1a`, `#1a1a1aab`, `#0303037e` | `var(--color-fondo)` |
| `rgba(0,0,0,0.82)`, `rgba(0, 0, 0, 0.82)` | `var(--color-superficie)` |
| `rgba(0,0,0,0.3)`, `rgba(0, 0, 0, 0.3)` | `rgba(15, 23, 42, 0.3)` |
| `rgba(22, 29, 31, 0.56)`, `rgba(22, 29, 31, 0.288)`, `rgba(22, 29, 31, 0.384)` | `rgba(15, 23, 42, 0.56)` (mantener la misma opacidad del valor original) |

### 3.5 Texto secundario / muted

| Buscar | Reemplazar por |
|---|---|
| `#8888aa`, `#bbbbbb`, `#888888` | `var(--color-acento-suave)` |

### 3.6 Errores (mantener rojo, pero unificado)

| Buscar | Reemplazar por |
|---|---|
| `#dc2626` | `var(--color-error)` |
| `#ff6b6b` | `var(--color-error)` |
| `#f87171` | `var(--color-error)` |
| `#ef4444` | `var(--color-error)` |

### 3.7 Éxito real (no confundir con el color de marca)

Solo en los lugares donde el verde representa una confirmación/estado positivo real
(por ejemplo el ícono de check en un modal de "registro exitoso", o un badge de
"aprobado"), usar:

| Buscar | Reemplazar por |
|---|---|
| Verde usado específicamente en modal/ícono de éxito (ej. `.modal-exito`, `.exito-icono`, badges de aprobación) | `var(--color-exito)` |

---

## Paso 4 — Verificación final

1. Confirmar que `Header.css`, `Navbar.css`, `Footer.css` y `Seccion1.css` **no** se modificaron.
2. Buscar en todo `src/Style/` que no quede ningún `#20B355`, `#22c55e`, `#2cac61`,
   `#1bc15b`, `#14be64`, `#006d32`, `#15803d`, `#1fc744` suelto (deben haber sido
   reemplazados por variables).
3. Probar visualmente: Login, Registro, RegistroFundacion, Denuncia, Adopcion y
   Perfil deben verse en morado (`#7C3AED`) sobre fondo azul medianoche
   (`#0F172A`), igual que el Home.
4. Confirmar que los mensajes de error se ven en rojo carmesí (`#E11D48`) y los de
   éxito en verde esmeralda (`#10B981`) — estos dos **no** deben volverse morados.

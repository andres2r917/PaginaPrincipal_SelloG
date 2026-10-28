# Diagnóstico de estilos: Sello Guardián (frontend)

Datos tomados del proyecto `PaginaPrincipal_SelloG` (React 19 + Vite) a octubre de 2026.

## 4.1 Inventario de estilos

| Pregunta | Respuesta del equipo |
| --- | --- |
| ¿Cuántos archivos `.css` tiene el proyecto? | 19 archivos dentro de `src/` (unas 5.800 líneas). Los más largos: `FundacionPanel.css` (918 líneas), `Adopcion.css` (807) y `AdminDashboard.css` (632). |
| ¿Cuántas clases CSS distintas hay, aproximadamente? | Unas 580 (583 nombres de clase distintos). |
| ¿Qué colores usa la marca del proyecto? | Primario `#7C3AED`, primario oscuro `#6D28D9`, acento `#C4B5FD`, fondo `#0F172A`, texto `#F8FAFC`, texto suave `#CBD5E1`, texto gris `#94A3B8`, éxito `#10B981`, peligro `#E11D48` y aviso `#F59E0B`. Están en `Style/variables.css`. |
| ¿Qué fuentes usa? | Nunito (Google Fonts, pesos 400 a 900) con `sans-serif` de respaldo. |
| ¿Se ve bien en celular? | Parcialmente. 11 de los 19 archivos CSS tienen `@media`, pero `Header.css` y `Navbar.css` no, y no hay menú para celular. La app móvil se está haciendo aparte en React Native. |
| ¿Hay estilos repetidos en varios archivos? ¿Cuáles? | Sí. El blanco (`#FFF` y `#FFFFFF`) está escrito unas 59 veces en 9 archivos. El morado de la marca en versión `rgba(124, 58, 237, …)` aparece 141 veces en 15 archivos, sin usar la variable. Las tarjetas `sec1__card` y `sec2__card` (`Seccion1.css`) son casi iguales. Hay 12 nombres de clase definidos en más de un archivo (por ejemplo `.hero`, `.acceso-btn`, `.admin-sidebar`). También hay unos 74 estilos en línea (`style={{ }}`) en el JSX. |
| ¿Usan algún framework de estilos? | Hasta ahora ninguno, solo CSS propio. Ya instalamos Tailwind CSS v4 y lo usamos en 3 piezas de prueba: el Footer, la página Mis solicitudes y el filtro de color del mapa. El resto sigue en CSS. |

## 4.2 Mapa de componentes

| Componente del ejemplo | Componente equivalente en nuestro proyecto | Archivo CSS que usa hoy |
| --- | --- | --- |
| Header | `Header.jsx`: barra superior con logo, enlaces, notificaciones y menú de usuario | `Style/Header.css` |
| Navbar | `Navbar.jsx`, que en nuestro proyecto es la portada (hero) del Home: título, botón y estadísticas. La navegación está en `Header.jsx` | `Style/Navbar.css` |
| Main | `Home.jsx` (y las demás páginas: `Adopcion.jsx`, `Denuncia.jsx`…), que arman la pantalla juntando componentes | Ninguno propio en `Home.jsx`; cada página usa el suyo (por ejemplo `Style/Adopcion.css`) |
| Section | `Seccion1.jsx`: "Reportes recientes" y "Mascotas en adopción" | `Style/Seccion1.css` |
| Footer | `Footer.jsx` | Ninguno: ya migrado a Tailwind (antes `Style/Footer.css`) |

## 4.3 Preguntas para el equipo

**1. ¿Qué componente de su proyecto tiene el CSS más difícil de mantener? ¿Por qué?**
`Adopcion.css` y `FundacionPanel.css`. Son los archivos más largos (807 y 918 líneas), con muchas clases cada uno (62 y 93). Además `Adopcion.css` comparte la clase `.hero` con el Home, así que tocarlo puede dañar otra pantalla sin que lo notemos.

**2. El cliente o usuario de su proyecto, ¿qué esperaría ver en un celular?**
Alguien que ve un caso de maltrato en la calle esperaría denunciar rápido: tomar la foto, marcar la ubicación con el GPS y enviar. También esperaría ver el mapa con "Cómo llegar", llamar con un toque al teléfono de emergencia o de la fundación, ver las mascotas en adopción y consultar cómo va su solicitud. Todo con botones grandes y un menú fácil de usar. Parte de eso lo cubre la app en React Native, pero la web también debería verse bien en celular.

**3. Si mañana el cliente pide cambiar el color principal, ¿cuántos archivos tendrían que modificar?**
En teoría, uno: `variables.css`, porque ahí está `--color-primario` y el hexadecimal `#7C3AED` solo aparece una vez. En la práctica serían unos 15 archivos más, porque el mismo morado está escrito como `rgba(124, 58, 237, …)` unas 141 veces sin usar la variable. Habría que revisarlos uno por uno.

**4. ¿Qué componente migrarían primero a Tailwind como prueba? Justifiquen la elección.**
El Footer. Es estático, no tiene estado ni lógica, se usa en un solo lugar (el Home) y su CSS no lo comparte con nadie, así que el riesgo de dañar otra pantalla es mínimo. Después migramos Mis solicitudes (una página aislada) y el filtro del mapa. Descartamos `Navbar.css` porque comparte `.hero` con Adopción, y `Notificaciones.css` porque depende de estilos del panel de admin. Para comprobar que no cambió nada comparamos capturas antes y después, en tres anchos de pantalla, y salieron idénticas.

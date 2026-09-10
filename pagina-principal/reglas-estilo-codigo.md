# Reglas de estilo de código — SelloG

Estas reglas aplican para cualquier código, CSS, commits o documentación que se
genere en este proyecto (por IA o por una persona). El objetivo es que el
código se vea consistente con el resto del repo, sin marcas típicas de
generación automática.

---

## 1. Nada de menciones ni marcas de IA

- No incluir comentarios como `// Generado por IA`, `/* Creado con ayuda de IA */`,
  `// AI-generated`, firmas, ni encabezados de este tipo en ningún archivo.
- No agregar líneas de commit tipo `Co-authored-by: Claude` u otras firmas de
  asistentes. Los commits se firman solo con el autor real del repositorio.
- No dejar metadatos, timestamps de generación ni comentarios de "prompt" o
  "instrucciones usadas" dentro del código.

## 2. Comentarios: solo los necesarios

- No comentar lo obvio (`// suma dos números` sobre una función `sumar()`).
- Comentar únicamente decisiones no evidentes: por qué se eligió un enfoque,
  una excepción de negocio, un workaround temporal.
- Mantener el mismo idioma y tono de los comentarios ya existentes en el
  archivo (en este repo, español informal, sin punto final).
- Evitar bloques de comentario tipo "documentación exagerada" (listas con
  `@param`, `@returns` en funciones simples de React/CSS que no lo usan en
  ningún otro archivo del proyecto).

## 3. Nombres y estructura naturales

- Usar los mismos patrones de nombres ya presentes en el proyecto (ej. clases
  BEM tipo `.dn-btn`, `.lg-input`, prefijos por página como ya se usa en
  `Denuncia.css`, `Login.css`, etc.). No inventar convenciones nuevas.
- No sobre-modularizar ni crear abstracciones que no pidieron: si el resto del
  código resuelve algo con CSS plano, no meter una solución con
  variables/mixins que no existen en ningún otro archivo.
- Mantener el mismo nivel de indentación, comillas (simples/dobles) y formato
  que ya usa el archivo que se está editando.

## 4. Consistencia con el código ya escrito

- Antes de escribir código nuevo, revisar cómo está resuelto algo similar en
  el mismo proyecto y seguir ese mismo patrón (orden de propiedades CSS,
  forma de nombrar componentes, estructura de carpetas).
- No reescribir código que ya funciona solo por "prolijidad" si no se pidió.
- No agregar dependencias, librerías o herramientas nuevas que no estén ya en
  `package.json` sin que se pidan explícitamente.

## 5. Commits y mensajes

- Mensajes de commit cortos, en español, en tiempo presente/infinitivo
  (`corrige color de botón en login`, no `Fixed button color using AI
  assistance`).
- Sin emojis ni etiquetas automáticas a menos que el resto del historial del
  repo ya las use.

## 6. Documentación (README, .md)

- Escribir igual que el resto de la documentación del proyecto: directa, sin
  frases de relleno como "en este documento exploraremos" o "es importante
  destacar que".
- No agregar secciones de "generado automáticamente" ni pies de página con
  fecha/herramienta usada.

---

Con esto, cualquier código o documento que se agregue debería integrarse sin
resaltar como algo aparte del resto del proyecto.

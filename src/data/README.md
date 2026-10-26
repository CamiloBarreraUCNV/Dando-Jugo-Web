# Base de Datos de Juegos - Dando Jugo Web

Los datos corresponden a conjuntos **completamente aislados e independientes** para los tipos de juego de la plataforma.

---

## Archivos Activos del Juego

### 1. [`trivia.json`](./trivia.json) (100 preguntas)
* **Propósito**: Módulo de preguntas de trivia con opciones múltiples (A, B, C, D) y respuesta correcta verificable.

### 2. [`minijuegos.json`](./minijuegos.json) (235 dinámicas)
* **Propósito**: Tarjetas de interacción y minijuegos:
  * *¿Quién es más probable?* (50 tarjetas)
  * *Cultura Chupística* (50 tarjetas)
  * *Mímica* (50 tarjetas de personajes y objetos)
  * *Nunca Nunca* (50 tarjetas)
  * *Versus* (35 duelos 1 vs 1)

### 3. [`jugo.json`](./jugo.json) (60 tarjetas)
* **Propósito**: Desafíos individuales y arquetipos jugosos (ej. *Borracho Limpio*, *TransBorracho*, *Borracho Bailarín*).

### 4. [`hoja7_retos.json`](./hoja7_retos.json) (91 tarjetas)
* **Propósito**: Retos grupales, reglas de trago directo y dinámicas de mesa con penalizaciones.

### 5. [`variables.json`](./variables.json) (5 símbolos)
* **Propósito**: Diccionario de multiplicadores de sorbos (`#`, `$`, `%`, `&`, `/`) resueltos dinámicamente según la intensidad de consumo configurada.

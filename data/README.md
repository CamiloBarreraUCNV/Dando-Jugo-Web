# Base de Datos de Juegos - Dando Jugo Web

Los datos han sido exportados directamente desde [`assets/Dando Jugo Tarjetas.xlsx`](../assets/Dando%20Jugo%20Tarjetas.xlsx) manteniendo cada hoja **completamente aislada e independiente** para que correspondan a consultas y tipos de juego específicos sin mezclarse.

---

## Archivos Generados

### 1. [`trivia.json`](./trivia.json) (100 preguntas)
* **Propósito**: Módulo de preguntas de trivia con opciones múltiples.
* **Campos**:
  * `id`: Número identificador.
  * `pregunta`: Texto de la pregunta.
  * `categoria`: Categoría temática (Geografía, Alcohol, Historia, Ciencia, etc.).
  * `opciones`: Objeto con alternativas `{"A": "...", "B": "...", "C": "...", "D": "..."}`.
  * `correcta`: Texto de la opción correcta.
  * `castigo`: Castigo opcional si se falla.
  * `dificultad`: Nivel 1 a 10 (si aplica).
  * `aprobado_diego` y `observacion`.

---

### 2. [`minijuegos.json`](./minijuegos.json) (100 dinámicas)
* **Propósito**: Tarjetas de debate, interacción y votación grupal (principalmente dinámicas de *"¿Quién es más probable?"*).
* **Campos**:
  * `id`: Número identificador.
  * `titulo`: Nombre o categoría de la dinámica.
  * `descripcion`: La consigna a debatir/votar en la mesa.
  * `castigo`: Sorbos o penitencia asociada.
  * `aprobado_diego` y `observacion`.

---

### 3. [`jugo.json`](./jugo.json) (40 tarjetas)
* **Propósito**: Tarjetas de retos individuales y desafíos de fiesta (ej. *Borracho Limpio*, *TransBorracho*, *Borracho Bailarín*).
* **Campos**:
  * `id`: Número identificador.
  * `titulo`: Nombre del reto.
  * `descripcion`: Instrucciones del reto (usa variables como `#`, `%`).
  * `castigo`, `dificultad`, `categoria`, `observacion`.

---

### 4. [`hoja7_retos.json`](./hoja7_retos.json) (40 tarjetas)
* **Propósito**: Retos grupales, reglas de trago directo y dinámicas de interacción con penalización severa (ej. *Toman Todos*, *Ser Supremo*, *Jack Sparrow*).
* **Campos**:
  * `id`: Número identificador.
  * `titulo`: Nombre de la regla/reto.
  * `descripcion`: Dinámica a ejecutar (incluye variables dinámicas).
  * `castigo`: Castigo alternativo si no se cumple (ej. "Mortal Triple", "Vaso al seco").

---

### 5. [`variables.json`](./variables.json) (5 símbolos)
* **Propósito**: Diccionario de símbolos que se reemplazan en los textos de retos para definir cantidad de sorbos o rondas:
  ```json
  {
    "#": 1,
    "$": 2,
    "%": 3,
    "&": 4,
    "/": 5
  }
  ```

---

### 6. [`modos_juego.json`](./modos_juego.json) (6 modos)
* **Propósito**: Configuración de modos de partida disponibles:
  * *Juguito 250 ml* (Suave, 2-8 jugadores)
  * *Jugo 2 lt* (Intenso, 2-8 jugadores)
  * *Jugo Caliente* (Picante/Adultos, 2-8 jugadores)
  * *Jugo Gamer* (Temática videojuegos, 2-8 jugadores)
  * *Juguito en Guerra* (Por equipos, 4-16 jugadores)
  * *Jugo Otaku* (Temática anime, 2-8 jugadores)

---

### 7. [`catalogo_minijuegos.json`](./catalogo_minijuegos.json) (11 juegos)
* **Propósito**: Reglas y especificaciones de minijuegos independientes:
  * *Concurso*, *Cuarto Rey*, *El juego de los Caballos*, *Juego de las Apuestas*, *Pirámide*, *Verdad o Reto*, *Trivia Bomba*, *American Top Juice / Charada*, *Juego de la moneda*, etc.

---

### 8. [`werejuice.json`](./werejuice.json)
* **Propósito**: Reglas y personajes del juego de deducción social Werejuice (*Jugoso*, *Mejor Amigo*, *Borracho*, *Piola*, *Bailarín*).

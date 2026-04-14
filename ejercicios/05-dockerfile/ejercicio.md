# Ejercicios

## Crear una aplicacion con node

Crea una aplicación sencilla en Node.js que imprima "Hola, Docker!" cada 5 segundos utilizando la librería `node-cron`.

1. Se debe tener instalado Node

   ```bash
   npm init
   ```

2. En el archivo package.json se agrega

   `"start": "node app.js"` en la sección de scripts

3. Crea un archivo `app.js` con el siguiente contenido:

   ```javascript
   const cron = require("node-cron");
   cron.schedule("*/5 * * * * *", () => {
     console.log("Hola, Docker!");
   });
   ```

## Pruebas con Jest

En este ejercicio, crearás un entorno de pruebas para una aplicación Node.js utilizando Jest y Docker.

```bash
npm i jest --save-dev
```

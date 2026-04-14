# Ejercicios

## Crear una aplicación con node

Crea una aplicación sencilla en Node.js que imprima "Hola, Docker!" cada 5 segundos utilizando la librería `node-cron`.

1. Se debe tener instalado Node

   ```bash
   npm init
   ```

2. En el archivo package.json se agrega:

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


1. Crear una carpeta llamada `task` y dentro crear un archivo llamado `sync-db.test.js` y pegar el siguiente código:

```JavaScript
let times = 0;

const syncDB = () => {
    times++;
    console.log('Tick cada múltiplo de 5: ' , times)

    return times;
}

module.exports = {
    syncDB
}
```

2. En el archivo `app.js` se debe importar el módulo creado y cambiar el callback del proceso cron llamando a `syncDB`, el código debe verse de esta manera:

```JavaScript
const cron = require("node-cron");
let times = 0;
const {syncDB} = require('./tasks/sync-db')


cron.schedule("1-59/5 * * * * *", syncDB);

console.log("Inicio");
```

3. Crear una carpeta llamada `test\task` y dentro un archivo llamado `sync-db.test.js`:

```JavaScript
const { syncDB } = require("../../tasks/sync-db");

describe('Prueba en Sync-DB', () =>{
    test('debe de ejecutar el proceso 2 veces', () =>{

        syncDB();
        const times = syncDB();
        console.log('Se llamó', times)

        expect(times).toBe(2);
    })
});
```

4. Ahora se debe actualizar el package.json en la sección de `script` cambiar el `test` por este código

`"test": "jest",`


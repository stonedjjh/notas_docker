const { syncDB } = require("../../tasks/sync-db");

describe('Prueba en Sync-DB', () =>{
    test('debe de ejecutar el proceso 2 veces', () =>{
        
        syncDB();
        const times = syncDB();
        console.log('Se llamo', times)

        // Se agrega una prueba de que se espera que la variable times tenga el valor 2, parecido a un assert 
        expect(times).toBe(2);
    })
});
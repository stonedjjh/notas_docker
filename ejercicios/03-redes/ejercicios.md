# Ejercicios

## 1

Continuando con el ejercicio de la sección anterior luego de crear la red
y adjuntar los contenedores a la misma ahora si se puede ingresar por phpmyadmin.

En la web colocamos los siguientes datos

- Servidor: world-db
- Usuario: example-user
- Contraseña: user-password

![phpmyadmin conectado](/img/03-redes/image.png)

También podemos agregar la red al momento de correr el contenedor

````bash
```bash
docker run -d --name world-db -p 3306:3306 \
--env MARIADB_USER=example-user \
--env MARIADB_PASSWORD=user-password \
--env MARIADB_ROOT_PASSWORD=root-secret-password \
--env MARIADB_DATABASE=world-db \
--volume world-db:/var/lib/mysql \
# En la siguiente linea se especifica la red a usar.
--network world-app \
mariadb:jammy
````

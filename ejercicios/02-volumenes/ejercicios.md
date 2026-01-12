# Ejercicios

## 1

Montar la imagen de MariaDB con el tag jammy, publicar en el puerto 3306 del contenedor con el puerto 3306 de nuestro equipo, colocarle el nombre al contenedor de world-db (--name world-db) y definir las siguientes variables de entorno:

MARIADB_USER=example-user
MARIADB_PASSWORD=user-password
MARIADB_ROOT_PASSWORD=root-secret-password
MARIADB_DATABASE=world-db

```bash
#Si se hace en powershell
docker run -d --name world-db -p 3306:3306 `
--env MARIADB_USER=example-user `
--env MARIADB_PASSWORD=user-password `
--env MARIADB_ROOT_PASSWORD=root-secret-password `
--env MARIADB_DATABASE=world-db `
mariadb:jammy

#Si se hace en bash
docker run -d --name world-db -p 3306:3306 \
--env MARIADB_USER=example-user \
--env MARIADB_PASSWORD=user-password \
--env MARIADB_ROOT_PASSWORD=root-secret-password \
--env MARIADB_DATABASE=world-db \
mariadb:jammy
```

Luego debemos conectarnos a la base de datos y ejecutar el archivo
[world.sql](/recursos/02-volumenes/world.sql)

```bash
docker container ls
CONTAINER ID   IMAGE           COMMAND                  CREATED          STATUS          PORTS                                         NAMES
febceec44e7c   mariadb:jammy   "docker-entrypoint.s…"   20 minutes ago   Up 21 minutes   0.0.0.0:3306->3306/tcp, [::]:3306->3306/tcp   world-db
```

![Base de datos](/img/02-volumenes/image.png)

docker run -d --name world-db -p 3306:3306 `--env MARIADB_USER=example-user`
--env MARIADB_PASSWORD=user-password `--env MARIADB_ROOT_PASSWORD=root-secret-password`
--env MARIADB_DATABASE=world-db `--volume world-db:/var/lib/mysql`
mariadb:jammy

Este ejercicio tiene la limitante de que en lo que se cierre el contenedor la base de datos
es borrada y toca hacer todo de nuevo para evitar esto se puede agregar un volumen al momento de correr el contenedor

```bash
docker run -d --name world-db -p 3306:3306 \
--env MARIADB_USER=example-user \
--env MARIADB_PASSWORD=user-password \
--env MARIADB_ROOT_PASSWORD=root-secret-password \
--env MARIADB_DATABASE=world-db \
#En la siguiente linea se especifica el volumen a usar
--volume world-db:/var/lib/mysql \
mariadb:jammy
```

## 2

Conectarse al contenedor a traves de otro contenedor con phpmyadmin

montamos el contenedor con el tag de 5.2.0-apache

```bash
docker container run `--name phpmyadmin`
-d `-e PMA_ARBITRARY=1`
-p 8080:80 `
phpmyadmin:5.2.0-apache

#Ejecutamos ls para comprobar que todo este correcto

docker container ls
CONTAINER ID   IMAGE                     COMMAND                  CREATED          STATUS              PORTS                                         NAMES
e2f5f2656912   phpmyadmin:5.2.0-apache   "/docker-entrypoint.…"   52 seconds ago   Up About a minute   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp       phpmyadmin
bd7fbd653f0f   mariadb:jammy             "docker-entrypoint.s…"   30 minutes ago   Up 30 minutes       0.0.0.0:3306->3306/tcp, [::]:3306->3306/tcp   world-db
```

ahora si se ingresa a [localhost:8080](http://localhost:8080)

veremos la siguiente pantalla

![phpmyadmin](/img/02-volumenes/image2.png)

Aunque se tiene los 2 contenedores aún hay un problema y es que no comparten la misma red
por lo cual no pueden comunicarse.

## 3

Para el siguiente ejericio se trabajara con bind volume

1. descargar el siguiete [Recurso](/recursos/02-volumenes/nest-graphql-app.zip)
2. descomprimirlo.
3. abrir una terminal en la carpeta descomprimida
4. ejecutar code . para abrir una ventana de vscode

```bash
docker container run `
--name nest-app `
# Se especifica el working directory dentro del contenedor
-w /app `
-p 80:3000 `
# Aqui se especifica el la ruta para el bind volume
-v "$(pwd)":/app `
node:18-alpine3.17 `
# Para instalar las dependencias requeridas y ejecutar la
# app en modo dev
sh -c "yarn install && yarn start:dev"``
```

# Docker Hub images

[Postgres](https://hub.docker.com/_/postgres)

[pgAdmin](https://hub.docker.com/r/dpage/pgadmin4)

## 1. Crear un volumen para almacenar la información de la base de datos

docker **COMANDO CREAR** postgres-db

## 2. Montar la imagen de postgres así

#### OJO: No hay puerto publicado -p, lo que hará imposible acceder a la base de datos con TablePlus

```
docker container run \
-d \
--name postgres-db \
-e POSTGRES_PASSWORD=123456 \
-v postgres-db:/PATH/DE/LA/BASE/DE/DATOS \
postgres:15.1
```

Powershell

```
docker container run `
-d `
--name postgres-db `
-e POSTGRES_PASSWORD=123456 `
-v postgres-db:/PATH/DE/LA/BASE/DE/DATOS `
postgres:15.1
```

## 3. Tomar pgAdmin de aquí

```
docker container run \
--name pgAdmin \
-e PGADMIN_DEFAULT_PASSWORD=123456 \
-e PGADMIN_DEFAULT_EMAIL=superman@google.com \
-dp 8080:80 \
dpage/pgadmin4:6.17
```

Powershell

```
docker container run `
--name pgAdmin `
-e PGADMIN_DEFAULT_PASSWORD=123456 `
-e PGADMIN_DEFAULT_EMAIL=superman@google.com `
-dp 8080:80 `
dpage/pgadmin4:6.17
```

# 4. Ingresar a la web con las credenciales de superman

http://localhost:8080/

# 5. Intentar crear la conexión a la base de datos

1. Click en Servers
2. Click en Register > Server
3. Colocar el nombre de: "SuperHeroesDB" (el nombre no importa)
4. Ir a la pestaña de connection
5. Colocar el hostname "postgres-db" (el mismo nombre que le dimos al contenedor)
6. Username es "postgres" y el password: 123456
7. Probar la conexión

### 6. Ohhh no!, no vemos la base de datos, se nos olvidó la red

## 7. Crear la red

docker network **ALGO PARA CREAR** postgres-net

## 8. Asignar ambos contenedores a la red

docker container **ALGO PARA LISTAR LOS CONTENEDORES**

## 9. Conectar ambos contenedores

docker network connect postgres-net **ID del contenedor 1**

docker network connect postgres-net **ID del contenedor 2**

## 10. Intentar el paso 4. de nuevo.

Si logra establecer la conexión, todo está correcto, proceder a crear una base de datos, schemas, tablas, insertar registros, lo que sea.

## 11. Saltar de felicidad

<img src="https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif" alt="happy" />

### solución

```bash

docker volume create postgres-db

docker container run `
-d `
--name postgres-db `
-e POSTGRES_PASSWORD=123456 `
-v postgres-db:/var/lib/postgresql/data `
postgres:15.1

docker container run `
--name pgAdmin `
-e PGADMIN_DEFAULT_PASSWORD=123456 `
-e PGADMIN_DEFAULT_EMAIL=superman@google.com `
-dp 8080:80 `
dpage/pgadmin4:6.17

docker network superman postgres-net

docker container ls
#copiamos los id en este caso retorno
#PS C:\Users\Stone Colombia> docker container ls
#CONTAINER ID   IMAGE                 COMMAND                  CREATED              STATUS              PORTS                                     NAMES
#ccaf4952ebd3   dpage/pgadmin4:6.17   "/entrypoint.sh"         About a minute ago   Up About a minute   0.0.0.0:8080->80/tcp, [::]:8080->80/tcp   pgAdmin
#3e7001f6a240   postgres:15.1         "docker-entrypoint.s…"   4 minutes ago        Up 5 minutes        5432/tcp                                  postgres-db
#f5faa9f81e98   node:18-alpine3.17    "docker-entrypoint.s…"   45 minutes ago       Up 46 minutes       0.0.0.0:80->3000/tcp, [::]:80->3000/tcp   nest-app

docker network connect superman cca
docker network connect superman 3e7

```

Luego ingresamos en [localhost:8080](http://localhost:8080/browser/)

y se procede a crear la conexión con los siguientes datos:

- Email address/username: superman@gmail.com
- Password: 123456

Seleccionar add new server y en la pestaña general colocar

- Name: SuperHeroesDB

ahora en la pestaña Connection

- Hostname/address: postgres-db
- Username: postgres
- Password: 123456

y finalmente click en save

![imagen](/img/04-docker-compose/image.png)

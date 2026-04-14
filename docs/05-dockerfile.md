# Dockerfile

Un Dockerfile es un archivo de texto que contiene una serie de instrucciones para construir una imagen de Docker de manera automatizada. Define el entorno y las configuraciones necesarias para que una aplicación se ejecute dentro de un contenedor.

## Estructura básica de un Dockerfile

1. **FROM**: Especifica la imagen base desde la cual se construirá la nueva imagen. Puede ser una imagen oficial de Docker Hub o una imagen personalizada.

   ```Dockerfile
   FROM node:14
   ```

2. **WORKDIR**: Define el directorio de trabajo dentro del contenedor donde se ejecutarán los comandos siguientes.

   ```Dockerfile
    WORKDIR /app
   ```

3. **COPY**: Copia archivos de tu PC al contenedor.
   COPY Source Destiny

   ```Dockerfile
    COPY app.js package.json ./
   ```

4. **RUN**: Ejecuta comandos durante el proceso de construcción de la imagen (build time). Se utiliza para instalar dependencias, paquetes de software o realizar configuraciones internas antes de que el contenedor se ponga en marcha.

   ```Dockerfile
       RUN npm install
   ```

5. **EXPOSE**: Indica qué puertos serán expuestos por el contenedor en tiempo de ejecución.

   ```Dockerfile
    EXPOSE 3000
   ```

6. **CMD**: Define el comando que se ejecutará cuando se inicie un contenedor a partir de la imagen. Solo puede haber una instrucción CMD por Dockerfile.

   ```Dockerfile
    CMD ["node", "app.js"]
   ```

## Diferencias entre RUN y CMD

| Instrucción | Cuándo se ejecuta | Propósito                                    |
| ----------- | ----------------- | -------------------------------------------- |
| RUN         | Durante el build  | Instalar software, preparar la imagen.       |
| CMD         | Durante el run    | Iniciar la aplicación (el proceso principal) |

## Comandos

- `docker build -t nombre-imagen .`: Construye una imagen de Docker a partir del Dockerfile en el directorio actual.

ejemplo:

```bash
docker build -t cron-ticket .
#Retorno
[+] Building 12.1s (10/10) FINISHED                                                                docker:desktop-linux
 => [internal] load build definition from Dockerfile                                                               0.0s
 => => transferring dockerfile: 155B                                                                               0.0s
 => [internal] load metadata for docker.io/library/node:19.2-alpine3.16                                            1.4s
 => [auth] library/node:pull token for registry-1.docker.io                                                        0.0s
 => [internal] load .dockerignore                                                                                  0.1s
 => => transferring context: 2B                                                                                    0.0s
 => [1/4] FROM docker.io/library/node:19.2-alpine3.16@sha256:80844b6643f239c87fceae51e6540eeb054fc7114d979703770e  0.1s
 => => resolve docker.io/library/node:19.2-alpine3.16@sha256:80844b6643f239c87fceae51e6540eeb054fc7114d979703770e  0.1s
 => [internal] load build context                                                                                  0.1s
 => => transferring context: 566B                                                                                  0.0s
 => CACHED [2/4] WORKDIR /app                                                                                      0.0s
 => [3/4] COPY app.js package.json ./                                                                              0.2s
 => [4/4] RUN npm install                                                                                          5.3s
 => exporting to image                                                                                             3.2s
 => => exporting layers                                                                                            1.4s
 => => exporting manifest sha256:c24640cdad68ad964ac05197c77678ef52f94cef31923a55a55a2ba2cfc4c437                  0.1s
 => => exporting config sha256:709773a3243f94aec02e9a5c5ce87ac60cd2b7b96a4eb685c67fa44266edb1b6                    0.1s
 => => exporting attestation manifest sha256:5bcd8f21cdc61818ac5f7d6d0dc75f4f818dfed547774f3531bae289015b1372      0.3s
 => => exporting manifest list sha256:5f7599b00495ec9cc37ed4a026d18edd3ea16249e2fcb27d5b56ad7e1eb54246             0.1s
 => => naming to docker.io/library/cron-ticket:latest                                                              0.0s
 => => unpacking to docker.io/library/cron-ticket:latest                                                           0.7s

View build details: docker-desktop://dashboard/build/desktop-linux/desktop-linux/upx5l5zskzg2tu13u0pbrza7c

docker image ls
#Retorno
IMAGE                ID             DISK USAGE   CONTENT SIZE   EXTRA
cron-ticket:latest   5f7599b00495        242MB         53.1MB

docker run cron-ticket
#Retorno
Inicio
Tick every 5 second
[2026-01-12T11:23:58.733Z] [PID: 1] [NODE-CRON] [WARN] missed execution at Mon Jan 12 2026 11:23:56 GMT+0000 (Coordinated Universal Time)! Possible blocking IO or high CPU user at the same process used by node-cron.
Tick every 5 second
Tick every 5 second
Tick every 5 second
Tick every 5 second

```

> [!NOTE]
> En el log de construcción se ve esto: => CACHED [2/4] WORKDIR /app.
> Docker es inteligente: si no cambias el Dockerfile en esa línea, no vuelve a ejecutarla.
> [!TIP]
> Tip Pro: Para optimizar el tiempo de construcción, siempre copia primero el package.json, haz el RUN npm install y al final copia el resto del código. Así, si solo cambias un texto en app.js, Docker no tiene que reinstalar todas las librerías.

- `docker run -p puerto-local:puerto-contenedor nombre-imagen`: Ejecuta un contenedor a partir de la imagen especificada, mapeando los puertos locales al contenedor.

## Subir imagenes a Dockerhub

1. Crear una cuenta en [Docker Hub](https://hub.docker.com/).
2. Iniciar sesión en Docker desde la terminal:

   ```bash
   docker login
   ```

3. Subir la imagen a Docker Hub:

   ```bash
   docker push tu-usuario/nombre-imagen:tag
   ```

## Dockerignore

El archivo `.dockerignore` se utiliza para especificar qué archivos y directorios deben ser ignorados por Docker al construir una imagen. Esto ayuda a reducir el tamaño de la imagen y a evitar copiar archivos innecesarios.

### Ejemplo de .dockerignore

```
node_modules
.DS_Store
.env
logs
*.log
.git
```

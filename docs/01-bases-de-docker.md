# Primeros Pasos con Docker

## 1. Conceptos Fundamentales

* **Imagen:** Es una plantilla inmutable de solo lectura que contiene las instrucciones para crear un contenedor.
* **Contenedor:** Una instancia ejecutable de una imagen. Es ligero y aislado del sistema operativo.
* **Docker Hub:** El registro público donde se almacenan las imágenes.

## Comandos

* **docker pull:** Este comando sirve para **descargar imagenes** desde el Docker Hub(el registro público de Docker). Primero verificara si ya tenemos el archivo en nuestro sistema,  sino la encuentra o si la version remota es mas reciente, se conectara al registro y descargara el archivo.

**Sintaxis:**

```bash
docker pull <nombre_de_imagen>:<tag>
```

> [!TIP]
> Si no especificamos el tag, por defecto se usa el tag :latest.

Para este primer **ejemplo** se usaran las palabras mas conocidas por los programadores

```bash
docker pull hello-world
```

Al ejecutar este comando la salida sera algo como esto:

```bash
PS C:\Users\Mi Equipo> docker pull hello-world
Using default tag: latest
latest: Pulling from library/hello-world
17eec7bbc9d7: Pull complete
Digest: sha256:54e66cc1dd1fcb1c3c58bd8017914dbed8701e2d8c74d9262e26bd9cc1642d31
Status: Downloaded newer image for hello-world:latest
docker.io/library/hello-world:latest
```

Como se comento arriba sino se especifica la etiqueta usara la etiqueta **latest**.

De esta salida es importante remarcar:

* **Digest:** es la firma de la imagen es un hash que permite verificar si ha tenido cambios desde la ultima vez que se uso.

* **Status:** informa si se descargo(es decir es nueva) o actualizo la imagen

* La ultima linea indica la ruta desde donde se descago la imagen.

Ahora que se tiene una imagen en local se puede proceder a ejecutar la misma.

* **docker container run:** crear un contenedor a partir de una imagen.

**Sintaxis:**

```bash
docker container run <nombre_de_imagen>
```

> [!TIP]
> Es un alias del comando más corto y comúnmente usado: `docker run`.

Ahora se usara la imagen previamente descargada
**ejemplo**

```bash
docker container run hello-world
```

Se visualizara una salida parecida a esta

```bash
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

* **docker container --help:** lista una ayuda de los comandos que se puede utilizar con **docker container** y una breve descripcion del mismo

**Sintaxis:**

```bash
docker container --help
```

**ejemplo:**

```bash
docker container --help
Usage:  docker container COMMAND

Manage containers

Commands:
  attach      Attach local standard input, output, and error streams to a running container
  commit      Create a new image from a container's changes
  cp          Copy files/folders between a container and the local filesystem
  create      Create a new container
  diff        Inspect changes to files or directories on a container's filesystem
  exec        Execute a command in a running container
  export      Export a container's filesystem as a tar archive
  inspect     Display detailed information on one or more containers
  kill        Kill one or more running containers
  logs        Fetch the logs of a container
  ls          List containers
  pause       Pause all processes within one or more containers
  port        List port mappings or a specific mapping for the container
  prune       Remove all stopped containers
  rename      Rename a container
  restart     Restart one or more containers
  rm          Remove one or more containers
  run         Create and run a new container from an image
  start       Start one or more stopped containers
  stats       Display a live stream of container(s) resource usage statistics
  stop        Stop one or more running containers
  top         Display the running processes of a container
  unpause     Unpause all processes within one or more containers
  update      Update configuration of one or more containers
  wait        Block until one or more containers stop, then print their exit codes

Run 'docker container COMMAND --help' for more information on a command.
```

* **docker container ls:** lista los contenedores en ejecucion.

> [!TIP]
> se puede usar docker ps para listar contenedor
> pero este comando esta en desuso se mantiene por compatibilidad

**Sintaxis:**

```bash
docker container ls [-a]
```

**ejemplo:**

```bash
docker container ls
```

**salida:**

```bash
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

> [!TIP]
> si se agrega la bandera -a muestra todos los contenedores tanto en ejecucion como detenidos.

**ejemplo:**

```bash
docker container ls -a
```

**salida:**

```bash
CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS                      PORTS     NAMES
71d8f05d9d71   hello-world   "/hello"                 44 minutes ago   Exited (0) 44 minutes ago             strange_darwin
b9ec45f0b7a2   cron-ticket   "docker-entrypoint.s…"   5 weeks ago      Exited (255) 5 weeks ago              jolly_vaughan
c973d8c02b7c   cron-ticket   "docker-entrypoint.s…"   5 weeks ago      Exited (255) 5 weeks ago              tender_yalow
```

* **docker container rm:** elimina uno o varios contenedores.

**Sintaxis:**

```bash
docker container rm [-f] CONTAINER [CONTAINER...]
```

> [!TIP]
> Para seleccionar un contenedor se pueden hacer con los 3 primeros digitos de su CONTAINER ID
>
> La bandera -f sirve para forzar la eliminacion de un contenedor en ejecucion.

**ejemplo:**

```bash
docker container rm 71d
```

> [!NOTE]
> La salida del comando retorna el valor que se pase

**salida:**

```bash
71d
```

## Comandos para trabajar con imagenes

* **docker images:** lista todas las imágenes que están disponibles localmente en tu sistema. Estas son las imágenes que has descargado previamente usando `docker pull` o que has construido con `docker build`.

> [!NOTE]
> **docker images** es el alias corto del comando moderno **docker image ls**. Ambos cumplen la misma función: listar las imágenes disponibles localmente.

**Sintaxis:**

```bash
docker images
```

**ejemplo:**

```bash
docker images
```

**salida:**

```bash
REPOSITORY                 TAG             IMAGE ID       CREATED        SIZE
cron-ticket                latest          1264b5c5910e   5 weeks ago    242MB
hello-world                latest          54e66cc1dd1f   8 weeks ago    20.3kB
mongo                      6.0             363f5fab76d1   2 months ago   1.05GB
klerith/pokemon-nest-app   1.0.0           ee1093961251   2 years ago    657MB
mongo-express              1.0.0-alpha.4   dcfcf89bf912   3 years ago    236MB
```

* **docker image rm:** elimina una o varias imágenes.

**Sintaxis:**

```bash
docker image rm IMAGE [IMAGE...]
```

> [!TIP]
> ademas del IMAGE ID también se puede usar el nombre de la imagen


**ejemplo:**

```bash
docker image rm hello-world
```

**salida:**

```bash
Untagged: hello-world:latest
Deleted: sha256:54e66cc1dd1fcb1c3c58bd8017914dbed8701e2d8c74d9262e26bd9cc1642d31
```


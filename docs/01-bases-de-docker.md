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

## Ejecución Avanzada de Contenedores

Para ejecutar aplicaciones de servidor que se mantengan activas en segundo plano y a las que podamos acceder desde nuestro navegador, necesitamos usar flags o banderas con el comando docker run

|Bandera| Nombre | Descripción |
|:-----:|:------:|:------------|
|-d| Detached |Ejecuta el contenedor en segundo plano (modo detached). Esto libera la terminal para que puedas seguir usándola mientras el contenedor se mantiene activo.|
|-p|Port Mapping|Mapea un puerto de tu máquina local a un puerto dentro del contenedor. Es necesario para acceder a servicios web.|

**Sintaxis:**

```Bash
-p <PUERTO_LOCAL>:<PUERTO_CONTENEDOR>
```

<PUERTO_LOCAL>: Es el puerto que usas para acceder desde tu navegador (ej: http://localhost:8080).

<PUERTO_CONTENEDOR>: Es el puerto interno en el que el servicio dentro del contenedor está escuchando (ej: 80 para Nginx o 3000 para un servidor Node).

>[!TIP]
>Si usamos varias banderas con el comando **`docker run`** (el alias corto), podemos agruparlas como `-dp` o `-pd`. Ambas son equivalentes a usar `-d -p`.

**ejemplo:**

```bash
docker contaniner run -dp 8080:80 docker/getting-started
```

**salida:**

```bash
Unable to find image 'docker/getting-started:latest' locally
latest: Pulling from docker/getting-started
cb9626c74200: Pull complete
33e0cbbb4673: Pull complete
1e35f6679fab: Pull complete
f1d1c9928c82: Pull complete
ee68d3549ec8: Pull complete 
9b6f639ec6ea: Pull complete
4f7e34c2de10: Pull complete
b6334b6ace34: Pull complete
c158987b0551: Pull complete
Digest: sha256:d79336f4812b6547a53e735480dde67f8f8f7071b414fbd9297609ffb989abc1
Status: Downloaded newer image for docker/getting-started:latest
d89a6d2f322d0fb8c3bff60331f4e07213c37fae6311a2c7f83db89de6dbfef1
PS C:\Users\Mi Equipo>
```

Ahora en el navegador se vera el contenedor en ejecución
![Visualización del contenedor](/img/ejemplo1.png)

### Importante: Agrupación y Parámetros

Al agrupar banderas cortas con un solo guion (`-d -p` se convierte en `-dp`), el intérprete de comandos solo puede asignar el **primer parámetro siguiente** a la **primera bandera que lo necesite** dentro del grupo.

* En el caso de **`-dp 8080:80`**, la bandera `-p` es la única que necesita un valor (`8080:80`), por lo que todo funciona correctamente.
* **Regla de Oro:** Nunca agrupes dos o más banderas que *requieran su propio valor* (ej: `-a <valor1> -b <valor2>`) sin separarlas con guiones, ya que la segunda bandera no recibirá su parámetro.

**Ejemplo de Comando Seguro (Separado):**

Si tuvieras que usar dos banderas que requieren valores (como un usuario `-u` y una contraseña `-w` hipotéticas), siempre debes separarlas

```bash
# Correcto: cada bandera recibe su propio valor
docker run -u mi_usuario -w mi_clave imagen_ejemplo
```

Otra bandera que es importante es **-e**

|Bandera| Nombre | Descripción |
|:-----:|:------:|:------------|
|-e| Enviroment Variable|Define variables de entorno dentro|

Para el ejemplo se usará la imagen de postgres para crear un contenedor, si no se le asigna un valor a la variable de entorno no se podra acceder a la base de datos.

**Sintaxis:**

```Bash
-e <NOMBRE_VARIABLE>=<VALOR_VARIABLE>
```

**ejemplo:**

```bash  
docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres
```

## Comandos para el Ciclo de Vida del Contenedor

* **docker container stop:** este comando se utiliza para detener uno o varios contenedores en ejecución de manera controlada.

**Sintaxis:**

```bash
docker container stop CONTAINER [CONTAINER...]
```

**ejemplo:**

```bash
docker container stop d89
docker container ls       
```

**salida:**

```bash
d89
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
# La lista está vacía porque 'ls' por defecto solo muestra contenedores en estado 'Up'
```

* **docker container start:** este comando se utiliza para reiniciar uno o varios contenedores que se encuentran detenidos (en estado Exited)

**Sintaxis:**

```bash
docker container start CONTAINER [CONTAINER...]
```

**ejemplo:**

```bash
docker container start d89
docker container ls
```

**salida:**

```bash
d89
CONTAINER ID   IMAGE                    COMMAND                  CREATED          STATUS         PORTS      
            NAMES
d89a6d2f322d   docker/getting-started   "/docker-entrypoint.…"   45 minutes ago   Up 3 seconds   0.0.0.0:8080->80/tcp   busy_carver
```

### Ejemplo de Eliminación Forzada (`-f`)

Si intentas eliminar un contenedor que se está ejecutando, Docker te dará un error y te pedirá que lo detengas primero. La bandera `-f` (force) permite saltarse ese paso y eliminarlo directamente.

**Comando sin `-f` (Falla):**

```bash
docker container rm d89
```

**Salida (Error):**

```bash
Error response from daemon: cannot remove container "/busy_carver": container is running: stop the container before removing or force remove
```

**Comando con `-f` (Éxito):**

```bash
docker container rm -f d89
```

**Salida (Éxito):**

```bash
d89
```

> [!CAUTION]
> Usar el flag -f detiene y elimina el contenedor inmediatamente, sin darle tiempo para finalizar procesos de manera ordenada. Úsalo con precaución, especialmente en entornos de producción.

* **docker container logs:** Este comando permite **examinar (visualizar) los logs o registros de la salida estándar** de un contenedor específico. Es esencial para la **depuración** y para ver lo que la aplicación está haciendo dentro del contenedor.

**Sintaxis:**

```bash
docker container logs CONTAINER
```

**Ejemplo:** Para ver el uso de este comando se utilizará la imagen de mariadb  con tag jammy y usando la opción de creación de clave aleatoria

```bash
docker container run \
  --name mariadb \
  -dp 3306:3306 \
  -e MARIADB_RANDOM_ROOT_PASSWORD=yes \
  mariadb:jammy  
```

Si el comando falla puede ser al entorno donde se ejecute así que puede usar la sintaxis de una línea

```bash
docker container run --name mariadb -dp 3306:3306 -e MARIADB_RANDOM_ROOT_PASSWORD=yes mariadb:jammy  
```

Luego se pueden ver los logs del contenedor

```bash
docker container logs mariadb
```

**salida:**

```bash
2025-10-12 13:16:14+00:00 [Note] [Entrypoint]: Entrypoint script for MariaDB Server 1:11.3.2+maria~ubu2204 started.
2025-10-12 13:16:14+00:00 [Warn] [Entrypoint]: /sys/fs/cgroup/name=systemd:/docker/166861ec17bc22a7d7f659d5d5cfd63fe94a00fafea52bd6bd767b14b6c52610
14:misc:/docker/166861ec17bc22a7d7f659d5d5cfd63fe94a00fafea52bd6bd767b14b6c52610
13:rdma:/docker/166861ec17bc22a7d7f659d5d5cfd63fe94a00fafea52bd6bd767b14b6c52610
12:pids:/docker/166861ec17bc22a7d7f659d5d5cfd63fe94a00fafea52bd6bd767b14b6c52610
11:hugetlb:/docker/166861ec17bc22a7d7f659d5d5cfd63fe94a00fafea52bd6bd767b14b6c52610
10:net_prio:/docker/166861ec17bc22a7d7f659d5d5cfd63fe94a00fafea52bd6bd767b14b6c52610
9:perf_event:/docker/166861ec17bc22a7d7f659d5d5cfd63fe94a00fafea52bd6bd767b14b6c52610
8:net_cls:/docker/166861ec17bc22a7d7f659d5d5cfd63fe94a00fafea52bd6bd767b14b6c52610
7:freezer:/docker/166861ec17bc22a7d7f659d5d5cfd63fe94a00fafea52bd6bd767b14b6c52610
6:devices:/docker/166861ec17bc22a7d7f659d5d5cfd63fe94a00fafea52bd6bd767b14b6c52610
5:memory:/docker/166861ec17bc22a7d7f659d5d5cfd63fe94a00fafea52bd6bd767b14b6c52610
4:blkio:/docker/166861ec17bc22a7d7f659d5d5cfd63fe94a00fafea52bd6bd767b14b6c52610
3:cpuacct:/docker/166861ec17bc22a7d7f659d5d5cfd63fe94a00fafea52bd6bd767b14b6c52610
2:cpu:/docker/166861ec17bc22a7d7f659d5d5cfd63fe94a00fafea52bd6bd767b14b6c526101:cpuset:/docker/166861ec17bc22a7d7f659d5d5cfd63fe94a00fafea52bd6bd767b14b6c52610
0::/docker/166861ec17bc22a7d7f659d5d5cfd63fe94a00fafea52bd6bd767b14b6c52610/memory.pressure not writable, functionality unavailable to MariaDB
2025-10-12 13:16:14+00:00 [Note] [Entrypoint]: Switching to dedicated user 'mysql'
2025-10-12 13:16:14+00:00 [Note] [Entrypoint]: Entrypoint script for MariaDB Server 1:11.3.2+maria~ubu2204 started.
2025-10-12 13:16:15+00:00 [Note] [Entrypoint]: Initializing database files


PLEASE REMEMBER TO SET A PASSWORD FOR THE MariaDB root USER !
To do so, start the server, then issue the following command:

'/usr/bin/mariadb-secure-installation'

which will also give you the option of removing the test
databases and anonymous user created by default.  This is
strongly recommended for production servers.

See the MariaDB Knowledgebase at https://mariadb.com/kb

Please report any problems at https://mariadb.org/jira

The latest information about MariaDB is available at https://mariadb.org/.    

Consider joining MariaDB's strong and vibrant community:
https://mariadb.org/get-involved/

2025-10-12 13:16:32+00:00 [Note] [Entrypoint]: Database files initialized     
2025-10-12 13:16:32+00:00 [Note] [Entrypoint]: Starting temporary server      
2025-10-12 13:16:32+00:00 [Note] [Entrypoint]: Waiting for server startup     
2025-10-12 13:16:32 0 [Note] Starting MariaDB 11.3.2-MariaDB-1:11.3.2+maria~ubu2204 source revision 068a6819eb63bcb01fdfa037c9bf3bf63c33ee42 as process 114 
2025-10-12 13:16:32 0 [Note] InnoDB: Compressed tables use zlib 1.2.11        
2025-10-12 13:16:32 0 [Note] InnoDB: Number of transaction pools: 1
2025-10-12 13:16:32 0 [Note] InnoDB: Using crc32 + pclmulqdq instructions     
2025-10-12 13:16:32 0 [Note] mariadbd: O_TMPFILE is not supported on /tmp (disabling future attempts)
2025-10-12 13:16:32 0 [Note] InnoDB: Using liburing
2025-10-12 13:16:32 0 [Note] InnoDB: Initializing buffer pool, total size = 128.000MiB, chunk size = 2.000MiB
2025-10-12 13:16:32 0 [Note] InnoDB: Completed initialization of buffer pool
2025-10-12 13:16:32 0 [Note] InnoDB: File system buffers for log disabled (block size=4096 bytes)
2025-10-12 13:16:32 0 [Note] InnoDB: End of log at LSN=47629
2025-10-12 13:16:32 0 [Note] InnoDB: Opened 3 undo tablespaces
2025-10-12 13:16:32 0 [Note] InnoDB: 128 rollback segments in 3 undo tablespaces are active.
2025-10-12 13:16:32 0 [Note] InnoDB: Setting file './ibtmp1' size to 12.000MiB. Physically writing the file full; Please wait ...
2025-10-12 13:16:32 0 [Note] InnoDB: File './ibtmp1' size is now 12.000MiB.   
2025-10-12 13:16:32 0 [Note] InnoDB: log sequence number 47629; transaction id 14
2025-10-12 13:16:32 0 [Note] Plugin 'FEEDBACK' is disabled.
2025-10-12 13:16:32 0 [Note] Plugin 'wsrep-provider' is disabled.
2025-10-12 13:16:32 0 [Warning] 'user' entry 'root@166861ec17bc' ignored in --skip-name-resolve mode.
2025-10-12 13:16:32 0 [Warning] 'proxies_priv' entry '@% root@166861ec17bc' ignored in --skip-name-resolve mode.
2025-10-12 13:16:33 0 [Note] mariadbd: Event Scheduler: Loaded 0 events       
2025-10-12 13:16:33 0 [Note] mariadbd: ready for connections.
Version: '11.3.2-MariaDB-1:11.3.2+maria~ubu2204'  socket: '/run/mysqld/mysqld.sock'  port: 0  mariadb.org binary distribution
2025-10-12 13:16:33+00:00 [Note] [Entrypoint]: Temporary server started.
2025-10-12 13:16:42+00:00 [Note] [Entrypoint]: GENERATED ROOT PASSWORD: HpOy@+wRiQz/Q-2^t$6"KB30wv5:6Oy^
2025-10-12 13:16:42+00:00 [Note] [Entrypoint]: Securing system users (equivalent to running mysql_secure_installation)

2025-10-12 13:16:43+00:00 [Note] [Entrypoint]: Stopping temporary server      
2025-10-12 13:16:43 0 [Note] mariadbd (initiated by: unknown): Normal shutdown2025-10-12 13:16:43 0 [Note] InnoDB: FTS optimize thread exiting.
2025-10-12 13:16:43 0 [Note] InnoDB: Starting shutdown...
2025-10-12 13:16:43 0 [Note] InnoDB: Dumping buffer pool(s) to /var/lib/mysql/ib_buffer_pool
2025-10-12 13:16:43 0 [Note] InnoDB: Buffer pool(s) dump completed at 251012 13:16:43
2025-10-12 13:16:43 0 [Note] InnoDB: Removed temporary tablespace data file: "./ibtmp1"
2025-10-12 13:16:43 0 [Note] InnoDB: Shutdown completed; log sequence number 47629; transaction id 15
2025-10-12 13:16:43 0 [Note] mariadbd: Shutdown complete

2025-10-12 13:16:43+00:00 [Note] [Entrypoint]: Temporary server stopped       

2025-10-12 13:16:43+00:00 [Note] [Entrypoint]: MariaDB init process done. Ready for start up.

2025-10-12 13:16:43 0 [Note] Starting MariaDB 11.3.2-MariaDB-1:11.3.2+maria~ubu2204 source revision 068a6819eb63bcb01fdfa037c9bf3bf63c33ee42 as process 1   
2025-10-12 13:16:43 0 [Note] InnoDB: Compressed tables use zlib 1.2.11        
2025-10-12 13:16:43 0 [Note] InnoDB: Number of transaction pools: 1
2025-10-12 13:16:43 0 [Note] InnoDB: Using crc32 + pclmulqdq instructions     
2025-10-12 13:16:43 0 [Note] mariadbd: O_TMPFILE is not supported on /tmp (disabling future attempts)
2025-10-12 13:16:43 0 [Note] InnoDB: Using liburing
2025-10-12 13:16:43 0 [Note] InnoDB: Initializing buffer pool, total size = 128.000MiB, chunk size = 2.000MiB
2025-10-12 13:16:43 0 [Note] InnoDB: Completed initialization of buffer pool  
2025-10-12 13:16:43 0 [Note] InnoDB: File system buffers for log disabled (block size=4096 bytes)
2025-10-12 13:16:43 0 [Note] InnoDB: End of log at LSN=47629
2025-10-12 13:16:44 0 [Note] InnoDB: Opened 3 undo tablespaces
2025-10-12 13:16:44 0 [Note] InnoDB: 128 rollback segments in 3 undo tablespaces are active.
2025-10-12 13:16:44 0 [Note] InnoDB: Setting file './ibtmp1' size to 12.000MiB. Physically writing the file full; Please wait ...
2025-10-12 13:16:44 0 [Note] InnoDB: File './ibtmp1' size is now 12.000MiB.   
2025-10-12 13:16:44 0 [Note] InnoDB: log sequence number 47629; transaction id 14
2025-10-12 13:16:44 0 [Note] Plugin 'FEEDBACK' is disabled.
2025-10-12 13:16:44 0 [Note] InnoDB: Loading buffer pool(s) from /var/lib/mysql/ib_buffer_pool
2025-10-12 13:16:44 0 [Note] Plugin 'wsrep-provider' is disabled.
2025-10-12 13:16:44 0 [Note] InnoDB: Buffer pool(s) load completed at 251012 13:16:44
2025-10-12 13:16:44 0 [Note] Server socket created on IP: '0.0.0.0'.
2025-10-12 13:16:44 0 [Note] Server socket created on IP: '::'.
2025-10-12 13:16:44 0 [Note] mariadbd: Event Scheduler: Loaded 0 events       
2025-10-12 13:16:44 0 [Note] mariadbd: ready for connections.
Version: '11.3.2-MariaDB-1:11.3.2+maria~ubu2204'  socket: '/run/mysqld/mysqld.sock'  port: 3306  mariadb.org binary distribution
```

Con esta salida se puede ver la clave generada para el usuario root.
**2025-10-12 13:16:42+00:00 [Note] [Entrypoint]: GENERATED ROOT PASSWORD: `HpOy@+wRiQz/Q-2^t$6"KB30wv5:6Oy^`**

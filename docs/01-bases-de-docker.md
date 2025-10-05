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
> 

Para nuestro primer **ejemplo** usaremos las palabras mas conocidas por los programadores
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

* **docker container run:** Este comando permite crear un contenedor a partir de una imagen.

**Sintaxis:**
```bash
docker container run <nombre_de_imagen>
```

> [!TIP] 
> Es un alias del comando más corto y comúnmente usado: `docker run`.

Ahora se usara la imagen previamente descargada
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
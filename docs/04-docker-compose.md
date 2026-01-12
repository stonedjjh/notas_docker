# Docker Compose

Docker Compose es una herramienta que permite definir y gestionar aplicaciones multi-contenedor de Docker mediante un archivo de configuración YAML. Facilita la orquestación de contenedores, redes y volúmenes, permitiendo levantar y gestionar todo el entorno con un solo comando.

## Secciones

- **version**: Define la versión del formato de archivo de Docker Compose.

- **services**: Define los contenedores que forman parte de la aplicación. Cada servicio puede especificar la imagen a usar, variables de entorno, puertos expuestos, volúmenes montados, entre otros.

  - **container_name**: se utiliza para asignar un nombre personalizado y fijo a un contenedor, en lugar de permitir que Docker genere un nombre aleatorio o use el formato por defecto del proyecto.

  - **image**: Es el "molde" o la plantilla a partir de la cual se crea el contenedor.

  - **volumes**: Es el mecanismo para persistir y compartir datos entre el Host (tu PC) y el contenedor.

  - **environment**: Son las variables de entorno que configuran el comportamiento interno del software.

  - **port**: Es el mapeo que conecta la red de tu computadora con la red interna de Docker.

  - **depend-on**: Es una instrucción en Docker Compose que define la jerarquía y el orden de inicio entre los contenedores de un mismo proyecto.

  - **restart: always**: Es una política de reinicio que le indica a Docker que el contenedor debe reiniciarse automáticamente bajo casi cualquier circunstancia en la que se detenga.

  - **command** La instrucción command se utiliza para sobrescribir el comando por defecto que viene configurado en la imagen de Docker (el cual se define originalmente en el Dockerfile mediante la instrucción CMD).

- **volumes**: Es una sección donde se reservan espacios de almacenamiento que son gestionados exclusivamente por Docker en una parte especial del disco duro del host. Crear un almacenamiento persistente que no depende de la estructura de carpetas de tu PC (como Windows o OneDrive), sino que vive dentro del motor de Docker.

  - **external: true**: le indica a Docker Compose que el volumen ya ha sido creado fuera del archivo actual (ya sea manualmente mediante la terminal o por otro proyecto de Docker) y que debe conectarse a él en lugar de intentar generar uno nuevo.

- **networks**: Define las redes personalizadas que los servicios pueden usar para comunicarse entre sí.

## Comandos básicos

- `docker-compose up -d`: Levanta los servicios definidos en el archivo `docker-compose.yml` en modo desacoplado (detached).

- `docker-compose down`: Detiene y elimina los contenedores, redes y volúmenes definidos en el archivo `docker-compose.yml`.

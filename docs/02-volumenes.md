# Volumen

Un volumen en Docker es un área de almacenamiento gestionada por Docker, independiente del ciclo de vida del contenedor. Se usa para:

- Persistir datos más allá de la vida del contenedor (p. ej., bases de datos).
- Compartir datos entre varios contenedores.
- Separar datos de la imagen y del sistema de archivos efímero del contenedor.

## Tipos comunes

- **Named Volumes**: Este es el volumen más usado.
- **Bind volumes**: - Vincular volúmenes Bind volumes trabaja con paths absolutos
- **Anonymous Volumes**: Volúmenes donde sólo se especifica el path del contenedor y Docker lo asigna automáticamente en el host

## Comandos útiles

```bash
docker volume create nombre_volumen
docker volume ls
docker volume inspect nombre_volumen
docker volume rm nombre_volumen
```

Ejemplo de uso:

```bash
docker run -d --name mi-db -v datos-db:/var/lib/mysql mysql:5.7
# o usando --mount
docker run -d --name mi-db --mount source=datos-db,target=/var/lib/mysql mysql:5.7
```

## Buenas prácticas

- Usar volúmenes para datos persistentes y copias de seguridad.
- Evitar almacenar datos persistentes en la capa de la imagen.
- Gestionar permisos y propietarios dentro del contenedor si es necesario.
- Hacer backups regulares de volúmenes críticos.

## Comandos volume

### create world-db

Crear un volumen con nombre

```bash
docker volume create world-db
#Retorno
world-db
```

### ls

Lista los volumenes creados

```bash
docker volume ls
#Retorno
local     world-db
```

### inspect

Muestra información detallada del volumen

```bash
docker volume inspect world-db
#Retorno
[
    {
        "CreatedAt": "2026-01-10T16:40:10Z",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/world-db/_data",
        "Name": "world-db",
        "Options": null,
        "Scope": "local"
    }
]
```

## Bind volume

Los Bind Volumes (o Bind Mounts) son una de las formas más directas de persistir datos en Docker. A diferencia de los Named Volumes, donde Docker gestiona el espacio en el disco, en un Bind Volume tú le dices a Docker exactamente qué carpeta o archivo de tu computadora (Host) quieres "vincular" con una carpeta dentro del contenedor.

### Características Principales

Dependencia del Host: Se basan en la estructura de archivos de tu sistema operativo. Si mueves la carpeta de lugar en tu PC, el contenedor perderá el acceso.

Rutas Absolutas: Siempre requieren la ruta completa (ej: C:\Proyectos\mi-app o /home/user/app).

Sobreescritura: Si vinculas una carpeta de tu PC a una carpeta del contenedor que ya tenía archivos, los archivos del contenedor quedarán "ocultos" por los de tu PC mientras el vínculo esté activo.

### Casos de Uso (¿Cuándo usarlos?)

Son ideales para:

Desarrollo en tiempo real: Puedes editar tu código en VS Code y ver los cambios reflejados en el contenedor sin tener que reconstruir la imagen.

Compartir archivos de configuración: Como archivos .conf, .env o el archivo world.sql que se uso en el ejercicio anterior.

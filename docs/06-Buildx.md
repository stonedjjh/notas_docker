# Buildx

Docker Buildx es una extensión de Docker que proporciona una experiencia de construcción avanzada y multiplataforma. Permite a los desarrolladores construir imágenes de Docker para múltiples arquitecturas y plataformas utilizando una sola línea de comandos. Buildx se basa en BuildKit, un motor de construcción moderno que ofrece mejoras significativas en rendimiento y flexibilidad en comparación con el sistema de construcción tradicional de Docker.

## Constructor personalizado (Custom builder)

Como alternativa al uso del almacenamiento de imágenes de `containerd`, puedes crear un constructor personalizado que utilice el controlador `docker-container`. Este controlador permite realizar construcciones para múltiples plataformas (multi-platform builds), pero las imágenes resultantes no se cargan automáticamente en el listado de imágenes de tu Docker Engine local. En su lugar, puedes enviarlas directamente a un registro de contenedores (como Docker Hub o DigitalOcean) utilizando el comando `docker build --push`.

### Comandos

- `docker buildx ls`: Lista los builders disponibles en tu entorno. Un builder es un entorno de construcción que puede usar diferentes drivers (como Docker, Kubernetes, etc.) para construir imágenes. Este comando muestra información sobre cada builder, incluyendo su nombre, driver, estado y plataformas soportadas.

**Ejemplo:**

```bash
docker buildx ls
#Retorno
NAME/NODE           DRIVER/ENDPOINT     STATUS    BUILDKIT   PLATFORMS
default             docker
 \_ default          \_ default         running   v0.29.0    linux/amd64 (+3), linux/arm64, linux/arm (+2), linux/ppc64le, (2 more)
desktop-linux*      docker
 \_ desktop-linux    \_ desktop-linux   running   v0.29.0    linux/amd64 (+3), linux/arm64, linux/arm (+2), linux/ppc64le, (2 more)
```

---

- **docker buildx create:** Es la instrucción utilizada para instanciar y configurar un nuevo "builder" (constructor). A diferencia del constructor por defecto de Docker, este comando permite crear un entorno de compilación aislado y especializado que desbloquea capacidades profesionales.

```bash
docker buildx create \
  --name container-builder \
  --driver docker-container \
  --bootstrap --use
```

**Desglose de los flags comunes:**

- **--name:** Asigna un nombre identificable a tu instancia de constructor.

- **--driver:** Especifica el controlador a usar (el más común para despliegues profesionales es docker-container).

- **--bootstrap:** Descarga e inicia inmediatamente el contenedor del constructor para asegurar que esté listo para usarse.

- **--use:** Establece automáticamente este nuevo constructor como el activo para las siguientes operaciones de docker buildx build.

---

- **docker buildx use:** Es el comando que se utiliza para seleccionar y activar una instancia de constructor (builder) específica como la predeterminada para las operaciones actuales de construcción.

`docker buildx use container-builder`

---

- **docker buildx inspect:** Permite inspeccionar y obtener detalles sobre una instancia de constructor específica, incluyendo su configuración, estado, plataformas soportadas y más.

```bash
docker buildx inspect
#salida
Name:          container-builder
Driver:        docker-container
Last Activity: 2026-04-25 15:52:12 +0000 UTC

Nodes:
Name:                  container-builder0
Endpoint:              desktop-linux
Status:                running
BuildKit daemon flags: --allow-insecure-entitlement=network.host
BuildKit version:      v0.29.0
Platforms:             linux/amd64, linux/amd64/v2, linux/amd64/v3, linux/arm64, linux/riscv64, linux/ppc64le, linux/s390x, linux/386, linux/arm/v7, linux/arm/v6
Labels:
 org.mobyproject.buildkit.worker.executor:         oci
 org.mobyproject.buildkit.worker.hostname:         a301d624f487
 org.mobyproject.buildkit.worker.network:          host
 org.mobyproject.buildkit.worker.oci.process-mode: sandbox
 org.mobyproject.buildkit.worker.selinux.enabled:  false
 org.mobyproject.buildkit.worker.snapshotter:      overlayfs
GC Policy rule#0:
 All:            false
 Filters:        type==source.local,type==exec.cachemount,type==source.git.checkout
 Keep Duration:  48h0m0s
 Max Used Space: 488.3MiB
GC Policy rule#1:
 All:            false
 Keep Duration:  1440h0m0s
 Reserved Space: 9.313GiB
 Max Used Space: 93.13GiB
 Min Free Space: 188.1GiB
GC Policy rule#2:
 All:            false
 Reserved Space: 9.313GiB
 Max Used Space: 93.13GiB
 Min Free Space: 188.1GiB
GC Policy rule#3:
 All:            true
 Reserved Space: 9.313GiB
 Max Used Space: 93.13GiB
 Min Free Space: 188.1GiB
```

## BUILDPLATFORM y TARGETPLATFORM

Cuando se usa Buildx, Docker ejecuta el proceso de construcción en una arquitectura, pero el resultado final puede estar destinado a otra totalmente distinta. Estas variables permiten diferenciar ambos entornos:

- **BUILDPLATFORM:** Representa la arquitectura de la computadora donde se está ejecutando el build (tu host). Por ejemplo, si se tiene una PC con Windows y procesador Intel, el valor será linux/amd64.

- **TARGETPLATFORM:** Representa la arquitectura donde se ejecutará el contenedor final (el destino). Por ejemplo, si se está compilando una imagen para que corra en un servidor de Amazon con procesadores Graviton, el valor será linux/arm64.

### ¿Para qué sirven en la práctica?

Su uso principal es la compilación cruzada (Cross-Compilation). Imagina que se está programando una aplicación en Go o Rust:

1. Se necesita descargar los compiladores para su arquitectura actual (`BUILDPLATFORM`).

2. Pero necesitas que el compilador genere un binario específico para la arquitectura de su servidor (`TARGETPLATFORM`).

Ejemplo en un Dockerfile:

```YAML
FROM --platform=$BUILDPLATFORM node:18-alpine AS build
# Aquí usamos la plataforma nativa para que el build sea rápido
ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN echo "Estoy construyendo en $BUILDPLATFORM para enviar a $TARGETPLATFORM"

# Comando hipotético que usa el target para compilar
RUN npm run build -- --target=$TARGETPLATFORM
```

> [!TIP]
> Estas variables solo están disponibles si usas el comando docker buildx build. Si usas el docker build tradicional, estas variables estarán vacías.

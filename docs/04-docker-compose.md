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

  - **env_file:** Permite cargar múltiples variables de entorno desde un archivo externo (usualmente .env), manteniendo el archivo YAML más limpio y seguro.

  - **build:** Indica que el contenedor no usará una imagen pre-fabricada, sino que debe construirse desde una carpeta local que contiene un Dockerfile.

  - **healthcheck:** Permite a Docker monitorear si la aplicación dentro del contenedor está realmente lista y funcionando, no solo si el proceso está encendido.
    - **test**: El comando que se ejecuta para validar el estado (ej: un ping a la BD).

    - **interval/timeout**: Cada cuánto tiempo se prueba y cuánto se espera antes de fallar.

    - **retries:** Cuántos intentos fallidos se permiten antes de marcarlo como "unhealthy".

    - **start_period:** Tiempo de gracia para que la app inicie antes de empezar a chequear su salud.

- **volumes**: Es una sección donde se reservan espacios de almacenamiento que son gestionados exclusivamente por Docker en una parte especial del disco duro del host. Crear un almacenamiento persistente que no depende de la estructura de carpetas de tu PC (como Windows o OneDrive), sino que vive dentro del motor de Docker.
  - **external: true**: le indica a Docker Compose que el volumen ya ha sido creado fuera del archivo actual (ya sea manualmente mediante la terminal o por otro proyecto de Docker) y que debe conectarse a él en lugar de intentar generar uno nuevo.

- **networks**: Define las redes personalizadas que los servicios pueden usar para comunicarse entre sí.

## Comandos básicos

- `docker-compose up -d`: Levanta los servicios definidos en el archivo `docker-compose.yml` en modo desacoplado (detached).

- `docker-compose down`: Detiene y elimina los contenedores, redes y volúmenes definidos en el archivo `docker-compose.yml`.

> [!NOTE]
> Notas sobre nombres de recursos
> Por defecto, Docker Compose utiliza un sistema de composición de nombres para evitar colisiones, anteponiendo el nombre del proyecto (usualmente el nombre de la carpeta) a las redes y volúmenes (ej: mi-proyecto_default).
>
> Para evitar este comportamiento y asignar nombres exactos, podemos utilizar la propiedad name:
>
> name: Permite definir un nombre personalizado y fijo para la red o el volumen, ignorando el prefijo del proyecto.
>
> ```YAML
> networks:
>   frontend:
>     name: mi-red-personalizada
>
> volumes:
>   db-data:
>     name: mi-almacenamiento-fijo
> ```

## Ejemplo de mi autoria

```YAML
services:
  db-relational:
    image: postgres:18-alpine
    container_name: postgres_db
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: always
    networks:
      - backend-network
    env_file:
      - .env
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    #ports:
    #  - "${DB_PORT}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongodb:
    image: mongo:latest
    container_name: mongodb
    healthcheck:
      test: ["CMD-SHELL", "mongosh --eval 'db.adminCommand(\"ping\")'"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: always
    networks:
      - backend-network
    env_file:
      - .env
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_INITDB_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_INITDB_ROOT_PASSWORD}
    #ports:
    #  - "${MONGO_PORT}:27017"
    volumes:
      - mongo_data:/data/db

  minio:
    image: minio/minio:latest
    container_name: minio_storage
    ports:
    #  - "${STORAGE_PORT}:${STORAGE_PORT}"
      - "9001:9001"
    networks:
      - backend-network
    environment:
      MINIO_ROOT_USER: ${STORAGE_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${STORAGE_ROOT_PASSWORD}
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    restart: always

  document-processor:
    build: ./service-doc-proc
    container_name: doc_processor_app
    depends_on:
      db-relational:
        condition: service_healthy
      mongodb:
        condition: service_healthy
      minio:
        condition: service_started
    networks:
      - backend-network
    #ports:
    #  - "8000:8000"
    env_file:
      - .env
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - MONGO_URL=${MONGO_URL}
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8000/api/v1/health || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 20s
    restart: always

  bff-node:
    build: ./bff-node
    container_name: bff_node_app
    restart: always
    depends_on:
      document-processor:
        condition: service_healthy
    networks:
      - frontend-network
      - backend-network
    ports:
      - "4000:4000"
    env_file:
      - ./bff-node/.env
    environment:
      - DOCUMENT_PROCESSOR_URL=http://doc_processor_app:8000
      - PORT=4000


networks:
  backend-network:
    name: backend-network
    driver: bridge
  frontend-network:
    name: frontend-network
    driver: bridge

volumes:
  postgres_data:
    driver: local
    name: postgres_data
  mongo_data:
    driver: local
    name: mongo_data
  minio_data:
    driver: local
    name: minio_data
```

### Notas de Orquestación

En este escenario de microservicios que he planteado, hay detalles técnicos muy valiosos que quiero resaltar:

1. **Aislamiento de Redes**
   Mi servicio `db-relational` y `mongodb` solo están en la `backend-network`. Esto es una excelente práctica de seguridad: las bases de datos están aisladas del mundo exterior y solo son accesibles por los servicios internos.

2. **El rol del BFF (Backend For Frontend)**
   El servicio `bff-node` actúa como puente, ya que pertenece a ambas redes (`frontend-network` y `backend-network`). Es el único punto de entrada desde el exterior (puerto 4000) hacia tu lógica de negocio.

3. **Comunicación Inter-Container**
   Fíjense en esta línea de mi configuración:
   `DOCUMENT_PROCESSOR_URL=http://doc_processor_app:8000`
   Aquí estoy usando el DNS interno de Docker. No necesitas IPs; usas el `container_name` para que los servicios se encuentren entre sí.

4. **Uso de Variables de Entorno `${VARIABLE}`**
   Estoy usando interpolación de variables. Esto permite que el mismo archivo de Compose funcione para diferentes desarrolladores o entornos (Desarrollo, QA, Producción) simplemente cambiando el archivo .env.

### Caso de Estudio: Orquestación de Microservicios (Evolución)

Este ejemplo representa la transición de contenedores aislados a una arquitectura interconectada y resiliente. Se aplican conceptos avanzados para garantizar que la infraestructura sea segura y autogestionable.

1. **Arquitectura de Redes y Aislamiento**

   Se implementa un modelo de doble red para segmentar el tráfico:
   - **backend-network**: Zona segura donde residen las bases de datos (PostgreSQL, MongoDB) y el almacenamiento (MinIO). No tienen exposición a internet.
   - **frontend-network**: Zona de acceso controlado donde el BFF (Backend For Frontend) actúa como único punto de entrada, comunicándose con los servicios internos.

2. **Resiliencia mediante Healthchecks**

   No basta con que un contenedor esté "Up"; debe estar operativo.
   - Se utiliza `healthcheck` con comandos nativos (`pg_isready`, `mongosh`) para verificar la salud real de las bases de datos.
   - La instrucción `depends_on` con `condition: service_healthy` garantiza que los servicios de aplicación solo intenten conectarse cuando la base de datos esté lista para recibir peticiones, evitando errores de conexión en el arranque.

3. **Abstracción y Configuración Dinámica**
   - **DNS Interno:** La comunicación entre servicios se realiza mediante el container_name (ej: http://doc_processor_app:8000), eliminando la dependencia de direcciones IP estáticas.
   - **Interpolación de Variables:** El uso de `${VARIABLE}` y archivos `env_file` permite que el mismo archivo de orquestación sea portable entre diferentes entornos de trabajo.

## Multi-Stage Build y Orquestación de Producción

Esta arquitectura permite optimizar el tamaño de la imagen final y garantizar que solo el código compilado y las dependencias esenciales lleguen al entorno de ejecución. Al separar las etapas, se evita cargar herramientas de desarrollo innecesarias en el contenedor de producción.

### 1. Estructura del Dockerfile (Multi-Stage)

El pipeline de construcción se divide en etapas lógicas para maximizar la eficiencia y seguridad:

- **dev**: Etapa base para desarrollo local que utiliza el comando `yarn start:dev` para habilitar el hot-reload.
- **dev-deps**: Se encarga de la instalación de todas las dependencias, incluyendo las de desarrollo, utilizando `--frozen-lockfile` para garantizar que las versiones sean idénticas a las del archivo lock.
- **builder**: Etapa de compilación donde se copian los `node_modules` de desarrollo y se ejecuta `yarn build` para transformar el código TypeScript en JavaScript dentro de la carpeta `/dist`.
- **prod-deps**: Una etapa de limpieza que realiza una instalación exclusiva de dependencias de producción, reduciendo el peso de la imagen.
- **prod**: La imagen final optimizada. Solo contiene la carpeta `/dist` y las dependencias de producción, minimizando la superficie de ataque y el almacenamiento.

```bash
#Se agrega un paso para construir la imagen que se usara en desarrollo
FROM node:19-alpine3.15 as dev
WORKDIR /app
COPY package.json ./
RUN yarn install
CMD ["yarn", "start:dev"]


FROM node:19-alpine3.15 as dev-deps
WORKDIR /app
COPY package.json package.json
RUN yarn install --frozen-lockfile


FROM node:19-alpine3.15 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
## RUN yarn test
RUN yarn build

FROM node:19-alpine3.15 as prod-deps
WORKDIR /app
COPY package.json package.json
RUN yarn install --frozen-lockfile


FROM node:19-alpine3.15 as prod
EXPOSE 3000
WORKDIR /app
ENV APP_VERSION=${APP_VERSION}
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD [ "node","dist/main.js"]
```

### 2. Orquestación con Múltiples Archivos Compose

Para gestionar el despliegue sin interferir con la configuración de desarrollo, se utiliza un archivo de composición específico llamado `docker-compose.prod.yml`.

#### Archivo: docker-compose.prod.yml

```yaml
services:
  nest-app:
    build:
      context: .
      dockerfile: Dockerfile
      target: prod ## Indica a Docker que debe detenerse en la etapa final de producción
    image: teslo-shop-prod:${APP_VERSION}
    container_name: nest_app_prod
    restart: always
    ports:
      - "${PORT}:3000"
    environment:
      - STAGE=prod
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - DB_HOST=${DB_HOST}
      - DB_PORT=${DB_PORT}
      - DB_USERNAME=${DB_USERNAME}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db

  db:
    image: postgres:14.3
    restart: always
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    container_name: ${DB_NAME}
    volumes:
      - postgres-db:/var/lib/postgresql/data

volumes:
  postgres-db:
    external: false
```

### 3. Uso de la Bandera -f (File)

Para levantar el entorno de producción, se utiliza la bandera `-f` para especificar el archivo de configuración alternativo.

Comando de ejecución:
`docker-compose -f docker-compose.prod.yml up --build -d`

Ventajas de este enfoque

- **Aislamiento:** Las herramientas y dependencias de desarrollo no llegan al servidor.

- **Inmutabilidad:** La imagen generada en la etapa prod es la versión definitiva para el despliegue.

- **Control de Etapas:** El uso de target: prod asegura que Docker ignore las etapas previas de desarrollo al construir la imagen final.

> [!TIP]
> Lección de Infraestructura: Al usar esta estructura, es fundamental que el archivo .env contenga la variable APP_VERSION para que la imagen generada tenga un tag correcto en el repositorio local.

## Gestión Dinámica de Versiones (APP_VERSION)

El uso de la variable `APP_VERSION` no es solo para etiquetar la imagen; es un puente de información que va desde tu archivo `.env` hasta el interior de tu código en ejecución.

### Inyección de la Variable

En el `docker-compose.prod.yml`, la variable se pasa del host al contenedor de dos formas:

1. **A nivel de Imagen**: `image: teslo-shop-prod:${APP_VERSION}` asegura que al ejecutar `docker images`, puedas identificar rápidamente si tienes la versión `1.0.1` o `1.0.2`.
2. **A nivel de Entorno**: `ENV APP_VERSION=${APP_VERSION}` dentro del Dockerfile (etapa `prod`) permite que el proceso de Node.js acceda a ella.

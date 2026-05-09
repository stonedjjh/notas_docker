# Nginx

## Definición

**Nginx** (pronunciado _"engine-ex"_) es un servidor web HTTP de código abierto y alto rendimiento. Aunque inicialmente fue diseñado como un servidor web para servir contenido estático de manera extremadamente rápida, hoy en día se utiliza ampliamente como **Proxy Inverso (Reverse Proxy)**, **Balanceador de Carga (Load Balancer)** y caché HTTP.

Fue creado por Igor Sysoev en 2004 para resolver el problema conocido como **C10K** (manejar 10,000 conexiones concurrentes en un solo servidor).

## Características Principales

- **Arquitectura basada en eventos (Event-driven):** A diferencia de servidores tradicionales (como Apache) que crean un proceso o hilo por cada petición, Nginx utiliza una arquitectura asíncrona y no bloqueante. Esto le permite manejar miles de conexiones simultáneas dentro de un solo proceso de trabajo (worker process).
- **Bajo consumo de recursos:** Gracias a su arquitectura, consume muy poca memoria RAM y CPU, incluso bajo cargas extremas.
- **Altamente Escalable:** Su rendimiento escala de manera predecible según el hardware, sin degradarse al aumentar el tráfico.
- **Configuración Modular y Declarativa:** Su archivo de configuración (`nginx.conf`) es altamente estructurado y fácil de leer.

## Funcionalidades Clave

1. **Servidor de Archivos Estáticos:** Servir HTML, CSS, JavaScript e imágenes con una velocidad insuperable.
2. **Proxy Inverso:** Recibir peticiones de Internet y redirigirlas a uno o varios servidores internos (backend escrito en Node.js, Python, Java, etc.), ocultando la infraestructura real.
3. **Balanceo de Carga (Load Balancing):** Distribuir el tráfico entrante entre múltiples réplicas de un servicio para evitar saturaciones (soporta algoritmos como Round Robin, IP Hash, Least Connections).
4. **Terminación SSL/TLS:** Centralizar los certificados HTTPS en Nginx, liberando a los servidores internos de la carga criptográfica (el tráfico interno puede ir por HTTP normal).
5. **Caché HTTP:** Almacenar copias de respuestas de los backends para servirlas inmediatamente en futuras peticiones idénticas, reduciendo la carga del servidor de aplicaciones.

---

## Ejemplos de Uso

### 1. Servidor Web Estático Básico

Un ejemplo de configuración (`nginx.conf`) o un bloque dentro de `conf.d/default.conf` para servir un sitio web estático:

```nginx
server {
    listen 80;
    server_name misitio.com;

    # Raíz donde se encuentran los archivos web
    root /usr/share/nginx/html;
    index index.html index.htm;

    location / {
        # Intenta servir el archivo exacto, luego el directorio, y si falla retorna un 404
        try_files $uri $uri/ =404;
    }
}
```

### 2. Proxy Inverso (Reverse Proxy)

Redirigiendo el tráfico del puerto 80 hacia una aplicación Node.js interna (o contenedor) corriendo en el puerto 3000:

```nginx
server {
    listen 80;
    server_name api.misitio.com;

    location / {
        proxy_pass http://localhost:3000; # Redirige al backend
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Integración con Docker

Nginx es una de las imágenes más populares en Docker. Al estar en un entorno contenedorizado, suele usarse como capa de entrada a nuestros microservicios.

### Dockerfile para una SPA (React, Angular, Vue)

Usando un _Multi-stage build_ (como vimos en otras secciones de estas notas) para compilar y luego servir con Nginx:

```dockerfile
# Etapa 1: Construcción
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Producción con Nginx
FROM nginx:alpine
# Copiamos la build generada a la carpeta pública de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# (Opcional) Copiar una configuración personalizada
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx como Proxy Inverso en Docker Compose

```yaml
services:
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - backend-api

  backend-api:
    build: ./api-node
    # No exponemos puertos al host exterior, Nginx se encargará de acceder internamente
```

---

## Mejores Prácticas (Seguridad y Rendimiento)

1. **Ocultar la versión de Nginx:**
   Por defecto, Nginx muestra su número de versión en las páginas de error y en las cabeceras HTTP. Esto facilita el trabajo a los atacantes para buscar vulnerabilidades específicas.

   ```nginx
   server_tokens off;
   ```

2. **Limitar el tamaño del cuerpo de la petición (Uploads):**
   Para prevenir ataques de denegación de servicio (DDoS) o saturación de disco permitiendo que suban archivos enormes:

   ```nginx
   client_max_body_size 10M; # Limita subidas a 10 Megabytes
   ```

3. **Habilitar Compresión GZIP:**
   Acelera enormemente la carga del sitio web reduciendo el tamaño de las transferencias para los clientes.

   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript text/xml;
   gzip_min_length 1000;
   ```

4. **Configurar Cabeceras de Seguridad (Security Headers):**
   Proteger la aplicación contra XSS, Clickjacking y otros ataques web comunes.

   ```nginx
   add_header X-Frame-Options "SAMEORIGIN";
   add_header X-XSS-Protection "1; mode=block";
   add_header X-Content-Type-Options "nosniff";
   ```

5. **Afinar los Timeouts (Tiempos de espera):**
   Para defenderse de ataques _Slowloris_ (donde los atacantes mantienen las conexiones abiertas enviando datos muy lentamente para agotar los recursos).
   ```nginx
   client_body_timeout 12s;
   client_header_timeout 12s;
   keepalive_timeout 15s;
   send_timeout 10s;
   ```

## Ejercicio de Práctica 08

1. En la carpeta ejericios ir a la carpeta react-heroes y ejecutar `yarn` o `npm install`

2. Levantar una contenedor de nginx con el siguiente comando `docker run --name  some-nginx -d -p 8080:80 nginx:1.23.3`

3. Abrir el navegador de [nginx](http://localhost:8080/)

4. Entramos en la terminal interativa del container para dirigirse a la ruta `/usr/share/nginx/html` aqui se encuentra el archivo `index.html` y su contenido es el que se visualiza en la pagina web abierta en el paso previo

   ```bash
   PS C:\notas_docker\ejercicios\08-nginx\react-heroes> docker exec -it f86 bash
   root@f866264b4c91:/# cd /usr/share/nginx/html
   root@f866264b4c91:/usr/share/nginx/html# cat index.html
   <!DOCTYPE html>
   <html>
   <head>
   <title>Welcome to nginx!</title>
   <style>
   html { color-scheme: light dark; }
   body { width: 35em; margin: 0 auto;
   font-family: Tahoma, Verdana, Arial, sans-serif; }
   </style>
   </head>
   <body>
   <h1>Welcome to nginx!</h1>
   <p>If you see this page, the nginx web server is successfully installed and
   working. Further configuration is required.</p>

   <p>For online documentation and support please refer to
   <a href="http://nginx.org/">nginx.org</a>.<br/>
   Commercial support is available at
   <a href="http://nginx.com/">nginx.com</a>.</p>

   <p><em>Thank you for using nginx.</em></p>
   </body>
   </html>
   ```

5. Para ver la configuracion de nginx hay que visualizar el archivo `/etc/nginx/conf.d/default.conf`

```bash
root@f866264b4c91:/usr/share/nginx/html# cat /etc/nginx/conf.d/default.conf
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
```

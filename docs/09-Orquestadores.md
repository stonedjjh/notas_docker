# Orquestadores

## Kubernetes

Kubernetes es un sistema de orquestación de contenedores de código abierto que automatiza la implementación, el escalado y la gestión de aplicaciones en contenedores. Fue desarrollado originalmente por Google y ahora es mantenido por la Cloud Native Computing Foundation (CNCF). Kubernetes proporciona una plataforma para ejecutar aplicaciones en contenedores de manera eficiente y escalable, permitiendo a los desarrolladores y operadores gestionar aplicaciones complejas con facilidad.

### Componentes

- **Pod:** Es la unidad mínima de ejecución en Kubernetes. Representa un grupo de uno o más contenedores que comparten almacenamiento, red y una especificación de cómo ejecutarlos. Los contenedores dentro de un Pod se comunican entre sí a través de `localhost`.
  
  - Es una capa abstracta sobre uno o mas contenedores.

  - Esto permite reemplazarlos fácilmente.

  > [!NOTE]
  > Tienen una IP única que cambia al reconstruirse

- **Service:** Es una abstracción que define una política de acceso a un grupo de Pods. Dado que los Pods son efímeros y sus IPs cambian, el Service proporciona una **IP estática y un nombre de DNS estable** para que otros componentes puedan comunicarse con ellos sin interrupciones. También actúa como un balanceador de carga básico entre los Pods que selecciona.

- **Ingress:** Es un objeto de API que gestiona el acceso externo a los servicios dentro del clúster, típicamente tráfico HTTP y HTTPS. Puede proporcionar balanceo de carga, terminación SSL y nombres de host virtuales (rutas), funcionando como una capa de "puerta de entrada" o Reverse Proxy.

- **ConfigMap:** Es un objeto de API utilizado para almacenar datos no confidenciales en formato de pares clave-valor. Permite desacoplar la configuración de la imagen del contenedor para que las aplicaciones sean portables.

- **Secret:** Similar a un ConfigMap, pero diseñado específicamente para almacenar y gestionar información sensible, como contraseñas, tokens de OAuth o claves SSH, de forma más segura (codificados en base64).

- **Volume:** Es un directorio con datos al que pueden acceder los contenedores de un Pod. A diferencia de los volúmenes de Docker, el ciclo de vida de un volumen en Kubernetes está ligado al del Pod (aunque existen tipos de volúmenes persistentes que sobreviven al Pod).

- **Deployment:** Es un objeto declarativo que define el estado deseado de una aplicación. Se encarga de crear y actualizar réplicas de Pods de manera automática, permitiendo realizar rollouts (actualizaciones) y rollbacks (reversiones) de versiones.

- **StatefulSet:** Es el objeto utilizado para gestionar aplicaciones con estado (stateful). A diferencia de un Deployment, garantiza una identidad persistente y un orden específico para el despliegue y escalado de los Pods, ideal para bases de datos.

### Características Principales

- **Automatización**: Kubernetes automatiza la implementación, el escalado y la gestión de aplicaciones en contenedores.

- **Escalabilidad**: Permite escalar aplicaciones hacia arriba o hacia abajo según la demanda.

- **Alta Disponibilidad**: Kubernetes asegura que las aplicaciones estén disponibles incluso en caso de fallos de hardware o software.

- **Despliegue Continuo**: Facilita el despliegue continuo de aplicaciones mediante actualizaciones sin tiempo de inactividad.

- **Gestión de Configuración**: Permite gestionar la configuración de las aplicaciones de manera centralizada.

### Componentes Clave

- **Node**: Un nodo es una máquina física o virtual que ejecuta los pods.

- **Cluster**: Un conjunto de nodos que ejecutan aplicaciones en contenedores.
  - **Control plane**: Es el cerebro del clúster. Se encarga de tomar decisiones globales (como la programación de tareas) y de detectar y responder a los eventos del clúster.
    - **kube-apiserver**: Expone la API de Kubernetes. Es el punto de entrada para todas las consultas y comandos.
    - **kube-scheduler**: Selecciona el nodo más adecuado para que se ejecuten los Pods recién creados.
    - **etcd**: Almacenamiento persistente de clave-valor que guarda toda la información de configuración y el estado del clúster.
  - **Worker nodes**:
    - **kubelet**: Agente que se ejecuta en cada nodo y asegura que los contenedores estén funcionando en un Pod.
    - **kube-proxy**: Mantiene las reglas de red en los nodos, permitiendo la comunicación hacia los Pods.
    - **Container runtime**: El software responsable de ejecutar los contenedores (ej: Docker, containerd).
      - **Pod**: La unidad más pequeña de Kubernetes que puede contener uno o más contenedores.

- **Service**: Un servicio es una abstracción que define un conjunto de pods y una política para acceder a ellos.

- **Deployment**: Un Deployment proporciona actualizaciones declarativas para los pods y los ReplicaSets.

- **Container registry:** Es un sistema de almacenamiento y distribución de imágenes de contenedores (como Docker Hub o Azure Container Registry) desde donde el clúster descarga las imágenes para ejecutar los Pods.

- **Persistent storage:** Recursos de almacenamiento (como PersistentVolumes) que permiten que los datos de las aplicaciones persistan más allá del ciclo de vida de un Pod, evitando la pérdida de información al reiniciarse o moverse los contenedores.

### Comandos Básicos

- `kubectl get pods`: Lista los pods en el clúster.
  - `-o wide`: Muestra la lista más detallada.

- `kubectl create -f deployment.yaml`: Crea un Deployment a partir de un archivo YAML.

- `kubectl scale deployment my-deployment --replicas=3`: Escala un Deployment a 3 réplicas.

- `kubectl delete pod my-pod`: Elimina un pod específico.

- `kubectl get services`: Lista los servicios en el clúster.

- `kubectl port-forward <nombre_pod> <puerto_interno>:<puerto_externo>`: Redirige puertos locales a un pod.

### Ejemplo yml

ejemplo.yml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas:
    - 3
    selector:
    matchLabels:
      app: my-app
    template:
        metadata:
            labels:
            app: my-app
        spec:
            containers:
            - name: my-container
            image: my-image:latest
            ports:
            - containerPort: 80
```

Ahora para ejecutarlo `kubetcl apply -f ejemplo.yml`


### Ejemplo k8s-Teslo

1. Se inicia el servicio de Kubernetes con Minikube ejecutando `minikube start`:

```bash
PS > minikube start
😄  minikube v1.38.1 en Microsoft Windows 10 Home 22H2
✨  Controlador docker seleccionado automáticamente. Otras opciones: hyperv, virtualbox, ssh
❗  Starting v1.39.0, minikube will default to "containerd" container runtime. See #21973 for more info.
📌  Using Docker Desktop driver with root privileges
👍  Starting "minikube" primary control-plane node in "minikube" cluster
🚜  Pulling base image v0.0.50 ...
💾  Descargando Kubernetes v1.35.1 ...
    > preloaded-images-k8s-v18-v1...:  272.45 MiB / 272.45 MiB  100.00% 11.75 M
    > gcr.io/k8s-minikube/kicbase...:  519.58 MiB / 519.58 MiB  100.00% 13.86 M
🔥  Creating docker container (CPUs=2, Memory=3072MB) ...
🐳  Preparando Kubernetes v1.35.1 en Docker 29.2.1...
🔗  Configurando CNI bridge CNI ...
🔎  Verifying Kubernetes components...
    ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
🌟  Complementos habilitados: storage-provisioner, default-storageclass
🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
```

2. Se configuran los secretos de Kubernetes, el ConfigMap y el deployment:

```yml
#postgres-secrets.yml
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secrets
type: Opaque
data:
  DB_USER: cG9zdGdyZXM=
  DB_PASSWORD: RXN0b0VzVW5QYXNzd29yZFNlY3JldG8=
```

```yml
#postgres-config.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgres-config
data:
  # property-like keys; each key maps to a simple value
  DB_NAME: postgres
  DB_HOST: postgres-service
  DB_PORT: "5432"
```

```yml
#postgres.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-deployment
  labels:
    app: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15.1
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: postgres-secrets
              key: DB_USER
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secrets
              key: DB_PASSWORD
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
spec:
  selector:
    app: postgres
  ports:
    - protocol: TCP
      port: 5432
      targetPort: 5432
```

3. Se verifica que Minikube esté en ejecución con el comando `kubectl version`:

```bash
PS > kubectl version
Client Version: v1.34.1
Kustomize Version: v5.7.1
Server Version: v1.35.1
```

4. Para obtener la información del clúster se utiliza `kubectl get all`:

```bash
PS > kubectl get all
NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   18h
```

5. Para aplicar los archivos creados se utiliza `kubectl apply -f`:

```bash
PS > kubectl apply  -f .\postgres-config.yml
configmap/postgres-config created
PS > kubectl apply  -f .\postgres-secrets.yml
secret/postgres-secrets unchanged
PS > kubectl apply  -f .\postgres.yml
deployment.apps/postgres-deployment created
service/postgres-service created
```

6. Se verifica que todos los servicios estén corriendo con `kubectl get all`:

```bash
PS > kubectl get all
NAME                                       READY   STATUS    RESTARTS   AGE
pod/postgres-deployment-759cdbc99c-w62zx   1/1     Running   0          45m

NAME                       TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
service/kubernetes         ClusterIP   10.96.0.1       <none>        443/TCP    19h
service/postgres-service   ClusterIP   10.105.56.105   <none>        5432/TCP   49m

NAME                                  READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/postgres-deployment   1/1     1            1           45m

NAME                                             DESIRED   CURRENT   READY   AGE
replicaset.apps/postgres-deployment-759cdbc99c   1         1         1       45m
```

7. También se puede obtener la descripción de los recursos con el comando `kubectl describe`:

```bash
PS > kubectl describe deployment.apps/postgres-deployment
Name:                   postgres-deployment
Namespace:              default
CreationTimestamp:      Sun, 10 May 2026 08:06:15 -0400
Labels:                 app=postgres
Annotations:            deployment.kubernetes.io/revision: 1
Selector:               app=postgres
Replicas:               1 desired | 1 updated | 1 total | 1 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  app=postgres
  Containers:
   postgres:
    Image:      postgres:15.1
    Port:       5432/TCP
    Host Port:  0/TCP
    Environment:
      POSTGRES_USER:      <set to the key 'DB_USER' in secret 'postgres-secrets'>      Optional: false
      POSTGRES_PASSWORD:  <set to the key 'DB_PASSWORD' in secret 'postgres-secrets'>  Optional: false
    Mounts:               <none>
  Volumes:                <none>
  Node-Selectors:         <none>
  Tolerations:            <none>
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
  Progressing    True    NewReplicaSetAvailable
OldReplicaSets:  <none>
NewReplicaSet:   postgres-deployment-759cdbc99c (1/1 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  49m   deployment-controller  Scaled up replica set postgres-deployment-759cdbc99c from 0 to 1
```

8. Se obtiene acceso a los logs con `kubectl logs`:

```bash
PS > kubectl logs pod/postgres-deployment-759cdbc99c-w62zx
The files belonging to this database system will be owned by user "postgres".
This user must also own the server process.

The database cluster will be initialized with locale "en_US.utf8".
The default database encoding has accordingly been set to "UTF8".
The default text search configuration will be set to "english".

Data page checksums are disabled.

fixing permissions on existing directory /var/lib/postgresql/data ... ok
creating subdirectories ... ok
selecting dynamic shared memory implementation ... posix
selecting default max_connections ... 100
selecting default shared_buffers ... 128MB
selecting default time zone ... Etc/UTC
creating configuration files ... ok
running bootstrap script ... ok
performing post-bootstrap initialization ... ok
syncing data to disk ... ok

initdb: warning: enabling "trust" authentication for local connections
initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.

Success. You can now start the database server using:

    pg_ctl -D /var/lib/postgresql/data -l logfile start

waiting for server to start....2026-05-10 12:10:56.462 UTC [49] LOG:  starting PostgreSQL 15.1 (Debian 15.1-1.pgdg110+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
2026-05-10 12:10:56.485 UTC [49] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2026-05-10 12:10:56.574 UTC [52] LOG:  database system was shut down at 2026-05-10 12:10:41 UTC
2026-05-10 12:10:56.606 UTC [49] LOG:  database system is ready to accept connections
 done
server started

/usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*

waiting for server to shut down....2026-05-10 12:10:57.438 UTC [49] LOG:  received fast shutdown request
2026-05-10 12:10:57.480 UTC [49] LOG:  aborting any active transactions
2026-05-10 12:10:57.484 UTC [49] LOG:  background worker "logical replication launcher" (PID 55) exited with exit code 1
2026-05-10 12:10:57.493 UTC [50] LOG:  shutting down
2026-05-10 12:10:57.526 UTC [50] LOG:  checkpoint starting: shutdown immediate
2026-05-10 12:10:57.929 UTC [50] LOG:  checkpoint complete: wrote 3 buffers (0.0%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.139 s, sync=0.078 s, total=0.437 s; sync files=2, longest=0.054 s, average=0.039 s; distance=0 kB, estimate=0 kB
2026-05-10 12:10:57.955 UTC [49] LOG:  database system is shut down
 done
server stopped

PostgreSQL init process complete; ready for start up.

2026-05-10 12:10:58.151 UTC [1] LOG:  starting PostgreSQL 15.1 (Debian 15.1-1.pgdg110+1) on x86_64-pc-linux-gnu, compiled by gcc (Debian 10.2.1-6) 10.2.1 20210110, 64-bit
2026-05-10 12:10:58.156 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
2026-05-10 12:10:58.157 UTC [1] LOG:  listening on IPv6 address "::", port 5432
2026-05-10 12:10:58.186 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
2026-05-10 12:10:58.208 UTC [63] LOG:  database system was shut down at 2026-05-10 12:10:57 UTC
2026-05-10 12:10:58.234 UTC [1] LOG:  database system is ready to accept connections
2026-05-10 12:15:58.855 UTC [61] LOG:  checkpoint starting: time
2026-05-10 12:16:02.869 UTC [61] LOG:  checkpoint complete: wrote 41 buffers (0.3%); 0 WAL file(s) added, 0 removed, 0 recycled; write=3.887 s, sync=0.034 s, total=4.015 s; sync files=11, longest=0.010 s, average=0.004 s; distance=227 kB, estimate=227 kB
```

9. Se crea un servicio para pgAdmin:

```yml
#pg-admin-secrets
apiVersion: v1
kind: Secret
metadata:
  name: pg-admin-secrets
type: Opaque
data:
  PG_USER_EMAIL: c3RvbmVlc2hvcGNoQGdtYWlsLmNvbQ==
  DB_PASSWORD: TWlQYXNzd29yZFVsdHJhU2VjcmV0bw== # MiPasswordUltraSecreto
```

```yml
#pg-admin
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pg-admin-deployment
  labels:
    app: pg-admin
spec:
  replicas: 1
  selector:
    matchLabels:
      app: pg-admin
  template:
    metadata:
      labels:
        app: pg-admin
    spec:
      containers:
      - name: pg-admin
        image: dpage/pgadmin4:6.17
        ports:
        - containerPort: 80
        env:    
        - name: PGADMIN_DEFAULT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: pg-admin-secrets
              key: DB_PASSWORD
        - name: PGADMIN_DEFAULT_EMAIL
          valueFrom:
            secretKeyRef:
              name: pg-admin-secrets
              key: PG_USER_EMAIL
        - name: PGADMIN_CONFIG_ENHANCED_COOKIE_PROTECTION
          value: "False"
---
apiVersion: v1
kind: Service
metadata:
  name: pg-admin-service
spec:
  type: NodePort
  selector:
    app: pg-admin
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
      nodePort: 30200 #Debe estar entre el 30000 y el 32767
```

10. Se levanta los recursos creados y se verifica que esten activos

```bash
PS > kubectl apply  -f .\pg-admin-secrets.yml
secret/pg-admin-secrets created

PS > kubectl apply  -f .\pg-admin.yml
deployment.apps/pg-admin-deployment created
service/pg-admin-service created

PS > kubectl get all
NAME                                       READY   STATUS        RESTARTS        AGE
pod/pg-admin-deployment-74f946c5c5-qdd5x   1/1     Running       7 (5m22s ago)   15m
pod/pg-admin-deployment-7fb967db56-lhbpc   0/1     Terminating   0               18m
pod/postgres-deployment-759cdbc99c-w62zx   1/1     Running       0               3h55m

NAME                       TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
service/kubernetes         ClusterIP   10.96.0.1       <none>        443/TCP        22h
service/pg-admin-service   NodePort    10.98.60.255    <none>        80:30200/TCP   2m12s
service/postgres-service   ClusterIP   10.105.56.105   <none>        5432/TCP       3h59m

NAME                                  READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/pg-admin-deployment   1/1     1            1           18m
deployment.apps/postgres-deployment   1/1     1            1           3h55m

NAME                                             DESIRED   CURRENT   READY   AGE
replicaset.apps/pg-admin-deployment-74f946c5c5   1         1         1       15m
replicaset.apps/pg-admin-deployment-7fb967db56   0         0         0       18m
replicaset.apps/postgres-deployment-759cdbc99c   1         1         1       3h55m

PS > kubectl logs pod/pg-admin-deployment-74f946c5c5-qdd5x
NOTE: Configuring authentication for SERVER mode.

pgAdmin 4 - Application Initialisation
======================================

[2026-05-10 16:27:02 +0000] [1] [INFO] Starting gunicorn 20.1.0
[2026-05-10 16:27:02 +0000] [1] [INFO] Listening at: http://[::]:80 (1)
[2026-05-10 16:27:02 +0000] [1] [INFO] Using worker: gthread
[2026-05-10 16:27:02 +0000] [91] [INFO] Booting worker with pid: 91
```

11. Se despliega el servicio de pg-admin usando minikube

```bash 
PS > minikube service pg-admin-service
┌───────────┬──────────────────┬─────────────┬───────────────────────────┐
│ NAMESPACE │       NAME       │ TARGET PORT │            URL            │
├───────────┼──────────────────┼─────────────┼───────────────────────────┤
│ default   │ pg-admin-service │ 80          │ http://192.168.49.2:30200 │
└───────────┴──────────────────┴─────────────┴───────────────────────────┘
🔗  Starting tunnel for service pg-admin-service.
┌───────────┬──────────────────┬─────────────┬────────────────────────┐
│ NAMESPACE │       NAME       │ TARGET PORT │          URL           │
├───────────┼──────────────────┼─────────────┼────────────────────────┤
│ default   │ pg-admin-service │             │ http://127.0.0.1:23767 │
└───────────┴──────────────────┴─────────────┴────────────────────────┘
🎉  Opening service default/pg-admin-service in default browser...
❗  Porque estás usando controlador Docker en windows, la terminal debe abrirse para ejecutarlo.
```

Se accesa a `http://127.0.0.1:23767` y ya se puede visualizar pgadmin

12. Ahora como ultima etapa se debe crear los recursos y servicios del backend

```yml
backend-secrets.yml
apiVersion: v1
kind: Secret
metadata:
  name: backend-secrets
type: Opaque
data:
  JWT_SECRET: Q3VhbHF1aWVyQ29zYTUxNTEqMg==  
```

```yml
#backend.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
  labels:
    app: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: klerith/k8s-teslo-backend:1.1.0
        ports:
        - containerPort: 3000
        env:    
        - name: APP_VERSION
          value: "1.0.0"
        - name: PORT
          value: "3000"
        - name: STAGE
          value: "prod"
        - name: DB_NAME
          valueFrom:
            configMapKeyRef:
              name: postgres-config
              key: DB_NAME
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: postgres-config
              key: DB_HOST
        - name: DB_PORT
          valueFrom:
            configMapKeyRef:
              name: postgres-config
              key: DB_PORT
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: postgres-secrets
              key: DB_USER
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secrets
              key: DB_PASSWORD
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: backend-secrets
              key: JWT_SECRET
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: NodePort
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
      nodePort: 30300 #Debe estar entre el 30000 y el 32767
```

Se levantan los recursos, se verifican que esten ready

```bash
PS > kubectl apply  -f .\backend-secrets.yml
secret/backend-secrets created
PS > kubectl apply  -f .\backend.yml
deployment.apps/backend-deployment created
service/backend-service created
PS > kubectl get all
NAME                                       READY   STATUS    RESTARTS   AGE
pod/backend-deployment-5b44c8579-5gtd5     1/1     Running   0          10m
pod/backend-deployment-5b44c8579-tcqkm     1/1     Running   0          83s
pod/pg-admin-deployment-74f946c5c5-qdd5x   1/1     Running   0          81m
pod/postgres-deployment-759cdbc99c-w62zx   1/1     Running   0          5h39m

NAME                       TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/backend-service    NodePort    10.98.32.128    <none>        3000:30300/TCP   16m
service/kubernetes         ClusterIP   10.96.0.1       <none>        443/TCP          24h
service/pg-admin-service   NodePort    10.98.60.255    <none>        80:30200/TCP     106m
service/postgres-service   ClusterIP   10.105.56.105   <none>        5432/TCP         5h43m

NAME                                  READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/backend-deployment    2/2     2            2           16m
deployment.apps/pg-admin-deployment   1/1     1            1           122m
deployment.apps/postgres-deployment   1/1     1            1           5h39m

NAME                                             DESIRED   CURRENT   READY   AGE
replicaset.apps/backend-deployment-5b44c8579     2         2         2       10m
replicaset.apps/backend-deployment-76f4986cdb    0         0         0       16m
replicaset.apps/backend-deployment-844cd65788    0         0         0       16m
replicaset.apps/pg-admin-deployment-66576d6d96   0         0         0       120m
replicaset.apps/pg-admin-deployment-74f946c5c5   1         1         1       81m
replicaset.apps/pg-admin-deployment-7fb967db56   0         0         0       122m
replicaset.apps/postgres-deployment-759cdbc99c   1         1         1       5h39m
# Se revisan los logs del pod del backend
PS > kubectl logs pod/backend-deployment-5b44c8579-5gtd5
[Nest] 1  - 05/10/2026, 5:45:30 PM     LOG [NestFactory] Starting Nest application...
APP_VERSION: 1.0.0
STAGE: prod
DB_PASSWORD: EstoEsUnPasswordSecreto
DB_NAME: postgres
DB_HOST: postgres-service
DB_PORT: 5432
DB_USERNAME: postgres
PORT: 3000
HOST_API: undefined
JWT_SECRET: CualquierCosa5151*2
[Nest] 1  - 05/10/2026, 5:45:32 PM     LOG [InstanceLoader] AppModule dependencies initialized +1878ms
[Nest] 1  - 05/10/2026, 5:45:32 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +11ms
[Nest] 1  - 05/10/2026, 5:45:32 PM     LOG [InstanceLoader] PassportModule dependencies initialized +9ms
[Nest] 1  - 05/10/2026, 5:45:32 PM     LOG [InstanceLoader] CommonModule dependencies initialized +2ms
[Nest] 1  - 05/10/2026, 5:45:32 PM     LOG [InstanceLoader] ConfigHostModule dependencies initialized +6ms
[Nest] 1  - 05/10/2026, 5:45:32 PM     LOG [InstanceLoader] ServeStaticModule dependencies initialized +4ms
[Nest] 1  - 05/10/2026, 5:45:32 PM     LOG [InstanceLoader] ConfigModule dependencies initialized +3ms
[Nest] 1  - 05/10/2026, 5:45:32 PM     LOG [InstanceLoader] FilesModule dependencies initialized +4ms
[Nest] 1  - 05/10/2026, 5:45:32 PM     LOG [InstanceLoader] JwtModule dependencies initialized +5ms
[Nest] 1  - 05/10/2026, 5:45:35 PM     LOG [InstanceLoader] TypeOrmCoreModule dependencies initialized +3004ms
[Nest] 1  - 05/10/2026, 5:45:35 PM     LOG [InstanceLoader] TypeOrmModule dependencies initialized +2ms
[Nest] 1  - 05/10/2026, 5:45:35 PM     LOG [InstanceLoader] MessagesWsModule dependencies initialized +22ms
[Nest] 1  - 05/10/2026, 5:45:35 PM     LOG [InstanceLoader] SeedModule dependencies initialized +14ms
[Nest] 1  - 05/10/2026, 5:45:35 PM     LOG [InstanceLoader] ProductsModule dependencies initialized +2ms
[Nest] 1  - 05/10/2026, 5:45:35 PM     LOG [InstanceLoader] AuthModule dependencies initialized +7ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [WebSocketsController] MessagesWsGateway subscribed to the "message-from-client" message +420ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [RoutesResolver] ProductsController {/api/products}: +9ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [RouterExplorer] Mapped {/api/products, POST} route +16ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [RouterExplorer] Mapped {/api/products, GET} route +3ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [RouterExplorer] Mapped {/api/products/:term, GET} route +2ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [RouterExplorer] Mapped {/api/products/:id, PATCH} route +4ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [RouterExplorer] Mapped {/api/products/:id, DELETE} route +3ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [RoutesResolver] AuthController {/api/auth}: +1ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [RouterExplorer] Mapped {/api/auth/register, POST} route +3ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [RouterExplorer] Mapped {/api/auth/login, POST} route +3ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [RouterExplorer] Mapped {/api/auth/private, GET} route +12ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [RouterExplorer] Mapped {/api/auth/private2, GET} route +3ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [RouterExplorer] Mapped {/api/auth/private3, GET} route +3ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [RoutesResolver] SeedController {/api/seed}: +4ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [RouterExplorer] Mapped {/api/seed, GET} route +4ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [RoutesResolver] FilesController {/api/files}: +4ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [RouterExplorer] Mapped {/api/files/product/:imageName, GET} route +3ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [RouterExplorer] Mapped {/api/files/product, POST} route +4ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [NestApplication] Nest application successfully started +68ms
[Nest] 1  - 05/10/2026, 5:45:36 PM     LOG [Bootstrap] App corriendo en puerto: 3000!!!! :)
# Aqui se cometio un typo
PS > minikube service backedn-service
❌  Saliendo por un error SVC_NOT_FOUND: Service 'backedn-service' was not found in 'default' namespace.
You may select another namespace by using 'minikube service backedn-service -n <namespace>'. Or list out all the services using 'minikube 
PS > minikube service backend-service
┌───────────┬─────────────────┬─────────────┬───────────────────────────┐
│ NAMESPACE │      NAME       │ TARGET PORT │            URL            │
├───────────┼─────────────────┼─────────────┼───────────────────────────┤
│ default   │ backend-service │ 3000        │ http://192.168.49.2:30300 │
└───────────┴─────────────────┴─────────────┴───────────────────────────┘
🔗  Starting tunnel for service backend-service.
┌───────────┬─────────────────┬─────────────┬────────────────────────┐
│ NAMESPACE │      NAME       │ TARGET PORT │          URL           │
├───────────┼─────────────────┼─────────────┼────────────────────────┤
│ default   │ backend-service │             │ http://127.0.0.1:27654 │
└───────────┴─────────────────┴─────────────┴────────────────────────┘
🎉  Opening service default/backend-service in default browser...
❗  Porque estás usando controlador Docker en windows, la terminal debe abrirse para ejecutarlo.
✋  Stopping tunnel for service backend-service.
PS > minikube service pg-admin-service
┌───────────┬──────────────────┬─────────────┬───────────────────────────┐
│ NAMESPACE │       NAME       │ TARGET PORT │            URL            │
├───────────┼──────────────────┼─────────────┼───────────────────────────┤
│ default   │ pg-admin-service │ 80          │ http://192.168.49.2:30200 │
└───────────┴──────────────────┴─────────────┴───────────────────────────┘
🔗  Starting tunnel for service pg-admin-service.
┌───────────┬──────────────────┬─────────────┬────────────────────────┐
│ NAMESPACE │       NAME       │ TARGET PORT │          URL           │
├───────────┼──────────────────┼─────────────┼────────────────────────┤
│ default   │ pg-admin-service │             │ http://127.0.0.1:27800 │
└───────────┴──────────────────┴─────────────┴────────────────────────┘
🎉  Opening service default/pg-admin-service in default browser...
❗  Porque estás usando controlador Docker en windows, la terminal debe abrirse para ejecutarlo.
```

Aqui ya con las ip que nos da minikube se puede ejecutar el seeder abriendo el navegador en `http://127.0.0.1:27654/api/seed` o usando swagger ui `http://127.0.0.1:27654/api` y revisar que se cargo en la base de datos entrando en pg-admin en `http://127.0.0.1:27800`

![Backend Service](/ejercicios/09-k8s-teslo/image/backend-service.png)

![pg-admin Service](/ejercicios/09-k8s-teslo/image/pg-admin-service.png)


13. Por ultimo de eliminan todos los recursos creados con el comando `minikube delete --all`

```bash
✋  Stopping tunnel for service pg-admin-service.
PS > minikube delete --all
🔥  Eliminando "minikube" en docker...
🔥  Eliminando contenedor "minikube" ...
🔥  Eliminando C:\.minikube\machines\minikube...
💀  Removed all traces of the "minikube" cluster.
🔥  Successfully deleted all profiles
```

> [!IMPORTANT]
> Lecciones de Orquestación K8s:
>
>1. **Orden de Aplicación:** Siempre aplicar primero los Secrets y ConfigMaps antes que los Deployments para evitar errores de CreateContainerConfigError.
>
>2. **DNS Interno:** El DB_HOST en el backend apunta al nombre del Service (postgres-service), no a una IP. K8s resuelve esto automáticamente.
>
>3. **Persistencia en Local:** Al usar minikube delete --all, se eliminan todos los datos. En un entorno real, usaría PersistentVolumeClaims (PVC) para que la base de datos sobreviva al reinicio del clúster.]
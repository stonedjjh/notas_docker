# Redes en Docker

Las redes en Docker permiten la comunicación entre contenedores y con el exterior. Docker crea automáticamente una red puente llamada `bridge` para los contenedores, pero también es posible crear redes personalizadas.

## Comandos network

El comando network permite interactuar con las redes de docker

### create

Crear una red personalizada

```bash
docker network create world-app
#Retorno
16616a0630e7d0ad3133e75b9fd89bc5e7e6480c72f93092b282b300e4c9e7e6
```

### ls

Lista las redes creadas

```bash
docker network ls
#Retorno
NETWORK ID     NAME           DRIVER    SCOPE
a15774024996   bridge         bridge    local
d904bd3eac1f   host           host      local
b8548cb2dabc   none           null      local
f3b343e79274   postgres-net   bridge    local
16616a0630e7   world-app      bridge    local
```

### connect

Conectar un contenedor a una red

```bash
docker network connect world-app e2f
docker network connect world-app bd7
```

> [!NOTE]
> en este ejercicio 'e2f' y 'bd7' representan los id de los contenedores que se
> van a conectar a la red

### inspect

Muestra información detallada de una red

```bash
docker network inspect world-app
#Retorno
[
    {
        "Name": "world-app",
        "Id": "16616a0630e7d0ad3133e75b9fd89bc5e7e6480c72f93092b282b300e4c9e7e6",
        "Created": "2026-01-11T03:28:58.08886539Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv4": true,
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "172.19.0.0/16",
                    "IPRange": "",
                    "Gateway": "172.19.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Options": {
            "com.docker.network.enable_ipv4": "true",
            "com.docker.network.enable_ipv6": "false"
        },
        "Labels": {},
        "Containers": {
            "bd7fbd653f0f9ca35ebc1011d0cda0608dc7de232ed4192af1ad3757fc60630d": {
                "Name": "world-db",
                "EndpointID": "a897a078215d4cb9ac720ced97865328be571320418be3a9bbd21b387c143355",
                "MacAddress": "ee:a4:7f:d9:e2:b3",
                "IPv4Address": "172.19.0.3/16",
                "IPv6Address": ""
            },
            "e2f5f2656912b954f2e59670df08f7100090d7df9d15a3fd9649687791fd3b5d": {
                "Name": "phpmyadmin",
                "EndpointID": "9a50b5994d0c029509007d766b032554784bcb56c1321966c911dc6f235abf47",
                "MacAddress": "42:bd:95:d9:5a:f8",
                "IPv4Address": "172.19.0.2/16",
                "IPv6Address": ""
            }
        },
        "Status": {
            "IPAM": {
                "Subnets": {
                    "172.19.0.0/16": {
                        "IPsInUse": 5,
                        "DynamicIPsAvailable": 65531
                    }
                }
            }
        }
    }
]
```

> [!IMPORTANT]
> En la sección Containers se puede confirmar los contenedor que estan
> conectados a la red.

Con esta información se puede conectar usando el contenedor de phpmyadmin a la base
de datos.

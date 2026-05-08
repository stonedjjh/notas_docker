# Versionado Semantico

> [!NOTE]
> **Contexto sobre el módulo de GitHub Actions:**
> El curso original de Docker de Fernando Herrera incluye un módulo completo sobre GitHub Actions. Como ya tengo mis propios apuntes detallados en un repositorio dedicado ([stonedjjh/github-actions](https://github.com/stonedjjh/github-actions)), decidí no tomar notas de todo ese módulo para no duplicar información. Únicamente extraje esta sección sobre **Versionado Semántico**, ya que era un concepto y una herramienta que no tenía documentada previamente en mi otro repositorio.

## Versionado Semántico

El versionado semántico es un sistema de numeración de versiones que sigue un formato específico para indicar la naturaleza de los cambios realizados en una versión de software. El formato comúnmente utilizado es `MAJOR.MINOR.PATCH`, donde:

- **MAJOR**: Se incrementa cuando se realizan cambios incompatibles con versiones anteriores. Esto indica que los usuarios pueden necesitar realizar cambios significativos en su código para adaptarse a la nueva versión.

- **MINOR**: Se incrementa cuando se agregan nuevas funcionalidades de manera compatible con versiones anteriores. Esto indica que los usuarios pueden aprovechar las nuevas características sin necesidad de modificar su código existente.

- **PATCH**: Se incrementa cuando se realizan correcciones de errores o mejoras menores que no afectan la compatibilidad. Esto indica que los usuarios pueden actualizar a esta versión sin preocuparse por cambios significativos.

## Git Semantic Version

[Git Semantic Version](https://github.com/marketplace/actions/git-semantic-version)

Esta GitHub Action genera una versión semántica utilizando el historial de git del repositorio, sin necesidad de asignar el número de versión manualmente.

Resuelve el problema de no saber la versión en tiempo de compilación al calcular la "próxima versión implícita". Esto lo hace basándose en la última etiqueta (tag) y los mensajes de los commits, más un incremento que indica el número de commits desde el último cambio de versión.

### ¿Cómo funciona?

Por defecto, la herramienta sigue el patrón de **Conventional Commits**:

- **PATCH (Parche)**: Cualquier commit regular que no coincida con los patrones de abajo.
- **MINOR (Menor)**: Commits que empiezan con `feat:` o `feat(scope):`.
- **MAJOR (Mayor/Breaking)**: Commits con el sufijo `!:` (ej. `feat!:`, `fix!:`) o que contienen el texto `BREAKING CHANGE:`.

_Nota:_ Los commits tipo MAJOR sobrescriben a los MINOR. Si hay ambos tipos de commits desde la última etiqueta, el salto de versión será MAJOR.

### Requisito Importante: Checkout

Para que la Action pueda analizar el historial de git y las etiquetas, es **obligatorio** configurar el paso de `checkout` con `fetch-depth: 0` (para descargar todo el historial).

```yaml
steps:
  - name: Checkout
    uses: actions/checkout@v3
    with:
      fetch-depth: 0 # Obtiene todo el historial y los tags
      filter: blob:none # Excluye el contenido de los archivos para mayor velocidad
```

### Ejemplo de uso en GitHub Actions

```yaml
- name: Determinar Versión Semántica
  id: generador_de_tags
  uses: paulhatch/semantic-version@v5.4.0
  with:
    tag_prefix: "v"
    # Formato de salida personalizado
    version_format: "${major}.${minor}.${patch}-prerelease${increment}"

    # Opciones útiles para Monorepos (opcionales):
    # change_path: "src/my-service" # Directorio a revisar por cambios
    # namespace: my-service         # Sufijo para el tag
```

### Salidas (Outputs) principales

Una vez ejecutado el paso, puedes acceder a los resultados generados usando `${{ steps.generador_de_tags.outputs.<VARIABLE> }}`:

- **`version`**: El string de versión ya formateado (basado en `version_format`).
- **`version_tag`**: El identificador de la versión listo para usarse como tag en Git (ej. `v2.0.1`).
- **`changed`**: Booleano que indica si hubo cambios (muy útil en conjunto con `change_path`).
- **`version_type`**: Tipo de cambio detectado (`major`, `minor`, `patch` o `none`).
- **`increment`**: Cantidad de commits realizados desde la última versión.

### Múltiples versiones en un repositorio (Monorepos)

Es posible mantener diferentes versiones para distintos proyectos (ej. un backend y una base de datos) dentro del mismo repositorio. Para lograrlo, la Action ofrece las siguientes configuraciones:

1. **`change_path`**: Permite especificar una ruta. El incremento de versión solo ocurrirá si los archivos modificados están dentro de esa carpeta.
2. **`namespace`**: Agrega un identificador único a la etiqueta para no pisarse con otros proyectos (ej. un tag resultante sería `v1.2.3-db`).
3. **Patrones personalizados**: Puedes definir diferentes valores para `major_pattern` y `minor_pattern` de modo que cada proyecto responda a distintas palabras clave en los commits.

### Ejemplo Completo: CI con Docker Build & Push

Este es un ejemplo práctico de un flujo de trabajo completo que integra el cálculo de la versión semántica con la construcción y subida de una imagen a Docker Hub.

```yaml
name: Docker Image CI

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Git Semantic Version
        uses: paulhatch/semantic-version@v5.4.0
        with:
          major_pattern: "major:"
          minor_pattern: "feat:"
          version_format: "${major}.${minor}.${patch}-prerelease${increment}"
        id: generador_de_tags

      - name: Docker Login
        env:
          DOCKER_USER: ${{ secrets.DOCKER_USER }}
          DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
        run: |
          docker login -u $DOCKER_USER -p $DOCKER_PASSWORD

      - name: Build Docker Image
        env:
          NEW_VERSION: ${{ steps.generador_de_tags.outputs.version }}
        run: |
          docker build -t mi-usuario/docker-graphql:$NEW_VERSION .
          docker build -t mi-usuario/docker-graphql:latest .

      - name: Push Docker Image
        env:
          NEW_VERSION: ${{ steps.generador_de_tags.outputs.version }}
        run: |
          docker push mi-usuario/docker-graphql:$NEW_VERSION
          docker push mi-usuario/docker-graphql:latest
```

**Puntos clave del ejemplo:**

1. **Dependencia del ID:** El paso de versionado tiene el identificador `id: generador_de_tags`. Esto permite a los siguientes pasos acceder a sus resultados mediante la sintaxis `${{ steps.generador_de_tags.outputs.version }}`.
2. **Variables de entorno seguras:** Se usan los [Secrets de GitHub] (`${{ secrets.DOCKER_USER }}`) para no exponer credenciales en el código fuente.
3. **Doble Etiquetado (Tagging):** Se compila y se sube la imagen dos veces (una con la versión semántica dinámica y otra con la etiqueta estática `latest`). Esto facilita a los usuarios de la imagen descargar siempre la última versión sin importar el número específico.

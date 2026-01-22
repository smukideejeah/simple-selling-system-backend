# Sistema simple de gestión de ventas - Backend

API Rest desarrollada con Node.js Typescript + Express. Gestiona productos, descuentos y ventas.
Incluye lógica de negocio, persistencia con Mysql y pruebas unitarias y de integración.

## Tecnologías utilizadas
- Node.js
- Typescript
- Prisma ORM
- Mysql
- Jest (unit & integration test)
- Supertest

# Arquitectura 
El backend está estructurado por módulos:
- Products
- Discounts
- Orders
- Reports
- Auth

Cada módulo sigue el patrón Controller -> Service -> Repository

Diseño Compisition Root
``` typescript
const Repository = new ProductsRepository();
const Service = new ProductsService(Repository);
const Controller = new ProductsController(Service);

ProductsRouteV1.get('/', Controller.getAll);
ProductsRouteV1.get('/code/:code', Controller.getByCode);
ProductsRouteV1.get('/:id', Controller.getById);
ProductsRouteV1.post('/', RolesMiddleware('GESTOR'), Controller.create);
ProductsRouteV1.patch('/:id', RolesMiddleware('GESTOR'), Controller.update);
ProductsRouteV1.delete('/:id', RolesMiddleware('GESTOR'), Controller.delete);
```

# Variables de entorno
Las variables de entorno utilizadas cambian el acceso a la base de datos y el puerto utilizado por el proyecto para levantar su servicio.
```bash
#Database/shadow URL deben ser urlencoded (ojo con la contraseña)
DATABASE_URL="mysql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>"
SHADOW_DATABASE_URL="mysql://<SHADOW_DB_USER>:<SHADOW_DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<SHADOW_DB_NAME>"
DATABASE_USER="<DB_USER>"
DATABASE_PASSWORD="<DB_PASSWORD>"
DATABASE_NAME="<DB_NAME>"
DATABASE_HOST="<DB_HOST>"
DATABASE_PORT=<DB_PORT>
PORT=<PORT>
```

# Análisis del proyecto
Se ha utilizado técnicas de análisis de software para tener una mayor claridad del proyecto, a continuación, se muestran tres diagramas utilizados en este proyecto.
### Diagrama de Caso de Uso
![Caso de uso](docs/Diagrama%20Caso%20de%20Uso.drawio.png)

### Diagrama de Contect (DFD 0)
![Contexto](docs/Diagrama%20de%20Contexto%200.drawio.png)

### Diagrama ER
![Entidad Relacion](docs/Diagrama%20ER.drawio.png)

# Reglas del negocio

- Un producto puede tener **un solo descuento** ya sea activo o no.
- Los descuentos se aplican automáticamente.
- Los productos utilizan eliminación lógica para mantener la integridad de las ventas.
- El total de la venta se calcula en el backend.
- El método de pago es solamente efectivo.
- El descuento es solo por porcentaje.



## Instalación
1. Clonar el [Repositorio](https://github.com/smukideejeah/simple-selling-system-backend.git).
```bash
git clone https://github.com/smukideejeah/simple-selling-system-backend.git
```
2. Instalar dependencias  (clean install)
```bash
npm ci
```
3. Configurar variables de entorno copiando .env.example -> .env
```bash
cp .env.example .env
```


4. Ejecutar migraciones y preparar la base de datos
```bash
npm run db:m
npm run db:s
npm run db:g
```
5. Preparar Husky
```bash
npm run prepare
```
6. Iniciar el servidor
```bash
npm run watch
```
7. Generar Token de autenticación
   Antes de interactuar con el api, primero se necesita generar el token de acceso.

```
Usuario Administrador 
  - user: admin
  - pass: admin123

Usuario Vendedor
  - user: vendedor
  - pass: vendedor123

Las credenciales se pueden encontrar en el seed en: prisma > seed.ts
```

> Para generar el token debes utilizar la ruta `/v1/auth/`

Ejemplo de generación de token
```bash
curl --location 'http://localhost:4002/v1/auth' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJVc2VySWQiOiIxNGNhZTMyMC05MTU4LTRiZmMtYWQ1Ny00NDQyYTAzMTIwNWMiLCJSb2xlIjoiR0VTVE9SIiwiaWF0IjoxNzY3NjgyMDUwLCJleHAiOjE3Njc3Njg0NTB9.m2LPKrbK0kZfXgoH8j1whF3rGe3JKAL_DQNx4t1BNdE' \
--data '{
    "Username": "admin",
    "Password": "admin123"
}'
```

Respuesta Json:

```json
{
    "token": "eyJh...",
    "role": "GESTOR",
    "userId": "21d3..."
}
```

### Control de calidad y coherencia del estilo del código
Se utiliza *eslint* para analizar el código, esto asegura que el estilo del desarrollo sea consistente, se detecten errores de sintaxis y se cumplan con las buenas prácticas en typescript.

*Eslint* se configuró con *prettier* para asegurar una mayor calidad y coherencia del código, así que gracias a este control de calidad proporcionado por *eslint* y *prettier* se asegura que un equipo de trabajo pueda utilizar fácilmente este proyecto como punto de partida para sus aplicaciones.

- Comprobación de errores de tipado, sintaxis y estilo.

```bash
npm run lint
```
- Autocorrección de los errores de calidad (siempre verificar después de la ejecución)
```bash
npm run lint:fix
```
# Despliegue
Escribiendo `npm run build` creará un directorio llamado `build`, el cual podrá ser desplegado por PM2.
### Instalación de PM2
- Windows: `npm i -g pm2`
- Linux: `sudo npm i -g pm2`

Luego de la instalación de PM2 podremos desplegar el proyecto con este comando:
```bash
pm2 start build/index.js --name=sistemaVentas
```

### Configuración del Reverse Proxy con nginx
En caso de que tengas un VPS (google cloud, amazon web service, microsoft azure, etc.) o tu propio servidor linux con ipv4 pública podrás configurar el reverse proxy con ***nginx***, esto permitirá exponer el proyecto a internet mediante HTTPS a través de **reverse proxy** en nginx utilizando virtual host y certbot para obtener un certificado ssl válido.

```nginx
server {
  listen 80;
  listen [::]:80;
  listen 443 quic;
  listen 443 ssl;
  listen [::]:443 quic;
  listen [::]:443 ssl;
  http2 on;
  http3 off;
  ssl_certificate_key /root/to/ssl/api.example.com.key;
  ssl_certificate /root/to/ssl/api.example.com.crt;
  server_name api.example.com;
  root /root/to/project/;

  access_log /root/to/access.log main;
  error_log /root/to/error.log;

  #importante: Redirige una petición http a https
  if ($scheme != "https") {
    rewrite ^ https://$host$request_uri permanent;
  }

  location ~ /.well-known {
    auth_basic off;
    allow all;
  }

  include /etc/nginx/global_settings;

  index index.html;
  ############# la parte más importante ###################
  location / {
    proxy_pass http://127.0.0.1:3002/; #Se debe cambiar el puerto por el puerto elegido para el proyecto, eso se configura en .env
    proxy_http_version 1.1;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Server $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $host;
    proxy_set_header Upgrade $http_upgrade; # Config para soportar websocket
    proxy_set_header Connection "Upgrade"; # Config para soportar websocket
    proxy_pass_request_headers on;
    proxy_max_temp_file_size 0; #Configuración opcional
    proxy_connect_timeout 900; #Configuración opcional
    proxy_send_timeout 900; #Configuración opcional
    proxy_read_timeout 900; #Configuración opcional
    proxy_buffer_size 128k; #Configuración opcional
    proxy_buffers 4 256k; #Configuración opcional
    proxy_busy_buffers_size 256k; #Configuración opcional
    proxy_temp_file_write_size 256k; #Configuración opcional
  }
}


```
Puedes instalar Certbot con esta [guía paso a paso](https://certbot.eff.org/instructions?ws=nginx&os=pip) en equipos con linux y nginx para obtener un certificado SSL emitido por *Let's Encrypt*.

Ejemplo de uso: 
```bash
certbot --nginx
```
# Pruebas
El proyecto incluye:
- Pruebas unitarias para lógica del negocio.
- Pruebas de integración con autenticación y base de datos real.

Ejecutar pruebas
```bash
npm test
```
Las pruebas se deben ejecutar únicamente con una base de datos local de pruebas, porque reinicia la estructura cada vez que ejecuta las pruebas. 
**No uses base de datos de producción en pruebas, en serio**.
###### Estás advertido.

# Principales endpoints
- GET /products
- POST /products
- PATCH  /products/:id
- DELETE /products/:id

- POST /orders

- POST /orders
- GET /reports/top10Products

# Decisiones técnicas
- No se incuye Docker para mantener la simplicidad del entorno. Eres libre de implementarlo.
- El proyecto permite agregar Docker si así se requiere en producción.
- Se ha utilizado *Github Actions* para verificar automáticamente la calidad del código en cada pull request.

# Mejoras futuras
- Autenticación con Refresh Token
- Manejo de Stock de productos
- Descuentos genéricos
- Gestión de usuarios
- PostgreSQL como base de datos


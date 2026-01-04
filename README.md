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

### Diagrama de Caso de Uso
![Caso de uso](docs/Diagrama%20Caso%20de%20Uso.drawio.png)

### Diagrama de Contect (DFD 0)
![Contexto](docs/Diagrama%20de%20Contexto%200.drawio.png)

### Diagrama ER
![Entidad Relacion](docs/Diagrama%20ER.drawio.png)

### Reglas del negocio

- Un producto puede tener **un solo descuento** ya sea activo o no.
- Los descuentos se aplican automáticamente.
- Los productos utilizan eliminación lógica para mantener la integridad de las ventas.
- El total de la venta se calcula en el backend.
- El método de pago es solamente efectivo
- El descuento es solo por porcentaje

## Instalación
1. Clonar el [Repositorio](https://github.com/smukideejeah/simple-selling-system-backend.git)
2. Instalar dependencias 
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
#### Eslint
```bash
npm run lint
```
```bash
npm run lint:fix
```
### Compilación
Escribiendo `npm run build` creará un directorio llamado `build`, el cual podrá ser desplegado por PM2.
```bash
pm2 start build/index.js --name=sistemaVentas
```

# Pruebas
El proyecto incluye:
- Pruebas unitarias para lógica del negocio.
- Pruebas de integración con autenticación y base de datos real.

Ejecutar pruebas
```bash
npm test
```
**No uses base de datos en producción en pruebas**.
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

# Mejoras futuras
- Autenticación con Refresh Token
- Manejo de Stock de productos
- Descuentos genéricos
- Agregar usuarios
- PostgreSQL como base de datos

# Appointment Service - Serverless (NodeJS + Typescript)

Proyecto para el reto técnico: backend serverless para agendamiento de citas.

## Características
- NodeJS + Typescript
- Serverless Framework (crea API Gateway, Lambdas, DynamoDB, SNS, SQS, EventBridge)
- Arquitectura limpia (dominio, infraestructura, aplicaciones)
- Endpoints:
  - `POST /appointments` -> registra agendamiento (DynamoDB, estado `pending`) y publica a SNS con atributo `countryISO`.
  - `GET /appointments/{insuredId}` -> lista agendamientos por `insuredId`.
- Lambdas por país (`appointmentCountry`) consumen SQS (SQS_PE, SQS_CL), guardan en RDS y publican evento a EventBridge.
- EventBridge entrega confirmaciones a una SQS (CompletionQueue) que es consumida por `appointmentConfirmation` y actualiza DynamoDB a `completed`.

## Requisitos
- Node 18+
- NPM
- Serverless Framework (puedes usar localmente con `npx serverless`)
- AWS CLI configured (si vas a desplegar en AWS)
- Para pruebas locales: `serverless-dynamodb-local` y `serverless-offline` están incluidos en el proyecto.

## Instrucciones rápidas

1. Instalar dependencias:
```bash
npm install
```

2. Configurar credenciales AWS (si vas a desplegar):
```bash
aws configure
# o export AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY
```

3. Para pruebas locales (serverless offline):
```bash
# Inicia serverless (puerto 3000)
npx serverless offline


> Nota: SNS/SQS/EventBridge no se emulan automáticamente con `serverless-offline`. Para pruebas completamente locales se recomienda usar **LocalStack** (no incluido). Para pruebas unitarias el proyecto provee mocks.

4. Para desplegar en AWS:
```bash
# crea dist
npx tsc 
#desplegar en aws
npx serverless deploy --region us-east-2 
```

5. Después del deploy, obtén el `SNS Topic ARN` si lo necesitas y configura variables RDS en el entorno (o usa secretos). El archivo `serverless.yml` crea todos los recursos necesarios.

## Swagger
# puerto 3000
http://localhost:3000/swagger

## Archivos importantes
- `serverless.yml` - define infra y funciones
- `src/` - código fuente (domain, application, infrastructure, lambdas)
- `tests/` - pruebas unitarias (Jest)
- `swagger.yml` - OpenAPI (plantilla)

6.

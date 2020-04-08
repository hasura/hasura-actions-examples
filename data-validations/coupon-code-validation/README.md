Example Query Action to check and validate coupon code.

## Start Hasura and Postgres

```
docker-compose up -d
```

## Apply Migrations

```
cd hasura
hasura migrate apply
hasura metadata apply
```

## Run Express Function

```
cd functions/nodejs-express
npm install
npm start
```

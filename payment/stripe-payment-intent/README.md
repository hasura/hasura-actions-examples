Example Action to create a Payment API with Stripe and Hasura Actions

[Link to Youtube Demo](https://www.youtube.com/watch?v=NEZ5ceGt_PM)

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

Example Action to check and validate product inventory before inserting into the database. Also decrements the inventory post successful validation.

[Link to Youtube Demo](https://www.youtube.com/watch?v=4KO6s4wqico)

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

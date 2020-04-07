Example Action to generate a JWT token, create a user and insert into the database

[Link to Youtube Demo](https://www.youtube.com/watch?v=oqbxEp4FIjE)

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

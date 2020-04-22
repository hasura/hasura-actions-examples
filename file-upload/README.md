Example Action to perform file uploads using GraphQL. The handler accepts a base64 encoded version of the file.

[Link to Youtube Demo](https://www.youtube.com/watch?v=mipb4N6ZzfM)

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
mkdir -p public/files
npm install
npm start
```

## Run React App

```
cd react-app
npm install
npm start
```
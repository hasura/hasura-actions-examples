Example Action to perform image manipulation using Next.js API Routes and Jimp module

[Link to Youtube Demo](https://www.youtube.com/watch?v=WECxgivnwio)

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
cd functions/nextjs-api-routes
npm install
npm start
```

## Run React App

```
cd react-app
npm install
npm start
```
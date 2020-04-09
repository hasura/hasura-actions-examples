Example Action to send email using GraphQL. The handler accepts an email input and uses Sendgrid's SMTP API to send an email.

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

## Run React App

```
cd react-app
npm install
npm start
```
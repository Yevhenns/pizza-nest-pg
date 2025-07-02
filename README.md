## Description

Nostra Pizza backend built with NestJS and PostgreSQL for managing products, categories, users, and orders.

You can find the database schema [here](https://dbdiagram.io/d/Nostra-pizza-68579d28f039ec6d364ca6e8).

To get a Google token for Google authentication, use this [tool](https://get-google-token.vercel.app/), a simple app developed by me.

## Project setup

```bash
$ npm install
```

## Environment variables

Copy .env.example to .env and fill in the required values:

```bash
$ cp .env.example .env
```

## Database setup

Before running the app, create the PostgreSQL database manually. You can do this via psql or any database client.

Then run:

```sql
CREATE DATABASE your_database_name;
```

## Run seed

```bash
$ npm run seed
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Description

Nostra Pizza backend built with NestJS and PostgreSQL for managing products, categories, users, and orders.

You can find the database schema [here](https://dbdiagram.io/d/Nostra-pizza-68579d28f039ec6d364ca6e8).

## Project setup

```bash
$ npm install
```

## Environment variables

Copy .env.example to .env and fill in the required values:

```bash
$ cp .env.example .env
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

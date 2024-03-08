## Description

Backend system that simulates the vast and intriguing Star Wars universe.

## Prerequisites

- Have `node v20` installed
- Have `docker-compose` installed
- Have `direnv` installed
- Create an `.envrc` file at the root of the project.

## Installation

```bash
$ npm install
```

## Running the app

```bash
$ direnv allow

$ docker-compose up postgres

# development
$ npm run start

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Testing usign REST Client

Make use of the [starwars.http](./starwars.http) file, it has examples of endpoint calls.

## Author

[Franco di Napoli](https://github.com/FrancoAdN)

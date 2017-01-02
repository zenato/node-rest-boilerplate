REST API boilerplate on Node technology.

## Usage
- [x] Express
- [x] Nodemon
- [x] Mongoose
- [x] Passport
- [x] Babel
- [x] ESLint
- [x] Gulp

## Getting Started

### Prepare
- Prepare for the [mongodb](https://mlab.com).

### Create configuration
Copy `.env.example` to `.env`.

- .env
```
PORT = 4000
SECRET = abcd1234

DB_URI = mongodb://id:password@your.host.com:port/dbname
DB_POOL_SIZE = 4
```

### Run and debug
`npm run dev`

Run app for develoment and debugging.

`npm run dist`

Build production app on `build` directory.

`npm run start`

Run built app.


### Demo

https://node-api-boilerplate.herokuapp.com

Use with REST API client.
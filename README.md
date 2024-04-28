# Nawishta Library app

This is the UI for the nawishta library app. It works with the inshapardaz apis

[![Build And Deploy](https://github.com/inshapardaz/library-ui/actions/workflows/main.yml/badge.svg)](https://github.com/inshapardaz/library-ui/actions/workflows/main.yml)


## Development

Install packages:

```sh
npm install
```

Run for development

```sh
npm run start
```

## Building for production

```sh
npm run build
```

## Building and running docker

### Building image

```sh
docker build -t inshapardaz/library-editor .
```

### Running image

```sh
docker run -p 80:80 inshapardaz/library-editor
```



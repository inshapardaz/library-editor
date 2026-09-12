# Nawishta Library app

This is the UI for the nawishta library app. It works with the inshapardaz apis

[![Build & Deploy](https://github.com/inshapardaz/library-editor/actions/workflows/docker-image.yml/badge.svg)](https://github.com/inshapardaz/library-editor/actions/workflows/docker-image.yml)

Build, image push, and production deploy (gated behind manual approval) all run as part of this workflow.


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



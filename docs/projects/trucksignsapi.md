---
title: Truck Signs Api
pagination_prev: projects/babytools
pagination_next: null
sidebar_position: 8
---

# Truck Signs Api

The goal of this project is to containerize the Truck Signs Api.

## Table of content

1. [Prerequisites](#prerequisites)
2. [Quickstart](#quickstart)
3. [Usage](#usage)

### Prerequisites

- Git
- Docker

### Quickstart

- Clone the project

```bash
git clone https://github.com/reiloe/truck_signs_api.git
```

- Change into the project folder

```bash
cd truck_signs_api
```

- Copy and rename [example.env file](example.env) to .env

```bash
cp example.env .env
```

:::caution
The values in the example.env file are for testing purposes only.
You should change the values, especially keys and passwords.
:::

- Build the truck signs image

```bash
docker build --tag "truck-api" .
```

- Create a docker network

```bash
docker network create truck-api-net
```

- Run a postgres database docker container

```bash
docker volume create pgdata
docker run -d 
  --name postgres 
  --network truck-api-net 
  -p 5432:5432 
  -e POSTGRES_USER=API 
  -e POSTGRES_PASSWORD=s3cr3t 
  -v pgdata:/var/lib/postgresql/data 
  postgres:alpine3.22
```

- Run a truck signs container

```bash
docker run -d --name truck-api --network truck-api-net  -p 8020:8000 --env-file .env  truck-api
```

After a short time you can browse to the app by typing in the address localhost:8020 in your browser.

## Usage

If you want to make changes, such as the username or password for the admin user of the Django panel, you can do so in the **.env file**.  

Per Default the api is running for docker environment. If you want to use the api for **development** or **production** you have to adapt the .env file. You have to change the **DJANGO_ENV** variable to the environment you want.

- for dev

```text
# .env-file

DJANGO_ENV=dev
```

- for production

```text
# .env-file

DJANGO_ENV=production
```

:::tip  
The settings for docker environment start with DOCKER.  
The settings for production start with PROD.  
The settings for dev environment don't have any prefix.
:::

If you want to overwrite settings you can do so by add the setting to the docker run command. Ex.:

```bash
docker run -d --name truck-api --network truck-api-net  -p 8020:8000 -e POSTGRES_HOST other-db-host ....
```

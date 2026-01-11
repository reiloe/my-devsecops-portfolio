---
title: Conduit
pagination_prev: projects/juiceshop
pagination_next: projects/conduit-cicd
sidebar_position: 5
---

# Conduit

The goal of this project is to containerize the Conduit application, consisting of an Angular frontend and a Django backend.

## Table of content

1. [Prerequisites](#prerequisites)
2. [Quickstart](#quickstart)
3. [Usage](#usage)
4. [Hints](#hints)

### Prerequisites

- Git
- Docker
- Docker Compose v2

### Quickstart

- Open a terminal

- Navigate to a folder of choice

```bash
cd my/test/folder
```

- Clone the project

```bash
git clone https://github.com/reiloe/conduit.git
```

- Change into the project folder

```bash
cd conduit
```

- Pull the submodules

```bash
git submodule update --init --recursive
```

- Copy and rename [example.env file](example.env) to .env

```bash
cp example.env .env
```

:::caution
The values in the example.env file are for testing purposes only.
You should change the values, especially keys and passwords.
:::

- Run the project

```bash
docker compose up -d
```

After a short time you can browse to the app by typing in the address localhost:8282 in your browser.

## Usage

If you want to make changes, such as the username or password for the admin user of the Django panel, you can do so in the .env file.
There you will also find the port settings for the frontend/backend, in case you need to change them because the default ports (8282 and 8000) are already in use on your computer.  

To make changes work:

- Shut down the app

```bash
docker compose down
```

- Make changes in the .env file and restart the app [^1]

```bash
docker compose up -d --build
```

If you want to perform a complete reinstallation from scratch, run the following command[^2] and then follow the steps in[Quickstart](#quickstart).

```bash
docker compose down -v --remove-orphans
```

### Hints

If you want you can set (temporarly) set an environment variable (eg. the username of the admin panel) by adding this variable to the command

```bash
DJANGO_SU_NAME=John docker compose up
```

[^1]: This command recreates the images and container before launching the app.
[^2]: This command closes the app and deletes all images, volumes, and networks associated with the app.

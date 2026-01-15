# DevSecOps Portfolio

## Description

This repository hosts the source code for my personal DevSecOps portfolio website. Built using [Docusaurus](https://docusaurus.io/), it is designed to be a fast, secure, and easy-to-maintain static site.

**Key Contents:**

* **Portfolio:** A showcase of my technical projects and achievements.
* **Skills:** An overview of my tech stack and competencies.
* **Knowledge Base:** Documentation and articles related to DevOps, Security, and Cloud Engineering.

**Purpose:**
The primary purpose of this repository is to serve as a central hub for my professional identity and knowledge sharing, while demonstrating modern web development and CI/CD practices.

## Table of Contents

* [Description](#description)
* [Quickstart](#quickstart)
  * [Requirements](#requirements)
  * [How to Start](#how-to-start)
* [Usage & Configuration](#usage--configuration)
  * [Configuration](#configuration)
  * [Customizing Content](#customizing-content)
* [Building the Project](#building-the-project)
* [Deployment](#deployment)
  * [General Deployment (e.g., NGINX)](#general-deployment-eg-nginx)
  * [GitHub Pages](#github-pages)
  * [Docker](#docker)

## Quickstart

### Requirements

Before you begin, ensure you have the following installed:

* **Node.js** (version 20 or higher)
* **pnpm** (recommended package manager) — Install via `npm i -g pnpm@latest`

### How to Start

Follow these steps to get the project running locally:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/reiloe/my-devsecops-portfolio.git
    cd my-devsecops-portfolio
    ```

2. **Install dependencies:**

    ```bash
    pnpm install
    ```

3. **Start the local development server:**

    ```bash
    pnpm start
    ```

    The website will open automatically at `http://localhost:3000`. Changes to the code will trigger a live reload.

## Usage & Configuration

This section explains how to configure the site and modify it to suit your needs.

### Configuration

The core configuration lies in **`docusaurus.config.ts`**. Here you can modify:

* **Site Metadata:** Title, tagline, URL, and favicon.
* **Theme Config:** Navbar links, footer content, and color mode preferences.
* **Plugins/Presets:** Configuration for docs, blog, and SEO.

**Environment & Project Configuration:**
Project and deployment settings are managed via the files `portfolio.config` (personal/legal info), `pages.config` (deployment-specific settings), and optionally `.env` (for local or Docker use). Adjust these files before starting or deploying the project.

**Important:** Changes to `portfolio.config`, `pages.config`, or `.env` only take effect after restarting the Docusaurus server or after redeployment (e.g., on GitHub Pages).

For Docker, copy `example.env` to `.env` and adjust the values as needed before building the container.

### Customizing Content

To achieve different results or update the portfolio:

* **Projects:** Edit `src/components/projects/data.ts`. This file exports an array of project objects. Modifying entries here will instantly update the Projects section. Place project images in `static/img/projects/`.
* **Skills:** Edit `src/components/skills/data.ts` to add or remove skills displayed on the homepage.
* **Documentation:** Add Markdown (`.md`) or MDX (`.mdx`) files to the `docs/` directory. The sidebar structure is generated automatically or can be controlled via `sidebars.ts`.
* **Styling:** Global CSS variables (colors, fonts) are defined in `src/css/custom.css`. Modify these to change the visual theme.

## Building the Project

To create a production-ready build of the website:

```bash
pnpm build
```

This command generates static files in the `build/` directory. These files can be served by any static site hosting service.

## Deployment

### General Deployment (e.g., NGINX)

Since Docusaurus generates a static site, you can deploy the contents of the `build/` directory to any web server.

**Example NGINX Configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/my-portfolio/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Simply copy the `build/` folder to your server's web root.

### GitHub Pages

This repository is configured for automated deployment to GitHub Pages via GitHub Actions.

**Workflow:**
The deployment workflow is defined in `.github/workflows/deploy.yml`. It triggers on pushes to the `main` branch.

1. **Push changes:**
    Simply push your changes to the configured branch.

    ```bash
    git push origin main
    ```

2. **Automatic Build & Deploy:**
    GitHub Actions will:
    * Install dependencies.
    * Build the static site (setting `BASE_URL` to `/my-devsecops-portfolio/`).
    * Upload the artifact.
    * Deploy to the `gh-pages` environment.

3. **View the Site:**
    Once the action completes, the site is available at:
    `https://<gh-username>.github.io/my-devsecops-portfolio/`

### Docker

You can also run the portfolio locally using Docker to simulate a production-like environment.

**Build and start with Docker Compose:**

    ```bash
    docker compose up --build
    ```

    This will start the container on port 3000 (or the port defined in your `.env`).

    > **Note:** By default, the `BASE_URL` in the Docker build is set to `/` via `docker-compose.yml` for local viewing.

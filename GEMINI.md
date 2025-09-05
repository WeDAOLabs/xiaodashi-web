# GEMINI Project Context: xiaodashi-web

This document provides context for the `xiaodashi-web` project, a full-stack web application.

## Project Overview

`xiaodashi-web` is a modern, full-stack web application built with a monorepo architecture using npm workspaces. It consists of a Next.js frontend, a NestJS backend, and a shared library for common code.

- **Frontend:** A Next.js application for the user interface.
- **Backend:** A NestJS application for the API and business logic.
- **Shared:** A TypeScript library for shared types and utility functions.

The project is well-documented, with detailed information on architecture, API design, and development practices available in the `/docs` directory.

## Building and Running

The project uses `npm` workspaces for managing the monorepo. All commands should be run from the root of the project.

### Installation

To install all dependencies for the project, run the following command from the root directory:

```bash
npm install
```

### Development

To run the frontend and backend development servers, use the following commands:

- **Frontend:** `npm run dev:frontend`
- **Backend:** `npm run dev:backend`

### Building

To build the frontend, backend, and shared library for production, use the following commands:

- **Frontend:** `npm run build:frontend`
- **Backend:** `npm run build:backend`
- **Shared:** `npm run build:shared`

## Development Conventions

The project has a set of development conventions that should be followed.

For more detailed information on development conventions, please refer to the documents in the `/docs` directory.

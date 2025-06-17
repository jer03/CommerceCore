# Microservices Ecommerce Platform

A full-featured backend ecommerce platform built using **Node.js**, **Express**, **PostgreSQL**, and **Docker**, following a **microservices architecture**. This project demonstrates scalable service design with isolated databases, JWT authentication, order/payment handling, and inter-service communication.

## Architecture Overview

- **Auth Service** — Handles user registration, login, and JWT issuance.
- **Product Service** — Manages product creation and listing.
- **Order Service** — Creates orders and interacts with Payment service.
- **Payment Service** — Handles simulated payments and updates order status.
- **PostgreSQL** — Each service has its own isolated database.
- **Docker Compose** — Used for orchestration and isolated service containers.
- **API Gateway** — Routes traffic to appropriate microservices.

Each service is containerized and communicates via REST APIs (or can be extended with message queues for production use).

---

## Features

- JWT-based user authentication
- Product creation and retrieval
- Order placement and status tracking
- Simulated payments
- Dockerized services for easy orchestration
- Configurable via `.env` files
- Ready for testing via Postman or curl

---


Each service contains:
- `index.js` or `server.js` entry point
- `db.js` for database connection
- REST API endpoints
- Auth logic (where applicable)

---

## Getting Started (Docker)

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Run All Services

```bash
docker-compose up --build

# Pokédex API & Web Application

## Overview

The Pokédex is a full-stack web application built using Node.js and Express that allows users to manage Pokémon data through a complete CRUD (Create, Read, Update, Delete) interface. The application integrates with a PostgreSQL database and supports dynamic data handling, making it suitable for both learning and production-grade backend practices.

Live Application:  
https://pokedex-u8yf.onrender.com/

---

## Features

- Create new Pokémon entries with detailed attributes
- Retrieve and display a list of all Pokémon
- View individual Pokémon details
- Update existing Pokémon records
- Delete Pokémon entries
- Prevent duplicate Pokémon insertion
- Dynamic rendering using server-side templates (EJS)

---

## Tech Stack

**Backend**

- Node.js
- Express.js

**Database**

- PostgreSQL

**Frontend**

- EJS (Embedded JavaScript Templates)
- HTML, CSS

**Deployment**

- Render

---

## Architecture

The application follows a structured architecture:

- **Routes**: Handle HTTP requests and endpoints
- **Controllers**: Contain business logic
- **Database Layer**: Executes SQL queries using PostgreSQL
- **Views**: Render dynamic UI using EJS templates

---

## API Endpoints

### Base URL

[Pokedex](https://pokedex-u8yf.onrender.com/)

### Pokémon Routes

| Method | Endpoint     | Description                 |
| ------ | ------------ | --------------------------- |
| GET    | /pokemon     | Retrieve all Pokémon        |
| GET    | /pokemon/:id | Retrieve a specific Pokémon |
| POST   | /pokemon     | Create a new Pokémon        |
| PUT    | /pokemon/:id | Update an existing Pokémon  |
| DELETE | /pokemon/:id | Delete a Pokémon            |

---

## Data Model

A typical Pokémon object includes:

- `name`
- `pokedex_number`
- `type` (array)
- `height`
- `weight`
- `base_experience`
- `hp`, `attack`, `defense`, `special_attack`, `special_defense`, `speed`
- `generation`
- `is_legendary`
- `sprite_url`

---

## Environment Variables

Create a `.env` file and configure:
DEVELOPMENT_DATABASE_CONNECTION=<URL>
PRODUCTION_DATABASE_CONNECTION=<URL>

---

## Installation and Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/pokedex.git
cd pokedex
```

### 2. Install dependencies

```
npm install
```

### 3. Configure environment variables

Create a `.env` file and add:
DEVELOPMENT_DATABASE_CONNECTION=<URL>
PRODUCTION_DATABASE_CONNECTION=<URL>

### 4. Run the application

npm start
Application will run on: `http://localhost:3030`

---

## Deployment

The application is deployed using a cloud-based architecture:

### Backend Service

- Hosted on Render
- Automatic deployment via GitHub integration
- Build command: `npm install`
- Start command: `node app.js`

### Database

- Hosted on Neon (serverless PostgreSQL)
- Connected securely using environment variables

### Configuration

- Environment variables managed via Render dashboard
- `DATABASE_URL` used for database connection

### Architecture Overview

Client → Render (Express Backend) → Neon (PostgreSQL Database)

---

## Error Handling

- Duplicate Pokémon entries are handled gracefully
- Server-side validation ensures data integrity
- User-friendly error responses

---

## Contributing

Contributions are welcome. Fork the repository and submit a pull request with clear changes.

---

## License

This project is licensed under the MIT License.

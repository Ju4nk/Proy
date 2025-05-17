# Tasklist Full-Stack Application

This repository contains a full‑stack application featuring a backend built with NestJS & TypeORM and a frontend developed with [your chosen framework, e.g., Vue.js or React]. The project is structured into two main parts:

- **backend/**: Contains the NestJS API, database configuration, entities, and migrations.
- **frontend/**: Contains the client-side application.

## Features

- **User Authentication** using JWT.
- **Notes Management**: Create, edit, delete, and archive notes.
- **Tag System**: Create and filter notes by tags.
- **Database Migrations** to manage schema changes.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/)
- PostgreSQL database
- On Windows, you can use Git Bash or WSL for running the Bash script.

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/tasklist-fullstack.git
   cd tasklist-fullstack
2. Configure Environment Variable
- In the backend/ folder, create a .env file. You can use the provided .env.example as a template:
	cd backend
	cp .env.example .env
# Then, edit the .env file to set your DB connection and other variables.

3 Run the Application
- The project provides a Bash script run.sh to automate the setup and launch of both backend and frontend. From the root of the repository, run:
./run.sh
- The script will:
- Install dependencies for both backend and frontend.
- Check or create the .env file for the backend.
- Build the backend and run its database migrations.
- Start the backend (in development mode) and the frontend concurrently.
- Note: The script uses ts-node with tsconfig-paths to run migrations. Make sure you have these packages installed in the backend's node_modules.

Project Structure

Tasklist/
├── backend/
│   ├── src/
│   │   ├── notes/
│   │   │   └── note.entity.ts
│   │   ├── users/
│   │   │   └── user.entity.ts
│   │   ├── migrations/
│   │   │   └── <your migration files>
│   │   └── data-source.ts   # DataSource configuration for TypeORM
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   └── ...              # Frontend source code
│   ├── package.json
│   └── ... 
├── run.sh                 # Bash script to run the project
└── README.md              # Project documentation


CommandsBackend- Build backend: npm run build
- Run backend in development mode: npm run start:dev
- Run migrations:
The script uses:
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run --dataSource ./src/data-source.ts
If you prefer to run migrations manually, execute the above command in the root of the backend directory.
Frontend- Run frontend in development mode: npm run dev
Troubleshooting- Ensure that you have set the correct environment variables in the backend .env file.
- For Windows users, if you have trouble running the run.sh script, use Git Bash or WSL.
- If you modify the data source or paths, update the command used in the script accordingly.
LicenseMIT


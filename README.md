
# Analytics Dahboard with React, Node.js, and PostgreSQL

## Setup Instructions

### Prerequisites

1. Ensure you have the following installed:
   - [Docker](https://www.docker.com/)
   - [Docker Compose](https://docs.docker.com/compose/)

2. Clone the repository:

   ```bash
   git clone https://github.com/Duplad97/analytics-dashboard.git
   cd analytics-dashboard
   ```

---

### Environment Configuration

1. **Backend Environment**: Create a `.env` file in the `backend` directory with the following:

   ```env
   DATABASE_URL=postgresql://admin:admin@postgres_container:5432/analytics_dashboard
   ```

2. **Frontend Environment**: Create a `.env` file in the `frontend` directory with the following:

   ```env
   REACT_APP_API_URL=http://localhost:8000
   ```

---

### Development Setup

1. Build and start the Docker containers:

   ```bash
   docker-compose up --build
   ```

2. Access the application:
   - **Frontend**: [http://localhost:80](http://localhost:80)
   - **Backend**: [http://localhost:8000](http://localhost:8000)

3. Database is exposed on port `5433` for local tools.

---

### Running Prisma Migrations

1. Access the backend container:

   ```bash
   docker exec -it backend_1 sh
   ```

2. Run Prisma migrations:

   ```bash
   npx prisma migrate dev
   ```

---

### Seeding the Database

1. Use the provided seed script:

   ```bash
   npx prisma db seed
   ```


---

### Tech Stack

- **Frontend**: React + MUI X
- **Backend**: Node.js + Express + Prisma
- **Database**: PostgreSQL
- **Containerization**: Docker

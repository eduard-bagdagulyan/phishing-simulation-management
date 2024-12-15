# Phishing Simulation App

## Setup Instructions

### 1. Create the .env File
   1. Copy the Example Environment File:
   Navigate to the project root directory and run the following command to copy the .env.example to .env:
```bash
cp .env.example .env
```

### 2. Run the Application with Docker Compose
   Build and Start All Services:
   From the project root directory, execute the following command to build the Docker images and start all containers:

```bash
docker-compose up --build
```

#### Verify the Services are Running:
Check the status of the running containers with:

```bash
docker-compose ps
```
You should see all services (frontend, phishing_simulation, attempts_management, and mongo) listed as up and running.
### 3. Accessing the Application
   Once all services are up and running, you can access the application through your web browser:

   Frontend: [http://localhost:3000](http://localhost:3000)
### 4. Stopping the Application
   To stop and remove all running containers, execute:

```bash
docker-compose down
```
**Optional:** To also remove the associated volumes (e.g., MongoDB data), use:

```bash
docker-compose down --volumes
```

### Notes
1. Ethereal Email: This setup uses Ethereal Email for testing SMTP configurations. Emails sent through Ethereal are not delivered to real inboxes but can be viewed via the Ethereal dashboard.

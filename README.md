# locofy-cm

This project is a Figma component inspector. It allows you to upload a Figma file, view its components and instances as an image, and see their properties and positions.

## Features

- Parse Figma files via the Figma API.
- Display a visual preview of the Figma file.
- Overlay markers for each component/instance on the preview image.
- Select elements from a list to highlight them on the image.
- Select markers on the image to highlight them in the list.

## Tech Stack

- **Backend**: Python, FastAPI
- **Frontend**: React, TypeScript, Vite
- **Database**: MongoDB
- **Containerization**: Docker, Docker Compose

## Setup

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose are installed on your system.
- You have a [Figma Personal Access Token](https://www.figma.com/developers/api#personal-access-tokens).

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd locofy-cm
   ```

2. **Environment Variables:**
   The frontend service in `docker-compose.yml` uses an environment file at `frontend/.env`. While the current application doesn't seem to use any frontend-specific environment variables from this file, you can create it if needed for future development.

3. **Run the application:**
   Start the entire application stack using Docker Compose:
   ```bash
   docker-compose up --build
   ```
   This command will build the Docker images for the frontend, backend, and database services and start them.

   - The frontend will be available at [http://localhost:3006](http://localhost:3006).
   - The backend API will be available at [http://localhost:8000](http://localhost:8000).
   - The MongoDB database will be running on port `27017`.

## Usage

1. **Open the application:**
   Navigate to [http://localhost:3006](http://localhost:3006) in your web browser.

2. **Upload a Figma File:**
   - In the "Upload New Figma File" section on the left sidebar, you will see two input fields.
   - **Figma URL**: Paste the URL of the Figma file you want to inspect.
   - **Figma Token**: Paste your Figma Personal Access Token.
   - Click the "Parse & Upload" button.

3. **Inspect Components:**
   - Once the file is parsed and the preview image is generated (which may take a few moments), the file will appear in the "Uploaded Files" list.
   - Click on a file in the list to select it.
   - The main view will show the preview image of your Figma file with markers overlaid on top of the components and instances.
   - The right-hand sidebar will show a list of all the extracted elements.

4. **Interactive Highlighting:**
   - **Hover**: Hovering your mouse over an element in the list or a marker on the image will highlight it.
   - **Click**: Clicking on an element in the list or a marker on the image will "select" it, keeping it highlighted until you click it again or select another element.

## Deployment to AWS (High-Level Guide)

Deploying this application to AWS requires several steps. Here is a high-level guide on how you could approach it using Amazon Elastic Container Service (ECS) with Fargate.

### 1. Build and Push Docker Images

Before you can deploy to ECS, you need to build your Docker images and push them to a container registry. AWS Elastic Container Registry (ECR) is a good choice.

1.  **Create ECR Repositories:**
    For each service (`frontend`, `api`, `mongodb`), create a private ECR repository in the AWS console.

2.  **Authenticate Docker with ECR:**
    Follow the instructions in the ECR console to get the login command for your Docker client.

3.  **Build and Tag Images:**
    From your project root, build the images and tag them with the ECR repository URI.
    ```bash
    # For the API
    docker build -t <your-ecr-repo-uri>/api:latest -f api/Dockerfile ./api

    # For the Frontend
    docker build -t <your-ecr-repo-uri>/frontend:latest -f frontend/Dockerfile ./frontend
    
    # For MongoDB
    docker build -t <your-ecr-repo-uri>/mongodb:latest -f mongodb/Dockerfile ./mongodb
    ```

4.  **Push Images to ECR:**
    ```bash
    docker push <your-ecr-repo-uri>/api:latest
    docker push <your-ecr-repo-uri>/frontend:latest
    docker push <your-ecr-repo-uri>/mongodb:latest
    ```

### 2. Set up the Infrastructure on AWS

This involves setting up the networking, database, and container orchestration services.

1.  **VPC and Networking:**
    -   Create a VPC (Virtual Private Cloud) with public and private subnets.
    -   Your services will run in the private subnets, and the load balancer will be in the public subnets.

2.  **Database:**
    -   **Option A (Managed Service - Recommended for Production):** Set up an [Amazon DocumentDB](https://aws.amazon.com/documentdb/) cluster. It's compatible with MongoDB. You will need to update the `MONGO_URI` environment variable in your backend task definition to point to your DocumentDB cluster.
    -   **Option B (Container on ECS):** You can run the MongoDB container from your ECR repository as a task on ECS. This is simpler for development/testing but requires you to manage persistence and backups.

3.  **ECS Cluster:**
    -   Create an ECS cluster using the "Networking only" (Fargate) template.

4.  **Task Definitions:**
    -   Create a separate ECS Task Definition for each service (`api`, `frontend`, `mongodb`).
    -   In each task definition:
        -   Select the Fargate launch type.
        -   Specify the CPU and memory requirements.
        -   Point to the correct ECR image URI for the container.
        -   Define port mappings.
        -   For the `api` task, set the `MONGO_URI` environment variable.

5.  **ECS Services:**
    -   Create ECS services for your `api` and `frontend` tasks. The service will ensure that your tasks are running and will handle tasks restarting if they fail.
    -   You can run the `mongodb` task as a standalone task or as a service with a desired count of 1.

### 3. Configure Load Balancing

1.  **Create an Application Load Balancer (ALB):**
    -   The ALB will be the single entry point for your application.
    -   Create a target group for the `frontend` service and another for the `api` service.

2.  **Configure Listeners and Rules:**
    -   Create a listener for HTTP (port 80) or HTTPS (port 443).
    -   Configure rules to route traffic to the target groups:
        -   A default rule that forwards traffic to the `frontend` target group.
        -   A path-based rule that forwards traffic with a path of `/api/*` to the `api` target group.

### 4. Update Frontend API URL

When deploying to AWS, the frontend needs to know the URL of the backend. In a production environment, you should not hardcode `http://localhost:8000`.

-   The `API_BASE_URL` in `frontend/src/api.ts` should be changed to a relative path like `/api/v1`. This way, the requests will go to the same domain as the frontend, and the ALB will route them correctly to the backend service.
-   Alternatively, you can use an environment variable to set the API URL at build time.

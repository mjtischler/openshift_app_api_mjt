# openshift_app_api_mjt

This is a sample Node/Socket.io app used for creating Docker containers and deploying them with OpenShift, and is a companion socket app to [openshift_app_mjt](https://github.com/mjtischler/openshift_app_mjt).

## Installation

You need both [Node 10+](https://nodejs.org/en/download/) and [Docker 19+](https://docs.docker.com/install/) installed on your machine to run this locally. Run `npm install` from the `/server` directory, then from the root directory:

```bash
# Runs a local development server and watches for changes
npm run dev

# or

# Builds the server in production mode and starts a production instance
npm start
```

## Authorization

Access controls are stored in [/server/src/auth.js](https://github.com/mjtischler/openshift_app_api_mjt/blob/develop/src/auth.js), and they will need to be defined before running the app or creating a Docker image.

**NOTE**: This is a poor way of handling authorization and should only be used for testing/learning.

Alternatively, you can create a parallel repo and store this auth data in `process.env` by defining each key in the Dockerfile or as secrets (see *Environmental Variables* below). Again, these are to be used only for testing. For easier management, you can add [dotenv](https://github.com/motdotla/dotenv#readme) to project.

## Environmental Variables

```
NODE_ENV                # Defaults to production
COMPONENT_BACKEND_HOST  # The host machine's IP address. *Optional, defaults to null*
COMPONENT_BACKEND_PORT  # The host machine's IP address. *Required, defaults to 8081*
SOCKET_TOKEN_SECRET     # The string used to validate the socket connection from the client
```

## Docker Commands

```bash
# Build the Docker image
docker build -t ${your_name}/openshift_api_mjt .

# View List of Docker Images
docker images

# View list of Docker networks
docker network ls

# Run Docker Image (--network allows communication between images on the same host)
docker run --network=bridge --name=api -it -d -p 8081:8081 -d ${your_name}/openshift_api_mjt

# View Recent Docker Statuses
docker ps -a

# Get IP addresses of all images on the network bridge. Useful for local deploys.
docker network inspect bridge # Look for the `Containers` object

# Start Bash Terminal in Docker Instance
docker run -it --entrypoint /bin/bash ${your_name}/openshift_api_mjt -s

# Clean up images
docker system prune # WARNING: Append with -a to delete all non-running images

# Tag an image and push it to your Docker repo
# NOTE: Required before deploying to OpenShift
docker tag ${your_name}/openshift_api_mjt:${tag} ${your_docker_repo}:${tag}
docker push ${your_docker_repo}/openshift_api_mjt:${tag}
```

When deploying to OpenShift, your Docker Hub url will be formed as:

`docker.io/${your_docker_hub}/openshift_api_mjt:${tag}`
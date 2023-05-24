# HandsOff-Web

## Dockerfile Manual

### Introduction
This Dockerfile sets up a Python 3.11 environment for running an application. It copies the application code into the container, installs the required dependencies, and configures the container to run the application      with customizable parameters.

### Base Image
The base image used in this Dockerfile is `python:3.11`. This ensures that the container has Python 3.11 installed as the runtime environment.

### Environment Variables
The Dockerfile defines several environment variables that can be customized during container runtime:

- `MAIN_PATH`: Specifies the main path for the application. The default value is set to `/HandsOff`. You can override this value by setting the `MAIN_PATH` environment variable when running the container.

- `WEB_PORT`: Sets the web server port number. The default value is `8000`. You can change this value by setting the `WEB_PORT` environment variable during container runtime.

- `SERVER_IP`: Defines the IP address the server should bind to. The default value is `"0.0.0.0"`, which means the server will bind to all available network interfaces. You can modify this value by setting the 
`SERVER_IP` environment variable.

- `SERVER_PORT`: Specifies the server port number. The default value is `55400`. You can customize this value by setting the `SERVER_PORT` environment variable during container runtime.

### Volume
The Dockerfile defines a volume at `/app/static`. Volumes are used for persisting data between container instances. By using this volume, you can map a directory on the host machine to the `/app/static` directory 
within the container. Any data written to this directory will be saved outside the container and preserved between container runs.

### Exposing Ports
The Dockerfile exposes the ports specified by the `WEB_PORT` and `SERVER_PORT` environment variables. This allows inbound connections to the container on these ports.

### Container Execution
The final command specified in the Dockerfile is the entry point for the container. It uses the `CMD` instruction to define the command to be executed when the container starts. The command is set to `["python", 
"main.py", "$WEB_PORT", "$SERVER_PORT", "$MAIN_PATH", "$SERVER_IP"]`. This runs the `main.py` script with the provided parameters. The environment variables are used to pass the customizable values into the 
application.

### Building the Image
To build the Docker image using this Dockerfile, run the following command in the directory where

the Dockerfile and application code are located:
```
docker build -t your_image_name:tag .
```
Replace `your_image_name` with the desired name for your image and `tag` with a version or tag name.

### Running the Container
To run a container based on the built image, use the following command:
```
docker run -p host_port:container_port -e MAIN_PATH=/custom_path -e WEB_PORT=custom_web_port -e SERVER_IP=custom_server_ip -e SERVER_PORT=custom_server_port -v /host/path:/app/static your_image_name:tag
```
- Replace `host_port` with the desired port number on the host machine that will be mapped to the `WEB_PORT` and `SERVER_PORT` of the container.
- Specify any custom values for `MAIN_PATH`, `WEB_PORT`, `SERVER_IP`, and `SERVER_PORT` using the `-e` flag followed by the environment variable name and value.
- Replace `/host/path` with the path on the host machine that you want to map to the `/app/static` directory in the container.
- Finally, provide the name and tag of the Docker image you built with `your_image_name:tag`.


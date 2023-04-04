# Gitlab CI/CD Pipeline for Building and Deploying Docker Images to DigitalOcean Container Registry

## Prerequisites

Before you can use this pipeline, you'll need to have the following set up:

A GitLab account with access to a GitLab project.
A DigitalOcean account with access to a container registry.

## Getting started

- Fork this repository to your GitLab account. Instructions for forking a repository can be found in the top level [README.md file](/README.md##Forking-the-project).
- Navigate to your GitLab project's CI/CD settings and define the following environment variables:
  - `DIGITALOCEAN_ACCESS_TOKEN`: Your DigitalOcean access token. You can create one in the DigitalOcean control panel.
  - `REGISTRY_NAME`: The name of your DigitalOcean container registry. You can find it in the DigitalOcean control panel. Example: `registry.digitalocean.com/your-container-registry-name`
- Create a `.gitlab-ci.yml` file and open it in your preferred text editor.
- Insert the yml code below into the file.
- Commit the changes to this file and push them to your GitLab repository.
- The pipeline will run automatically, building your Docker image and pushing it to the DigitalOcean container registry.

```yml
# /.gitlab-ci.yml
variables:
  DOCKER_HOST: tcp://docker:2375 
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: ""

stages:
  - deploy

deploy:
  tags:
    - docker
  image: docker
  stage: deploy
  services:
    - name: docker:dind
      alias: docker
      command: ["--tls=false"]
  before_script:
    - apk update && apk add curl
    - curl -Lo doctl.tar.gz https://github.com/digitalocean/doctl/releases/download/v1.91.0/doctl-1.91.0-linux-amd64.tar.gz && tar xf doctl.tar.gz
    - chmod u+x doctl
    - mv doctl /usr/local/bin/doctl
    # - doctl --help
    - echo "Getting docker info"
    - docker info
  script:
    - docker build -t ocr-middleware:latest api
    - echo $DIGITALOCEAN_ACCESS_TOKEN | doctl registry login --expiry-seconds 300
    - docker tag ocr-middleware:latest $REGISTRY_NAME/ocr-middleware:latest
    - docker push $REGISTRY_NAME/ocr-middleware:latest
  only:
    - main
```

In essence we are using the Docker in Docker (dind) service to build and push the Docker image to the DigitalOcean container registry.
The `doctl` command line tool is used to authenticate with the registry, and is getting installed inside the Docker image.

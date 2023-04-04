# Github CI/CD Pipeline for Building and Deploying Docker Images to DigitalOcean Container Registry

## Prerequisites

Before you can use this pipeline, you'll need to have the following set up:

A Github account with access to a Github project.
A DigitalOcean account with access to a container registry.

## Getting started

- Fork this repository to your Github account. Instructions for forking a repository can be found in the top level [README.md file](/README.md##Forking-the-project).
- Navigate to your Github project's CI/CD settings and define the following environment variables:
  - `DIGITALOCEAN_ACCESS_TOKEN`: Your DigitalOcean access token. You can create one in the DigitalOcean control panel.
  - `REGISTRY_NAME`: The name of your DigitalOcean container registry. You can find it in the DigitalOcean control panel. Example: `registry.digitalocean.com/your-container-registry-name`
- Create a `.github/workflows/deploy.yml` file and open it in your preferred text editor.
- Insert the yml code below into the file.
- Commit the changes to this file and push them to your Github repository.
- The pipeline will run automatically, building your Docker image and pushing it to the DigitalOcean container registry.

```yml
# /.github/workflows/deploy.yml
name: deploy-to-digital-ocean
on:
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout main
      uses: actions/checkout@main
    - name: Install doctl
      uses: digitalocean/action-doctl@v2
      with:
        token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
    - name: Build container image
      run: docker build -t ocr-middleware:latest api
    - name: Log in to DigitalOcean Container Registry with short-lived credentials
      run: doctl registry login --expiry-seconds 1200
    - name: Tag image
      run: docker tag ocr-middleware:latest ${{ secrets.REGISTRY_NAME }}/ocr-middleware:latest
    - name: Push image to DigitalOcean Container Registry
      run: docker push ${{ secrets.REGISTRY_NAME }}/ocr-middleware:latest
```

Github provides the `digitalocean/action-doctl@v2` action to install the `doctl` command line tool. This action makes it easy to authenticate with the registry.

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

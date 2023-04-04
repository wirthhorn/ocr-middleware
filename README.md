# OCR Middleware with Express JS

This is an OCR middleware built with Express JS that receives a POST request with an image, performs OCR, and returns the discovered text.

## Getting Started

### Prerequisites

Make sure you have Node.js and NPM installed. You can download them from the official website: [https://nodejs.org/en/download/].
You will also need The Cloudinary OCR Extension and provide your own API Keys.

### Environment Variables:

The following environment variables are required:

- `CLOUD_NAME`: the name of your Cloudinary account
- `API_KEY`: the API key for your Cloudinary account
- `API_SECRET`: the API secret for your Cloudinary account

The following environment variable is optional:

- `KEEP_FILES`: A boolean indicating whether to keep the uploaded image files on disk and retain them in Cloudinary after processing them. Defaults to false.

You can set these environment variables in a .env file in the root directory of the project or as system environment variables. Make sure to provide the correct values for your Cloudinary account.
### Installing

Clone the repository and install the dependencies:

```sh
git clone https://github.com/wirthhorn/ocr-middleware.git
cd ocr-middleware
cd api
npm install
```

### Running locally

To test the project locally, run:

```sh
npm run dev
```

This will start the server on [http://localhost:5000]. You can send a POST request with an image to [http://localhost:5000/ocr] to perform OCR and get the discovered text.

### Building the Docker image

To build a Docker image of the project, run:

```sh
docker build -t ocr-middleware:<tag> .
```
Replace `<tag>` with a version number or a descriptive name for your image.

### Deployment (CI/CD)

Some CI/CD pipeline templates are provided in the `ci-template` folder. Use them as a starting point to set up your own pipeline for deploying the application. The examples include a way to build a docker image, and to push it into the Digital Ocean Container Registry.


## Forking the project

You might want to fork the project to your Github or your internal Gitlab in order to set up your custom CI/CD pipeline. Instructions are the same it both cases. Here is how you can do that:

1. Create empty Gitlab repository and clone to your computer
2. Add "upstream remote" to your gitlab repo with `git remote add upstream https://github.com/user/repo`
3. Fetch and pull from the upstream to follow changes with `git pull upstream main`
4. Push your changes to your own gitlab repository with `git push origin main`. Use `git push -u origin main` the first time to lock default remote location of `git push`.

Verify your settings:

- `git remote -v`: list the available remote locations for push and pull. Check if correct.
- `git remote show origin`: shows the currently configured locations for `git push` and `git pull` if no remote is specified.

## Built with

- [Express JS](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [Cloudinary](https://cloudinary.com/) - Specifically their [OCR extension](https://cloudinary.com/documentation/ocr_text_detection_and_extraction_addon) built on top of [Google Vision](https://cloud.google.com/vision/docs/ocr)

## Authors

Armin Emmert - [WIRTH & HORN Informationssysteme GmbH](https://www.wirth-horn.de/)

## License

This project is licensed under the MIT License - see the [LICENSE] file for details.
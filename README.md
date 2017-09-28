# Glimpse Function User

This is a Serverless Service to manage the Users of the application.


## Init Firebase Project
 1. Configure the CLI locally by using `firebase use --add` and select your project in the list.
 1. Install dependencies locally by running: `cd functions; npm install; cd -`


## Run locally
To run and test this code locally do:
 1. Start serving your project locally using `firebase serve --only hosting,functions`
 1. Open the app in a browser at `https://localhost:5000`.


## Deploy
Deploy
 1. Deploy your project using `firebase deploy --except hosting`
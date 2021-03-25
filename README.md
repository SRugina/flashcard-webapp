# Flashcard Web App

## How to run the code

1. Install NodeJS and Yarn on your machine.
2. Download the code.
3. Run the `yarn` command to install the dependencies.
4. Copy "wrangler.toml.example" to a new file "wrangler.toml" and fill in the placeholder data "<...>".
5. Run `yarn api:deploy` to deploy the backend to Cloudflare Workers.
6. Run `yarn build` and deploy the newly created "out" folder to the internet in whatever way you wish, ensuring it is accessible via the frontend URL used in step 4. Ensure that in this deployed area the environment variable NEXT_PUBLIC_API_URL is set to the API route destination used in step 4.

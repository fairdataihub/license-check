# License Check Github App

> A GitHub App built with [Probot](https://github.com/probot/probot). This app checks for a License in the installed repository and warns the user if no license if found.

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t license-check-app .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> license-check
```

## Contributing

If you have suggestions for how license-check-app could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2023 fairdataihub

# ReadiumX

[![Twitter Follow](https://img.shields.io/twitter/follow/JaleelB?style=social)](https://twitter.com/jal_eelll)
[![GitHub Repo stars](https://img.shields.io/github/stars/JaleelB/readium-x?style=social)](https://github.com/JaleelB/readium-x/stargazers)

<h3 align="center">ReadiumX</h3>

<p align="center">
    The open-source tool that provides access to premium Medium articles without the paywall
    <br />
    <a href="https://readiumx.com"><strong>Learn more »</strong></a>
    <br />
    <br />
    <a href="#introduction"><strong>Introduction</strong></a> ·
    <a href="#features"><strong>Features</strong></a> ·
    <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
    <a href="#contributing"><strong>Contributing</strong></a>
</p>

## Introduction

ReadiumX is an open source tool that provides access to premium Medium articles without the paywall, allowing you to bookmark, and manage your reading experience across any device

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [TypeScript](https://www.typescriptlang.org/) – language
- [Tailwind](https://tailwindcss.com/) – CSS
- [TursoDB](https://turso.tech/) – database
- [Lucia Auth](https://lucia-auth.com//) – auth
- [Resend](https://resend.com/) – emails
- [DrizzleORM](https://orm.drizzle.team/) – ORM
- [TipTap](https://www.tiptap.dev/) – editor
- [Shadcn](https://ui.shadcn.com/) – component library
- [Railway](https://railway.app/) – deployments

## Features

- Access Premium Articles: Bypass paywalls to access content freely.
- Bookmarking System: Save your favorite articles for later reading.
- Progress Tracking: Automatically saves your reading progress to resume where you left off.
- Reading History Management: View and manage your reading history with options to delete records.

## Running Locally

1. Clone the repository

   ```bash
   git clone https://github.com/JaleelB/readium-x.git
   ```

2. Install dependencies using pnpm

   ```bash
   pnpm install
   ```

3. Copy the `.env.example` to `.env` and update the variables.

   ```bash
   cp .env.example .env
   ```

4. Start the development server

   ```bash
   pnpm run dev
   ```

5. Push the database schema

   ```bash
   pnpm run db:push
   ```

### Setting up Google Provider

If you want google login, you'll need to setup a google project and create some keys:

1. https://console.cloud.google.com/apis/credentials
2. create a new project
3. setup oauth consent screen
4. create credentials - oauth client id
5. for authorized javascript origins

- http://localhost:3000
- https://your-domain.com

6. Authorized redirect URIs

- http://localhost:3000/api/login/google/callback
- https://your-domain.com/api/login/google/callback

7. Set your google id and secret inside of .env

- **GOOGLE_CLIENT_ID**
- **GOOGLE_CLIENT_SECRET**

### Setting up Github Provider

If you want github login, you'll need to setup a github project and create some keys:

1. https://github.com/settings/developers
2. Create a new OAuth App
3. Create an application for the for local development:
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/login/github/callback
4. Create an application for the for production:
   - Homepage URL: https://your-domain.com
   - Authorization callback URL: https://your-domain.com/api/login/github/callback

## Contributing

Contributions are welcome! Please open an issue if you have any questions or suggestions. Your contributions will be acknowledged. See the [contributing guide](./CONTRIBUTING.md) for more information.

## License

Licensed under the MIT License. Check the [LICENSE](./LICENSE.md) file for details.

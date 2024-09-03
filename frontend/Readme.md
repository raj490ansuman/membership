# membership: frontend

* Front-end: [React](https://react.dev/)
    * [antd](https://ant.design/): UI component library
    * [@tanstack/react-query](https://tanstack.com/query/latest): hooks for managing, caching and syncing asynchronous and remote data
* Styling: [Tailwind CSS](https://tailwindcss.com/)
* Tooling: [Vite](https://vitejs.dev/)
* Language: TypeScript

## Getting started

Both `pnpm` and `npm` may be used in this project, but this guide and the following examples will utilize `pnpm` for the sake of simplicity.

## Installation

Install the dependencies:

```sh
pnpm install
```

### Setting up LINE "Gain friends"

#### Prerequisites: 
* LINE Messaging API Channel

If you do not have a LINE Messaging API channel, please see the project root [README.md](../README.md#setting-up-the-line-front-end-framework-liff) for more setup details.

To enable adding of friends via QR code and URL with your channel:

1. Visit the [LINE Official Account Manager](https://manager.line.biz/) and select your Messaging API Channel
2. In left-hand side bar, navigate to "Gain friends" dashboard: `Gain friends / Add friend" tool / Advertise online`
3. `Create an "Add friend" QR code`, copy the QR image URL and assign the value to your `VITE_APP_LINE_QR_URL` in [.env.ci](.env.ci)
4. In the "Gain friends" dashboard, select `Create a URL`, copy the URL and assign the value to your `VITE_APP_LINE_ADD_FRIEND_URL` in [.env.ci](.env.ci)

Your `.env.ci` should look something like:

```sh
VITE_APP_LINE_QR_URL="https://qr-official.line.me/gs/M_399fdzuu_GW.png?oat_content=qr"
VITE_APP_LINE_ADD_FRIEND_URL="https://lin.ee/U4OJKa6"
```

Remember to rebuild your project when applying changes.

## Running locally

To serve your frontend for development:

```sh
pnpm dev
```

To build the Tailwind CSS:

```sh
pnpm run build:css
```

## Deployment

### Prerequisites
Before building the project for staging or production, you must first build the CSS for production:

```sh
pnpm run build:css:prod
```

### Environment builds

To build for `staging` (pre-production) using [.env](.env) and [.env.staging](.env.staging):

```sh
pnpm run build:staging
```

To build for `production` using [.env](.env) and [.env.production](.env.production):

```sh
pnpm run build:production
```

Refer to [package.json](package.json) for additional scripts.

### Deploying to server

After building the frontend, create a `frontend` folder inside the root directory on the server and copy the contents of [build](build) there.

## Development

### Configuring the VSCode debugger

With the following launch configuration, you will be able to set breakpoints and launch the debugger in VS Code. In the terminal, start your development server using `pnpm dev`. Then, `Start Debugging (F5)` in VS Code to open a new browser instance. 

```json
// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
      {
        "type": "chrome",
        "request": "launch",
        "name": "Launch Chrome against localhost",
        "url": "http://localhost:3000",
        "webRoot": "${workspaceFolder}/frontend"
      }
    ]
  }
```

Reference: [Debugging React](https://code.visualstudio.com/docs/nodejs/reactjs-tutorial#_debugging-react)

### Contribution guidelines

* Create new components and views in self contained folders and export via `index.ts` to allow for clean imports
* Utilize widely used project libraries listed at the top for consistency (e.g. antd, @tanstack/react-query)

## Troubleshooting

* When adding new Tailwind CSS classes, remember to rebuild the CSS
# membership

Membership is a base management system for KAKERU's memberships.

-   Front-end: [React](https://react.dev/)
-   Back-end: [Express.js](https://expressjs.com/)
    -   Database: [MySQL](https://dev.mysql.com/downloads/mysql/)
    -   ORM: [sequelize](https://sequelize.org/)
-   Testing: [Jest](https://jestjs.io/)
-   Formatter: [Prettier](https://prettier.io/)

## Getting started

### Prerequisites

-   [ngrok](#setting-up-ngrok): used for connecting localhost via `https` to test applications and APIs (e.g. LIFF)
-   [LINE Front End Framework (LIFF)](#setting-up-the-line-front-end-framework-liff): an existing Messaging API Channel and Login Channel
-   [MySQL](https://dev.mysql.com/downloads/mysql/): relational database

### Requirements

-   Node.js 18 or higher.

## Installation

In the root project and [frontend](frontend) directory, install the npm dependencies:

```sh
npm install
```

### Quick start

Prerequisite: an existing `kakeru_baby_membership_db` MySQL database

To quickly force write an `.env` and initialize the `kakeru_baby_membership_db` database:

```sh
source deploy.sh
```

In the following sections, we will populate the appropriate environment values.

### Setting up .env

Create an `.env` file in your project root. Refer to [.env.example](.env.example).

### Setting up ngrok

The LINE Login Channel LIFF app requires an `https` endpoint URL that we can achieve by using `ngrok`.

1. Download and install [ngrok](https://ngrok.com/download). Then, start an ngrok tunnel:

```sh
ngrok http 3000
```

2. Copy the Forwarding URL and assign the value to your local root `.env`'s `NGROK_URI`. The forwarding URL should look something like: `https://7bf7-152-165-199-159.ngrok-free.app`.

3. Update your LINE [Login Channel's](#login-channel) LIFF application's `Endpoint URL` with the following format:

```sh
[ENTER_YOUR_NGROK_FORWARDING_URL]/liff/login/[ENTER_YOUR_LIFF_ID]
```

The `Endpoint URL` should look something like:

```sh
https://7bf7-152-165-199-159.ngrok-free.app/liff/login/2002037619-2aoNN8Ry
```

Note that restarting the ngrok instance under the free plan changes the forwarding URL. This requires updating both the local environment variable and LIFF's Endpoint URL.

### Setting up the LINE Front End Framework (LIFF)

LINE Front-end Framework (LIFF) is a platform for web apps also known as LIFF apps. In order to develop LIFF apps, you will need to create a new provider in [LINE Developers Console](https://developers.line.biz/console/) or use your existing one.

#### Messaging API Channel

1. Create a new Messaging API Channel
2. After creation, in the channel's Messaging API Tab, issue a new channel access token, and copy and assign the value to your local root `.env`'s `LINE_CHANNEL_ACCESS_TOKEN`. Also, copy and assign the Messaging API channel secret to `LINE_CHANNEL_SECRET`.

#### Login Channel

1. Under the same provider, create a new Login Channel
2. Link your Login Channel to Messaging API channel by adding an LINE Official Account using the `Bot basic ID` from your Messaging API channel settings
3. Copy and assign the Channel ID to your local `.env`'s `LINE_LOGIN_CHANNEL_ID`
4. In the LIFF tab, add a new LIFF Application with `Full` size, `profile` scope, and `Module Mode` enabled. Temporarily add a placeholder Endpoint URL.
5. After creating the LIFF application, expand it's details. Copy and assign the LIFF app's `LIFF URL` to your local `.env`'s `LINE_LIFF_URI`. Then, change the `Endpoint URL` to your [ngrok's forwarding URL](#setting-up-ngrok) followed by `/liff/login/` and the LIFF ID. It should look something like:

    `https://8272-152-165-199-159.ngrok-free.app/liff/login/2002037619-ZRnkkOpB`

    Note: This Endpoint URL needs to be updated should the ngrok forwarding URL change.

### Setting up the MySQL database

#### Running the database locally

Run MySQL and create a MySQL database called `kakeru_baby_membership_db`.

Refer to [MySQL commands](https://dev.mysql.com/doc/refman/8.2/en/creating-database.html), [DbGate](https://dbgate.org/).

#### Running the database in a Docker container

To run the database in an isolated environment:

```sh
docker compose up
```

If it does not already exist, this will create a `kakeru_baby_membership_db` database.
Refer to [docker-compose.yml](docker-compose.yml) for more configuration details. Modifying the configuration requires restarting the container to apply changes.

To stop the container and **remove** the database including it's data:

```sh
docker compose down
```

#### Initializing and migrating the database

To initialize the database:

```sh
npm run db:init
```

To migrate and sync the database:

```sh
npm run db:migrate init:(sync|force|manager)
```

### Setting up the project for uploads

In order to use feature settings like ファビコン設定 and リッチメニュー設定, you must create folder directories in the project root for:

```
public/uploads/members
public/uploads/richmenus
public/uploads/settings
```

## Running locally

Serve both your frontend, backend, MySQL database, and ngrok tunnel. The frontend should be running on the same ngrok forwarding URL port (3000 by default).

To serve your frontend:

```sh
cd frontend
npm run dev
```

To serve your backend:

```sh
npm run dev
```

Visit `localhost:3000` in your browser to view the application. Initialized manager credentials can be found in [.env.example](.env.example).

Refer to `package.json` for additional scripts.

### Testing

To run Jest test suites and generate a test coverage report:

```sh
npm run test
```

Test coverage can be viewed: `membership/backend-src/backend/tests/coverage/lcov-report/index.html`

### Linting

```sh
npm run lint
```

### Code formatting

```sh
npm run pretty
```

## Setting up a local EC-CUBE

Prerequisite: setup MAMP

After dropping ec-cube content into your `/Applications/MAMP/htdocs/`, accessing `localhost:8888` for the first time will prompt an installation with the following steps:

### Step 1: ようこそ

-   No modifications needed.

### Step 2: 権限チェック

-   No modifications needed.

### Step 3: サイトの設定

<u>あなたの店名</u>

-   Input a generic name with your eccube version like `eccube4.2.1`

<u>メールアドレス（受注メールなどの宛先になります）</u>

-   Input a generic email like `test@test.com`

<u>管理画面ログイン ID（半角英数字 4 ～ 50 文字）</u>

-   Input a generic name like `admin`

<u>管理画面パスワード（半角英数字 12 ～ 50 文字）</u>

-   Input a generic password like `password1234`

**セキュリティの設定**

<u>管理画面のディレクトリ名（半角英数字 4 ～ 50 文字）</u>

-   Input a memorable name like `dashboard` as this will be your endpoint for eccube's configuration settings. (e.g. `localhost:8888/eccube4.2.1/dashboard`)

<u>サイトへのアクセスを、SSL（https）経由に制限します</u>

-   Uncheck this for now, we will setup localhost for HTTPS later.

Leave other input fields as default. No other modifications needed.

### Step 4. データベースの設定

Before seting these values to your MAMP's [default](http://localhost:8888/MAMP/) MySQL settings, visit your MAMP's MySQL PhpMyAdmin and create a new database table named with your eccube's version e.g. `eccube4.2.1`

<u>データベースの種類</u>

-   Set to `MySQL`

<u>データベースのホスト名</u>

-   Set to `127.0.0.1`

<u>データベースのポート番号</u>

-   Set to `8889`

<u>データベース名</u>

-   Set this to the same database name you created for MAMP, e.g. `eccube4.2.1`

<u>ユーザ名</u>

-   Set to `root`

<u>パスワード</u>

-   Set to `root`

### Step 5. データベースの初期化

-   Leave 「データベースの初期化を行わない」unchecked so it can initialize the database

### Step 6. インストール完了

-   Complete installation by clicking 「管理画面を表示」

### Configuring EC-CUBE plugins

You should now be able to access your public-facing EC-CUBE site by visiting `localhost:8888/eccube4.2.1/`.

However, we need to install additional plugins. Visit your EC-CUBE login: `localhost:8888/eccube4.2.1/dashboard/` and login with credentials set in the previous section. In this example guide, the default is set as:

```
Login URL: localhost:8888/eccube4.2.1/dashboard/
ログインID：admin
パスワード：password1234
```

1. In the dashboard left navigation bar, go to:

    - JP: オーナーズストア → 認証キー設定 → 認証キー新規発行

    - EN: Owner's Store → Authentication Settings → Publish new authentication key

    Complete the captcha and publish a new key.

2. Navigate to オーナーズストア → プラグイン → プラグインを探す to search for plugins

3. Install the following plugins:

-   【ver4】LINE ログイン連携プラグイン(4.2 系)（最新バージョン：1.3.1）
    -   無料

### Setting up the ECCUBE-KAKERU-PLUGIN

There are two ways to install custom-made plugins:

1. <u>Recommended</u>: Directly adding the plugin into your local eccube directory and installing via command-line

    - Create a new plugin folder e.g. `KakeruPlugin` in your `/Applications/MAMP/htdocs/ec-cube4.2.1/app/Plugin`
    - Install via command-line in your `ec-cube4.2.1` directory:
        - `bin/console eccube:plugin:install --code=KakeruPlugin`
    - Then enable the plugin:
        - `bin/console eccube:plugin:enable --code=KakeruPlugin`

2. Uploading a zip、tar、tar.gz via the dashboard
    - オーナーズストア → プラグイン → プラグイン一覧 → ユーザー独自プラグイン

### Configure the plugin's settings

In the plugin dashboard after enabling the plugin, if you do not see a settings cog wheel beside the plugin's pause, you must clear the cache via:

-   コンテンツ管理　 → 　キャッシュー管理　 → 　キャッシュー削除

## Troubleshooting EC-CUBE

```
$ cd /Applications/MAMP/htdocs/ec-cube/
$ bin/console eccube:plugin:disable --code=KakeruPlugin

...


In DefinitionErrorExceptionPass.php line 54:

  Cannot autowire service "Plugin\KakeruPlugin\Controller\Admin\KakeruController": argument "$lineIntegrationRepository" of method "__construct()" has type "Plugin
  \ECCUBE4LineIntegration\Repository\LineIntegrationRepository" but this class was not found.
```

If the eccube-kakeru-plugin source uses plugins with an ending number, e.g. `ECCUBE4LineLoginIntegration42`, this is a reference to the specific EC-CUBE version.

Uploading, updating, and enabling plugins on EC-CUBE may crash and brick the EC-CUBE instance, making the dashboard inaccessible or resulting in:

```
This page isn’t working
localhost is currently unable to handle this request.
(HTTP ERROR 500)
```

To resolve this, attempt the following:

1. Via the terminal, navigate to your EC-CUBE installation directory. This typically looks like: `/Applications/MAMP/htdocs/ec-cube/`

2. Execute the following command:

```
bin/console eccube:plugin:disable --code=YOUR_PLUGIN_NAME
```

This should provide a verbose description of the plugin's error. If this does not disable your plugin or your EC-CUBE is inaccessible, attempt the following steps.

3. Navigate to your EC-CUBE plugin installation directory via Finder. This typically looks like: `/Applications/MAMP/htdocs/ec-cube/app/Plugin/`

4. You should see all your installed Plugins. Now, via Finder, right click options and delete your plugin's folder. You should now be able to reaccess your local EC-CUBE instance, however, the plugin will still persist as an existing plugin in the dashboard.

5. Restart your MAMP server.

6. Restore your plugin folder deletion via Finder by using Undo (CMD+Z).

7. Re-run the following command:

```
bin/console eccube:plugin:disable --code=YOUR_PLUGIN_NAME
```

The plugin should successfully be disabled and reallow additional uploads.

To delete the plugin completely, run the following command:

```
bin/console eccube:plugin:uninstall --code=YOUR_PLUGIN_NAME --uninstall-force=true
```

Refer to the official EC-CUBE [plugin documentation](https://doc4.ec-cube.net/plugin_install) for additional commands.

### Maintenance

When enabling and disabling plugins, or clearing cache, EC-CUBE may enter maintenance mode:

```
ただいまメンテナンス中です。

大変お手数ですが、しばらくしてから再度アクセスをお願いします。
```

This can be disabled via:
コンテンツ管理　 → 　メンテナンス管理　 → 　無効にする

## Guidelines

-   Modularize components, and whenever possible, packageable components for reusability

## Troubleshooting

-   Ensure the frontend `.env`'s `VITE_APP_ENV` is equal to `STAGING` or `CI`. The LIFF app cannot be accessed from the browser if `VITE_APP_ENV` is set to `PRODUCTION`, it will only be accessible through the phone application.
-   Modifying environment variables requires restarting the utilizing process

## Additional resources

For placeholder and template images, refer to the files in [DI_SYSTEM_TEAM_SPACE](https://miraic1201.backlog.com/file/DI_SYSTEM_TEAM_SPACE).

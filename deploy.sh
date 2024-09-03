#!/bin/bash

# This script is used to build the membership application.
echo "Building the database of the membership application..."

echo -n "Enter database hostname (127.0.0.1): "
read db_hostname
db_hostname="${db_hostname:="127.0.0.1"}"

echo -n "Enter database port (3306): "
read db_port
db_port="${db_port:=3306}"

echo -n "Enter database username (root): "
read db_user
db_user="${db_user:=root}"

echo -n "Enter database password (empty): "
read -s db_password
db_password="${db_password:=""}"

echo -en "\nEnter initial manager username (test_admin): "
read init_manager_username
init_manager_username="${initial_manager_username:=test_admin}"

echo -n "Enter initial manger password (testtest1): "
read -s init_manager_pw
init_manager_pw="${init_manager_pw:=""}"

# (1) Backend Setup
# Creating environment variables file
touch .env

echo "DB_HOST=$db_hostname
DB_USER=$db_user
DB_PASSWORD=$db_password
DB_DB="kakeru_baby_membership_db"
DB_DIALECT="mysql"
DB_PORT=$db_port
PORT=8080
SITE_URI="127.0.0.1:\${PORT}"
ENC_SEC=secretKey
SESS_SEC=sessionSecret
SESS_NAME=kakeru-contact
LINE_CHANNEL_ACCESS_TOKEN=asd
LINE_CHANNEL_SECRET="asd"
LINE_LOGIN_CHANNEL_ID="123"
LINE_LIFF_URI=
LINE_MSG_NOT_IMPLEMENTED=error
NODE_ENV="development"
ENV_TEST=true
CONSOLE_ONLY=true
NGROK_URI=
INIT_MANAGER_EMAIL="test@test.com"
INIT_MANAGER_USERNAME="test_admin"
INIT_MANAGER_PW="testtest1"" >.env

# (2) Installing & building required packages
npm i
npm run build

# (3) Database Migration, manager and member initialization
npm run db:init

# (4) Changing the .env file of the frontend
# cd frontend
# file=.env.staging
# sed -e "s/^VITE_APP_TEST_USER=.*/VITE_APP_TEST_USER=$init_manager_username/" \
#     -e "s/^VITE_APP_TEST_USER_PASSWORD=.*/VITE_APP_TEST_USER_PASSWORD=$init_manager_pw/" $file >temp.env
# mv temp.env .env.staging

# cd ..

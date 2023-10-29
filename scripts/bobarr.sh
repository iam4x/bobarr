#!/bin/bash
set -e # exit when error

cat << "EOF"

    /$$                 /$$
    | $$                | $$
    | $$$$$$$   /$$$$$$ | $$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$
    | $$__  $$ /$$__  $$| $$__  $$ |____  $$ /$$__  $$ /$$__  $$
    | $$  \ $$| $$  \ $$| $$  \ $$  /$$$$$$$| $$  \__/| $$  \__/
    | $$  | $$| $$  | $$| $$  | $$ /$$__  $$| $$      | $$
    | $$$$$$$/|  $$$$$$/| $$$$$$$/|  $$$$$$$| $$      | $$
    |_______/  \______/ |_______/  \_______/|__/      |__/

        https://github.com/iam4x/bobarr

EOF

if docker compose > /dev/null 2>&1; then
    if docker compose version --short | grep "^2." > /dev/null 2>&1; then
      COMPOSE_VERSION='docker compose'
    fi
elif docker-compose > /dev/null 2>&1; then
  if ! [[ $(alias docker-compose 2> /dev/null) ]] ; then
    if docker-compose version --short | grep "^2." > /dev/null 2>&1; then
      COMPOSE_VERSION='docker-compose'
    fi
  fi
fi

args=$1

stop_bobarr() {
  $COMPOSE_VERSION down --remove-orphans || true
}

after_start() {
  echo ""
  echo "bobarr started correctly, printing bobarr api logs"
  echo "you can close this and bobarr will continue to run in backgound"
  echo ""
  $COMPOSE_VERSION logs -f api
}

if [[ $args == 'start' ]]; then
  stop_bobarr
  $COMPOSE_VERSION up --force-recreate -d
  after_start
elif [[ $args == 'start:vpn' ]]; then
  stop_bobarr
  $COMPOSE_VERSION -f docker-compose.yml -f docker-compose.vpn.yml up --force-recreate -d
  after_start
elif [[ $args == 'start:wireguard' ]]; then
  stop_bobarr
  $COMPOSE_VERSION -f docker-compose.yml -f docker-compose.wireguard.yml up --force-recreate -d
  after_start
elif [[ $args == 'stop' ]]; then
  stop_bobarr
  echo ""
  echo "bobarr correctly stopped"
elif [[ $args == 'update' ]]; then
  $COMPOSE_VERSION pull
  echo ""
  echo "bobarr docker images correctly updated, you can now re-start bobarr"
else
  echo "unknow command: $args"
  echo "use [start | start:vpn | start:wireguard | stop | update]"
fi

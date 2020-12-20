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

if [ "$(ls -A $PWD)" ]
then
    echo "Please run this script in an empty and new directory"
    exit 2
fi

echo "downloading bobarr into directory"

mkdir -p library/downloads
mkdir -p library/movies
mkdir -p library/tvshows

mkdir -p packages/jackett/config
mkdir -p packages/jackett/downloads
mkdir -p packages/transmission/config
mkdir -p packages/vpn

(
  cd packages/transmission/config
  curl -s https://raw.githubusercontent.com/iam4x/bobarr/master/packages/transmission/config/settings.json -o settings.json
)

curl -s https://raw.githubusercontent.com/iam4x/bobarr/master/.env -o .env
curl -s https://raw.githubusercontent.com/iam4x/bobarr/master/docker-compose.yml -o docker-compose.yml
curl -s https://raw.githubusercontent.com/iam4x/bobarr/master/docker-compose.vpn.yml -o docker-compose.vpn.yml
curl -s https://raw.githubusercontent.com/iam4x/bobarr/master/docker-compose.wireguard.yml -o docker-compose.wireguard.yml

curl -s https://raw.githubusercontent.com/iam4x/bobarr/master/scripts/bobarr.sh -o bobarr.sh
chmod +x ./bobarr.sh

echo "downloading docker images"

docker-compose pull

echo ""
echo "bobarr installation is now complete!"
echo "update your configuration into [.env] and [docker-compose.yml] to link your library"

echo ""
echo "when done run you can start bobarr with [./bobarr.sh start]"

echo ""
echo "if you want to setup a vpn or wireguard, drop your vpn configuration into [./packages/vpn]"
echo "and then start with [./bobarr.sh start:vpn] or [./bobarr.sh start:wireguard]"

echo ""
echo "you can find the documentation here => https://github.com/iam4x/bobarr#-bobarr"
echo "and if you need help join our discord => https://discord.gg/PFwM4zk"

echo ""
echo "enjoy"

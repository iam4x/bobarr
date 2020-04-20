# 🍿 Bobarr
> The all-in-one alternative for Sonarr, Radarr, Jackett... with a VPN and running in docker

Bobarr is a movies and tv shows collection manager for BitTorrent users. It uses [themoviedb.org](https://www.themoviedb.org/) to search movies and tv shows to add to your library. Then it searchs into your favorites torrent trackers the best match and downloads it for you through a VPN.

![Screenshot](./screenshot.png)

**This is an early release!**

## Why ?

One of the main idea for bobarr is to be simple to setup, simple to use and having everything at the same place.
You don't have to choose a torrent client, to setup a VPN, to setup radarr, sonarr, then jackett and connect them all together.

It's also built from scratch and it will try to solve long term problem like download multiple qualities and keep them or managing tvshows and movies at the same place.
You can follow the [roadmap](https://github.com/iam4x/bobarr/projects/1) to check what next features are implemented.

And to have something with a better ui, less configuration and faster 🚀

## Setup

### Requirement

* docker installed (https://get.docker.com/) with docker-compose
* an account on a torrent website that is supported by jackett

## Installation

* Clone the repo `$ git clone https://github.com/iam4x/bobarr.git && cd bobarr`

* Set `PUID` and `PGID` in `.env` (see .env for explanation)
* Start the bobarr minimal stack `$ docker-compose up --build -d` (see below to add vpn)
* Go to http://jackett.localhost, add your torrent indexers and copy the API Key in top right corner
* Go to http://bobarr.localhost/settings and update the jackett API key

## Configuration

### Torrent account

* Go to http://jackett.localhost
* Add indexer and follow the steps

### Bobarr configuration

* Go to http://bobarr.localhost/settings
* Set your region and language according to your torrent tracker

### Run with VPN

You can easily enforce all downloads through your VPN
* Copy your open vpn config file (.ovpn) into the folder `packages/vpn`
* Run the docker-compose.vpn.yml file
  * if you have npm -> `$ npm run start:vpn` or yarn -> `$ yarn start:vpn`
  * otherwise -> `$ docker-compose -f docker-compose.yml -f docker-compose.vpn.yml up -d`

### Run with WireGuard

WireGuard is currently under heavy development and this configuration has only been tested on Linux
* Install the [https://www.wireguard.com/install/](WireGuard) package for your operating system/distribution
* Run the docker-compose.wireguard.yml file
  * if you have npm -> `$ npm run start:wireguard` or yarn -> `$ yarn start:wireguard`
  * otherwise -> `$ docker-compose -f docker-compose.yml -f docker-compose.wireguard.yml up -d`

## Usage

* After configuration, go to http://bobarr.localhost and just start searching!
* The files will be downloaded into `library/downloads`
* The files will be simlinked and organized into `library/tvshows` or `library/movies`

## Import your own library

If you were using radarr or sonarr already you may have a tvshow or movies folder. You can easily import your already existing library into bobarr.

* Change in docker-compose.yml the folder link `- ./library:/usr/library`
* Point to your own library folder `- /mnt/storage/your/own/library:/usr/library`

The only requirement is to have a folder `tvshows` and a folder `movies` then bobarr can catch up and download to your user defined library folder.

You can now head to http://bobarr.localhost and hit that "Scan library folder" button.

## Services

* Bobarr http://bobarr.localhost
* Bobarr GraphQL API http://api.bobarr/graphql
* Bobarr background jobs http://api.bobarr/jobs
* Jackett http://jackett.localhost
* Transmission http://transmission.localhost

## Development

You can run bobarr API and Web UI in dev watch mode and display logs with:

* With npm
  * `$ yarn dev`
* Without npm
  * `$ docker-compose up -f docker-compose.yml -f docker-compose.dev.yml up --force-recreate -d`
  * `$ docker-compose logs --tail 20 -f api web`

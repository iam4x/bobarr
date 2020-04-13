# 🍿 Bobarr
> The all-in-one alternative for Sonarr, Radarr, Jackett... with a VPN and running in docker

Bobarr is a movies and tv shows collection manager for BitTorrent users. It uses [themoviedb.org](https://www.themoviedb.org/) to search movies and tv shows to add to your library. Then it searchs into your favorites torrent trackers the best match and downloads it for you through a VPN.

![Screenshot](./screenshot.png)

**This is an early release!**

## Why ?

Because I was fed up to setup Radarr, Sonarr, my torrent downloader with jackett and have to switch in between all theses tools to track my downloads.

Also Sonarr and Radarr are not compatible with foreigners torrents, I had to search on my own a lot of torrents in the end and I have no time for that!

And to have something with a better ui, less configuration and faster 🚀

## Setup

### Requirement

* docker installed (https://get.docker.com/) with docker-compose
* an account on a torrent website that is supported by jackett

## Installation

* Clone the repo `$ git clone https://github.com/iam4x/bobarr.git && cd bobarr`

* Set `PUID` and `PGID` in `.env` (see .env for explanation)
* Start the bobarr minimal stack `$ docker-compose up --build -d` (see below to add vpn)
* Go to http://localhost:9117 and copy the API Key in top right corner
* Go to http://localhost:3000/settings and update the jackett API key

## Configuration

### Torrent account

* Go to http://localhost:9117
* Add indexer and follow the steps

### Bobarr configuration

* Go to http://localhost:3000/settings
* Set your region and language according to your torrent tracker

### Run with VPN

You can easily enforce all downloads through your VPN
* Copy your open vpn config file (.ovpn) into the folder `packages/vpn`
* Run the docker-compose.vpn.yml file
  * if you have npm -> `$ npm run start:vpn`
  * otherwise -> `$ docker-compose -f docker-compose.yml -f docker-compose.vpn.yml up -d`

## Usage

* After configuration, go to http://localhost:3000 and just start searching!
* The files will be downloaded into `library/downloads`
* The files will be simlinked and organized into `library/tvshows` or `library/movies`

## Import your own library

If you were using radarr or sonarr already you may have a tvshow or movies folder. You can easily import your already existing library into bobarr.

* Change in docker-compose.yml the folder link `- ./library:/usr/library`
* Point to your own library folder `- /mnt/storage/your/own/library:/usr/library`

The only requirement is to have a folder `tvshows` and a folder `movies` then bobarr can catch up and download to your user defined library folder.

You can now head to http://localhost:3000 and hit that "Scan library folder" button.

## Services

* Bobarr http://localhost:3000
* Bobarr GraphQL API http://localhost:4000/graphql
* Bobarr background jobs http://localhost:4000/jobs
* Jackett http://localhost:9117
* Transmission http://localhost:9091

## Development

You can run bobarr API and Web UI in dev watch mode and display logs with:

* With npm
  * `$ yarn dev`
* Without npm
  * `$ docker-compose up -f docker-compose.yml -f docker-compose.dev.yml up --force-recreate -d`
  * `$ docker-compose logs --tail 20 -f api web`

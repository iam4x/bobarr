# 🍿 Bobarr
> The all-in-one replacement for Sonarr, Radarr, Jackett... with a VPN and running in docker

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
* an open vpn configuration file (.ovpn)
* an account on a torrent website

## Installation

* Clone the repo `$ git clone ssh://github.com/iam4x/bobarr.git && cd bobarr`
* Copy your open vpn config file (.ovpn) into the folder `packages/vpn`
* Set `PUID` and `PGID` in `.env` (see .env for explanation)
* Build the api and web ui packages `$ docker-compose build`
* Start the bobarr stack `$ docker-compose up`
* Go to http://localhost:9117 and copy the API Key in top right corner
* Go to http://localhost:3000/settings and update the jackett API key

## Configuration

### Torrent account

* Go to http://localhost:9117
* Add indexer and follow the steps

### Bobarr configuration

* Go to http://localhost:3000/settings
* Set your region and language according to your torrent tracker

### Run without VPN

This is not recommended, but you can start downloading torrents without a VPN with the `docker-compose.without-vpn.yml`

* `mv docker-compose.yml docker-compose.with-vpn.yml`
* `mv docker-compose.without-vpn.yml docker-compose.yml`

And makes sure to restart the all stack with

* `$ docker-compose up --force-recreate`

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

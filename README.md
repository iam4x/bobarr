# 🍿 Bobbarr
> The all-in-one replacement for Sonarr, Radarr, Jackett... with a VPN and running in docker

Bobarr is a movies and tv shows collection manager for BitTorrent users. It uses [themoviedb.org](https://www.themoviedb.org/) to search movies and tv shows to add to your library. Then it searchs into your favorites torrent trackers the best match and downloads it for you through a VPN.

![Screenshot](./screenshot.png)

**This is an beta release!**

## Why ?

Because I was fed up to setup Radarr, Sonarr, my torrent downloader with jackett and have to switch in between all theses tools to track my downloads.

Also Sonarr and Radarr are not compatible with foreigners torrents, I had to search on my own a lot of torrents in the end and I have no time for that!

And to have something with a better ui, less configuration and faster 🚀

## Setup

### Requirement

* docker installed (https://get.docker.com/) with docker-compose
* an open vpn configuration file (.ovpn)
* an account in a torrent website

## Installation

* Clone the repo `$ git clone ssh://github.com/iam4x/bobarr.git && cd bobarr`
* Then move your open vpn config file into the folder `packages/vpn`
* Build the api and web ui packages `$ docker-compose build`
* Start the bobarr stack `$ docker-compose up`
* Go to http://localhost:9117 and copy the API Key in top right corner
* Go to http://localhost:3000/settings, paste the jackett API key and hit update

## Configuration

### Torrent account

* Go to `http://localhost:9117`
* Hit `add indexer` and follow the steps

### Bobarr configuration

* Go to http://localhost:3000/settings
* Set your region and language according to your torrent tracker

## Usage

* After configuration, go to http://localhost:3000 and just start searching!
* The files will be downloaded into `library/downloads`
* The files will be simlinked and organized into `library/tvshows` or `library/movies`

## Services

* Bobarr http://localhost:3000
* Bobarr GraphQL API http://localhost:4000/graphql
* Bobarr background jobs http://localhost:4000/jobs
* Jackett http://localhost:9117
* Transmission http://localhost:9091

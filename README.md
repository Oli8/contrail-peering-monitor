# Contrail Peering Monitor

## Install
> apt-get install nodejs

> git clone https://github.com/cloudwatt/contrail-peering-monitor

> npm install

## Version
 v.1.0.1

## Usage
> ./contrail-peering-monitor --help

>  Usage: contrail-peering-monitor -d <discovery-address> [options]

>  Options:

>    -h, --help                    output usage information

>    -V, --version                 output the version number

>    -d, --discovery <hostname>    Discovery address (localhost by default)

>    -t, --timeout <time>          Request timeout (ms)

>    -r, --refresh-time <time>     Refresh time (ms)

## Prerequisites
 * [nodejs v0.10.25] (https://nodejs.org/dist/v0.10.25/docs/)
 * [async](https://www.npmjs.com/package/async)
 * [commander.js](https://www.npmjs.com/package/commander)
 * [blessed](https://github.com/chjj/blessed)
 * [blessed-contrib](https://github.com/yaronn/blessed-contrib)
 * [unirest](https://www.npmjs.com/package/unirest)
 * [xml2js](https://www.npmjs.com/package/xml2js)
 * [portscanner](https://www.npmjs.com/package/portscanner)

# Contrail Peering Monitor

## Version
 v.0.0.2
## Usage
> ./contrail-peering-monitor --help \
  Usage: contrail-peering-monitor -a <hostname> [options]\
  Options:
    -h, --help                    output usage information\
    -V, --version                 output the version number\
    -a, --analytics <hostname>    Analytics address\
    -t, --time-to-refresh <time>  Interval to refresh data (in ms)

## Prerequisites
 * [async](https://www.npmjs.com/package/async)
 * [commander.js](https://www.npmjs.com/package/commander)
 * [blessed](https://github.com/chjj/blessed)
 * [blessed-contrib](https://github.com/yaronn/blessed-contrib)

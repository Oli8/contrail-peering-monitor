var staticConfig = {};
staticConfig.port = {};

staticConfig.port['contrail-api'] = staticConfig.port['ApiServer'] = 8082;
staticConfig.port['contrail-svc-monitor'] = staticConfig.port['Service Monitor'] = 8088;
staticConfig.port['contrail-schema'] = staticConfig.port['Schema'] = 8087;
staticConfig.port['contrail-discovery'] = staticConfig.port['DiscoveryService'] = 5998;
staticConfig.port['contrail-ifmap'] = staticConfig.port['IfmapServer'] = 8443;
staticConfig.port['contrail-control'] = staticConfig.port['ControlNode'] = 8083;
staticConfig.port['xmpp-server'] = 5269;
staticConfig.port['contrail-vrouter-agent:0'] = 8085;
staticConfig.port['contrail-analytics-api'] = 8081;

module.exports = staticConfig;

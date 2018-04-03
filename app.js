const express = require("express");
const app = express();
const YAML = require('yamljs');

const Bull = {
    host: null,
    port: null,

    start: function (configPath) {
        let config = {};
        try {
            config = this.configurator.getFrameworkConfig(configPath || `config\\config.yml`);
            (config.includes.routing || [{path: `config\\routing.yml`}]).forEach(routingFile => {
                this.router.parseRoutes(routingFile.path, routingFile.prefix || "");
            });
        } catch(e) {
            console.error(e.message);
        }

        if (!config.port) {
            console.error("%root%/config/config.yml does not contain the port setting.");
        } else {
            app.listen(config.port, config.host || "0.0.0.0", () => console.log(`Server started on ${config.host || "0.0.0.0"}:${config.port}`));
        }
    },

    router: require("./toolkit/routing")(app),

    configurator: {
        config: null,

        getFrameworkConfig(path) {
            this.config = YAML.load(path).config;
            return this.config;
        }
    }
};

module.exports = Bull;

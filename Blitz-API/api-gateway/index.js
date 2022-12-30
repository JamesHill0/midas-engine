const gateway = require("fast-gateway");

const toml = require("toml");
const fs = require("fs");
const config = toml.parse(fs.readFileSync("./config.toml", "utf-8"));
const cors = require("cors");

function get_routes() {
    const route_names = [
        'authentication',
        'account',
        'location',
        'order',
        'golf',
        'document',
        'mapping',
        'authorization',
        'logger',
        'scheduler',
        'integration',
        'external'
    ];

    let routes = [];
    route_names.map((route_name) => {
        result = create_route(route_name);
        if (Object.keys(result).length !== 0 && result.constructor === Object) {
            routes.push(result);
        }
    });

    return routes;
}

function create_route(name) {
    let target = '';
    let docker_env = `SERVICE_${name.toUpperCase()}`
    if (process.env.hasOwnProperty(docker_env)) {
        target = process.env[docker_env];
    }

    if (target != '') {
        return {
            prefix: `/${name}`,
            target: target,
            middlewares: [(req, res, next) => {
                console.log(`Calling ${name} service => ${target}`)
                next();
            }],
            prefixRewrite: ''
        }
    }

    return {};
}

const port = process.env.APP_PORT != null ? parseInt(process.env.APP_PORT) : config.service.port;

const corsOptions = {
    origin: process.env.ALLOWED_HOSTS,
    credentials: true,
}

const server = gateway({
    middlewares: [cors(corsOptions), require("helmet")()],
    routes: get_routes(),
})

server.start(port).then(server => {
    console.log(`Api Gateway running on port ${port}`);
});

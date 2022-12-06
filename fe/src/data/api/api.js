import Axios from "./axios";

class Api extends Axios {
    constructor(url) {
        super();
        this.defaults.url = url;
        this.defaults.baseURL = `${process.env.APP_BASE_URL}`;
    }
}

export function Get(url, params, config, callback) {
    let api = new Api(url);
    api.get(api.defaults.url, { params: params }, config).then(response => {
        if (callback) {
            callback(response.data);
        }
    }).catch((err) => {
        if (callback) {
            callback({
                "Error": err,
                "Data": null,
            })
        }
    });
}

export function Post(url, data, config, callback) {
    let api = new Api(url);
    api.post(api.defaults.url, data, config).then(response => {
        if (callback) {
            callback(response.data);
        }
    }).catch((err) => {
        if (callback) {
            callback({
                "Error": err,
                "Data": null,
            })
        }
    });
}

export function Patch(url, data, config, callback) {
    let api = new Api(url);
    api.patch(api.defaults.url, data, config).then(response => {
        if (callback) {
            callback(response.data);
        }
    }).catch((err) => {
        if (callback) {
            callback({
                "Error": err,
                "Data": null,
            })
        }
    });
}

export function Delete(url, params, config, callback) {
    let api = new Api(url);
    api.delete(api.defaults.url, params, config).then(response => {
        if (callback) {
            callback(response.data);
        }
    }).catch((err) => {
        if (callback) {
            callback({
                "Error": err,
                "Data": null,
            })
        }
    });
}

export default {
    Get,
    Post,
    Patch,
    Delete,
};

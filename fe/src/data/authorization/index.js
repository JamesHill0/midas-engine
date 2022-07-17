import Api from "../api/api";
import Mapper from "../api/mapper";

import { AuthorizationSchema } from "./authorization.schema";

export class Authorization {
    Username;
    Password;
}

export class AuthorizationViewModel {
    constructor(url = "") {
        this.url = `authorization/${url}`;
        this.Data = {};
        this.Message = "";
    }

    Get(params, callback) {
        Api.Get(this.url, params, response => {
            if (callback) {
                if (response.data) {
                    this.Data = response.data;
                }
                this.Message = response.message;
                callback(this);
            }
        });
    }

    Post(data, callback) {
        Api.Post(this.url, data, response => {
            if (callback) {
                if (response.data) {
                    this.Data = response.data;
                }
                this.Message = response.message;
                callback(this);
            }
        });
    }

    Patch(data, callback) {
        Api.Patch(this.url, data, response => {
            if (callback) {
                if (response.data) {
                    this.Data = response.data;
                }
                this.Message = response.message;
                callback(this);
            }
        });
    }
}
import Api from "../api/api";

export class RegistrationViewModel {
    constructor(url = "") {
        this.url = `account/${url}`;
        this.Data = {};
        this.Messages = "";
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

    Delete(data, callback) {
        Api.Delete(this.url, data, response => {
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

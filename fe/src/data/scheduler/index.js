import Api from "../api/api";

export class SchedulerViewModel {
    constructor(url = "", config = {}) {
        this.url = `scheduler/${url}`;
        this.config = config;
        this.Data = {};
        this.Messages = "";
        this.Error = {};
    }

    Get(params, callback) {
        Api.Get(this.url, params, this.config, response => {
            if (callback) {
                if (response.data) {
                    this.Data = response.data;
                }
                this.Error = response.Error;
                this.Message = response.message;
                callback(this);
            }
        });
    }

    Patch(data, callback) {
        Api.Patch(this.url, data, this.config, response => {
            if (callback) {
                if (response.data) {
                    this.Data = response.data;
                }
                this.Error = response.Error;
                this.Message = response.message;
                callback(this);
            }
        });
    }
}

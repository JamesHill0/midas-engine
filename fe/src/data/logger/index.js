import Api from "../api/api";
import Mapper from "../api/mapper";

export class LoggerViewModel {
    constructor(url = "", config = {}) {
        this.url = `logger/${url}`;
        this.config = config;
        this.Data = {};
        this.Message = "";
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
}

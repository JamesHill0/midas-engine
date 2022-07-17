import Api from "../api/api";
import Mapper from "../api/mapper";

export class LoggerViewModel {
    constructor(url = "") {
        this.url = `logger/${url}`;
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
}

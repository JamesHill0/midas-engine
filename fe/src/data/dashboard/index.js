import Api from "../api/api";

export class DashboardViewModel {
    constructor(url = "dashboard/") {
        this.url = url;
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
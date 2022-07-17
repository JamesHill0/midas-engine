import { morphism } from "morphism";
import omitEmpty from "omit-empty";

class Mapper {
    mapNode(node, data) {
        if (node) {
            return `${node}.${data}`;
        }
        return data;
    }

    mapNodeArray(schema, response, node, label, method = "") {
        if (node) {
            response = response[node];
        }

        if (response && response[label]) {
            let morphed = morphism(schema(null, method), response[label]);
            return morphed;
        }
        return null;
    }

    mapList(model, schema, response) {
        let list = [];
        if (response) {
            response.map(re => {
                let mapped = this.mapOne(model, schema, re);
                list.push(mapped);
            });
        }

        return list;
    }

    mapOne(model, schema, response) {
        let morphed = morphism(schema(), response);
        return mapresult(new model(), morphed);
    }

    unmap(schema, response) {
        let morphed = morphism(schema(null, "unmap"), response);
        return omitEmpty(morphed);
    }

    mapSchema(node, schema, method) {
        switch (method) {
            case "unmap":
                let unmapped = {};
                Object.keys(schema).map(key => {
                    unmapped[schema[key]] = this.mapNode(node, key);
                });
                return unmapped;
            default:
                let mapped = {};
                Object.keys(schema).map(key => {
                    mapped[key] = this.mapNode(node, schema[key]);
                });
                return mapped;
        }
    }
}

function mapresult(base, data) {
    Object.keys(base).forEach(key => {
        if (isArray(data[key])) {
            base[key] = data[key];
        } else if (isObject(base[key])) {
            base[key] = mapresult(base[key], data[key]);
        } else {
            base[key] = data[key];
        }
    });
    return base;
}

function isArray(key) {
    return Object.prototype.toString.apply(key) === "[object Array]";
}

function isObject(key) {
    return Object.prototype.toString.apply(key) === "[object Object]";
}

export default new Mapper();
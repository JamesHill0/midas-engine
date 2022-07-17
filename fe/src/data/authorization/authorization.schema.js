import Mapper from "../api/mapper";

const Authorization = {
    Username: "username",
    Password: "password",
}

export function AuthorizationSchema(node = "", method) {
    return Mapper.mapSchema(node, Authorization, method);
}
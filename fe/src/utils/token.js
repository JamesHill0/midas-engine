import jwt_decode from 'jwt-decode';
import { capitalize } from './common';

export function decodeToken() {
    const token = localStorage.getItem("access_token");
    const decoded = jwt_decode(token);
    return {
        display_name: capitalize(decoded.username),
    }
}

export function capitalize(value) {
    if (typeof value === "string") return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
    return value;
}

export function toDate(timestr) {
    return new Date(timestr);
}

export function toLocal(timestr) {
    if (timestr == "") return
    const date = toDate(timestr);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = date.getFullYear();
    const hr = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ampm = hr >= 12 ? 'pm' : 'am';
    const sec = String(date.getSeconds()).padStart(2, '0');
    return `${mm}/${dd}/${yy} ${hr}:${min}:${sec} ${ampm.toUpperCase()}`;
}
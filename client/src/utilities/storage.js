export function getFromStorage(key) {
    if (!key) return null;

    try {
        const valueStr = localStorage.getItem(key);
        return valueStr ? JSON.parse(valueStr) : null;
    } catch (err) {
        return null;
    }
}

export function setInStorage(key, obj) {
    if (!key) console.log('Error ... key is missing');

    try {
        localStorage.setItem(key, JSON.stringify(obj));
    } catch (err) {
        console.error(err);
    }
}

export function removeFromStorage(key) {
    if (!key) console.log('Error ... key is missing');

    try {
        localStorage.removeItem(key);
    } catch (err) {
        console.error(err);
    }
}
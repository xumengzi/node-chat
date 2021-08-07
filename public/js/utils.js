function setStorage(type, value) {
    localStorage.setItem(type, value);
};

function getStorage(name) {
    return localStorage.getItem(name);
};

window.setStorage = setStorage;
window.getStorage = getStorage;
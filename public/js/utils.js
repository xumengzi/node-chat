function setStorage(type, value) {
    localStorage.setItem(type, JSON.stringify(value));
};

function getStorage(name) {
    return JSON.parse(localStorage.getItem(name));
};

function randomKey() {
    return Math.round(+new Date() * Math.random());
};

function postData(url, type, data) {
    return fetch(url, {
      body: JSON.stringify(data),
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'user-agent': 'Mozilla/4.0 MDN Example',
        'content-type': 'application/json'
      },
      method: type || 'POST',
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
    })
    .then(response => response.json())
  }

window.utils = {
    setStorage: setStorage,
    getStorage: getStorage,
    randomKey: randomKey,
    postData: postData
};
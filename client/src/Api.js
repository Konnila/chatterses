
export async function fetchChannels(url, cb) {
    await fetch(url)
        .then(res => res.ok ? res.json() : console.log("error"))
        .then((channels) => cb(channels));
}

export function channelAdd(url, name, description, cb1, cb2) {
    fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: name, description: description})
    })
    .then(res => res.json())
    .then(result => cb1(result.name, result.description))
    .then(() => cb2());
}

export function fetchMessages(url, channel, cb) {
    console.log(url + "messages/" + channel);
    fetch(encodeURI( url + 'messages/' + channel))
        .then(res => res.ok ? res.json() : console.log("error"))
        .then((result) => cb(result));
}

export function messageAdd(url, channel, message, user, cb) {
    fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({channel: channel, message: message, user: user})
    })
    .then(res => res.json())
    .then((result) => console.log(result))
    .then(() => cb);
}



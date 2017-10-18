// Where fetch() is defined?

export async function fetchChannels(url, cb) {
    await fetch(url)

        // This is a poor man's error handling policy since it
        // just prints error to stderr if response is is not ok.
        .then(res => res.ok ? res.json() : console.log("error"))

        // Could be just .then(channels)
        .then((channels) => cb(channels));
}

// What are cb1 and cb2? Use more specific naming.
export function channelAdd(url, name, description, cb1, cb2) {
    fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*', // In this case, this should be application/json only.
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: name, description: description})
    })
    // Error handling is missing. It could be added here or if you
    // decide that caller should handle errors, return the promise.
    .then(res => res.json())

    // What is the reason for this construct? It should be
    // commented here if there is a reason.
    .then(result => cb1(result.name, result.description))
    .then(() => cb2());
}

export function fetchMessages(url, channel, cb) {
    // This should be console.debug().
    console.log(url + "messages/" + channel);

    fetch(encodeURI( url + 'messages/' + channel))
        // Error handling is missing. It could be added here or if you
        // decide that caller should handle errors, return the promise.
        .then(res => res.ok ? res.json() : console.log("error"))

        // Could be just .then(cb).
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
    // Error handling is missing. It could be added here or if you
    // decide that caller should handle errors, return the promise.
    .then(res => res.json())

    // This should be console.debug().
    .then((result) => console.log(result))

    // This doesn't call the callback.
    .then(() => cb);
}



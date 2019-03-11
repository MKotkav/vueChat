const messages = []

module.exports.getAllMessages = () => {
    return messages
}

module.exports.addMessage = (message) => {
    messages.push(message)
}

module.exports.deleteAllMessages = () => {
    messages.length = 0
}


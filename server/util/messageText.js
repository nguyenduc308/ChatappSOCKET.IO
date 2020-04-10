module.exports.generateMessage = (from, text) => {
    return {
        from,
        text,
        createAt: Date.now()
    }
}
module.exports.generateLocation = (from, lat, lng) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${lat},${lng}`,
        createAt: Date.now()
    }
}
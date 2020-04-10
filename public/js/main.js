const socket = io();
const user = $.deparam(window.location.search)

socket.on("connect", () => {
    console.log("connected to server");
    socket.emit('joinRoom', {user})
});
socket.on("msgFromSever", msg => {
    const template = $("#message-template").html()
    const html = Mustache.render(template, {
        text: msg.text,
        from: msg.from,
        createAt: moment(msg.createAt).format('LT')
    })
    $("#messages").append(html)
});
socket.on("locationFromSever", msg => {
    const template = $("#location-template").html()
    const html = Mustache.render(template, {
        from: msg.from,
        url: msg.url,
        createAt: moment(msg.createAt).format('LT')
    })
    $("#messages").append(html)
});
socket.on('usersInRoom', ({users}) => {
    const ol = $('<ol></ol>');
    users.forEach(user => {
        const li = $('<li></li>')
            li.text(user.name)
            ol.append(li)
    })
    $('#users').html(ol)
})
socket.on("disconnect", () => {
    console.log("disconnect from server");
});

$("#message-form").on("submit", e => {
    e.preventDefault();
    const message = $("[name=message]").val();
    socket.emit("msgFromClient", {
        from: "client 1",
        text: message,
        createAt: Date.now()
    });
    $("[name=message]").val("")
})
$("#send-location").on("click", () => {
    if(!navigator.geolocation) return alert("Your browser does not support Geolocation")
    navigator.geolocation.getCurrentPosition(position => {
        socket.emit("locationFromClient", {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        })
    })
})
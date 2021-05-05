﻿var isDown = false;
var isConnected = false;

// create our connection to the GameHub
var connection = new signalR.HubConnectionBuilder()
    .withUrl('gameHub')
    .withAutomaticReconnect([1000, 2000, 5000, 5000, 10000, 10000, 10000, 20000, 30000])
    .build();

// handle the shipMoved event when the server pushes it to us
connection.on('shipMoved', (y, x) => {
    console.log('shipMoved to ' + y + ', ' + x);
    document.getElementById('ship').style.top = y;
    document.getElementById('ship').style.left = x;
});

// show that the ship can't be controlled when reconnecting
connection.onreconnecting((error) => {
    isConnected = false;
    isDown = false;
    document.getElementById('ship').setAttribute(
        'src',
        'css/ship-off.png'
    );
});

// show that we're reconnected
connection.onreconnected((error) => {
    isConnected = true;
    document.getElementById('ship').setAttribute(
        'src',
        'css/ship-on.png'
    );
});

// start the connection
async function start() {
    try {
        connection.start().then(() => {
            document.getElementById('ship').setAttribute(
                'src',
                'css/ship-on.png'
            );
            isConnected = true;
        });
    }
    catch {
        isConnected = false;
    }
}

// click the ship to select it
document.getElementById('ship').onclick = (ev) => {
    if (isConnected == true) {
        isDown = !isDown;
    }
}

// once the ship is selected it will follow my mouse
document.getElementById('ship').onmousemove = (ev) => {
    if (isDown == true && isConnected == true) {
        document.getElementById('ship').style.top = ev.pageY - 128 + 'px';
        document.getElementById('ship').style.left = ev.pageX - 128 + 'px';

        // invoke the MoveShip method on the hub
        connection.invoke('MoveShip',
            document.getElementById('ship').style.top,
            document.getElementById('ship').style.left);
    }
};

start();
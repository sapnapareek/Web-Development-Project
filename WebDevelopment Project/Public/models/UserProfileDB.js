var UserConnection = require('../models/UserConnection')

class UserProfileDB {

    constructor(UserID, UserConnections) {
        this._UserID = UserID;
        this._UserConnections = UserConnections;
    };

    get UserID() {
        return this._UserID;
    }
    set UserID(value) {
        this._UserID = value;
    }

    get UserConnections() {
        return this._UserConnections;
    }
    set UserConnections(value) {
        this._UserConnections = value;
    }


    convert(obj) {
        Object.assign(this, obj);
    }

    getconnections() {
        return this._UserConnections;
    }
    

    addConnection(userConnection) {
        var connections = this._UserConnections;
        var count = 0, n = connections.length;
        if (n > 0) {
            for (let i = 0; i < n; i++) {
                if (connections[i].connectionName != userConnection.connectionName) {
                    count++;
                    if (count == n) {
                        connections.push(userConnection);
                    }
                }

            }
        }
        else {
            connections.push(userConnection);
        }
        this._UserConnections = connections;
    };

    removeConnection(UserConnection) {
        var connections = this._UserConnections;
        for (let i = 0; i < connections.length; i++) {
            if (connections[i].connectionName == UserConnection.connectionName) {
                connections.splice(i, 1);
            }
        }
        this._UserConnections = connections;
    };

    updateConnection(itemName, rsvp, connectionID) {
        var connections = this._UserConnections;
        for (let i = 0; i < connections.length; i++) {
            if (connections[i].connectionName == connectionName) {
                if (connections[i].rsvp != rsvp) {
                    var connection = new UserConnection(connections[i].connectionName, rsvp, connectionID);
                    connections.splice(i, 1, connection);
                }
            }
        }
        this._UserConnections = connections;
    };
}

module.exports = UserProfileDB;

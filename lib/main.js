"use strict";

const obSvc = require('sdk/deprecated/observer-service');
const { PageMod } = require("sdk/page-mod");

const { Connection, addConnection } = require('./connection');
const tabEvents = require('./tab/events');
const ui = require('./ui');

obSvc.add("http-on-examine-response", function(subject) {
    var connection = Connection.fromSubject(subject);
    if (connection.valid){
        addConnection(connection);
    }
});

Connection.on('log', function(message){
    ui.emit('log', message);
});


function matchesCurrentTab(connection){
    // this is a tabinfo object
    var tabinfo = this;
    if (!tabinfo) return false;
    if (!tabinfo.uri) return false;
    if (tabinfo.uri.spec === ui.mainPage){ return false; }
    return (connection._sourceTab === tabinfo.tab) && (connection.timestamp > tabinfo.loadTime);
}


PageMod({
    include: ui.mainPage,
    contentScriptWhen: 'ready',
    contentScriptFile: ui.contentScript,
    onAttach: ui.attachToLightbeamPage
});





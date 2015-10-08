'use strict';

var dragonspeak = require('dragonspeak-lib');
var audio = require('dragonspeak-things-audio-events-lib');

var transformer = function(data) {
    console.info(data);

    var events = [];
    for (var i = 0; i < data.length; i++) {
        var item = data[i][audio.data];
        events.push(
            {
                adjustment: item['volume'],
                timestamp:  item['timestamp']
            }
        );
    }

    return {
        volume: events
    };
};

module.exports.handler = function(event, context) {
    dragonspeak.retrieve(audio.table, event.thingId, event.limit || 10,
        function (err, data) {
            if (err) {
                return context.fail(err);
            } else {
                return context.succeed(transformer(data));
            }
        }
    );
};

'use strict';

var dragonspeak = require('dragonspeak-lib');

module.exports.handler = function(event, context) {
    console.info(event);

    var thingId = event.thingId;

    dragonspeak.create(event, '/things/'+ thingId + '/audio/events',
        function(err, response) {
            if (err) {
                console.error(err);

                return context.fail(err.message);
            } else {
                console.info('Event successfully posted for ' + thingId);

                return context.succeed();
            }
        }
    );
};

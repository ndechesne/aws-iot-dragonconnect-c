'use strict';

var aws = require('aws-sdk');

var iot = new aws.Service(
    {
        apiConfig: require('./iot-service-model.json'),
        endpoint: 't71u6yob51.execute-api.us-east-1.amazonaws.com/beta',
        region: 'us-east-1'
    }
);

module.exports.handler = function(event, context) {
    iot.listThings(
        function(err, data) {
            if (err) {
                console.error(err);

                var message = 'UnknownErrorOccurred:  Please consult the logs for additional information.';

                return context.fail(message);
            } else {
                var result = [];

                var things = data.things;
                for (var i = 0; i < things.length; i++) {
                    var thing = things[i];
                    result.push(
                        {
                            "thingId": thing.thingName,
                            "attributes": thing.attributes
                        }
                    );
                }

                return context.succeed(result);
            }
        }
    );
};


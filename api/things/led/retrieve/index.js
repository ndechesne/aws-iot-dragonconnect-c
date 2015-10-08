'use strict';

var FUNC_NAME = 'dragoncommand-things-led-retrieve';

var aws = require('aws-sdk');

var iotData = new aws.Service(
    {
        apiConfig: require('./iot-data-service-model.json'),
        region: 'us-east-1'
    }
);

module.exports.handler = function(event, context) {
    if (context.functionName != FUNC_NAME) {
        return context.fail(
            'InternalError:  The function name should be \'' + FUNC_NAME + '\', but is ' + context.functionName);
    }

    var getRequest = {
        thingName: event.thingId
    };

    iotData.getThingShadow(getRequest,
        function(err, data) {
            if (err) {
                console.log(err);

                var message;
                switch (err.statusCode) {
                    case 403:
                        message = 'AccessDeniedException:  Please check the permissions to perform this function.';
                        break;
                    case 404:
                        message = 'ResourceNotFoundException';
                        break;
                    default:
                        message = 'UnknownErrorOccurred:  Please consult the logs for additional information.'
                }

                return context.fail(message);
            } else {
                var document = JSON.parse(data.payload);

                return context.succeed(document.state.reported);
            }
        }
    );
};

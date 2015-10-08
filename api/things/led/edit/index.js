'use strict';

var FUNC_NAME = 'dragoncommand-things-led-edit';

var aws = require('aws-sdk');

var iot = new aws.Service(
    {
        apiConfig: require('./iot-service-model.json'),
        region: 'us-east-1'
    }
);

var iotData = new aws.Service(
    {
        apiConfig: require('./iot-data-service-model.json'),
        region: 'us-east-1'
    }
);

var validate = require('jsonschema').validate;

var requestSchema = {
    "$schema": 'http://json-schema.org/draft-04/schema#',
    title: 'DragonCommandThingsLedEdit',
    type: 'object',
    properties: {
        active: {
            type: 'boolean'
        }
    },
    required: [ 'active' ]
};

module.exports.handler = function(event, context) {
    if (context.functionName != FUNC_NAME) {
        return context.fail(
            'InternalError:  The function name should be \'' + FUNC_NAME + '\', but is ' + context.functionName);
    }

    console.info('Event:');
    console.info(event);

    var state = event.message;

    var validationResult = validate(state, requestSchema);
    if (false === validationResult.valid) {
        console.info('Invalid Request:  ' + JSON.stringify(validationResult, null, 2));

        return context.fail(new Error(
            'InvalidRequestException:  Consult the developer documentation for the proper message contents.'));
    }

    var thingName = event.thingId;
    var searchRequest = {
        thingName: thingName
    };

    iot.describeThing(searchRequest,
        function(err, data) {
            if (err) {
                var message;

                switch (err.statusCode) {
                    case 404:
                        message = 'ResourceNotFoundException:  ' + err.message;
                        break;
                    default:
                        message = 'UnknownErrorOccurred:  Please consult the logs for additional information.';
                        break;
                }
                console.error(err);

                return context.fail(message);
            } else {
                var updateRequest = {
                    thingName: thingName,
                    payload: JSON.stringify({
                        state: {
                            desired: state
                        }
                    })
                };

                iotData.updateThingShadow(updateRequest,
                    function(err, data) {
                        if (err) {
                            return context.fail('UnknownErrorOccurred:  ' + err.message);
                        } else {
                            return context.succeed();
                        }
                    }
                );
            }
        }
    );
};

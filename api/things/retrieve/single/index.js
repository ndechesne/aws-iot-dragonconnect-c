'use strict';

var aws = require('aws-sdk');

var iot = new aws.Service(
    {
        apiConfig: require('./iot-service-model.json'),
        region: 'us-east-1'
    }
);

var validate = require('jsonschema').validate;

var requestSchema = {
    '$schema': 'http://json-schema.org/draft-04/schema#',
    title: 'ThingsRetrieveSingle',
    type: 'object',
    properties: {
        thingId: {
            type: 'string',
            pattern: '[a-zA-Z0-9]+',
            minLength: 1,
            maxLength: 255
        }
    }
};

var getThing = function(thingId, callback) {
    var describeThingRequest = {
        thingName: thingId
    };

    iot.describeThing(describeThingRequest,
        function(err, data) {
            if (err) {
                console.error(err);

                var message;
                switch (err.statusCode) {
                    case 404:
                        message = 'ResourceNotFoundException:  ' + err.message;
                        break;
                    default:
                        message = 'UnknownErrorOccurred:  Please consult the logs for additional information.';
                        break;
                }

                callback(new Error(message), null);
            } else {
                console.info(data);

                callback(null,
                    {
                        attributes: data.attributes
                    }
                );
            }
        }
    );
};

var validator = function(message, callback) {
    var validationResult = validate(message, requestSchema);
    if (false === validationResult.valid) {
        console.info('Invalid Request:\n' + JSON.stringify(validationResult, null, 2));

        callback(new Error(
            'InvalidRequestException:  Consult the developer documentation for the proper message contents.'), null);
    }
};

module.exports.handler = function(event, context) {
    validator(event,
        function(err, data) {
            if (err) {
                return context.fail(err.message);
            }
        }
    );

    var thingId = event.thingId;

    getThing(thingId,
        function(err, data) {
            if (err) {
                return context.fail(err.message);
            } else {
                return context.succeed(data);
            }
        }
    );
};


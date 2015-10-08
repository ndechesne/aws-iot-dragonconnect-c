'use strict';

var aws = require('aws-sdk');

var iot = new aws.Service(
    {
        apiConfig: require('./iot-service-model.json'),
        endpoint: 't71u6yob51.execute-api.us-east-1.amazonaws.com/beta',
        region: 'us-east-1'
    }
);

var validate = require('jsonschema').validate;

var requestSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    title: "ThingsCreate",
    type: "object",
    properties: {
        thingId: {
            type: "string",
            minLength: 1,
            maxLength: 255,
            pattern: "[a-zA-Z0-9]+"
        },
        attributes: {
            type: "object",
            patternProperties: {
                "[a-zA-Z0-9]": {}
            }
        }
    },
    required: [ "thingId" ]
};

exports.handler = function(event, context) {
    console.info(event);

    var validationResult = validate(event, requestSchema);
    if (false === validationResult.valid) {
        console.info('Invalid Request:  ' + JSON.stringify(validationResult, null, 2));

        return context.fail(new Error(
            'InvalidRequestException:  Consult the developer documentation for the proper message contents.'));
    }

    var thingId = event.thingId;
    var thing = {
        thingName: thingId
    };
    if (typeof event.attributes != 'undefined') {
        thing.attributePayload = {
            attributes: event.attributes
        };
    }

    iot.createThing(thing,
        function(err, data) {
            if (err) {
                console.error(err);

                var message;
                switch (err.statusCode) {
                    case 403:
                        message = 'AccessDeniedException:  Please check the permissions to perform this function.';
                        break;
                    case 409:
                        message = 'ResourceAlreadyExistsException:  ' + err.message;
                        break;
                    default:
                        message = 'UnknownErrorOccurred:  Please consult the logs for additional information.';
                        break;
                }

                return context.fail(message);
            } else {
                console.info('Thing ' + thingId + ' created.');

                return context.succeed();
            }
        }
    );
};

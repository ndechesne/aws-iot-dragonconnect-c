'use strict';

var audio = require('dragonpulse-things-audio-events-lib');

var dynamoDoc = require('dynamodb-doc');
require('aws-sdk').config.update(
    {
        region: 'us-east-1'
    }
);

var validate = require('jsonschema').validate;

var requestSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    title: "DragonSpeakThingsAudioEventCreate",
    type: "object",
    properties: {
        thingId: {
            type: "string"
        },
        timestamp: {
            type: "number"
        },
        volume: {
            enum: [ "increase", "decrease" ]
        }
    },
    required: [ "thingId", "timestamp", "volume" ]
};

module.exports.handler = function(event, context) {

    var observation = event.message;

    var validationResult = validate(observation, requestSchema);
    if (false === validationResult.valid) {
        console.info('Invalid Request:  ' + JSON.stringify(validationResult, null, 2));

        return context.fail(
            new Error('Invalid Request:  Consult the developer documentation for the proper message contents.'));
    }

    var params = {
        TableName: audio.table,
        Item: {
            thingId: event.thingId,
            timestamp: observation['timestamp'],
            observation: observation
        }
    };

    var docClient = new dynamoDoc.DynamoDB();
    docClient.putItem(params,
        function(err, data) {
            if (err) {
                console.error(err);

                return context.fail(err.message);
            } else {
                console.info('Observation Posted');

                return context.succeed();
            }
        }
    );
};

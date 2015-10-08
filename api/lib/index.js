'use strict';

var APPLICATION_JSON = 'application/json';

var STAGE = 'dev';

var http = require('https');
var dynamoDoc = require('dynamodb-doc');

var create = function(event, resource, callback) {
    var requestOptions = {
        host: 'm3uhowyk21.execute-api.us-east-1.amazonaws.com',
        path: '/' + STAGE + resource,
        method: 'POST',
        headers: {
            'Content-Type': APPLICATION_JSON,
            'Accept': APPLICATION_JSON
        }
    };

    var request = http.request(requestOptions,
        function(response) {
            if (response.statusCode != 201) {
                callback(new Error('Unexpected message received.  Status code:  ' + response.statusCode
                    + ', Status Message:  ' + response.statusMessage), null);
            } else {
                console.info('Event posted');

                callback(null, response);
            }
        }
    );

    request.on('error', function(err) {
        console.error('Error posting data to server:  ' + err);
    });

    request.write(JSON.stringify(event));
    request.end();
};

var retrieve = function(table, thingId, limit, callback) {
    var params = {
        TableName: table,
        ScanIndexForward: false,
        KeyConditionExpression: 'thingId = :thingId',
        ExpressionAttributeValues: {
            ":thingId": thingId
        },
        Limit: limit
    };
    console.info(JSON.stringify(params));

    var docClient = new dynamoDoc.DynamoDB();
    docClient.query(params,
        function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data['Items']);
            }
        }
    );
};

module.exports = {
    create: create,
    retrieve: retrieve
};
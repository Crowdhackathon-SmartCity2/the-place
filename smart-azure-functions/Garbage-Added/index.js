module.exports = function (context, IoTHubMessages) {
    context.log(`JavaScript eventhub trigger function called for message array: ${JSON.stringify(IoTHubMessages)}`);

    var output = {
        "deviceId": "",
        "userId": "",
        "glass": 0,
        "paper": 0,
        "metal": 0,
        "plastic": 0,
    }

    IoTHubMessages.forEach(message => {
        context.log(`Processed message: ${message}`);
        if (message.deviceId) {
            output.deviceId = message.deviceId;
        }
        if (message.userId) {
            output.userId = message.userId;
        }
        if (message.glass) {
            output.glass += message.glass;
        }
        if (message.paper) {
            output.paper += message.paper;
        }
        if (message.metal) {
            output.metal += message.metal;
        }
        if (message.plastic) {
            output.plastic += message.plastic;
        }
    });

    context.bindings.cosmosDb = output;

    context.done();
};
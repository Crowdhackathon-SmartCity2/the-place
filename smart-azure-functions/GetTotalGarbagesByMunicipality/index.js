module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    if (req.params.municipality) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: context.bindings.cosmosDb.map((item) => item.deviceId)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "error"
        };
    }
    context.done();
};
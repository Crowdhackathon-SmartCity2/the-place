module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    if (req.params.userId) {
        context.log(context.bindings.cosmosDb);
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: context.bindings.cosmosDb[0]
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
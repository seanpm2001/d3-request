var tape = require("tape"),
    request = require("../");

require("./XMLHttpRequest");

tape("request(url, callback) makes an asynchronous GET request with the default mime type", function(test) {
  request.request("test/data/sample.txt", function(error, request) {
    if (error) throw error;
    test.equal(request._info.url, "test/data/sample.txt");
    test.equal(request._info.method, "GET");
    test.equal(request._info.async, true);
    test.equal(request._info.mimeType, undefined);
    test.equal(request.responseText, "Hello, world!\n");
    test.equal(request.readyState, 4);
    test.equal(request.status, 200);
    test.end();
  });
});

tape("request(url, callback) invokes the callback with an error if the request fails", function(test) {
  request.request("//does/not/exist", function(error, request) {
    test.ok(error instanceof XMLHttpRequest); // A bit weird, but hey.
    test.equal(request, undefined);
    test.end();
  });
});

tape("request(url, callback) is an alias for request(url).get(callback)", function(test) {
  request.request("test/data/sample.txt").get(function(error, request) {
    if (error) throw error;
    test.equal(request._info.url, "test/data/sample.txt");
    test.equal(request._info.method, "GET");
    test.equal(request._info.async, true);
    test.equal(request.responseText, "Hello, world!\n");
    test.equal(request._info.mimeType, undefined);
    test.equal(request.readyState, 4);
    test.equal(request.status, 200);
    test.end();
  });
});

tape("request(url).mimeType(type).get(callback) observes the specified mime type", function(test) {
  request.request("test/data/sample.txt").mimeType("text/plain").get(function(error, request) {
    if (error) throw error;
    test.equal(request._info.mimeType, "text/plain");
    test.equal(request.responseText, "Hello, world!\n");
    test.end();
  });
});

tape("request(url).on(\"beforesend\", listener).get() invokes the listener before sending", function(test) {
  var r = request.request("test/data/sample.txt");
  r.on("beforesend", function(request) {
    test.equal(this, r);
    test.ok(request instanceof XMLHttpRequest);
    test.equal(request.readyState, 1);
    test.end();
  });
  r.get();
});

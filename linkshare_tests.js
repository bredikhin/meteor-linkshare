// Test config
var config = {
  accessToken: 'your-access-token-here'
};

// Test instance
var linkshare = new Linkshare(config);

// Options passed to the get request stub
var optionsPassed;

// GET request stubbed
HTTP = {
  get: function(url, options, cb) {
    optionsPassed = options;
    var res = {};
    switch(url) {
      case linkshare.endpoints.productSearch:
        res.content = '<result><TotalMatches>-1</TotalMatches>'
          + '<TotalPages>200</TotalPages>'
          + '<PageNumber>1</PageNumber>'
          + '<item></item><item></item></result>';
        break;
      default:
        throw new Error('Invalid endpoint');
        break;
    }

    cb(null, res);
  }
};

Tinytest.add('Linkshare - constructor - sets up the endpoints properly', function (test) {
  test.equal(linkshare.endpoints.productSearch, 'https://api.rakutenmarketing.com/productsearch/1.0');
});

Tinytest.add('Linkshare - constructor - sets up the configuration passed', function (test) {
  test.equal(linkshare.accessToken, config.accessToken);
});

Tinytest.add('Linkshare - constructor - fails on invalid configuration', function (test) {
  test.throws(function() {
    var invalidLinkshare = new Linkshare({
      accessToken: 12345
    });
  });
});

Tinytest.add('Linkshare - productSearch - makes a GET request', function (test) {
  optionsPassed = null;
  linkshare.productSearch({}, function(err, res) {
    test.equal(err, null);
    test.include(optionsPassed, 'params');
    test.include(optionsPassed, 'headers');
  });
});

Tinytest.add('Linkshare - productSearch - passes the parameters', function (test) {
  optionsPassed = null;
  linkshare.productSearch({something: 'anything'}, function(err, res) {
    test.include(optionsPassed.params, 'something');
    test.equal(optionsPassed.params.something, 'anything');
  });
});

Tinytest.add('Linkshare - productSearch - sets the authorization header', function (test) {
  optionsPassed = null;
  linkshare.productSearch({}, function(err, res) {
    test.include(optionsPassed.headers, 'Authorization');
    test.equal(optionsPassed.headers['Authorization'], 'Bearer ' + linkshare.accessToken);
  });
});

Tinytest.add('Linkshare - productSearch - parses the XML response to JSON', function (test) {
  optionsPassed = null;
  linkshare.productSearch({}, function(err, res) {
    test.instanceOf(res.item, Array);
    test.length(res.item, 2);
  });
});

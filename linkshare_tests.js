// Test config
var config = {
  siteId: 12345,
  username: 'test',
  password: 'testAsWell',
  consumerKey: 'blahBlah',
  consumerSecret: 'blahBlahBlah'
};

// HTTP requests stubbed
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
  },
  post: function(url, options) {
    var res = {};
    switch(options.params['grant_type']) {
      case 'password':
        res = {
          statusCode: 200,
          data: {
            access_token: 'a-new-token',
            expires_in: 3600,
            refresh_token: 'refresh-token'
          }
        };
        break;
      case 'refresh_token':
        res = {
          statusCode: 200,
          data: {
            access_token: 'a-refreshed-one',
            expires_in: 3600,
            refresh_token: 'another-refresh-token'
          }
        };
        break;
      default:
        break;
    }

    return res;
  }
};

// Test instance
var linkshare = new Linkshare(config);

// Options passed to the get request stub
var optionsPassed;

Tinytest.add('Linkshare - constructor - sets up the endpoints properly', function (test) {
  test.equal(linkshare.endpoints.tokenRequest, 'https://api.rakutenmarketing.com/token');
  test.equal(linkshare.endpoints.productSearch, 'https://api.rakutenmarketing.com/productsearch/1.0');
});

Tinytest.add('Linkshare - constructor - sets up the configuration passed', function (test) {
  test.equal(linkshare.config.siteId, config.siteId);
  test.equal(linkshare.config.username, config.username);
  test.equal(linkshare.config.password, config.password);
  test.equal(linkshare.config.consumerKey, config.consumerKey);
  test.equal(linkshare.config.consumerSecret, config.consumerSecret);
});

Tinytest.add('Linkshare - constructor - fails on invalid configuration', function (test) {
  test.throws(function() {
    var invalidLinkshare = new Linkshare({});
  });
  test.throws(function() {
    var invalidLinkshare = new Linkshare({
      wrongParam: 123
    });
  });
  test.throws(function() {
    var invalidLinkshare = new Linkshare({
      siteId: 'wrongType'
    });
  });
});

Tinytest.add('Linkshare - authorizationHeader - returns a properly composed header', function (test) {
  test.equal(linkshare.authorizationHeader(), 'Bearer '
    + new Buffer(config.consumerKey + ':' + config.consumerSecret)
      .toString('base64'));
});

Tinytest.add('Linkshare - accessToken - requests a new access token and updates config', function (test) {
  linkshare.config.accessToken = null;
  test.equal(linkshare.accessToken(), 'a-new-token');
  test.equal(linkshare.config.accessToken, 'a-new-token');
});

Tinytest.add('Linkshare - accessToken - refreshes access token if the it is expired', function (test) {
  linkshare.config.accessToken = 'an-expired-one';
  linkshare.config.accessTokenExpiry = moment().subtract(1, 'm');
  test.equal(linkshare.accessToken(), 'a-refreshed-one');
});

Tinytest.add('Linkshare - accessToken - returns the existing access token if not expired', function (test) {
  linkshare.config.accessToken = 'a-good-one';
  linkshare.config.accessTokenExpiry = moment().add(1, 'm');
  test.equal(linkshare.accessToken(), 'a-good-one');
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
    test.equal(optionsPassed.headers['Authorization'], 'Bearer ' + linkshare.accessToken());
  });
});

Tinytest.add('Linkshare - productSearch - parses the XML response to JSON', function (test) {
  optionsPassed = null;
  linkshare.productSearch({}, function(err, res) {
    test.instanceOf(res.item, Array);
    test.length(res.item, 2);
  });
});

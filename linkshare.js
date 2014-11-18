var parse = Npm.require('xml2js').parseString;

Linkshare = function(config) {
  // API endpoints
  this.endpoints = {
    productSearch: 'https://api.rakutenmarketing.com/productsearch/1.0'
  };

  check(config, {
    accessToken: String
  });

  this.accessToken = config.accessToken;
};

// Product search
Linkshare.prototype.productSearch = function(params, done) {
  HTTP.get(this.endpoints.productSearch, {
    params: params,
    headers: {
      Authorization: 'Bearer ' + this.accessToken
    }
  }, function(err, res) {
    if (err)
      return done(err);

    parse(res.content, function(err, content) {
      if (err)
        return done(err);

      check(content, {
        result: {
          TotalMatches: Array,
          TotalPages: Array,
          PageNumber: Array,
          item: Array
        }
      });

      done(null, content.result)
    });
  });
};

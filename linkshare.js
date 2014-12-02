var parse = Npm.require('xml2js').parseString;

Linkshare = function(config) {
  // API endpoints
  this.endpoints = {
    tokenRequest: 'https://api.rakutenmarketing.com/token',
    productSearch: 'https://api.rakutenmarketing.com/productsearch/1.0'
  };

  check(config, {
    siteId: Number,
    username: String,
    password: String,
    consumerKey: String,
    consumerSecret: String
  });

  this.config = config;
};

// Compose authorization header
Linkshare.prototype.authorizationHeader = function() {
  return 'Bearer '
    + new Buffer(this.config.consumerKey + ':' + this.config.consumerSecret)
      .toString('base64');
}

// Return/request/refresh access token
Linkshare.prototype.accessToken = function() {
  if (!this.config.accessToken) {
    // Initial access token request
    try {
      var res = HTTP.post(this.endpoints.tokenRequest, {
        params: {
          grant_type: 'password',
          username: this.config.username,
          password: this.config.password,
          scope: this.config.siteId
        },
        headers: {
          Authorization: this.authorizationHeader()
        }
      });
      check(res.statusCode, 200);
      this.config.accessToken = res.data.access_token;
      this.config.accessTokenExpiry = moment().subtract(Number(res.data.expires_in), 's');
      this.config.refreshToken = res.data.refresh_token;
    }
    catch(e) {
      throw new Error('Unable to request API access token!');
    }
  }
  else if (moment(this.config.accessTokenExpiry).isBefore(moment())) {
    // Refresh access token
    try {
      var res = HTTP.post(this.endpoints.tokenRequest, {
        params: {
          grant_type: 'refresh_token',
          refresh_token: this.config.refreshToken,
          scope: this.config.siteId
        },
        headers: {
          Authorization: this.authorizationHeader()
        }
      });
      check(res.statusCode, 200);
      this.config.accessToken = res.data.access_token;
      this.config.accessTokenExpiry = moment().add(Number(res.data.expires_in), 's');
      this.config.refreshToken = res.data.refresh_token;
    }
    catch(e) {
      throw new Error('Unable to refresh API access token!');
    }
  }

  return this.config.accessToken;
};

// Product search
Linkshare.prototype.productSearch = function(params, done) {
  HTTP.get(this.endpoints.productSearch, {
    params: params,
    headers: {
      Authorization: 'Bearer ' + this.accessToken()
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

Package.describe({
  summary: "Rakuten Affiliate Network (Linkshare) API wrapper for Meteor",
  version: "2.0.0",
  git: "https://github.com/bredikhin/meteor-linkshare"
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.0');
  api.use(['http', 'check', 'mrt:moment@2.8.1'], 'server');
  Npm.depends({xml2js: "0.4.4"});
  api.addFiles(['linkshare.js'], 'server');

  if (api.export) {
    api.export('Linkshare');
  }
});

Package.onTest(function(api) {
  api.versionsFrom('METEOR@1.0');
  api.use(['tinytest', 'check', 'mrt:moment@2.8.1'], 'server');
  Npm.depends({xml2js: "0.4.4"});
  api.addFiles('linkshare.js', 'server');
  api.addFiles('linkshare_tests.js', 'server');
});

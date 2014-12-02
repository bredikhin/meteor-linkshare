# Rakuten Affiliate Network (Linkshare) API wrapper for Meteor

Provides product search functionality on the server.

## Installation

`meteor add bredikhin:linkshare`

## Usage

```javascript
var config = {
  siteId: 12345,
  username: '<your Linkshare username>',
  password: '<your password>',
  consumerKey: 'get it on http://developers.rakutenmarketing.com/',
  consumerSecret: 'get it on http://developers.rakutenmarketing.com/'
};
var linkshare = new Linkshare(config);

// Find products
linkshare.productSearch({keyword: 'McQueen'}, function(err, res) {
  if (err)
    return console.log(err);

  console.log(JSON.stringify(res));
});
```

## Response formats

### Product search

```json
{
  "TotalMatches": [
    "..."
  ],
  "TotalPages": [
    "..."
  ],
  "PageNumber": [
    "1"
  ],
  "item": [
    {
      "mid": [
        "..."
      ],
      "merchantname": [
        "..."
      ],
      "linkid": [
        "..."
      ],
      "createdon": [
        "2014-07-22/16:17:47"
      ],
      "sku": [
        "..."
      ],
      "productname": [
        "..."
      ],
      "category": [
        {
          "primary": [
            " MEN "
          ],
          "secondary": [
            "  MEN~~SALE - Up to 70% Off~~SHOES, BOOTS & Sneakers "
          ]
        }
      ],
      "price": [
        {
          "_": "...",
          "$": {
            "currency": "USD"
          }
        }
      ],
      "upccode": [
        ""
      ],
      "description": [
        {
          "short": [
            "Sneakers by Alexander McQueen."
          ],
          "long": [
            "ABOUT ALEXANDER MCQUEEN Alexander McQueen is ..."
          ]
        }
      ],
      "saleprice": [
        {
          "_": "...",
          "$": {
            "currency": "USD"
          }
        }
      ],
      "keywords": [
        "alexander~~mcqueen~~sneakers~~alexander mcqueen..."
      ],
      "linkurl": [
        "..."
      ],
      "imageurl": [
        "..."
      ]
    }
  ]
}
```

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014 [Ruslan Bredikhin](http://ruslanbredikhin.com/)

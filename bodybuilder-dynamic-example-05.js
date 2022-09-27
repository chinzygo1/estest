var bodybuilder = require('bodybuilder');
var body = bodybuilder();
const req = {
  "where": {
    "and": [
      {
        "or": [
          {
            "and": [
              {
                "given_name": {
                    "equals": "Chris"
                }               

              },
              {
                "email" : {
                    "equals": "chris@go1.com"
                }
              }
            ]
          },
          {
            "and": [
              {
                "given_name" : {
                    "match_phrase": "Chin"
                }
              },
              {
                "email" : {
                    "notequals": "chinzy@go1.com"
                }
              }
            ]
          }
        ]
      },
      {
        "company" : {
            "exists": "company"
        }
      }
    ]
  }
};

if (req.where) {
  var bodyBuilder = bodybuilder();
  var childKeys = Object.keys(req.where);

  
  childKeys.forEach((key) => {
    switch (key) {
      case 'and':
      bodyBuilder.andFilter(getSubFilterRecursive(req.where[key]))
      
      break;
    }

    // console.log(JSON.stringify(bodyBuilder.build()));
  });


}

function getSubFilterRecursive(currentNode, builder = body) {

  var childKeys = Object.keys(currentNode);

  if (childKeys < 1) {
    return;
  }

  if (Array.isArray(currentNode)) {
    currentNode.forEach((node) => {

      var keys = Object.keys(node);
     var key = keys[0];

      switch (key) {
        case 'and':
          return builder.andFilter(getSubFilterRecursive(node[key], builder));
          break;
        case 'or':
          return builder.orFilter(getSubFilterRecursive(node[key], builder));
          break;
        default:
            console.log(node);
      }

      var innerKey = Object.keys(node[key]);

      switch (innerKey[0]) {
        case 'equals':
            builder.filter(key, node[key]);
            break;
        
        case 'notequals':
            builder.notFilter(key, node[key]);
            break;

        case 'match_phrase':
            builder.filter('match_phrase',key, node[key]);
            break;

        case 'exists':
            builder.filter('exists','field',key);
            break;
            

      }
    });
  }
}

const res2 = body.build() // Build 2.x or greater DSL (default)
// console.log(JSON.stringify(res2));

// bodybuilder()
//         .andFilter('bool', b => b
//         	  .orFilter('bool', c => c
//                     .andFilter('bool', b => b
//       					.filter('match', 'message', 'this is a test')
//       					.filter('term', 'type', 'comment'))
//                     .andFilter('bool', b => b
//       					.filter('match', 'message', 'this is a test')
//       					.filter('term', 'type', 'comment'))
//                 )
//                 .filter('match', 'type', 'hey')
//               )
//               .build()

// {
//   "query": {
//     "bool": {
//       "filter": {
//         "bool": {
//           "must": {
//             "term": {
//               "portal_id": "12"
//             }
//           },
//           "should": [
//             {
//               "bool": {
//                 "must": [
//                   {
//                     "bool": {
//                       "must": [
//                         {
//                           "term": {
//                             "family_name": "test"
//                           }
//                         },
//                         {
//                           "term": {
//                             "given_name": "jay"
//                           }
//                         }
//                       ]
//                     }
//                   },
//                   {
//                     "bool": {
//                       "must_not": [
//                         {
//                           "term": {
//                             "family_name": "test123"
//                           }
//                         },
//                         {
//                           "term": {
//                             "given_name": "jay"
//                           }
//                         }
//                       ]
//                     }
//                   }
//                 ]
//               }
//             }
//           ]
//         }
//       }
//     }
//   }
// }
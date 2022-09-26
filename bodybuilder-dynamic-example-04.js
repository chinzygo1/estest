var bodybuilder = require('bodybuilder');

const req = {
  "filter": {
    "and": [
      {
        "or": [
          {
            "and": [
              {
                "fieldname" : "given_name",
                "value": "Chris",
                "operator": "equals"
              },
              {
                "fieldname" : "email",
                "value": "chris@go1.com",
                "operator": "equals"
              }
            ]
          },
          {
            "and": [
              {
                "fieldname" : "given_name",
                "value": "Chinzy",
                "operator": "equals"
              },
              {
                "fieldname" : "email",
                "value": "chinzy@go1.com",
                "operator": "equals"
              }
            ]
          }
        ]
      },
      {
        "fieldname" : "company",
        "value": "go1",
        "operator": "notequals"
      }
    ]
  }
};

if (req.filter) {
  var bodyBuilder = bodybuilder();
  var childKeys = Object.keys(req.filter);

  
  childKeys.forEach((key) => {
    switch (key) {
      case 'and':
      bodyBuilder.andFilter(getSubFilterRecursive(req.filter[key], bodyBuilder))
      
      break;
    }

    console.log(JSON.stringify(bodyBuilder.build()));
  });


}

function getSubFilterRecursive(currentNode, builder) {

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
        case 'or':
          return builder.orFilter(getSubFilterRecursive(node[key], builder));
        default:
            console.log(node);
      }
    });
  }
}

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
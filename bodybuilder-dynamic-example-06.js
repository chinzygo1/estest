var bodybuilder = require('bodybuilder');

const req = {
    "where": [
            {
                "family_name": {
                    "equals": "test"
                }
            },
            {
                "email" : {
                    "notequals": "testa1@rest.com"
                }
            }
    ],
   "from": 0,
   "size":200
};

var body = bodybuilder();

createQuery(req);

function createQuery(req) {
    var childKeys = Object.keys(req);
    childKeys.forEach((key) => {

        switch (key) {
            case 'from':
                body.from(req[key]);
                break;
        
            case 'size':
                body.size(req[key]);
                break;

            case 'where': 
                getSubFilterRecursive(req[key]);
                break;
        }
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
        case 'or':
          return builder.orFilter(getSubFilterRecursive(node[key], builder));
      }

      var innerKey = Object.keys(node[key]);

      switch (innerKey[0]) {
        case 'equals':
            builder.filter(key, node[key]);
            break;
        
        case 'notequals':
            builder.notFilter(key, node[key]);
            break;

      }
    });
  }
}


const res2 = body.build() // Build 2.x or greater DSL (default)
console.log(JSON.stringify(res2));

// {
//   "from": 0,
//   "size": 200,
//   "query": {
//     "bool": {
//       "filter": {
//         "bool": {
//           "must": {
//             "family_name": {
//               "equals": "test"
//             }
//           },
//           "must_not": [
//             {
//               "email": {
//                 "notequals": "testa1@rest.com"
//               }
//             }
//           ]
//         }
//       }
//     }
//   }
// }
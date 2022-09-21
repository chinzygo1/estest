const esb = require('elastic-builder'); // the builder

const requestBody = esb.requestBodySearch().query(
  esb.boolQuery()
    .must(esb.matchQuery('given_name', 'chinthaka'))
    .filter(esb.multiMatchQuery(['given_name', 'family_name'], 'chinthaka')
    .type('phrase')
    .lenient(true))
).sorts([
    esb.sort('given_name', 'asc')
]).from(0).size(200);

const res = requestBody.toJSON();
console.log(JSON.stringify(res)); // or print to console - esb.prettyPrint(requestBody)

// ====== RESULT =====
// {
//    "query":{
//       "bool":{
//          "must":{
//             "match":{
//                "given_name":"chinthaka"
//             }
//          },
//          "filter":{
//             "multi_match":{
//                "query":"chinthaka",
//                "fields":[
//                   "given_name",
//                   "family_name"
//                ],
//                "type":"phrase",
//                "lenient":true
//             }
//          }
//       }
//    },
//    "sort":[
//       {
//          "given_name":"asc"
//       }
//    ],
//    "from":0,
//    "size":200
// }
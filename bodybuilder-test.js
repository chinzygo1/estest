var bodybuilder = require('bodybuilder');

var body = bodybuilder()
        .query('match', 'given_name', 'chinthaka')
        .filter('multi_match', {
      	 query: 'chinthaka',
          type: 'phrase',
          lenient: true,
          fields: ['given_name', 'family_name']
        })
        .sort([{"categories": "asc"}])
        .size(200)
		.from(0);
const res = body.build() // Build 2.x or greater DSL (default)
console.log(JSON.stringify(res));

// =========== RESULT =====

// {
//    "sort":[
//       {
//          "categories":{
//             "order":"asc"
//          }
//       }
//    ],
//    "size":200,
//    "from":0,
//    "query":{
//       "bool":{
//          "filter":{
//             "multi_match":{
//                "query":"chinthaka",
//                "type":"phrase",
//                "lenient":true,
//                "fields":[
//                   "given_name",
//                   "family_name"
//                ]
//             }
//          },
//          "must":{
//             "match":{
//                "given_name":"chinthaka"
//             }
//          }
//       }
//    }
// }
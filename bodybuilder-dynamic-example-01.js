var bodybuilder = require('bodybuilder');

const req = {
    "filter": {
          "fields": [
            {
                "eq": [
                    {
                        "fieldname" : "family_name",
                        "value": "test"
                
                    },
                    {
                        "fieldname" : "email",
                        "value": "test@rest.com"
                
                    },
                ],
            }
            ,
            {
                "neq": [
                    {
                        "fieldname" : "given_name",
                        "value": "sample"
                
                    }
                ]
            }
        ]
    },
    "search": [{ 
        "multi": [
            { 
                "option":"fields",
                "option_value": ['family_name', 'given_name']
            },
            { 
                "option":"query",
                "option_value": "chinthaka"
            },
            { 
                "option":"type",
                "option_value": "phrase"
            },
            { 
                "option":"lenient",
                "option_value": true
            }
        ],
        }],
    "sort":[
      {
        "fieldname" : "family_name",
        "order": "asc"
      }
   ],
   "additional_details": [
        {
           "field_key" : "from",
            "value": 0
        },
        {
           "field_key" : "size",
            "value": 200
        }

   ]
};

var body = bodybuilder();
// processing the filters
if (req.filter && req.filter.fields.length > 0) {
    req.filter.fields.forEach((item) => {
        let key = Object.keys(item);
        switch (key[0]) {
            case 'eq':
                if (item.eq.length > 0) {
                    item.eq.forEach((innerItem) => {
                        body.query('term', innerItem.fieldname, innerItem.value);
                    })
                }
                
                break;
        
            case 'neq':
                if (item.neq.length > 0) {
                    item.neq.forEach((innerItem) => {
                        body.notQuery('term', innerItem.fieldname, innerItem.value);
                    })
                }
                break;
        }
    });
}

// if someone does a general search on the searchbox
if (req.search) {
    let obj = {};
    req.search.forEach((val) => {
        val.multi.forEach((innerVal) => {
            
            obj[innerVal.option] = innerVal.option_value;

        });
        body.filter('multi_match', obj);
    });
}

// sorting 
if (req.sort && req.sort.length > 0) {
    let obj = [];
    req.sort.forEach((val) => {
        var o = {};
        o[val.fieldname] = val.order;
        obj.push(o);
    });
    body.sort(obj);
}

// additional columns
if (req.additional_details && req.additional_details.length > 0) {
    req.additional_details.forEach((val) => {
        switch (val.field_key) {
            case 'size':
                body.size(val.value);
                break;
        
            case 'from':
                body.from(val.value);
                break;
        }
    });
}

const res2 = body.build() // Build 2.x or greater DSL (default)
console.log(JSON.stringify(res2));

// {
//    "sort":[
//       {
//          "family_name":{
//             "order":"asc"
//          }
//       }
//    ],
//    "from":0,
//    "size":200,
//    "query":{
//       "bool":{
//          "filter":{
//             "multi_match":{
//                "fields":[
//                   "family_name",
//                   "given_name"
//                ],
//                "query":"chinthaka",
//                "type":"phrase",
//                "lenient":true
//             }
//          },
//          "must":[
//             {
//                "term":{
//                   "family_name":"test"
//                }
//             },
//             {
//                "term":{
//                   "email":"test@rest.com"
//                }
//             }
//          ],
//          "must_not":[
//             {
//                "term":{
//                   "given_name":"sample"
//                }
//             }
//          ]
//       }
//    }
// }
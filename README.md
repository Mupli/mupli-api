
# API module for Mupli 

## Description 
Module to setup Rest api for multiple projects without boilerplate code. add  

## Specs
- module name : api
- path prefix: /api
- supported files : js, json 

##  project project 

/config/apps.json 

```json
{
    "customProjectName": {
        "hosts": ["localhost", 
            // "support multi domains", "my-local", 
        ],
        "modules": ["api",
        //some other if needed "page" ,"store", "react", "users", "security", "security-auth", "aws", "files", "services", "products", "media", "cron"
        ]
    },
}
```

/app/app.js

```javascript

import {Mupli} from "mupli-core"
import {ApiModule} from "mupli-api"


Mupli.init()
    .module(new ApiModule())
    .listen(3000)
```


/app/customProjectName/api
    ./someFile.js

```javascript

import {isMethod} from "mupli-middlewares"

// -- /api/someFile
export function init(ctx) {
    return "init OK"

}
// -- /api/someFile/super 
export async function super(ctx) {
    return ctx.res.status(201).json({
        message: "super accepted"
    })
}
// -- /api/someFile/doSomething 
export const doSomething = [
    //... middlewares if needed
    isAuthenticated(),
    isMethod("post"),
    hasRole("POSTMAN"),
    hasHeader("header"),
    isResourceOwner(),
    // isFileUpload()    

   controllerAction
]

const controllerAction =  async (ctx) => {
    //..your logic here 

    return {
        message: "post test"
    } // 200 OK
}

```

Got to:
* GET localhost:3000/api/someFile
* GET localhost:3000/api/someFile/super
* POST localhost:3000/api/someFile/doSomething  




## other example 
Example with mupli-middleware and executeOn to handle POST,GET,PATCH,DELETE methods for one uri.

file: project/api/users.js

```javascript

// path - /api/users/test
export const test = [
    isAuthenticated(),
    async (ctx) => ctx.res.ok().text("OK"),
]

// path - /api/users
export const init = [
    isAuthenticated(),
    executeOn(isMethod("get"), findUsers),
    executeOn(isMethod("post"), [ validateAjv(User.SCHEMA), createUser ]),
    executeOn(isMethod("put"),  [ validateAjv(User.SCHEMA), updateUser ]),
    executeOn(isMethod("patch"), partialUserUpdate),
    (ctx) => ctx.res.notFound(),
];
```

Note: It is encuraged to create own middlewares for your needs for example: 
- isRequest(method, mandatoryHeaders... )
- loadProductById...
- isOauth 
- hasProduct
- isJsonFormatPatch..

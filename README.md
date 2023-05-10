
# API module for Mupli 

## Description 
Module to setup Rest api for multiple projects without boilerplate code. add  

## Specs
- module name : api
- path prefix: /api
- supported files : js, json 

## 
setup project 

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

export function init(ctx) {
    return "init OK"

}

export async function super(ctx) {
    return ctx.res.status(201).json({
        message: "super accepted"
    })
}

export const test = [
    //... middlewares if needed
    
    isMethod("post"),
    // hasRole("POSTMAN"),
    // hasHeader("header"),
    // isResourceOwner()
    // isFileUpload()
    
    //OR custom middleware:
    async (ctx) => {
        //my custom code ..
        console.log("custom")
    },
    
    async (ctx) => {

        if (!ctx.req.is("POST")) {
            //or manual check
            return ctx.res.status(405); 
        }

        return {
            message: "post test"
        } // 200 OK
    }
]

```

Got to:
* GET localhost:3000/api/someFile
* GET localhost:3000/api/someFile/super
* POST localhost:3000/api/someFile/test  



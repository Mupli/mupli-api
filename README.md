
# API module for Mupli 

- module name : api
- path prefox: /api
- supported files : js, json 

## 
setup project 

/config/apps.json 

```json
{
    "customName": {
        "hosts": ["fit.local", "fit.mupli.us"],
        "modules": ["page", "api","store", "users", "security", "security-auth", "aws", "files", "services", "products", "media", "cron"]
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


/app/customName
 /api
    - someFile.js

```javascript

import {isMethods} from "mupli-middlewares"

export function init(ctx) {
    return {
        health: "init OK"
    }

}

export async function super(ctx) {
    return {
        health: "super"
    }

}

export const test = [
    isMethods("post"),
    //... middlewares if needed 
    async (ctx) => {
        return {
            health: "post test"
        }
    }]

```

Got to:
* GET localhost:3000/api/someFile
* GET localhost:3000/api/someFile/super
* POST localhost:3000/api/someFile/test  



## Ideas 
- adding support for static files generation or static responses
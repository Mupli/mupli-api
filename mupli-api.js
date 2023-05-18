import { CoreUtils, FileDetails, FileLoader } from "mupli-core";

export class ApiModule {
    moduleName;
    _routerPrefix;
    _routes = {};

    constructor(config = { routerPrefix: undefined, moduleName: undefined }) {
        this._routerPrefix = config.routerPrefix ?? "/api";
        this.moduleName = config.moduleName ?? "api";
    }

    async init(appName, config) {
        const me = this;
        const routes = this._routes;
        routes[appName] = {};

        let files = CoreUtils.getFiles(appName, config) //
            .filter((x) => x.is("js") || x.is("json"));

        for (const key in files) {
            /**
             * @type {FileDetails}
             */
            const fd = files[key];

            if (fd.moduleFilePath.indexOf("/_") < 0) {
                if (fd.is("js")) {
                    let actions = await this._getActions(fd);

                    Object.keys(actions).forEach((key) => {
                        let action = actions[key];
                        routes[appName][this._routerPrefix + fd.route + key] =
                            action;
                    });
                } else if (fd.is("json")) {
                    const jsonString = FileLoader.load(fd);

                    routes[appName][this._routerPrefix + fd.route] = async (
                        ctx
                    ) => {
                        return jsonString;
                    };
                }
            }
        }
    }

    async _getActions(actionFd) {
        const module = await FileLoader.asObject(actionFd);

        const methodNames = Object.keys(module).filter(
            (methodName) => !methodName.startsWith("_")
        );

        if (methodNames.length <= 0)
            throw new Error(
                "No '" +
                    actionFd.name +
                    "' or 'init' method in file: " +
                    actionFd.filePath
            );

        const actions = {};
        methodNames.forEach((m) => {
            if (m == "init") {
                actions[""] = module[m];
            } else {
                actions["/" + m] = module[m];
            }
        });
        return actions;
    }

    routes({appName}) {
        return this._routes[appName];
    }
}

export const apiModule = new ApiModule();

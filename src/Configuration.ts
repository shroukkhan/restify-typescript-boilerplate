/**
 * Copyright 2018, Danang Galuh Tegar Prasetyo.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

import * as restify from 'restify';

export default class Configuration {

    private _app: any;
    private _server: any;
    private _sentry: any;
    
    constructor() {
        this._app = {
            name: process.env.APP_NAME || 'Restify TypeScript API',
            version: process.env.APP_VERSION || '1.0.0',
            author: {
                name: process.env.APP_AUTHOR_NAME || 'Danang Galuh Tegar Prasetyo',
                url: process.env.APP_AUTHOR_URL || 'https://github.com/danang-id',
            },
            developer: process.env.APP_DEVELOPER || 'https://github.com/danang-id and the Restify TypeScript API team',
            env: process.env.NODE_ENV || 'production',
        };
        this._server = {
            port: process.env.SERVER_PORT || 61000
        };
        this._sentry = {
            DSN: process.env.SENTRY_DSN
        }
    }

    public get app(): any {
        return this._app;
    }

    public get server(): any {
        return this._server;
    }

    public get sentry(): any {
        return this._sentry;
    }

    public get expectsRavenHandler(): boolean {
        return (null != this._sentry.DSN && '' != this._sentry.DSN);
    }

}
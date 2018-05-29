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
import * as errors from 'restify-errors';
import * as figlet from 'figlet';

import Configuration from './Configuration';
import Console from './Console';
import Middleware from './Middleware';
import Router from "./Router"; 
import * as Raven from "raven-js";

export default class App {

    private _config: Configuration;
    private _middleware: Middleware;
    private _router: Router;
    public server: any;

    constructor(config: Configuration = new Configuration(), middleware: Middleware = new Middleware(), router: Router = new Router()) {
        new Console('log', `Initialising application...`); 
        this._config = config;
        this._middleware = middleware;
        this._router = router;
        this.server = restify.createServer({
            name: this._config.app.name,
            version: this._config.app.version,
        });
        if (this._config.expectsRavenHandler)
            Raven.config(this._config.sentry.DSN, { 
                allowSecretKey: true
            }).install();
        this.mountMiddlewares();
        this.mountRoutes();
    }

    protected mountMiddlewares(middleware: Middleware = this._middleware) {
        new Console('log', `Setting up middleware...`); 
        middleware.set(this.server);
    }

    protected mountRoutes(router: Router = this._router): void {
        new Console('log', `Setting up routes...`);   
        router.set(this.server);
    }

    protected onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') {
            new Console('error', `${error}`)
            throw error;
        }
        switch (error.code) {
            case 'EACCES':
                new Console('error', `Cannot start application: ${ this._config.app.name} requires elevated privileges.`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                new Console('error', `Cannot start application: the port ${this._config.server.port} is already in use.`);
                process.exit(1);
                break;
            default:
                new Console('error', `${ error }`);
                throw error;
        }
        if (this._config.expectsRavenHandler) {
            const ex = new Error(`${error}`);
            RavenClient.captureException(ex, {}, function (sendErr, eventId) {
                if (sendErr) {
                    new Console('warning', `Failed to send captured error to Sentry. ${ sendErr }`);
                } else {
                    new Console('info', `Error has been reported to Sentry with Event ID ${eventId}`);
                }
            });
        }
    }

    protected onFigletExecution(error: any, data: any): void {
        if (error && this._config.app.env != 'production') new Console('error', error);
        else {
            new Console();
            new Console('log',
                ``,
                data,
                ``,
                `${this._config.app.name} v${this._config.app.version} © ${new Date().getFullYear()} ${this._config.app.author.name}. All right reserved.`,
                `Back-End REST API developed by ${this._config.app.developer}.`,
                `Made available by open-source technologies.`,
                ``,
                `Application ready to accept connections.`,
                `Listening at ${this.server.url}.`
            );
            if (this._config.expectsRavenHandler) new Console('log', 
                `Sentry Error Reporting is active.`,
                ``
            );
        }
    }

    protected onListening(): void {
        figlet(this._config.app.name, 'ANSI Shadow', this.onFigletExecution.bind(this));
    }

    protected onRestifyError(request: restify.Request, response: restify.Response, error: any, callback: Function): void {
        new Console('error', `${error}`);
        if (this._config.expectsRavenHandler) {
            const ex = new Error(`${error}`);
            RavenClient.captureException(ex, {}, function (sendErr, eventId) {
                if (sendErr) {
                    new Console('warning', `Failed to send captured error to Sentry. ${ sendErr }`);
                } else {
                    new Console('info', `Error has been reported to Sentry with Event ID ${eventId}`);
                }
            });
        }
        return callback();
    }

    public start(): void {
        this.server.listen(this._config.server.port);
        this.server.on('error', this.onError.bind(this));
        this.server.on('restifyError', this.onRestifyError.bind(this));
        this.server.on('listening', this.onListening.bind(this));
    }

}
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
import * as Raven from 'raven-js';

import Configuration from './Configuration';
import Middleware from './Middleware';
import Router from './Router';

export default class App {

    private _config: Configuration;
    private _middleware: Middleware;
    private _router: Router;
    public server: any;

    constructor(config: Configuration = new Configuration(), middleware: Middleware = new Middleware(), router: Router = new Router()) {
        console.log(`Intializing application...`); 
        this._config = config;
        this._middleware = middleware;
        this._router = router;
        this.server = restify.createServer({
            name: this._config.app.name,
            version: this._config.app.version,
            handleUncaughtExceptions: this._config.ravenHandler,
        });
        if (this._config.ravenHandler)
            Raven.config(this._config.sentry.DSN)
                .install();
        this.mountMiddlewares();
        this.mountRoutes();
    }

    protected mountMiddlewares(middleware: Middleware = this._middleware) {
        console.log(`Setting up middleware...`); 
        middleware.set(this.server);
    }

    protected mountRoutes(router: Router = this._router): void {
        console.log(`Setting up routes...`);        
        router.set(this.server);
    }

    protected onError(error: NodeJS.ErrnoException): void {
        if (this._config.ravenHandler) {
            Raven.captureException(error);
        }
        if (error.syscall !== 'listen') {
            throw error;
        }
        switch (error.code) {
            case 'EACCES':
                console.error(`[ERROR] Cannot start application: ${ this._config.app.name} requires elevated privileges.`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`[ERROR] Cannot start application: the port ${this._config.server.port} is already in use.`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    protected onFigletExecution(error: any, data: any): void {
        if (error && this._config.app.env != 'production') console.error(error);
        else {
            console.clear();
            console.log(``);
            console.log(data);
            console.log(``);
            console.log(`${this._config.app.name} v${this._config.app.version} © ${new Date().getFullYear()} ${this._config.app.author.name}. All right reserved.`);
            console.log(`Back-End REST API developed by ${this._config.app.developer}.`);
            console.log(`Made available by open-source technologies.`);
            console.log(``);
            console.log(`Application ready to accept connections.`);
            console.log(`Listening at ${this.server.url}.`);
            if (this._config.ravenHandler) console.log(`Sentry Error Reporting is active.`)
            console.log(``);
        }
    }

    protected onListening(): void {
        figlet(this._config.app.name, 'ANSI Shadow', this.onFigletExecution.bind(this));
    }

    protected onRestifyError(request: restify.Request, response: restify.Response, error: any, callback: Function): void {
        if (this._config.ravenHandler) {
            Raven.captureException(error);
        }
        return callback();
    }

    protected onUncaughtException(request: restify.Request, response: restify.Response, error: any, callback: Function): void {
        if (this._config.ravenHandler) {
            Raven.captureException(error);
        }
        error = new errors.InternalServerError({
            cause: error,
            info: { request: request }
        }, 'An Internal Server error has been occured.');
        return callback();
    }

    public start(): void {
        this.server.listen(this._config.server.port);
        this.server.on('error', this.onError.bind(this));
        this.server.on('restifyError', this.onRestifyError.bind(this));
        this.server.on('uncaughtException', this.onUncaughtException.bind(this));
        this.server.on('listening', this.onListening.bind(this));
    }

}
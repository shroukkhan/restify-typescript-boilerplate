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

import { AxiosRequestConfig } from 'axios';

import DataFetcher from './../network/DataFetcher';

export default class APIClient {

    private _node: string;
    private _endpoint: string;
    private _httpMethods: any;
    private _instance: DataFetcher;

    constructor(node: string, endpoint?: string) {
        this._node = node;
        this._endpoint = endpoint;
        this._httpMethods = Object.freeze({
            GET: 'GET',
            HEAD: 'HEAD',
            POST: 'POST',
            PUT: 'PUT',
            PATCH: 'PATCH',
            DELETE: 'DELETE',
            OPTIONS: 'OPTIONS',
        });
        this._instance = new DataFetcher({
            baseURL: this._node
        });
    }

    protected get HTTP_METHOD(): any {
        return this._httpMethods;
    }

    private createRequestConfig(requestConfig: any): AxiosRequestConfig {
        return (requestConfig.method === "GET" || requestConfig.method === "HEAD" || requestConfig.data === null) ? {
            headers: {
                'Content-Type': 'application/json'
            },
            method: requestConfig.method,
        } : {
            headers: { 
                'Content-Type': 'application/json' 
            },
            method: requestConfig.method,
            data: requestConfig.data
        };
    }

    protected setEndpoint(endpoint: string): void {
        this._endpoint = endpoint;
    }

    protected execute(method: string, callback: Function, data: any = null): void {
        new Promise(resolve => resolve({method: method, data: data}))
            .then(this.createRequestConfig.bind(this))
            .then((requestConfig: AxiosRequestConfig) => {
                this._instance.setRequestConfig(requestConfig);
                this._instance.setCallback(callback);
                this._instance.sendRequest();
            })
            .catch(error => {
                throw error;
            });
    }

}

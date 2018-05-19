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

import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

export default class DataFetcher {

    private _baseRequestConfig: AxiosRequestConfig;
    private _requestConfig: AxiosRequestConfig;
    private _callback: Function;
    private _instance: AxiosInstance;

    constructor(requestConfig: AxiosRequestConfig, callback?: Function) {
        this._callback = callback;
        this._baseRequestConfig = requestConfig;
        this._requestConfig = null;
        this._instance = axios.create(this._requestConfig);
    }

    private processResponse(response: any): void {
        this._callback(true, response, {
            baseRequestConfig: this._baseRequestConfig,
            requestConfig: this._requestConfig
        });
    }

    private handleError = (error: any): void => {
        this._callback(false, error, {
            baseRequestConfig: this._baseRequestConfig,
            requestConfig: this._requestConfig
        });
    }

    public setRequestConfig = requestConfig => {
        this._requestConfig = requestConfig;
    }

    public setCallback = callback => {
        this._callback = callback;
    }

    public sendRequest = (): void => {
        if (null === this._requestConfig || null === this._callback)
            throw new Error(`Property requestConfig and callback of DataFetcher cannot be null when the object is making request. Try calling setCallback() and setRequestConfig() before sendRequest().`);
        this._instance.request(this._requestConfig)
            .then(this.processResponse.bind(this))
            .catch(this.handleError.bind(this));
    }

}
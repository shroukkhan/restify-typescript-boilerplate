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

import APIClient from './APIClient';

export default class ExampleAPI extends APIClient {

    constructor() {
        super(process.env.EXAMPLE_API_SERVER);
    }

    public getMessage(callback: Function, ...parameters: Array<string>) {
        super.setEndpoint(`message`);
        super.execute(super.HTTP_METHOD.GET, callback);
    }

    public getMessageWithParameter(callback: Function, ...parameters: Array<string>) {
        super.setEndpoint(`message/${parameters[0]}`);
        super.execute(super.HTTP_METHOD.GET, callback);
    }

    public getMessageWithParameters(callback: Function, ...parameters: Array<string>) {
        super.setEndpoint(`message/${parameters[0]}/${parameters[1]}`);
        super.execute(super.HTTP_METHOD.GET, callback);
    }

    public storeMessage(callback: Function, data: any = null, ...parameters: Array<string>) {
        super.setEndpoint(`message`);
        super.execute(super.HTTP_METHOD.POST, callback, data);
    }


}
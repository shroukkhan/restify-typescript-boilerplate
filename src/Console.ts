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

import * as moment from 'moment';

export default class Console {

    constructor(...strings: Array<string>) {
        if (strings.length <= 0) {
            new Console('clear');
        } else if (strings.length == 1) {
            if (strings[0] == 'clear') console.clear();
            else new Console('info', strings[0]);
        } else if (strings[0] == 'info' || strings[0] == 'warning' || strings[0] == 'error' || strings[0] == 'log') {
            switch(strings[0]) {
                case 'warning':
                    for (let index = 1; index < strings.length; index++) {
                        const string = strings[index];
                        console.warn(`[WARNING] ${moment().format()}: ${ string }`);
                    }
                    break;
                case 'error':
                    for (let index = 1; index < strings.length; index++) {
                        const string = strings[index];
                        console.error(`[ERROR] ${moment().format()}: ${ string }`);
                    }
                break;
                case 'log':
                    for (let index = 1; index < strings.length; index++) {
                        const string = strings[index];
                        console.log(string);
                    }
                    break;
                case 'info':
                default:
                    for (let index = 1; index < strings.length; index++) {
                        const string = strings[index];
                        console.log(`[INFO] ${moment().format()}: ${ string }`);
                }
            }
        } else for (let index = 1; index < strings.length; index++) {
            const string = strings[index];
            new Console('info', string);
        }
    }

}
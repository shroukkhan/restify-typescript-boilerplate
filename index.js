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

const dotenv = require('dotenv');
dotenv.config();

let app;
let moduleFound = false;

try {
    app = require('./build/App');
    moduleFound = true;
} catch (e1) {
    if (e1.code !== 'MODULE_NOT_FOUND') {
        throw e1;
    }
    try {
        app = require('./src/App');
        moduleFound = true;
    } catch (e2) {
        if (e2.code !== 'MODULE_NOT_FOUND') {
            throw e2;
        }
        console.error('[ERROR] Cannot start application: App module is not found.');
    }
}
if (moduleFound) {
    const appInstance = new app.default();        
    appInstance.start();
} else process.exit(1);
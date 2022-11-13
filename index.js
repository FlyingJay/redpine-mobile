/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */


// Hack to pass XHR through devtools
const _XHR = GLOBAL.originalXMLHttpRequest ?  
    GLOBAL.originalXMLHttpRequest :           
    GLOBAL.XMLHttpRequest                     
XMLHttpRequest = _XHR

import { useScreens } from 'react-native-screens';

useScreens();

import {AppRegistry} from 'react-native';
import App from './app/bootstrap.js';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

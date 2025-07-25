/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

function SiteNavigation(level, value) {
    return {
        level: level,
        value: value
    };
}

function ParameterError(message, paramName, paramValue) {
    return {
        message: message,
        paramName: paramName,
        paramValue: paramValue
    }
}

function ErrorResponseEntry() {
    return {
        global: [],
        parameter: [],
        getErrorMessages() {
            let msg = "<ul>";
            if (this.global && this.global.length > 0) {
                this.global.forEach(function (param) {
                    msg = msg + "<li>" + param.message + "</li>";
                });
            }

            if (this.parameter && this.parameter.length > 0) {
                this.parameter.forEach(function (param) {
                    msg = msg + "<li>" + param.paramName + "</li>";
                });
            }
            msg = msg + "</ul>";
            return msg;
        }
    };
}

function Certificate() {
    return {
        id: "",
        trusted: false,
        name: "",
        fingerprint: "",
        base64Key: "",
        configId: "",
        siteId: "",
        siteCfgId: ""
    };
}

function Configuration() {
    return {
        id: "",
        name: "",
        data: "",
        user: "",
        locked: false,
        version: "",
        comment: "",
        organizationId: "0"
    };
}

function OperationRecorder() {
    return {
        configuration: new Configuration(),
        module: "",
        leftMenu: "",
        preConfiguration: new Configuration()
    };
}

function UserProfile() {
    return {
        id: "",
        name: "",
        lastConfig: new OperationRecorder()
    };
}


function Task() {
    return {
        "id": "",
        "begin": "",
        "finish": "",
        "name": "",
        "status": "",
        "progress": 0,
        "user": "",
        "userId":""
    };
}

function Schedule(){
    return {
        "id": "",
        "begin": "",
        "finish": "",
        "name": "",
        "userId":""
    };
}








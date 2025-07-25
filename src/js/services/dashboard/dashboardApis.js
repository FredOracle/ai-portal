/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'baseService', 'const/constants', 'appController'],
    function (oj, ko, $, service, Constants, app) {
        "use strict";
        const rootURL = Constants.backendURL;

        const fetchDepartments = function () {
            return fetch(rootURL + "/departments").then(response => response.json());
        };


        return {
            fetchDepartments: fetchDepartments
        };
    });
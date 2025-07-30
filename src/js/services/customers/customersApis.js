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

        const rootURL = Constants.backendURL + "/project/";


        const fetchTasks = function() {
            return fetch(rootURL + "/tasks").then(response => response.json());
        };

        const fetchWeeks = function() {
            return fetch(rootURL + "/weeks").then(response => response.json());
        };

        const fetchDays = function() {
            return fetch(rootURL + "/days").then(response => response.json());
        };

        const fetchDependencies = function() {
            return fetch(rootURL + "/dependencies").then(response => response.json());
        };

        const deleteTask = function(id) {
            return fetch(rootURL + "/departments").then(response => response.json());
        };

        const updateTask = function(task) {
            return fetch(rootURL + "/departments").then(response => response.json());
        };


        return {
            fetchTasks: fetchTasks,
            fetchWeeks: fetchWeeks,
            fetchDays: fetchDays,
            fetchDependencies: fetchDependencies,
            deleteTask: deleteTask,
            updateTask: updateTask
        };
    });
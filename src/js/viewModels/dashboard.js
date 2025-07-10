/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 *  "require", "exports", "knockout", "ojs/ojbootstrap", "ojs/ojarraydataprovider", "text!../cookbook/dataCollections/table/shared/departmentData.json", "ojs/ojtable", "ojs/ojknockout"
 */
define(['../accUtils', "require", "exports", "knockout", "ojs/ojbootstrap", "ojs/ojarraydataprovider", "ojs/ojlistdataproviderview", "ojs/ojtable", "ojs/ojknockout"],
    function (accUtils, require, exports, ko, ojbootstrap_1, ArrayDataProvider, ListDataProviderView) {
        function DashboardViewModel() {
            // Below are a set of the ViewModel methods invoked by the oj-module component.
            // Please reference the oj-module jsDoc for additional information
            var self = this;
            self.serviceUrl = "http://localhost:3000/departments";
            self.columnArray = [
                {headerText: 'Department Id',  field: 'DepartmentId', id:'deptId'},
                {headerText: 'User Name', field: 'DepartmentName'},
                {headerText: 'Location Id', field: 'LocationId', id:'locId'},
                {headerText: 'Manager Id', field: 'ManagerId', id:'mgrId'}
            ];

            self.deptArray = ko.observableArray([]);
            self.dataprovider = new ArrayDataProvider(self.deptArray, { keyAttributes: 'DepartmentId' });
            self.dataproviderView = new ListDataProviderView(self.dataprovider, {
                sortCriteria: [{ attribute: 'DepartmentId', direction: 'descending' }]
            });


            self.loadData = function () {
                fetch(self.serviceUrl)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        self.deptArray(data);
                    });
            }


            /**
             * Optional ViewModel method invoked after the View is inserted into the
             * document DOM.  The application can put logic that requires the DOM being
             * attached here.
             * This method might be called multiple times - after the View is created
             * and inserted into the DOM and after the View is reconnected
             * after being disconnected.
             */
            this.connected = () => {
                accUtils.announce('Dashboard page loaded.', 'assertive');
                document.title = "Dashboard";
                self.loadData();
                console.log("----------------connected")
                // Implement further logic if needed
            };

            /**
             * Optional ViewModel method invoked after the View is disconnected from the DOM.
             */
            this.disconnected = () => {
                // Implement if needed
                console.log("----------------disconnected")
            };

            /**
             * Optional ViewModel method invoked after transition to the new View is complete.
             * That includes any possible animation between the old and the new View.
             */
            this.transitionCompleted = () => {
                // Implement if needed\

                console.log("----------------transitionCompleted")


            };
        }

        /*
         * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
         * return a constructor for the ViewModel so that the ViewModel is constructed
         * each time the view is displayed.
         */
        return DashboardViewModel;
    }
);

/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your about ViewModel code goes here
 */
define(['../accUtils', "require", "exports", "knockout", "ojs/ojbootstrap", "text!/js/mock/about/rowData.json", "text!/js/mock/about/depData.json", "ojs/ojarraydataprovider", "ojs/ojarraytreedataprovider", "ojs/ojconverter-datetime", "ojs/ojknockout-keyset", "ojs/ojknockout", "ojs/ojgantt", "ojs/ojcheckboxset", "ojs/ojformlayout"],
    function (accUtils, require, exports, ko, ojbootstrap_1, data, depData, ArrayDataProvider, ArrayTreeDataProvider, ojconverter_datetime_1, ojknockout_keyset_1) {
        function AboutViewModel() {
            // Below are a set of the ViewModel methods invoked by the oj-module component.
            // Please reference the oj-module jsDoc for additional information.
            var self = this;

            self.dataProvider = new ArrayTreeDataProvider(JSON.parse(data), {
                keyAttributes: 'id',
                childrenAttribute: 'rows'
            });
            self.dependenciesDataProvider = new ArrayDataProvider(JSON.parse(depData), {
                keyAttributes: 'id'
            });
            self.taskElementsDetails = [];
            self.togglesDetails = [];
            self.showAttribute = ko.observable(false);
            self.showOvertime = ko.observable(false);
            self.showDowntime = ko.observable(false);
            self.timeCursor = ko.observable('off');
            self.zooming = ko.observable('off');
            self.dndAction = ko.observable('(Move or Resize a Task)');
            self.handleTaskElementsSettings = (event) => {
                self.taskElementsDetails = event.detail.value;
                self.handleSettings(self.taskElementsDetails.concat(self.togglesDetails));
            };
            self.handleTogglesSettings = (event) => {
                self.togglesDetails = event.detail.value;
                self.handleSettings(self.taskElementsDetails.concat(self.togglesDetails));
            };
            self.handleSettings = (details) => {
                self.showAttribute(details.indexOf('attribute') !== -1);
                self.showOvertime(details.indexOf('overtime') !== -1);
                self.showDowntime(details.indexOf('downtime') !== -1);
                self.timeCursor(details.indexOf('timeCursor') !== -1 ? 'on' : 'off');
                self.zooming(details.indexOf('zooming') !== -1 ? 'on' : 'off');
            };
            self.handleMove = (event) => {
                const taskContexts = event.detail.taskContexts;
                const rowContext = event.detail.rowContext;
                const dropDate = event.detail.value;
                self.dndAction(`${taskContexts.length} task(s) dropped on ${rowContext.rowData.label} at ${dropDate}`);
            };
            self.handleResize = (event) => {
                const taskContexts = event.detail.taskContexts;
                const dropDate = event.detail.value;
                self.dndAction(`${taskContexts.length} task(s) resized to ${dropDate}`);
            };
            self.expanded = new ojknockout_keyset_1.ObservableKeySet().add(['Mixer A', 'Packaging A']);
            self.projectStartDate = new Date('2020-10-01T00:00:00');
            self.projectEndDate = new Date('2020-10-31T00:00:00');
            // 8 hours scale
            self.custom8HrScale = new DemoCustomScaleNHr(8);
            // Date converter
            self.dateConverter = new ojconverter_datetime_1.IntlDateTimeConverter({
                formatType: 'date',
                dateFormat: 'long'
            });
            self.timeConverter = new ojconverter_datetime_1.IntlDateTimeConverter({
                formatType: 'time'
            });
            self.currentDate = new Date('Oct 03, 2020, 17:00:00');
            self.currentDateString = self.currentDate.toISOString();
            self.currentDateFormatted = self.dateConverter.format(self.currentDateString);
            // set viewport to cover two days before and after
            self.day = 1000 * 60 * 60 * 24;
            self.viewportStart = new Date('Oct 03, 2020');
            self.viewportEnd = new Date(self.viewportStart.getTime() + 3 * self.day);
            self.referenceObjects = [
                {
                    value: self.currentDateString,
                    label: self.timeConverter.format(self.currentDateString),
                    svgClassName: 'demo-current-time-indicator'
                }
            ];
            self.getRowDesc = (row) => {
                const desc = [row.data.label];
                if (row.data.rows) {
                    desc.push(`${row.data.rows.length} siblings`);
                }
                desc.push('1 issue');
                return desc.join(', ');
            };
            // Helper function to get appropriate row label x position depending on document reading direction
            self.getRowLabelX = (rowAxisWidth) => {
                const dir = document.documentElement.getAttribute('dir');
                return dir === 'ltr' ? '0' : -rowAxisWidth;
            };



            




            /**
             * Optional ViewModel method invoked after the View is inserted into the
             * document DOM.  The application can put logic that requires the DOM being
             * attached here.
             * self method might be called multiple times - after the View is created
             * and inserted into the DOM and after the View is reconnected
             * after being disconnected.
             */
            self.connected = () => {
                accUtils.announce('About page loaded.', 'assertive');
                document.title = "About";
                // Implement further logic if needed
            };

            /**
             * Optional ViewModel method invoked after the View is disconnected from the DOM.
             */
            self.disconnected = () => {
                // Implement if needed
            };

            /**
             * Optional ViewModel method invoked after transition to the new View is complete.
             * That includes any possible animation between the old and the new View.
             */
            self.transitionCompleted = () => {
                // Implement if needed
            };
        }

        /*
         * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
         * return a constructor for the ViewModel so that the ViewModel is constructed
         * each time the view is displayed.
         */
        return AboutViewModel;
    }
);

/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your customer ViewModel code goes here
 */
define(['../accUtils', "require", "exports", "knockout", "ojs/ojbootstrap", "ojs/ojarraydataprovider", "ojs/ojknockout", "ojs/ojgantt", "ojs/ojformlayout"],
    function (accUtils,require, exports, ko, ojbootstrap_1, ArrayDataProvider) {
        function CustomerViewModel() {
            // Below are a set of the ViewModel methods invoked by the oj-module component.
            // Please reference the oj-module jsDoc for additional information.
            var self = this;

            self.projectStartDate = '2025-07-01';
            self.projectEndDate = '2025-10-01';
            self.viewportStart = '2021-01-04T01:00:00.000';
            self.viewportEnd = '2021-01-04T13:00:00.000';



            self.dragModeValue = ko.observable('pan');
            self.rowData = ko.observableArray([]);
            self.dataProvider = new ArrayDataProvider(this.rowData, {
                keyAttributes: 'resource'
            });
            self.handleMove = (event) => {
                const taskContexts = event.detail.taskContexts;
                // The first dataContext corresponds to the source task where the move was initiated
                const sourceTaskContext = taskContexts[0];
                // If multiple tasks dragged, figure out the offsets from the initial source task location,
                // so that we can reapply the same offset to the final drop location
                const timeOffsetFromReference = this.getTime(event.detail.start) - this.getTime(sourceTaskContext.data.start);
                const rowData = this.rowData();
                const targetRowInd = this.getRowInd(event.detail.rowContext.rowData.id);
                // if multiple tasks dragged, move all of them to the target row
                taskContexts.forEach((taskContext) => {
                    const sourceRowInd = this.getRowInd(taskContext.rowData.id);
                    const sourceTaskInd = this.getTaskInd(sourceRowInd, taskContext.data.id);
                    const taskDatum = rowData[sourceRowInd].tasks.splice(sourceTaskInd, 1)[0];
                    taskDatum.begin = this.getString(this.getTime(taskContext.data.start) + timeOffsetFromReference);
                    taskDatum.finish = this.getString(this.getTime(taskContext.data.end) + timeOffsetFromReference);
                    rowData[targetRowInd].tasks.push(taskDatum);
                });
                self.rowData(rowData);
            };
            self.handleResize = (event) => {
                const taskContexts = event.detail.taskContexts;
                // The first dataContext corresponds to the source task where the resize was initiated
                const sourceTaskContext = taskContexts[0];
                const deltaStartTime = this.getTime(event.detail.start) - this.getTime(sourceTaskContext.data.start);
                const deltaEndTime = this.getTime(event.detail.end) - this.getTime(sourceTaskContext.data.end);
                // if multiple tasks selected for resize, resize all of them according to how much the source task is resized
                // by updating the start and end time of the tasks in the data
                taskContexts.forEach((taskContext) => {
                    const taskStartTime = this.getTime(taskContext.data.start);
                    const taskEndTime = this.getTime(taskContext.data.end);
                    const newTaskStartTime = Math.min(taskEndTime, taskStartTime + deltaStartTime);
                    const newTaskEndTime = Math.max(taskStartTime, taskEndTime + deltaEndTime);
                    const rowInd = this.getRowInd(taskContext.rowData.id);
                    const taskInd = this.getTaskInd(rowInd, taskContext.data.id);
                    const taskDatum = this.rowData()[rowInd].tasks[taskInd];
                    taskDatum.begin = this.getString(newTaskStartTime);
                    taskDatum.finish = this.getString(newTaskEndTime);
                });
                // Notify subscribers that the underlying array of the observable array changed its state;
                // this will trigger the Gantt to refresh with the new data.
                this.rowData.valueHasMutated();
            };


            self.getRowInd = function (id) {
                return this.rowData()
                    .map((r) => r.resource)
                    .indexOf(id);
            }
            self.getTaskInd = function (rowInd, id) {
                return this.rowData()[rowInd].tasks.map((t) => t.id)
                    .indexOf(id);
            }
            self.getTime = function (isoString) {
                return new Date(isoString).getTime();
            }
            self.getString = function (time) {
                return new Date(time).toISOString();
            }


            self.serviceUrl = "http://localhost:3000/tasks";
            self.loadData = function () {
                fetch(self.serviceUrl)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        self.rowData(data);
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
                accUtils.announce('Customers page loaded.', 'assertive');
                document.title = "Customers";
                // Implement further logic if needed
                self.loadData();
            };

            /**
             * Optional ViewModel method invoked after the View is disconnected from the DOM.
             */
            this.disconnected = () => {
                // Implement if needed
            };

            /**
             * Optional ViewModel method invoked after transition to the new View is complete.
             * That includes any possible animation between the old and the new View.
             */
            this.transitionCompleted = () => {
                // Implement if needed
            };
        }

        /*
         * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
         * return a constructor for the ViewModel so that the ViewModel is constructed
         * each time the view is displayed.
         */
        return CustomerViewModel;
    }
);

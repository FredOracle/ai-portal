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
define(['../accUtils', "text!/js/mock/customers/customersRowData.json","require", "exports", "knockout", "ojs/ojbootstrap", "ojs/ojarraydataprovider", "ojs/ojconverter-datetime", "ojs/ojtimeutils", "ojs/ojknockout", "ojs/ojgantt", "ojs/ojformlayout"],
    function (accUtils,mockData, require, exports, ko, ojbootstrap_1, ArrayDataProvider, ojconverter_datetime_1, TimeUtils ) {

        class DemoCustomScaleNHr {
            constructor(N) {
                this.converter = new ojconverter_datetime_1.IntlDateTimeConverter({
                    hour: '2-digit',
                    hour12: true
                });
                this.hour = 60 * 60 * 1000;
                this.name = `${N}hr`;
                this.N = N;
            }
            formatter(date) {
                return this.converter.format(date);
            }
            getNextDate(date) {
                return new Date(new Date(date).getTime() + this.N * this.hour).toISOString();
            }
            getPreviousDate(date) {
                const d = new Date(date);
                d.setHours(Math.floor(d.getHours() / this.N) * this.N, 0, 0, 0);
                return d.toISOString();
            }
        }


        function CustomerViewModel() {
            // Below are a set of the ViewModel methods invoked by the oj-module component.
            // Please reference the oj-module jsDoc for additional information.
            var self = this;

            // self.projectStartDate = '2025-07-01';
            // self.projectEndDate = '2025-10-01';
            // self.viewportStart = '2025-07-02';
            // self.viewportEnd = '2025-07-04';


            self.projectStartDate = new Date('2025-07-01');
            self.projectEndDate = new Date('2025-10-01');
            // 8 hours scale
            self.custom8HrScale = new DemoCustomScaleNHr(8);
            // Date converter
            self.dateConverter = new ojconverter_datetime_1.IntlDateTimeConverter({
                formatType: 'date',
                dateFormat: 'long'
            });
            self.currentDate = new Date('2025-07-04, 08:00:00');
            self.currentDateString = self.currentDate.toISOString();
            self.currentDateFormatted = self.dateConverter.format(self.currentDateString);
            // set viewport to cover two days before and after
            self.day = 1000 * 60 * 60 * 24;
            self.viewportStart = new Date(Math.max(self.projectStartDate.getTime(), self.currentDate.getTime() - 2 * self.day));
            self.viewportEnd = new Date(Math.min(self.projectEndDate.getTime(), self.currentDate.getTime() + 2 * self.day));
            // Weekend reference objects
            self.weekends = TimeUtils.getWeekendReferenceObjects(new Date('2025-07-01').toISOString(), self.projectEndDate.toISOString());
            self.today = [
                {
                    value: self.currentDateString,
                    shortDesc: 'Current Date: ' + self.currentDateFormatted
                }
            ];


            self.referenceObjects = self.weekends.concat(self.today);
            self.imageWidth = 28;
            self.imageTextGapSize = 8;
            // Helper function to get appropriate row label image x position depending on document reading direction
            self.getRowImageX = () => {
                const dir = document.documentElement.getAttribute('dir');
                return dir === 'ltr' ? '0' : `-${self.imageWidth}`;
            };
            // Helper function to get appropriate row label text x position depending on document reading direction
            self.getRowTextX = () => {
                const dir = document.documentElement.getAttribute('dir');
                const offset = self.imageWidth + self.imageTextGapSize;
                return dir === 'ltr' ? `${offset}` : `-${offset}`;
            };
            self.getSvgClassName = (taskName) => {
                let svgClassName;
                switch (taskName) {
                    case '马伟':
                        svgClassName = 'demo-dayshift-taskbar';
                        break;
                    case '毕尚':
                        svgClassName = 'demo-nightshift-taskbar';
                        break;
                    case '李帅':
                        svgClassName = 'demo-eveningshift-taskbar';
                        break;
                }
                return svgClassName;
            };
            self.rowLabelImagePath = {
                马伟: 'https://www.oracle.com/webfolder/technetwork/jet/images/hcm/placeholder-male-01.png',
                毕尚: 'https://www.oracle.com/webfolder/technetwork/jet/images/hcm/placeholder-female-01.png',
                李帅: 'https://www.oracle.com/webfolder/technetwork/jet/images/hcm/placeholder-male-06.png',
                毕权忠: 'https://www.oracle.com/webfolder/technetwork/jet/images/hcm/placeholder-female-03.png',
                梁卓成: 'https://www.oracle.com/webfolder/technetwork/jet/images/hcm/placeholder-male-07.png',
                陈琳: 'https://www.oracle.com/webfolder/technetwork/jet/images/hcm/placeholder-male-13.png'
            };



            self.dragModeValue = ko.observable('pan');
            self.rowData = ko.observableArray([]);
            // self.dataProvider = new ArrayDataProvider(JSON.parse(mockData), {
            //     keyAttributes: 'resource'
            // });
            self.dataProvider = new ArrayDataProvider(self.rowData, {
                keyAttributes: 'resource'
            });






            self.handleMove = (event) => {
                const taskContexts = event.detail.taskContexts;
                // The first dataContext corresponds to the source task where the move was initiated
                const sourceTaskContext = taskContexts[0];
                // If multiple tasks dragged, figure out the offsets from the initial source task location,
                // so that we can reapply the same offset to the final drop location
                const timeOffsetFromReference = self.getTime(event.detail.start) - self.getTime(sourceTaskContext.data.start);
                const rowData = self.rowData();
                const targetRowInd = self.getRowInd(event.detail.rowContext.rowData.id);
                // if multiple tasks dragged, move all of them to the target row
                taskContexts.forEach((taskContext) => {
                    const sourceRowInd = self.getRowInd(taskContext.rowData.id);
                    const sourceTaskInd = self.getTaskInd(sourceRowInd, taskContext.data.id);
                    const taskDatum = rowData[sourceRowInd].tasks.splice(sourceTaskInd, 1)[0];
                    taskDatum.begin = self.getString(self.getTime(taskContext.data.start) + timeOffsetFromReference);
                    taskDatum.finish = self.getString(self.getTime(taskContext.data.end) + timeOffsetFromReference);
                    rowData[targetRowInd].tasks.push(taskDatum);
                });
                self.rowData(rowData);
            };
            self.handleResize = (event) => {
                const taskContexts = event.detail.taskContexts;
                // The first dataContext corresponds to the source task where the resize was initiated
                const sourceTaskContext = taskContexts[0];
                const deltaStartTime = self.getTime(event.detail.start) - self.getTime(sourceTaskContext.data.start);
                const deltaEndTime = self.getTime(event.detail.end) - self.getTime(sourceTaskContext.data.end);
                // if multiple tasks selected for resize, resize all of them according to how much the source task is resized
                // by updating the start and end time of the tasks in the data
                taskContexts.forEach((taskContext) => {
                    const taskStartTime = self.getTime(taskContext.data.start);
                    const taskEndTime = self.getTime(taskContext.data.end);
                    const newTaskStartTime = Math.min(taskEndTime, taskStartTime + deltaStartTime);
                    const newTaskEndTime = Math.max(taskStartTime, taskEndTime + deltaEndTime);
                    const rowInd = self.getRowInd(taskContext.rowData.id);
                    const taskInd = self.getTaskInd(rowInd, taskContext.data.id);
                    const taskDatum = self.rowData()[rowInd].tasks[taskInd];
                    taskDatum.begin = self.getString(newTaskStartTime);
                    taskDatum.finish = self.getString(newTaskEndTime);
                });
                // Notify subscribers that the underlying array of the observable array changed its state;
                // this will trigger the Gantt to refresh with the new data.
                self.rowData.valueHasMutated();
            };


            self.getRowInd = function (id) {
                return self.rowData()
                    .map((r) => r.resource)
                    .indexOf(id);
            }
            self.getTaskInd = function (rowInd, id) {
                return self.rowData()[rowInd].tasks.map((t) => t.id)
                    .indexOf(id);
            }
            self.getTime = function (isoString) {
                return new Date(isoString).getDate();
            }
            self.getString = function (time) {
                return new Date(time).getDay();
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

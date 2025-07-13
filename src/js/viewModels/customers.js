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
define(['../accUtils', "text!/js/mock/customers/customersRowData.json","text!/js/mock/customers/rowDataWeeks.json",
        "text!/js/mock/customers/rowDataDays.json","text!/js/mock/customers/rowDataDependency.json","require", "exports", "knockout", "ojs/ojbootstrap", "ojs/ojarraydataprovider",
        "ojs/ojconverter-datetime", "ojs/ojtimeutils", "ojs/ojknockout", "ojs/ojgantt", "ojs/ojformlayout", "ojs/ojmenu", "ojs/ojgauge"],
    function (accUtils,mockData, weeksData, daysData, depData,
              require, exports, ko, ojbootstrap_1, ArrayDataProvider, ojconverter_datetime_1, TimeUtils ) {

        function CustomerViewModel() {
            // Below are a set of the ViewModel methods invoked by the oj-module component.
            // Please reference the oj-module jsDoc for additional information.
            var self = this;

            self.startTime =  ko.observable("2025-07-01");
            self.endTime =  ko.observable("2025-07-30");
            self.todayTime = ko.observable("2025-07-05");



            self.projectStartDate =  new Date(self.startTime());
                // '2025-07-01';
            self.projectEndDate = new Date(self.endTime());
                // '2025-07-30';
            self.viewportStart = new Date(self.startTime());
                // '2025-07-01';
            self.viewportEnd = new Date(self.endTime());
                // '2025-07-30';

            self.dateConverter = new ojconverter_datetime_1.IntlDateTimeConverter({
                formatType: 'date',
                dateFormat: 'long'
            });
            self.currentDate = new Date(self.todayTime());
            self.currentDateString = self.currentDate.toISOString();
            self.currentDateFormatted = self.dateConverter.format(self.currentDateString);
            // set viewport to cover two days before and after
            self.day = 1000 * 60 * 60 * 24;
            self.week = self.day * 7;
            self.weeksConfig = {
                majorAxis: {
                    scale: 'weeks',
                    drillable: 'off',
                    converter: {
                        weeks: {
                            format: (d) => {
                                const weekNumber = (new Date(d).getTime() - self.projectStartDate().getTime()) / self.week + 1;
                                return `Week ${weekNumber}`;
                            }
                        }
                    }
                },
                minorAxis: {
                    scale: 'days',
                    drillable: 'on'
                },
                viewportDuration: {
                    sm: self.day * 2,
                    md: self.day * 7,
                    lg: self.day * 14,
                    xl: self.day * 14,
                    xxl: self.day * 14
                },
                dataProvider: new ArrayDataProvider(JSON.parse(weeksData), {
                    keyAttributes: 'resource'
                })
            };
            self.daysConfig = {
                majorAxis: {
                    scale: 'days',
                    drillable: 'on'
                },
                minorAxis: {
                    scale: 'hours',
                    drillable: 'off'
                },
                viewportDuration: {
                    sm: self.day * 0.125,
                    md: self.day * 0.25,
                    lg: self.day * 0.5,
                    xl: self.day * 0.5,
                    xxl: self.day * 0.5
                },
                dataProvider: new ArrayDataProvider(JSON.parse(daysData), {
                    keyAttributes: 'resource'
                })
            };
            self.scaleConfig = self.weeksConfig;
            self.majorAxisScale = ko.observable(self.scaleConfig.majorAxis.scale);
            self.majorAxisDrillable = ko.observable(self.scaleConfig.majorAxis.drillable);
            self.majorAxisConverter = ko.observable(self.scaleConfig.majorAxis.converter);
            self.minorAxisScale = ko.observable(self.scaleConfig.minorAxis.scale);
            self.minorAxisDrillable = ko.observable(self.scaleConfig.minorAxis.drillable);



            self.viewportStart = new Date(Math.max(self.projectStartDate.getTime(), self.currentDate.getTime() - 2 * self.day));
            self.viewportEnd = new Date(Math.min(self.projectEndDate.getTime(), self.currentDate.getTime() + 2 * self.day));
            // Weekend reference objects
            self.weekends = TimeUtils.getWeekendReferenceObjects(new Date(self.startTime()).toISOString(), self.projectEndDate.toISOString());
            self.today = [
                {
                    value: self.currentDateString,
                    shortDesc: 'Current Date: ' + self.currentDateFormatted
                }
            ];
            self.referenceObjects = self.weekends.concat(self.today);


            self.taskConfig = ko.observableArray(['progress']);
            self.handleTaskSettings = (event) => {
                console.log(event.detail.value);
                self.taskConfig(event.detail.value);
            };

            self.dragModeValue = ko.observable('select');
            self.rowData = ko.observableArray(JSON.parse(mockData));
            self.dataProvider = new ArrayDataProvider(self.rowData, {
                keyAttributes: 'resource'
            });

            self.dependencyDataProvider = new ArrayDataProvider(JSON.parse(depData), {
                keyAttributes: 'id'
            });



            self.getShortDesc = (task, resource) => {
                const assignmentString = '责任人： ' + task.user;
                const startTimeString = '任务开始时间：' + self.dateConverter.format(task.begin);
                const endTimeString = '任务结束时间： ' + self.dateConverter.format(task.finish);
                const progressString = '当前进度： ' + task.progress;
                return assignmentString + ', ' + startTimeString + ', ' + endTimeString + ', ' + progressString;
            };


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
                // self will trigger the Gantt to refresh with the new data.
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
                return new Date(isoString).getTime();
            }
            self.getString = function (time) {
                return new Date(time).toISOString();
            }






            self.selectedMenuItem = ko.observable();
            self.selectedItemsValue = ko.observableArray([]);
            self.rowIndex = ko.observable ()   ;
            self.taskIndex = ko.observable ()   ;
            self.beforeOpenFunction = (event) => {
                console.log(event)
                const target = event.detail.originalEvent.target;
                console.log("111111111111111111111")
                console.log(target);
                if (target.id === 'gantt') {
                    // Handle keyboard interaction.
                    const selection = self.selectedItemsValue();
                    console.log(selection)
                    if (selection.length > 0) {
                        let selectedItem = selection[0];
                        const parsedId = selectedItem.split(/(\d*)-(\d*)/g); // Id format is rowIndex-taskIndex
                        self.rowIndex(Number(parsedId[1]) - 1);
                        self.taskIndex(Number(parsedId[2]) - 1);
                    }
                } else {
                    // Handle mouse interaction.
                    const gantt = document.getElementById('gantt');
                    const context = gantt.getContextByNode(target);
                    console.log(context);
                    if (context != null && context.subId == 'oj-gantt-taskbar') {
                        self.rowIndex(context['rowIndex']);
                        self.taskIndex(context['index']);
                    }
                    else {
                        self.rowIndex(0);
                        self.taskIndex(0);
                    }
                }

                console.log("selected: rowIndex:  " + self.rowIndex() + "     taskIndex: " + self.taskIndex())
            };
            self.menuItemAction = (event) => {
                const selectedValue = event.detail.selectedValue;
                let text = `${selectedValue} from gantt background`;
                if (self.rowIndex() !== null && self.taskIndex() !== null) {
                    text = `${selectedValue} from Row ${self.rowIndex() + 1} Task ${self.taskIndex() + 1}`;
                }
                console.log(text);
                self.selectedMenuItem(self.taskIndex);
                if (selectedValue === 'createTask') {
                    self.addTask();
                }
                if (selectedValue === 'deleteTask') {
                    self.removeTask();
                }

            };


            // Generates random date
            self.randomDate = function (start, end) {
                return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
            }

            // Generates task with random start and end dates
            self.randomTask = function (id, label, taskColor) {
                let end;
                const start = self.randomDate(new Date(2025, 7, 1), new Date(2025, 7, 31));
                if (Math.random() < 0.9) {
                    end = self.randomDate(new Date(start), new Date(start.getTime() + 4 * this.week));
                } else {
                    end = start;
                } // generate milestone task ~ 1 in 10 tasks
                const svgStyle = taskColor ? { fill: taskColor } : {};

                console.log(start + "::::::" + end);
                return {
                    id: id,
                    begin: "2025-07-05",
                    finish: "2025-07-06",
                    name: label,
                    progress: 1,
                    status:"normal",
                    user:'Stone'
                };
            }
            // add/remove task from second row
            self.addTask = () => {
                const data =  self.rowData();
                const secondRowTasks = data[self.rowIndex()].tasks;

                if (self.rowIndex() !== null && self.taskIndex() !== null) {
                    // add random task
                    const id = 't_' + 1 + '_' +  Math.floor(Math.random()*100);
                    const label = 'Label ' + 1 + '_' +  Math.floor(Math.random()*100);
                    const task = self.randomTask(id, label, '#32925e');
                    secondRowTasks.push(task);
                } else {
                    // add random task
                    const id = 't_' + 1 + '_' + Math.floor(Math.random()*100);
                    const label = 'Label ' + 1 + '_' + Math.floor(Math.random()*100);
                    const task = self.randomTask(id, label, '#32925e');
                    secondRowTasks.push(task);
                }
                self.rowData(data);
            };
            self.removeTask = () => {
                console.log('remove task.....................');
                const data = self.rowData();
                const secondRowTasks = data[self.rowIndex()].tasks;
                secondRowTasks.splice(self.taskIndex(), 1);
                self.rowData(data);
            };



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
             * self method might be called multiple times - after the View is created
             * and inserted into the DOM and after the View is reconnected
             * after being disconnected.
             */
            self.connected = () => {
                accUtils.announce('Customers page loaded.', 'assertive');
                document.title = "Customers";
                // Implement further logic if needed
                self.loadData();
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
        return CustomerViewModel;
    }
);

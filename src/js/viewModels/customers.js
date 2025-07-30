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
define(['../accUtils', 'services/customers/customersApis', 'appController',"require", "exports", "knockout", "ojs/ojbootstrap", "ojs/ojarraydataprovider",
        "ojs/ojconverter-datetime", "ojs/ojtimeutils", "ojs/ojknockout", "ojs/ojgantt", "ojs/ojdialog", "ojs/ojformlayout",
        "ojs/ojmenu", "ojs/ojgauge", "ojs/ojdatetimepicker", "ojs/ojlabel", "ojs/ojformlayout", "ojs/ojinputnumber"],
    function (accUtils,customersApis, app,
              require, exports, ko, ojbootstrap_1, ArrayDataProvider, ojconverter_datetime_1, TimeUtils ) {

        function CustomerViewModel() {
            // Below are a set of the ViewModel methods invoked by the oj-module component.
            // Please reference the oj-module jsDoc for additional information.
            var self = this;

            self.startTime =  ko.observable("2025-07-01");
            self.endTime =  ko.observable("2025-07-30");
            self.todayTime = ko.observable("2025-07-05");

            self.newRequirementName = ko.observable();
            self.newTaskName = ko.observable();
            self.newStartTime = ko.observable();
            self.newEndTime = ko.observable();

            self.weeksData = ko.observableArray();
            self.daysData = ko.observableArray();



            self.projectStartDate =  new Date(self.startTime());
            self.projectEndDate = new Date(self.endTime());
            self.viewportStart = new Date(self.startTime());
            self.viewportEnd = new Date(self.endTime());


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
                                let weekNumber = (new Date(d).getTime() - self.projectStartDate().getTime()) / self.week + 1;
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
                dataProvider: new ArrayDataProvider(self.weeksData(), {
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
                dataProvider: new ArrayDataProvider(self.daysData(), {
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


            //需求
            self.requirementsRowData = ko.observableArray();
            self.dataProvider = new ArrayDataProvider(self.requirementsRowData, {
                keyAttributes: 'resource'
            });

            //任务间的依赖关系
            self.dependencyData = ko.observableArray();
            self.dependencyDataProvider = new ArrayDataProvider(self.dependencyData, {
                keyAttributes: 'id'
            });



            self.getShortDesc = (task, resource) => {
                let assignmentString = '责任人： ' + task.user;
                let startTimeString = '任务开始时间：' + self.dateConverter.format(task.begin);
                let endTimeString = '任务结束时间： ' + self.dateConverter.format(task.finish);
                let progressString = '当前进度： ' + task.progress;
                return assignmentString + ', ' + startTimeString + ', ' + endTimeString + ', ' + progressString;
            };


            self.handleMove = (event) => {
                let taskContexts = event.detail.taskContexts;
                // The first dataContext corresponds to the source task where the move was initiated
                let sourceTaskContext = taskContexts[0];
                // If multiple tasks dragged, figure out the offsets from the initial source task location,
                // so that we can reapply the same offset to the final drop location
                let timeOffsetFromReference = self.getTime(event.detail.start) - self.getTime(sourceTaskContext.data.start);
                let rowData = self.requirementsRowData();
                let targetRowInd = self.getRowInd(event.detail.rowContext.rowData.id);
                // if multiple tasks dragged, move all of them to the target row
                taskContexts.forEach((taskContext) => {
                    let sourceRowInd = self.getRowInd(taskContext.rowData.id);
                    let sourceTaskInd = self.getTaskInd(sourceRowInd, taskContext.data.id);
                    let taskDatum = rowData[sourceRowInd].tasks.splice(sourceTaskInd, 1)[0];
                    taskDatum.begin = self.getString(self.getTime(taskContext.data.start) + timeOffsetFromReference);
                    taskDatum.finish = self.getString(self.getTime(taskContext.data.end) + timeOffsetFromReference);
                    rowData[targetRowInd].tasks.push(taskDatum);
                });
                self.requirementsRowData(rowData);
            };
            self.handleResize = (event) => {
                let taskContexts = event.detail.taskContexts;
                // The first dataContext corresponds to the source task where the resize was initiated
                let sourceTaskContext = taskContexts[0];
                let deltaStartTime = self.getTime(event.detail.start) - self.getTime(sourceTaskContext.data.start);
                let deltaEndTime = self.getTime(event.detail.end) - self.getTime(sourceTaskContext.data.end);
                // if multiple tasks selected for resize, resize all of them according to how much the source task is resized
                // by updating the start and end time of the tasks in the data
                taskContexts.forEach((taskContext) => {
                    let taskStartTime = self.getTime(taskContext.data.start);
                    let taskEndTime = self.getTime(taskContext.data.end);
                    let newTaskStartTime = Math.min(taskEndTime, taskStartTime + deltaStartTime);
                    let newTaskEndTime = Math.max(taskStartTime, taskEndTime + deltaEndTime);
                    let rowInd = self.getRowInd(taskContext.rowData.id);
                    let taskInd = self.getTaskInd(rowInd, taskContext.data.id);
                    let taskDatum = self.requirementsRowData()[rowInd].tasks[taskInd];
                    taskDatum.begin = self.getString(newTaskStartTime);
                    taskDatum.finish = self.getString(newTaskEndTime);
                });
                // Notify subscribers that the underlying array of the observable array changed its state;
                // self will trigger the Gantt to refresh with the new data.
                self.requirementsRowData.valueHasMutated();
            };


            self.getRowInd = function (id) {
                return self.requirementsRowData()
                    .map((r) => r.resource)
                    .indexOf(id);
            }
            self.getTaskInd = function (rowInd, id) {
                return self.requirementsRowData()[rowInd].tasks.map((t) => t.id)
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
                let target = event.detail.originalEvent.target;
                if (target.id === 'gantt') {
                    // Handle keyboard interaction.
                    let selection = self.selectedItemsValue();
                    if (selection.length > 0) {
                        let selectedItem = selection[0];
                        let parsedId = selectedItem.split(/(\d*)-(\d*)/g); // Id format is rowIndex-taskIndex
                        self.rowIndex(Number(parsedId[1]) - 1);
                        self.taskIndex(Number(parsedId[2]) - 1);
                    }
                } else {
                    // Handle mouse interaction.
                    let gantt = document.getElementById('gantt');
                    let context = gantt.getContextByNode(target);

                    if (context != null && context.subId == 'oj-gantt-taskbar') {
                        self.rowIndex(context['rowIndex']);
                        self.taskIndex(context['index']);
                    } else {
                        self.rowIndex(null);
                        self.taskIndex(null);
                    }
                }

            };
            self.menuItemAction = (event) => {
                let selectedValue = event.detail.selectedValue;
                self.selectedMenuItem(self.taskIndex);
                if (selectedValue === 'createTask') {
                    if (self.taskIndex() !== null) {
                        let requirements =  self.requirementsRowData();
                        let requirement = requirements[self.rowIndex()];
                        self.newRequirementName(requirement.resource);
                    }

                    let newTaskStartTime = new Date(self.currentDate);
                    let newTaskEndTime = new Date(self.currentDate);

                    self.newStartTime(newTaskStartTime.toISOString());
                    self.newEndTime(newTaskEndTime.toISOString());

                    document.getElementById('createTaskDialog').open();
                }
                if (selectedValue === 'deleteTask') {
                    self.removeTask();
                }

                if (selectedValue === 'reassign') {
                    if (self.taskIndex() === null) {
                        return;
                    }
                    // document.getElementById('modalDialog1').open();
                }

                if (selectedValue === 'modifyTask') {
                    if (self.taskIndex() === null) {
                        return;
                    }

                    let requirements =  self.requirementsRowData();
                    let tasks = requirements[self.rowIndex()].tasks;
                    let selectedTask = tasks[self.taskIndex()] ;

                    console.log(selectedTask.finish + "::::::   " + selectedTask.begin + " ::::  " + selectedTask.name)

                    let newTaskStartTime = new Date(selectedTask.begin);
                    let newTaskEndTime = new Date(selectedTask.finish);

                    self.newTaskName(selectedTask.name);
                    self.newStartTime(newTaskStartTime.toISOString());
                    self.newEndTime(newTaskEndTime.toISOString());
                    document.getElementById('modifyTaskDialog').open();
                }
            };


            // Generates random date
            self.randomDate = function (start, end) {
                return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
            }

            // Generates task with random start and end dates
            self.randomTask = function (id, label, start, end, taskColor) {
                let svgStyle = taskColor ? { fill: taskColor } : {};
                return {
                    id: id,
                    begin: start.toISOString(),
                    finish: end.toISOString(),
                    name: label,
                    progress: 1,
                    status:"normal",
                    user:'Stone'
                };
            }
            // add/remove task from second row
            self.addTask = () => {
                let requirements = [];
                let tasks = [];

                let newTask = new Task();
                newTask.name = self.newTaskName();
                newTask.begin = self.newStartTime();
                newTask.finish = self.newEndTime();
                newTask.status = "normal";
                newTask.progress = 1;
                newTask.user = app.userLogin();
                newTask.id = 't_' + 1 + '_' + Math.floor(Math.random()*100);


                console.log(self.taskIndex() + "         " + self.rowIndex())
                if (self.rowIndex() === null) {
                    // add new random task
                    tasks.push(newTask);
                    let requirement = new Requirement();
                    requirement.resource = self.newRequirementName();
                    requirement.tasks = tasks;
                    requirements.push(requirement);
                } else {
                    requirements =  self.requirementsRowData();
                    let requirement = requirements[self.rowIndex()];
                    tasks = requirement.tasks;
                    tasks.push(newTask);
                    requirements.splice(self.rowIndex(), 1, tasks);
                }
                self.requirementsRowData(requirements);

                document.getElementById('createTaskDialog').close();
            };


            self.removeTask = () => {
                console.log('remove task.....................');
                let requirementsRowData = self.requirementsRowData();
                console.log(self.taskIndex() + "::::" + self.rowIndex());
                if (self.taskIndex() === null) {
                    return;
                }
                let secondRowTasks = requirementsRowData[self.rowIndex()].tasks;
                secondRowTasks.splice(self.taskIndex(), 1);
                self.requirementsRowData(requirementsRowData);
            };


            self.modifyTask= () => {
                console.log(self.newEndTime() + ">>>>>>>>>>>>" + self.newEndTime())

                console.log(self.newRequirementName() + ":::::" + self.newTaskName())

                console.log(self.requirementsRowData())

                let requirements =  self.requirementsRowData();
                let tasks = requirements[self.rowIndex()].tasks;
                let selectedTask = tasks[self.taskIndex()] ;

                selectedTask.begin = self.newStartTime();
                selectedTask.finish = self.newEndTime();
                selectedTask.name = self.newTaskName();
                selectedTask.status = "normal";
                selectedTask.progress = 1;
                selectedTask.user = app.userLogin();

                tasks.splice(self.taskIndex(), 1, selectedTask);
                requirements.splice(self.rowIndex(), 1, tasks);

                self.requirementsRowData().splice(self.rowIndex(), 1, tasks);

                console.log(self.requirementsRowData());
                document.getElementById('modifyTaskDialog').close();
            };


            self.closeDialog = function (event) {
                console.log(event.currentTarget.id)
                document.getElementById(event.currentTarget.id).close();
            }

            function loadTasks() {
                customersApis.fetchTasks().then(function(data) {
                    self.requirementsRowData(data);
                }).catch(function(response) {
                    app.pushMessage("error", "Error fetching details", "");
                });
            }

            function loadDependencies() {
                customersApis.fetchDependencies().then(function (data) {
                    self.dependencyData(data);
                }).catch(function (response) {
                    app.pushMessage("error", "Error fetching details", "");
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
                loadTasks();
                loadDependencies();
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
         * return a letructor for the ViewModel so that the ViewModel is letructed
         * each time the view is displayed.
         */
        return CustomerViewModel;
    }
);

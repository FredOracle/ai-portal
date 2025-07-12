/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your incidents ViewModel code goes here
 */
define(['../accUtils',"require", "exports", "knockout", "ojs/ojbootstrap", "text!/js/mock/incidents/rowData.json", "text!/js/mock/incidents/depData.json", "ojs/ojarraydataprovider", "ojs/ojarraytreedataprovider", "ojs/ojconverter-datetime", "ojs/ojconverterutils-i18n", "ojs/ojknockout-keyset", "ojs/ojknockout", "ojs/ojrowexpander", "jet-composites/project-gantt/loader"],
 function(accUtils,require, exports, ko, ojbootstrap_1, rowData, depData, ArrayDataProvider, ArrayTreeDataProvider, ojconverter_datetime_1, ojconverterutils_i18n_1, ojknockout_keyset_1) {
    function IncidentsViewModel() {
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

        var self = this;

        self.projectStartDate = ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date('Jan 1, 2016'));
        self.projectEndDate = ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date('Dec 31, 2016'));
        self.viewportStartDate = ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date('Jan 1, 2016'));
        self.viewportEndDate = ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date('May 8, 2016'));
        self.currentDateReference = [
            {
                value: ojconverterutils_i18n_1.IntlConverterUtils.dateToLocalIsoDateString(new Date('Feb 14, 2016'))
            }
        ];
        self.dateConverter = new ojconverter_datetime_1.IntlDateTimeConverter();
        self.expanded = new ojknockout_keyset_1.ObservableKeySet().add(['production', 'qa']);
        self.rowsDataProvider = new ArrayTreeDataProvider(JSON.parse(rowData), {
            keyAttributes: 'id',
            childrenAttribute: 'subTasks'
        });
        self.dependenciesDataProvider = new ArrayDataProvider(JSON.parse(depData), {
            keyAttributes: 'id'
        });


      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      this.connected = () => {
        accUtils.announce('Incidents page loaded.', 'assertive');
        document.title = "Incidents";
        // Implement further logic if needed
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
    return IncidentsViewModel;
  }
);

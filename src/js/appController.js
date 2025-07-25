/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define(['knockout', 'ojs/ojcontext', 'ojs/ojmodule-element-utils', 'ojs/ojknockouttemplateutils', 'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojarraydataprovider', "ojs/ojmutablearraydataprovider",
        'ojs/ojdrawerpopup', 'ojs/ojmodule-element', 'ojs/ojknockout', 'ojs/ojmessagebanner','appModels'],
    function (ko, Context, moduleUtils, KnockoutTemplateUtils, CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter, ResponsiveUtils, ResponsiveKnockoutUtils, ArrayDataProvider, MutableArrayDataProvider) {

        function ControllerViewModel() {
            const self = this;
            this.KnockoutTemplateUtils = KnockoutTemplateUtils;

            // Handle announcements sent when pages change, for Accessibility.
            this.manner = ko.observable('polite');

            const initialData = [
                {
                    id: 'errorMessage',
                    severity: 'error',
                    summary: 'Error message summary',
                    detail: 'Error message detail.',
                    closeAffordance: 'off'
                },
                {
                    id: 'warningMessage',
                    severity: 'warning',
                    summary: 'Warning message summary',
                    detail: 'Warning message detail.',
                    timestamp: new Date().toISOString()
                },
                {
                    id: 'confirmationMessage',
                    severity: 'confirmation',
                    summary: 'Confirmation message summary',
                    detail: 'Confirmation message detail.'
                }
            ];
            this.messages = new MutableArrayDataProvider(initialData, {
                keyAttributes: 'id'
            });
            this.message = ko.observable();
            announcementHandler = (event) => {
                this.message(event.detail.message);
                this.manner(event.detail.manner);
            };

            document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);


            self.userProfile = ko.observable(new UserProfile());


            // Media queries for responsive layouts
            const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
            this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
            const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
            this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

            let navData = [
                {path: '', redirect: 'dashboard'},
                {path: 'dashboard', detail: {label: 'Dashboard', iconClass: 'oj-ux-ico-bar-chart'}},
                {path: 'incidents', detail: {label: 'Incidents', iconClass: 'oj-ux-ico-fire'}},
                {path: 'customers', detail: {label: 'Customers', iconClass: 'oj-ux-ico-contact-group'}},
                {path: 'about', detail: {label: 'About', iconClass: 'oj-ux-ico-information-s'}}
            ];

            // Router setup
            let router = new CoreRouter(navData, {
                urlAdapter: new UrlParamAdapter()
            });
            router.sync();

            this.moduleAdapter = new ModuleRouterAdapter(router);

            this.selection = new KnockoutRouterAdapter(router);

            // Setup the navDataProvider with the routes, excluding the first redirected
            // route.
            this.navDataProvider = new ArrayDataProvider(navData.slice(1), {keyAttributes: "path"});

            // Drawer
            self.sideDrawerOn = ko.observable(false);

            // Close drawer on medium and larger screens
            this.mdScreen.subscribe(() => {
                self.sideDrawerOn(false)
            });

            // Called by navigation drawer toggle button and after selection of nav drawer item
            this.toggleDrawer = () => {
                self.sideDrawerOn(!self.sideDrawerOn());
            }

            // Header
            // Application Name used in Branding Area
            this.appName = ko.observable("胡先淼工作台");
            // User Info used in Global Navigation area
            this.userLogin = ko.observable("huxianmiao@zhongfu.net");

            // Footer
            this.footerLinks = [
                {
                    name: 'About Oracle',
                    linkId: 'aboutOracle',
                    linkTarget: 'http://www.oracle.com/us/corporate/index.html#menu-about'
                },
                {
                    name: "Contact Us",
                    id: "contactUs",
                    linkTarget: "http://www.oracle.com/us/corporate/contact/index.html"
                },
                {name: "Legal Notices", id: "legalNotices", linkTarget: "http://www.oracle.com/us/legal/index.html"},
                {name: "Terms Of Use", id: "termsOfUse", linkTarget: "http://www.oracle.com/us/legal/terms/index.html"},
                {
                    name: "Your Privacy Rights",
                    id: "yourPrivacyRights",
                    linkTarget: "http://www.oracle.com/us/legal/privacy/index.html"
                },
            ];
        }


        // System messages
        self.selectedMessages = ko.observableArray(
            ['error', 'warning', 'info', 'confirmation']);
        self.createMessage = function(severity, messageSummary, messageDetail) {
            let messageTimeout = -1;
            if (severity === 'info' || severity === 'confirmation') {
                messageTimeout = 100;
            }
            return {
                severity: severity,
                summary: messageSummary,
                detail: messageDetail,
                autoTimeout: parseInt(messageTimeout),
            };
        };

        self.messageDataprovider = ko.observableArray([]);

        self.closeMessageHandler = function(event) {
            self.selectedMessages.remove(function(severity) {
                return severity === event.detail.message.severity;
            });
        };

        self.pushMessage = function(severity, messageSummary, messageDetail) {
            self.messageDataprovider.push(
                self.createMessage(severity, messageSummary, messageDetail));
        };



        self.getUserProfile = ko.pureComputed(
            function () {
                let userInfo = window.sessionStorage.getItem('user');
                if (userInfo) {
                    self.userProfile(JSON.parse(userInfo));
                } else {
                    self.userProfile({
                        id: 100,
                        name: 'admin',
                        lastConfig: new OperationRecorder(),
                    });
                }
                return self.userProfile();
            },
        );


        // release the application bootstrap busy state
        Context.getPageContext().getBusyContext().applicationBootstrapComplete();

        return new ControllerViewModel();
    }
);

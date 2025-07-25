define([],
    function Constants() {
        const self = {};

        self.RequestType = {
            POST: "POST",
            GET: "GET",
            DELETE: "DELETE",
            PUT: "PUT",
            PATCH: "PATCH"
        };

        self.ResponseDataType = {
            JSON: "json",
            TEXT: "text",
            XML: "xml"
        };

        self.MessageType = {
            ERROR: "error",
            WARNING: "warning",
            CONFIRMATION: "confirmation",
            INFORMATION: "info"
        };

        self.backendHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': "3600",
            'x-auth-token': '',
            'Cache-control': 'no-cache'
        };

        self.Accept = "*/*";

        self.protocols = [
            {value: '*', label: 'Any'},
            {value: 'FTP', label: 'FTP'},
            {value: 'SMTP', label: 'SMTP'},
            {value: 'HTTP', label: 'HTTP'},
            {value: 'TELNET', label: 'TELNET'},
            {value: 'ICMP', label: 'ICMP'},
            {value: 'HTTPS', label: 'HTTPS'},
            {value: 'SSH', label: 'SSH'},
            {value: 'RTP', label: 'RTP'},
            {value: 'RTCP', label: 'RTCP'},
            {value: 'DHCP', label: 'DHCP'},
            {value: 'DNS', label: 'DNS'},
            {value: 'SNMP', label: 'SNMP'},
            {value: 'NFS', label: 'NFS'},
            {value: 'CIFS', label: 'CIFS'},
            {value: 'GRE', label: 'GRE'},
            {value: 'TCP', label: 'TCP'},
            {value: 'UDP', label: 'UDP'},
            {value: '', label: 'Number'},
        ];

        self.defaultConfigurationId = 0;

        self.silencePeriodOptions = [];

        self.defaultPageSizes = [
            {
                "value": 5,
                "label": "5"
            },
            {
                "value": 15,
                "label": "15"
            },
            {
                "value": 25,
                "label": "25"
            },
            {
                "value": 40,
                "label": "40"
            },
            {
                "value": 50,
                "label": "50"
            }
        ];

        self.defaultPageCount = 15;
        self.buttonChroming = "outlined";
        self.tableDisplayType = "grid";
        self.CLIENT_SECRET = "abc";
        self.expiryTime = '18000';
        self.apnBackendURL = "https://" + window.location.hostname;
        self.backendURL = "http://localhost:3000";

        return self;
    });






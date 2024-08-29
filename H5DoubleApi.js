var H5DoubleApi = /** @class */ (function () {
    function H5DoubleApi(scriptArgs) {
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        } else {
            this.miService = MIService.Current;
        }
        this.usid = ScriptUtil.GetUserContext("USID");
        this.allUserData = []; // Array to store all fetched user data
    }

    H5DoubleApi.Init = function (args) {
        new H5DoubleApi(args).run();
    };

    H5DoubleApi.prototype.run = function () {
        this.addButton();
    };

    H5DoubleApi.prototype.addButton = function () {
        var _this = this;
        var buttonElement = new ButtonElement();
        buttonElement.Name = "run";
        buttonElement.Value = "Execute MI calls";
        buttonElement.Position = new PositionElement();
        buttonElement.Position.Top = 3;
        buttonElement.Position.Left = 1;
        buttonElement.Position.Width = 5;

        var contentElement = this.controller.GetContentElement();
        var $button = contentElement.AddElement(buttonElement);
        $button.click({}, function () {
            _this.showDialog();
        });
    };

    H5DoubleApi.prototype.fetchUserData = function (query, isInitialFetch) {
        var _this = this;
        var myRequest = new MIRequest();
        myRequest.program = "MNS150MI";
        myRequest.transaction = "GetUserData";
        myRequest.outputFields = [
            "USID", "TX40", "USTP", "DTFM", "FRF6", "DEPT", "CUNO", "PHNO", "TFNO", "ADK1", "EMAL",
            "CONO", "DIVI", "LANC", "DCFM", "TIZO", "FACI", "WHLO", "NAME", "EQAL", "USTA", "EUID",
            "FRF7", "FRF8", "FADT", "LADT", "ULTP", "CSYS", "CHNO", "CHN2", "DEVD", "PROE"
        ];
        myRequest.record = { USID: query };

        this.miService.executeRequestV2(myRequest).then(function (response) {
            if (response.items.length > 0) {
                var filteredItems = response.items.filter(function (item) {
                    return item.USID.startsWith(query);
                });
                if (isInitialFetch) {
                    _this.allUserData = filteredItems;
                }
                console.log(filteredItems);
                
                _this.fetchAdditionalUserData(filteredItems[0].EUID, filteredItems);
            } else {
                _this.log.Info("No user data found.");
                _this.updateTable([]);
            }
        }).catch(function (response) {
            _this.log.Error(response.errorMessage);
        });
    };

    H5DoubleApi.prototype.fetchAdditionalUserData = function (euid, initialData) {
        var _this = this;
        var myRequest = new MIRequest();
        myRequest.program = "MNS150MI";
        myRequest.transaction = "GetUserByEuid";
        myRequest.outputFields = [
            "USID", "TX40", "USTP", "DTFM", "FRF6", "DEPT", "CUNO", "PHNO", "TFNO", "ADK1", "EMAL",
            "CONO", "DIVI", "LANC", "DCFM", "TIZO", "FACI", "WHLO", "NAME", "EQAL", "USTA", "EUID",
            "FRF7", "FRF8", "FADT", "LADT", "ULTP", "CSYS", "CHNO", "CHN2", "DEVD", "PROE"
        ];
        myRequest.record = { EUID: euid };

        this.miService.executeRequestV2(myRequest).then(function (response) {
            if (response.items.length > 0) {
                var combinedData = initialData.concat(response.items);
                _this.updateTable(combinedData);
            } else {
                _this.log.Info("No additional user data found.");
                _this.updateTable(initialData);
            }
        }).catch(function (response) {
            _this.log.Error(response.errorMessage);
        });
    };

    H5DoubleApi.prototype.showDialog = function () {
        var _this = this;

        // Create the dialog content
        var dialogContent = $("<div><label class='inforLabel noColon'>User Data</label></div>");

        // Create input field and search button
        var inputField = $("<input type='text' maxlength='10' style='margin-right:10px;'>");
        inputField.val(this.usid); // Set the initial value to the current USID
        var searchButton = $("<button>Search</button>");

        // Add input field and search button to dialog content
        var inputContainer = $("<div style='margin-bottom:10px;'></div>");
        inputContainer.append(inputField);
        inputContainer.append(searchButton);
        dialogContent.append(inputContainer);

        // Create the table
        var table = $("<table style='width:100%; border-collapse:collapse;'>");
        this.table = table;
        dialogContent.append(table);

        var dialogButtons = [
            {
                text: "Close",
                width: 80,
                click: function () {
                    _this.dialog.inforDialog("close");
                },
            },
        ];

        var dialogOptions = {
            title: "User Data",
            dialogType: "General",
            modal: true,
            width: 600,
            minHeight: 480,
            icon: "info",
            closeOnEscape: true,
            close: function () {
                _this.dialog = null;
            },
        };

        this.dialog = H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);

        // Handle search button click
        searchButton.click(function () {
            _this.performSearch(inputField.val());
        });
    };

    H5DoubleApi.prototype.performSearch = function (query) {
        if (query.length > 0) {
            this.fetchUserData(query, false);
        } else {
            this.updateTable([]); // Clear the table if query is empty
        }
    };

    H5DoubleApi.prototype.updateTable = function (data) {
        var table = this.table;
        table.empty();

        if (data.length > 0) {
            var headerRow = $("<tr>");

            for (var key in data[0]) {
                var th = $("<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>").text(key);
                headerRow.append(th);
            }

            table.append(headerRow);

            data.forEach(function (item) {
                var dataRow = $("<tr>").css('cursor', 'pointer').click(function () {
                    // Display detailed data for the clicked item
                    var detailedData = [];
                    for (var key in item) {
                        detailedData.push(key + ": " + item[key]);
                    }
                    alert(detailedData.join("\n"));
                });

                for (var key in item) {
                    var td = $("<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>").text(item[key]);
                    dataRow.append(td);
                }

                table.append(dataRow);
            });
        } else {
            var noDataRow = $("<tr><td colspan='2' style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>No data found</td></tr>");
            table.append(noDataRow);
        }
    };

    return H5DoubleApi;
})();

H5DoubleApi.Init(scriptArgs);

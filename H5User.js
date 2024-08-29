var H5User = /** @class */ (function () {
    function H5User(scriptArgs) {
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

    H5User.Init = function (args) {
        new H5User(args).run();
    };

    H5User.prototype.run = function () {
        this.addButton();
    };

    H5User.prototype.addButton = function () {
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

    H5User.prototype.fetchUserData = function (query, isInitialFetch) {
        var _this = this;
        var myRequest = new MIRequest();
        myRequest.program = "MNS150MI";
        myRequest.transaction = "LstUserData";
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
                
                _this.updateTable(filteredItems);
            } else {
                _this.log.Info("No user data found.");
                _this.updateTable([]);
            }
        }).catch(function (response) {
            _this.log.Error(response.errorMessage);
        });
    };

    H5User.prototype.showDialog = function () {
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

    H5User.prototype.performSearch = function (query) {
        if (query.length > 0) {
            this.fetchUserData(query, false);
        } else {
            this.updateTable([]); // Clear the table if query is empty
        }
    };

    H5User.prototype.updateTable = function (data) {
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

    return H5User;
})();

H5User.Init(scriptArgs);






























































// var H5User = /** @class */ (function () {
//     function H5User(scriptArgs) {
//         debugger;
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = scriptArgs.args;
//         if (ScriptUtil.version >= 2.0) {
//             this.miService = MIService;
//         } else {
//             this.miService = MIService.Current;
//         }
//         this.usid = ScriptUtil.GetUserContext("USID");
//         this.allUserData = []; // Array to store all fetched user data
//     }

//     H5User.Init = function (args) {
//         new H5User(args).run();
//     };

//     H5User.prototype.run = function () {
//         this.addButton();
//     };

//     H5User.prototype.addButton = function () {
//         var _this = this;
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "run";
//         buttonElement.Value = "Execute MI calls";
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 3;
//         buttonElement.Position.Left = 1;
//         buttonElement.Position.Width = 5;

//         var contentElement = this.controller.GetContentElement();
//         var $button = contentElement.AddElement(buttonElement);
//         $button.click({}, function () {
//             _this.showDialog();
//         });
//     };

//     H5User.prototype.fetchUserData = function (query, isInitialFetch) {
//         var _this = this;
//         var myRequest = new MIRequest();
//         myRequest.program = "MNS150MI";
//         myRequest.transaction = "LstUserData";
//         myRequest.outputFields = ["USID", "TX40", "USTP", "DTFM", "FRF6", "DEPT", "CUNO", "PHNO", "TFNO", "ADK1", "EMAL"];
//         myRequest.record = { USID: query };

//         this.miService.executeRequestV2(myRequest).then(function (response) {
//             if (response.items.length > 0) {
//                 if (isInitialFetch) {
//                     _this.allUserData = response.items;
//                 }
//                 _this.updateTable(response.items);
//             } else {
//                 _this.log.Info("No user data found.");
//                 _this.updateTable([]);
//             }
//         }).catch(function (response) {
//             _this.log.Error(response.errorMessage);
//         });
//     };

//     H5User.prototype.showDialog = function () {
//         var _this = this;

//         // Create the dialog content
//         var dialogContent = $("<div><label class='inforLabel noColon'>User Data</label></div>");

//         // Create input field and search button
//         var inputField = $("<input type='text' maxlength='10' style='margin-right:10px;'>");
//         inputField.val(this.usid); // Set the initial value to the current USID
//         var searchButton = $("<button>Search</button>");

//         // Add input field and search button to dialog content
//         var inputContainer = $("<div style='margin-bottom:10px;'></div>");
//         inputContainer.append(inputField);
//         inputContainer.append(searchButton);
//         dialogContent.append(inputContainer);

//         // Create the table
//         var table = $("<table style='width:100%; border-collapse:collapse;'>");
//         this.table = table;
//         dialogContent.append(table);

//         var dialogButtons = [
//             {
//                 text: "Close",
//                 width: 80,
//                 click: function () {
//                     _this.dialog.inforDialog("close");
//                 },
//             },
//         ];

//         var dialogOptions = {
//             title: "User Data",
//             dialogType: "General",
//             modal: true,
//             width: 600,
//             minHeight: 480,
//             icon: "info",
//             closeOnEscape: true,
//             close: function () {
//                 _this.dialog = null;
//             },
//         };

//         this.dialog = H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);

//         // Handle search button click
//         searchButton.click(function () {
//             _this.performSearch(inputField.val());
//         });
//     };

//     H5User.prototype.performSearch = function (query) {
//         if (query.length > 0) {
//             this.fetchUserData(query, false);
//         } else {
//             this.updateTable([]); // Clear the table if query is empty
//         }
//     };

//     H5User.prototype.updateTable = function (data) {
//         var table = this.table;
//         table.empty();

//         if (data.length > 0) {
//             var headerRow = $("<tr>");
//             var dataRow = $("<tr>");

//             for (var key in data[0]) {
//                 var th = $("<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>").text(key);
//                 headerRow.append(th);
//             }

//             table.append(headerRow);

//             data.forEach(function (item) {
//                 var dataRow = $("<tr>").css('cursor', 'pointer').click(function () {
//                     // Display detailed data for the clicked item
//                     var detailedData = [];
//                     for (var key in item) {
//                         detailedData.push(key + ": " + item[key]);
//                     }
//                     alert(detailedData.join("\n"));
//                 });

//                 for (var key in item) {
//                     var td = $("<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>").text(item[key]);
//                     dataRow.append(td);
//                 }

//                 table.append(dataRow);
//             });
//         } else {
//             var noDataRow = $("<tr><td colspan='2' style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>No data found</td></tr>");
//             table.append(noDataRow);
//         }
//     };

//     return H5User;
// })();

// H5User.Init(scriptArgs);


























// var H5User = /** @class */ (function () {
//     function H5User(scriptArgs) {
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = scriptArgs.args;
//         if (ScriptUtil.version >= 2.0) {
//             this.miService = MIService;
//         } else {
//             this.miService = MIService.Current;
//         }
//         this.usid = ScriptUtil.GetUserContext("USID");
//         this.allUserData = []; // Array to store all fetched user data
//         this.debounceTimeout = null;
//     }

//     H5User.Init = function (args) {
//         new H5User(args).run();
//     };

//     H5User.prototype.run = function () {
//         this.addButton();
//     };

//     H5User.prototype.addButton = function () {
//         var _this = this;
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "run";
//         buttonElement.Value = "Execute MI calls";
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 3;
//         buttonElement.Position.Left = 1;
//         buttonElement.Position.Width = 5;

//         var contentElement = this.controller.GetContentElement();
//         var $button = contentElement.AddElement(buttonElement);
//         $button.click({}, function () {
//             _this.showDialog();
//         });
//     };

//     H5User.prototype.fetchUserData = function (query, isInitialFetch) {
//         var _this = this;
//         var myRequest = new MIRequest();
//         myRequest.program = "MNS150MI";
//         myRequest.transaction = "LstUserData";
//         myRequest.outputFields = ["USID", "TX40", "USTP", "DTFM", "FRF6", "DEPT", "CUNO", "PHNO", "TFNO", "ADK1", "EMAL"];
//         myRequest.record = { USID: query };

//         this.miService.executeRequestV2(myRequest).then(function (response) {
//             if (response.items.length > 0) {
//                 if (isInitialFetch) {
//                     _this.allUserData = response.items;
//                 }
//                 _this.updateTable(response.items);
//             } else {
//                 _this.log.Info("No user data found.");
//                 _this.updateTable([]);
//             }
//         }).catch(function (response) {
//             _this.log.Error(response.errorMessage);
//         });
//     };

//     H5User.prototype.showDialog = function () {
//         var _this = this;

//         // Create the dialog content
//         var dialogContent = $("<div><label class='inforLabel noColon'>User Data</label></div>");

//         // Create input field and search button
//         var inputField = $("<input type='text' maxlength='10' style='margin-right:10px;'>");
//         inputField.val(this.usid); // Set the initial value to the current USID
//         var searchButton = $("<button>Search</button>");

//         // Add input field and search button to dialog content
//         var inputContainer = $("<div style='margin-bottom:10px;'></div>");
//         inputContainer.append(inputField);
//         inputContainer.append(searchButton);
//         dialogContent.append(inputContainer);

//         // Create the table
//         var table = $("<table style='width:100%; border-collapse:collapse;'>");
//         this.table = table;
//         dialogContent.append(table);

//         var dialogButtons = [
//             {
//                 text: "Close",
//                 width: 80,
//                 click: function () {
//                     _this.dialog.inforDialog("close");
//                 },
//             },
//         ];

//         var dialogOptions = {
//             title: "User Data",
//             dialogType: "General",
//             modal: true,
//             width: 600,
//             minHeight: 480,
//             icon: "info",
//             closeOnEscape: true,
//             close: function () {
//                 _this.dialog = null;
//             },
//         };

//         this.dialog = H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);

//         // Initial fetch of data for the current USID
//         this.fetchUserData(this.usid, true);

//         // Handle search button click
//         searchButton.click(function () {
//             _this.performSearch(inputField.val());
//         });

//         // Handle input field change with debounce
//         inputField.on("input", function () {
//             clearTimeout(_this.debounceTimeout);
//             _this.debounceTimeout = setTimeout(function () {
//                 _this.performSearch(inputField.val());
//             }, 300); // Adjust debounce delay as needed
//         });
//     };

//     H5User.prototype.performSearch = function (query) {
//         if (query.length <= 3) {
//             this.fetchUserData(query, false);
//         } else if (query.length === 0) {
//             this.updateTable(this.allUserData);
//         } else {
//             this.updateTable([]); 
//         }
//     };

//     H5User.prototype.updateTable = function (data) {
//         var table = this.table;
//         table.empty();

//         if (data.length > 0) {
//             var headerRow = $("<tr>");
//             var dataRow = $("<tr>");

//             for (var key in data[0]) {
//                 var th = $("<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>").text(key);
//                 headerRow.append(th);
//             }

//             table.append(headerRow);

//             data.forEach(function (item) {
//                 var dataRow = $("<tr>").css('cursor', 'pointer').click(function () {
//                     // Display detailed data for the clicked item
//                     var detailedData = [];
//                     for (var key in item) {
//                         detailedData.push(key + ": " + item[key]);
//                     }
//                     alert(detailedData.join("\n"));
//                 });

//                 for (var key in item) {
//                     var td = $("<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>").text(item[key]);
//                     dataRow.append(td);
//                 }

//                 table.append(dataRow);
//             });
//         } else {
//             var noDataRow = $("<tr><td colspan='2' style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>No data found</td></tr>");
//             table.append(noDataRow);
//         }
//     };

//     return H5User;
// })();

// H5User.Init(scriptArgs);






















































// var H5User = /** @class */ (function () {
//     function H5User(scriptArgs) {
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = scriptArgs.args;
//         if (ScriptUtil.version >= 2.0) {
//             this.miService = MIService;
//         } else {
//             this.miService = MIService.Current;
//         }
//         this.usid = ScriptUtil.GetUserContext("USID");
//         this.allUserData = []; // Array to store all fetched user data
//     }

//     H5User.Init = function (args) {
//         new H5User(args).run();
//     };

//     H5User.prototype.run = function () {
//         this.addButton();
//     };

//     H5User.prototype.addButton = function () {
//         var _this = this;
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "run";
//         buttonElement.Value = "Execute MI calls";
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 3;
//         buttonElement.Position.Left = 1;
//         buttonElement.Position.Width = 5;

//         var contentElement = this.controller.GetContentElement();
//         var $button = contentElement.AddElement(buttonElement);
//         $button.click({}, function () {
//             _this.showDialog();
//         });
//     };

//     H5User.prototype.fetchUserData = function (usid, isInitialFetch) {
//         var _this = this;
//         var myRequest = new MIRequest();
//         myRequest.program = "MNS150MI";
//         myRequest.transaction = "LstUserData";
//         myRequest.outputFields = ["USID", "TX40", "USTP", "DTFM", "FRF6", "DEPT", "CUNO", "PHNO", "TFNO", "ADK1", "EMAL"];
//         myRequest.record = { USID: usid };

//         this.miService.executeRequestV2(myRequest).then(function (response) {
//             if (response.items.length > 0) {
//                 if (isInitialFetch) {
//                     _this.allUserData = response.items;
//                     _this.updateTable(_this.allUserData);
//                 } else {
//                     _this.updateTable(response.items);
//                 }
//             } else {
//                 _this.log.Info("No user data found.");
//                 _this.updateTable([]);
//             }
//         }).catch(function (response) {
//             _this.log.Error(response.errorMessage);
//         });
//     };

//     H5User.prototype.showDialog = function () {
//         var _this = this;

//         // Create the dialog content
//         var dialogContent = $("<div><label class='inforLabel noColon'>User Data</label></div>");

//         // Create input field and search button
//         var inputField = $("<input type='text' maxlength='10' style='margin-right:10px;'>");
//         inputField.val(this.usid); // Set the initial value to the current USID
//         var searchButton = $("<button>Search</button>");

//         // Add input field and search button to dialog content
//         var inputContainer = $("<div style='margin-bottom:10px;'></div>");
//         inputContainer.append(inputField);
//         inputContainer.append(searchButton);
//         dialogContent.append(inputContainer);

//         // Create the table
//         var table = $("<table style='width:100%; border-collapse:collapse;'>");
//         this.table = table;
//         dialogContent.append(table);

//         var dialogButtons = [
//             {
//                 text: "Close",
//                 width: 80,
//                 click: function () {
//                     _this.dialog.inforDialog("close");
//                 },
//             },
//         ];

//         var dialogOptions = {
//             title: "User Data",
//             dialogType: "General",
//             modal: true,
//             width: 600,
//             minHeight: 480,
//             icon: "info",
//             closeOnEscape: true,
//             close: function () {
//                 _this.dialog = null;
//             },
//         };

//         this.dialog = H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);

//         // Initial fetch of data for the current USID
//         this.fetchUserData(this.usid, true);

//         // Handle search button click
//         searchButton.click(function () {
//             var query = inputField.val().toLowerCase();
//             var filteredData = _this.allUserData.filter(function (item) {
//                 return Object.values(item).some(function (val) {
//                     return String(val).toLowerCase().includes(query);
//                 });
//             });
//             _this.updateTable(filteredData);
//         });
//     };

//     H5User.prototype.updateTable = function (data) {
//         var table = this.table;
//         table.empty();

//         if (data.length > 0) {
//             var headerRow = $("<tr>");
//             var dataRow = $("<tr>");

//             for (var key in data[0]) {
//                 var th = $("<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>").text(key);
//                 headerRow.append(th);
//             }

//             table.append(headerRow);

//             data.forEach(function (item) {
//                 var dataRow = $("<tr>").css('cursor', 'pointer').click(function () {
//                     // Display detailed data for the clicked item
//                     var detailedData = [];
//                     for (var key in item) {
//                         detailedData.push(key + ": " + item[key]);
//                     }
//                     alert(detailedData.join("\n"));
//                 });

//                 for (var key in item) {
//                     var td = $("<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>").text(item[key]);
//                     dataRow.append(td);
//                 }

//                 table.append(dataRow);
//             });
//         } else {
//             var noDataRow = $("<tr><td colspan='2' style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>No data found</td></tr>");
//             table.append(noDataRow);
//         }
//     };

//     return H5User;
// })();

// H5User.Init(scriptArgs);
































// var H5User = /** @class */ (function () {
//     function H5User(scriptArgs) {
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = scriptArgs.args;
//         if (ScriptUtil.version >= 2.0) {
//             this.miService = MIService;
//         } else {
//             this.miService = MIService.Current;
//         }
//         this.usid = ScriptUtil.GetUserContext("USID");
//     }

//     H5User.Init = function (args) {
//         new H5User(args).run();
//     };

//     H5User.prototype.run = function () {
//         this.addButton();
//     };

//     H5User.prototype.addButton = function () {
//         var _this = this;
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "run";
//         buttonElement.Value = "Execute MI calls";
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 3;
//         buttonElement.Position.Left = 1;
//         buttonElement.Position.Width = 5;

//         var contentElement = this.controller.GetContentElement();
//         var $button = contentElement.AddElement(buttonElement);
//         $button.click({}, function () {
//             _this.showDialog();
//         });
//     };

//     H5User.prototype.fetchUserData = function (usid) {
//         var _this = this;
//         var myRequest = new MIRequest();
//         myRequest.program = "MNS150MI";
//         myRequest.transaction = "LstUserData";
//         myRequest.outputFields = ["USID", "TX40", "USTP", "DTFM" , "FRF6","DEPT", "CUNO", "PHNO", "TFNO", "ADK1", "EMAL",];
//         myRequest.record = { USID: usid };

//         this.miService.executeRequestV2(myRequest).then(function (response) {
//             if (response.items.length > 0) {
//                 _this.updateTable(response.items[0]);
//             } else {
//                 _this.log.Info("No user data found.");
//                 _this.updateTable(null);
//             }
//         }).catch(function (response) {
//             _this.log.Error(response.errorMessage);
//         });
//     };

//     H5User.prototype.showDialog = function () {
//         var _this = this;

//         // Create the dialog content
//         var dialogContent = $("<div><label class='inforLabel noColon'>User Data</label></div>");

//         // Create input field and search button
//         var inputField = $("<input type='text' maxlength='10' style='margin-right:10px;'>");
//         inputField.val(this.usid); // Set the initial value to the current USID
//         var searchButton = $("<button>Search</button>");

//         // Add input field and search button to dialog content
//         var inputContainer = $("<div style='margin-bottom:10px;'></div>");
//         inputContainer.append(inputField);
//         inputContainer.append(searchButton);
//         dialogContent.append(inputContainer);

//         // Create the table
//         var table = $("<table style='width:100%; border-collapse:collapse;'>");
//         this.table = table;
//         dialogContent.append(table);

//         var dialogButtons = [
//             {
//                 text: "Close",
//                 width: 80,
//                 click: function () {
//                     _this.dialog.inforDialog("close");
//                 },
//             },
//         ];

//         var dialogOptions = {
//             title: "User Data",
//             dialogType: "General",
//             modal: true,
//             width: 600,
//             minHeight: 480,
//             icon: "info",
//             closeOnEscape: true,
//             close: function () {
//                 _this.dialog = null;
//             },
//         };

//         this.dialog = H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);

//         // Initial fetch of data for the current USID
//         this.fetchUserData(this.usid);

//         // Handle search button click
//         searchButton.click(function () {
//             var newUsid = inputField.val();
//             if (newUsid.length > 0) {
//                 _this.fetchUserData(newUsid);
//             } else {
//                 alert("Please enter a valid USID.");
//             }
//         });
//     };

//     H5User.prototype.updateTable = function (data) {
//         var table = this.table;
//         table.empty();

//         if (data) {
//             var headerRow = $("<tr>");
//             var dataRow = $("<tr>");

//             for (var key in data) {
//                 var th = $("<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>").text(key);
//                 var td = $("<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>").text(data[key]);
//                 headerRow.append(th);
//                 dataRow.append(td);
//             }

//             table.append(headerRow);
//             table.append(dataRow);
//         } else {
//             var noDataRow = $("<tr><td colspan='2' style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>No data found</td></tr>");
//             table.append(noDataRow);
//         }
//     };

//     return H5User;
// })();

// H5User.Init(scriptArgs);
































// var H5User = /** @class */ (function () {
//     function H5User(scriptArgs) {
//         debugger;
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = scriptArgs.args;
//         if (ScriptUtil.version >= 2.0) {
//             this.miService = MIService;
//         } else {
//             this.miService = MIService.Current;
//         }
//     }

//     H5User.Init = function (args) {
//         new H5User(args).run();
//     };

//     H5User.prototype.run = function () {
//         this.usid = ScriptUtil.GetUserContext("USID");
//         this.addButton();
//     };

//     H5User.prototype.addButton = function () {
//         var _this = this;
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "run";
//         buttonElement.Value = "Execute MI calls";
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 3;
//         buttonElement.Position.Left = 1;
//         buttonElement.Position.Width = 5;

//         var contentElement = this.controller.GetContentElement();
//         var $button = contentElement.AddElement(buttonElement);
//         $button.click({}, function () {
//             _this.fetchUserData();
//         });
//     };

//     H5User.prototype.fetchUserData = function () {
//         var _this = this;
//         var myRequest = new MIRequest();
//         myRequest.program = "MNS150MI";
//         myRequest.transaction = "LstUserData";
//         myRequest.outputFields = ["USID", "TX40", "USTP", "DTFM", "CUNO", "PHNO", "TFNO", "ADK1", "EMAL","DFMN", "PROE"];
//         myRequest.record = { USID: this.usid };

//         this.miService.executeRequestV2(myRequest).then(function (response) {
//             if (response.items.length > 0) {
//                 _this.showDialog(response.items[0]);
//             } else {
//                 _this.log.Info("No user data found.");
//             }
//         }).catch(function (response) {
//             _this.log.Error(response.errorMessage);
//         });
//     };

//     H5User.prototype.showDialog = function (data) {
//         var _this = this;
//         var dialogContent = $("<div><label class='inforLabel noColon'>User Data</label></div>");
//         var table = $("<table style='width:100%; border-collapse:collapse;'>");

//         var headerRow = $("<tr>");
//         var dataRow = $("<tr>");

//         for (var key in data) {
//             var th = $("<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>").text(key);
//             var td = $("<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>").text(data[key]);
//             headerRow.append(th);
//             dataRow.append(td);
//         }

//         table.append(headerRow);
//         table.append(dataRow);
//         dialogContent.append(table);

//         var dialogButtons = [
//             {
//                 text: "Close",
//                 width: 80,
//                 click: function () {
//                     _this.dialog.inforDialog("close");
//                 },
//             },
//         ];

//         var dialogOptions = {
//             title: "User Data",
//             dialogType: "General",
//             modal: true,
//             width: 600,
//             minHeight: 480,
//             icon: "info",
//             closeOnEscape: true,
//             close: function () {
//                 _this.dialog = null;
//             },
//         };

//         this.dialog = H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
//     };

//     return H5User;
// })();

// H5User.Init(scriptArgs);

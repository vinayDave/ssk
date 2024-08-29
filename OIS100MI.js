var OIS100MI = /** @class */ (function () {
    function OIS100MI(args) {
        debugger;
        this.controller = args.controller;
        this.log = args.log;
        this.args = args.args;
        this.pageCount = 1; // Track the number of pages loaded
        this.z = 1; // Initialize z for debugging
        this.dialog = null; // Store reference to the dialog
        this.table = null; // Store reference to the table

        // Bind event handler functions to ensure 'this' refers to the instance of OIS100MI
        this.attachEvents = this.attachEvents.bind(this);
    }

    // Script initialization function
    OIS100MI.Init = function (args) {
        new OIS100MI(args).run(args);
    };

    OIS100MI.prototype.run = function (args) {
        // if (this.controller.GetPanelName() !== "OIA100E0") {
        //     this.log.Error("Script should run in OIA101BC.");
            
        //     return;
        // }

        this.createButton(); // Add button to the UI
        this.attachEvents();
    };

    OIS100MI.prototype.createButton = function () {
        var _this = this;
        try {
            var buttonElement = new ButtonElement();
            buttonElement.Name = "run";
            buttonElement.Value = "Show Popup";
            buttonElement.Position = new PositionElement();
            buttonElement.Position.Top = 6;
            buttonElement.Position.Left = 90;
            buttonElement.Position.Width = 10;

            var contentElement = this.controller.GetContentElement();
            var $button = contentElement.AddElement(buttonElement);
            $button.click({}, function () {
                try {
                    _this.showPopup([]); // Show the popup initially with empty data
                } catch (error) {
                    console.error("Error handling button click:", error);
                }
            });
        } catch (error) {
            console.error("Error in createButton method:", error);
        }
    };

    OIS100MI.prototype.getCono = function () {
        // Logic to fetch CONO value dynamically
        return "100"; // Replace with dynamic value
    };

    OIS100MI.prototype.getOrno = function () {
        var orno = ScriptUtil.GetFieldValue("OAORNO");
        // Logic to fetch ORNO value dynamically
        return orno; // Replace with dynamic value
    };

    OIS100MI.prototype.showPopup = function (items) {
        try {
            var self = this;

            // Create the dialog content
            var dialogContent = $(
                "<div><label class='inforLabel noColon'>OIS100MI Customer Order</label></div>"
            );

            // Create input field and search button
            var inputField = $("<input type='text' maxlength='10' style='margin-right:10px;'>");
            var searchButton = $("<button>Search</button>");

            // Add input field and search button to dialog content
            var inputContainer = $("<div style='margin-bottom:10px;'></div>");
            inputContainer.append(inputField);
            inputContainer.append(searchButton);
            dialogContent.append(inputContainer);

            // Create the table with data from the response items
            var table = $("<table style='width:100%; border-collapse:collapse;'>");
            self.table = table;

            var headerRow = $("<tr>");
            if (items.length > 0) {
                // Table headers
                var columns = Object.keys(items[0]);
                columns.forEach(function (column) {
                    var th = $(
                        "<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>"
                    ).text(column);
                    headerRow.append(th);
                });
                table.append(headerRow);

                // Table data
                items.forEach(function (item) {
                    var row = $("<tr>");
                    columns.forEach(function (column) {
                        var cell = $(
                            "<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>"
                        ).text(item[column]);
                        row.append(cell);
                    });
                    table.append(row);
                });
            }

            // Add table to dialog content
            dialogContent.append(table);

            var dialogButtons = [
                {
                    text: "Close",
                    width: 80,
                    click: function () {
                        self.dialog.inforDialog("close");
                    },
                },
            ];

            var dialogOptions = {
                title: "OIS100MI Customer Order",
                dialogType: "General",
                modal: true,
                width: 600,
                minHeight: 480,
                icon: "info",
                closeOnEscape: true,
                close: function () {
                    self.dialog = null;
                },
                open: function (event, ui) {
                    // Any additional actions to perform when dialog is opened
                },
                buttons: dialogButtons,
            };

            if (self.dialog) {
                self.updateTable(items);
            } else {
                // Show the dialog
                self.dialog = H5ControlUtil.H5Dialog.CreateDialogElement(
                    dialogContent[0],
                    dialogOptions
                );
            }

            // Handle search button click
            searchButton.click(function () {
                var orno = inputField.val();
                if (orno.length === 10) {
                    self.fetchDataAndUpdatePopup(orno);
                } else {
                    alert("Please enter a valid ORNO (10 characters).");
                }
            });
        } catch (error) {
            console.error("Error in showPopup method:", error);
        }
    };

    OIS100MI.prototype.updateTable = function (items) {
        var self = this;
        var table = self.table;
        table.empty();

        if (items.length > 0) {
            var columns = Object.keys(items[0]);
            var headerRow = $("<tr>");
            columns.forEach(function (column) {
                var th = $(
                    "<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>"
                ).text(column);
                headerRow.append(th);
            });
            table.append(headerRow);

            items.forEach(function (item) {
                var row = $("<tr>");
                columns.forEach(function (column) {
                    var cell = $(
                        "<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>"
                    ).text(item[column]);
                    row.append(cell);
                });
                table.append(row);
            });
        }
    };

    OIS100MI.prototype.fetchDataAndUpdatePopup = function (orno) {
        var self = this;
        var cono = self.getCono();

        const myRequest = new MIRequest();
        myRequest.program = "OIS100MI";
        myRequest.transaction = "LstLine";
        myRequest.outputFields = ["ITNO", "ITDS", "WHLO", "CUPO"];
        myRequest.record = {
            CONO: cono,
            ORNO: orno
        };

        MIService.Current.executeRequest(myRequest)
            .then((response) => {
                self.updateTable(response.items);
                self.z++;
                console.log("Incremented z after fetchDataAndUpdatePopup:", self.z);
            })
            .catch((error) => {
                self.log.Error(error.errorMessage);
            });
    };

    OIS100MI.prototype.attachEvents = function () {
        const self = this;
        const controller = self.controller;
        const requestObj = controller.GetRequestObject();
        const requestData = requestObj.requestData;

        if (requestData) {
            requestData.addRequestCompleted(function () {
                self.pageCount++; // Increment the page count
            });
        }
    };

    return OIS100MI;
})();





































//------------------------------------------------------------------------------------
// working code 
//------------------------------------------------------------------------------------
// var OIS100MI = /** @class */ (function () {
//     function OIS100MI(args) {
//         debugger;
//         this.controller = args.controller;
//         this.log = args.log;
//         this.args = args.args;
//         this.pageCount = 1; // Track the number of pages loaded
//         this.z = 1; // Initialize z for debugging

//         // Bind event handler functions to ensure 'this' refers to the instance of OIS100MI
//         this.attachEvents = this.attachEvents.bind(this);
//     }

//     // Script initialization function
//     OIS100MI.Init = function (args) {
//         new OIS100MI(args).run(args);
//     };

//     OIS100MI.prototype.run = function (args) {
//         if (this.controller.GetPanelName() !== "OIA100E0") {
//             this.log.Error("Script should run in OIA101BC.");
//             return;
//         }

//         this.createButton(); // Add button to the UI
//         this.attachEvents();
//     };

//     OIS100MI.prototype.createButton = function () {
//         var _this = this;
//         try {
//             var buttonElement = new ButtonElement();
//             buttonElement.Name = "run";
//             buttonElement.Value = "Show Popup";
//             buttonElement.Position = new PositionElement();
//             buttonElement.Position.Top = 6;
//             buttonElement.Position.Left = 90;
//             buttonElement.Position.Width = 10;

//             var contentElement = this.controller.GetContentElement();
//             var $button = contentElement.AddElement(buttonElement);
//             $button.click({}, function () {
//                 try {
//                     _this.executeByRequest(); // Invoke executeByRequest directly to fetch data and show the popup
//                 } catch (error) {
//                     console.error("Error handling button click:", error);
//                 }
//             });
//         } catch (error) {
//             console.error("Error in createButton method:", error);
//         }
//     };

//     OIS100MI.prototype.executeByRequest = function () {
//         var self = this;
//         // Dynamically fetch the CONO and ORNO values
//         var cono = self.getCono();
//         var orno = self.getOrno();

//         const myRequest = new MIRequest();
//         myRequest.program = "OIS100MI";
//         myRequest.transaction = "LstLine"; // Update the transaction as needed
//         // Fields that should be returned by the transaction
//         myRequest.outputFields = ["ITNO", "ITDS", "WHLO", "CUPO"];

//         // Input to the transaction
//         myRequest.record = {
//             CONO: cono,
//             ORNO: orno
//         }; // Set appropriate input values

//         MIService.Current.executeRequest(myRequest)
//             .then((response) => {
//                 // Read results here
//                 self.showPopup(response.items); // Call showPopup with items from the response
//                 self.z++;
//                 console.log("Incremented z after executeByRequest:", self.z);
//             })
//             .catch((error) => {
//                 // Handle errors here
//                 self.log.Error(error.errorMessage);
//             });
//     };

//     OIS100MI.prototype.getCono = function () {
//         // Logic to fetch CONO value dynamically
//         // Example: return value from an input field or another API call
//         return "100"; // Replace with dynamic value
//     };

//     OIS100MI.prototype.getOrno = function () {
//         var orno = ScriptUtil.GetFieldValue("OAORNO");
//         // Logic to fetch ORNO value dynamically
//         // Example: return value from an input field or another API call
//         return orno; // Replace with dynamic value
//     };

//     OIS100MI.prototype.showPopup = function (items) {
//         try {
//             var self = this;

//             // Create the dialog content
//             var dialogContent = $(
//                 "<div><label class='inforLabel noColon'>OIS100MI Customer Order</label></div>"
//             );

//             // Create input field and search button
//             var inputField = $("<input type='text' maxlength='10' style='margin-right:10px;'>");
//             var searchButton = $("<button>Search</button>");

//             // Log the creation of input elements
//             console.log("Input field and search button created.");

//             // Add input field and search button to dialog content
//             var inputContainer = $("<div style='margin-bottom:10px;'></div>");
//             inputContainer.append(inputField);
//             inputContainer.append(searchButton);
//             dialogContent.append(inputContainer);

//             // Log the addition of input container to dialog content
//             console.log("Input container added to dialog content.");

//             // Create the table with data from the response items
//             var table = $("<table style='width:100%; border-collapse:collapse;'>");
//             var headerRow = $("<tr>");

//             // Table headers
//             var columns = Object.keys(items[0]);
//             columns.forEach(function (column) {
//                 var th = $(
//                     "<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>"
//                 ).text(column);
//                 headerRow.append(th);
//             });
//             table.append(headerRow);

//             // Table data
//             items.forEach(function (item) {
//                 var row = $("<tr>");
//                 columns.forEach(function (column) {
//                     var cell = $(
//                         "<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>"
//                     ).text(item[column]);
//                     row.append(cell);
//                 });
//                 table.append(row);
//             });

//             // Add table to dialog content
//             dialogContent.append(table);

//             var dialogButtons = [
//                 {
//                     text: "Close",
//                     width: 80,
//                     click: function () {
//                         $(this).inforDialog("close");
//                     },
//                 },
//             ];

//             var dialogOptions = {
//                 title: "OIS100MI Customer Order",
//                 dialogType: "General",
//                 modal: true,
//                 width: 600,
//                 minHeight: 480,
//                 icon: "info",
//                 closeOnEscape: true,
//                 close: function () {
//                     dialogContent.remove();
//                 },
//                 open: function (event, ui) {
//                     // Any additional actions to perform when dialog is opened
//                 },
//                 buttons: dialogButtons,
//             };

//             // Show the dialog
//             H5ControlUtil.H5Dialog.CreateDialogElement(
//                 dialogContent[0],
//                 dialogOptions
//             );

//             // Log the display of the dialog
//             console.log("Dialog displayed.");

//             // Handle search button click
//             searchButton.click(function () {
//                 var orno = inputField.val();
//                 if (orno.length === 10) {
//                     self.fetchDataAndShowPopup(orno);
//                 } else {
//                     alert("Please enter a valid ORNO (10 characters).");
//                 }
//             });
//         } catch (error) {
//             console.error("Error in showPopup method:", error);
//         }
//     };

//     OIS100MI.prototype.fetchDataAndShowPopup = function (orno) {
//         var self = this;
//         var cono = self.getCono();

//         const myRequest = new MIRequest();
//         myRequest.program = "OIS100MI";
//         myRequest.transaction = "LstLine";
//         myRequest.outputFields = ["ITNO", "ITDS", "WHLO", "CUPO"];
//         myRequest.record = {
//             CONO: cono,
//             ORNO: orno
//         };

//         MIService.Current.executeRequest(myRequest)
//             .then((response) => {
//                 self.showPopup(response.items);
//                 self.z++;
//                 console.log("Incremented z after fetchDataAndShowPopup:", self.z);
//             })
//             .catch((error) => {
//                 self.log.Error(error.errorMessage);
//             });
//     };

//     OIS100MI.prototype.attachEvents = function () {
//         const self = this;
//         const controller = self.controller;
//         const requestObj = controller.GetRequestObject();
//         const requestData = requestObj.requestData;

//         if (requestData) {
//             requestData.addRequestCompleted(function () {
//                 self.pageCount++; // Increment the page count
//             });
//         }
//     };

//     return OIS100MI;
// })();
































// var OIS100MI = /** @class */ (function () {
//     function OIS100MI(args) {
//         debugger;
//         this.controller = args.controller;
//         this.log = args.log;
//         this.args = args.args;
//         this.pageCount = 1; // Track the number of pages loaded
//         this.z = 1; // Initialize z for debugging

//         // Bind event handler functions to ensure 'this' refers to the instance of OIS100MI
//         this.attachEvents = this.attachEvents.bind(this);
//     }

//     // Script initialization function
//     OIS100MI.Init = function (args) {
//         new OIS100MI(args).run(args);
//     };

//     OIS100MI.prototype.run = function (args) {
        
//         if (this.controller.GetPanelName() !== "OIA100E0") {
//             this.log.Error("Script should run in OIA101BC.");
//             return;
//         }
        
//         this.createButton(); // Add button to the UI
//         this.attachEvents();
//     };

//     OIS100MI.prototype.createButton = function () {
//         var _this = this;
//         try {
//             var buttonElement = new ButtonElement();
//             buttonElement.Name = "run";
//             buttonElement.Value = "Show Popup";
//             buttonElement.Position = new PositionElement();
//             buttonElement.Position.Top = 6;
//             buttonElement.Position.Left = 90;
//             buttonElement.Position.Width = 10;

//             var contentElement = this.controller.GetContentElement();
//             var $button = contentElement.AddElement(buttonElement);
//             $button.click({}, function () {
//                 try {
//                     _this.executeByRequest(); // Invoke executeByRequest directly to fetch data and show the popup
//                 } catch (error) {
//                     console.error("Error handling button click:", error);
//                 }
//             });
//         } catch (error) {
//             console.error("Error in createButton method:", error);
//         }
//     };

//     OIS100MI.prototype.executeByRequest = function () {
//         var self = this;
//         // Dynamically fetch the CONO and ORNO values
//         var cono = self.getCono();
//         var orno = self.getOrno();

//         const myRequest = new MIRequest();
//         myRequest.program = "OIS100MI";
//         myRequest.transaction = "LstLine"; // Update the transaction as needed
//         // Fields that should be returned by the transaction
//         myRequest.outputFields = ["ITNO", "ITDS", "WHLO", "CUPO"];

//         // Input to the transaction
//         myRequest.record = {
//             CONO: cono,
//             ORNO: orno
//         }; // Set appropriate input values

//         MIService.Current.executeRequest(myRequest)
//             .then((response) => {
//                 // Read results here
//                 self.showPopup(response.items); // Call showPopup with items from the response
//                 self.z++;
//                 console.log("Incremented z after executeByRequest:", self.z);
//             })
//             .catch((error) => {
//                 // Handle errors here
//                 self.log.Error(error.errorMessage);
//             });
//     };

//     OIS100MI.prototype.getCono = function () {
//         // Logic to fetch CONO value dynamically
//         // Example: return value from an input field or another API call
//         return "100"; // Replace with dynamic value
//     };

//     OIS100MI.prototype.getOrno = function () {
//         var orno = ScriptUtil.GetFieldValue("OAORNO");
//         // Logic to fetch ORNO value dynamically
//         // Example: return value from an input field or another API call
//         return orno; // Replace with dynamic value
//     };

//     OIS100MI.prototype.showPopup = function (items) {
//         try {
//             var self = this;

//             // Create the dialog content
//             var dialogContent = $(
//                 "<div><label class='inforLabel noColon'>OIS100MI Customer Order</label></div>"
//             );

//             // Create the table with data from the response items
//             var table = $("<table style='width:100%; border-collapse:collapse;'>");
//             var headerRow = $("<tr>");

//             // Table headers
//             var columns = Object.keys(items[0]);
//             columns.forEach(function (column) {
//                 var th = $(
//                     "<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>"
//                 ).text(column);
//                 headerRow.append(th);
//             });
//             table.append(headerRow);

//             // Table data
//             items.forEach(function (item) {
//                 var row = $("<tr>");
//                 columns.forEach(function (column) {
//                     var cell = $(
//                         "<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>"
//                     ).text(item[column]);
//                     row.append(cell);
//                 });
//                 table.append(row);
//             });

//             // Add table to dialog content
//             dialogContent.append(table);

//             var dialogButtons = [
//                 {
//                     text: "Refresh",
//                     isDefault: true,
//                     width: 80,
//                     click: function () {
//                         // Remove existing table and reload data
//                         table.remove();
//                         self.showPopup(items);
//                     },
//                 },
//                 {
//                     text: "Close",
//                     width: 80,
//                     click: function () {
//                         $(this).inforDialog("close");
//                     },
//                 },
//             ];

//             var dialogOptions = {
//                 title: "OIS100MI Customer Order",
//                 dialogType: "General",
//                 modal: true,
//                 width: 600,
//                 minHeight: 480,
//                 icon: "info",
//                 closeOnEscape: true,
//                 close: function () {
//                     dialogContent.remove();
//                 },
//                 open: function (event, ui) {
//                     // Any additional actions to perform when dialog is opened
//                 },
//                 buttons: dialogButtons,
//             };

//             // Show the dialog
//             H5ControlUtil.H5Dialog.CreateDialogElement(
//                 dialogContent[0],
//                 dialogOptions
//             );
//         } catch (error) {
//             console.error("Error in showPopup method:", error);
//         }
//     };

//     OIS100MI.prototype.attachEvents = function () {
//         const self = this;
//         const controller = self.controller;
//         const requestObj = controller.GetRequestObject();
//         const requestData = requestObj.requestData;

//         if (requestData) {
//             requestData.addRequestCompleted(function () {
//                 self.pageCount++; // Increment the page count
//             });
//         }
//     };

//     return OIS100MI;
// })();






























































































// var OIS100MI = /** @class */ (function () {
//     function OIS100MI(args) {
//       debugger;
//         this.controller = args.controller;
//         this.log = args.log;
//         this.args = args.args;
//         this.pageCount = 1; // Track the number of pages loaded
//         this.z = 1; // Initialize z for debugging
   
//         // Bind event handler functions to ensure 'this' refers to the instance of OIS100MI
//         this.attachEvents = this.attachEvents.bind(this);
//     }
   
//     // Script initialization function
//     OIS100MI.Init = function (args) {
//         new OIS100MI(args).run(args);
//     };
   
//     OIS100MI.prototype.run = function (args) {
//         if (this.controller.GetPanelName() !== "OIA100A0") {
//             this.log.Error("Script should run in OIA101BC.");
//             return;
//         }
   
//         this.createButton(); // Add button to the UI
   
//         this.attachEvents();
//     };
   
//     OIS100MI.prototype.createButton = function () {
//         var _this = this;
//         try {
//             var buttonElement = new ButtonElement();
//             buttonElement.Name = "run";
//             buttonElement.Value = "Show Popup";
//             buttonElement.Position = new PositionElement();
//             buttonElement.Position.Top = 6;
//             buttonElement.Position.Left = 90;
//             buttonElement.Position.Width = 10;
   
//             // Add styling to the button
//             buttonElement.Style = {
//                 backgroundColor: "lightblue",
//                 border: "1px solid #ccc",
//                 padding: "15px",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//                 color: "black",
//                 fontSize: "16px",
//                 fontWeight: "bold",
//             };
   
//             var contentElement = this.controller.GetContentElement();
//             var $button = contentElement.AddElement(buttonElement);
//             $button.click({}, function () {
//                 try {
//                     _this.executeByRequest(); // Invoke executeByRequest directly to fetch data and show the popup
//                 } catch (error) {
//                     console.error("Error handling button click:", error);
//                 }
//             });
//         } catch (error) {
//             console.error("Error in createButton method:", error);
//         }
//     };
   
//     OIS100MI.prototype.executeByRequest = function () {
//         var self = this;
//         const myRequest = new MIRequest();
//         myRequest.program = "OIS100MI";
//         myRequest.transaction = "LstLine"; // Update the transaction as needed
//         // Fields that should be returned by the transaction
//         myRequest.outputFields = ["ITNO", "ITDS", "WHLO", "CUPO"];
   
//         // Input to the transaction
//         myRequest.record = {
//             CONO: "100",
//             ORNO: "0080000032"
//         }; // Set appropriate input values
   
//         MIService.Current.executeRequest(myRequest)
//             .then((response) => {
//                 // Read results here
//                 self.showPopup(response.items); // Call showPopup with items from the response
//                 self.z++;
//                 console.log("Incremented z after executeByRequest:", self.z);
//             })
//             .catch((error) => {
//                 // Handle errors here
//                 self.log.Error(error.errorMessage);
//             });
//     };
   
//     OIS100MI.prototype.showPopup = function (items) {
//         try {
//             var self = this;
   
//             // Create the dialog content
//             var dialogContent = $(
//                 "<div><label class='inforLabel noColon'>OIS100MI Customer Order</label></div>"
//             );
   
//             // Create the table with data from the response items
//             var table = $("<table style='width:100%; border-collapse:collapse;'>");
//             var headerRow = $("<tr>");
   
//             // Table headers
//             var columns = Object.keys(items[0]);
//             columns.forEach(function (column) {
//                 var th = $(
//                     "<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>"
//                 ).text(column);
//                 headerRow.append(th);
//             });
//             table.append(headerRow);
   
//             // Table data
//             items.forEach(function (item) {
//                 var row = $("<tr>");
//                 columns.forEach(function (column) {
//                     var cell = $(
//                         "<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>"
//                     ).text(item[column]);
//                     row.append(cell);
//                 });
//                 table.append(row);
//             });
   
//             // Add table to dialog content
//             dialogContent.append(table);
   
//             var dialogButtons = [
//                 {
//                     text: "Refresh",
//                     isDefault: true,
//                     width: 80,
//                     click: function () {
//                         // Remove existing table and reload data
//                         table.remove();
//                         self.showPopup(items);
//                     },
//                 },
//                 {
//                     text: "Close",
//                     width: 80,
//                     click: function () {
//                         $(this).inforDialog("close");
//                     },
//                 },
//             ];
   
//             var dialogOptions = {
//                 title: "OIS100MI Customer Order",
//                 dialogType: "General",
//                 modal: true,
//                 width: 600,
//                 minHeight: 480,
//                 icon: "info",
//                 closeOnEscape: true,
//                 close: function () {
//                     dialogContent.remove();
//                 },
//                 open: function (event, ui) {
//                     // Any additional actions to perform when dialog is opened
//                 },
//                 buttons: dialogButtons,
//             };
   
//             // Show the dialog
//             H5ControlUtil.H5Dialog.CreateDialogElement(
//                 dialogContent[0],
//                 dialogOptions
//             );
//         } catch (error) {
//             console.error("Error in showPopup method:", error);
//         }
//     };
   
//     OIS100MI.prototype.attachEvents = function () {
//         const self = this;
//         const controller = self.controller;
//         const requestObj = controller.GetRequestObject();
//         const requestData = requestObj.requestData;
   
//         if (requestData) {
//             requestData.addRequestCompleted(function () {
//                 self.pageCount++; // Increment the page count
//             });
//         }
//     };
   
//     return OIS100MI;
//   })();






























// var OIS100MI = /** @class */ (function () {
//     function OIS100MI(args) {
//         this.controller = args.controller;
//         debugger;
//         this.log = args.log;
//         this.args = args.args;
//         this.pageCount = 1; // Track the number of pages loaded
//         this.z = 1; // Initialize z for debugging

//         // Bind event handler functions to ensure 'this' refers to the instance of OIS100MI
//         this.attachEvents = this.attachEvents.bind(this);
//     }

//     // Script initialization function
//     OIS100MI.Init = function (args) {
//         new OIS100MI(args).run(args);
//     };

//     OIS100MI.prototype.run = function (args) {
//         if (this.controller.GetPanelName() !== "OIA100A0") {
//             this.log.Error("Script should run in OIA300BC.");
//             return;
//         }

//         this.createButton(); // Add button to the UI
//         this.attachEvents();

//         // Subscribe to grid scroll event
//         var grid = this.controller.GetGrid();
//         grid.onScroll.subscribe(this.handleScroll.bind(this));
//     };

//     OIS100MI.prototype.createButton = function () {
//         var _this = this;
//         try {
//             var buttonElement = new ButtonElement();
//             buttonElement.Name = "run";
//             buttonElement.Value = "Show Grid Data";
//             buttonElement.Position = new PositionElement();
//             buttonElement.Position.Top = 5;
//             buttonElement.Position.Left = 80;
//             buttonElement.Position.Width = 15;

//             var contentElement = this.controller.GetContentElement();
//             var $button = contentElement.AddElement(buttonElement);
//             $button.click({}, function () {
//                 try {
//                     _this.executeByRequest(); // Call executeByRequest method instead of showPopup
//                 } catch (error) {
//                     console.error("Error handling button click:", error);
//                 }
//             });
//         } catch (error) {
//             console.error("Error in createButton method:", error);
//         }
//     };

//     OIS100MI.prototype.showPopup = function (items) {
//         try {
//             var self = this;

//             // Create the dialog content
//             var dialogContent = $(
//                 "<div><label class='inforLabel noColon'>OIS300 Customer Order</label></div>"
//             );

//             // Create the table with data from the API response
//             var tableContainer = $("<div style='overflow-x:auto;'>");
//             var table = $("<table style='width:100%; border-collapse:collapse;'>");
//             var headerRow = $("<tr>");

//             // Table headers
//             var columns = self.getGridColumns();
//             columns.forEach(function (column) {
//                 var th = $(
//                     "<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>"
//                 ).text(column.name);
//                 headerRow.append(th);
//             });
//             table.append(headerRow);

//             // Prepare data for the table rows
//             var data = [];
//             for (let item of items) {
//                 let row = { id: "R" + (data.length + 1) };
//                 columns.forEach(function (column) {
//                     row[column.colId] = item[column.colId];
//                 });
//                 data.push(row);
//             }

//             // Convert data to table rows
//             data.forEach(function (rowData) {
//                 var row = $("<tr>");
//                 columns.forEach(function (column) {
//                     var cell = $(
//                         "<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>"
//                     ).text(rowData[column.colId]);
//                     row.append(cell);
//                 });
//                 table.append(row);
//             });

//             // Add table to table container
//             tableContainer.append(table);

//             // Add table container to dialog content
//             dialogContent.append(tableContainer);

//             var dialogButtons = [
//                 {
//                     text: "Refresh",
//                     isDefault: true,
//                     width: 80,
//                     click: function () {
//                         // Remove existing table and reload data
//                         table.remove();
//                         self.executeByRequest(); // Call executeByRequest instead of showPopup
//                     },
//                 },
//                 {
//                     text: "Close",
//                     width: 80,
//                     click: function () {
//                         $(this).inforDialog("close");
//                     },
//                 },
//             ];

//             var dialogOptions = {
//                 title: "OIS300 Customer Order",
//                 dialogType: "General",
//                 modal: true,
//                 width: 600,
//                 minHeight: 480,
//                 icon: "info",
//                 closeOnEscape: true,
//                 close: function () {
//                     dialogContent.remove();
//                 },
//                 open: function (event, ui) {
//                     // Any additional actions to perform when dialog is opened
//                 },
//                 buttons: dialogButtons,
//             };

//             // Show the dialog
//             H5ControlUtil.OIS100MI.CreateDialogElement(
//                 dialogContent[0],
//                 dialogOptions
//             );
//         } catch (error) {
//             console.error("Error in showPopup method:", error);
//         }
//     };

//     OIS100MI.prototype.getGridColumns = function () {
//         var grid = this.controller.GetGrid();
//         var columns = grid.getColumns();

//         return columns;
//     };

//     OIS100MI.prototype.attachEvents = function () {
//         const self = this;
//         const controller = self.controller;
//         const requestObj = controller.GetRequestObject();
//         const requestData = requestObj.requestData;

//         if (requestData) {
//             requestData.addRequestCompleted(function () {
//                 self.pageCount++; // Increment the page count
//             });
//         }
//     };

//     OIS100MI.prototype.executeByRequest = function () {
//         var self = this;
//         const myRequest = new MIRequest();
//         myRequest.program = "OIS100MI";
//         myRequest.transaction = "LstLine"; // Update the transaction as needed
//         // Fields that should be returned by the transaction
//         myRequest.outputFields = ["ITNO", "ITDS", "ORQT", "WHLO"];

//         // Input to the transaction
//         myRequest.record = {
//             CONO: "100",
//             ORNO: "0080000032"
//         }; // Set appropriate input values

//         MIService.Current.executeRequest(myRequest)
//             .then((response) => {
//                 // Read results here
//                 self.showPopup(response.items); // Call showPopup with items from the response
//                 self.z++;
//                 console.log("Incremented z after executeByRequest:", self.z);
//             })
//             .catch((error) => {
//                 // Handle errors here
//                 self.log.Error(error.errorMessage);
//             });
//     };

//     return OIS100MI;
// })();




















// var OIS100MI = /** @class */ (function () {
//     function OIS100MI(args) {
//       debugger;
//         this.controller = args.controller;
//         this.log = args.log;
//         this.args = args.args;
//         this.pageCount = 1; // Track the number of pages loaded
//         this.z = 1; // Initialize z for debugging
   
//         // Bind event handler functions to ensure 'this' refers to the instance of OIS100MI
//         this.attachEvents = this.attachEvents.bind(this);
//     }
   
//     // Script initialization function
//     OIS100MI.Init = function (args) {
//         new OIS100MI(args).run(args);
//     };
   
//     OIS100MI.prototype.run = function (args) {
//         this.orno = ScriptUtil.GetUserContext("ORNO");
//         if (this.controller.GetPanelName() !== "OIA100A0") {
//             this.log.Error("Script should run in OIA101BC.");
//             return;
//         }
   
//         this.createButton(); // Add button to the UI
   
//         this.attachEvents();
//     };
   
//     OIS100MI.prototype.createButton = function () {
//         var _this = this;
//         try {
//             var buttonElement = new ButtonElement();
//             buttonElement.Name = "run";
//             buttonElement.Value = "Show Popup";
//             buttonElement.Position = new PositionElement();
//             buttonElement.Position.Top = 6;
//             buttonElement.Position.Left = 90;
//             buttonElement.Position.Width = 10;

//             var contentElement = this.controller.GetContentElement();
//             var $button = contentElement.AddElement(buttonElement);
//             $button.click({}, function () {
//                 try {
//                     _this.executeByRequest(); // Invoke executeByRequest directly to fetch data and show the popup
//                 } catch (error) {
//                     console.error("Error handling button click:", error);
//                 }
//             });
//         } catch (error) {
//             console.error("Error in createButton method:", error);
//         }
//     };
   
//     OIS100MI.prototype.executeByRequest = function () {
//         var self = this;
//         const myRequest = new MIRequest();
//         myRequest.program = "OIS100MI";
//         myRequest.transaction = "LstLine"; // Update the transaction as needed
//         myRequest.includeMetadata = true;
//         //Convert data to number and date as defined in the metadata; default is false
//         myRequest.typedOutput = true;
//         //Default is 33
//         myRequest.maxReturnedRecords = 10;
//         //Default is 55000
//         myRequest.timeout = 60000;
//         this.miService.executeRequestV2(myRequest).then(function (response) {
//             //Since CONO is numeric based on the metadata, this will read "999 is a number"
//             //If request.typedOutput = false, everything will be a string and this will read "999  is a string"
//             _this.log.Info("3: ".concat(response.items[0].ORNO, " is a ").concat(typeof response.items[0].ORNO));
//         }, function (response) {
//             //Alternatively, pass a second function to then instead of using catch
//             //Handle errors here
//             _this.log.Error(response.errorMessage);
//         });
//         console.log(orno);
//         MIService.Current.executeRequest(myRequest)
//             .then((response) => {
//                 // Read results here
//                 self.showPopup(response.items); // Call showPopup with items from the response
//                 self.z++;
//                 console.log("Incremented z after executeByRequest:", self.z);
//             })
//             .catch((error) => {
//                 // Handle errors here
//                 self.log.Error(error.errorMessage);
//             });
//     };
   
//     OIS100MI.prototype.showPopup = function () {
//         try {
//             var self = this;

//             // Create the dialog content
//             var dialogContent = $(
//                 "<div><label class='inforLabel noColon'>OIS300 Customer Order</label></div>"
//             );

//             // Create the table with data from the grid
//             var tableContainer = $("<div style='overflow-x:auto;'>");
//             var table = $("<table style='width:100%; border-collapse:collapse;'>");
//             var headerRow = $("<tr>");

//             // Table headers
//             var columns = self.getGridColumns();
//             columns.forEach(function (column) {
//                 var th = $(
//                     "<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>"
//                 ).text(column.name);
//                 headerRow.append(th);
//             });
//             table.append(headerRow);

//             // Create rows data
//             var data = [];
//             var rows = self.getGridData(columns);
//             for (let item of rows) {
//                 let row = {
//                     id: "R" + (data.length + 1)
//                 };
//                 columns.forEach(function (column) {
//                     row[column.colId] = item[column.colId];
//                 });
//                 data.push(row);
//             }

//             // Convert rows data to table rows
//             data.forEach(function (rowData) {
//                 var row = $("<tr>");
//                 columns.forEach(function (column) {
//                     var cell = $(
//                         "<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>"
//                     ).text(rowData[column.colId]);
//                     row.append(cell);
//                 });
//                 table.append(row);
//             });

//             // Add table to table container
//             tableContainer.append(table);

//             // Add table container to dialog content
//             dialogContent.append(tableContainer);

//             var dialogButtons = [
//                 {
//                     text: "Refresh",
//                     isDefault: true,
//                     width: 80,
//                     click: function () {
//                         // Remove existing table and reload data
//                         table.remove();
//                         self.showPopup();
//                     },
//                 },
//                 {
//                     text: "Close",
//                     width: 80,
//                     click: function () {
//                         $(this).inforDialog("close");
//                     },
//                 },
//             ];

//             var dialogOptions = {
//                 title: "OIS300 Customer Order",
//                 dialogType: "General",
//                 modal: true,
//                 width: 600,
//                 minHeight: 480,
//                 icon: "info",
//                 closeOnEscape: true,
//                 close: function () {
//                     dialogContent.remove();
//                 },
//                 open: function (event, ui) {
//                     // Any additional actions to perform when dialog is opened
//                 },
//                 buttons: dialogButtons,
//             };

//             // Show the dialog
//             H5ControlUtil.OIS100MI.CreateDialogElement(
//                 dialogContent[0],
//                 dialogOptions
//             );
//         } catch (error) {
//             console.error("Error in showPopup method:", error);
//         }
//     };

//     OIS100MI.prototype.getGridColumns = function () {
//         var grid = this.controller.GetGrid();
//         var columns = grid.getColumns();

//         return columns;
//     };
//     OIS100MI.prototype.attachEvents = function () {
//         const self = this;
//         const controller = self.controller;
//         const requestObj = controller.GetRequestObject();
//         const requestData = requestObj.requestData;
   
//         if (requestData) {
//             requestData.addRequestCompleted(function () {
//                 self.pageCount++; // Increment the page count
//             });
//         }
//     };
   
//     return OIS100MI;
//   })();


































// /**
// * OIS100MI class for executing M3 API calls on the OIA100A0 panel.
// */
// var OIS100MI = /** @class */ (function () {
//     function OIS100MI(args) {
//         this.controller = args.controller;
//         this.log = args.log;
//         this.args = args.args;
//         this.pageCount = 1; // Track the number of pages loaded
//         this.z = 1; // Initialize z for debugging

//         // Bind event handler functions to ensure 'this' refers to the instance of OIS100MI
//         this.attachEvents = this.attachEvents.bind(this);

//         if (ScriptUtil.version >= 2.0) {
//             this.miService = MIService;
//         } else {
//             this.miService = MIService.Current;
//         }
//     }

//     // Script initialization function
//     OIS100MI.Init = function (args) {
//         new OIS100MI(args).run(args);
//     };

//     OIS100MI.prototype.run = function (args) {
//         if (this.controller.GetPanelName() !== "OIA100A0") {
//             this.log.Error("Script should run in OIA100A0.");
//             return;
//         }

//         this.createButton(); // Add button to the UI
//         this.attachEvents();

//         // Subscribe to grid scroll event
//         var grid = this.controller.GetGrid();
//         grid.onScroll.subscribe(this.handleScroll.bind(this));
//     };

//     OIS100MI.prototype.createButton = function () {
//         var _this = this;
//         try {
//             var buttonElement = new ButtonElement();
//             buttonElement.Name = "run";
//             buttonElement.Value = "Show Grid Data";
//             buttonElement.Position = new PositionElement();
//             buttonElement.Position.Top = 5;
//             buttonElement.Position.Left = 80;
//             buttonElement.Position.Width = 15;

//             var contentElement = this.controller.GetContentElement();
//             var $button = contentElement.AddElement(buttonElement);
//             $button.click({}, function () {
//                 try {
//                     _this.showPopup();
//                 } catch (error) {
//                     console.error("Error handling button click:", error);
//                 }
//             });
//         } catch (error) {
//             console.error("Error in createButton method:", error);
//         }
//     };

//     OIS100MI.prototype.showPopup = function () {
//         var self = this;

//         // Create the dialog content
//         var dialogContent = $("<div><label class='inforLabel noColon'>OIS300 Customer Order</label></div>");

//         // Create the table container
//         var tableContainer = $("<div style='overflow-x:auto;'>");
//         var table = $("<table style='width:100%; border-collapse:collapse;'>");
//         var headerRow = $("<tr>");

//         // Table headers
//         var columns = self.getGridColumns();
//         columns.forEach(function (column) {
//             var th = $("<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>").text(column.name);
//             headerRow.append(th);
//         });
//         table.append(headerRow);

//         // Fetch data from API and populate table
//         self.fetchDataFromApi(columns).then(function (data) {
//             data.forEach(function (rowData) {
//                 var row = $("<tr>");
//                 columns.forEach(function (column) {
//                     var cell = $("<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>").text(rowData[column.colId]);
//                     row.append(cell);
//                 });
//                 table.append(row);
//             });

//             // Add table to table container
//             tableContainer.append(table);

//             // Add table container to dialog content
//             dialogContent.append(tableContainer);

//             var dialogButtons = [
//                 {
//                     text: "Refresh",
//                     isDefault: true,
//                     width: 80,
//                     click: function () {
//                         // Remove existing table and reload data
//                         table.remove();
//                         self.showPopup();
//                     },
//                 },
//                 {
//                     text: "Close",
//                     width: 80,
//                     click: function () {
//                         $(this).inforDialog("close");
//                     },
//                 },
//             ];

//             var dialogOptions = {
//                 title: "OIS100 Customer Order",
//                 dialogType: "General",
//                 modal: true,
//                 width: 600,
//                 minHeight: 480,
//                 icon: "info",
//                 closeOnEscape: true,
//                 close: function () {
//                     dialogContent.remove();
//                 },
//                 open: function (event, ui) {
//                     // Any additional actions to perform when dialog is opened
//                 },
//                 buttons: dialogButtons,
//             };

//             // Show the dialog
//             H5ControlUtil.OIS100MI.CreateDialogElement(dialogContent[0], dialogOptions);
//         }).catch(function (error) {
//             console.error("Error fetching data from API:", error);
//         });
//     };

//     OIS100MI.prototype.getGridColumns = function () {
//         return [
//             { colId: "ITNO", name: "Item Number" },
//             { colId: "ITDS", name: "Item Description" },
//             { colId: "ORQT", name: "Ordered Quantity" },
//             { colId: "WHLO", name: "Warehouse" },
//             { colId: "CUPO", name: "Customer Order Line Number" },
//             { colId: "DWDT", name: "Requested Delivery Date" }
//         ];
//     };

//     OIS100MI.prototype.fetchDataFromApi = function (columns) {
//         var _this = this;
//         var myRequest = new MIRequest();
//         myRequest.program = "OIS100MI";
//         myRequest.transaction = "LstLine";
//         myRequest.maxReturnedRecords = 100;
//         myRequest.outputFields = columns.map(function (column) { return column.colId; });

//         return this.miService.executeRequestV2(myRequest).then(function (response) {
//             var data = [];
//             if (response.items) {
//                 for (var index = 0; index < response.items.length; index++) {
//                     var item = response.items[index];
//                     var row = {};
//                     columns.forEach(function (column) { 
//                         row[column.colId] = item[column.colId];
//                     });
//                     data.push(row);
//                 }
//             }
//             return data;
//         }).catch(function (error) {
//             _this.log.Error("Error fetching data from API: " + error.errorMessage);
//             return [];
//         });
//     };

//     OIS100MI.prototype.attachEvents = function () {
//         const self = this;
//         const controller = self.controller;
//         const requestObj = controller.GetRequestObject();
//         const requestData = requestObj.requestData;

//         if (requestData) {
//             requestData.addRequestCompleted(function () {
//                 self.pageCount++; // Increment the page count
//             });
//         }
//     };

//     return OIS100MI;
// })();





























// var OIS100MI = /** @class */ (function () {
//     function OIS100MI(args) {
//       debugger;
//         this.controller = args.controller;
//         this.log = args.log;
//         this.args = args.args;
//         this.pageCount = 1; // Track the number of pages loaded
//         this.z = 1; // Initialize z for debugging
   
//         // Bind event handler functions to ensure 'this' refers to the instance of OIS100MI
//         this.attachEvents = this.attachEvents.bind(this);
//     }
   
//     // Script initialization function
//     OIS100MI.Init = function (args) {
//         new OIS100MI(args).run(args);
//     };
   
//     OIS100MI.prototype.run = function (args) {
//         if (this.controller.GetPanelName() !== "OIA100A0") {
//             this.log.Error("Script should run in OIA101BC.");
//             return;
//         }
   
//         this.createButton(); // Add button to the UI
   
//         this.attachEvents();
//     };
   
//     OIS100MI.prototype.createButton = function () {
//         var _this = this;
//         try {
//             var buttonElement = new ButtonElement();
//             buttonElement.Name = "run";
//             buttonElement.Value = "Show Popup";
//             buttonElement.Position = new PositionElement();
//             buttonElement.Position.Top = 6;
//             buttonElement.Position.Left = 90;
//             buttonElement.Position.Width = 10;
   
//             // Add styling to the button
//             buttonElement.Style = {
//                 backgroundColor: "lightblue",
//                 border: "1px solid #ccc",
//                 padding: "15px",
//                 borderRadius: "5px",
//                 cursor: "pointer",
//                 color: "black",
//                 fontSize: "16px",
//                 fontWeight: "bold",
//             };
   
//             var contentElement = this.controller.GetContentElement();
//             var $button = contentElement.AddElement(buttonElement);
//             $button.click({}, function () {
//                 try {
//                     _this.executeByRequest(); // Invoke executeByRequest directly to fetch data and show the popup
//                 } catch (error) {
//                     console.error("Error handling button click:", error);
//                 }
//             });
//         } catch (error) {
//             console.error("Error in createButton method:", error);
//         }
//     };
   
//     OIS100MI.prototype.executeByRequest = function () {
//         var self = this;
//         const myRequest = new MIRequest();
//         myRequest.program = "OIS100MI";
//         myRequest.transaction = "LstLine"; // Update the transaction as needed
//         // Fields that should be returned by the transaction
//         myRequest.outputFields = ["ITNO", "ITDS", "ORQT", "WHLO", "CUPO", "DWDT", "JDCD", "SAPR", "DIA1", "DIA2", "DIA3", "DIA4", "DIA5", "DIA6", "DLSP", "DLSX", "PONR", "POSX", "ORST", "CFXX", "ECVS", "NLAM", "ALUN", "SPUN", "SAP2", "POPN", "ALWT", "ALWQ", "ORQA", "CODT", "SACD", "CUCD", "NEPR", "AGNO", "CUOR", "PRRF", "EDFP", "DIP1", "DIP2", "DIP3", "DIP4", "DIP5", "DIP6", "DWHM", "COHM", "ATNR", "ALQT", "DLQT", "IVQT", "NTCD", "PRMO", "PROJ", "ELNO", "SUNO", "DIC1", "DIC2", "DIC3", "DIC4", "DIC5", "DIC6", "UCOS", "COCD", "CMNO", "RSCD", "BANO", "TEDS", "CFIN", "WHSL", "CAMU", "APBA", "PRHL", "SERN", "CTNO", "CFGL", "WATP", "GWTP", "PRHW", "SERW", "PWNR", "PWSX", "EWST", "AGNB", "CTNS", "TECN", "INAP", "REPI", "RIDN", "RIDL", "RIDX", "DRDN", "DRDL", "DRDX", "LNCL", "PRIO", "UCA1", "UCA2", "UCA3", "UCA4", "UCA5", "UCA6", "UCA7", "UCA8", "UCA9", "UCA0", "UDN1", "UDN2", "UDN3", "UDN4", "UDN5", "UDN6", "UID1", "UID2", "UID3", "UCT1", "CAWE", "DIA7", "DIA8", "DIP7", "DIP8", "DIC7", "DIC8", "ADID", "STCD", "CINA", "ABNO", "DEFC", "PRCH", "OTDI", "VTCD", "TINC", "TEPY", "PMOR", "MPRD", "BNCD", "PRAC", "PIDE", "CLAT", "RAGN", "DWDZ", "DWHZ", "CODZ", "COHZ", "DSDT", "DSHM", "PLDT", "PLHM", "TEDL", "TEL1", "TEL2", "MODL", "ROUT", "RODN", "BOP1", "PIKD", "RSC5", "RSC6", "RSC7", "PRHC", "RSC8"];
   
//         // Input to the transaction
//         myRequest.record = {
//             CONO: "100",
//             ORNO: "0080000032"
//         }; // Set appropriate input values
   
//         MIService.Current.executeRequest(myRequest)
//             .then((response) => {
//                 // Read results here
//                 self.showPopup(response.items); // Call showPopup with items from the response
//                 self.z++;
//                 console.log("Incremented z after executeByRequest:", self.z);
//             })
//             .catch((error) => {
//                 // Handle errors here
//                 self.log.Error(error.errorMessage);
//             });
//     };
   
//     OIS100MI.prototype.showPopup = function (items) {
//         try {
//             var self = this;
   
//             // Create the dialog content
//             var dialogContent = $(
//                 "<div><label class='inforLabel noColon'>OIS100MI Customer Order</label></div>"
//             );
   
//             // Create the table with data from the response items
//             var table = $("<table style='width:100%; border-collapse:collapse;'>");
//             var headerRow = $("<tr>");
   
//             // Table headers
//             var columns = Object.keys(items[0]);
//             columns.forEach(function (column) {
//                 var th = $(
//                     "<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>"
//                 ).text(column);
//                 headerRow.append(th);
//             });
//             table.append(headerRow);
   
//             // Table data
//             items.forEach(function (item) {
//                 var row = $("<tr>");
//                 columns.forEach(function (column) {
//                     var cell = $(
//                         "<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>"
//                     ).text(item[column]);
//                     row.append(cell);
//                 });
//                 table.append(row);
//             });
   
//             // Add table to dialog content
//             dialogContent.append(table);
   
//             var dialogButtons = [
//                 {
//                     text: "Refresh",
//                     isDefault: true,
//                     width: 80,
//                     click: function () {
//                         // Remove existing table and reload data
//                         table.remove();
//                         self.showPopup(items);
//                     },
//                 },
//                 {
//                     text: "Close",
//                     width: 80,
//                     click: function () {
//                         $(this).inforDialog("close");
//                     },
//                 },
//             ];
   
//             var dialogOptions = {
//                 title: "OIS100MI Customer Order",
//                 dialogType: "General",
//                 modal: true,
//                 width: 600,
//                 minHeight: 480,
//                 icon: "info",
//                 closeOnEscape: true,
//                 close: function () {
//                     dialogContent.remove();
//                 },
//                 open: function (event, ui) {
//                     // Any additional actions to perform when dialog is opened
//                 },
//                 buttons: dialogButtons,
//             };
   
//             // Show the dialog
//             H5ControlUtil.OIS100MI.CreateDialogElement(
//                 dialogContent[0],
//                 dialogOptions
//             );
//         } catch (error) {
//             console.error("Error in showPopup method:", error);
//         }
//     };
   
//     OIS100MI.prototype.attachEvents = function () {
//         const self = this;
//         const controller = self.controller;
//         const requestObj = controller.GetRequestObject();
//         const requestData = requestObj.requestData;
   
//         if (requestData) {
//             requestData.addRequestCompleted(function () {
//                 self.pageCount++; // Increment the page count
//             });
//         }
//     };
   
//     return OIS100MI;
//   })();





var H5Addition = /** @class */ (function () {
    
    function H5Addition(scriptArgs) {
        debugger;
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
        this.data = null; // Initialize data
        this.currentIndex = 0; // Initialize index for iterating through data
        this.totalOBNEPR = 0; // Initialize total for OBNEPR values
        this.isTotalCalculated = false; // Flag to track if total has been calculated
    }
    
    H5Addition.Init = function (args) {
        new H5Addition(args).run();
        
    };
    
    H5Addition.prototype.run = function () {
        let myGrid = this.controller.GetGrid();
        this.data = myGrid.getData();
        console.log(JSON.stringify(this.data, null, 2));

        this.contentElement = this.controller.GetContentElement();
        this.addTextBox();  
        this.addButton();
    };
    
    H5Addition.prototype.addTextBox = function () {
        var textElement = new TextBoxElement();
        textElement.Name = "testTextBox";
        textElement.Value = "";
        textElement.Position = new PositionElement();
        textElement.Position.Top = 5;
        textElement.Position.Left = 80;
        textElement.Position.Width = 15;
        this.contentElement.AddElement(textElement);
        this.textElement = textElement; // Store reference to text element
    };
    
    H5Addition.prototype.addButton = function () {
        var _this = this;
        var buttonElement = new ButtonElement();
        buttonElement.Name = "testButton";
        buttonElement.Value = "ADDITION";
        buttonElement.Position = new PositionElement();
        buttonElement.Position.Top = 7;
        buttonElement.Position.Left = 80;
        buttonElement.Position.Width = 5;
    
        var $button = this.contentElement.AddElement(buttonElement);
        $button.click({}, function () {
            // Fetch data and update text box only once
            if (!_this.isTotalCalculated) {
                _this.updateTextBox();
                _this.isTotalCalculated = true;
            }
        });
    };

    H5Addition.prototype.updateTextBox = function () {
        // Initialize total OBNEPR value
        var obneprTotal = 0;
        
        // Loop through all items in this.data array
        for (var i = 0; i < this.data.length; i++) {
            // Get the OBNEPR value from each item and add it to obneprTotal
            if (this.data[i].OBNEPR !== null && !isNaN(parseFloat(this.data[i].OBNEPR))) {
                obneprTotal += parseFloat(this.data[i].OBNEPR);
            }
        }
        
        // Update text box value with the accumulated total
        this.textElement.Value = obneprTotal.toFixed(2); // Display total with 2 decimal places
        
        // Log the updated total value
        this.log.Info("Updated total OBNEPR value: " + obneprTotal.toFixed(2));
    };

    return H5Addition;
}());

// Example usage
H5Addition.Init({
    controller: yourControllerObject,
    log: yourLogObject,
    args: yourArgsObject
});
























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

//             // Add input field and search button to dialog content
//             var inputContainer = $("<div style='margin-bottom:10px;'></div>");
//             inputContainer.append(inputField);
//             inputContainer.append(searchButton);
//             dialogContent.append(inputContainer);

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






































// var H5Addition = /** @class */ (function () {
    
//     function H5Addition(scriptArgs) {
//         debugger;
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = scriptArgs.args;
//         this.data = null; // Initialize data
//         this.currentIndex = 0; // Initialize index for iterating through data
//         this.totalOBNEPR = 0; // Initialize total for OBNEPR values
//         this.isTotalCalculated = false; // Flag to track if total has been calculated
//     }
    
//     H5Addition.Init = function (args) {
//         new H5Addition(args).run();
        
//     };
    
//     H5Addition.prototype.run = function () {
//         let myGrid = this.controller.GetGrid();
//         this.data = myGrid.getData();
//         console.log(JSON.stringify(this.data, null, 2));

//         this.contentElement = this.controller.GetContentElement();
//         this.addTextBox();
//         this.addButton();
//     };
    
//     H5Addition.prototype.addTextBox = function () {
//         var textElement = new TextBoxElement();
//         textElement.Name = "testTextBox";
//         textElement.Value = "";
//         textElement.Position = new PositionElement();
//         textElement.Position.Top = 5;
//         textElement.Position.Left = 80;
//         textElement.Position.Width = 15;
//         this.contentElement.AddElement(textElement);
//         this.textElement = textElement; // Store reference to text element
//     };
    
//     H5Addition.prototype.addButton = function () {
//         var _this = this;
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "testButton";
//         buttonElement.Value = "ADDITION";
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 7;
//         buttonElement.Position.Left = 80;
//         buttonElement.Position.Width = 5;
    
//         var $button = this.contentElement.AddElement(buttonElement);
//         $button.click({}, function () {
//             // Fetch data and update text box only once
//             if (!_this.isTotalCalculated) {
//                 _this.updateTextBox();
//                 _this.isTotalCalculated = true;
//             }
//         });
//     };

//     H5Addition.prototype.updateTextBox = function () {
//         // Ensure that this.data has at least one item
//         if (this.data.length > 0) {
//             var obneprTotal = 0;
//             // Loop through all properties of the first item in this.data
//             for (var key in this.data[0]) {
//                 if (key === "OBNEPR") {
//                     var obneprValue = parseFloat(this.data[0][key]);
//                     obneprTotal += obneprValue;
//                 }
//             }
            
//             // Update text box value with the accumulated total
//             this.textElement.Value = obneprTotal.toFixed(2); // Display total with 2 decimal places
            
//             // Log the updated total value
            
//         }
//     };

//     return H5Addition;
// }());






















// var H5Addition = /** @class */ (function () {
    
//     function H5Addition(scriptArgs) {
//         debugger;
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = scriptArgs.args;
//         this.data = null; // Initialize data
//         this.currentIndex = 0; // Initialize index for iterating through data
//     }
    
//     H5Addition.Init = function (args) {
//         new H5Addition(args).run();
//     };
    
//     H5Addition.prototype.run = function () {
//         let myGrid = this.controller.GetGrid();
//         this.data = myGrid.getData();
//         console.log(JSON.stringify(this.data, null, 2));

//         this.contentElement = this.controller.GetContentElement();
//         this.addTextBox();
//         this.addButton();
//     };
    
//     H5Addition.prototype.addTextBox = function () {
//         var textElement = new TextBoxElement();
//         textElement.Name = "testTextBox";
//         textElement.Value = "";
//         textElement.Position = new PositionElement();
//         textElement.Position.Top = 5;
//         textElement.Position.Left = 80;
//         textElement.Position.Width = 15;
//         this.contentElement.AddElement(textElement);
//         this.textElement = textElement; // Store reference to text element
//     };
    
//     H5Addition.prototype.addButton = function () {
//         var _this = this;
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "testButton";
//         buttonElement.Value = "ADDITION";
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 7;
//         buttonElement.Position.Left = 80;
//         buttonElement.Position.Width = 5;
    
//         var $button = this.contentElement.AddElement(buttonElement);
//         $button.click({}, function () {
//             // Fetch data and update text box
//             _this.updateTextBox();
//         });
//     };

//     H5Addition.prototype.updateTextBox = function () {
//         var obneprValue = this.data[this.currentIndex].OBNEPR;
        
//         // Append current value to existing text box value
//         var currentValue = this.textElement.Value || "";
//         if (currentValue !== "") {
//             currentValue += ", ";
//         }
//         currentValue += obneprValue;
        
//         // Update text box value
//         this.textElement.Value = currentValue;
        
//         // Log the updated value
//         this.log.Info("Updated text box value: " + currentValue);
        
       
//     };

//     return H5Addition;
// }());

// // Example usage
// H5Addition.Init({
//     controller: yourControllerObject,
//     log: yourLogObject,
//     args: yourArgsObject
// });














// var H5Addition = /** @class */ (function () {
    
//     function H5Addition(scriptArgs) {
//         debugger;
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = scriptArgs.args;
//         let myGrid = this.controller.GetGrid();
//         this.data = myGrid.getData();
//         console.log();
//         console.log(JSON.stringify(this.data, null, 2));
//         this.currentIndex = 0;
//     }
//     H5Addition.Init = function (args) {
        
//         new H5Addition(args).run();
//         let myGrid = this.controller.GetGrid();
//         console.log(myGrid);

//     };
//     H5Addition.prototype.run = function () {
//         this.contentElement = this.controller.GetContentElement();
        
//         this.addTextBox();
        
//         this.addButton();
        
//     };
    
//     H5Addition.prototype.addTextBox = function () {
//         this.textElement = new TextBoxElement();
//         this.textElement.Name = "testTextBox";
//         this.textElement.Value = "";
//         this.textElement.Position = new PositionElement();
//         this.textElement.Position.Top = 5;
//         this.textElement.Position.Left = 80;
//         this.textElement.Position.Width = 15;
//         this.contentElement.AddElement(this.textElement);
//     };
    
    
//     H5Addition.prototype.addButton = function () {
//         var _this = this;
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "testButton";
//         buttonElement.Value = "ADDITION";
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 7;
//         buttonElement.Position.Left = 80;
//         buttonElement.Position.Width = 5;
    
//         var $button = this.contentElement.AddElement(buttonElement);
//         $button.click({}, function () {
//             // Start fetching data in a loop
//             _this.fetchDataInLoop();
//         });
//     };

//     H5Addition.prototype.fetchDataInLoop = function () {
//         var _this = this;

//         // Clear any existing interval
//         if (this.intervalId) {
//             clearInterval(this.intervalId);
//         }

//         // Set interval to update text box value every second
//         this.intervalId = setInterval(function () {
//             // Get OBNEPR value from current index
//             var obneprValue = _this.data[_this.currentIndex].OBNEPR;

//             // Update text box value
//             _this.textElement.Value = obneprValue;

//             // Log the fetched data
//             _this.log.Info("Data fetched from M3: " + obneprValue);

//             // Move to next index (loop through data)
//             _this.currentIndex = (_this.currentIndex + 1) % _this.data.length;
//         }, 1000); // Interval in milliseconds (adjust as needed)
//     };

//     return H5Addition;
// }());

// // Example usage
// H5Addition.Init({
//     controller: yourControllerObject,
//     log: yourLogObject,
//     args: yourArgsObject
// });



















// var H5Addition = /** @class */ (function () {
    
//     function H5Addition(scriptArgs) {
//         debugger;
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = scriptArgs.args;
//         let myGrid = this.controller.GetGrid();
//         let data =myGrid.getData();
//         console.log();
//         console.log(JSON.stringify(data,null,2));
//         let obneprValue = data[0].OBNEPR;
//         console.log("OBNEPR Value:", obneprValue);
//     }
//     H5Addition.Init = function (args) {
        
//         new H5Addition(args).run();
//         let myGrid = this.controller.GetGrid();
//         console.log(myGrid);

//     };
//     H5Addition.prototype.run = function () {
//         this.contentElement = this.controller.GetContentElement();
        
//         this.addTextBox();
        
//         this.addButton();
        
//     };
    
//     H5Addition.prototype.addTextBox = function () {
//         var textElement = new TextBoxElement();
//         textElement.Name = "testTextBox";
//         textElement.Value = "";
//         textElement.Position = new PositionElement();
//         textElement.Position.Top = 5;
//         textElement.Position.Left = 80;
//         textElement.Position.Width = 15;
//         this.contentElement.AddElement(textElement);
        
//     };
    
    
//     H5Addition.prototype.addButton = function () {
//         var _this = this;
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "testButton";
//         buttonElement.Value = "ADDITION";
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 7;
//         buttonElement.Position.Left = 80;
//         buttonElement.Position.Width = 5;
    
//         var $button = this.contentElement.AddElement(buttonElement);
//         $button.click({}, function () {
//             // This function could be used to fetch data from M3
//             _this.fetchDataFromM3();
//         });
//     };
    
    
//     return H5Addition;
// }());

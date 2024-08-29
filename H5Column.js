// var H5Column = /** @class */ (function () {
    
//     function H5Column(scriptArgs) {
//         debugger;
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = scriptArgs.args;
//         this.data = null; // Initialize data
//         this.currentIndex = 0; // Initialize index for iterating through data
//         this.isTotalCalculated = false; // Flag to track if total has been calculated
        
//         // Attach event handlers for Requesting, Requested, and RequestCompleted
//         this.attachEvents();
//     }
    
//     H5Column.Init = function (args) {
//         debugger;
//         new H5Column(args).run();
//     };
    
//     H5Column.prototype.run = function () {
//         var myGrid = this.controller.GetGrid();
//         this.data = myGrid.getData();
//         console.log(JSON.stringify(this.data, null, 2));
//         var list = this.controller.GetGrid();
//         var customColumnNum = list.getColumns().length + 1;
//         this.appendColumn(list, customColumnNum); // Append the custom column
//         this.populateData(list, customColumnNum); // Populate the custom column with data
//     };
    
//     H5Column.prototype.attachEvents = function () {
//         var _this = this;
//         // Subscribe to Requesting event
//         this.unsubscribeRequesting = this.controller.Requesting.On(function (e) {
//             _this.onRequesting(e);
//         });
        
//         // Subscribe to Requested event
//         this.unsubscribeRequested = this.controller.Requested.On(function (e) {
//             _this.onRequested(e);
//         });
        
//         // Subscribe to RequestCompleted event
//         this.unsubscribeReqCompleted = this.controller.RequestCompleted.On(function (e) {
//             // Populate additional data on scroll
//             if (e.commandType === "PAGE" && e.commandValue === "DOWN") {
//                 _this.populateData(_this.controller.GetGrid(), _this.customColumnNum);
//             } else {
//                 _this.detachEvents();
//             }
//         });
//     };
    
//     H5Column.prototype.detachEvents = function () {
//         // Unsubscribe from Requesting event
//         if (this.unsubscribeRequesting) {
//             this.unsubscribeRequesting();
//             this.unsubscribeRequesting = null;
//         }
        
//         // Unsubscribe from Requested event
//         if (this.unsubscribeRequested) {
//             this.unsubscribeRequested();
//             this.unsubscribeRequested = null;
//         }
        
//         // Unsubscribe from RequestCompleted event
//         if (this.unsubscribeReqCompleted) {
//             this.unsubscribeReqCompleted();
//             this.unsubscribeReqCompleted = null;
//         }
//     };
    
//     H5Column.prototype.onRequesting = function (args) {
//         this.log.Info("onRequesting");
//         // Handle logic in Requesting event if needed
//     };
    
//     H5Column.prototype.onRequested = function (args) {
//         this.log.Info("onRequested");
//         // Handle logic in Requested event if needed
//     };
    
//     H5Column.prototype.appendColumn = function (list, columnNum) {
//         var columnId = "CustomColumn" + columnNum;
//         var columns = list.getColumns();
//         var newColumn = {
//             id: columnId,
//             field: columnId,
//             name: "Custom Column " + columnNum,
//             width: 150,
//             formatter: this.customColumnFormatter // Optional: Define a custom formatter for the column
//         };
//         columns.push(newColumn);
//         list.setColumns(columns);
//     };
    
//     H5Column.prototype.populateData = function (list, columnNum) {
//         var columnId = "CustomColumn" + columnNum;
//         var dataset = list.getData();
//         for (var i = 0; i < dataset.length; i++) {
//             var data = dataset[i];
//             var obneprValue = parseFloat(data.OANTAM) || 0;
//             var obsaprValue = parseFloat(data.OANTLA) || 0;
//             data[columnId] = (obsaprValue - obneprValue).toFixed(2); // Sum OBNEPR and OBSAPR and store in custom column
//         }
//         list.setData(dataset);
//     };
    
//     H5Column.prototype.customColumnFormatter = function (row, cell, value, columnDef, dataContext) {
//         // Custom formatter logic if needed
//         return value; // Default: Return the value as-is
//     };

//     return H5Column;
// }());






















var H5Column = /** @class */ (function () {
    
    function H5Column(scriptArgs) {
        debugger;
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
        this.data = null; // Initialize data
        this.currentIndex = 0; // Initialize index for iterating through data
        this.isTotalCalculated = false; // Flag to track if total has been calculated
    }
    
    H5Column.Init = function (args) {
        debugger;
        new H5Column(args).run();
        
    };
    
    H5Column.prototype.run = function () {
        let myGrid = this.controller.GetGrid();
        this.data = myGrid.getData();
        console.log(JSON.stringify(this.data, null, 2));
        var list = this.controller.GetGrid();
        var customColumnNum = list.getColumns().length + 1;
        this.appendColumn(list, customColumnNum); // Append the custom column
        this.populateData(list, customColumnNum); // Populate the custom column with data
        this.attachEvents(this.controller, list, customColumnNum); // Attach events for dynamic data population
    };
    
    H5Column.prototype.appendColumn = function (list, columnNum) {
        var columnId = "CustomColumn" + columnNum;
        var columns = list.getColumns();
        var newColumn = {
            id: columnId,
            field: columnId,
            name: "Custom Column " + columnNum,
            width: 150,
            formatter: this.customColumnFormatter // Optional: Define a custom formatter for the column
        };
        columns.push(newColumn);
        list.setColumns(columns);
    };
    
    H5Column.prototype.populateData = function (list, columnNum) {
        var columnId = "CustomColumn" + columnNum;
        var dataset = list.getData();
        for (var i = 0; i < dataset.length; i++) {
            var data = dataset[i];
            var obneprValue = parseFloat(data.OANTAM) || 0;
            var obsaprValue = parseFloat(data.OANTLA) || 0;
            data[columnId] = (obsaprValue - obneprValue).toFixed(2); // Sum OBNEPR and OBSAPR and store in custom column
        }
        list.setData(dataset);
    };



    H5Column.prototype.attachEvents = function (controller, list, columnNum) {
        var _this = this;
        this.unsubscribeReqCompleted = controller.RequestCompleted.On(function (e) {
            //Populate additional data on scroll
            if (e.commandType === "PAGE" && e.commandValue === "DOWN") {
                _this.populateData(list, columnNum);
            }
            else {
                _this.detachEvents();
            }
        });
    };



    H5Column.prototype.detachEvents = function () {
        this.unsubscribeReqCompleted.unsubscribe();
    };



    // H5Column.prototype.attachEvents = function (controller, list, columnNum) {
    //     var _this = this;
    //     try {
    //         controller.RequestCompleted.On(function (e) {
    //             //Populate additional data on scroll
    //             try {
    //                 if (e.commandType === "PAGE" && e.commandValue === "DOWN") {
    //                     _this.populateData(list, columnNum);
    //                 }
    //             } catch (error) {
    //                 console.error('Error populating data:', error);
    //             }
    //         });
    //     } catch (error) {
    //         console.error('Error attaching event handler:', error);
    //     }
    // };
    
    H5Column.prototype.customColumnFormatter = function (row, cell, value, columnDef, dataContext) {
        // Custom formatter logic if needed
        return value; // Default: Return the value as-is
    };

    return H5Column;
}());

// Example usage
// H5Column.Init({
//     controller: yourControllerObject,
//     log: yourLogObject,
//     args: yourArgsObject
// });













// var H5Column = /** @class */ (function () {
    
//     function H5Column(scriptArgs) {
//         debugger;
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = scriptArgs.args;
//         this.data = null; // Initialize data
//         this.currentIndex = 0; // Initialize index for iterating through data
//         this.isTotalCalculated = false; // Flag to track if total has been calculated
//         this.attachEventListeners(); // Attach event listeners for pagination and scrolling
//     }
    
//     H5Column.Init = function (args) {
//         debugger;
//         new H5Column(args).run();
        
//     };
    
//     H5Column.prototype.run = function () {
//         let myGrid = this.controller.GetGrid();
//         this.data = myGrid.getData();
//         console.log(JSON.stringify(this.data, null, 2));
//         var list = this.controller.GetGrid();
//         var customColumnNum = list.getColumns().length + 1;
//         this.appendColumn(list, customColumnNum); // Append the custom column
//         this.populateData(list, customColumnNum); // Populate the custom column with data
//         this.attachEvents(this.controller, list, customColumnNum); // Attach events for dynamic data population
//     };

//     // H5Column.prototype.attachEventListeners = function () {
//     //     var _this = this;
//     //     // Listen for changes in row count (pagination)
//     //     this.controller.onRowCountChanged.subscribe(function () {
//     //         _this.handleDataUpdate();
//     //     });

//     //     // Listen for viewport changes (scrolling)
//     //     this.controller.onViewportChanged.subscribe(function () {
//     //         _this.handleDataUpdate();
//     //     });
//     // };

//     H5Column.prototype.handleDataUpdate = function () {
//         var list = this.controller.GetGrid();
//         var customColumnNum = list.getColumns().length; // Assuming last column is custom column
//         this.populateData(list, customColumnNum);
//     };
    
//     H5Column.prototype.appendColumn = function (list, columnNum) {
//         var columnId = "CustomColumn" + columnNum;
//         var columns = list.getColumns();
//         var newColumn = {
//             id: columnId,
//             field: columnId,
//             name: "Custom Column " + columnNum,
//             width: 150,
//             formatter: this.customColumnFormatter // Optional: Define a custom formatter for the column
//         };
//         columns.push(newColumn);
//         list.setColumns(columns);
//     };
    
//     H5Column.prototype.populateData = function (list, columnNum) {
//         var columnId = "CustomColumn" + columnNum;
//         var dataset = list.getData();
//         for (var i = 0; i < dataset.length; i++) {
//             var data = dataset[i];
//             var oantamValue = parseFloat(data.OANTAM) || 0;
//             var oantlaValue = parseFloat(data.OANTLA) || 0;
//             data[columnId] = (oantlaValue - oantamValue).toFixed(2); // Sum OANTAM and OANTLA and store in custom column
//         }
//         list.setData(dataset);
//     };
    
//     H5Column.prototype.attachEvents = function (controller, list, columnNum) {
//         var _this = this;
//         this.unsubscribeReqCompleted = controller.RequestCompleted.On(function (e) {
//             // Handle any events here if needed
//         });
//     };
    
//     H5Column.prototype.customColumnFormatter = function (row, cell, value, columnDef, dataContext) {
//         // Custom formatter logic if needed
//         return value; // Default: Return the value as-is
//     };

//     return H5Column;
// }());

// // Example usage
// H5Column.Init({
//     controller: yourControllerObject,
//     log: yourLogObject,
//     args: yourArgsObject
// });


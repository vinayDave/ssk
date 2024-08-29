var H5Dialog = /** @class */ (function () {
    function H5Dialog(args) {
        this.controller = args.controller;
        debugger;
        this.log = args.log;
        this.args = args.args;
        this.pageCount = 1; // Track the number of pages loaded
        this.z = 1; // Initialize z for debugging

        // Bind event handler functions to ensure 'this' refers to the instance of H5Dialog
        this.attachEvents = this.attachEvents.bind(this);
    }

    // Script initialization function
    H5Dialog.Init = function (args) {
        new H5Dialog(args).run(args);
    };

    H5Dialog.prototype.run = function (args) {
        if (this.controller.GetPanelName() !== "OIA300BC") {
            this.log.Error("Script should run in OIA300BC.");
            return;
        }

        this.createButton(); // Add button to the UI
        this.attachEvents();

        // Subscribe to grid scroll event
        var grid = this.controller.GetGrid();
        grid.onScroll.subscribe(this.handleScroll.bind(this));
    };

    H5Dialog.prototype.createButton = function () {
        var _this = this;
        try {
            var buttonElement = new ButtonElement();
            buttonElement.Name = "run";
            buttonElement.Value = "Show Grid Data";
            buttonElement.Position = new PositionElement();
            buttonElement.Position.Top = 5;
            buttonElement.Position.Left = 80;
            buttonElement.Position.Width = 15;

            var contentElement = this.controller.GetContentElement();
            var $button = contentElement.AddElement(buttonElement);
            $button.click({}, function () {
                try {
                    _this.showPopup();
                } catch (error) {
                    console.error("Error handling button click:", error);
                }
            });
        } catch (error) {
            console.error("Error in createButton method:", error);
        }
    };

    H5Dialog.prototype.showPopup = function () {
        try {
            var self = this;

            // Create the dialog content
            var dialogContent = $(
                "<div><label class='inforLabel noColon'>OIS300 Customer Order</label></div>"
            );

            // Create the table with data from the grid
            var tableContainer = $("<div style='overflow-x:auto;'>");
            var table = $("<table style='width:100%; border-collapse:collapse;'>");
            var headerRow = $("<tr>");

            // Table headers
            var columns = self.getGridColumns();
            columns.forEach(function (column) {
                var th = $(
                    "<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>"
                ).text(column.name);
                headerRow.append(th);
            });
            table.append(headerRow);

            // Create rows data
            var data = [];
            var rows = self.getGridData(columns);
            for (let item of rows) {
                let row = {
                    id: "R" + (data.length + 1)
                };
                columns.forEach(function (column) {
                    row[column.colId] = item[column.colId];
                });
                data.push(row);
            }

            // Convert rows data to table rows
            data.forEach(function (rowData) {
                var row = $("<tr>");
                columns.forEach(function (column) {
                    var cell = $(
                        "<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>"
                    ).text(rowData[column.colId]);
                    row.append(cell);
                });
                table.append(row);
            });

            // Add table to table container
            tableContainer.append(table);

            // Add table container to dialog content
            dialogContent.append(tableContainer);

            var dialogButtons = [
                {
                    text: "Refresh",
                    isDefault: true,
                    width: 80,
                    click: function () {
                        // Remove existing table and reload data
                        table.remove();
                        self.showPopup();
                    },
                },
                {
                    text: "Close",
                    width: 80,
                    click: function () {
                        $(this).inforDialog("close");
                    },
                },
            ];

            var dialogOptions = {
                title: "OIS300 Customer Order",
                dialogType: "General",
                modal: true,
                width: 600,
                minHeight: 480,
                icon: "info",
                closeOnEscape: true,
                close: function () {
                    dialogContent.remove();
                },
                open: function (event, ui) {
                    // Any additional actions to perform when dialog is opened
                },
                buttons: dialogButtons,
            };

            // Show the dialog
            H5ControlUtil.H5Dialog.CreateDialogElement(
                dialogContent[0],
                dialogOptions
            );
        } catch (error) {
            console.error("Error in showPopup method:", error);
        }
    };

    H5Dialog.prototype.getGridColumns = function () {
        var grid = this.controller.GetGrid();
        var columns = grid.getColumns();

        return columns;
    };

    H5Dialog.prototype.getGridData = function (columns) {
        var grid = this.controller.GetGrid();
        var data = grid.getData();
        var rows = [];

        if (Array.isArray(data)) {
            for (var index = 0; index < data.length; index++) {
                var item = data[index];
                var row = { id: "C" + (index + 1) };

                for (var j = 0; j < columns.length; j++) {
                    var column = columns[j];
                    var field = column.colId;
                    var field16 = column.field;

                    // Assign values based on the column ID
                    switch (field) {
                        case "C1":
                            row[field] = item.OADIVI;
                            break;
                        case "C2":
                            row[field] = item.OACUNO;
                            break;
                        case "C3":
                            row[field] = item.OAORNO;
                            break;
                        case "C4":
                            row[field] = item.OARLDT;
                            break;
                        case "C5":
                            row[field] = item.OACUDT;
                            break;
                        case "C6":
                            row[field] = item.OAORTP;
                            break;
                        case "C7":
                            row[field] = item.OAORSL;
                            break;
                        case "C8":
                            row[field] = item.OAORST;
                            break;
                        case "C9":
                            row[field] = item.OAOBLC;
                            break;
                        case "C10":
                            row[field] = item.OACUOR;
                            break;
                        case "C11":
                            row[field] = item.TEXT;
                            break;
                        case "C12":
                            row[field] = item.OAOREF || "0";
                            break;
                        case "C13":
                            row[field] = item.OANTAM;
                            break;
                        case "C14":
                            row[field] = item.OANTLA;
                            break;
                        case "C15":
                            row[field] = item.OAORDT;
                            break;
                       
                    }
                }

                rows.push(row);
            }
        }

        return rows;
    };

    H5Dialog.prototype.attachEvents = function () {
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

    return H5Dialog;
})();
















































// var H5Dialog = /** @class */ (function () {
//     function H5Dialog(args) {
//       this.controller = args.controller;
//       debugger;
//       this.log = args.log;
//       this.args = args.args;
//       this.pageCount = 1; // Track the number of pages loaded
//       this.z = 1; // Initialize z for debugging
  
//       // Bind event handler functions to ensure 'this' refers to the instance of H5Dialog
//       this.attachEvents = this.attachEvents.bind(this);
//     }
  
//     // Script initialization function
//     H5Dialog.Init = function (args) {
//       new H5Dialog(args).run(args);
//     };
  
//     H5Dialog.prototype.run = function (args) {
//       if (this.controller.GetPanelName() !== "OIA300BC") {
//         this.log.Error("Script should run in OIA300BC.");
//         return;
//       }
  
//       this.createButton(); // Add button to the UI
//       this.attachEvents();
  
//       // Subscribe to grid scroll event
//       var grid = this.controller.GetGrid();
//       grid.onScroll.subscribe(this.handleScroll.bind(this));
//     };
  
//     H5Dialog.prototype.createButton = function () {
//       var _this = this;
//       try {
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "run";
//         buttonElement.Value = "Show Grid Data";
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 5;
//         buttonElement.Position.Left = 80;
//         buttonElement.Position.Width = 15;
  
//         var contentElement = this.controller.GetContentElement();
//         var $button = contentElement.AddElement(buttonElement);
//         $button.click({}, function () {
//           try {
//             _this.showPopup();
//           } catch (error) {
//             console.error("Error handling button click:", error);
//           }
//         });
//       } catch (error) {
//         console.error("Error in createButton method:", error);
//       }
//     };
  
//     H5Dialog.prototype.showPopup = function () {
//       try {
//         var self = this;
  
//         // Create the dialog content
//         var dialogContent = $(
//           "<div><label class='inforLabel noColon'>OIS300 Customer Order</label></div>"
//         );
  
//         // Create the table with data from the grid
//         var tableContainer = $("<div style='overflow-x:auto;'>");
//         var table = $("<table style='width:100%; border-collapse:collapse;'>");
//         var headerRow = $("<tr>");
  
//         // Table headers
//         var columns = self.getGridColumns();
//         columns.forEach(function (column) {
//           var th = $(
//             "<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>"
//           ).text(column.name);
//           headerRow.append(th);
//         });
//         table.append(headerRow);
  
//         // Table data
//         var data = self.getGridData(columns);
//         data.forEach(function (rowData) {
//           var row = $("<tr>");
//           columns.forEach(function (column) {
//             var cell = $(
//               "<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>"
//             ).text(rowData[column.colId]);
//             row.append(cell);
//           });
//           table.append(row);
//         });
  
//         // Add table to table container
//         tableContainer.append(table);
  
//         // Add table container to dialog content
//         dialogContent.append(tableContainer);
  
//         var dialogButtons = [
//           {
//             text: "Refresh",
//             isDefault: true,
//             width: 80,
//             click: function () {
//               // Remove existing table and reload data
//               table.remove();
//               self.showPopup();
//             },
//           },
//           {
//             text: "Close",
//             width: 80,
//             click: function () {
//               $(this).inforDialog("close");
//             },
//           },
//         ];
  
//         var dialogOptions = {
//           title: "OIS300 Customer Order",
//           dialogType: "General",
//           modal: true,
//           width: 600,
//           minHeight: 480,
//           icon: "info",
//           closeOnEscape: true,
//           close: function () {
//             dialogContent.remove();
//           },
//           open: function (event, ui) {
//             // Any additional actions to perform when dialog is opened
//           },
//           buttons: dialogButtons,
//         };
  
//         // Show the dialog
//         H5ControlUtil.H5Dialog.CreateDialogElement(
//           dialogContent[0],
//           dialogOptions
//         );
//       } catch (error) {
//         console.error("Error in showPopup method:", error);
//       }
//     };
  
//     H5Dialog.prototype.getGridColumns = function () {
//       var grid = this.controller.GetGrid();
//       var columns = grid.getColumns();
  
//       return columns;
//     };
  
//     H5Dialog.prototype.getGridData = function (columns) {
//       var grid = this.controller.GetGrid();
//       var data = grid.getData();
//       var rows = [];
  
//       if (Array.isArray(data)) {
//         for (var index = 0; index < data.length; index++) {
//           var item = data[index];
//           var row = { id: "C" + (index + 1) };
  
//           for (var j = 0; j < columns.length; j++) {
//             var column = columns[j];
//             var field = column.colId;
//             var field16 = column.field;
  
//             // Assign values based on the column ID
//             switch (field) {
//               case "C1":
//                 row[field] = item.OADIVI;
//                 break;
//               case "C2":
//                 row[field] = item.OACUNO;
//                 break;
//               case "C3":
//                 row[field] = item.OAORNO;
//                 break;
//               case "C4":
//                 row[field] = item.OARLDT;
//                 break;
//               case "C5":
//                 row[field] = item.OACUDT;
//                 break;
//               case "C6":
//                 row[field] = item.OAORTP;
//                 break;
//               case "C7":
//                 row[field] = item.OAORSL;
//                 break;
//               case "C8":
//                 row[field] = item.OAORST;
//                 break;
//               case "C9":
//                 row[field] = item.OAOBLC;
//                 break;
//               case "C10":
//                 row[field] = item.OACUOR;
//                 break;
//               case "C11":
//                 row[field] = item.TEXT;
//                 break;
//               case "C12":
//                 row[field] = item.OAOREF || "0";
//                 break;
//               case "C13":
//                 row[field] = item.OANTAM;
//                 break;
//               case "C14":
//                 row[field] = item.OANTLA;
//                 break;
//               case "C15":
//                 row[field] = item.OAORDT;
//                 break;
              
//             }
//           }
  
//           rows.push(row);
//         }
//       }
  
//       return rows;
//     };
  
//     H5Dialog.prototype.attachEvents = function () {
//       const self = this;
//       const controller = self.controller;
//       const requestObj = controller.GetRequestObject();
//       const requestData = requestObj.requestData;
  
//       if (requestData) {
//         requestData.addRequestCompleted(function () {
//           self.pageCount++; // Increment the page count
//         });
//       }
//     };
  
//     return H5Dialog;
//   })();









































// var H5Dialog = /** @class */ (function () {
//     function H5Dialog(args) {
//       this.controller = args.controller;
//       debugger;
//       this.log = args.log;
//       this.args = args.args;
//       this.pageCount = 1; // Track the number of pages loaded
//       this.z = 1; // Initialize z for debugging
  
//       // Bind event handler functions to ensure 'this' refers to the instance of H5Dialog
//       this.attachEvents = this.attachEvents.bind(this);
//     }
  
//     // Script initialization function
//     H5Dialog.Init = function (args) {
//       new H5Dialog(args).run(args);
//     };
  
//     H5Dialog.prototype.run = function (args) {
//       if (this.controller.GetPanelName() !== "OIA300BC") {
//         this.log.Error("Script should run in OIA300BC.");
//         return;
//       }
  
//       this.createButton(); // Add button to the UI
//       this.attachEvents();
  
//       // Subscribe to grid scroll event
//       var grid = this.controller.GetGrid();
//       grid.onScroll.subscribe(this.handleScroll.bind(this));
//     };
  
//     H5Dialog.prototype.createButton = function () {
//       var _this = this;
//       try {
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "run";
//         buttonElement.Value = "Show Grid Data";
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 5;
//         buttonElement.Position.Left = 80;
//         buttonElement.Position.Width = 15;
  
//         var contentElement = this.controller.GetContentElement();
//         var $button = contentElement.AddElement(buttonElement);
//         $button.click({}, function () {
//           try {
//             _this.showPopup();
//           } catch (error) {
//             console.error("Error handling button click:", error);
//           }
//         });
//       } catch (error) {
//         console.error("Error in createButton method:", error);
//       }
//     };
  
//     H5Dialog.prototype.showPopup = function () {
//       try {
//         var self = this;
  
//         // Create the dialog content
//         var dialogContent = $(
//           "<div><label class='inforLabel noColon'>OIS300 Customer Order</label></div>"
//         );
  
//         // Create the table with data from the grid
//         var table = $("<table style='width:100%; border-collapse:collapse;'>");
//         var headerRow = $("<tr>");
  
//         // Table headers
//         var columns = self.getGridColumns();
//         columns.forEach(function (column) {
//           var th = $(
//             "<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>"
//           ).text(column.name);
//           headerRow.append(th);
//         });
//         table.append(headerRow);
  
//         // Table data
//         var data = self.getGridData(columns);
//         data.forEach(function (rowData) {
//           var row = $("<tr>");
//           columns.forEach(function (column) {
//             var cell = $(
//               "<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>"
//             ).text(rowData[column.colId]);
//             row.append(cell);
//           });
//           table.append(row);
//         });
  
//         // Add table to dialog content
//         dialogContent.append(table);
  
//         var dialogButtons = [
//           {
//             text: "Refresh",
//             isDefault: true,
//             width: 80,
//             click: function () {
//               // Remove existing table and reload data
//               table.remove();
//               self.showPopup();
//             },
//           },
//           {
//             text: "Close",
//             width: 80,
//             click: function () {
//               $(this).inforDialog("close");
//             },
//           },
//         ];
  
//         var dialogOptions = {
//           title: "OIS300 Customer Order",
//           dialogType: "General",
//           modal: true,
//           width: 600,
//           minHeight: 480,
//           icon: "info",
//           closeOnEscape: true,
//           close: function () {
//             dialogContent.remove();
//           },
//           open: function (event, ui) {
//             // Any additional actions to perform when dialog is opened
//           },
//           buttons: dialogButtons,
//         };
  
//         // Show the dialog
//         H5ControlUtil.H5Dialog.CreateDialogElement(
//           dialogContent[0],
//           dialogOptions
//         );
//       } catch (error) {
//         console.error("Error in showPopup method:", error);
//       }
//     };
  
//     H5Dialog.prototype.getGridColumns = function () {
//       var grid = this.controller.GetGrid();
//       var columns = grid.getColumns();
  
//       return columns;
//     };
  
//     H5Dialog.prototype.getGridData = function (columns) {
//       var grid = this.controller.GetGrid();
//       var data = grid.getData();
//       var rows = [];
  
//       if (Array.isArray(data)) {
//         for (var index = 0; index < data.length; index++) {
//           var item = data[index];
//           var row = { id: "C" + (index + 1) };
  
//           for (var j = 0; j < columns.length; j++) {
//             var column = columns[j];
//             var field = column.colId;
//             var field16 = column.field;
  
//             // Assign values based on the column ID
//             switch (field) {
//               case "C1":
//                 row[field] = item.OADIVI;
//                 break;
//               case "C2":
//                 row[field] = item.OACUNO;
//                 break;
//               case "C3":
//                 row[field] = item.OAORNO;
//                 break;
//               case "C4":
//                 row[field] = item.OARLDT;
//                 break;
//               case "C5":
//                 row[field] = item.OACUDT;
//                 break;
//               case "C6":
//                 row[field] = item.OAORTP;
//                 break;
//               case "C7":
//                 row[field] = item.OAORSL;
//                 break;
//               case "C8":
//                 row[field] = item.OAORST;
//                 break;
//               case "C9":
//                 row[field] = item.OAOBLC;
//                 break;
//               case "C10":
//                 row[field] = item.OACUOR;
//                 break;
//               case "C11":
//                 row[field] = item.TEXT;
//                 break;
//               case "C12":
//                 row[field] = item.OAOREF || "0";
//                 break;
//               case "C13":
//                 row[field] = item.OANTAM;
//                 break;
//               case "C14":
//                 row[field] = item.OANTLA;
//                 break;
//               case "C15":
//                 row[field] = item.OAORDT;
//                 break;
//               case "C16":
//                 row[field16] = item.Difference;
//                 break;
//             }
//           }
  
//           rows.push(row);
//         }
//       }
  
//       return rows;
//     };
  
//     H5Dialog.prototype.attachEvents = function () {
//       const self = this;
//       const controller = self.controller;
//       const requestObj = controller.GetRequestObject();
//       const requestData = requestObj.requestData;
  
//       if (requestData) {
//         requestData.addRequestCompleted(function () {
//           self.pageCount++; // Increment the page count
//         });
//       }
//     };
  
//     return H5Dialog;
//   })();
  























































// var H5Dialog = /** @class */ (function () {
//     function H5Dialog(args) {
//       this.controller = args.controller;
//       debugger;
//       this.log = args.log;
//       this.args = args.args;
//       this.pageCount = 1; // Track the number of pages loaded
//       this.z = 1; // Initialize z for debugging
   
//       // Bind event handler functions to ensure 'this' refers to the instance of H5Dialog
//       this.attachEvents = this.attachEvents.bind(this);
//     }
   
//     // Script initialization function
//     H5Dialog.Init = function (args) {
//       new H5Dialog(args).run(args);
//     };
   
//     H5Dialog.prototype.run = function (args) {
//       if (this.controller.GetPanelName() !== "OIA300BC") {
//         this.log.Error("Script should run in OIA300BC.");
//         return;
//       }
   
//       var grid = this.controller.GetGrid();
//       var totalColumns = this.args.columnNum || 16; // Default to 16 if columnNum is not provided
   
//       this.appendColumn(grid, totalColumns);
//       this.calculateDifferences(0); // Initial calculation with start index 0
//       this.createButton(); // Add button to the UI
   
//       this.attachEvents();
   
//       grid.onScroll.subscribe(this.handleScroll.bind(this));
//     };
   
//     H5Dialog.prototype.appendColumn = function (grid, totalColumns) {
//       try {
//         var columnId = "C16"; // Assuming "C16" is the ID for the 16th column
//         var columns = grid.getColumns();
   
//         var newColumn = {
//           id: columnId,
//           field: columnId,
//           name: "Difference",
//           width: 100,
//         };
   
//         if (columns.length < totalColumns) {
//           columns.push(newColumn);
//         }
//         grid.setColumns(columns);
//       } catch (error) {
//         console.error("Error in appendColumn method:", error);
//       }
//     };
   
//     H5Dialog.prototype.calculateDifferences = function (startIndex) {
//       try {
//         var grid = this.controller.GetGrid();
//         var data = grid.getData();
   
//         if (Array.isArray(data)) {
//           for (var i = startIndex; i < data.length; i++) {
//             var item = data[i];
   
//             var amount1 = parseFloat(item.OANTAM);
//             var amount2 = parseFloat(item.OANTLA);
   
//             if (isNaN(amount1)) {
//               amount1 = 0;
//             }
//             if (isNaN(amount2)) {
//               amount2 = 0;
//             }
   
//             var difference;
//             if (isNaN(amount1) || isNaN(amount2)) {
//               difference = "No value";
//             } else {
//               difference = amount2 - amount1;
//             }
   
//             item["C16"] = difference; // Assigning the calculated difference to the "C16" column
//           }
//         }
   
//         grid.setData(data);
//       } catch (error) {
//         console.error("Error in calculateDifferences method:", error);
//       }
//     };
   
//     H5Dialog.prototype.createButton = function () {
//       var _this = this;
//       try {
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "run";
//         buttonElement.Value = "Show Grid Data";
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 5;
//         buttonElement.Position.Left = 80;
//         buttonElement.Position.Width = 15;
   
//         var contentElement = this.controller.GetContentElement();
//         var $button = contentElement.AddElement(buttonElement);
//         $button.click({}, function () {
//           try {
//             _this.showPopup();
//           } catch (error) {
//             console.error("Error handling button click:", error);
//           }
//         });
//       } catch (error) {
//         console.error("Error in createButton method:", error);
//       }
//     };
   
//     H5Dialog.prototype.showPopup = function () {
//       try {
//         var self = this;
   
//         // Create the dialog content
//         var dialogContent = $(
//           "<div><label class='inforLabel noColon'>OIS300 Customer Order</label></div>"
//         );
   
//         // Create the table with data from the grid
//         var table = $("<table style='width:100%; border-collapse:collapse;'>");
//         var headerRow = $("<tr>");
   
//         // Table headers
//         var columns = self.getGridColumns();
//         columns.forEach(function (column) {
//           var th = $(
//             "<th style='border:1px solid #ccc; padding:15px; background-color:#f2f2f2; font-size:20px; font-weight:bold; text-align:center;'>"
//           ).text(column.name);
//           headerRow.append(th);
//         });
//         table.append(headerRow);
   
//         // Table data
//         var data = self.getGridData(columns);
//         data.forEach(function (rowData) {
//           var row = $("<tr>");
//           columns.forEach(function (column) {
//             var cell = $(
//               "<td style='border:1px solid #ccc; padding:10px; font-size:16px; font-weight:bold; text-align:center;'>"
//             ).text(rowData[column.colId]);
//             row.append(cell);
//           });
//           table.append(row);
//         });
   
//         // Add table to dialog content
//         dialogContent.append(table);
   
//         var dialogButtons = [
//           {
//             text: "Refresh",
//             isDefault: true,
//             width: 80,
//             click: function () {
//               // Remove existing table and reload data
//               table.remove();
//               // self.showPopup(items);
//               self.showPopup();
//             },
//           },
//           {
//             text: "Close",
//             width: 80,
//             click: function () {
//               $(this).inforDialog("close");
//             },
//           },
//         ];
   
//         var dialogOptions = {
//           title: "OIS300 Customer Order",
//           dialogType: "General",
//           modal: true,
//           width: 600,
//           minHeight: 480,
//           icon: "info",
//           closeOnEscape: true,
//           close: function () {
//             dialogContent.remove();
//           },
//           open: function (event, ui) {
//             // Any additional actions to perform when dialog is opened
//           },
//           buttons: dialogButtons,
//         };
   
//         // Show the dialog
//         H5ControlUtil.H5Dialog.CreateDialogElement(
//           dialogContent[0],
//           dialogOptions
//         );
//       } catch (error) {
//         console.error("Error in showPopup method:", error);
//       }
//     };
   
//     H5Dialog.prototype.getGridColumns = function () {
//       var grid = this.controller.GetGrid();
//       var columns = grid.getColumns();
   
//       return columns;
//     };
   
//     H5Dialog.prototype.getGridData = function (columns) {
//       var grid = this.controller.GetGrid();
//       var data = grid.getData();
//       var rows = [];
   
//       if (Array.isArray(data)) {
//         for (var index = 0; index < data.length; index++) {
//           var item = data[index];
//           var row = { id: "C" + (index + 1) };
   
//           for (var j = 0; j < columns.length; j++) {
//             var column = columns[j];
//             var field = column.colId;
//             var field16 = column.field;
   
//             // Assign values based on the column ID
//             switch (field) {
//               case "C1":
//                 row[field] = item.OADIVI;
   
//                 break;
//               case "C2":
//                 row[field] = item.OACUNO;
//                 break;
//               case "C3":
//                 row[field] = item.OAORNO;
//                 break;
//               case "C4":
//                 row[field] = item.OARLDT;
//                 break;
//               case "C5":
//                 row[field] = item.OACUDT;
//                 break;
//               case "C6":
//                 row[field] = item.OAORTP;
//                 break;
//               case "C7":
//                 row[field] = item.OAORSL;
//                 break;
//               case "C8":
//                 row[field] = item.OAORST;
//                 break;
//               case "C9":
//                 row[field] = item.OAOBLC;
//                 break;
//               case "C10":
//                 row[field] = item.OACUOR;
//                 break;
//               case "C11":
//                 row[field] = item.TEXT;
//                 break;
//               case "C12":
//                 row[field] = item.OAOREF || "0";
//                 break;
//               case "C13":
//                 row[field] = item.OANTAM;
//                 break;
//               case "C14":
//                 row[field] = item.OANTLA;
//                 break;
//               case "C15":
//                 row[field] = item.OAORDT;
//                 break;
//               case "C16":
//                 row[field16] = item.Difference;
//                 break;
//               // default:
//               //   row[field] = item[field] || "0";
//             }
//           }
   
//           rows.push(row);
//         }
//       }
   
//       return rows;
//     };
   
//     H5Dialog.prototype.attachEvents = function () {
//       const self = this;
//       const controller = self.controller;
//       const requestObj = controller.GetRequestObject();
//       const requestData = requestObj.requestData;
   
//       if (requestData) {
//         requestData.addRequestCompleted(function () {
//           self.pageCount++; // Increment the page count
//           self.calculateDifferences((self.pageCount - 1) * 1000);
//         });
//       }
//     };
   
//     return H5Dialog;
//   })();
   
   





























// var H5Dialog = /** @class */ (function () {
//     function H5Dialog(scriptArgs) {
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = scriptArgs.args;
//         this.version = ScriptUtil.version;
//     }
//     /**
//      * Script initialization function.
//      */
//     H5Dialog.Init = function (args) {
//         new H5Dialog(args).run();
//     };
//     H5Dialog.prototype.run = function () {
//         //Check panel
//         if (this.controller.GetPanelName() !== "OIS300") {
//             this.log.Error("Script should run in OIS300/F.");
//             return;
//         }

//         this.contentElement = this.controller.GetContentElement();
//         this.addButton();
//     };

//     H5Dialog.prototype.addButton = function () {
//         var _this = this;
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "showDataButton"; // Assign a name for the button
//         buttonElement.Value = "Show Grid Data"; // Button label
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 5;
//         buttonElement.Position.Left = 80;
//         buttonElement.Position.Width = 15;

//         var $button = this.contentElement.AddElement(buttonElement);

//         $button.click({}, function () {
//             _this.showDataDialog();
//         });
//     };

//     H5Dialog.prototype.showDataDialog = function () {
//         var header = this.getHeader();
//         var columns = this.getColumns(header);
//         var data = this.getData(columns);

//         // Prepare table HTML
//         var tableHtml = "<table border='1' style='border-collapse: collapse; width: 100%;'>";
//         tableHtml += "<tr>";
//         columns.forEach(function (column) {
//             tableHtml += "<th>" + column.name + "</th>";
//         });
//         tableHtml += "</tr>";

//         data.forEach(function (item) {
//             tableHtml += "<tr>";
//             columns.forEach(function (column) {
//                 tableHtml += "<td>" + (item[column.field] !== null ? item[column.field] : "") + "</td>";
//             });
//             tableHtml += "</tr>";
//         });

//         tableHtml += "</table>";

//         // Create dialog content
//         var dialogContent = $(tableHtml);

//         var dialogOptions = {
//             title: "Grid Data",
//             dialogType: "General",
//             modal: true,
//             width: 800,
//             minHeight: 480,
//             icon: "info",
//             closeOnEscape: true,
//             buttons: [
//                 {
//                     text: "Close",
//                     width: 80,
//                     click: function () {
//                         $(this).inforDialog("close");
//                     }
//                 }
//             ]
//         };

//         // Show the dialog
//         if (ScriptUtil.version >= 2.0) {
//             H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
//         } else {
//             dialogContent.inforMessageDialog(dialogOptions);
//         }
//     };

//     H5Dialog.prototype.getHeader = function () {
//         var header;
//         if (this.version >= 2.0) {
//             header = ScriptUtil.GetFieldValue('WWSFHL');
//         } else {
//             var wwsfhl = this.controller.GetElement("WWSFHL");
//             header = wwsfhl[0].textContent;
//         }
//         //Split on capital letters
//         return header.split(/(?=[A-Z])/);
//     };

//     H5Dialog.prototype.getColumns = function (headers) {
//         var columns = [];
//         for (var _i = 0, headers_1 = headers; _i < headers_1.length; _i++) {
//             var header = headers_1[_i];
//             var column = {
//                 id: "C" + (columns.length + 1),
//                 name: header,
//                 field: header
//             };
//             columns.push(column);
//         }
//         return columns;
//     };

//     H5Dialog.prototype.getData = function (columns) {
//         var rows = [];
//         var value = ScriptUtil.GetFieldValue("WWSFLL", this.controller);
//         var data = value.split(" ");
//         var row = { id: "R1" };
//         for (var i = 0; i < columns.length; i++) {
//             row[columns[i]["field"]] = data[i];
//         }
//         rows.push(row);
//         return rows;
//     };

//     return H5Dialog;
// }());
// //# sourceMappingURL=H5Dialog.js.map





























// var H5Dialog = /** @class */ (function () {
//     function H5Dialog(scriptArgs) {
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = scriptArgs.args;
//     }

//     H5Dialog.Init = function (args) {
//         new H5Dialog(args).run();
//     };

//     H5Dialog.prototype.run = function () {
//         this.contentElement = this.controller.GetContentElement();

//         this.addButton();
//     };

//     H5Dialog.prototype.addButton = function () {
//         var _this = this;
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "showDataButton"; // Assign a name for the button
//         buttonElement.Value = "Show Grid Data"; // Button label
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 5;
//         buttonElement.Position.Left = 80;
//         buttonElement.Position.Width = 15;

//         var $button = this.contentElement.AddElement(buttonElement);

//         $button.click({}, function () {
//             _this.showDataDialog();
//         });
//     };

//     H5Dialog.prototype.showDataDialog = function () {
//         // Assuming myGrid is an instance of the grid and you can get its data
//         var myGrid = this.controller.GetGrid();
//         var gridData = myGrid.getData();

//         // Prepare table HTML
//         var tableHtml = "<table border='1' style='border-collapse: collapse; width: 100%;'>";
//         tableHtml += "<tr><th>OADIVI</th><th>OACUNO</th><th>OAORNO</th><th>OARLDT</th><th>OACUDT</th>";
//         tableHtml += "<th>OAORTP</th><th>OAORSL</th><th>OAORST</th><th>OAOBLC</th><th>OACUOR</th>";
//         tableHtml += "<th>TEXT</th><th>OAOREF</th><th>OANTAM</th><th>OANTLA</th><th>OAORDT</th></tr>";

//         gridData.forEach(function (item) {
//             tableHtml += "<tr>";
//             tableHtml += "<td>" + (item.OADIVI !== null ? item.OADIVI : "") + "</td>";
//             tableHtml += "<td>" + (item.OACUNO !== null ? item.OACUNO : "") + "</td>";
//             tableHtml += "<td>" + (item.OAORNO !== null ? item.OAORNO : "") + "</td>";
//             tableHtml += "<td>" + (item.OARLDT !== null ? item.OARLDT : "") + "</td>";
//             tableHtml += "<td>" + (item.OACUDT !== null ? item.OACUDT : "") + "</td>";
//             tableHtml += "<td>" + (item.OAORTP !== null ? item.OAORTP : "") + "</td>";
//             tableHtml += "<td>" + (item.OAORSL !== null ? item.OAORSL : "") + "</td>";
//             tableHtml += "<td>" + (item.OAORST !== null ? item.OAORST : "") + "</td>";
//             tableHtml += "<td>" + (item.OAOBLC !== null ? item.OAOBLC : "") + "</td>";
//             tableHtml += "<td>" + (item.OACUOR !== null ? item.OACUOR : "") + "</td>";
//             tableHtml += "<td>" + (item.TEXT !== null ? item.TEXT : "") + "</td>";
//             tableHtml += "<td>" + (item.OAOREF !== null ? item.OAOREF : "") + "</td>";
//             tableHtml += "<td>" + (item.OANTAM !== null ? item.OANTAM : "") + "</td>";
//             tableHtml += "<td>" + (item.OANTLA !== null ? item.OANTLA : "") + "</td>";
//             tableHtml += "<td>" + (item.OAORDT !== null ? item.OAORDT : "") + "</td>";
//             tableHtml += "</tr>";
//         });

//         tableHtml += "</table>";

//         // Create dialog content
//         var dialogContent = $(tableHtml);
        
//         var dialogOptions = {
//             title: "Grid Data",
//             dialogType: "General",
//             modal: true,
//             width: 800,
//             minHeight: 480,
//             icon: "info",
//             closeOnEscape: true,
//             buttons: [
//                 {
//                     text: "Close",
//                     width: 80,
//                     click: function () {
//                         $(this).inforDialog("close");
//                     }
//                 }
//             ]
//         };

//         // Show the dialog
//         if (ScriptUtil.version >= 2.0) {
//             H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
//         } else {
//             dialogContent.inforMessageDialog(dialogOptions);
//         }
//     };

//     return H5Dialog;
// }());







































// var H5Dialog = /** @class */ (function () {
//     function H5Dialog(scriptArgs) {
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = scriptArgs.args;
//     }

//     H5Dialog.Init = function (args) {
//         new H5Dialog(args).run();
//     };

//     H5Dialog.prototype.run = function () {
//         this.contentElement = this.controller.GetContentElement();

//         this.addButton();
//     };

//     H5Dialog.prototype.addButton = function () {
//         var _this = this;
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "showDataButton"; // Assign a name for the button
//         buttonElement.Value = "Show  Data"; // Button label
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 5;
//         buttonElement.Position.Left = 80;
//         buttonElement.Position.Width = 15;

//         var $button = this.contentElement.AddElement(buttonElement);

//         $button.click({}, function () {
//             _this.showDataDialog();
//         });
//     };

//     H5Dialog.prototype.showDataDialog = function () {
//         // Assuming myGrid is an instance of the grid and you can get its data
//         var myGrid = this.controller.GetGrid();
//         var gridData = myGrid.getData();

//         // Filter data related to OADIVI
//         var oadiviData = gridData.filter(function (item) {
//             return item.OADIVI !== "NA"; // Adjust condition based on your filtering criteria
//         });

//         // Prepare table HTML
//         var tableHtml = "<table border='1' style='border-collapse: collapse; width: 100%;'>";
//         tableHtml += "<tr><th>OACUNO</th><th>OAORNO</th><th>OADIVI</th><th>Other Columns...</th></tr>";

//         oadiviData.forEach(function (item) {
//             tableHtml += "<tr>";
//             tableHtml += "<td>" + item.OACUNO + "</td>";
//             tableHtml += "<td>" + item.OAORNO + "</td>";
//             tableHtml += "<td>" + item.OADIVI + "</td>";
//             // Add other columns as needed
//             // tableHtml += "<td>" + item.OtherColumn + "</td>";
//             tableHtml += "</tr>";
//         });

//         tableHtml += "</table>";

//         // Create dialog content
//         var dialogContent = $(tableHtml);
        
//         var dialogOptions = {
//             title: "DATA",
//             dialogType: "General",
//             modal: true,
//             width: 800,
//             minHeight: 480,
//             icon: "info",
//             closeOnEscape: true,
//             buttons: [
//                 {
//                     text: "Close",
//                     width: 80,
//                     click: function () {
//                         $(this).inforDialog("close");
//                     }
//                 }
//             ]
//         };

//         // Show the dialog
//         if (ScriptUtil.version >= 2.0) {
//             H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
//         } else {
//             dialogContent.inforMessageDialog(dialogOptions);
//         }
//     };

//     return H5Dialog;
// }());

















































// var H5Dialog = /** @class */ (function () {
//     function H5Dialog(scriptArgs) {
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = scriptArgs.args;
//     }

//     H5Dialog.Init = function (args) {
//         new H5Dialog(args).run();
//     };

//     H5Dialog.prototype.run = function () {
//         this.contentElement = this.controller.GetContentElement();

//         this.addButton();
//     };

//     H5Dialog.prototype.addButton = function () {
//         var _this = this;
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "showDataButton"; // Assign a name for the button
//         buttonElement.Value = "Show Grid Data"; // Button label
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 5;
//         buttonElement.Position.Left = 80;
//         buttonElement.Position.Width = 15;

//         var $button = this.contentElement.AddElement(buttonElement);

//         $button.click({}, function () {
//             _this.showDataDialog();
//         });
//     };

//     H5Dialog.prototype.showDataDialog = function () {
//         // Assuming myGrid is an instance of the grid and you can get its data
//         var myGrid = this.controller.GetGrid();
//         var gridData = myGrid.getData();

//         // Create dialog content
//         var dialogContent = $("<pre>").text(JSON.stringify(gridData, null, 2));
        
//         var dialogOptions = {
//             title: "Grid Data",
//             dialogType: "General",
//             modal: true,
//             width: 600,
//             minHeight: 480,
//             icon: "info",
//             closeOnEscape: true,
//             buttons: [
//                 {
//                     text: "Close",
//                     width: 80,
//                     click: function () {
//                         $(this).inforDialog("close");
//                     }
//                 }
//             ]
//         };

//         // Show the dialog
//         if (ScriptUtil.version >= 2.0) {
//             H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
//         } else {
//             dialogContent.inforMessageDialog(dialogOptions);
//         }
//     };

//     return H5Dialog;
// }());




































// var H5Dialog = /** @class */ (function () {
//     function H5Dialog(scriptArgs) {
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = scriptArgs.args;
//     }

//     H5Dialog.Init = function (args) {
//         new H5Dialog(args).run();
//     };

//     H5Dialog.prototype.run = function () {
//         this.contentElement = this.controller.GetContentElement();

//         this.addButton();
//     };

//     H5Dialog.prototype.addButton = function () {
//         var _this = this;
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "showDataButton"; // Assign a name for the button
//         buttonElement.Value = "Show JSON Data"; // Button label
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 5;
//         buttonElement.Position.Left = 80;
//         buttonElement.Position.Width = 15;

//         var $button = this.contentElement.AddElement(buttonElement);

//         $button.click({}, function () {
//             _this.showDataDialog();
//         });
//     };

//     H5Dialog.prototype.showDataDialog = function () {
//         var jsonData = {
//             "isRowCachedUpdated": false,
//             "name": "R33",
//             "agg": 0,
//             "columnCount": 15,
//             "OADIVI": "NA",
//             "OACUNO": "94003",
//             "OAORNO": "0080000033",
//             "OARLDT": "220920",
//             "OACUDT": "220919",
//             "OAORTP": "C31",
//             "OAORSL": "77",
//             "OAORST": "77",
//             "OAOBLC": null,
//             "OACUOR": "PRM001846",
//             "TEXT": null,
//             "OAOREF": null,
//             "OANTAM": null,
//             "OANTLA": "41255.16-",
//             "OAORDT": "220919",
//             "index": 32
//         };

//         // Create dialog content
//         var dialogContent = $("<pre>").text(JSON.stringify(jsonData, null, 2));
        
//         var dialogOptions = {
//             title: "JSON Data",
//             dialogType: "General",
//             modal: true,
//             width: 600,
//             minHeight: 480,
//             icon: "info",
//             closeOnEscape: true,
//             buttons: [
//                 {
//                     text: "Close",
//                     width: 80,
//                     click: function () {
//                         $(this).inforDialog("close");
//                     }
//                 }
//             ]
//         };

//         // Show the dialog
//         if (ScriptUtil.version >= 2.0) {
//             H5ControlUtil.H5Dialog.CreateDialogElement(dialogContent[0], dialogOptions);
//         } else {
//             dialogContent.inforMessageDialog(dialogOptions);
//         }
//     };

//     return H5Dialog;
// }());






















// var H5Dialog = /** @class */ (function () {
//     function H5Dialog(scriptArgs) {
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = scriptArgs.args;
//     }
//     H5Dialog.Init = function (args) {
//         new H5Dialog(args).run();
//     };
//     H5Dialog.prototype.run = function () {
//         debugger;
//         let myGrid = this.controller.GetGrid();
//         this.data = myGrid.getData();
//         console.log(JSON.stringify(this.data, null, 2));
//         this.contentElement = this.controller.GetContentElement();

//         this.addButton();

//     };

//     H5Dialog.prototype.addButton = function () {
//         var _this = this;
//         var buttonElement = new ButtonElement();
//         buttonElement.Name = "testButton";
//         buttonElement.Value = "SHOW";
//         buttonElement.Position = new PositionElement();
//         buttonElement.Position.Top = 5;
//         buttonElement.Position.Left = 80;
//         buttonElement.Position.Width = 15;
//         var $button = this.contentElement.AddElement(buttonElement);
       
//     };


//     return H5Dialog;
// }());

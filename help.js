var OIS100MI = /** @class */ (function () {
    function OIS100MI(args) {
      debugger;
        this.controller = args.controller;
        this.log = args.log;
        this.args = args.args;
        this.pageCount = 1; // Track the number of pages loaded
        this.z = 1; // Initialize z for debugging
   
        // Bind event handler functions to ensure 'this' refers to the instance of OIS100MI
        this.attachEvents = this.attachEvents.bind(this);
    }
   
    // Script initialization function
    OIS100MI.Init = function (args) {
        new OIS100MI(args).run(args);
    };
   
    OIS100MI.prototype.run = function (args) {
        if (this.controller.GetPanelName() !== "OIA100A0") {
            this.log.Error("Script should run in OIA101BC.");
            return;
        }
   
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
   
            // Add styling to the button
            buttonElement.Style = {
                backgroundColor: "lightblue",
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "5px",
                cursor: "pointer",
                color: "black",
                fontSize: "16px",
                fontWeight: "bold",
            };
   
            var contentElement = this.controller.GetContentElement();
            var $button = contentElement.AddElement(buttonElement);
            $button.click({}, function () {
                try {
                    _this.executeByRequest(); // Invoke executeByRequest directly to fetch data and show the popup
                } catch (error) {
                    console.error("Error handling button click:", error);
                }
            });
        } catch (error) {
            console.error("Error in createButton method:", error);
        }
    };
   
    OIS100MI.prototype.executeByRequest = function () {
        var self = this;
        const myRequest = new MIRequest();
        myRequest.program = "OIS100MI";
        myRequest.transaction = "LstLine"; // Update the transaction as needed
        // Fields that should be returned by the transaction
        myRequest.outputFields = ["ITNO", "ITDS", "ORQT", "WHLO", "CUPO", "DWDT", "JDCD", "SAPR", "DIA1", "DIA2", "DIA3", "DIA4", "DIA5", "DIA6", "DLSP", "DLSX", "PONR", "POSX", "ORST", "CFXX", "ECVS", "NLAM", "ALUN", "SPUN", "SAP2", "POPN", "ALWT", "ALWQ", "ORQA", "CODT", "SACD", "CUCD", "NEPR", "AGNO", "CUOR", "PRRF", "EDFP", "DIP1", "DIP2", "DIP3", "DIP4", "DIP5", "DIP6", "DWHM", "COHM", "ATNR", "ALQT", "DLQT", "IVQT", "NTCD", "PRMO", "PROJ", "ELNO", "SUNO", "DIC1", "DIC2", "DIC3", "DIC4", "DIC5", "DIC6", "UCOS", "COCD", "CMNO", "RSCD", "BANO", "TEDS", "CFIN", "WHSL", "CAMU", "APBA", "PRHL", "SERN", "CTNO", "CFGL", "WATP", "GWTP", "PRHW", "SERW", "PWNR", "PWSX", "EWST", "AGNB", "CTNS", "TECN", "INAP", "REPI", "RIDN", "RIDL", "RIDX", "DRDN", "DRDL", "DRDX", "LNCL", "PRIO", "UCA1", "UCA2", "UCA3", "UCA4", "UCA5", "UCA6", "UCA7", "UCA8", "UCA9", "UCA0", "UDN1", "UDN2", "UDN3", "UDN4", "UDN5", "UDN6", "UID1", "UID2", "UID3", "UCT1", "CAWE", "DIA7", "DIA8", "DIP7", "DIP8", "DIC7", "DIC8", "ADID", "STCD", "CINA", "ABNO", "DEFC", "PRCH", "OTDI", "VTCD", "TINC", "TEPY", "PMOR", "MPRD", "BNCD", "PRAC", "PIDE", "CLAT", "RAGN", "DWDZ", "DWHZ", "CODZ", "COHZ", "DSDT", "DSHM", "PLDT", "PLHM", "TEDL", "TEL1", "TEL2", "MODL", "ROUT", "RODN", "BOP1", "PIKD", "RSC5", "RSC6", "RSC7", "PRHC", "RSC8"];
   
        // Input to the transaction
        myRequest.record = {
            CONO: "100",
            ORNO: "0080000032"
        }; // Set appropriate input values
   
        MIService.Current.executeRequest(myRequest)
            .then((response) => {
                // Read results here
                self.showPopup(response.items); // Call showPopup with items from the response
                self.z++;
                console.log("Incremented z after executeByRequest:", self.z);
            })
            .catch((error) => {
                // Handle errors here
                self.log.Error(error.errorMessage);
            });
    };
   
    OIS100MI.prototype.showPopup = function (items) {
        try {
            var self = this;
   
            // Create the dialog content
            var dialogContent = $(
                "<div><label class='inforLabel noColon'>OIS100MI Customer Order</label></div>"
            );
   
            // Create the table with data from the response items
            var table = $("<table style='width:100%; border-collapse:collapse;'>");
            var headerRow = $("<tr>");
   
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
   
            // Add table to dialog content
            dialogContent.append(table);
   
            var dialogButtons = [
                {
                    text: "Refresh",
                    isDefault: true,
                    width: 80,
                    click: function () {
                        // Remove existing table and reload data
                        table.remove();
                        self.showPopup(items);
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
                title: "OIS100MI Customer Order",
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
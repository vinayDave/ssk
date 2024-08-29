var H5DocumentCount = /** @class */ (function () {

    function H5DocumentCount(scriptArgs) {
        debugger;
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = scriptArgs.args;
        this.data = null; // Initialize data
        this.currentIndex = 0; // Initialize index for iterating through data
        this.isTotalCalculated = false; // Flag to track if total has been calculated
        this.ionApiService = IonApiService.Current; // Initialize ION API service
        this.lastIndex=-1;
    }

    H5DocumentCount.Init = function (args) {
        new H5DocumentCount(args).run();
    };

    H5DocumentCount.prototype.run = async function () {
        if (this.controller.GetView() !== "PANEL6") {
            this.log.Error("Script should run in PANEL6.");
            return;
        }

        let myGrid = this.controller.GetGrid();
        this.data = myGrid.getData();
        console.log('Initial Data:', JSON.stringify(this.data, null, 2));

        var list = this.controller.GetGrid();
        var customColumnNum = list.getColumns().length + 1;
        this.appendColumn(list, customColumnNum); // Append the custom column

        if (!this.isTotalCalculated) { // Check if data is already populated
            await this.populateData(list, customColumnNum); // Populate the custom column with data
            this.isTotalCalculated = true; // Set flag to indicate data is populated
        }

        this.attachEvents(this.controller, list, customColumnNum); // Attach events for dynamic data population
    };

    H5DocumentCount.prototype.appendColumn = function (list, columnNum) {
        var columnId = "DocumentCount" + columnNum;
        var columns = list.getColumns();
        var newColumn = {
            id: columnId,
            field: columnId,
            name: "Document Count",
            width: 150,
            formatter: this.customColumnFormatter.bind(this) // Bind the context of the formatter
        };
        columns.push(newColumn);
        list.setColumns(columns);
    };

    H5DocumentCount.prototype.populateData = async function (list, columnNum) {
        var columnId = "DocumentCount" + columnNum;
        var dataset = list.getData();

        // Collect all promises
        var promises = dataset.map(async function (data,index) {
        if(index>this.lastIndex){
            this.lastIndex=index;
            var oaornoValue = data.OAORNO || ""; // Retrieve the OAORNO value from the grid data
            if (oaornoValue) {
                try {
                    var count = await this.fetchInvoiceCount(oaornoValue); // Fetch the invoice count
                    data[columnId] = count; // Store the fetched invoice count in the custom column
                } catch (error) {
                    console.error("Error fetching invoice count for", oaornoValue, ":", error);
                    data[columnId] = "Error"; // Set the column value to "Error" in case of failure
                }
            } else {
                data[columnId] = "N/A"; // If OAORNO is not available, set the column value to N/A
            }
        }
        }.bind(this));

        // Wait for all promises to complete
        await Promise.all(promises);
        list.setData(dataset); // Update the grid data after all counts are fetched
    };

    H5DocumentCount.prototype.fetchInvoiceCount = async function (invoiceNumber) {
        var request = {
            //TODO: /IDM/api/items/count?$query=/CustomersOrderNumber[@ORNO="' + orderNumber + '"]
            url: '/IDM/api/items/count?$query=/M3_CustomerInvoice[@M3_InvoiceNumber="' + encodeURIComponent(invoiceNumber) + '"]',
            method: "GET"
        };
        try {
            var response = await this.ionApiService.execute(request);
            console.log('API Response:', response.data); // Debug API response
            var count = response.data.count || "0"; // Extract the count from the API response
            return count; // Return the count value
        } catch (error) {
            console.error("Error fetching invoice count:", error);
            throw error; // Rethrow the error to be handled in populateData
        }
    };

    H5DocumentCount.prototype.attachEvents = function (controller, list, customColumnNum) {
        var _this = this;
        this.unsubscribeReqCompleted = controller.RequestCompleted.On(function (e) {
            // Populate additional data on scroll
            if (e.commandType === "PAGE" && e.commandValue === "DOWN") {
                _this.populateData(list, customColumnNum);
            } else {
                _this.detachEvents();
            }
        });
    };

    H5DocumentCount.prototype.detachEvents = function () {
        this.unsubscribeReqCompleted.unsubscribe();
    };
    H5DocumentCount.prototype.customColumnFormatter = function (row, cell, value, columnDef, dataContext) {
        // Custom formatter logic if needed
        return value; // Default: Return the value as-is
    };

    return H5DocumentCount;
}());

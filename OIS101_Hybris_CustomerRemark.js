/**
 * M3IMPRO - 262 & M3LIVE - 2055
 */

// Change log for modification -
//  ChangeID    Date            Changed by          Description
//  UP01        14/08/2024      Onkar Kulkarni      Added validation to text field
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * Adds label, textbox, combobox, checkbox, button, date picker, and radio group
 * On button click, toggles the checkbox and prints the textbox and combobox values on the console
 */
var OIS101_Hybris_CustomerRemark = /** @class */ (function () {
    function OIS101_Hybris_CustomerRemark(args) {
        this.scriptName = "OIS101_Hybris_CustomerRemark";
        this.MECProcess = false;
        this.processingRowNumbr = 0;
        this.isExists = true;
        this.controller = args.controller;
        this.log = args.log;
        this.Company = ScriptUtil.GetUserContext("CurrentCompany");
        this.Division = ScriptUtil.GetUserContext("CurrentDivision");
        console.log("CONO: " + this.Company);
        console.log("DIVI: " + this.Division);
        if (ScriptUtil.version >= 2.0) {
            this.miService = MIService;
        }
        else {
            this.miService = MIService.Current;
        }
    }
    OIS101_Hybris_CustomerRemark.Init = function (args) {
        new OIS101_Hybris_CustomerRemark(args).run();
    };
    OIS101_Hybris_CustomerRemark.prototype.run = function () {
        debugger;
        var _this = this;
        this.contentElement = this.controller.GetContentElement();
        this.addHybrisElements();
        var controller = this.controller;
        this.ZZORNO = this.controller.GetValue("OAORNO");
        this.ZZPONR = this.controller.GetValue("OBPONR");
        this.ZZPOSX = this.controller.GetValue("OBPOSX");
        if (this.ZZPONR.length == '') {
            this.ZZPONR = "0" + "0" + "0" + "0" + "0";
        }
        if (this.ZZPONR.length == 1) {
            this.ZZPONR = "0" + "0" + "0" + "0" + this.ZZPONR;
        }
        if (this.ZZPONR.length == 2) {
            this.ZZPONR = "0" + "0" + "0" + this.ZZPONR;
        }
        if (this.ZZPONR.length == 3) {
            this.ZZPONR = "0" + "0" + this.ZZPONR;
        }
        if (this.ZZPONR.length == 4) {
            this.ZZPONR = "0" + this.ZZPONR;
        }
        if (this.ZZPONR.length == 5) {
            this.ZZPONR = this.ZZPONR;
        }
        if (this.ZZPOSX.length == '') {
            this.ZZPOSX = "0" + "0" + "0";
        }
        if (this.ZZPOSX.length == 1) {
            this.ZZPOSX = "0" + "0" + this.ZZPOSX;
        }
        if (this.ZZPOSX.length == 2) {
            this.ZZPOSX = "0" + this.ZZPOSX;
        }
        if (this.ZZPOSX.length == 3) {
            this.ZZPOSX = this.ZZPOSX;
        }
        this.log.Info("LOG LINE: " + this.ZZPONR + ":" + this.ZZPOSX);
        //const grid = controller.GetGrid();
        if (this.controller.GetMode() == "1") {
            this.log.Info("this.controller.GetMode is 1or2: " + this.controller.GetMode());
            this.GetLineDetails();
            var Box = this.controller.GetContentElement();
            Box.GetElement("Hybris_Customer_Remark").enable();
            // this.log.Info(" IsEnabled: " + JSON.stringify(Box.GetElement("Hybris_Customer_Remark").enable()));
        }
        if (this.controller.GetMode() == "2") {
            this.log.Info("this.controller.GetMode is 2: " + this.controller.GetMode());
            this.getHybrisValue();
            // this.GetLineDetails();
            var Box = this.controller.GetContentElement();
            Box.GetElement("Hybris_Customer_Remark").enable();
            // this.log.Info(" IsEnabled: " + JSON.stringify(Box.GetElement("Hybris_Customer_Remark").enable()));
        }
        if (this.controller.GetMode() == "5") {
            this.log.Info("this.controller.GetMode is 5: " + this.controller.GetMode());
            var Box = this.controller.GetContentElement();
            Box.GetElement("Hybris_Customer_Remark").disable();
            this.getHybrisValue();
            //this.log.Info(" IsDisabled: " + JSON.stringify(Box.GetElement("Hybris_Customer_Remark").disable()));
        }
        this.key = this.scriptName;
        console.log("Script is Running. . . ");
        this.unsubscribeRequesting = this.controller.Requesting.On(function (e) {
            _this.onRequesting(e);
        });
        this.unsubscribeRequested = controller.Requested.On(function (e) {
            _this.onRequested(e);
        });
        this.controller.RequestCompleted.On(function (e) {
            _this.onRequestCompleted(e);
        });
    };
    OIS101_Hybris_CustomerRemark.prototype.addHybrisElements = function () {
        var labelElement = new LabelElement();
        labelElement.Name = "Hybris Customer Remark";
        labelElement.Value = "Hybris Customer Remark";
        labelElement.Position = new PositionElement();
        labelElement.Position.Top = 20;
        labelElement.Position.Left = 48.5;
        labelElement.Position.Width = 25;
        this.contentElement.AddElement(labelElement);
        var textElement = new TextBoxElement();
        textElement.Name = "Hybris_Customer_Remark";
        textElement.Position = new PositionElement();
        textElement.Position.Top = 5;
        textElement.Position.Left = 80;
        textElement.Position.Width = 15;
        textElement.Value = "Temporary Default Value"; // Set default value
        textElement.IsEnabled = false;

        this.contentElement.AddElement(textElement);
    };
    OIS101_Hybris_CustomerRemark.prototype.executeOOLINE = function () {
        var _this = this;
        var myRequest = new MIRequest();
        myRequest.program = "OIS100MI";
        myRequest.transaction = "LstCOLineInfo";
        //Fields that should be returned by the transaction
        myRequest.outputFields = ["PONR"];
        myRequest.maxReturnedRecords = 0;
        //Input to the transaction
        myRequest.record = { ORNO: this.ZZORNO };
        return MIService.Current.executeRequest(myRequest).then(function (response) {
            //Read results here
            // for (let item of response.items) {
            debugger;
            _this.log.Info("1: PONR: " + JSON.stringify(response.items));
            var len1 = JSON.stringify(response.items.length);
            _this.LineNumber_Temp = Number(len1) + 1;
            _this.SubLineNumber_Temp = "";
            //return response.item.PONR;
            if (_this.LineNumber_Temp.toString().length == 1) {
                _this.LineNumber_Temp = "0" + "0" + "0" + "0" + _this.LineNumber_Temp;
            }
            if (_this.LineNumber_Temp.toString().length == 2) {
                _this.LineNumber_Temp = "0" + "0" + "0" + _this.LineNumber_Temp;
            }
            if (_this.LineNumber_Temp.toString().length == 3) {
                _this.LineNumber_Temp = "0" + "0" + _this.LineNumber_Temp;
            }
            if (_this.LineNumber_Temp.toString().length == 4) {
                _this.LineNumber_Temp = "0" + _this.LineNumber_Temp;
            }
            if (_this.LineNumber_Temp.toString().toString().length == 5) {
                _this.LineNumber_Temp = _this.LineNumber_Temp;
            }
            if (_this.SubLineNumber_Temp.toString().length == '') {
                _this.SubLineNumber_Temp = "0" + "0" + "0";
            }
            if (_this.SubLineNumber_Temp.toString().length == 1) {
                _this.SubLineNumber_Temp = "0" + "0" + _this.SubLineNumber_Temp;
            }
            if (_this.SubLineNumber_Temp.toString().length == 2) {
                _this.SubLineNumber_Temp = "0" + _this.SubLineNumber_Temp;
            }
            if (_this.SubLineNumber_Temp.toString().length == 3) {
                _this.SubLineNumber_Temp = _this.SubLineNumber_Temp;
            }
            _this.log.Info("LOG 1: " + _this.LineNumber_Temp + ":" + _this.SubLineNumber_Temp);
            return _this.LineNumber_Temp;
            // }
        }).catch(function (response) {
            //Handle errors here
            _this.log.Error(response.errorMessage);
        });
    };
    OIS101_Hybris_CustomerRemark.prototype.getHybrisValue = function () {
        //chk whether Refresh is pressed. if so chk whether user has pressed the button and a row is 'in progress'
        var _this = this;
        var program1 = "CUSEXTMI";
        var transaction1 = "GetFieldValue";
        var record1 = { FILE: "OOLINE", PK01: this.ZZORNO, PK02: this.ZZPONR, PK03: this.ZZPOSX };
        var outputFields1 = ["A121"];
        MIService.Current.execute(program1, transaction1, record1, outputFields1).then(function (response) {
            if (response.items.length > 0) {
                _this.isExists = true;
                var A121 = response.items[0].A121;
                console.log(" A121 from GetAlphaKPI " + A121 + ":" + JSON.stringify(response.items) + ":" + JSON.stringify(record1));
                _this.controller.SetValue("Hybris_Customer_Remark", A121);
                //this.populateData(AL39);
            }
        }).catch(function (response) {
            //Handle errors here
            _this.log.Error(response.errorMessage);
            _this.isExists = false;
            console.log(" error is " + response.errorMessage);
        });
    };
    OIS101_Hybris_CustomerRemark.prototype.updateHybrisValue = function () {
        //chk whether Refresh is pressed. if so chk whether user has pressed the button and a row is 'in progress'
        var _this = this;
        var program1 = "CUSEXTMI";
        var transaction1 = "ChgFieldValue";
        var record1 = { FILE: "OOLINE", PK01: this.ZZORNO, PK02: this.ZZPONR, PK03: this.ZZPOSX, VEXI: 1, A121: this.ZZA121 };
        MIService.Current.execute(program1, transaction1, record1).then(function (response) {
            console.log(" updateHybrisValue " + _this.ZZA121 + ":" + JSON.stringify(response.items) + ":" + JSON.stringify(record1));
            //if (response.items.length > 0) {
            //    var A121 = response.items[0].A121;
            //    console.log(" A121 from GetAlphaKPI " + A121)
            //    this.controller.SetValue("Hybris_Customer_Remark", A121);
            //    //this.populateData(AL39);
            //}
        }).catch(function (response) {
            //Handle errors here
            _this.log.Error(response.errorMessage);
            console.log(" error is " + response.errorMessage);
        });
    };
    OIS101_Hybris_CustomerRemark.prototype.addHybrisValue = function () {
        var _this = this;
        debugger;
        //chk whether Refresh is pressed. if so chk whether user has pressed the button and a row is 'in progress'
        var program1 = "CUSEXTMI";
        var transaction1 = "AddFieldValue";
        var record1 = { FILE: "OOLINE", PK01: this.ZZORNO, PK02: this.ZZPONR, PK03: this.ZZPOSX, VEXI: 1, A121: this.ZZA121 };
        console.log(" VALUES FOR  AddHybrisValue " + this.ZZA121 + ":" + ":" + JSON.stringify(record1));
        MIService.Current.execute(program1, transaction1, record1).then(function (response) {
            _this.isExists = true;
            debugger;
            console.log(" SUCCESSFUL AddHybrisValue " + _this.ZZA121 + ":" + JSON.stringify(response.items) + ":" + JSON.stringify(record1));
            //if (response.items.length > 0) {
            //    var A121 = response.items[0].A121;
            //    console.log(" A121 from GetAlphaKPI " + A121)
            //    this.controller.SetValue("Hybris_Customer_Remark", A121);
            //    //this.populateData(AL39);
            //}
        }).catch(function (response) {
            //Handle errors here
            _this.log.Error(response.errorMessage);
            console.log(" error is " + response.errorMessage);
        });
    };
    OIS101_Hybris_CustomerRemark.prototype.onRequested = function (args) {
        // Unregister all events
        this.log.Info("onRequested");
        this.unsubscribeRequested();
        this.unsubscribeRequesting();
    };
    OIS101_Hybris_CustomerRemark.prototype.GetLineDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var PONR;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.executeOOLINE()];
                    case 1:
                        PONR = _a.sent();
                        this.log.Info("LOG 2: " + PONR);
                        this.ZZPONR = PONR;
                        this.ZZPOSX = this.SubLineNumber_Temp;
                        this.log.Info("LOG 3: " + this.ZZPONR + ":" + this.ZZPOSX);
                        return [2 /*return*/];
                }
            });
        });
    };
    OIS101_Hybris_CustomerRemark.prototype.onRequesting = function (args) {
        this.log.Info("onRequesting");
    
        // Check if the command is either 'ENTER' or 'F5'
        if (args.commandType == "KEY" && (args.commandValue == "F5" || args.commandValue == 'ENTER')) {
            
            // Get the value of the text field
            var $textBox = $("#Hybris_Customer_Remark"); // Name of the element
            var value = $textBox.val();
            
            // Log the value for debugging
            this.log.Info("Hybris_Customer_Remark value: " + JSON.stringify(value));
            
            // If the text field is empty, display an error message and prevent navigation   //  UP01
            if (value.trim() === "") {     //  UP01
                alert("Hybris Customer Remark field cannot be empty. Please enter a value.");    //  UP01
                args.preventDefault(); // Prevent the navigation    //  UP01
                return; // Exit the function   //  UP01
            }    //  UP01
            
            // If the text field has a value, continue with the existing logic
            this.controller.SetValue("Hybris_Customer_Remark", value);
            this.ZZA121 = value;
    
            // Update or add the value based on the controller mode
            if (this.controller.GetMode() == "2" && this.isExists === true) {
                this.updateHybrisValue();
            }
            if (this.controller.GetMode() == "2" && this.isExists === false) {
                this.addHybrisValue();
            }
            if (this.controller.GetMode() == "1") {
                this.addHybrisValue();
            }
        }
    };
    OIS101_Hybris_CustomerRemark.prototype.onRequestCompleted = function (args) {
        console.log("onRequestCompleted - Request completed on server", args);
    };
    return OIS101_Hybris_CustomerRemark;
}());
//# sourceMappingURL=OIS101_Hybris_CustomerRemark.js.map
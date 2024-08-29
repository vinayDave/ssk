// /**
//  * H5 Script SDK sample.
//  */
// /**
//  * Adds a textbox and validates its content to check if it contains only numbers.
//  * Shows a validation message if the content contains non-numeric characters or if the text box is empty.
//  */
// var H5Validator = /** @class */ (function () {
//     function H5Validator(scriptArgs) {
//         debugger;
//         this.scriptName = "H5Validator";
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = JSON.stringify([
//             {
//                 "names": ["testTextBox"],
//                 "regex": "^[0-9]*$",
//                 "message": "Please enter only numbers."
//             }
//         ]); // Configuration for numeric validation
//         this.validationMessageElement = null; // Reference to the validation message element
//     }
//     H5Validator.Init = function (args) {
//         new H5Validator(args).run();
//     };
//     H5Validator.prototype.run = function () {
//         this.contentElement = this.controller.GetContentElement();
//         this.addTextBox(); // Add the textbox
//         if (!this.parseArgs(this.args)) {
//             return;
//         }
//         this.log.Info("Running...");
//         // Attach events.
//         this.attachEvents(this.controller);
//     };
//     H5Validator.prototype.parseArgs = function (args) {
//         try {
//             var json = JSON.parse(args);
//             var validations = json.length > 0 ? json : [json];
//             for (var _i = 0, validations_1 = validations; _i < validations_1.length; _i++) {
//                 var validation = validations_1[_i];
//                 if (!validation.regex || !validation.message || !validation.names) {
//                     this.log.Error("Invalid argument string " + args);
//                     return false;
//                 }
//             }
//             this.validations = validations;
//         } catch (ex) {
//             this.log.Error("Failed to parse argument string " + args, ex);
//             return false;
//         }
//         return true;
//     };
//     H5Validator.prototype.validateFields = function () {
//         try {
//             this.removeValidationMessage(); // Remove existing validation message if any
//             for (var _i = 0, _a = this.validations; _i < _a.length; _i++) {
//                 var validation = _a[_i];
//                 var regExp = new RegExp(validation.regex);
//                 for (var _b = 0, _c = validation.names; _b < _c.length; _b++) {
//                     var name = _c[_b];
//                     var value = this.controller.GetValue(name);
//                     if (value === null || value === undefined) {
//                         this.log.Debug("The field " + name + " does not exist on the panel.");
//                         continue;
//                     }
//                     if (value === "") {
//                         this.showValidationMessage("The field cannot be empty.");
//                         return false;
//                     }
//                     if (!regExp.test(value)) {
//                         this.showValidationMessage(validation.message);
//                         return false;
//                     }
//                 }
//             }
//             return true;
//         } catch (ex) {
//             this.log.Error("Failed to validate fields", ex);
//             return true;
//         }
//     };
//     H5Validator.prototype.addTextBox = function () {
//         var textElement = new TextBoxElement();
//         textElement.Name = "testTextBox";
//         textElement.Value = "";
//         textElement.Position = new PositionElement();
//         textElement.Position.Top = 2;
//         textElement.Position.Left = 14;
//         textElement.Position.Width = 15;
//         this.contentElement.AddElement(textElement);
//     };
//     H5Validator.prototype.showValidationMessage = function (message) {
//         var messageElement = new LabelElement();
//         messageElement.Value = message;
//         messageElement.Style = "color: red;"; // Display message in red color
//         messageElement.Position = new PositionElement();
//         messageElement.Position.Top = 2; // Positioning the message below the text box
//         messageElement.Position.Left = 29;
//         this.contentElement.AddElement(messageElement);
//         this.validationMessageElement = messageElement; // Store reference to the message element
//         this.controller.ShowMessage(message);
//         this.controller.ShowMessageInStatusBar(message);
//     };
//     H5Validator.prototype.removeValidationMessage = function () {
//         if (this.validationMessageElement) {
//             this.contentElement.RemoveElement(this.validationMessageElement);
//             this.validationMessageElement = null;
//         }
//     };
//     H5Validator.prototype.logEvent = function (eventName, args) {
//         this.log.Info("Event: " + eventName + " Command type: " + args.commandType + " Command value: " + args.commandValue);
//     };
//     H5Validator.prototype.detachEvents = function () {
//         this.detachRequesting();
//         this.detachRequested();
//     };
//     H5Validator.prototype.attachEvents = function (controller) {
//         var _this = this;
//         this.detachRequesting = controller.Requesting.On(function (e) {
//             _this.onRequesting(e);
//         });
//         this.detachRequested = controller.Requested.On(function (e) {
//             _this.onRequested(e);
//         });
//     };
//     H5Validator.prototype.onRequesting = function (args) {
//         if (args.commandType === "KEY" && args.commandValue === "ENTER") {
//             if (!this.validateFields()) {
//                 args.cancel = true;
//             }
//         }
//     };
//     H5Validator.prototype.onRequested = function (args) {
//         this.detachEvents();
//     };
//     return H5Validator;
// }());


































/**
 * H5 Script SDK sample.
 */
/**
 * Adds a textbox and validates its content to check if it contains only numbers.
 * Shows a validation message if the content contains non-numeric characters or if the text box is empty.
 */
var H5Validator = /** @class */ (function () {
    function H5Validator(scriptArgs) {
        debugger;
        this.scriptName = "H5Validator";
        this.controller = scriptArgs.controller;
        this.log = scriptArgs.log;
        this.args = JSON.stringify([
            {
                "names": ["testTextBox"],
                "regex": "^[0-9]*$",
                "message": "Please enter only numbers."
            }
        ]); // Configuration for numeric validation
    }
    H5Validator.Init = function (args) {
        new H5Validator(args).run();
    };
    H5Validator.prototype.run = function () {
        this.contentElement = this.controller.GetContentElement();
        this.addTextBox(); // Add the textbox
        if (!this.parseArgs(this.args)) {
            return;
        }
        this.log.Info("Running...");
        // Attach events.
        this.attachEvents(this.controller);
    };
    H5Validator.prototype.parseArgs = function (args) {
        try {
            var json = JSON.parse(args);
            var validations = json.length > 0 ? json : [json];
            for (var _i = 0, validations_1 = validations; _i < validations_1.length; _i++) {
                var validation = validations_1[_i];
                if (!validation.regex || !validation.message || !validation.names) {
                    this.log.Error("Invalid argument string " + args);
                    return false;
                }
            }
            this.validations = validations;
        } catch (ex) {
            this.log.Error("Failed to parse argument string " + args, ex);
            return false;
        }
        return true;
    };
    H5Validator.prototype.validateFields = function () {
        try {
            for (var _i = 0, _a = this.validations; _i < _a.length; _i++) {
                var validation = _a[_i];
                var regExp = new RegExp(validation.regex);
                for (var _b = 0, _c = validation.names; _b < _c.length; _b++) {
                    var name = _c[_b];
                    var value = this.controller.GetValue(name);
                    if (value === null || value === undefined) {
                        this.log.Debug("The field " + name + " does not exist on the panel.");
                        continue;
                    }
                    if (value === "") {
                        this.showValidationMessage("The field cannot be empty.");
                        return false;
                    }
                    if (!regExp.test(value)) {
                        this.showValidationMessage(validation.message);
                        return false;
                    }
                }
            }
            return true;
        } catch (ex) {
            this.log.Error("Failed to validate fields", ex);
            return true;
        }
    };
    H5Validator.prototype.addTextBox = function () {
        var textElement = new TextBoxElement();
        textElement.Name = "testTextBox";
        textElement.Value = "";
        textElement.Position = new PositionElement();
        textElement.Position.Top = 2;
        textElement.Position.Left = 14;
        textElement.Position.Width = 15;
        this.contentElement.AddElement(textElement);
    };
    H5Validator.prototype.showValidationMessage = function (message) {
        var messageElement = new LabelElement();
        messageElement.Value = message;
        messageElement.Style = "color: red;"; // Display message in red color
        messageElement.Position = new PositionElement();
        messageElement.Position.Top = 2; // Positioning the message below the text box
        messageElement.Position.Left = 29;
        this.contentElement.AddElement(messageElement);
        this.controller.ShowMessage(message);
        this.controller.ShowMessageInStatusBar(message);
    };
    H5Validator.prototype.logEvent = function (eventName, args) {
        this.log.Info("Event: " + eventName + " Command type: " + args.commandType + " Command value: " + args.commandValue);
    };
    H5Validator.prototype.detachEvents = function () {
        this.detachRequesting();
        this.detachRequested();
    };
    H5Validator.prototype.attachEvents = function (controller) {
        var _this = this;
        this.detachRequesting = controller.Requesting.On(function (e) {
            _this.onRequesting(e);
        });
        this.detachRequested = controller.Requested.On(function (e) {
            _this.onRequested(e);
        });
    };
    H5Validator.prototype.onRequesting = function (args) {
        if (args.commandType === "KEY" && args.commandValue === "ENTER") {
            if (!this.validateFields()) {
                args.cancel = true;
            }
        }
    };
    H5Validator.prototype.onRequested = function (args) {
        this.detachEvents();
    };
    return H5Validator;
}());





































// /**
//  * H5 Script SDK sample.
//  */
// /**
//  * Adds a textbox and validates its content to check if it contains only numbers.
//  * Shows a validation message if the content contains non-numeric characters.
//  */
// var H5Validator = /** @class */ (function () {
//     function H5Validator(scriptArgs) {
//         debugger;
//         this.scriptName = "H5Validator";
//         this.controller = scriptArgs.controller;
//         this.log = scriptArgs.log;
//         this.args = JSON.stringify([
//             {
//                 "names": ["testTextBox"],
//                 "regex": "^[0-9]*$",
//                 "message": "Please enter only numbers."
//             }
//         ]); // Configuration for numeric validation
//     }
//     H5Validator.Init = function (args) {
//         new H5Validator(args).run();
//     };
//     H5Validator.prototype.run = function () {
//         this.contentElement = this.controller.GetContentElement();
//         this.addTextBox(); // Add the textbox
//         if (!this.parseArgs(this.args)) {
//             return;
//         }
//         this.log.Info("Running...");
//         // Attach events.
//         this.attachEvents(this.controller);
//     };
//     H5Validator.prototype.parseArgs = function (args) {
//         try {
//             var json = JSON.parse(args);
//             var validations = json.length > 0 ? json : [json];
//             for (var _i = 0, validations_1 = validations; _i < validations_1.length; _i++) {
//                 var validation = validations_1[_i];
//                 if (!validation.regex || !validation.message || !validation.names) {
//                     this.log.Error("Invalid argument string " + args);
//                     return false;
//                 }
//             }
//             this.validations = validations;
//         } catch (ex) {
//             this.log.Error("Failed to parse argument string " + args, ex);
//             return false;
//         }
//         return true;
//     };
//     H5Validator.prototype.validateFields = function () {
//         try {
//             for (var _i = 0, _a = this.validations; _i < _a.length; _i++) {
//                 var validation = _a[_i];
//                 var regExp = new RegExp(validation.regex);
//                 for (var _b = 0, _c = validation.names; _b < _c.length; _b++) {
//                     var name = _c[_b];
//                     var value = this.controller.GetValue(name);
//                     if (value === null || value === undefined) {
//                         this.log.Debug("The field " + name + " does not exist on the panel.");
//                         continue;
//                     }
//                     if (!regExp.test(value)) {
//                         this.controller.ShowMessage(validation.message);
//                         this.controller.ShowMessageInStatusBar(validation.message);
                        

//                         return false;
//                     }
//                 }
//             }
//             return true;
//         } catch (ex) {
//             this.log.Error("Failed to validate fields", ex);
//             return true;
//         }
//     };
//     H5Validator.prototype.addTextBox = function () {
//         var textElement = new TextBoxElement();
//         textElement.Name = "testTextBox";
//         textElement.Value = "";
//         textElement.Position = new PositionElement();
//         textElement.Position.Top = 2;
//         textElement.Position.Left = 14;
//         textElement.Position.Width = 15;
//         this.contentElement.AddElement(textElement);
//     };
//     H5Validator.prototype.logEvent = function (eventName, args) {
//         this.log.Info("Event: " + eventName + " Command type: " + args.commandType + " Command value: " + args.commandValue);
//     };
//     H5Validator.prototype.detachEvents = function () {
//         this.detachRequesting();
//         this.detachRequested();
//     };
//     H5Validator.prototype.attachEvents = function (controller) {
//         var _this = this;
//         this.detachRequesting = controller.Requesting.On(function (e) {
//             _this.onRequesting(e);
//         });
//         this.detachRequested = controller.Requested.On(function (e) {
//             _this.onRequested(e);
//         });
//     };
//     H5Validator.prototype.onRequesting = function (args) {
//         if (args.commandType === "KEY" && args.commandValue === "ENTER") {
//             if (!this.validateFields()) {
//                 args.cancel = true;
//             }
//         }
//     };
//     H5Validator.prototype.onRequested = function (args) {
//         this.detachEvents();
//     };
//     return H5Validator;
// }());



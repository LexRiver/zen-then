function zen(){
    //var debug = console.log;
    var debug = function(){};
    var z = {};
    z._arrayOfFunc = [];
    z._isStarted = false;
    z._exceptionHandler = null;

    z._arrayOfWarnings = [];
    z._eachWarningHandler = null;
    z._allWarningsHandler = null;


    z.isFunction = function(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    };
    z.isString = function(p) {
        return typeof p === "string" || p instanceof String;
    };


    z.return = function(result){
        debug('==> returning from function, got result: ', result);
        if (z._arrayOfFunc.length > 0) {
            //we have some more functions to execute
            z._executeNextFunction(result);//execute next function
        } else {
            z._stopExecution();
        }
    };
    z.result = z.return;
    z.ok = z.return;

    z.catch = function(exceptionHandler){
        debug('==> adding exception handler');
        if(z.isFunction(exceptionHandler)){
            z._exceptionHandler = exceptionHandler;
        }
    };

    z._executeExceptionHandlerIfExists = function(exception){
        debug('==> executing exception handler or throw');
        if(z.isFunction(z._exceptionHandler)){
            z._exceptionHandler(exception);

        } else {
            console.log('unhandled exception: ', exception);
            throw exception;

        }
    };

    z.then = function(nextFunction) {
        debug('==> adding next function');
        z._arrayOfFunc.push(nextFunction);
        if (z._isStarted == false) {
            debug('==> executing first function');
            z._isStarted = true;
            z._executeNextFunction();
        }
        return this;
    };

    z._executeNextFunction = function(p){
        debug('==> execute next function');
        var nextFunction = z._arrayOfFunc.shift();
        if (z.isFunction(nextFunction)) {
            try {
                nextFunction(p);
            } catch(e) {
                z._stopExecution();
                z._executeExceptionHandlerIfExists(e);
            }
        } else {
            z._stopExecution();
        }
    };

    z._stopExecution = function() {
        debug('==> stop execution');
        // handle warnings
        if (z._eachWarningHandler) {
            for (var warningIndex in z._arrayOfWarnings) {
                z._eachWarningHandler(z._arrayOfWarnings[warningIndex]);
            }
        }

        if (z._allWarningsHandler) {
            z._allWarningsHandler(z._arrayOfWarnings);
        }

        z._isStarted = false;
        z._arrayOfFunc = [];
        z._arrayOfWarnings = [];

    };


    z.addWarning = function(warningMessage) {
        debug('==> adding warning ', warningMessage);
        z._arrayOfWarnings.push(warningMessage);
    };
    z.warning = z.addWarning;

    z.eachWarning = function(warningHandler) {
        debug('==> assign eachWarningHandler');
        if (z.isFunction(warningHandler)) {
            z._eachWarningHandler = warningHandler;
        }
        return this;
    };

    z.getAllWarnings = function(warningsHandler) {
        debug('==> assign allWarningsHandler');
        if (z.isFunction(warningsHandler)) {
            z._allWarningsHandler = warningsHandler;
        }
        return this;
    };


    return z;
}

module.exports = zen;
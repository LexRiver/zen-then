
function zen(){
    //var log = console.log;
    var debug = function(){};
    var z = {};
    z._arrayOfFunc = [];
    z._isStarted = false;
    z._exceptionHandler = null;

    z._arrayOfWarnings = [];
    z._eachWarningHandler = null;
    z._allWarningsHandler = null;


    // ---


    /**
     * Helper function: checks if argument is a function
     * @param functionToCheck
     * @returns {boolean}
     */
    z.isFunction = function(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    };

    /**
     * Helper function: checks if argument is a string
     * @param p
     * @returns {boolean}
     */
    z.isString = function(p) {
        return typeof p === "string" || p instanceof String;
    };

    /**
     * Helper function: clone object using a shallow copy
     * @param obj
     * @returns {{}}
     */
    z.clone = function(obj){
        var result = {};
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                result[i] = obj[i];
            }
        }
        return result;
    };


    /**
     * return from a function and execute next function if exists
     */
    z.return = function(){
        debug('\t returning from function, got '+arguments.length+' results ');
        //for(var i in arguments){
        //    log('\t '+arguments[i]);
        //}

        if (z._arrayOfFunc.length > 0) {
            //we have some more functions to execute
            z._executeNextFunction.apply(this, arguments);//execute next function

        } else {
            z._stopExecution();
        }
    };
    z.result = z.return;
    z.ok = z.return;

    /**
     * return from a function with an exception
     * @param exception
     */
    z.exception = function(exception){
        debug('\t throwing exception from function');
        z._stopExecution();
        z._executeExceptionHandlerIfExists(exception);
    };
    z.fail = z.exception;
    z.error = z.exception;

    /**
     * create exception handler
     * @param exceptionHandler
     * @returns {z}
     */
    z.catch = function(exceptionHandler){
        debug('\t adding exception handler');
        if(z.isFunction(exceptionHandler)){
            z._exceptionHandler = exceptionHandler;
        }
        return this;
    };

    z._executeExceptionHandlerIfExists = function(exception){
        debug('\t executing exception handler or throw');
        if(z.isFunction(z._exceptionHandler)){
            z._exceptionHandler(exception);

        } else {
            console.log('unhandled exception: ', exception);
            throw exception;

        }
    };

    /**
     * add new function to be executed
     * @param nextFunction
     * @returns {z}
     */
    z.then = function(nextFunction) {
        debug('\t adding next function');
        z._arrayOfFunc.push(nextFunction);

        if (z._isStarted == false) {
            z._isStarted = true;
            setTimeout(function(){
                debug('\t execution is started, executing first function');
                z._executeNextFunction();

            }, 1);
        }
        return this;
    };

    z._executeNextFunction = function(){
        debug('\t execute next function with '+arguments.length+' parameters ');
        //for(var i in arguments){
        //    log('\t '+arguments[i]);
        //}

        var nextFunction = z._arrayOfFunc.shift();
        if (z.isFunction(nextFunction)) {
            try { // with try we can catch exception only for sync function
                nextFunction.apply(this, arguments);
            } catch (e) {
                z._stopExecution();
                z._executeExceptionHandlerIfExists(e);
            }

        } else {
            debug('\t next function is not a function, stopping execution');
            z._stopExecution();

        }
    };

    z._stopExecution = function() {
        debug('\t stop execution');
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

    /**
     * add a warning
     * @param warningMessage
     */
    z.addWarning = function(warningMessage) {
        debug('\t adding warning ', warningMessage);
        z._arrayOfWarnings.push(warningMessage);
    };
    z.warning = z.addWarning;

    /**
     * create warnings handler, will be executed for each warning
     * @param warningHandler
     * @returns {z}
     */
    z.eachWarning = function(warningHandler) {
        debug('\t assign eachWarningHandler');
        if (z.isFunction(warningHandler)) {
            z._eachWarningHandler = warningHandler;
        }
        return this;
    };

    /**
     * create warnings handler
     * @param warningsHandler
     * @returns {z}
     */
    z.getAllWarnings = function(warningsHandler) {
        debug('\t assign allWarningsHandler');
        if (z.isFunction(warningsHandler)) {
            z._allWarningsHandler = warningsHandler;
        }
        return this;
    };




    return z;
}

module.exports = zen;
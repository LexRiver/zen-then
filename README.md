# zen-then
javascript control-flow tool that allows execution of async code step by step.

## How to use
```javascript
var z = require('zen-then')();

z.then(function(){
    console.log('1...');
    return z.result('one');

}).then(function(x){
    console.log('2...');
    console.log('1st function result: ', x);
    setTimeout(function(){
        console.log('x=', x);
        return z.result(x+' plus one');
    }, 1000);

}).then(function(x){
    console.log('3...');
    console.log('result from second function: ', x);
    return z.result();

});
```

It's important to explicitly call `return z.result(...)` after each function. 
```javascript
return z.result('some return value');
return z.result('string',123,x); //few values can be returned
return z.result(); //just continue to the next function
```


To use returned values in the next function:
```javascript
var z = require('zen-then')();
z.then(function(){
    return z.result(1,2,3);

}).then(function(a,b,c){
    console.log(a,b,c);
    return z.result();
    
});

```


There are some aliases for z.result():
```javascript
return z.result(...);
return z.ok(...); //same as z.result(...);
return z.return(...); //same as z.result(...);
```


## Exception handling
Execute `return z.exception(myExceptionObject)` to throw exception and stop execution. 
This is not the same exception as in `throw myException`.
Use `.catch(function(exception){ ... })` method to catch exception from any function.
```javascript
var z = require('zen-then')();

z.then(function(){
    console.log('1...');
    return z.result('one');

}).then(function(x){
    console.log('2...');
    console.log('1st function result: ', x);
    setTimeout(function(){
        console.log('x=', x);
        return z.exception('X'); //let's throw exception
    }, 1000);

}).then(function(x){
    // this function will not be executed
    console.log('3...');
    console.log('result from second function: ', x);
    return z.result();

}).catch(function(exception){
    console.log('catching exception: ', exception);

});
```
Method `.catch(function(exception){ ... }` can catch usual exception also, but only for synchronous functions. 
So you must exlicitly call `return z.exception(...)` when hadling usual exception in asynchronous functions.

Aliases for `return  z.exception(...)`.
```javascript
return z.exception(x);
return z.error(x); //same
return z.fail(x); //same
```

Alias for `.catch` is `.onError`:
```javascript
.catch(function(exception){ ... });
.onError(function(exception){ ... }); //same
```


## Warnings
You can throw warning messages with `z.warning('message')` and catch them later with 
`.eachWarning(function(warning){ ... })` or with `.getAllWarnings(function(allWarnings){ ... })`.
All warnings handling occurs after all functions will be executed or before any exception handling.

```javascript
var z = require('zen-then')();

z.then(function(){
    console.log('1...');
    z.warning('my warning');
    return z.result('one');

}).then(function(x){
    console.log('2...');
    console.log('1st function result: ', x);
    setTimeout(function(){
        console.log('x=', x);
        z.warning('my another warning');
        return z.result(x+' plus one');
    }, 1000);

}).then(function(x){
    console.log('3...');
    console.log('result from second function: ', x);
    return z.result();

}).catch(function(exception){
    console.log('catching exception: ', exception);

}).eachWarning(function(w){
    console.log('got warning: ', w);

}).getAllWarnings(function(allWarnings){
    console.log('all warnings:');
    for(var i in allWarnings){
        console.log(' - ' + allWarnings[i]);
    }
});
```


## Named functions
You can use named functions
```javascript
var z = require('zen-then')();

z.then(function myFirstFunction(){
    return z.result(1);

}).then(function mySecondFunction(x){
    console.log(x);
    return z.result();
    
});
```



# zen-then
javascript control-flow tool that allows execution of async code step by step.

## How to use
```
var z = zen();

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

It's important to explicitly call `return z.result('any return value')` after each function.
A return value can be of any type.

Aliases for `return z.result(...)` are `return z.ok(...)` and `return z.return(...)`.


You can also return few number of values and use them in the next function
```
var z = zen();
z.then(function(){
    return z.result(1,2,3);

}).then(function(a,b,c){
    console.log(a,b,c);
    return z.result();
    
});

```


## Exception handling
Execute `return z.exception(myExceptionObject)` to throw exception and stop execution. 
This is not the same exception as in `throw myException`.
Use `.catch(function(exception){ ... })` method to catch exception from any function.
```
var z = zen();

z.then(function(){
    console.log('1...');
    return z.result('one');

}).then(function(x){
    console.log('2...');
    console.log('1st function result: ', x);
    setTimeout(function(){
        console.log('x=', x);
        return z.exception('X');
        //return z.result(x+' plus one');
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

Alias for `.catch` is `.onError`, for example `.onError(function(error){ ... });`.

And aliases for `return  z.exception(...)` are `return z.error(...)` and  `return z.fail(...)`.


## Warnings
You can throw warning messages with `z.warning('message')` and catch them later with 
`.eachWarning(function(warning){ ... })` or with `.getAllWarnings(function(allWarnings){ ... })`.
All warnings handling occurs after all functions will be executed or before any exception handling.

```
var z = zen();

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
You can use named functions if you want
```
var z = zen();

z.then(function myFirstFunction(){
    return z.result(1);

}).then(function mySecondFunction(x){
    console.log(x);
    return z.result();
    
});
```



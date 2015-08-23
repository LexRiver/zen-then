# zen-then
javascript control-flow tool that allows execution of async code step by step.

## How to use
```
var z = zen();

z.then(function(){
    console.log('1...');
    return z.return('one');

}).then(function(x){
    console.log('2...');
    console.log('1st function result: ', x);
    setTimeout(function(){
        console.log('x=', x);
        return z.return(x+' plus one');
    }, 1000);

}).then(function(x){
    console.log('3...');
    console.log('result from second function: ', x);
    return z.return();

});
```

It's important to explicitly call `return z.return('any return value')` after each function.
A return value can be of any type.

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
Execute `return z.exception('my exception')` to throw exception and stop execution.
Use `.catch(function(exception){ ... })` method to catch any exception.
```
var z = zen();

z.then(function(){
    console.log('1...');
    return z.return('one');

}).then(function(x){
    console.log('2...');
    console.log('1st function result: ', x);
    setTimeout(function(){
        console.log('x=', x);
        return z.exception('X');
        //return z.return(x+' plus one');
    }, 1000);

}).then(function(x){
    // this function will not be executed
    console.log('3...');
    console.log('result from second function: ', x);
    return z.return();

}).catch(function(exception){
    console.log('catching exception: ', exception);

});
```
Method `.catch(function(exception){ ... }` can catch usual exception, but only for synchronous functions.


## Warnings
You can throw warning messages with `z.warning('message')` and catch them later with 
`.eachWarning(function(warning){ ... })` or with `.getAllWarnings(function(allWarnings){ ... })`.
All warnings handling occurs after all functions will be executed or before any exception handling.

```
var z = zen();

z.then(function(){
    console.log('1...');
    z.warning('my warning');
    return z.return('one');

}).then(function(x){
    console.log('2...');
    console.log('1st function result: ', x);
    setTimeout(function(){
        console.log('x=', x);
        z.warning('my another warning');
        return z.return(x+' plus one');
    }, 1000);

}).then(function(x){
    console.log('3...');
    console.log('result from second function: ', x);
    return z.return();

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
    return z.return(1);

}).then(function mySecondFunction(x){
    console.log(x);
    return z.return();
    
});
```


## Some aliases
Alias for `return z.result(...)` is `return z.ok(...)`.

And alias for `return  z.exception(...)` is `return z.fail(...)`.


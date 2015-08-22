# zen-then
javascript control-flow tool that allows execution of async code step by step.

## how to use
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

var o = {a:'aaa'};
var f = function(){
}
f.prototype = o;
var oo = new f();
console.dir(oo);
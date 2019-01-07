function test() :void{
    //test!!!
}

function doGet() :any{
    return HtmlService.createTemplateFromFile('html_index')
        .evaluate()
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setTitle("test");
}
function include(filename :string) :any{
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
function loadfun(funName :string, _arguments :any) :string{
    var fun;
    eval("fun = " + funName + ";");
    if(typeof _arguments == "undefined"){
        return JSON.stringify(fun.apply(null));
    }else{
        if(!Array.isArray(_arguments))  _arguments = [_arguments];
        return JSON.stringify(fun.apply(null,_arguments));
    }
}
function handlePropertiesServiceSet(value:any, type:string) :boolean{
    var properties;
    switch(type){
        case "user":
            properties = PropertiesService.getUserProperties();
            break;
        case "script":
            properties = PropertiesService.getScriptProperties();
            break;
    }
    properties.setProperties(value);
    return true;
}

function handlePropertiesServiceGet(value:string[], type:string) :any{
    var properties;
    switch(type){
        case "user":
            properties = PropertiesService.getUserProperties();
            break;
        case "script":
            properties = PropertiesService.getScriptProperties();
            break;
    }
    var result = {};
    value.forEach(function(v){
        result[v] = (properties.getProperty(v) === undefined ? null : properties.getProperty(v));
    });
    return result;
}

function handlePropertiesServiceDelete(value:string[], type:string) :boolean{
    var properties;
    switch(type){
        case "user":
            properties = PropertiesService.getUserProperties();
            break;
        case "script":
            properties = PropertiesService.getScriptProperties();
            break;
    }
    value.forEach(function(v){
        properties.deleteProperty(v);
    });
    return true;
}

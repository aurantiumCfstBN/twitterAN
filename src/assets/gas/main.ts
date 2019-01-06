function test() :void{
    //test!!!
}

function doGet() :any{
    return HtmlService.createTemplateFromFile('html_index')
        .evaluate()
        .setSandboxMode(HtmlService.SandboxMode.IFRAME)
        .setTitle("test");
}

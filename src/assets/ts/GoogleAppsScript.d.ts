declare namespace google {
    namespace script {
        interface run{
            loadfun(funName: string, _arguments: any): any;
            withFailureHandler(func: any): google.script.run;
            withSuccessHandler(func: any): google.script.run;
            withUserObject(func: any): google.script.run;
        }
    }
}
declare var google:{script:{run:google.script.run}};

import { fetchHomeTimeline } from 'twitter-api-ts';
import * as option from 'fp-ts/lib/Option';
import { ObjectType } from 'io-ts';
import $ from 'jquery';

$(function(){
    var twitterKeys = {
        CONSUMER_KEY:'',
        CONSUMER_SECRET:'',
        TOKEN:'',
        TOKEN_SECRET:''
    };

    var button = $("input[name='start']");
    button.on('click',function(e){
        if(button.val() === 'on'){
            button.val('off');
            return;
        }else{
            button.val('on');
        }

        fetchHomeTimeline({
            oAuth: {
                consumerKey: twitterKeys.CONSUMER_KEY,
                consumerSecret: twitterKeys.CONSUMER_SECRET,
                token: option.some(twitterKeys.TOKEN),
                tokenSecret: option.some(twitterKeys.TOKEN_SECRET),
            },
            query: {
                count: option.some(50),
            },
        })
            // We use fp-ts’ Task type, which is lazy. Running the task returns a
            // promise.
            .run()
            .then(response => {
                console.log(response);
                // => Either<ErrorResponse, TwitterAPITimelineResponseT>
            });

    });



    handlePropertiesService(['TWITTER_CONSUMER_KEY','TWITTER_CONSUMER_SECRET','TWITTER_TOKEN','TWITTER_TOKEN_SECRET'], 'script', 'get').then(function(value){
        twitterKeys.CONSUMER_KEY = value.TWITTER_CONSUMER_KEY;
        twitterKeys.CONSUMER_SECRET = value.TWITTER_CONSUMER_SECRET;
        twitterKeys.TOKEN = value.TWITTER_TOKEN;
        twitterKeys.TOKEN_SECRET = value.TWITTER_TOKEN_SECRET;
        console.log(twitterKeys);
    });


});


function runServerFun(funName:string, _arguments:any) :Promise<any>{
    return new Promise(function (resolve:any,reject:any){
        google.script.run
        .withSuccessHandler(function(v:any,o:any){
            try{
                resolve(JSON.parse(v),o);
            }catch(e){
                resolve(v,o);
            }
        })
        .withFailureHandler(function(e:any,o:any){
            reject(e,o);
        })
        .loadfun(funName, _arguments);
    });
}

function handlePropertiesService(value:any ,type:string ,doKind :string) :Promise<any>{
    var emptyPromise = Promise.resolve();
    switch(doKind){
        case "set":
            return runServerFun("handlePropertiesServiceSet",[value,type]);
        case "get":
            if(value === null || value === undefined){
                value = [];
            }else if(typeof value === "string"){
                value = [value];
            }else if(!Array.isArray(value)){
                return emptyPromise;
            }
            return runServerFun("handlePropertiesServiceGet",[value,type]);
        case "delete":
            if(value === null || value === undefined){
                value = [];
            }else if(typeof value === "string"){
                value = [value];
            }else if(!Array.isArray(value)){
                return emptyPromise;
            }
        return runServerFun("handlePropertiesServiceDelete",[value,type]);
    }
    return emptyPromise;
}
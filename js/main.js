// Place third party dependencies in the lib folder
requirejs.config({
    "baseUrl": "js/scripts/libs",
    "paths": {
        balanceSheet      :  "../component/core/balanceSheet",
        models            :  "../component/core/balanceSheet/models",
        views             :  "../component/core/balanceSheet/views",
        view              :  "../component/core/balanceSheet/views/gridDataView",
        configurator      :  "../component/core/balanceSheet/configuration/configurator",
        generalController :  "../component/core/balanceSheet/controller",
        modelController   :  "../component/core/balanceSheet/models/controllerDataModels",
        editor            :  "../component/core/balanceSheet/editors",
        exporter          :  "../component/core/balanceSheet/exports"
    },
    "shim": {
        "bootstrap": {
            deps: ["jquery"]
        },
        "infragistics" : {
            "deps" : ["jquery","jquery-ui"]
        },
        "jquery-ui" : {
          "deps" : ["jquery"]
        },
        "jquery.dirtyFields" : {
            deps: ["jquery"]
        },
        "timepicker":{
            deps: ["jquery-ui"]
        }
    }
});

require(["../../IndexContext", "domReady!", "bootstrap"], function(IndexContext) {
    console.log("index.js() - require() on domReady!");

    var indexContext = new IndexContext();
    indexContext.init();

});

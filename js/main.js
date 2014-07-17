// Place third party dependencies in the lib folder
requirejs.config({
    "baseUrl": "js/scripts/libs",
    "paths": {
        balanceSheet :  "../component/core/balanceSheet",
        models       :  "../component/core/balanceSheet/models",
        view         :  "../component/core/balanceSheet/views/gridDataView",
        configurator :  "../component/core/balanceSheet/configuration/configurator",
       "datatables"  :  "jquery.dataTables"
    },
    "shim": {
        "bootstrap": {
            deps: ["jquery"]
        },
        "infragistics" : {
            "deps" : ["jquery","jquery-ui"]
        }
    }
});

require(["../../IndexContext", "domReady!", "bootstrap"], function(IndexContext) {
    console.log("index.js() - require() on domReady!");

    var indexContext = new IndexContext();
    indexContext.init();

});

define(["jquery", "moment"], function($){

    var mapLabelToCode = [];

    function DatatypesFormatter(){}


    // When the data comes back from the editing,they need to be saved
    // in the right format
    DatatypesFormatter.prototype.init = function(value, datatype){

        var result
            switch (datatype){
                case "month":
                   result = (value !=='undefined')? moment(value).format("YYYYMM"): undefined;
                    break;

                case "year" :
                   result = (value !=='undefined')? moment(value).format("YYYY"): undefined;
                   break;

                case "time" :
                   result = (value !=='undefined')? moment(value).toJSON() : undefined;
                    break;

                case "date":
                   result = (value !=='undefined')? moment(value).format("YYYYMMDD"): undefined;
                    break;

                case "code" || "codeList" || "customCode":
                    result =  (value !=='undefined')? value : undefined;
                    break;

                default :
                   result =  (value !=='undefined')? value : undefined;
            }
        return result;
    }


    DatatypesFormatter.prototype.renderRightLabelOrFormatView = function (value, configurationKeyColumn, datatype, configurator) {

        var result;
        switch (datatype[0]) {
            case "time":
                var date = new Date(value);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "month":
                var year = value.substr(0, 4);
                var month = value.substr(4, 2);
                var date = new Date(year, month - 1);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "year":
                var year = value.substr(0, 4);
                var date = new Date(year);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "date":
                var year = value.substr(0, 4);
                var month = value.substr(4, 2);
                var day = value.substr(6, 2);
                var date = new Date(year, month - 1, day);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "code" ||"codeList" || "customCode":
                var codeToLabel = this.lookForCodeFromLabel(value);
                var columnsCodes = configurator.lookForCode(configurationKeyColumn.columnId);
                result = columnsCodes.mapCodeLabel[value];
                break;
        }
        return result;

    }


    DatatypesFormatter.prototype.lookForCodeFromLabel = function(label){
        var result;
        for(var i =0; i<mapLabelToCode.length; i++){
            if(typeof mapLabelToCode[i].map[label] !== 'undefined'){
                result = mapLabelToCode[i].map[label]
            }
        }
        return result;
    }




    return DatatypesFormatter;
})
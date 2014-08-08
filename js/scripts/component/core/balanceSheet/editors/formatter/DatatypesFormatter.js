define(["jquery", "moment"], function($){

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
                default :
                   result =  (value !=='undefined')? value : undefined;
            }
        return result;
    }


    return DatatypesFormatter;
})
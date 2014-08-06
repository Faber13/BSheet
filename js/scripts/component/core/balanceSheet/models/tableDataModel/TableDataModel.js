/**
 * Created by fabrizio on 6/26/14.
 */

define(["jquery" ], function ($) {

    var instanceData, Configurator, instanceFullTableData, counterEmptySpaces


    function TableDataModel() {
    }


    TableDataModel.prototype.init = function (data, configurator) {
        instanceData = data;
        Configurator = configurator;
    }


    TableDataModel.prototype.getTableData = function(){
        return instanceData
    }


    TableDataModel.prototype.setTableData = function(newData){
        // TODO
    }


    TableDataModel.prototype.createFullTableData = function(modelForCreation){

        var dsdColumns = Configurator.getAllColumnModels();
        var leftIndexes = dsdColumns["leftColumnsModel"]["leftKeyIndexes"]
        var upIndexes = dsdColumns["upColumnsModel"]["upKeyIndexes"]
        var accessorIndexes = dsdColumns["accessorColumnsModel"]["accessorIndexes"];
        var valueIndexes = dsdColumns["valueColumnsModel"]
        var table = []
        counterEmptySpaces = {
            rows: [],
            columns : []
        }

        var numberOfRows = 0;
        for (var i = 0; i < modelForCreation["matrixAll"].length; i++) {
            counterEmptySpaces.rows[i] = 0;
            for (var j = 0; j < modelForCreation["matrixAll"][i].length; j++) {
                if(typeof counterEmptySpaces.columns[j] === 'undefined'){
                    counterEmptySpaces.columns[j] = 0
                }
                var cell = modelForCreation["matrixAll"][i][j];
                if (cell.length > 0) {
                    counterEmptySpaces.columns[j] = 1;
                    counterEmptySpaces.rows[i] = 1;
                    var leftKeys = modelForCreation["matrixLeft"][i]
                    var upKeys = modelForCreation["matrixUp"][0][j]
                    var val = cell[0];
                    var accessors = []
                    for (var k = 1; k < cell.length; k++) {
                        accessors.push(cell[k]);
                    }
                    var array = []
                    for (var m = 0; m < leftIndexes.length; m++) {
                        array[leftIndexes[m]] = leftKeys[m];
                    }

                    for (var m = 0; m < upIndexes.length; m++) {
                        array[upIndexes[m]] = upKeys[m];
                    }

                    for (var m = 0; m < accessorIndexes.length; m++) {
                        array[accessorIndexes[m]] = accessors[m];
                    }
                    array[valueIndexes] = val;

                    table.push(array)
                    numberOfRows ++;
                } else{
                    var leftKeys = modelForCreation["matrixLeft"][i]
                    var upKeys = modelForCreation["matrixUp"][0][j]
                    var val = cell[0];
                    var accessors = []
                    for (var k = 1; k < cell.length; k++) {
                        accessors.push(cell[k]);

                    }
                    var array = []
                    for (var m = 0; m < leftIndexes.length; m++) {
                        array[leftIndexes[m]] = leftKeys[m];
                    }

                    for (var m = 0; m < upIndexes.length; m++) {
                        array[upIndexes[m]] = upKeys[m];
                    }

                    for (var m = 0; m < accessorIndexes.length; m++) {
                        array[accessorIndexes[m]] = accessors[m];
                    }
                    array[valueIndexes] = val;

                    table.push(array)
                    numberOfRows ++;
                }
            }
        }
        return table;
    }


    TableDataModel.prototype.createTableModelFromGrid = function(GridDataModel){

        var result = [];
        for(var i =0; i< GridDataModel.length; i++){
            for(var j= 0; j<GridDataModel[i].length; j++){
                // for each value contained into a cell
            }
        }




    }


    TableDataModel.prototype.getFullTableData = function(){
        return instanceFullTableData;
    }


    return TableDataModel;
})
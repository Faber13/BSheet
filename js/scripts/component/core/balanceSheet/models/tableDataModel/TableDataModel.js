/**
 * Created by fabrizio on 6/26/14.
 */

define(["jquery" ], function ($) {

    var instanceData, Configurator, instanceFullTableData, counterEmptySpaces,
        fullRows, fullColumns


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

    TableDataModel.prototype.createSparseTableData = function(newData){
        instanceData = newData;
    }


    TableDataModel.prototype.createFullTableData = function(modelForCreation){
        fullColumns = [];
        fullRows = [];

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
                    fullColumns.push(j);
                    fullRows.push(i);

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
        instanceFullTableData =table;
        return table;
    }


    TableDataModel.prototype.createTableModelFromGrid = function(GridDataModel){

        fullRows.sort(function(a,b){ return a > b ? 1 : a < b ? -1 : 0;})
        fullColumns.sort(function(a,b){return a > b ? 1 : a < b ? -1 : 0;})
        debugger;

        var result = [];
        for(var i =0; i< fullRows.length; i++){
            var indRow = fullRows[i]
            for(var j= 0; j<fullColumns.length; j++){
                var indCol = fullColumns[j]
                // for each value contained into a cell
                var numberColumns  =  counterEmptySpaces.columns.length;
                if (indRow == 0) {
                   result.push(instanceFullTableData[indCol])
                }else{
                   result.push(instanceFullTableData[(numberColumns * indRow)+(indCol)])
                }
            }
        }
        debugger;
        return result;
    }


    TableDataModel.prototype.updateTableData = function(value, index){
        instanceData[index] = value;
    }


    TableDataModel.prototype.getFullTableData = function(){
        return instanceFullTableData;
    }


    return TableDataModel;
})
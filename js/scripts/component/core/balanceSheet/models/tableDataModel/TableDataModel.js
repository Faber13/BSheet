/**
 * Created by fabrizio on 6/26/14.
 */

define(["jquery" ], function ($) {

    var instanceData, Configurator, instanceFullTableData, counterEmptySpaces,
        fullRows, fullColumns, indexesDoubleColumnLeft, originalData, leftIndexes, upIndexes;

    // -------------------- SET OPERATIONS --------------------------------------

    Array.prototype.getUnique = function () {
        var u = {}, a = [];
        for (var i = 0, l = this.length; i < l; ++i) {
            if (u.hasOwnProperty(this[i])) {
                continue;
            }
            a.push(this[i]);
            u[this[i]] = 1;
        }
        return a;
    }

    //----------------------------------------------------------------------


    function TableDataModel() {
    }


    TableDataModel.prototype.init = function (data, configurator) {
        instanceData = data;
        originalData =$.extend(true, [], data)
        Configurator = configurator;
    }


    TableDataModel.prototype.getTableData = function () {
        var result = instanceData;
        return result;
    }


    TableDataModel.prototype.setTableData = function (newData) {
        // TODO
    }

    TableDataModel.prototype.createSparseTableData = function (newData) {
        instanceData = newData;
    }


    TableDataModel.prototype.createFullTableData = function (modelForCreation) {
        fullColumns = [];
        fullRows = [];

        var dsdColumns = Configurator.getAllColumnModels();
        leftIndexes = dsdColumns["leftColumnsModel"]["leftKeyIndexes"]
        upIndexes = dsdColumns["upColumnsModel"]["upKeyIndexes"]
        var accessorIndexes = dsdColumns["accessorColumnsModel"]["accessorIndexes"];
        var valueIndexes = dsdColumns["valueColumnsModel"]
        var table = []
        counterEmptySpaces = {
            rows: [],
            columns: []
        }

        var numberOfRows = 0;
        for (var i = 0; i < modelForCreation["matrixAll"].length; i++) {
            counterEmptySpaces.rows[i] = 0;
            for (var j = 0; j < modelForCreation["matrixAll"][i].length; j++) {
                if (typeof counterEmptySpaces.columns[j] === 'undefined') {
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
                    numberOfRows++;
                } else {
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
                    numberOfRows++;
                }
            }
        }

        this.makeOperationsOnFullIndexes(),
        instanceFullTableData = table;
        return table;
    }


    TableDataModel.prototype.getFullIndexRows = function () {
        return fullRows;
    }

    TableDataModel.prototype.getFullIndexColumns = function () {
        return fullColumns;
    }


    TableDataModel.prototype.makeOperationsOnFullIndexes = function () {
        // Sort and "set" operations in variables that represent
        // the rows and columns that have to be represented

        fullRows.sort(function (a, b) {
            return a > b ? 1 : a < b ? -1 : 0;
        })
        fullRows = fullRows.getUnique()
        fullColumns.sort(function (a, b) {
            return a > b ? 1 : a < b ? -1 : 0;
        })
        fullColumns = fullColumns.getUnique();


    }


    TableDataModel.prototype.createTableModelFromGrid = function (GridDataModel) {

        var result = [];
        indexesDoubleColumnLeft = {};
        if(fullRows.length >0 && fullColumns.length >0) {
            var firstIndex = (counterEmptySpaces.columns.length * fullRows[0]) + fullColumns[0];
            var firstField = instanceFullTableData[firstIndex][0];
        }

        for (var i = 0; i < fullRows.length; i++) {
            var indRow = fullRows[i]
            for (var j = 0; j < fullColumns.length; j++) {
                var indCol = fullColumns[j]

                // for each value contained into a cell
                var numberColumns = counterEmptySpaces.columns.length;
                if (GridDataModel["matrixLeft"][0].length == 2) {
                    if (indRow == 0) {
                        result.push(instanceFullTableData[indCol])
                    } else {
                        var element = instanceFullTableData[(numberColumns * indRow) + (indCol)]
                        if (typeof firstField !== 'undefined' && firstField !== element[0]) {
                            firstField = element[0];
                            var startingIndex = j + (i * fullColumns.length);
                            for (var k = 0; k < fullColumns.length; k++) {
                                indexesDoubleColumnLeft[startingIndex + k] = 1;
                            }
                        }
                        result.push(instanceFullTableData[(numberColumns * indRow) + (indCol)])
                        // new Left key element
                    }

                } else {
                    if (indRow == 0) {
                        result.push(instanceFullTableData[indCol])
                    } else {
                        result.push(instanceFullTableData[(numberColumns * indRow) + (indCol)])
                    }
                }
            }
        }

        return result;
    }



    // Represent Every rows but only the full columns
    TableDataModel.prototype.createColumnSparseTableData = function(modelForCreation){

        var result = [];
        // for each Row
        for (var i = 0; i < modelForCreation["matrixAll"].length; i++) {
            for(var j = 0; j<fullColumns.length; j++){
                var indexColumns = fullColumns[j];
                var numberColumns = counterEmptySpaces.columns.length;
                result.push(instanceFullTableData[(numberColumns*i)+indexColumns])
            }
        }

        return result;
    }


    TableDataModel.prototype.updateTableData = function (value, index) {
        alert("SAVEING DATA!!!")
        debugger;
        instanceData[index] = value;
        // new Data To Save!!
        var indexRow = this.findIfUpdateOrNewValue(value)
        if(typeof indexRow =='undefined'){
            originalData.push(value);
        }else{
            originalData[indexRow] = value;
        }
        alert("SAVEDDDDD")
        debugger;
    }


    TableDataModel.prototype.findIfUpdateOrNewValue = function(value){
        var indexRow;
        var allKeyIndexes = leftIndexes.concat(upIndexes);
        var found = false;
        alert("FINDDD")
        debugger;
        for(var i =0; i< originalData.length && !found; i++){
            var row = originalData[i];
            if(value[allKeyIndexes[0]] == row[allKeyIndexes[0]]){
                var semiFound =true;
                for(var j =1; j< allKeyIndexes.length  && semiFound;j++){
                    if(value[allKeyIndexes[j]] != row[allKeyIndexes[j]]){
                        semiFound = false;
                    }else{
                        if(semiFound && j== allKeyIndexes.length -1){
                            indexRow = i;
                            found = true;
                        }
                    }
                }

            }
        }
        return indexRow;
    }


    TableDataModel.prototype.getFullTableData = function () {
        return instanceFullTableData;
    }

    TableDataModel.prototype.getIndexesDoubleColumns = function () {
        return indexesDoubleColumnLeft;
    }


    return TableDataModel;
})
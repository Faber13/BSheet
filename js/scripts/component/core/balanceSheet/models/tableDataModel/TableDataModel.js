/**
 * Created by fabrizio on 6/26/14.
 */

define(["jquery" ], function ($) {

    var dsdConf,
        leftKeyColumns,             // DSD columns that represent the left key columns
        leftKeyIndexes,             // Index of the left key columns on the DSD
        upKeyColumns,               // DSD columns that represent the up key columns
        upKeyIndexes,               // DSD columns that represent the up key columns
        accessorIndexes,            // Indexes that indicate the position of the accessor column on the data
        accessorColumns,
        compConfiguration,
        lefKeyColumnConfiguration,   // Left key columns on the configuration ordered with DSD
        upKeyColumnConfiguration,    // Up key columns on the configuration ordered with DSD
        indexValueColumns,
        configuratorDsd


    function TableDataModel() {
    }


    TableDataModel.prototype.init = function (data, dsd, configuration, configurator) {


        console.log("TableDataModel init()");
        console.log(dsd);
        dsdConf = dsd;
        compConfiguration = configuration
        configuratorDsd = configurator
        var model = this.createKeyMatrixes(data)

        return model;

    }


    TableDataModel.prototype.createKeyMatrixes = function (data) {

        var matrixLeft, matrixUp;

        leftKeyColumns = configuratorDsd.getDSDtoConfigurationKeyColumns().leftColumns
        leftKeyIndexes = configuratorDsd.getLeftKeyColumn()["leftKeyIndexes"]
        upKeyColumns = configuratorDsd.getDSDtoConfigurationKeyColumns().upColumns
        upKeyIndexes = configuratorDsd.getUpKeyColumn()["upKeyIndexes"]
        accessorIndexes = configuratorDsd.getDSDAccessorColumns()["accessorColumns"]
        accessorColumns = configuratorDsd.getDSDAccessorColumns()["accessorIndexes"]
        lefKeyColumnConfiguration = configuratorDsd.getKeyColumnConfiguration()["lefKeyColumnConfiguration"]
        upKeyColumnConfiguration = configuratorDsd.getKeyColumnConfiguration()["upKeyColumnConfiguration"]
        indexValueColumns = configuratorDsd.getValueIndex();



        var matrixLeft = this.chooseAndCreateByDataRepresentationType("left")
        var matrixUp = this.chooseAndCreateByDataRepresentationType("up")
        var matrixAll = this.createBigMatrix(matrixLeft, matrixUp)
        var model = {
            "matrixLeft": matrixLeft,
            "matrixUp": matrixUp,
            "matrixAll": matrixAll
        }

        return model;
    }

    /*
     Method that controls the way of visualization declared on the configuration of the component  and
     in order to the data representation, it creates the matrix
     */
    TableDataModel.prototype.chooseAndCreateByDataRepresentationType = function (versus) {

        var matrix, dataRepresentation, keyColumns;

        // Check versus
        if (versus == "left") {
            dataRepresentation = lefKeyColumnConfiguration;
            keyColumns = leftKeyColumns;
        }
        else if (versus == "up") {
            dataRepresentation = upKeyColumnConfiguration;
            keyColumns = upKeyColumns;
        }
        else {
            alert("Error on TableDataModel.chooseAndCreateByDataRepresentationType: " +
                "versus value is bad specified or not specified ");
            throw Error;
        }

        // choose the right way of creating the matrix in order with the data representation type
        switch (dataRepresentation[0].values.dataRepresentation) {
            case "distinct":
                if (dataRepresentation[1].values.dataRepresentation == "distinct") {
                    matrix = this.createMatrixDistinctToDistinct(versus, keyColumns[0], keyColumns[1]);
                }
                else if (dataRepresentation[1].values.dataRepresentation == "domain") {
                    matrix = this.createMatrixDistinctToDomain(versus,keyColumns[0], keyColumns[1]);
                }
                else  if (dataRepresentation[1].values.dataRepresentation == "hybrid"){
                    matrix = this.createMatrixDistinctToHybrid(versus,keyColumns[0], keyColumns[1]);
                }
                else{
                    alert("Error on TableDataModel.chooseAndCreateByDataRepresentationType: error " +
                        "on component configuration with the field dataRepresentation");
                    throw Error;
                }
                break;

            case "domain":
                if (dataRepresentation[1].values.dataRepresentation == "distinct") {
                    matrix = this.createMatrixDomainToDistinct(versus,keyColumns[1], keyColumns[0]);
                }
                else if (dataRepresentation[1].values.dataRepresentation == "domain") {
                    matrix = this.createMatrixDomainToDomain(versus,keyColumns[0], keyColumns[1]);
                }
                else if (dataRepresentation[1].values.dataRepresentation == "hybrid"){
                    matrix = this.createMatrixDomainToHybrid(versus,keyColumns[0], keyColumns[1]);
                }
                else{
                    alert("Error on TableDataModel.chooseAndCreateByDataRepresentationType: error" +
                        " on component configuration with the field dataRepresentation");
                    throw Error;
                }
                break;

            case "hybrid":
                if (dataRepresentation[1].values.dataRepresentation == "distinct") {
                    matrix = this.createMatrixHybridToDistinct(versus,keyColumns[1], keyColumns[0]);
                }
                else if (dataRepresentation[1].values.dataRepresentation == "domain") {
                    matrix = this.createMatrixHybridToDomain(versus,keyColumns[0], keyColumns[1]);
                }
                else if (dataRepresentation[1].values.dataRepresentation == "hybrid") {
                    matrix = this.createMatrixHybridToHybrid(versus,leftKeyColumns[0], leftKeyColumns[1]);
                }
                else{
                    alert("Error on TableDataModel.chooseAndCreateByDataRepresentationType: error " +
                        "on component configuration with the field dataRepresentation");
                    throw Error;
                }
                break;
        }
        return matrix
    }


    TableDataModel.prototype.createMatrixDomainToDomain = function(versus, masterColumn, slaveColumn){

        var matrix = [
            [ ]
        ];

        debugger;

        var slaveArray;
        var masterArray = this.createArrayByDomain(masterColumn);
        (typeof slaveColumn !== 'undefined')?   slaveArray = this.createArrayByDomain(slaveColumn) : slaveArray = undefined;

        switch (versus) {
            case "left":
                for(var i =0; i<masterArray.length; i++){
                   if(typeof slaveArray !=='undefined'){
                       for(var j =0; j<slaveArray.length; j++){
                           matrix[i * slaveArray.length + j] = [masterArray[i], slaveArray[j]];
                       }
                   }else{
                       matrix[i] = [masterArray[i]]
                   }
                }
            break;

            case "up":
                for(var i =0; i<masterArray.length; i++){
                    if(typeof slaveArray !=='undefined') {
                        for (var j = 0; j < slaveArray.length; j++) {
                            matrix[0].push([masterArray[i], slaveArray[j]])
                        }
                    }else {
                        matrix[0].push([masterArray[i]])
                    }
                }
             break;
            }

        return matrix

    }

    /*
        The data representation of the master column is "distinct" and the one of the slave column is "domain"
     */
    TableDataModel.prototype.createMatrixDistinctToDomain = function (versus, masterColumn, slaveColumn) {
        //TODO
    }

    /*
     This method choose the correct domain and creates the array
     */
    TableDataModel.prototype.createArrayByDomain = function (column) {

        var array = []
        switch (column.dataTypes[0]) {

            case "code" :
                var codes = column.domain.codes
                for (var i = 0; i < codes.length; i++) {
                    array.push(codes[i].code.title.EN)
                }
                break;

            case "label":
                break;

            case "boolean":
                array.push(true);
                array.push(false)
                break;

            case "date":
                var from = column.domain.period.from
                var yearFrom = from.substr(0, 4);
                var mmFrom = from.substr(4, 2);
                var ddFrom = from.substr(6, 2);

                var dateFrom = new Date(yearFrom, mmFrom, ddFrom)

                var to = column.domain.period.to
                var yearTo = to.substr(0, 4);
                var mmTo = to.substr(4, 2);
                var ddTo = to.substr(6, 2);

                var dateTo = new Date(yearTo, mmTo, ddTo)
                var date = new Date(yearFrom, mmFrom, ddTo);
                if (date.getTime() < dateTo.getTime()) {
                    for (var i = 1; date.getTime() < dateTo.getTime(); i++) {
                        date = new Date(yearFrom, mmFrom, ddFrom + i);
                        arr.push(date);
                    }
                } else if (date.getTime() == dateTo.getTime()) {
                    array.push(dateTo)
                } else {
                    alert("error!")
                    throw Error
                }

                break;

            case "month":
                var arr = [];
                var from = column.domain.period.from
                var yearFrom = from.substr(0, 4);
                var mmFrom = from.substr(4, 2);
                var dateFrom = new Date(yearFrom, mmFrom)

                var to = column.domain.period.to
                var yearTo = to.substr(0, 4);
                var mmTo = to.substr(4, 2);
                var dateTo = new Date(yearTo, mmTo)
                var date = new Date(yearFrom, mmFrom);
                if (date.getTime() < dateTo.getTime()) {
                    for (var i = 1; date.getTime() < dateTo.getTime(); i++) {
                        date = new Date(yearFrom, mmFrom + i);
                        array.push(date);
                    }
                } else if (date.getTime() == dateTo.getTime()) {
                    array.push(dateTo)
                } else {
                    alert("error!")
                    throw Error
                }
                break;

            case "Time":
                var from = new Date(column.domain.period.from)
                var to = new Date(column.domain.period.to)
                var diff = parseInt((to - from) / 1000)
                for (var i = 1; i < diff.length; i++) {
                    var date = new Date(from + (i * 1000))
                    array.push(JSON.parse(date));
                }
                break;

            case "Year":
                var from = column.domain.period.from
                var yearFrom = from.substr(0, 4);
                var dateFrom = new Date(yearFrom)

                var to = column.domain.period.to
                var yearTo = to.substr(0, 4);
                var dateTo = new Date(yearTo)
                var date = new Date(yearTo);
                if (date.getTime() < dateTo.getTime()) {
                    for (var i = 1; date.getTime() < dateTo.getTime(); i++) {
                        date = new Date(yearFrom + i);
                        arr.push(date);
                    }
                } else if (date.getTime() == dateTo.getTime()) {
                    array.push(dateTo)
                } else {
                    alert("error!")
                    throw Error
                }
                break;

            case "Number":
                var from = column.domain.period.from
                var to = column.domain.period.to

                var counter = from;
                if (counter < to) {
                    for (var i = 0; i < to; i++) {
                        array.push(counter++)
                    }
                } else if (counter == to) {
                    array.push(counter)
                } else {
                    alert("error!")
                    throw Error
                }
                break;
        }
        return array;
    }


    TableDataModel.prototype.createMatrixDistinctToHybrid = function (versus, masterColumn, slaveColumn) {
        //TODO
    }


    TableDataModel.prototype.createMatrixDomainToDistinct = function (versus, masterColumn, slaveColumn) {
        //TODO
    }

    /*
     This method create the key matrix when the data representation is Distinct:
     - slaveColumn can be also undefined;
     - versus is a string and can assume the values "up" or "left"
     */
    TableDataModel.prototype.createMatrixDistinctToDistinct = function (versus, masterColumn, slaveColumn) {

        var matrix = [
            [ ]
        ];

        switch (versus) {
            case "left":
                if (typeof slaveColumn !== 'undefined') {
                    for (var i = 0; i < masterColumn.values.length; i++) {

                        for (var j = 0; j < slaveColumn.values.length; j++) {
                            matrix[i * slaveColumn.values.length + j] = [masterColumn.values[i], slaveColumn.values[j]]
                        }
                    }
                } else {
                    for (var i = 0; i < masterColumn.values.length; i++) {
                        matrix[i] = [masterColumn.values[i]]

                    }
                }
                break;

            case  "up":
                if (typeof slaveColumn !== 'undefined') {
                    for (var i = 0; i < masterColumn.values.length; i++) {
                        for (var j = 0; j < slaveColumn.values.length; j++) {
                            debugger;
                            matrix[0].push([masterColumn.values[i], slaveColumn.values[j]])
                        }
                    }
                } else {
                    for (var i = 0; i < masterColumn.values.length; i++) {
                        matrix[0].push([masterColumn.values[i]])
                    }
                }
        }
        return matrix
    }


    TableDataModel.prototype.createBigMatrix = function (matrixLeft, matrixUp) {

        var matrix = [
            []
        ];

        for (var i = 0; i < matrixLeft.length; i++) {
            for (var j = 0; j < matrixUp[0].length; j++) {
                if (typeof matrix[i] === 'undefined') {
                    matrix[i] = []
                }
                matrix[i].push([]);
            }
        }

        return matrix
    }


    TableDataModel.prototype.printTest = function () {
        for (var i = 0; i < arguments.length; i++) {
            console.log(arguments[i]);
        }
    }


    return TableDataModel;
})
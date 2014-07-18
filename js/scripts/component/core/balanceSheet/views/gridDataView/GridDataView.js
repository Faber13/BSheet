/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery" , "infragistics"], function ($, pivot) {

    var model, configuration, table, Configurator, titlesUp, titlesLeft, accessorMap

    function GridDataView() {

    }


    GridDataView.prototype.init = function (Configuration, gridModel, tableModel,configurator, typeOfCreation) {

        console.log("GridDataView")
        console.log(Configuration)
        console.log(tableModel)
        model = gridModel;
        table = tableModel;
        configuration = Configuration;
        Configurator = configurator;

        (typeOfCreation) ? this.createFullGrid(Configuration, gridModel) : this.createGrid(Configuration, gridModel);


    }


    GridDataView.prototype.createFullGrid = function (Configuration, gridModel) {

        getItem = function (propertyName) {

            return function (items, cellMetadata) {

                $.each(items, function (index, item) {
                    sum = item[propertyName];
                });
                return sum;
            };
        }



        var fullModel         = Configurator.getAllColumnModels();
        var configurationKeys = Configurator.getKeyColumnConfiguration();
        accessorMap           = Configurator.getAccessorMap();
        var leftDimensions =    this.createLeftPivotDimension(fullModel["leftColumnsModel"], configurationKeys);
        var upDimensions =      this.createUpPivotDimension(fullModel["upColumnsModel"], configurationKeys);

    //  var measuresDimension = this.createMeasureDimension(fullModel["valueColumnsModel"], fullModel["accessorColumnsModel"])

        debugger;
        var dataSource = new $.ig.OlapFlatDataSource({
            dataSource: table,
            metadata: {
                cube: {
                    name: "Sales",
                    caption: "Sales",
                    measuresDimension: {
                        caption: "Measures",
                        measures: [ //for each measure, name and aggregator are required
                            { caption: "value", name: "value", aggregator: getItem(4) }

                        ]
                    },
                    dimensions: [ // for each dimension
                        {
                            // For each dimension at least one hierarchy must be defined.
                            caption: "Rows", name: "Rows", /*displayFolder: "Folder1\\Folder2",*/ hierarchies: leftDimensions
                        },
                        {
                            caption: "Columns", name: "Columns", /*displayFolder: "Folder1\\Folder2",*/ hierarchies:upDimensions
                        }
                    ]

                }
            },
            // Preload hiearhies for the rows, columns, filters and measures
            rows: "[Rows].["+titlesLeft[0]+"],[Rows].["+titlesLeft[1]+"]",
            columns: "[Columns].["+titlesUp[0]+"],[Columns].["+titlesUp[1]+"]",
            measures: "[Measures].[value]"

        });

        var dataSource2 = new $.ig.OlapFlatDataSource({
            dataSource: table,
            metadata: {
                cube: {
                    name: "Sales",
                    caption: "Sales",
                    measuresDimension: {
                        caption: "Measures",
                        measures: [ //for each measure, name and aggregator are required
                            { caption: "value", name: "value", aggregator: getItem(4) }

                        ]
                    },
                    dimensions: [ // for each dimension
                        {
                            // For each dimension at least one hierarchy must be defined.
                            caption: "Rows1", name: "Rows1", /*displayFolder: "Folder1\\Folder2",*/ hierarchies: [
                            {
                                caption: "Rows1", name: "Rows1", levels: [

                                {
                                    name: "Rows1", caption: "Rows1",
                                    memberProvider: function (item) {
                                        return item[0];
                                    }
                                }
                            ]
                            }
                        ]
                        },
                        {
                            // For each dimension at least one hierarchy must be defined.
                            caption: "Rows2", name: "Rows2", /*displayFolder: "Folder1\\Folder2",*/ hierarchies: [
                            {
                                caption: "Rows2", name: "Rows2", levels: [

                                {
                                    name: "Rows2", caption: "Rows2",
                                    memberProvider: function (item) {
                                        return item[1];
                                    }
                                }
                            ]
                            }
                        ]
                        },
                        {
                            // For each dimension at least one hierarchy must be defined.
                            caption: "Column1", name: "Column1", /*displayFolder: "Folder1\\Folder2",*/ hierarchies: [
                            {
                                caption: "Column1", name: "Column1", levels: [

                                {
                                    name: "Column1", caption: "Column1",
                                    memberProvider: function (item) {
                                        return item[2];
                                    }
                                }
                            ]
                            }
                        ]
                        },
                        {
                            // For each dimension at least one hierarchy must be defined.
                            caption: "Column2", name: "Column2", /*displayFolder: "Folder1\\Folder2",*/ hierarchies: [
                            {
                                caption: "Column2", name: "Column2", levels: [

                                {
                                    name: "Column2", caption: "Column2",
                                    memberProvider: function (item) {
                                        return item[3];
                                    }
                                }
                            ]
                            }
                        ]
                        }

                    ]
                }
            },

            // Preload hiearhies for the rows, columns, filters and measures
            rows: "[Rows1].[Rows1],[Rows2].[Rows2]",
            columns: "[Column1].[Column1],[Column2].[Column2]",
            measures: "[Measures].[value]"//,[Measures].[UnitPrice]"
        });



/*

        $("#pivotGrid").igPivotGrid({
          // To disable filtering, drag&drop, etc..
          hideRowsDropArea : true,
            hideMeasuresDropArea : true,
            hideFiltersDropArea : true,
            hideColumnsDropArea : true,
            allowSorting: true,
            dataSource: dataSource,
            gridOptions:
            {
                defaultColumnWidth: 80
            },
            width: "1000",
            height: "100%"
        });

        var grid =  $("#pivotGrid").igPivotGrid("grid");
        $(document).delegate("#"+grid.id(), "iggridcellclick", function (evt, ui) {
            alert("Cell Clicked. Cell at row index:"+ ui.rowIndex+"  and column index: "+  (ui.colIndex -1))
        });


        //Set fixed position for the left headers
        $(document).delegate("#pivotGrid", "igpivotgridpivotgridrendered", function (evt, ui) {
            var width=$("#pivotGrid_rows").width();
            $("#pivotGrid_table").find(".ui-iggrid-header").css("width",width);
            $("#pivotGrid_table").find(".ui-iggrid-header").css("position", "fixed");
        });

*/


        $("#pivotGrid").igPivotGrid({
            dataSource: dataSource,
            compactColumnHeaders: false,
            compactRowHeaders: true,
            compactHeaderIndentation: 80,
            isParentInFrontForColumns: true,
            gridOptions: {
                caption: "Compact Layout"
            },
            width: "100%",
            height: "100%"


        });
        var grid=$("#pivotGrid").igPivotGrid("grid");

        $(document).delegate("#"+grid.id(), "iggridcellclick", function (evt, ui) {
            // Only the FIRST ROW column indexes start from 2, it needs to be checked!
            alert("Cell Clicked. Cell at row index:"+ ui.rowIndex+"  and column index: "+  ui.colIndex);
            ui.cellElement.innerText  ="BBB"

        });





    }


    GridDataView.prototype.setPropertiesDatasource = function(){

    }



    GridDataView.prototype.createGrid = function (Configuration, gridModel) {
        var matrixLeft = gridModel["matrixLeft"];
        var matrixAll =  gridModel["matrixAll"];
        var matrixUp =   gridModel["matrixUp"];


        // QUELLA GIUSTA(Vecchia)

        var dataSource = new $.ig.OlapFlatDataSource({
            dataSource: table,
            metadata: {
                cube: {
                    name: "Sales",
                    caption: "Sales",
                    measuresDimension: {
                        caption: "Measures",
                        measures: [ //for each measure, name and aggregator are required
                            { caption: "value", name: "value", aggregator: getItem(4) }

                        ]
                    },
                    dimensions: [ // for each dimension
                        {
                            // For each dimension at least one hierarchy must be defined.
                            caption: "Rows1", name: "Rows1", /*displayFolder: "Folder1\\Folder2",*/ hierarchies: [
                            {
                                caption: "Rows1", name: "Rows1", levels: [

                                {
                                    name: "Rows1", caption: "Rows1",
                                    memberProvider: function (item) {
                                        return item[0];
                                    }
                                }
                            ]
                            }
                        ]
                        },
                        {
                            // For each dimension at least one hierarchy must be defined.
                            caption: "SecondRow", name: "SecondRow", /*displayFolder: "Folder1\\Folder2",*/ hierarchies: [
                            {
                                caption: "SecondRow", name: "SecondRow", levels: [

                                {
                                    name: "SecondRow", caption: "SecondRow",
                                    memberProvider: function (item) {
                                        return item[1];
                                    }
                                }
                            ]
                            }
                        ]
                        },
                        {
                            // For each dimension at least one hierarchy must be defined.
                            caption: "Column1", name: "Column1", /*displayFolder: "Folder1\\Folder2",*/ hierarchies: [
                            {
                                caption: "Column1", name: "Column1", levels: [

                                {
                                    name: "Column1", caption: "Column1",
                                    memberProvider: function (item) {
                                        return item[2];
                                    }
                                }
                            ]
                            }
                        ]
                        },
                        {
                            // For each dimension at least one hierarchy must be defined.
                            caption: "Column2", name: "Column2", /*displayFolder: "Folder1\\Folder2",*/ hierarchies: [
                            {
                                caption: "Column2", name: "Column2", levels: [

                                {
                                    name: "Column2", caption: "Column2",
                                    memberProvider: function (item) {
                                        return item[3];
                                    }
                                }
                            ]
                            }
                        ]
                        }

                    ]
                }
            },

            // Preload hiearhies for the rows, columns, filters and measures
            rows: "[Rows1].[Rows1],[Rows2].[Rows2]",
            columns: "[Column1].[Column1],[Column2].[Column2]",
            measures: "[Measures].[value]"//,[Measures].[UnitPrice]"
        });


    }


    GridDataView.prototype.createLeftPivotDimension = function(keyColumns,keyColumnConf){

        var that = this;
        titlesLeft = [];
        var keysLeft = [];
        titlesLeft.push( keyColumns["leftColumns"][0].domain.title.EN)
            var label = keyColumnConf["lefKeyColumnConfiguration"][0].properties.cellProperties.label
            var key = {
                caption :     keyColumns["leftColumns"][0].domain.title.EN,
                name    :     keyColumns["leftColumns"][0].domain.title.EN,
                levels  :    [
                    {
                        name:    keyColumns["leftColumns"][0].domain.supplemental.EN,
                        caption: keyColumns["leftColumns"][0].domain.title.EN,
                        /*memberProvider: function (item) {
                            var result;
                            //   /\$\w+/  trova la prima $label

                            var label = keyColumnConf["lefKeyColumnConfiguration"][0].properties.cellProperties.label

                            // start from array[1]
                            var array =label.match(/(\$\w+)(\s)(\W+)(\s*)(\$\w+)(\s*)(\W+)+/);
                            result = "";
                            for(var i = 1; i<array.length; i++){
                                if(array[i].substring(0,1) == "$"){
                                    var value= array[i].substring(1)
                                    result += (value == "value")? item[keyColumns["leftKeyIndexes"][0]]: item[accessorMap[value]];
                                } else{
                                    result += array[i];
                                }
                            }
                            return result;
                            }*/
                        memberProvider : function(item){
                            return that.evaluateRegExpression(item, 0, keyColumnConf["lefKeyColumnConfiguration"][0], keyColumns["leftKeyIndexes"])
                        }

                    }
                ]
            }
        keysLeft.push(key);
        if(keyColumns["leftColumns"].length >1){
            titlesLeft.push(keyColumns["leftColumns"][1].domain.title.EN)
            var key2 = {
                caption :    keyColumns["leftColumns"][1].domain.title.EN,
                name    :    keyColumns["leftColumns"][1].domain.title.EN,
                levels  :    [
                    {
                        name:    keyColumns["leftColumns"][1].domain.supplemental.EN,
                        caption: keyColumns["leftColumns"][1].domain.title.EN,
                        memberProvider: function (item) {
                            debugger;

                            return that.evaluateRegExpression(item, 1, keyColumnConf["lefKeyColumnConfiguration"][0], keyColumns["leftKeyIndexes"])                        }
                    }
                ]
            }
            keysLeft.push(key2);
        }
        return keysLeft;
    }

    GridDataView.prototype.evaluateRegExpression = function(item, num, configuration, keyIndexes){
        var result;
        //   /\$\w+/  trova la prima $label

        var label = configuration.properties.cellProperties.label

        // start from array[1]
        var array;
        debugger;
        if (label == "$value") {
            array = label.match(/(\$\w+)/);

        }else{
            array = label.match(/(\$\w+)(\s)(\W+)(\s*)(\$\w+)(\s*)(\W+)+/);
        }
        console.log(array)
        result = "";
        for(var i = 1; i<array.length; i++){
            if(array[i].substring(0,1) == "$"){
                var value= array[i].substring(1)
                result += (value == "value")? item[keyIndexes[num]]: item[accessorMap[value]];
            } else{
                result += array[i];
            }
        }
        return result;
    }


    GridDataView.prototype.createMeasureDimension = function(fullModel){

        var indexValue = fullModel["valueColumnsModel"];
        var accessorModel = fullModel["accessorColumnsModel"]
        var measures = [];

        var key = {

        }


        return measuresDimension;
    }


    GridDataView.prototype.createUpPivotDimension = function(keyColumns,keyColumnConf){

        var that = this;
        titlesUp = []
        titlesUp.push( keyColumns["upColumns"][0].domain.title.EN);

        var keysUp = [];
            var key = {
                caption :     keyColumns["upColumns"][0].domain.title.EN,
                name    :     keyColumns["upColumns"][0].domain.title.EN,
                levels  :    [
                    {
                        name:    keyColumns["upColumns"][0].domain.supplemental.EN,
                        caption: keyColumns["upColumns"][0].domain.title.EN,
                        memberProvider: function (item) {
                            return that.evaluateRegExpression(item, 0, keyColumnConf["upKeyColumnConfiguration"][0], keyColumns["upKeyIndexes"])
                        }
                    }
                ]}
            keysUp.push(key);
            if( keyColumns["upColumns"].length >1){
                titlesUp.push(keyColumns["upColumns"][1].domain.title.EN)
                var key2 = {
                    caption :    keyColumns["upColumns"][1].domain.title.EN,
                    name    :    keyColumns["upColumns"][1].domain.title.EN,
                    levels  :    [
                        {
                            name:    keyColumns["upColumns"][1].domain.supplemental.EN,
                            caption: keyColumns["upColumns"][1].domain.title.EN,
                            memberProvider: function (item) {
                                return that.evaluateRegExpression(item, 1, keyColumnConf["upKeyColumnConfiguration"][1], keyColumns["upKeyIndexes"])
                            }
                        }
                    ]}
                keysUp.push(key2);
            }
        return keysUp;
    }


    GridDataView.prototype.onChangeCellValue = function () {
        //TODO
    }


    GridDataView.prototype.onAddRow = function () {
        //TODO (V2.0)
    }


    GridDataView.prototype.onDeleteRow = function () {
        //TODO (V2.0)
    }


    GridDataView.prototype.onAddColumn = function () {
        //TODO (V2.0)
    }


    GridDataView.prototype.onRemoveColumn = function () {
        //TODO (V2.0)
    }


    return GridDataView;

})
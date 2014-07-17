/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery" , "infragistics"], function ($, pivot) {

    var model, configuration, table, Configurator

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

        var leftDimensions =    this.createLeftPivotDimension(fullModel["leftColumnsModel"], configurationKeys);
        var upDimensions =      this.createUpPivotDimension(fullModel["upColumnsModel"], configurationKeys);
    //  var measuresDimension = this.createMeasureDimension(fullModel["valueColumnsModel"], fullModel["accessorColumnsModel"])

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
            rows: "[Rows].[Row0],[Rows].[Row1]",
            columns: "[Columns].[Column0],[Columns].[Column1]",
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
            height: "100%",
            width: "100%",
            gridOptions:
            {
                defaultColumnWidth: 80
            }
        });
        var grid=$("#pivotGrid").igPivotGrid("grid");

        $(document).delegate("#"+grid.id(), "iggridcellclick", function (evt, ui) {
            // Only the FIRST ROW column indexes start from 2, it needs to be checked!
            alert("Cell Clicked. Cell at row index:"+ ui.rowIndex+"  and column index: "+  ui.colIndex);
            ui.cellElement.innerText  ="BBB"

        });

        //Set fixed position for the left headers
     /*  $(document).delegate("#pivotGrid", "igpivotgridpivotgridrendered", function (evt, ui) {
            var width=$("#pivotGrid_rows").width();
            $("#pivotGrid_table").find(".ui-iggrid-header").css("width",width);
            $("#pivotGrid_table").find(".ui-iggrid-header").css("position", "fixed");
        });*/



    }


    GridDataView.prototype.setPropertiesDatasource = function(){

    }



    GridDataView.prototype.createGrid = function (Configuration, gridModel) {
        var matrixLeft = gridModel["matrixLeft"];
        var matrixAll = gridModel["matrixAll"];
        var matrixUp = gridModel["matrixUp"];


        // QUELLA GIUSTA(Vecchia)
        /*
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
                            caption: "Rows", name: "Rows", /*displayFolder: "Folder1\\Folder2", hierarchies: [
                            {
                                caption: "ciao", name: "ciao", levels:
                                [

                                    {
                                        name: "FirstRow", caption: "FirstRow",
                                        memberProvider: function (item) {
                                            return item[0];
                                        }
                                    }
                                ]
                            },
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
                            caption: "Columns", name: "Columns", displayFolder: "Folder1\\Folder2", hierarchies: [
                            {
                                caption: "FirstUp", name: "FirstUp", levels: [

                                {
                                    name: "FirstUp", caption: "FirstUp",
                                    memberProvider: function (item) {
                                        return item[2];
                                    }
                                }

                            ]
                            },
                            {
                                caption: "SecondUp", name: "SecondUp", levels: [
                                {
                                    name: "SecondUp", caption: "SecondUp",
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
            rows: "[Rows].[ciao],[Rows].[SecondRow]",
            columns: "[Columns].[FirstUp],[Columns].[SecondUp]",
            measures: "[Measures].[value]"//,[Measures].[UnitPrice]"
        });
*/

    }


    GridDataView.prototype.createLeftPivotDimension = function(keyColumns,keyColumnConf){

        var titlesLeft = [];
        var keysLeft = [];
        titlesLeft.push(keyColumns["leftColumns"][0].title)
            var label = keyColumnConf["lefKeyColumnConfiguration"][0].properties.cellProperties.label
            var key = {
                caption :    "Row"+0,
                name    :    keyColumns["leftColumns"][0].title,
                levels  :    [
                    {
                        name:    keyColumns["leftColumns"][0].domain.supplemental.EN,
                        caption: keyColumns["leftColumns"][0].domain.title.EN,
                        memberProvider: function (item) {
                            return item[keyColumns["leftKeyIndexes"][0]]
                            }
                    }
                ]
            }
        keysLeft.push(key);
        if(keyColumns["leftColumns"].length >1){
            titlesLeft.push(keyColumns["leftColumns"][1].title)
            var key2 = {
                caption :    "Row"+1,
                name    :    keyColumns["leftColumns"][1].title,
                levels  :    [
                    {
                        name:    keyColumns["leftColumns"][1].domain.supplemental.EN,
                        caption: keyColumns["leftColumns"][1].domain.title.EN,
                        memberProvider: function (item) {
                            return item[keyColumns["leftKeyIndexes"][1]]
                        }
                    }
                ]
            }
            keysLeft.push(key2);
        }
        return keysLeft;
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

        var titlesUp = []

        titlesUp.push(keyColumns["upColumns"][0].title);

        var keysUp = [];
            var key = {
                caption :    "Column"+0,
                name    :    keyColumns["upColumns"][0].title,
                levels  :    [
                    {
                        name:    keyColumns["upColumns"][0].domain.supplemental.EN,
                        caption: keyColumns["upColumns"][0].domain.title.EN,
                        memberProvider: function (item) {
                            return item[keyColumns["upKeyIndexes"][0]]
                        }
                    }
                ]}
            keysUp.push(key);
            if( keyColumns["upColumns"].length >1){
                titlesUp.push(keyColumns["upColumns"][0].title)
                var key2 = {
                    caption :    "Column"+1,
                    name    :    keyColumns["upColumns"][1].title,
                    levels  :    [
                        {
                            name:    keyColumns["upColumns"][1].domain.supplemental.EN,
                            caption: keyColumns["upColumns"][1].domain.title.EN,
                            memberProvider: function (item) {
                                return item[keyColumns["upKeyIndexes"][1]]
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
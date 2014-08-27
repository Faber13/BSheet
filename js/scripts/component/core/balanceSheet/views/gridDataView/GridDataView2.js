/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery" , "views/modelView/ViewModel", "webix","pivot"], function ($, ViewModel) {

    var model, table, Configurator, titlesUp, titlesLeft, accessorMap, fullModel, configurationKeys, indexValues, modelView,
        leftDimensions, upDimensions, valueColumn, dataSource2, idOlapGrid, language, viewModel

    function GridDataView2() {

    }


    GridDataView2.prototype.init = function (tableModel, configurator) {

        viewModel = new ViewModel;
        table = tableModel;
        Configurator = configurator;
        language = Configurator.getComponentLanguage();
        this.createFullGrid();
    }


    GridDataView2.prototype.createFullGrid = function () {

        fullModel = Configurator.getAllColumnModels();
        configurationKeys = Configurator.getKeyColumnConfiguration();
        accessorMap = Configurator.getAccessorMap();
        leftDimensions = this.createLeftPivotDimension(fullModel["leftColumnsModel"], configurationKeys["lefKeyColumnConfiguration"]);
        upDimensions = this.createUpPivotDimension(fullModel["upColumnsModel"], configurationKeys["upKeyColumnConfiguration"]);
        valueColumn = Configurator.getValueColumnConfiguration();
        indexValues = Configurator.getValueIndex();
        idOlapGrid = Configurator.getIdOlapGrid();
        modelView = viewModel.init(table, Configurator)
        this.renderGrid(modelView)
    }


    GridDataView2.prototype.renderGrid = function (model) {

        getValue = function (valueInd) {
            var result;
            return function (items, cellMetadata) {

                $.each(items, function (index, item) {
                    result = item[valueInd];
                });
                return result;
            };
        };

        var data345 = [
            ["2012", "February", "Russia", "Summer", 4],
            ["2012", "February", "Russia", "Winter", 3],
            ["2012", "February", "England", "Summer", 5],
            ["2012", "February", "England", "Winter", "6fe"]
        ]
        var pivot = webix.ui.pivot


        grida = new webix.ui({
            container: "pivotGrid",
            id: "pivot",
            view: "pivot",
            height: 400,
            width: 1000,
            datatype: "jsarray",
            data: model,
            structure: {
                rows:[
                   "data0", "data1"
                    ]                        ,
                columns: ["data2", "data3"],
                values: []
            }

        });

        var datatable = $$("pivot").$$("data");

        //attach event to selection
        datatable.attachEvent("onAfterSelect", function(id){
            webix.message("selected row: "+id);
            var record = datatable.getItem(id);
            record["Egypt_'_spring"] = "<img src='http://www.imginternet.com/imgpub/img7787_0_0.gif'>ciao</img>";
            var columnConfig = datatable.getColumnConfig("Egypt_'_spring")
        });

        // cells
        var values = [];

        var array = document.getElementsByClassName("webix_ss_center_scroll")[1].childNodes;

        for (var i = 0; i < 9; i++) {
            model.push(["", "", "", "", "", "", "", undefined])
        }

        /*
         for(var j =0; j<array[0].childNodes.length; j++){
         for(var i=0; i<array.length; i++) {
         debugger;
         var div = array[i].childNodes[j]
         var indexTable = (j==0)? i: i+(j*array.length);
         div.innerHTML = model[indexTable][indexValues];
         }
         }*/

        // ------------------------------------------
        // REGUlar expression with columnId
        //
        //          /((\w+)(\_'_))/
        // ------------------------------------------

    }


    GridDataView2.prototype.updateGridView = function (newCell, indexCell) {

        var cellTransformed = viewModel.updateItem(newCell)
        modelView[indexCell] = cellTransformed;
        dataSource2 = new $.ig.OlapFlatDataSource({
            dataSource: modelView,
            metadata: {
                cube: {
                    name: "Sales",
                    caption: "Sales",
                    measuresDimension: {
                        caption: "Measures",
                        measures: [ //for each measure, name and aggregator are required
                            { caption: "value", name: "value", aggregator: getValue(indexValues) }
                        ]
                    },
                    dimensions: [ // for each dimension
                        {
                            // For each dimension at least one hierarchy must be defined.
                            caption: "Rows", name: "Rows", hierarchies: leftDimensions
                        },
                        {
                            caption: "Columns", name: "Columns", displayFolder: "Folder1\\Folder2", hierarchies: upDimensions
                        }
                    ]

                }
            },
            // Preload hiearhies for the rows, columns, filters and measures
            rows: "[Rows].[" + titlesLeft[0] + "],[Rows].[" + titlesLeft[1] + "]",
            columns: "[Columns].[" + titlesUp[0] + "],[Columns].[" + titlesUp[1] + "]",
            measures: "[Measures].[value]"

        });

        $("#pivotGrid").igPivotGrid("option", "dataSource", dataSource2)

    }


    GridDataView2.prototype.setPropertiesDatasource = function () {

        var result = {};
        result["rows"] = "[Rows].[" + titlesLeft[0] + "]";
        if (titlesLeft.length > 1) {
            result["rows"] += ",[Rows].[" + titlesLeft[1] + "]";
        }
        result["Columns"] = "[Columns].[" + titlesUp[0] + "]";
        if (titlesLeft.length > 1) {
            result["Columns"] += ",[Columns].[" + titlesUp[1] + "]";
        }
        result["Measures"] = "[Measures].[value]"

        return result;
    }


    GridDataView2.prototype.createLeftPivotDimension = function (keyColumns, keyColumnConf) {

        var that = this;
        titlesLeft = [];
        var keysLeft = [];
        var that = this;
        titlesLeft.push(keyColumns["leftColumns"][0].domain.title[language])
        var key = {
            caption: keyColumns["leftColumns"][0].domain.title[language],
            name: keyColumns["leftColumns"][0].domain.title[language],
            levels: [
                {
                    name: keyColumns["leftColumns"][0].domain.supplemental[language],
                    caption: keyColumns["leftColumns"][0].domain.title[language],
                    memberProvider: function (item) {
                        return item[keyColumns["leftKeyIndexes"][0]];
                    }

                }
            ]
        }
        keysLeft.push(key);
        if (keyColumns["leftColumns"].length > 1) {
            titlesLeft.push(keyColumns["leftColumns"][1].domain.title[language])
            var key2 = {
                caption: keyColumns["leftColumns"][1].domain.title[language],
                name: keyColumns["leftColumns"][1].domain.title[language],
                levels: [
                    {
                        name: keyColumns["leftColumns"][1].domain.supplemental[language],
                        caption: keyColumns["leftColumns"][1].domain.title[language],
                        memberProvider: function (item) {
                            return item[keyColumns["leftKeyIndexes"][1]];
                        }
                    }
                ]
            }
            keysLeft.push(key2);
        }
        return keysLeft;
    }


    GridDataView2.prototype.createUpPivotDimension = function (keyColumns, keyColumnConf) {

        var that = this;
        titlesUp = []
        titlesUp.push(keyColumns["upColumns"][0].domain.title[language]);

        var keysUp = [];
        var key = {
            caption: keyColumns["upColumns"][0].domain.title[language],
            name: keyColumns["upColumns"][0].domain.title[language],
            levels: [
                {
                    name: keyColumns["upColumns"][0].domain.supplemental[language],
                    caption: keyColumns["upColumns"][0].domain.title[language],
                    memberProvider: function (item) {
                        return item[keyColumns["upKeyIndexes"][0]];
                    }
                }
            ]}
        keysUp.push(key);
        if (keyColumns["upColumns"].length > 1) {
            titlesUp.push(keyColumns["upColumns"][1].domain.title[language])
            var key2 = {
                caption: keyColumns["upColumns"][1].domain.title[language],
                name: keyColumns["upColumns"][1].domain.title[language],
                levels: [
                    {
                        name: keyColumns["upColumns"][1].domain.supplemental[language],
                        caption: keyColumns["upColumns"][1].domain.title[language],
                        memberProvider: function (item) {
                            return item[keyColumns["upKeyIndexes"][1]];
                        }                    }
                ]}
            keysUp.push(key2);
        }
        return keysUp;
    }


    GridDataView2.prototype.renderFormatDate = function (value, configurationKeyColumn, datatype) {

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
        }
        return result;

    }


    GridDataView2.prototype.onChangeCellValue = function (datasource) {
        //TODO
    }


    GridDataView2.prototype.onAddRow = function () {
        //TODO (V2.0)
    }


    GridDataView2.prototype.onDeleteRow = function () {
        //TODO (V2.0)
    }


    GridDataView2.prototype.onAddColumn = function () {
        //TODO (V2.0)
    }


    GridDataView2.prototype.onRemoveColumn = function () {
        //TODO (V2.0)
    }

    return GridDataView2;

})
/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery" , "infragistics", "views/modelView/ViewModel"], function ($, pivot, ViewModel) {

    var model, table, Configurator, titlesUp, titlesLeft, accessorMap, fullModel, configurationKeys, indexValues, modelView,
    leftDimensions, upDimensions, valueColumn, dataSource2, idOlapGrid, language, viewModel
    function GridDataView() {

    }


    GridDataView.prototype.init = function ( tableModel, configurator) {

       viewModel = new ViewModel;
       table = tableModel;
       Configurator = configurator;
       language = Configurator.getComponentLanguage();
       this.createFullGrid();
    }


    GridDataView.prototype.createFullGrid = function () {

        fullModel =         Configurator.getAllColumnModels();
        configurationKeys = Configurator.getKeyColumnConfiguration();
        accessorMap =       Configurator.getAccessorMap();
        leftDimensions =    this.createLeftPivotDimension(fullModel["leftColumnsModel"], configurationKeys["lefKeyColumnConfiguration"]);
        upDimensions =      this.createUpPivotDimension(fullModel["upColumnsModel"], configurationKeys["upKeyColumnConfiguration"]);
        valueColumn  =      Configurator.getValueColumnConfiguration();
        indexValues =       Configurator.getValueIndex();
        idOlapGrid  =       Configurator.getIdOlapGrid();
        modelView = viewModel.init(table,Configurator)
        // modelView = this.createViewModel(table);
        this.renderGrid(modelView)
    }


    GridDataView.prototype.renderGrid = function(model){

        getValue = function (valueInd) {
            var result;
            return function (items, cellMetadata) {

                $.each(items, function (index, item) {
                    result = item[valueInd];
                });
                return result;
            };
        };


        dataSource2 = new $.ig.OlapFlatDataSource({
            dataSource: model,
            metadata: {
                cube: {
                    name: "Sales",
                    caption: "Sales",
                    measuresDimension: {
                        caption: "Measures",
                        measures: [ //for each measure, name and aggregator are required
                            { caption: "value", name: "value", aggregator:  getValue(indexValues) }
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

        $("#"+idOlapGrid).igPivotGrid({
            allowSorting: true,
            allowHeaderRowsSorting: true,
            allowHeaderColumnsSorting: true,
            firstSortDirection: "ascending",
            firstLevelSortDirection: "ascending",
            fixedHeaders: true,
            dataSource: dataSource2,
            compactColumnHeaders: false,
            compactRowHeaders: true,
            compactHeaderIndentation: 80,
            isParentInFrontForColumns: true,
            disableFiltersDropArea : true,
            hideFiltersDropArea : true,
            gridOptions:{
                defaultColumnWidth: 150,
                features: [
                    {
                        name: "Selection",
                        mode: "cell"
                    },
                    {
                        name: "Tooltips",
                        visibility: "always"
                    }
                ]
            },
            width: "100%",
            height: "100%"
        });
        console.log("After rendering all grid!!")
    }


    GridDataView.prototype.updateGridView = function(newCell, indexCell){

        debugger;

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
                            { caption: "value", name: "value", aggregator:  getValue(indexValues) }
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


    GridDataView.prototype.setPropertiesDatasource = function () {

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


    GridDataView.prototype.createLeftPivotDimension = function (keyColumns, keyColumnConf) {

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
                    memberProvider: function (item) { return item[keyColumns["leftKeyIndexes"][0]]; }

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
                        memberProvider: function (item) { return item[keyColumns["leftKeyIndexes"][1]]; }
                    }
                ]
            }
            keysLeft.push(key2);
        }
        return keysLeft;
    }




    GridDataView.prototype.createUpPivotDimension = function (keyColumns, keyColumnConf) {

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
                    memberProvider: function (item) { return item[keyColumns["upKeyIndexes"][0]]; }
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
                        memberProvider: function (item) { return item[keyColumns["upKeyIndexes"][1]]; }                    }
                ]}
            keysUp.push(key2);
        }
        return keysUp;
    }


    GridDataView.prototype.renderFormatDate = function(value, configurationKeyColumn, datatype){

        var result;
        switch (datatype[0]){
            case "time":
                var date = new Date(value);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "month":
                var year  =  value.substr(0, 4);
                var month =  value.substr(4,2);
                var date  =  new Date(year,month-1);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "year":
                var year  =  value.substr(0, 4);
                var date  =  new Date(year);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "date":
                var year  =  value.substr(0, 4);
                var month =  value.substr(4,2);
                var day   =  value.substr(6,2);
                var date  =  new Date(year,month-1,day);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)

                break;
        }
        return result;

    }


    GridDataView.prototype.onChangeCellValue = function (datasource) {
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
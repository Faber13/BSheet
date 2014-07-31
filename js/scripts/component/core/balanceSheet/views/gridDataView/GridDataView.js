/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery" , "infragistics", "moment"], function ($, pivot, moment) {

    var model, configuration, table, Configurator, titlesUp, titlesLeft, accessorMap

    function GridDataView() {

    }


    GridDataView.prototype.init = function (Configuration, gridModel, tableModel, configurator, typeOfCreation) {

        console.log("GridDataView")
        console.log(Configuration)
        console.log(tableModel)
        model = gridModel;
        table = tableModel;
        configuration = Configuration;
        Configurator = configurator;

        (typeOfCreation) ? this.createFullGrid(Configuration, gridModel) : this.createGrid(Configuration, gridModel);
    }


    GridDataView.prototype.createFullGrid = function () {

        var fullModel =         Configurator.getAllColumnModels();
        var configurationKeys = Configurator.getKeyColumnConfiguration();
        accessorMap =           Configurator.getAccessorMap();
        var leftDimensions =    this.createLeftPivotDimension(fullModel["leftColumnsModel"], configurationKeys["lefKeyColumnConfiguration"]);
        var upDimensions =      this.createUpPivotDimension(fullModel["upColumnsModel"], configurationKeys["upKeyColumnConfiguration"]);
        var valueColumn  =      Configurator.getValueColumnConfiguration();
        var indexValues =       Configurator.getValueIndex();
        var idOlapGrid  =       Configurator.getIdOlapGrid();

        var dataSource = new $.ig.OlapFlatDataSource({
            dataSource: table,
            metadata: {
                cube: {
                    name: "Sales",
                    caption: "Sales",
                    measuresDimension: {
                        caption: "Measures",
                        measures: [ //for each measure, name and aggregator are required
                            { caption: "value", name: "value", aggregator:  this.expressionLanguage(valueColumn,indexValues) }
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
            dataSource: dataSource,
            compactColumnHeaders: false,
            compactRowHeaders: true,
            compactHeaderIndentation: 80,
            isParentInFrontForColumns: true,
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
                    },
                ]
            },

            width: "100%",
            height: "100%"


        });

    }


    GridDataView.prototype.expressionLanguage = function(columnValue, indexValue){

        var conditionRegExpression = /(#(\w+)(\|))/;
        var valuesRegExpression    = /(((\W)|(\s))*(\$\w+)((\W)|(\s))*(\~))/;
        var onlyValue              = /(\$\w+)/;

        return function (items, cellMetadata) {
            var result = "";
            $.each(items, function (index, item) {
                var expression = columnValue.label;
                while(expression != "" && expression != "|") {
                    var firstCondition = expression.match(conditionRegExpression)[0]
                    expression = expression.replace(conditionRegExpression, "")
                    firstCondition = firstCondition.slice(0, -1);
                    if (firstCondition.substring(1) == "value" ) {
                        if (typeof item[indexValue] !== 'undefined') {
                            var secondCondition = expression.match(valuesRegExpression)[0];
                            expression = expression.replace(valuesRegExpression, "")
                            secondCondition = secondCondition.slice(0, -1);
                            var stringAppend = secondCondition.replace(onlyValue, function (match) {
                                var returnedValue;
                                returnedValue = (match.substring(1) == "value") ? item[indexValue] : item[accessorMap[match.substring(1)]];
                                return returnedValue;
                            })
                            result += stringAppend;
                        }
                        else {
                            break;
                        }
                    }
                    else if(typeof item[accessorMap[firstCondition.substring(1)]] !== 'undefined') {
                        var secondCondition = expression.match(valuesRegExpression)[0];
                        expression = expression.replace(valuesRegExpression, "")
                        secondCondition = secondCondition.slice(0, -1);
                        var stringAppend = secondCondition.replace(onlyValue, function (match) {
                            var returnedValue;
                            returnedValue = (match.substring(1) == "value") ? item[indexValue] : item[accessorMap[match.substring(1)]];
                            return returnedValue;
                        })
                        result += stringAppend;
                    }
                }
            })
            return result;
        }
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
        titlesLeft.push(keyColumns["leftColumns"][0].domain.title.EN)
        var key = {
            caption: keyColumns["leftColumns"][0].domain.title.EN,
            name: keyColumns["leftColumns"][0].domain.title.EN,
            levels: [
                {
                    name: keyColumns["leftColumns"][0].domain.supplemental.EN,
                    caption: keyColumns["leftColumns"][0].domain.title.EN,
                    memberProvider: function (item) {
                        var result;
                        var datatype = keyColumns["leftColumns"][0].dataTypes;
                        if(datatype == "date" || datatype == "time" || datatype == "month" || datatype == "year"){
                            result = that.renderFormatDate(item[keyColumns["leftKeyIndexes"][0]], keyColumnConf[0], datatype)
                        }else{
                            result = item[keyColumns["leftKeyIndexes"][0]]
                        }
                        return  result;
                    }

                }
            ]
        }
        keysLeft.push(key);
        if (keyColumns["leftColumns"].length > 1) {
            titlesLeft.push(keyColumns["leftColumns"][1].domain.title.EN)
            var key2 = {
                caption: keyColumns["leftColumns"][1].domain.title.EN,
                name: keyColumns["leftColumns"][1].domain.title.EN,
                levels: [
                    {
                        name: keyColumns["leftColumns"][1].domain.supplemental.EN,
                        caption: keyColumns["leftColumns"][1].domain.title.EN,
                        memberProvider: function (item) {
                            var result;
                            var datatype = keyColumns["leftColumns"][1].dataTypes;
                            if(datatype == "date" || datatype == "time" || datatype == "month" || datatype == "year"){
                                result = that.renderFormatDate(item[keyColumns["leftKeyIndexes"][1]], keyColumnConf[1], datatype)
                            }else{
                                result = item[keyColumns["leftKeyIndexes"][1]]
                            }
                            return  result;
                        }
                    }
                ]
            }
            keysLeft.push(key2);
        }
        return keysLeft;
    }


    GridDataView.prototype.createMeasureDimension = function (fullModel) {

        var result = {};
        var result1 = { caption: "value", name: "value", aggregator: getItem(4) }
        var indexValue = fullModel["valueColumnsModel"];
        var accessorModel = fullModel["accessorColumnsModel"]
        var measures = [];


        return measuresDimension;
    }


    GridDataView.prototype.createUpPivotDimension = function (keyColumns, keyColumnConf) {

        var that = this;
        titlesUp = []
        titlesUp.push(keyColumns["upColumns"][0].domain.title.EN);

        var keysUp = [];
        var key = {
            caption: keyColumns["upColumns"][0].domain.title.EN,
            name: keyColumns["upColumns"][0].domain.title.EN,
            levels: [
                {
                    name: keyColumns["upColumns"][0].domain.supplemental.EN,
                    caption: keyColumns["upColumns"][0].domain.title.EN,
                    memberProvider: function (item) {
                        var result;
                        var datatype = keyColumns["upColumns"][0].dataTypes;
                        if(datatype == "date" || datatype == "time" || datatype == "month" || datatype == "year"){
                            result = that.renderFormatDate(item[keyColumns["upKeyIndexes"][0]], keyColumnConf[0], datatype)
                        }else{
                            result = item[keyColumns["upKeyIndexes"][0]]
                        }
                        return  result;
                    }
                }
            ]}
        keysUp.push(key);
        if (keyColumns["upColumns"].length > 1) {
            titlesUp.push(keyColumns["upColumns"][1].domain.title.EN)
            var key2 = {
                caption: keyColumns["upColumns"][1].domain.title.EN,
                name: keyColumns["upColumns"][1].domain.title.EN,
                levels: [
                    {
                        name: keyColumns["upColumns"][1].domain.supplemental.EN,
                        caption: keyColumns["upColumns"][1].domain.title.EN,
                        memberProvider: function (item) {
                            var result;
                            var datatype = keyColumns["upColumns"][1].dataTypes;
                            if(datatype == "date" || datatype == "time" || datatype == "month" || datatype == "year"){
                                result = that.renderFormatDate(item[keyColumns["upKeyIndexes"][1]], keyColumnConf[1], datatype)
                            }else{
                                result = item[keyColumns["upKeyIndexes"][1]]
                            }
                            return  result;
                        }
                    }
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
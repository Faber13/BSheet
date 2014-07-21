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

        debugger;


        $("#pivotGrid").igPivotGrid({
            dataSource: dataSource,
            compactColumnHeaders: false,
            compactRowHeaders: true,
            compactHeaderIndentation: 80,
            isParentInFrontForColumns: true,
            gridOptions: {
                caption: "Compact Layout",
                defaultColumnWidth: 150

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

        var result = {};
        result["rows"] = "[Rows].["+titlesLeft[0]+"]";
        if(titlesLeft.length >1){
            result["rows"] += ",[Rows].["+titlesLeft[1]+"]";
        }
        result["Columns"] = "[Columns].["+titlesUp[0]+"]";
        if(titlesLeft.length >1){
            result["Columns"] += ",[Columns].["+titlesUp[1]+"]";
        }

        result["Measures"] =   "[Measures].[value]"

        return result;

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
                        memberProvider : function(item){
                            var plus;
                            var r = item[5]
                                if(r){
                                    plus = r;
                                }
                                else{
                                    plus = "";
                                }
                            return item[0] + plus

                            // return that.evaluateRegExpression(item, 0, keyColumnConf["lefKeyColumnConfiguration"][0], keyColumns["leftKeyIndexes"])
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
                            return that.evaluateRegExpression2(item, 1, keyColumnConf["lefKeyColumnConfiguration"][0], keyColumns["leftKeyIndexes"])
                        }
                    }
                ]
            }
            keysLeft.push(key2);
        }
        return keysLeft;
    }

    GridDataView.prototype.evaluateRegExpression2 = function(item, num, configuration, keyIndexes){
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


    GridDataView.prototype.evaluateRegExpression = function(item, num, configuration, keyIndexes){
        var result;
        //   /\$\w+/  trova la prima $label

        var label = configuration.properties.cellProperties.label

        // start from array[1]
        var array;

        debugger;
        /*var result = label.replace(/(\$\w+)/g, function(firstParameter){
            if (firstParameter == "$value") {
                console.log(firstParameter + "VALUEEE");
                console.log(item[keyIndexes[num]])
              return  item[keyIndexes[num]]
            }else{
                debugger;
                console.log(firstParameter + "ELSEE");
                console.log(accessorMap)
                console.log(item[accessorMap[firstParameter.substring(1)]])
               return item[accessorMap[firstParameter.substring(1)]]
            }
        })
        console.log("-------------------")

        console.log(result)
        console.log("-------------------")

        */debugger;
        console.log("label!!")
        console.log(label)
        if (label == "$value") {
            array = label.match(/(\$\w+)/);

        }else{
            array = label.match(/(\$\w+)(\s)(\W+)(\s*)(\$\w+)(\s*)(\W+)+/);
        }
       // console.log(array)
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

        var result = {};
       var result1 = { caption: "value", name: "value", aggregator: getItem(4) }
        var indexValue = fullModel["valueColumnsModel"];
        var accessorModel = fullModel["accessorColumnsModel"]
        var measures = [];




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
/**
 * Created by fabrizio on 6/26/14.
 */

define(["jquery", "models/tableDataModel/TableDataModel",
    "models/gridDataModel/GridDataModel", "view/GridDataView", "configurator/Configurator"],
    function($, TableDataModel, GridDataModel, GridDataView, Configurator) {

        var urlDSD = "./js/scripts/component/core/balanceSheet/configuration/dsd/dsdStructure.json"

        var urlComponent = "./js/scripts/component/core/balanceSheet/configuration/component/componentConfiguration.json"

        var tableDataModel, gridDataModel, data, dsd, componentConfiguration, configurator, indexes;

        data =
            [
                [ "Production","Maize" , "Egypt", "summer", 1000, "Kg"],
                [ "Production","Rice" , "Egypt", "summer", 22, "T"],
                [ "Production","Wheat" , "Egypt", "summer", 123123, "T"],
                [ "Production","Maize" , "Egypt", "winter", 22, "T"],
                ["AreaHarvested","Rice" , "Russia", "winter", 2222, "Kg"],
                ["Production","Wheat" , "Egypt", "winter", 345435345, "T"],
                [ "Production","Rice" , "Egypt", "winter", 1111313, "T"]
            ]



    console.log(data)


    var creationGridType = false



    function BalanceSheet (){
        tableDataModel = new TableDataModel;
        gridDataModel  = new GridDataModel;
        configurator   = new Configurator;

    }

    // BalanceSheet.prototype.init(data

    BalanceSheet.prototype.init = function(){
        $.ajax({
            async: false,
            type: 'GET',
            url: urlDSD,
            success: function (data) {
                dsd = data;
            }
        })

        console.log("Qui")
        $.ajax({
            async: false,
            type: 'GET',
            url: urlComponent,
            success: function (data) {
                componentConfiguration = data;
            }
        })

        configurator.init(dsd,componentConfiguration)

        var model = this.setTableData(data)
        console.log(model)

        var gridModel = this.setGridData(model);

        var gridView = new GridDataView;
        var tableModel = gridDataModel.createTableModel(indexes,gridModel, false);
        // true => every column has visualization type = full
        gridView.init(componentConfiguration,gridModel, tableModel, configurator, true)

    }


    BalanceSheet.prototype.setTableData = function(TableData){
        // TODO

        console.log("BalanceSheet.setTableData")
        var tableModel = tableDataModel.init(TableData, dsd, componentConfiguration, configurator);
        console.log("TableModel.init() - result")
        console.log(tableModel)
        return tableModel;


    }


    BalanceSheet.prototype.setGridData = function(model){

        indexes = configurator.getAllColumnModels();

        return (gridDataModel.init(dsd, model, data, indexes));

    }


    BalanceSheet.prototype.addRow = function(row){
        // TODO
    }

    BalanceSheet.prototype.deleteRow = function(idRow){
        // TODO
    }

    BalanceSheet.prototype.addColumn = function(column){
        // TODO
    }

    BalanceSheet.prototype.removeColumn = function(idColumn){
        // TODO
    }



    return BalanceSheet;

})
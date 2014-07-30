/**
 * Created by fabrizio on 6/26/14.
 */

define(["jquery", "configurator/Configurator", "modelController/ModelsController",
        "generalController/GeneralController"],
    function ($, Configurator, ModelController, GeneralController) {

        var urlDSD = "./js/scripts/component/core/balanceSheet/configuration/dsd/dsdStructure2.json"

        var urlComponent = "./js/scripts/component/core/balanceSheet/configuration/component/componentConfiguration2.json"

        var tableDataModel, gridDataModel, data, dsd, componentConfiguration,
            configurator, indexes, generalController, modelController;

        data =
            [
                [ "Production", "Maize" , "Egypt", "summer", 1000, "Kg"],
                [ "Production", "Rice" , "Egypt", "summer", 22, "T"],
                [ "Production", "Wheat" , "Egypt", "summer", 123123, "T"],
                [ "Production", "Maize" , "Egypt", "winter", 22, "T"],
                ["AreaHarvested", "Rice" , "Russia", "winter", 2222, "Kg"],
                ["Production", "Wheat" , "Egypt", "winter", 345435345, "T"],
                [ "Production", "Rice" , "Egypt", "winter", 1111313, "T"]
            ]


        data2 = [
            [ "Population", "20140102", 13000, '1000s', 'C'],
            [ "Total Supply", "20140102", 232323, 'Tonn', 'D'],
        ]


        function BalanceSheet() {

            configurator = new Configurator;
            generalController = new GeneralController;
            modelController = new ModelController;

        }

        BalanceSheet.prototype.init = function () {
            $.ajax({
                async: false,
                type: 'GET',
                url: urlDSD,
                success: function (data) {
                    dsd = data;
                }
            })

            $.ajax({
                async: false,
                type: 'GET',
                url: urlComponent,
                success: function (data) {
                    componentConfiguration = data;
                }
            })

            configurator.init(dsd, componentConfiguration)
            modelController.init(data2, dsd, componentConfiguration, configurator)

            var gridModel = modelController.getGridDataModel()

            var fullTableModel = modelController.createFullTableModel(false)
            generalController.init(componentConfiguration, gridModel, fullTableModel, configurator, true, modelController)

        }


        BalanceSheet.prototype.setTableData = function (TableData) {

            console.log("BalanceSheet.setTableData")
            var tableModel = tableDataModel.init(TableData, dsd, componentConfiguration, configurator);
            console.log("TableModel.init() - result")
            console.log(tableModel)
            return tableModel;


        }


        BalanceSheet.prototype.setGridData = function (model) {

            indexes = configurator.getAllColumnModels();
            return (gridDataModel.init(dsd, model, data, indexes));

        }


        BalanceSheet.prototype.addRow = function (row) {
            // TODO
        }

        BalanceSheet.prototype.deleteRow = function (idRow) {
            // TODO
        }

        BalanceSheet.prototype.addColumn = function (column) {
            // TODO
        }

        BalanceSheet.prototype.removeColumn = function (idColumn) {
            // TODO
        }


        return BalanceSheet;

    })
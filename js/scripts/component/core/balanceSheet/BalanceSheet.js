/**
 * Created by fabrizio on 6/26/14.
 */

define(["jquery", "configurator/Configurator", "modelController/ModelsController",
    "generalController/GeneralController"], function ($, Configurator, ModelController, GeneralController) {

    var urlDSD = "./js/scripts/tests/BalanceSheetsTestData/AMIS/Presentations/DSD/dsd.json"

    var urlData = "./js/scripts/tests/BalanceSheetsTestData/AMIS/Presentations/Data/data.js"

    var urlComponent = "./js/scripts/tests/BalanceSheetsTestData/AMIS/Presentations/ComponentConfiguration/componentConfiguration.json"


    var tableDataModel, gridDataModel, data, dsd, componentConfiguration,
        configurator, indexes, generalController, modelController;

    var dataInput;

    function BalanceSheet() {

        configurator = new Configurator;
        generalController = new GeneralController;
        modelController = new ModelController;

    }

    BalanceSheet.prototype.init = function (tableData) {
        // dsd
        $.ajax({
            async: false,
            type: 'GET',
            url: urlDSD,
            success: function (data) {
                dsd = data;
            }
        })

        // component Configuration
        $.ajax({
            async: false,
            type: 'GET',
            url: urlComponent,
            success: function (data) {
                componentConfiguration = data;
            }
        })

        // data
        $.ajax({
            async: false,
            type: 'GET',
            url: urlData,
            success: function (data) {
                dataInput = JSON.parse(data);
            }
        })

        debugger;

        configurator.init(dsd, componentConfiguration)
        modelController.init(dataInput, configurator)

        var gridModel = modelController.getGridDataModel()
        var tableModel = modelController.getTableDataModel()
        generalController.init(gridModel, tableModel, configurator, modelController)

    }


    BalanceSheet.prototype.getData = function () {
        return modelController.getData();
    }

    BalanceSheet.prototype.setTableData = function (TableData) {

        var tableModel = tableDataModel.init(TableData, dsd, componentConfiguration, configurator);
        return tableModel;
    }

    BalanceSheet.prototype.setGridData = function (model) {
        indexes = configurator.getAllColumnModels();
        return (gridDataModel.init(dsd, model, data, indexes));
    }

    BalanceSheet.prototype.getTableData = function () {
        return modelController.getTableData();
    }

    BalanceSheet.prototype.getGridData = function () {
        return modelController.getGridData();
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
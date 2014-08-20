/**
 * Created by fabrizio on 6/26/14.
 */

define(["jquery", "configurator/Configurator", "modelController/ModelsController",
    "generalController/GeneralController"], function ($, Configurator, ModelController, GeneralController) {

    var urlDSD = "./js/scripts/component/core/balanceSheet/configuration/dsd/dsdStructure.json"

    var urlComponent = "./js/scripts/component/core/balanceSheet/configuration/component/componentConfiguration.json"

    var tableDataModel, gridDataModel, data, dsd, componentConfiguration,
        configurator, indexes, generalController, modelController;


    // ----------------------------- DATA FOR TESTING PURPOSES ---------------------------------
    dataPresentation = [
        [ "Population", "20140102", 13000, '1000s', ''],
        [ "Population", "20140104", 13000, '1000s', ''],
        [ "Population", "20140105", 13000, '1000s', ''],
        [ "Population", "20140106", 13000, '1000s', ''],
        [ "Population", "20140107", 13000, '1000s', ''],
        [ "Population", "20140108", 13000, '1000s', ''],
        [ "Population", "20140109", 13000, '1000s', ''],

        [ "Total Supply", "20140102", 40.52, 'Million Tonnes', 'C'],
        [ "Total Supply", "20140103", 33.23, 'Million Tonnes', 'C'],
        [ "Total Supply", "20140107", 36.50, 'Million Tonnes', 'C'],
        [ "Total Supply", "20140105", 38.90, 'Million Tonnes', 'C'],

        [ "Exports-ITY", "20140106", 19, 'Million Tonnes', ''],
        [ "Exports-ITY", "20140101", 18.20, 'Million Tonnes', ''],
        [ "Exports-ITY", "20140102", 17.20, 'Million Tonnes', ''],
        [ "Exports-ITY", "20140103", 15.40, 'Million Tonnes', ''],
        [ "Exports-ITY", "20140104", 19, 'Million Tonnes', ''],
        [ "Exports-ITY", "20140105", 18.10, 'Million Tonnes', ''],

        [ "Exports-NMY", "20140106", 18, 'Million Tonnes', ''],
        [ "Exports-NMY", "20140101", 18, 'Million Tonnes', ''],
        [ "Exports-NMY", "20140102", 19, 'Million Tonnes', ''],
        [ "Exports-NMY", "20140103", 17.20, 'Million Tonnes', ''],
        [ "Exports-NMY", "20140104", 19, 'Million Tonnes', ''],
        [ "Exports-NMY", "20140105", 17, 'Million Tonnes', ''],

        [ "Of Which Government", "20140106", , 'Million Tonnes', ''],
        [ "Of Which Government", "20140101", , 'Million Tonnes', ''],
        [ "Of Which Government", "20140102", , 'Million Tonnes', ''],
        [ "Of Which Government", "20140103", , 'Million Tonnes', ''],
        [ "Of Which Government", "20140104", , 'Million Tonnes', ''],
        [ "Of Which Government", "20140105", , 'Million Tonnes', ''],

        [ "Area Harvested", "20140106", 4.52, 'Million Ha', ''],
        [ "Area Harvested", "20140101", 3.60, 'Million Ha', ''],
        [ "Area Harvested", "20140102", 4.10, 'Million Ha', ''],
        [ "Area Harvested", "20140103", 4.13, 'Million Ha', ''],
        [ "Area Harvested", "20140104", 3.88, 'Million Ha', ''],
        [ "Area Harvested", "20140105", 3.90, 'Million Ha', ''],

        [ "Imports-NMY", "20140106", 12, 'Million tonnes', ''],
        [ "Imports-NMY", "20140101", 15, 'Million tonnes', ''],
        [ "Imports-NMY", "20140102", 18, 'Million tonnes', ''],
        [ "Imports-NMY", "20140103", 16, 'Million tonnes', ''],
        [ "Imports-NMY", "20140104", 17.30, 'Million tonnes', ''],
        [ "Imports-NMY", "20140105", 18.20, 'Million tonnes', ''],

        [ "Imports-ITY", "20140106", 18.80, 'Million tonnes', ''],
        [ "Imports-ITY", "20140101", 12.70, 'Million tonnes', ''],
        [ "Imports-ITY", "20140102", 18.77, 'Million tonnes', ''],
        [ "Imports-ITY", "20140103", 17.20, 'Million tonnes', ''],
        [ "Imports-ITY", "20140104", 18.02, 'Million tonnes', ''],
        [ "Imports-ITY", "20140105", 18.30, 'Million tonnes', ''],

        [ "Food Use", "20140106", 0.40, 'Million tonnes', ''],
        [ "Food Use", "20140101", 0.45, 'Million tonnes', ''],
        [ "Food Use", "20140102", 0.39, 'Million tonnes', ''],
        [ "Food Use", "20140103", 0.28, 'Million tonnes', ''],
        [ "Food Use", "20140104", 0.33, 'Million tonnes', ''],
        [ "Food Use", "20140105", 0.44, 'Million tonnes', ''],


        [ "Opening Stocks", "20140106", 3.88, 'Million tonnes', ''],
        [ "Opening Stocks", "20140101", 1.95, 'Million tonnes', ''],
        [ "Opening Stocks", "20140102", 1.88, 'Million tonnes', ''],
        [ "Opening Stocks", "20140103", 1.87, 'Million tonnes', ''],
        [ "Opening Stocks", "20140104", 1.76, 'Million tonnes', ''],
        [ "Opening Stocks", "20140105", 1.88, 'Million tonnes', ''],

        [ "Other Uses", "20140106", 1.50, 'Million tonnes', ''],
        [ "Other Uses", "20140101", 1.44, 'Million tonnes', ''],
        [ "Other Uses", "20140102", 1.44, 'Million tonnes', ''],
        [ "Other Uses", "20140103", 1.44, 'Million tonnes', ''],
        [ "Other Uses", "20140104", 1.44, 'Million tonnes', ''],
        [ "Other Uses", "20140105", 1.44, 'Million tonnes', ''],

        [ "Total Utilization", "20140106", 33.80, 'Million tonnes', 'C'],
        [ "Total Utilization", "20140101", 32.70, 'Million tonnes', 'C'],
        [ "Total Utilization", "20140102", 32.77, 'Million tonnes', 'C'],
        [ "Total Utilization", "20140103", 31.20, 'Million tonnes', 'C'],
        [ "Total Utilization", "20140104", 29.02, 'Million tonnes', 'C'],
        [ "Total Utilization", "20140105", 29.30, 'Million tonnes', 'C'],

        [ "Domestic Utilization", "20140106", 10.80, 'Million tonnes', 'C'],
        [ "Domestic Utilization", "20140101", 9.70, 'Million tonnes', 'C'],
        [ "Domestic Utilization", "20140102", 8.77, 'Million tonnes', 'C'],
        [ "Domestic Utilization", "20140103", 9.20, 'Million tonnes', 'C'],
        [ "Domestic Utilization", "20140104", 9.02, 'Million tonnes', 'C'],
        [ "Domestic Utilization", "20140105", 9.30, 'Million tonnes', 'C']
    ]
    data = [
        [ 1, 2 ,11, 21, 22, 1, 20130210],
        [ 1, 3 , 11, 21, 123123, 2, 20130210],
        [2, 2 , 12, 23, 2222, 3, 20130211],
        [2, 3 , 12,23, 888, 1, 20130212],
        [1, 3 , 11, 22, 345435345, 2, 20130211],
        [1, 3, 11, 23, 1111313, 3, 20130212]
    ]
    data2 = [
        [ 11  , "20140102", 13000, '1000s' , 'C', ''],
        [ 13, "20140102", 232323, 'Tonn'  , 'D', ''],
        [ 11  , "20140103", 1302130, '1000s' , 'C', '']
    ]
    data3 = [
        ["note","20140102",1,'KG','C',11],
        ["note","20140103",2,'KG','C',13],
        ["note","20140105",3,'KG','C',16],
        ["note","20140107",4,'KG','C',14],
        ["note","20140108",5,'KG','C',16]
    ]
    // -----------------------------------------------------------------------------------------

    ///


    function BalanceSheet() {

        configurator = new Configurator;
        generalController = new GeneralController;
        modelController = new ModelController;

    }

    BalanceSheet.prototype.init = function (tableData) {
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
        modelController.init(data, configurator)

        var gridModel = modelController.getGridDataModel()
        var tableModel = modelController.getTableDataModel()
        generalController.init( gridModel, tableModel, configurator, modelController)

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

    BalanceSheet.prototype.getTableData = function () {
        return modelController.getTableData();
    }

    BalanceSheet.prototype.getGridData = function() {
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
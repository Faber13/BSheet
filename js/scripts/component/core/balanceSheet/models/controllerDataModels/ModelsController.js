/**
 * Created by fabrizio on 7/24/14.
 */
define(["jquery", "models/tableDataModel/TableDataModel",
    "models/gridDataModel/GridDataModel", "models/creator/HandlerCreationModels"], function ($, TableDataModel, GridDataModel, ModelCreator) {

    var TableModel, GridModel, indexes, instanceGridDataModel, instanceTableDataModel, fullTableModel, newValues, dataTable, CreatorModels,
        modelForCreation;

    function ModelsController() {
        TableModel = new TableDataModel;
        GridModel = new GridDataModel;
        CreatorModels = new ModelCreator;
    }

    ModelsController.prototype.init = function (tableData, configurator) {

        dataTable = tableData
        newValues = []; // New values will be put into this variable
        indexes = configurator.getAllColumnModels();
        instanceTableDataModel = tableData;
        TableModel.init(tableData, configurator);
        modelForCreation = CreatorModels.init(configurator)
        instanceGridDataModel = GridModel.init(modelForCreation, tableData, indexes)
        TableModel.createFullTableData(modelForCreation)
        // if a full rows representation need to be visualized
        var newTable =(configurator.getFullRowsRepresentation())?  TableModel.createColumnSparseTableData(modelForCreation) :
            TableModel.createTableModelFromGrid(instanceGridDataModel);

        TableModel.createSparseTableData(newTable);

    }

    ModelsController.prototype.getTableDataModel = function () {
        return TableModel.getTableData();
    }

    ModelsController.prototype.getGridDataModel = function () {
        return GridModel.getGridDataModel();
    }

    ModelsController.prototype.getData = function () {
        return TableModel.getAllData();
    }

    ModelsController.prototype.createFullTableModel = function () {
        fullTableModel = TableModel.createFullTableData(instanceGridDataModel)
        return fullTableModel;
    }

    ModelsController.prototype.getFullTableModel = function () {
        return fullTableModel;
    }

    ModelsController.prototype.updateModels = function (cell, indTable, rowIndex, columnIndex) {
        var newCell = cell;
        console.log("updateMODELS: INDEX table")
        console.log(indTable)
        newValues.push(newCell);
        //fullTableModel[indTable] = newCell;
        TableModel.updateTableData(cell, indTable)
        instanceTableDataModel = TableModel.getTableData();
        // Create a GRid Model
        GridModel.updateModel(cell, rowIndex, columnIndex)
        instanceGridDataModel = GridModel.getGridDataModel();
    }


    ModelsController.prototype.getFullRowsIndexes = function () {
        return TableModel.getFullIndexRows();
    }


    ModelsController.prototype.getFullColumnsIndexes = function () {
        return TableModel.getFullIndexColumns();
    }


    ModelsController.prototype.getIndexesNewFirstColumnLeft = function () {
        return TableModel.getIndexesDoubleColumns();
    }


    ModelsController.prototype.getMapDomainCodes = function (indexColumn) {
        TableModel.getMapDomainCodes(indexColumn)

    }

    return ModelsController;
})
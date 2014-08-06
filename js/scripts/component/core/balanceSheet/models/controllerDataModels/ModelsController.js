/**
 * Created by fabrizio on 7/24/14.
 */
define(["jquery",  "models/tableDataModel/TableDataModel",
    "models/gridDataModel/GridDataModel", "models/creator/HandlerCreationModels"], function($,  TableDataModel, GridDataModel, ModelCreator) {

    var TableModel, GridModel, indexes, instanceGridDataModel, instanceTableDataModel, fullTableModel, newValues, dataTable, CreatorModels,
        modelForCreation;

    function ModelsController() {
        TableModel    = new TableDataModel;
        GridModel     = new GridDataModel;
        CreatorModels = new ModelCreator;
    }

    ModelsController.prototype.init = function(tableData, dsd, componentConfiguration, configurator){

        dataTable = tableData
        newValues = []; // There will be to put the new values into this variable
        console.log("ModelController.INIT()")
        indexes = configurator.getAllColumnModels();
        instanceTableDataModel = tableData;
        TableModel.init(tableData, configurator);
        modelForCreation       = CreatorModels.init(configurator)
        instanceGridDataModel  = GridModel.init( modelForCreation, tableData, indexes)

    }

    ModelsController.prototype.getTableDataModel = function(){
        return TableModel.getTableDataModel();
    }

    ModelsController.prototype.getGridDataModel = function(){
        return GridModel.getGridDataModel();
    }

    ModelsController.prototype.createFullTableModel = function(creationMode){
        fullTableModel = TableModel.createFullTableData(instanceGridDataModel)
        return fullTableModel;
    }

    ModelsController.prototype.getFullTableModel = function(){
        return fullTableModel;
    }

    ModelsController.prototype.updateModels = function(cell, indTable, rowIndex, columnIndex){
        var newCell = cell;
        console.log("updateMODELS")
        console.log(cell);
        console.log(indTable)
        console.log(newValues)
        newValues.push(newCell);
        fullTableModel[indTable] = newCell;
        // Create a GRid Model
        GridModel.updateModel(cell,rowIndex, columnIndex)
        instanceGridDataModel = GridDataModel.getGridDataModel();

    }

    return ModelsController;
})
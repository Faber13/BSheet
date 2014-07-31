/**
 * Created by fabrizio on 7/24/14.
 */
define(["jquery",  "models/tableDataModel/TableDataModel",
    "models/gridDataModel/GridDataModel"], function($,  TableDataModel, GridDataModel) {

    var TableModel, GridModel, indexes, instanceGridDataModel, instanceTableDataModel, fullTableModel, newValues;

    function ModelsController() {
        TableModel = new TableDataModel;
        GridModel  = new GridDataModel;
    }

    ModelsController.prototype.init = function(tableData, dsd, componentConfiguration, configurator){

        newValues = []; // There will be to put the new values into this variable
        console.log("ModelController.INIT()")
        indexes = configurator.getAllColumnModels();
        instanceTableDataModel = TableModel.init(tableData, dsd, componentConfiguration, configurator)
        instanceGridDataModel  = GridModel.init(dsd, instanceTableDataModel, tableData, indexes)

    }

    ModelsController.prototype.getTableDataModel = function(){
        return instanceTableDataModel;
    }

    ModelsController.prototype.getGridDataModel = function(){
        return instanceGridDataModel;
    }

    ModelsController.prototype.createFullTableModel = function(creationMode){
        fullTableModel = GridModel.createTableModel(indexes, instanceGridDataModel, creationMode)
        return fullTableModel;
    }

    ModelsController.prototype.getFullTableModel = function(){
        return fullTableModel;
    }

    ModelsController.prototype.updateModels = function(cell, indTable){
        var newCell = cell;
        console.log("updateMODELS")
        console.log(cell);
        console.log(indTable)
        console.log(newValues)
        newValues.push(newCell);
        fullTableModel[indTable] = newCell;
        // Create a GRid Model

    }

    return ModelsController;
})
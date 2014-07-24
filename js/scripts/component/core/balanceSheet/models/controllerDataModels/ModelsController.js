/**
 * Created by fabrizio on 7/24/14.
 */
define(["jquery",  "models/tableDataModel/TableDataModel",
    "models/gridDataModel/GridDataModel"], function($,  TableDataModel, GridDataModel) {

    var TableModel, GridModel, indexes, instanceGridDataModel, instanceTableDataModel, fullTableModel;

    function ModelsController() {
        TableModel = new TableDataModel;
        GridModel  = new GridDataModel;
    }

    ModelsController.prototype.init = function(tableData, dsd, componentConfiguration, configurator){

        console.log("ModelController.INIT()")
        indexes = configurator.getAllColumnModels();
        instanceTableDataModel = TableModel.init(tableData, dsd, componentConfiguration, configurator)
        instanceGridDataModel  = GridModel.init(dsd, instanceTableDataModel, tableData, indexes)
        var result = {
            "gridData"  : instanceGridDataModel,
            "tableData" : instanceTableDataModel
        }
        return result;
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

    return ModelsController;
})
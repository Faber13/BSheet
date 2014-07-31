/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery", "view/GridDataView","editor/controller/FormController"], function($, GridDataView, EditorController){

    var ViewGrid, ModelController, FormController, dsd, Configurator;

    function GeneralController(){
        ViewGrid   = new GridDataView;
        FormController = new EditorController;
    };

    /* Function that it has to do:
        1) initialization of the grid view (OK)
        2) Export/import of the data
        3) manages the life cycle
        4) Manages the communication between different modules
     */

    // It manages the initialization time of the view
    GeneralController.prototype.init = function(componentConfiguration,gridModel, fullTableModel, configurator, typeOfView, modelController){
        ModelController = modelController;
        dsd = configurator.getDSD();
        Configurator = configurator;
        ViewGrid.init(componentConfiguration,gridModel, fullTableModel, configurator, typeOfView)
        var that =this;
        var columnsNumber = gridModel["matrixUp"][0].length;

        $("#pivotGrid").igPivotGrid();
        this.createListeners(columnsNumber)
    }


    GeneralController.prototype.createListeners = function(columnsNumber){

        alert()

        var grid = $("#pivotGrid").igPivotGrid("grid");
        var that = this;
        var cell;
        var indTable

        $(document).delegate("#" + grid.id(), "iggridcellclick", function (evt, ui) {
            // Only the FIRST ROW column indexes start from 2!

            var cellTableModel = ModelController.getFullTableModel();
            if(ui.rowIndex ==0){
                indTable = ((ui.rowIndex)+1) +  (ui.colIndex -2);
                cell = cellTableModel[indTable]
            }else{
                indTable = ((ui.rowIndex)*columnsNumber)+(ui.colIndex -1);
                cell = cellTableModel[indTable]
            }
           that.onclickCell(indTable, cell, dsd);
        });
    }


    GeneralController.prototype.exportData = function(){

    }


    GeneralController.prototype.importData = function(){

    }


    GeneralController.prototype.onclickCell = function(indTable, cell, dsd){
        alert("clickedOnCell")

        var newCell;
        var result = FormController.init(Configurator, cell, dsd)
        alert($('#saveButton'))
        debugger;
        $(document).on('click',"#saveButton",function(e){
            alert("CLICKEDDD")
            newCell=  FormController.getValue(cell)
            console.log(ModelController.updateModels)
            ModelController.updateModels(newCell, indTable)
            ViewGrid.createFullGrid();
            return
        })


    }


    return GeneralController;
});
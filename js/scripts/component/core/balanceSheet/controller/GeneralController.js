/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery", "view/GridDataView","editor/CellEditor"], function($, GridDataView, Editor){

    var ViewGrid, ModelController, EditorForm, dsd, Configurator;

    function GeneralController(){
        ViewGrid   = new GridDataView;
        EditorForm = new Editor;
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

        $("#pivotGrid").igPivotGrid({
            pivotGridRendered: function(evt, ui) {that.createListeners(columnsNumber)}
        });
    }


    GeneralController.prototype.createListeners = function(columnsNumber){

        var grid = $("#pivotGrid").igPivotGrid("grid");
        var that = this;
        var cell;

        $(document).delegate("#" + grid.id(), "iggridcellclick", function (evt, ui) {
            var cellTableModel = ModelController.getFullTableModel();
            cell = (ui.rowIndex ==0)? cellTableModel[((ui.rowIndex)*1) +  (ui.colIndex -2)]:
                    cellTableModel[((ui.rowIndex)*columnsNumber)+(ui.colIndex -1)];
            // Only the FIRST ROW column indexes start from 2, it needs to be checked!
            alert("Cell Clicked. Cell at row index(CreateListeners):" + ui.rowIndex + "  and column index: " + ui.colIndex);
           that.onclickCell(evt,ui, cell, dsd);
        });
    }


    GeneralController.prototype.exportData = function(){

    }


    GeneralController.prototype.importData = function(){

    }

    GeneralController.prototype.onclickCell = function(evt,ui, cell, dsd){


        var result = EditorForm.init(Configurator, cell, dsd)
        var change = result.changed;
        ui.cellElement.innerText = "BBB"


    }




    return GeneralController;
});
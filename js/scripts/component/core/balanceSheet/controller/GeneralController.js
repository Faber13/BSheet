/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery", "view/GridDataView", "editor/controller/FormController",
    "exporter/controller/ExportController"], function ($, GridDataView, EditorController, ExportController) {

    var ViewGrid, ModelController, FormController, dsd, Configurator;

    function GeneralController() {
        ViewGrid = new GridDataView;
        FormController = new EditorController;
    };

    /* Function that it has to do:
     1) initialization of the grid view (OK)
     2) Export/import of the data
     3) manages the life cycle
     4) Manages the communication between different modules
     */

    // It manages the initialization time of the view
    GeneralController.prototype.init = function ( gridModel, fullTableModel, configurator, typeOfView, modelController) {
        ModelController = modelController;
        dsd = configurator.getDSD();
        Configurator = configurator;
        ViewGrid.init( gridModel, fullTableModel, configurator, typeOfView)
        var columnsNumber = gridModel["matrixUp"][0].length;
        this.createListeners(columnsNumber)
    }


    GeneralController.prototype.createListeners = function (columnsNumber) {

        var grid = $("#pivotGrid").igPivotGrid("grid");
        var that = this;

        $(document).delegate("#" + grid.id(), "iggridcellclick", function (evt, ui) {
            // Only the FIRST ROW column indexes start from 2!
            var rowGridIndex, columnGridIndex;
            var cellTableModel =        ModelController.getFullTableModel();
            var numberLeftKeyColumns =  Configurator.getLeftKeyColumn().leftColumns.length
            if (ui.rowIndex == 0) {
                rowGridIndex = 0;
                columnGridIndex = ui.colIndex - 2;
                var indTable = (numberLeftKeyColumns > 1)?  ((ui.rowIndex) ) + (ui.colIndex - 2):
                    ((ui.rowIndex) + 1) + (ui.colIndex - 2);
                var clickedCell = cellTableModel[indTable]
            } else {
                rowGridIndex = ui.rowIndex;
                columnGridIndex = ui.colIndex - 1;
                var indTable = ((ui.rowIndex) * columnsNumber) + (ui.colIndex - 1);
                var clickedCell = cellTableModel[indTable]
            }
            FormController.init(Configurator, clickedCell, dsd)
            that.onclickCell(indTable, clickedCell, rowGridIndex, columnGridIndex);
        });

        $("#exportButton").click(function(){
            var ExportControl = new ExportController;
         // var table = ViewGrid.getModelView();
            var table = ModelController.getFullTableModel();
            ExportControl.init(table, Configurator)
        })
    }


    GeneralController.prototype.exportData = function () {

    }


    GeneralController.prototype.importData = function () {

    }


    GeneralController.prototype.onclickCell = function (indTable, cell, rowIndex, columnIndex) {

        $(document.body).on('click', "#saveButton", function (e) {
            var newCell = FormController.getValue(cell)
            ModelController.updateModels(newCell, indTable,rowIndex, columnIndex)
            ViewGrid.updateGridView(newCell, indTable);
            $(document.body).off();
        })


    }


    return GeneralController;
});
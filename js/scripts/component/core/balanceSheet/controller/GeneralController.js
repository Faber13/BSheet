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
    GeneralController.prototype.init = function (componentConfiguration, gridModel, fullTableModel, configurator, typeOfView, modelController) {
        ModelController = modelController;
        dsd = configurator.getDSD();
        Configurator = configurator;
        ViewGrid.init(componentConfiguration, gridModel, fullTableModel, configurator, typeOfView)
        var that = this;
        var columnsNumber = gridModel["matrixUp"][0].length;
        this.createListeners(columnsNumber)
    }


    GeneralController.prototype.createListeners = function (columnsNumber) {


        var grid = $("#pivotGrid").igPivotGrid("grid");
        var that = this;


        $(document).delegate("#" + grid.id(), "iggridcellclick", function (evt, ui) {
            // Only the FIRST ROW column indexes start from 2!

            var cellTableModel = ModelController.getFullTableModel();
            if (ui.rowIndex == 0) {
                var indTable = ((ui.rowIndex) + 1) + (ui.colIndex - 2);
                var clickedCell = cellTableModel[indTable]
            } else {
                var indTable = ((ui.rowIndex) * columnsNumber) + (ui.colIndex - 1);
                var clickedCell = cellTableModel[indTable]
            }
            FormController.init(Configurator, clickedCell, dsd)
            console.log("clicked cell sent to GeneralController.oncclickCell()")
            console.log(clickedCell)
            that.onclickCell(indTable, clickedCell);
        });

        $("#exportButton").click(function(){
            var ExportControl = new ExportController;
            var table = ViewGrid.getModelView();
            ExportControl.init(table, Configurator)


        })
    }


    GeneralController.prototype.exportData = function () {

    }


    GeneralController.prototype.importData = function () {

    }


    GeneralController.prototype.onclickCell = function (indTable, cell) {

        $(document.body).on('click', "#saveButton", function (e) {
            var newCell = FormController.getValue(cell)
            ModelController.updateModels(newCell, indTable)
            ViewGrid.updateGridView(newCell, indTable);
            $(document.body).off();
        })


    }


    return GeneralController;
});
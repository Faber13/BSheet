/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery", "view/GridDataView", "editor/controller/FormController",
    "exporter/controller/ExportController", "adapter/AdapterPivot"],
    function ($, GridDataView, EditorController, ExportController, Adapter) {

    var ViewGrid, ModelController, FormController, dsd, Configurator, adapterPivot;

    function GeneralController() {
        ViewGrid = new GridDataView;
        FormController = new EditorController;
        adapterPivot = new Adapter
    };


    GeneralController.prototype.init = function (gridModel, fullTableModel, configurator, modelController) {
        ModelController = modelController;
        dsd = configurator.getDSD();
        Configurator = configurator;
        ViewGrid.init(fullTableModel, configurator)
        var columnsNumber = ModelController.getFullColumnsIndexes().length;
        this.createListeners(columnsNumber)
    }


    GeneralController.prototype.createListeners = function (columnsNumber) {

        // Transform pivotGrid into grid
        var grid = $("#pivotGrid").igPivotGrid("grid");
        var that = this;

        // attach the listener on click
        $(document.body).delegate("#" + grid.id(), "iggridcellclick", function (evt, ui) {
            // Only the FIRST ROW column indexes start from 2!
            evt.stopImmediatePropagation()
            var cellTableModel2 = ModelController.getTableDataModel();
            var cellTableModel = $.extend(true, [], cellTableModel2);
            // To identify when the first new nested row starts
            var indexesObject = ModelController.getIndexesNewFirstColumnLeft();
            var resultedClicked= adapterPivot.getClickedCell(cellTableModel, Configurator, ui, indexesObject, columnsNumber);
            var clickedCell = resultedClicked["clickedCell"] 
            var indTable = resultedClicked["indTable"] ;
            var rowGridIndex = resultedClicked["rowGridIndex"];
            var columnGridIndex = resultedClicked["columnGridIndex"];
            FormController.init(Configurator, clickedCell, dsd)     
            that.onSaveButton(indTable, clickedCell, rowGridIndex, columnGridIndex);
        });
     

        $("#exportButton").click(function () {
            var ExportControl = new ExportController;
            // var table = ViewGrid.getModelView();
            var table = ModelController.getTableDataModel();
            ExportControl.init(table, Configurator)
        })
    }



    GeneralController.prototype.onSaveButton = function (indTable, cell, rowIndex, columnIndex) {
            
        $("#saveButton").on('click', function (e) {
            e.stopImmediatePropagation();
            $('#saveButton').off();
            var newCell = FormController.getValue(cell)
            if (newCell.length > 0) {
                ModelController.updateModels(newCell, indTable, rowIndex, columnIndex)
                ViewGrid.updateGridView(newCell, indTable);
            }
        });
    }


        return GeneralController;
    });
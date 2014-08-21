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


    GeneralController.prototype.init = function ( gridModel, fullTableModel, configurator, modelController) {
        ModelController = modelController;
        dsd = configurator.getDSD();
        Configurator = configurator;
        ViewGrid.init(  fullTableModel, configurator)
        var columnsNumber = ModelController.getFullColumnsIndexes().length;
        this.createListeners(columnsNumber)
    }


    GeneralController.prototype.createListeners = function (columnsNumber) {

        // Transform pivotGrid into grid
        var grid = $("#pivotGrid").igPivotGrid("grid");
        var that = this;

        // attach the listener on click
        $(document).delegate("#" + grid.id(), "iggridcellclick", function (evt, ui) {
            // Only the FIRST ROW column indexes start from 2!
            evt.stopImmediatePropagation()
            debugger;

            var rowGridIndex, columnGridIndex;
            var cellTableModel2 =        ModelController.getTableDataModel();
            var cellTableModel        = $.extend(true, [], cellTableModel2);

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
                if(numberLeftKeyColumns >1){
                    var indexesObject = ModelController.getIndexesNewFirstColumnLeft();
                    if(typeof indexesObject[indTable-1] !== 'undefined' && parseInt((indTable-1)/columnsNumber) == ui.rowIndex ){
                        indTable --;
                    }
                }
               var clickedCell = cellTableModel[indTable]
            }
            FormController.init(Configurator, clickedCell, dsd)
            $('body').on('click', "#saveButton", function (e) {
                e.stopImmediatePropagation();
                $('body').off();
                alert(indTable)
                that.onclickCell(indTable, clickedCell, rowGridIndex, columnGridIndex);
            });
        });


        $("#exportButton").click(function(){
            var ExportControl = new ExportController;
            // var table = ViewGrid.getModelView();
            var table = ModelController.getTableDataModel();
            ExportControl.init(table, Configurator)
        })
    }


    GeneralController.prototype.exportData = function () {

    }


    GeneralController.prototype.importData = function () {

    }


    GeneralController.prototype.onclickCell = function (indTable, cell, rowIndex, columnIndex) {

            alert("onclikcCell")
            var newCell = FormController.getValue(cell)
            console.log("GENERAL CONTROLLER: new Cell")
            console.log(newCell)
            if(newCell.length >0) {
                console.log("*////////////////");
                console.log(indTable)
                ModelController.updateModels(newCell, indTable, rowIndex, columnIndex)
                ViewGrid.updateGridView(newCell, indTable);
            }
            //$(document.body).off();

    }


    return GeneralController;
});
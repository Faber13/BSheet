/**
 * Created by fabrizio on 7/28/14.
 */
define(["jquery" ], function($ ){

    function AdapterPivot(){};

    // get the clicked cell from the model data and the index of Table model
    AdapterPivot.prototype.getClickedCell = function(TableModel, Configurator, ui, indexesObject, columnsNumber) {
        var result = {};
        var rowGridIndex, columnGridIndex;

        var numberLeftKeyColumns = Configurator.getLeftKeyColumn().leftColumns.length
        if (ui.rowIndex == 0) {
            rowGridIndex = 0;
            columnGridIndex = ui.colIndex - 2;
            var indTable = (numberLeftKeyColumns > 1) ? ((ui.rowIndex) ) + (ui.colIndex - 2) :
                ((ui.rowIndex) + 1) + (ui.colIndex - 2);
             clickedCell = TableModel[indTable]
        } else {
            rowGridIndex = ui.rowIndex;
            columnGridIndex = ui.colIndex - 1;
            var indTable = ((ui.rowIndex) * columnsNumber) + (ui.colIndex - 1);
            if (numberLeftKeyColumns > 1) {
                if (typeof indexesObject[indTable - 1] !== 'undefined' && 
                    parseInt((indTable - 1) / columnsNumber) == ui.rowIndex) {
                    indTable--;
                }
            }
            clickedCell = TableModel[indTable]
           
        }
        result["clickedCell"]   = clickedCell;
        result["indTable"]      = indTable;
        result["rowGridIndex"]    = rowGridIndex;
        result["columnGridIndex"]    = columnGridIndex;        

        return result;
    }

    return AdapterPivot;
})

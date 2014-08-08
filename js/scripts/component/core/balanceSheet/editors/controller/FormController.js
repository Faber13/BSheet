/**
 * Created by fabrizio on 7/29/14.
 */
define(["jquery", "editor/cell/CellEditor", "editor/formatter/DatatypesFormatter"],function($, CellEditor, DatatypeFormatter){

    var FormEditor, valueIndex, accessorIndexes, columns, Formatter;

    function FormController(){

        FormEditor = new CellEditor;
        Formatter  = new DatatypeFormatter;
    }

    FormController.prototype.init = function(Configurator, cell, dsd){

        FormEditor.init(Configurator,cell,dsd)
        columns         = Configurator.getDSD().dsd.columns
        accessorIndexes = Configurator.getDSDAccessorColumns()["accessorIndexes"]
        valueIndex      = Configurator.getValueIndex();

    }

    FormController.prototype.getValue = function(cell){

        var result
        var $input = document.getElementsByClassName('input-group-lg');
        var result = []; // An new empty array

        // If something has changed
        debugger;
        if(this.checkValuesChanged($input)) {
            for (var i = 0, len = cell.length; i < len; i++) {
                result[i] = cell[i];
            }
            for (var i = 0; i < accessorIndexes.length + 1; i++) {
                if (i == 0) {
                    result[valueIndex] = Formatter.init($input[i].value, columns[valueIndex].dataTypes[0])
                }else {
                    result[accessorIndexes[i - 1]] = Formatter.init($input[i].value, columns[accessorIndexes[i - 1]].dataTypes[0])
                }
            }
        }
        $("#dialogForm").dialog('close');
        return result;
    }


    FormController.prototype.checkValuesChanged = function(array){

        var changed = false
        for(var i =0; i< array.length && !changed; i++){
            if(array[i].value != array[i].defaultValue){
                changed = true;
            }
        }
        return changed;
    }


    return FormController;
})
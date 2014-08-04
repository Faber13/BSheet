/**
 * Created by fabrizio on 7/29/14.
 */
define(["jquery", "editor/cell/CellEditor"],function($, CellEditor){

    var FormEditor, valueIndex, accessorIndexes;

    function FormController(){
        FormEditor = new CellEditor;
    }

    FormController.prototype.init = function(Configurator, cell, dsd){
        FormEditor.init(Configurator,cell,dsd)
        accessorIndexes = Configurator.getDSDAccessorColumns()["accessorIndexes"]
        valueIndex      = Configurator.getValueIndex();

    }

    FormController.prototype.getValue = function(cell){
        console.log("FormController.getValue(), cell")
        console.log(cell)
        var result
        var $input = document.getElementsByClassName('input-group-lg');
        var result = []; // An new empty array
        for (var i = 0, len = cell.length; i < len; i++) {
            result[i] = cell[i];
        }

        for(var i = 0; i< accessorIndexes.length +1; i++) {
                if (i == 0) {
                 result[valueIndex] = ($input[i].value !=='undefined')? $input[i].value : undefined;
                }else {
                 result[accessorIndexes[i - 1]] = ($input[i].value !=='undefined')? $input[i].value : undefined;
                }
        }

        $("#dialogForm").dialog('close');
        return result;
    }

    return FormController;
})
/**
 * Created by fabrizio on 7/29/14.
 */
define(["jquery", "editor/cell/CellEditor", "editor/formatter/DatatypesFormatter",
    "validator/EditorValidator"],function($, CellEditor, DatatypeFormatter, Validator){

    var FormEditor, valueIndex, accessorIndexes, columns, Formatter, EditorValidator
        , configurator;

    function FormController(){

        FormEditor = new CellEditor;
        Formatter  = new DatatypeFormatter;
    }

    FormController.prototype.init = function(Configurator, cell, dsd){

        FormEditor.init(Configurator,cell,dsd)
        columns         = Configurator.getDSD().dsd.columns
        accessorIndexes = Configurator.getDSDAccessorColumns()["accessorIndexes"]
        valueIndex      = Configurator.getValueIndex();
        EditorValidator = new Validator;
        configurator    = Configurator;

    }

    FormController.prototype.getValue = function(cell){

        var result
        var $input = document.getElementsByClassName('input-group-lg');
        var result = []; // An new empty array
        debugger;

        // If something has changed
        if(this.checkValuesChanged($input)) {
            for (var i = 0, len = cell.length; i < len; i++) {
                result[i] = cell[i];
            }
            result[valueIndex]   =  Formatter.init(result[valueIndex], columns[valueIndex].dataTypes[0])
            for (var i = 0; i < accessorIndexes.length ; i++) {
                 //result[valueIndex] = Formatter.init($input[i].value, columns[valueIndex].dataTypes[0])
                 result[accessorIndexes[i]] = Formatter.init(result[accessorIndexes[i]], columns[accessorIndexes[i]].dataTypes[0])
            }
        }
        if(EditorValidator.init(result, configurator )) {
            $("#dialogForm").dialog('close');
        }
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
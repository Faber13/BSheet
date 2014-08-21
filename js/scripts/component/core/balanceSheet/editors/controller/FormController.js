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
        configurator    = Configurator;
        FormEditor.init(Configurator,cell,dsd)
        columns         = configurator.getDSD().dsd.columns
        accessorIndexes = configurator.getDSDAccessorColumns()["accessorIndexes"]
        valueIndex      = configurator.getValueIndex();
        EditorValidator = new Validator;

    }

    FormController.prototype.getValue = function(cell){

        var result
        var input = FormEditor.getValuesFromCellEditor();
        var result = []; // An new empty array
        console.log("inputttttttttt")
        console.log(input)

        // If something has changed
        if(this.checkValuesChanged(input, cell)) {
            for (var i = 0, len = cell.length; i < len; i++) {
                result[i] = cell[i];
            }
            result[valueIndex]   =  Formatter.init(input[0], columns[valueIndex].dataTypes[0])
            for (var i = 0; i < accessorIndexes.length ; i++) {
                 var accessorColumnConf = configurator.lookForAccessorColumnByIdOnConfiguration(columns[accessorIndexes[i]].domain.id);
                 var formatDate = accessorColumnConf.properties.cellProperties.dateFormat;
                 //result[valueIndex] = Formatter.init($input[i].value, columns[valueIndex].dataTypes[0])
                 result[accessorIndexes[i]] = Formatter.init(input[i+1], columns[accessorIndexes[i]].dataTypes[0], formatDate);
            }
        }
        // validation (TODO)
        if(EditorValidator.init(result, configurator )) {
            $("#dialogForm").dialog('close');
        }
        return result;
    }


    FormController.prototype.checkValuesChanged = function(input, cell){

        var changed = false
        for(var i =0; i< input.length && !changed; i++){
            // Value column case
            if(i ==0) {
                if (input[i] != cell[valueIndex]) {
                    changed = true;
                }
            // accessor columns case
            } else {
                if (input[i] != cell[accessorIndexes[i-1]]) {
                    changed = true;
                }
            }
        }
        return changed;
    }


    return FormController;
})
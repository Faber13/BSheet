/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery", "jquery.dirtyFields"], function ($) {

    // Support functions
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    }

    NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
        for(var i = 0, len = this.length; i < len; i++) {
            if(this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    }


    function CellEditor() {
    }


    CellEditor.prototype.init = function (Configurator, cell, dsd) {

        var f  = document.getElementById("dialogForm");
        if(f !== null){
            f.remove()
        }


        //TODO
        var result = {
            "changed": false,
            "cell": cell
        }

        var $newdiv1 = $("<div id='dialogForm'></div>");
        // Only the FIRST ROW column indexes start from 2, it needs to be checked!
        $("#pivotGrid").append($newdiv1)

        var columns = dsd.dsd.columns
        var form = ("<form id ='form' role='form' class='col-lg-10'><fieldset>");
        $('#dialogForm').append(form);
        var leftKeyColumnsIndexes = Configurator.getLeftKeyColumn()["leftKeyIndexes"];
        var upKeyColumnsIndexes = Configurator.getUpKeyColumn()["upKeyIndexes"];
        var valueIndex = Configurator.getValueIndex();
        var accessorIndexes = Configurator.getDSDAccessorColumns()["accessorIndexes"]

        for (var i = 0; i < leftKeyColumnsIndexes.length; i++) {
            $('#form').append("<div class ='row'>" +
                "<div class='col-lg-6'><label for='leftKeyColumn" + i + "'>" + columns[leftKeyColumnsIndexes[i]].domain.title.EN
                + "</label></div>" +
                "<div class='col-lg-6'><p  class='read-group-lg' name='name' id='leftKeyColumn" + i + "'>" + cell[leftKeyColumnsIndexes[i]] + "</p></div>" +
                "</div><br>")
        }

        for (var i = 0; i < upKeyColumnsIndexes.length; i++) {
            $('#form').append("<div class ='row'>" +
                "<div class='col-lg-6'><label for='upKeyColumn" + i + "'>" + columns[upKeyColumnsIndexes[i]].domain.title.EN
                + "</label></div>" +
                "<div class='col-lg-6'><p  class='read-group-lg' name='name' id='upKeyColumn" + i + "'>" + cell[upKeyColumnsIndexes[i]] + "</p></div>" +
                "</div><br>")
        }

        debugger;
        $('#form').append("<div class ='row'>" +
        "<div class='col-lg-6'><label for='valueInput'>" + columns[valueIndex].domain.title.EN
        + "</label></div>" +
        "<div class='col-lg-6'><input type='text' class='input-group-lg' name='name' id='valueInput' value='" +  cell[valueIndex] + "'></div>" +
        "</div><br>")



        for (var i = 0; i < accessorIndexes.length; i++) {
            $('#form').append("<div class ='row'>" +
                "<div class='col-lg-6'><label for='accessorInput" + i + "'>" + columns[accessorIndexes[i]].domain.title.EN
                + "</label></div>" +
                "<div class='col-lg-6'><input type='text' class='input-group-lg' name='name' id='accessorInput" + i + "' value='" + cell[accessorIndexes[i]] + "'></div>" +
                "</div><br>")
        }
/*
        $('#form').append( "<br><div class ='row' id = 'buttons'>"+
            "<div class='col-lg-6'>"+
            " <button type='button' class='btn btn-danger' id='saveButton'>Save</button> </div>"+
            "<div class='col-lg-6'>"+
            "<button type='button' class='btn btn-info' id='resetButton'>Reset</button>"+
            "</div></div>)")*/

        $('#form').append(("</fieldset></form>"))

        $("#dialogForm").dialog({
            title: 'Editor',
            state: "open",
            modal: true,
            height: '400',
            width: "300",
            buttons: [
                {
                    text: 'Save',
                    id: "saveButton",
                    click: function () {
                    if ($.fn.dirtyFields.getDirtyFieldNames($("#dialogForm")).length > 0) {
                        cell[valueIndex] = document.getElementById('valueInput').value;
                        for (var i = 0; i < accessorIndexes.length; i++) {
                            cell[accessorIndexes[i]] = document.getElementById("accessorInput" + i + "").value;
                        }
                        result.changed = true;
                        }
                    }
                },
                {
                    text: 'Reset',
                    id: "resetButton",
                    click: function () {
                        $.fn.dirtyFields.rollbackForm($("#dialogForm"))
                        var n = document.getElementsByClassName("inputGroups");
                        for (var i in  n) {
                            n[i].val = n[i].defaultValue;
                        }
                    }
                }
            ]
         });




    $('#dialogForm').dirtyFields();
       if (result["changed"]) {
        return result;
    }
}


CellEditor.prototype.editOnPopup = function () {
    //TODO
}

CellEditor.prototype.editOnTable = function () {
    //TODO

}

CellEditor.prototype.editOnForm = function () {
    //TODO
}


return CellEditor;
})
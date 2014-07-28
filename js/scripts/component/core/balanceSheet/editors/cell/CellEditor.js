/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery","jquery.dirtyFields"], function($){


    function CellEditor(){}


    CellEditor.prototype.init = function(Configurator, cell, dsd){
        //TODO
        var result = {
            "changed" : false,
            "cell"    : cell
        }

        var $newdiv1 = $( "<div id='dialogForm'></div>" );
        // Only the FIRST ROW column indexes start from 2, it needs to be checked!
        $("#pivotGrid").append($newdiv1)

        var columns = dsd.dsd.columns
        var form =("<form id ='form' role='form' class='col-lg-10'><fieldset>");
        $('#dialogForm').append(form);
        var leftKeyColumnsIndexes = Configurator.getLeftKeyColumn()["leftKeyIndexes"];
        var upKeyColumnsIndexes   = Configurator.getUpKeyColumn()["upKeyIndexes"];
        var valueIndex            = Configurator.getValueIndex();
        var accessorIndexes       = Configurator.getDSDAccessorColumns()["accessorIndexes"]

        for(var i = 0; i<leftKeyColumnsIndexes.length; i++){
            $('#form').append("<label for='leftKeyColumn"+i+"'>"+columns[leftKeyColumnsIndexes[i]].dimension.title.EN
                +"</label><input type='text' name='name' id='leftKeyColumn"+i+"' value='"+cell[leftKeyColumnsIndexes[i]]+"' readonly/>")
        }

        for(var i = 0; i<upKeyColumnsIndexes.length; i++){
            $('#form').append("<label for='upKeyColumn"+i+"'>"+columns[upKeyColumnsIndexes[i]].dimension.title.EN+
                "</label><input type='text' name='name' id = 'upKeyColumn"+i+"' value='"+cell[upKeyColumnsIndexes[i]]+"' readonly/>")
        }

        $('#form').append("<label for='valueInput'>value</label><input class = 'inputGroups' type='text' name='name' id='valueInput' value='"
            +cell[valueIndex]+"'/>");

        for(var i =0;i<accessorIndexes.length; i++) {
            $('#form').append("<label for='accessorInput"+i+"'>accessor</label><input class = 'inputGroups' type='text' id ='accessorInput"+i+"' name='name' value='"
                + cell[accessorIndexes[i]] +"'/>")
        }

        $('#form').append(("</fieldset></form>" ))

        $("#dialogForm").dialog({
            title: 'Editor',
            state: "open",
            modal: true,
            height: '400',
            width: "300",
            buttons: {
                'Save': function() {
                  if($.fn.dirtyFields.getDirtyFieldNames($("#dialogForm")).length >0) {
                      cell[valueIndex] = document.getElementById('valueInput').value;
                      for (var i = 0; i < accessorIndexes.length; i++) {
                          cell[accessorIndexes[i]] = document.getElementById("accessorInput"+i+"").value;
                      }
                    result.changed = true;
                      $(this).dialog( "close" );
                  }
                },
                'Cancel new Values' : function() {
                   $.fn.dirtyFields.rollbackForm($("#dialogForm"))
                        var n = document.getElementsByClassName("inputGroups");
                        for (var i in  n) {
                            n[i].val = n[i].defaultValue;
                        }
                    }
                }
        });



        $('#dialogForm').dirtyFields();
        debugger;
        if(result["changed"]) {
            return result;
        }
    }


    CellEditor.prototype.editOnPopup = function(){
        //TODO
    }

    CellEditor.prototype.editOnTable = function(){
        //TODO

    }

    CellEditor.prototype.editOnForm = function(){
        //TODO
    }


    return CellEditor;
})
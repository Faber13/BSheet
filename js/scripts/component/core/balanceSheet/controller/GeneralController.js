/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery", "view/GridDataView","editor/CellEditor"], function($, GridDataView, Editor){

    var ViewGrid, ModelController, EditorForm, dsd, Configurator;

    function GeneralController(){
        ViewGrid   = new GridDataView;
        EditorForm = new Editor;
    };

    /* Function that it has to do:
        1) initialization of the grid view (OK)
        2) Export/import of the data
        3) manages the life cycle
        4) Manages the communication between different modules
     */


    // It manages the initialization time of the view
    GeneralController.prototype.init = function(componentConfiguration,gridModel, fullTableModel, configurator, typeOfView, modelController){
        ModelController = modelController;
        dsd = configurator.getDSD();
        Configurator = configurator;
        ViewGrid.init(componentConfiguration,gridModel, fullTableModel, configurator, typeOfView)
        var that =this;

        $("#pivotGrid").igPivotGrid({
            pivotGridRendered: function(evt, ui) {that.createListeners()}
        });
    }


    GeneralController.prototype.createListeners = function(){

        var grid = $("#pivotGrid").igPivotGrid("grid");
        var that = this;
        var cell;

        $(document).delegate("#" + grid.id(), "iggridcellclick", function (evt, ui) {
            var cellTableModel = ModelController.getFullTableModel();
            cell = (ui.rowIndex ==0)? cellTableModel[(ui.rowIndex+1) *  (ui.colIndex -2)]:
                    cellTableModel[(ui.rowIndex*(ui.colIndex -1))];
            // Only the FIRST ROW column indexes start from 2, it needs to be checked!
            alert("Cell Clicked. Cell at row index(CreateListeners):" + ui.rowIndex + "  and column index: " + ui.colIndex);
            ui.cellElement.innerText = "BBB"
           that.onclickCell(evt,ui, cell, dsd);
        });
    }


    GeneralController.prototype.exportData = function(){

    }


    GeneralController.prototype.importData = function(){

    }

    GeneralController.prototype.onclickCell = function(evt,ui, cell, dsd){


        EditorForm.init(evt)
        ui.cellElement.innerText = "BBB"

        var $newdiv1 = $( "<div id='dialogForm'></div>" );
        // Only the FIRST ROW column indexes start from 2, it needs to be checked!
        $("#pivotGrid").append($newdiv1)

        var columns = dsd.dsd.columns
        var form =("<form id ='form'><fieldset>");
        $('#dialogForm').append(form);
        var leftKeyColumnsIndexes = Configurator.getLeftKeyColumn()["leftKeyIndexes"];
        var upKeyColumnsIndexes   = Configurator.getUpKeyColumn()["upKeyIndexes"];
        var valueIndex            = Configurator.getValueIndex();
        var accessorIndexes       = Configurator.getDSDAccessorColumns()["accessorIndexes"]

        debugger;
         for(var i = 0; i<leftKeyColumnsIndexes.length; i++){
             $('#form').append("<label for='leftKeyColumn'>"+columns[leftKeyColumnsIndexes[i]].dimension.title.EN+"</label><input type='text' name='name'  value='"+cell[leftKeyColumnsIndexes[i]]+"' readonly/>")

         }

        for(var i = 0; i<upKeyColumnsIndexes.length; i++){
            $('#form').append("<label for='upKeyColumn'>"+columns[upKeyColumnsIndexes[i]].dimension.title.EN+"</label><input type='text' name='name'  value='"+cell[upKeyColumnsIndexes[i]]+"' readonly/>")

        }

         $('#form').append("<label for='value'>value</label><input type='text' name='name' id='valueColumn' value='"+cell[valueIndex]+"'/>");

        debugger;
        for(var i =0;i<accessorIndexes.length; i++) {
            $('#form').append("<label for='accessor'>accessor</label><input type='text' name='name'  value='" + cell[accessorIndexes[i]] +"'/>")
        }

        $('#form').append(("</fieldset></form>" ))

        $("#dialogForm").igDialog({
            state: "open",
            modal: true,
            height: "400px",
            width: "300px"
        });
    }




    return GeneralController;
});
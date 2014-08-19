/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery", "editor/formatter/DatatypesFormatter", "jquery.dirtyFields", "timepicker", "infragistics", "jqwidgets"],
    function ($,Formatter) {

    var formatter, language;

    // ---------------------- SUPPORT FUNCTIONS -------------------------------------------

    Element.prototype.remove = function () {
        this.parentElement.removeChild(this);
    }

    NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    }
    // ------------------------------------------------------------------------------------


    function CellEditor() {}


    CellEditor.prototype.init = function (Configurator, cell, dsd) {

        formatter = new Formatter;
        var configuration        = Configurator.getComponentConfigurator();
        var columns = dsd.dsd.columns
        var leftColumns           = Configurator.getLeftKeyColumn();
        var upColumns             = Configurator.getUpKeyColumn();
        var leftKeyColumnsIndexes = leftColumns["leftKeyIndexes"];
        var upKeyColumnsIndexes   = upColumns["upKeyIndexes"];
        var configurationKeys     = Configurator.getKeyColumnConfiguration();
        var upKeyColumns          = upColumns["upColumns"];
        var leftKeyColumns        = leftColumns["leftColumns"]
        var valueIndex            = Configurator.getValueIndex();
        var accessorIndexes       = Configurator.getDSDAccessorColumns()["accessorIndexes"]
        language              = Configurator.getComponentLanguage();

        var f = document.getElementById("dialogForm");
        if (f !== null) {
            f.remove()
        }

        var $newdiv1 = $("<div id='dialogForm'></div>");
        // Only the FIRST ROW column indexes start from 2, it needs to be checked!
        $("#pivotGrid").append($newdiv1)

        var form = ("<form id ='form' role='form' class='col-lg-10'><fieldset>");
        $('#dialogForm').append(form);
        // leftKeyColumns
        for (var i = 0; i < leftKeyColumnsIndexes.length; i++) {
            // show value in right format
            var valueLeft = formatter.renderRightLabelOrFormatView(cell[leftKeyColumnsIndexes[i]] ,configurationKeys["leftKeyColumnConfiguration"][i],
                leftKeyColumns[i].dataTypes,Configurator)
            $('#form').append("<div class ='row'>" +
                "<div class='col-lg-6'><label for='leftKeyColumn" + i + "'>" + columns[leftKeyColumnsIndexes[i]].domain.title[language]
                + "</label></div>" +
                "<div class='col-lg-6'><p  class='read-group-lg' name='name' id='leftKeyColumn" + i + "'>" + valueLeft + "</p></div>" +
                "</div><br>")
        }
        // upKeyColumns
        for (var i = 0; i < upKeyColumnsIndexes.length; i++) {

               var valueUp = formatter.renderRightLabelOrFormatView(cell[upKeyColumnsIndexes[i]] , configurationKeys["upKeyColumnConfiguration"][i] ,
                   upKeyColumns[i].dataTypes, Configurator  )
                $('#form').append("<div class ='row'>" +
                    "<div class='col-lg-6'><label for='upKeyColumn" + i + "'>" + columns[upKeyColumnsIndexes[i]].domain.title[language]
                    + "</label></div>" +
                    "<div class='col-lg-6'><p  class='read-group-lg' name='name' id='upKeyColumn" + i + "'>" +valueUp + "</p></div>" +
                    "</div><br>")
            }


        // ----------- VALUE COLUMN ---------------------------------
        var toAppend = this.chooseInputFormat(columns[valueIndex], 'valueInput',cell[valueIndex])

        if(columns[valueIndex].dataTypes !== "boolean") {
            // valueColumn
            $('#form').append("<div class ='row'>" +
                "<div class='col-lg-6'><label for='valueInput'>" + columns[valueIndex].domain.title[language]
                + "</label></div>" +
                "<div class='col-lg-6'><input type='text' class='input-group-lg' name='name' id='valueInput' value='" + cell[valueIndex] + "'></div>" +
                "</div><br>")
        }else{
            $('#form').append("<div class ='row'>" +
                "<div class='col-lg-6'><label for='valueInput'>" + columns[valueIndex].domain.title[language]+ "</label></div>");
            if( cell[valueIndex]){
                form.append("<div class='col-lg-6'><input type='checkbox' class='input-group-lg' name='name' id='valueInput' value='" + cell[valueIndex] + "' checked></div>" +
                    "</div><br>")

            }else{
                form.append("<div class='col-lg-6'><input type='checkbox' class='input-group-lg' name='name' id='valueInput' value='" + cell[valueIndex] + "' ></div>" +
                    "</div><br>")
            }
        }
        // accessorColumn
        for (var i = 0; i < accessorIndexes.length; i++) {
            var title = columns[accessorIndexes[i]].domain.title[language];
            var value =  cell[accessorIndexes[i]];
            var columnDSD = columns[accessorIndexes[i]];
            var columnCONF = Configurator.lookForAccessorColumnByIdOnConfiguration(columnDSD.domain.id)

            this.appendRigthInputFormat(title,value,columnDSD,columnCONF, i);

           /* $('#form').append("<div class ='row'>" +
                "<div class='col-lg-6'><label for='accessorInput" + i + "'>" + columns[accessorIndexes[i]].domain.title[language]
                + "</label></div>" +
                "<div class='col-lg-6'><input type='text' class='input-group-lg' name='name' id='accessorInput" + i + "' value='" + cell[accessorIndexes[i]] + "'></div>" +
                "</div><br>")*/
        }
        $('#form').append(("</fieldset></form>"))

        var that = this;

        // Creation of the dialog
        $("#dialogForm").dialog({
            title: 'Editor',
            state: "open",
            modal: true,
            height: '400',
            width: "300",
            background: '#FFFFFF',
            buttons: [
                {
                    text: 'Save',
                    id: "saveButton",
                    click: function () {
                        if ($.fn.dirtyFields.getDirtyFieldNames($("#dialogForm")).length > 0) {
                            debugger;
                            cell[valueIndex] = document.getElementById('valueInput').value;
                            for (var i = 0; i < accessorIndexes.length; i++) {
                                debugger;
                                cell[accessorIndexes[i]] = that.retrieveValueFromCell(columns[accessorIndexes[i]], "accessorInput" + i + "")
                            }
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
            ],
            create: function(){
                document.getElementById("resetButton").className = "btn btn-primary btn-large";
                document.getElementById("saveButton").className = "btn btn-danger btn-large";
            }
        });

        this.chooseInputFormat(columns[valueIndex], 'valueInput' )
        /*for (var i = 0; i < accessorIndexes.length; i++) {
            this.chooseInputFormat(columns[accessorIndexes[i]], 'accessorInput'+i, cell[accessorIndexes[i]])
        }*/
        $('#dialogForm').dirtyFields();
    }


    CellEditor.prototype.renderFormatDate = function (value, configurationKeyColumn, datatype) {

        var result;
        switch (datatype[0]) {
            case "time":
                var date = new Date(value);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "month":
                var year = value.substr(0, 4);
                var month = value.substr(4, 2);
                var date = new Date(year, month - 1);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "year":
                var year = value.substr(0, 4);
                var date = new Date(year);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "date":
                var year = value.substr(0, 4);
                var month = value.substr(4, 2);
                var day = value.substr(6, 2);
                var date = new Date(year, month - 1, day);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;
        }
        return result;
    }


    CellEditor.prototype.retrieveValueFromCell = function( dataType, container){
        var result;
        switch(dataType.dataTypes[0]){
            case "code" || "customCode" || "codeList":
                result =  document.getElementById(container).childNodes[1].value
                break;

            default:
                result = document.getElementById(container).value
                break;
        }
        debugger;
        return result;

    }


    CellEditor.prototype.appendRigthInputFormat = function(title, value, dsdColumn, ConfColumn, index){
        var result;
        switch (dsdColumn.dataTypes[0]) {
            case "time":
               var defaultDate,fromDate, toDate;

                   // if data representation is distinct or hybrid, take the default value from the first element of value
                   if((ConfColumn.values.dataRepresentation == 'distinct' || ConfColumn.values.dataRepresentation == 'hybrid')
                       && typeof dsdColumn.values !== 'undefined' && dsdColumn.values.length >1 ) {
                       var maxLength = dsdColumn.values.length;
                       var yearFrom = dsdColumn.values[0].substr(0, 4);
                       var yearTo = dsdColumn.values[maxLength-1].substr(0, 4);

                       var monthFrom = dsdColumn.values[0].substr(4, 2);
                       var monthTo = dsdColumn.values[maxLength-1].substr(4, 2);

                       var dayFrom = dsdColumn.values[0].substr(6, 4);
                       var dayTo = dsdColumn.values[maxLength-1].substr(6, 4);

                       fromDate = new Date(yearFrom, monthFrom-1, dayFrom);
                       toDate   = new Date(yearTo, monthTo-1, dayTo);
                       // if a value exist, take it as default; otherwise, take the first value available
                       if (typeof value !== 'undefined') {
                           var year = value.substr(0, 4);
                           var month = value.substr(4, 2);
                           var day = value.substr(6, 4);
                           defaultDate = new Date(year, month-1, day);
                       } else {
                           defaultDate = fromDate;
                       }
                   }
                   else{ // else, take defaultDate from the first element of the domain
                       var yearFrom =  dsdColumn.domain.period.from.substr(0, 4);
                       var monthFrom = dsdColumn.domain.period.from.substr(4, 2);
                       var dayFrom =   dsdColumn.domain.period.from.substr(6, 4);
                       // setting the upper bound limit of the date
                       var yearTo =  dsdColumn.domain.period.to.substr(0, 4);
                       var monthTo = dsdColumn.domain.period.to.substr(4, 2);
                       var dayTo =   dsdColumn.domain.period.to.substr(6, 4);
                       fromDate = new Date(yearFrom, monthFrom-1, dayFrom);
                       toDate   = new Date(yearTo, monthTo-1, dayTo);
                       if (typeof value !== 'undefined') {
                           var year = value.substr(0, 4);
                           var month = value.substr(4, 2);
                           var day = value.substr(6, 4);
                           defaultDate = new Date(year, month-1, day);
                       } else {
                           defaultDate = fromDate;
                       }
                   }
               $('#form').append("<div class ='row'>" +
                    "<div class='col-lg-6'><label for='valueInput'>" + title+ "</label></div>");
               $('#form').append( "<div class='col-lg-6'><div class = 'input-group-lg' id='timePicker"+title+"' ></div></div></div>");
               $('#timePicker'+title).jqxDateTimeInput('setMinDate' , fromDate, 'setMaxDate', toDate, 'setDate', defaultDate);
               break;

            case "month":
                var defaultDate,fromDate, toDate;

                // if data representation is distinct or hybrid, take the default value from the first element of value
                if((ConfColumn.values.dataRepresentation == 'distinct' || ConfColumn.values.dataRepresentation == 'hybrid')
                    && typeof dsdColumn.values !== 'undefined' && dsdColumn.values.length >1 ) {
                    var maxLength = dsdColumn.values.length;
                    var yearFrom = dsdColumn.values[0].substr(0, 4);
                    var yearTo = dsdColumn.values[maxLength-1].substr(0, 4);

                    var monthFrom = dsdColumn.values[0].substr(4, 2);
                    var monthTo = dsdColumn.values[maxLength-1].substr(4, 2);

                    fromDate = new Date(yearFrom, monthFrom-1);
                    toDate   = new Date(yearTo, monthTo-1);
                    // if a value exist, take it as default; otherwise, take the first value available
                    if (typeof value !== 'undefined') {
                        var year = value.substr(0, 4);
                        var month = value.substr(4, 2);
                        defaultDate = new Date(year, month-1);
                    } else {
                        defaultDate = fromDate;
                    }
                }
                else{ // else, take defaultDate from the first element of the domain
                    var yearFrom =  dsdColumn.domain.period.from.substr(0, 4);
                    var monthFrom = dsdColumn.domain.period.from.substr(4, 2);
                    // setting the upper bound limit of the date
                    var yearTo =  dsdColumn.domain.period.to.substr(0, 4);
                    var monthTo = dsdColumn.domain.period.to.substr(4, 2);
                    fromDate = new Date(yearFrom, monthFrom-1, dayFrom);
                    toDate   = new Date(yearTo, monthTo-1, dayTo);
                    if (typeof value !== 'undefined') {
                        var year = value.substr(0, 4);
                        var month = value.substr(4, 2);
                        defaultDate = new Date(year, month-1);
                    } else {
                        defaultDate = fromDate;
                    }
                }
                $('#form').append("<div class ='row'>" +
                    "<div class='col-lg-6'><label for='valueInput'>" + title+ "</label></div>");
                $('#form').append( "<div class='col-lg-6'><div class = 'input-group-lg' id='timePicker"+title+"' />");
                $("#jqxdatetimeinput").jqxDateTimeInput('setMinDate' , fromDate, 'setMaxDate', toDate, 'setDate', defaultDate);
                break;

            case "year":
                var defaultDate,fromDate, toDate;

                // if data representation is distinct or hybrid, take the default value from the first element of value
                if((ConfColumn.values.dataRepresentation == 'distinct' || ConfColumn.values.dataRepresentation == 'hybrid')
                    && typeof dsdColumn.values !== 'undefined' && dsdColumn.values.length >1 ) {
                    var maxLength = dsdColumn.values.length;
                    var yearFrom = dsdColumn.values[0].substr(0, 4);
                    var yearTo = dsdColumn.values[maxLength-1].substr(0, 4);

                    fromDate = new Date(yearFrom);
                    toDate   = new Date(yearTo);
                    // if a value exist, take it as default; otherwise, take the first value available
                    if (typeof value !== 'undefined') {
                        var year = value.substr(0, 4);
                        defaultDate = new Date(year);
                    } else {
                        defaultDate = fromDate;
                    }
                }
                else{ // else, take defaultDate from the first element of the domain
                    var yearFrom =  dsdColumn.domain.period.from.substr(0, 4);
                    // setting the upper bound limit of the date
                    var yearTo =  dsdColumn.domain.period.to.substr(0, 4);
                    fromDate = new Date(yearFrom);
                    toDate   = new Date(yearTo);
                    if (typeof value !== 'undefined') {
                        var year = value.substr(0, 4);
                        var month = value.substr(4, 2);
                        defaultDate = new Date(year);
                    } else {
                        defaultDate = fromDate;
                    }
                }
                $('#form').append("<div class ='row'>" +
                    "<div class='col-lg-6'><label for='valueInput'>" + title+ "</label></div>");
                $('#form').append( "<div class='col-lg-6'><div class = 'input-group-lg' id='timePicker"+title+"' />");
                $("#jqxdatetimeinput").jqxDateTimeInput('setMinDate' , fromDate, 'setMaxDate', toDate, 'setDate', defaultDate);
                break;


            case "date":
                var defaultDate,fromDate, toDate;

                // if data representation is distinct or hybrid, take the default value from the first element of value
                if((ConfColumn.values.dataRepresentation == 'distinct' || ConfColumn.values.dataRepresentation == 'hybrid')
                    && typeof dsdColumn.values !== 'undefined' && dsdColumn.values.length >1 ) {
                    var maxLength = dsdColumn.values.length;
                    var yearFrom = dsdColumn.values[0].substr(0, 4);
                    var yearTo = dsdColumn.values[maxLength-1].substr(0, 4);

                    var monthFrom = dsdColumn.values[0].substr(4, 2);
                    var monthTo = dsdColumn.values[maxLength-1].substr(4, 2);

                    var dayFrom = dsdColumn.values[0].substr(6, 4);
                    var dayTo = dsdColumn.values[maxLength-1].substr(6, 4);

                    fromDate = new Date(yearFrom, monthFrom-1, dayFrom);
                    toDate   = new Date(yearTo, monthTo-1, dayTo);
                    // if a value exist, take it as default; otherwise, take the first value available
                    if (typeof value !== 'undefined') {
                        var year = value.substr(0, 4);
                        var month = value.substr(4, 2);
                        var day = value.substr(6, 4);
                        defaultDate = new Date(year, month-1, day);
                    } else {
                        defaultDate = fromDate;
                    }
                }
                else{ // else, take defaultDate from the first element of the domain
                    var yearFrom =  dsdColumn.domain.period.from.substr(0, 4);
                    var monthFrom = dsdColumn.domain.period.from.substr(4, 2);
                    var dayFrom =   dsdColumn.domain.period.from.substr(6, 4);
                    // setting the upper bound limit of the date
                    var yearTo =  dsdColumn.domain.period.to.substr(0, 4);
                    var monthTo = dsdColumn.domain.period.to.substr(4, 2);
                    var dayTo =   dsdColumn.domain.period.to.substr(6, 4);
                    fromDate = new Date(yearFrom, monthFrom-1, dayFrom);
                    toDate   = new Date(yearTo, monthTo-1, dayTo);
                    if (typeof value !== 'undefined') {
                        var year = value.substr(0, 4);
                        var month = value.substr(4, 2);
                        var day = value.substr(6, 4);
                        defaultDate = new Date(year, month-1, day);
                    } else {
                        defaultDate = fromDate;
                    }
                }
                $('#form').append("<div class ='row'>" +
                    "<div class='col-lg-6'><label for='valueInput'>" + title+ "</label></div>"+
                    "<div class='col-lg-6'><div class = 'input-group-lg' id='timePicker"+title+"' /></div></div>");
                $("#timePicker"+title).jqxDateTimeInput({
                    value: defaultDate,
                    min : dayFrom,
                    max : dayTo
                });
                break;

            case "code" || "codeList" || "customCode":
                var codeValue;
                // Prepare the data for Jqwidgets
                var data = dsdColumn.domain.codes;
                var sortedData = data.sort(function(a, b){

                    if ( a.code.title[language] < b.code.title[language] )
                        return -1;
                    if ( a.code.title[language] > b.code.title[language] )
                        return 1;
                    return 0;
                });
                // prepare the data
                var source =
                {
                    datatype: "json",
                    datafields: [
                        { name: 'code', map:"code>code" },
                        { name: 'label', map: "code>title>"+language+"" }
                    ],
                    localdata: sortedData
                };

                for(var i = 0; i< sortedData.length; i++){
                    if(value == sortedData[i].code.code){
                        codeValue = i;
                    }
                }


                var dataAdapter = new $.jqx.dataAdapter(source);

                $('#form').append("<div class ='row'>" +
                    "<div class='col-lg-6'><label for='valueInput'>" + title+ "</label></div>"+
                    "<div class='col-lg-6'><div class = 'input-group-lg' id='accessorInput"+index+"' /></div></div>");

                // comboBox
               $('#accessorInput'+index).jqxComboBox({
                    source: dataAdapter ,
                    displayMember: "label",
                    valueMember: "code",
                    selectedIndex: codeValue,
                    width: '190px',
                    height: '20px'
                })

                break;
            default:

            }
    }


    CellEditor.prototype.chooseInputFormat = function(column,id, value){
        switch(column.dataTypes[0]){

            case "date" :
                $( "#"+id ).datepicker({ altField: "#actualDate" });
                break;

            case "month":
                $( "#"+id ).datepicker({
                    changeMonth: true,
                    changeYear: true,
                    showButtonPanel: true,
                    dateFormat: 'MM yy'
                }).focus(function() {
                    var thisCalendar = $(this);
                    $('.ui-datepicker-calendar').detach();
                    $('.ui-datepicker-close').click(function() {
                        var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                        var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                        thisCalendar.datepicker('setDate', new Date(year, month, 1));
                    });
                });
                break;

            case "time":
                $( "#"+id ).datepicker({ altField: "#actualDate" });
                break;
            case "year":
                $( "#"+id ).spinner({min: column.domain.period.from, max: column.domain.period.to });
                break;
            case "boolean":
                break;

            case ("Number" || "enum"):
                $( "#"+id ).spinner({min: column.domain.period.from, max: column.domain.period.to });
                break;
            case ("code"||"codeList"||"customCode"):

                break;
        }
    }





    return CellEditor;
})
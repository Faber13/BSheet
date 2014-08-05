define(["jquery", "excellentExport"], function($){

    function TableExport(){}

    TableExport.prototype.init = function(table, Configurator){
      var dsd = Configurator.getDSD();
      var language = Configurator.getComponentLanguage();

      var string = "<table id='tablePivot'><tr>"
        for(var i =0; i<dsd.dsd.columns.length; i++) {
            var title = dsd.dsd.columns[i].domain.title[language];
            string += "<th>" + title + "</th>";
        }
        string += "</tr><tr>";
        for(var i = 0; i<table.length; i++){
            for(var j=0; j<table[i].length; j++) {
                string += "<td>" + table[i][j] + "</td>"
            }
            if(i < table.length -1) {
                string += "</tr><tr>";
            }else{
                string += "</tr>";
            }
        }
        string += "</<table>";

        $("#optionPivotGrid").append(string);
        var uri = ' data:application/vnd.ms-excel,'+ $('#tablePivot').html();
        var downloadLink = document.createElement("a");
        downloadLink.href = uri;
        downloadLink.download = "data";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    return TableExport;

})
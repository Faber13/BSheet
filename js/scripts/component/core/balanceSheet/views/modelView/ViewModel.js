define(["jquery"], function ($) {

    var configurator, fullModel, configurationKeys, valueColumn, indexValues, idOlapGrid, accessorMap, dsd;

    function ViewModel() {
    }

    ViewModel.prototype.init = function (tableData, Configurator) {

        configurator = Configurator;
        dsd = configurator.getDSD()
        fullModel = configurator.getAllColumnModels();
        configurationKeys = configurator.getKeyColumnConfiguration();
        valueColumn = configurator.getValueColumnConfiguration();
        accessorMap = configurator.getAccessorMap();
        indexValues = configurator.getValueIndex();
        idOlapGrid = configurator.getIdOlapGrid();
        return this.createViewModel(tableData);

    }

    ViewModel.prototype.createViewModel = function (tableModel) {
        var result = tableModel.slice();
        for (var i = 0; i < tableModel.length; i++) {
            var item = tableModel[i];
            result[i] = this.updateItem(item);
        }
        return result;
    }


    ViewModel.prototype.updateItem = function (item) {
        var result = item.slice()
        fullModel["upColumnsModel"]["upKeyIndexes"]
        var upColumns = fullModel["upColumnsModel"];
        var leftColumns = fullModel["leftColumnsModel"];
        var upKeyIndexes = fullModel["upColumnsModel"]["upKeyIndexes"];
        var leftKeyIndexes = fullModel["leftColumnsModel"]["leftKeyIndexes"];
        var leftConf = configurationKeys["leftKeyColumnConfiguration"];
        var upConf = configurationKeys["upKeyColumnConfiguration"];

        // UpPIVOT
        for (var i = 0; i < upKeyIndexes.length; i++) {
            var datatype = fullModel["upColumnsModel"]["upColumns"][i].dataTypes;
            if (datatype == "date" || datatype == "time" || datatype == "month" || datatype == "year") {
                result[upKeyIndexes[i]] = this.renderFormatDate(item[upKeyIndexes[i]], upConf[i], datatype)
            }
            else if (datatype == "code" || datatype == "codeList" || datatype == "customCode") {
                var columnCodes = configurator.lookForCode(upColumns.upColumns[i].domain.id) ;
                if(typeof columnCodes === 'undefined') {
                    configurator.createMapCodes(upColumns.upColumns[i], upConf[i])
                    columnCodes = configurator.lookForCode(upColumns.upColumns[i].domain.id)
                }
                result[upKeyIndexes[i]] = columnCodes.mapCodeLabel[item[upKeyIndexes[i]]]
            }
            else {
                result[upKeyIndexes[i]] = item[upKeyIndexes[i]]
            }
        }
        // left KEY
        for (var i = 0; i < upKeyIndexes.length; i++) {
            // for now simple
            var datatype = fullModel["leftColumnsModel"]["leftColumns"][i].dataTypes;
            if (datatype == "date" || datatype == "time" || datatype == "month" || datatype == "year") {
                result[leftKeyIndexes[i]] = this.renderFormatDate(item[leftKeyIndexes[i]], leftConf[i], datatype)
            }
            else if (datatype == "code" || datatype == "codeList" || datatype == "customCode") {
                var columnCodes = configurator.lookForCode(leftColumns.leftColumns[i].domain.id) ;
                if(typeof columnCodes === 'undefined') {
                    configurator.createMapCodes(leftColumns.leftColumns[i], leftConf[i])
                    columnCodes = configurator.lookForCode(leftColumns.leftColumns[i].domain.id)
                }
                result[leftKeyIndexes[i]] = columnCodes.mapCodeLabel[item[leftKeyIndexes[i]]];
            }
            else {
                result[leftKeyIndexes[i]] = item[leftKeyIndexes[i]]
            }
        }
        result[indexValues] = this.expressionLanguage(valueColumn, indexValues, item);
        return result;
    }

    ViewModel.prototype.expressionLanguage = function (columnValue, indexValue, item) {

        var conditionRegExpression = /(#(\w+)(\|))/;
        var valuesRegExpression = /(((\W)|(\s))*(\$\w+)((\W)|(\s))*(\~))/;
        var onlyValue = /(\$\w+)/;
        var result = "";

        var expression = columnValue.label;
        while (expression != "" && expression != "|") {
            var firstCondition = expression.match(conditionRegExpression)[0]
            expression = expression.replace(conditionRegExpression, "")
            firstCondition = firstCondition.slice(0, -1);
            if (firstCondition.substring(1) == "value") {
                if (typeof item[indexValue] !== 'undefined') {
                    var secondCondition = expression.match(valuesRegExpression)[0];
                    expression = expression.replace(valuesRegExpression, "")
                    secondCondition = secondCondition.slice(0, -1);
                    var stringAppend = secondCondition.replace(onlyValue, function (match) {
                        var returnedValue;
                        returnedValue = (match.substring(1) == "value") ? item[indexValue] : item[accessorMap[match.substring(1)]];
                        return returnedValue;
                    })
                    result += stringAppend;
                }
                else {
                    break;
                }
            }
            else {
                if (typeof item[accessorMap[firstCondition.substring(1)]] !== 'undefined') {
                    var secondCondition = expression.match(valuesRegExpression)[0];
                    expression = expression.replace(valuesRegExpression, "")
                    secondCondition = secondCondition.slice(0, -1);
                    var stringAppend = secondCondition.replace(onlyValue, function (match) {
                        var returnedValue;
                        returnedValue = (match.substring(1) == "value") ? item[indexValue] : item[accessorMap[match.substring(1)]];
                        return returnedValue;
                    })
                    result += stringAppend;
                }
                else {
                    expression = expression.replace(valuesRegExpression, "")
                }
            }
        }
        return result;
    }


    ViewModel.prototype.renderFormatDate = function (value, configurationKeyColumn, datatype) {

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


    ViewModel.prototype.renderCode = function (value) {


    }

    return ViewModel;
})
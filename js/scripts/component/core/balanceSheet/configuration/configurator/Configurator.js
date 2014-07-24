/**
 * Created by fabrizio on 7/10/14.
 */
define(['jquery'], function($){


   var  leftKeyColumns,              // DSD columns that represent the left key columns
        leftKeyIndexes,              // Index of the left key columns on the DSD
        upKeyColumns,                // DSD columns that represent the up key columns
        upKeyIndexes,                // DSD columns that represent the up key indexes
        accessorIndexes,             // Indexes that indicate the position of the accessor column on the data
        accessorColumns,             // Accessor Columns from DSD
        dsdConf,                     // DSD
        compConfiguration,
        lefKeyColumnConfiguration,   // Left key columns on the configuration ordered with DSD
        upKeyColumnConfiguration,    // Up key columns on the configuration ordered with DSD
        indexValueColumns,
        accessorMap;                 // It is a map with KEYS = titles of accessor fields and
                                     // VALUES = indexes on the DSD structure

    function Configurator(){}


    Configurator.prototype.init = function(dsd, component){
        dsdConf = dsd;
        compConfiguration = component;
        this.createKeyMatrixes();
    }


    Configurator.prototype.createKeyMatrixes = function(){
        lefKeyColumnConfiguration = [];
        leftKeyColumns = []
        leftKeyIndexes = []
        upKeyColumnConfiguration = [];
        upKeyColumns = []
        upKeyIndexes = [],
        accessorMap  = {},
        accessorColumns = [];
        accessorIndexes = []


        var configuration= $.extend(true,{},compConfiguration);
        console.log(configuration)

        for (var i = 0; i < dsdConf.dsd.columns.length; i++) {
            if (dsdConf.dsd.columns[i].domain.key) {
                var found = false;
                for (var k = 0; k < configuration.gridConfiguration.columnsKey.left.length &&
                    !found; k++) {
                    if (configuration.gridConfiguration.columnsKey.left[k].columnId ==
                        dsdConf.dsd.columns[i].domain.id) {
                        lefKeyColumnConfiguration.push(configuration.gridConfiguration.columnsKey.left.splice(k,1)[0])
                        leftKeyColumns.push(dsdConf.dsd.columns[i])
                        leftKeyIndexes.push(i);
                        found = true;
                    }
                }

                for (var k = 0; k < configuration.gridConfiguration.columnsKey.up.length &&
                    !found; k++) {
                    if (configuration.gridConfiguration.columnsKey.up[k].columnId ==
                        dsdConf.dsd.columns[i].domain.id) {
                        upKeyColumnConfiguration.push(configuration.gridConfiguration.columnsKey.up.splice(k,1)[0])
                        upKeyColumns.push(dsdConf.dsd.columns[i])
                        upKeyIndexes.push(i);
                        found = true;
                    }
                }
            }      // Column Value
            else if (dsdConf.dsd.columns[i].dimension.title.EN == "value") {
                indexValueColumns = i;
            }
            else { // Accessor Columns
                accessorMap[dsdConf.dsd.columns[i].dimension.title.EN] = i;
                accessorColumns.push(dsdConf.dsd.columns[i]);
                accessorIndexes.push(i);
            }
        }

    }


    Configurator.prototype.getLeftKeyColumn = function(){

        var leftKeyColumn;
        leftKeyColumn = {
            "leftColumns": leftKeyColumns,
            "leftKeyIndexes": leftKeyIndexes
        }

        return leftKeyColumn;
    }


    Configurator.prototype.getUpKeyColumn = function(){

        var upKeyColumn;
        upKeyColumn = {
            "upColumns": upKeyColumns,
            "upKeyIndexes": upKeyIndexes
        }
        return upKeyColumn;
    }


    Configurator.prototype.getDSDtoConfigurationKeyColumns = function(){

        var keyColumns ;
        keyColumns = {
            "leftColumns": leftKeyColumns,
            "leftKeyIndexes": leftKeyIndexes,
            "upColumns": upKeyColumns,
            "upKeyIndexes": upKeyIndexes
        }
        return keyColumns;
    }


    Configurator.prototype.getDSDAccessorColumns = function(){

        var accessorsObject
        accessorsObject = {
            "accessorColumns" : accessorColumns,
            "accessorIndexes": accessorIndexes
        }

        return accessorsObject;

    }


    Configurator.prototype.getValueIndex = function(){
        return indexValueColumns;
    }


    Configurator.prototype.getAllColumnModels = function(){

        var allColumnsModel = {
            "leftColumnsModel"      : this.getLeftKeyColumn(),
            "upColumnsModel"        : this.getUpKeyColumn(),
            "accessorColumnsModel"  : this.getDSDAccessorColumns(),
            "valueColumnsModel"     : this.getValueIndex()
        }
        return allColumnsModel;
    }


    Configurator.prototype.getKeyColumnConfiguration = function(){

        var keyColumnConf = {
            "lefKeyColumnConfiguration" : lefKeyColumnConfiguration,
            "upKeyColumnConfiguration"  : upKeyColumnConfiguration
        }

        return keyColumnConf;
    }


    Configurator.prototype.getAccessorMap = function(){
        return accessorMap;
    }


    Configurator.prototype.getValueColumnConfiguration = function(){
       var result = compConfiguration.gridConfiguration.otherColumns.valueColumn;
       return result;
    }


    Configurator.prototype.getIdOlapGrid = function(){
        var result = compConfiguration.gridConfiguration.HTMLproperties.idGrid;
        return result;
    }


    Configurator.prototype.getDSD = function(){
        var result = dsdConf;
        return result;
    }


    Configurator.prototype.getComponentConfigurator = function(){
        var result = compConfiguration;
        return result;
    }


    return Configurator;

})
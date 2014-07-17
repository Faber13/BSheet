
define(["balanceSheet/BalanceSheet"], function( BalanceSheet ) {

    var balanceSheet;

    function IndexContext(){
        balanceSheet = new BalanceSheet;
    };

    IndexContext.prototype.init = function() {
        balanceSheet.init();
    };

    return IndexContext;

});
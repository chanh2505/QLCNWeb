/// <reference path="G:\Work\HOME\QLCNWeb\QLCNWeb\bower_components/jquery/src/jquery.js" />

String.format = function () {
    var args = arguments;
    var str = args[0];
    return str.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
        if (m === "{{") { return "{"; }
        if (m === "}}") { return "}"; }
        var index = 0;
        n = parseInt(n);
        return args[n + 1];
    });
};

function getString(str) {
    return str && str.toString().length > 0 ? str.toString() : "";
}
function getNumberStr(num) {
    var res="0";
    if (num) {
        res = getString(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
    return res;
}
function getNumber(val) {
    var result = 0;
    if (val && ($.isNumeric(val) || (typeof (val) == 'string'))) {
        val = val.toString().replace(new RegExp(/,/g), "");
        result = parseFloat(val);
        result = isNaN(result) ? 0 : result;
    }
    return result;
}

function getBool(val) {
    var result = false;
    return val && (val == 1 || val == "1" || val == true || val.toLowerCase() == "true") ? true : false;
}


function showWaitDialog() {
    try {
        var parentBody = window.parent.document.body;
        var waiting = $(parentBody).find(".waiting-wrapper");
        if (waiting.length == 0) {
            $(parentBody).append("<div class='waiting-overlay ms-dlgOverlay'></div><div class='waiting-wrapper'><div><div><img src='./imgs/waiting.gif' width=125px/></div></div></div>");
        }
        $(window.parent.document).find(".waiting-wrapper,.waiting-overlay").show();
        //if (callFunction && typeof (callFunction) == 'function') {
        //    setTimeout(callFunction, 500);
        //}
        //else {
        //    setTimeout(500);
        //}

    } catch (ex) { }
}

function closeWaitDialog() {
    try {
        var parentBody = window.parent.document;
        $(parentBody).find(".waiting-wrapper,.waiting-overlay").hide();
    } catch (ex) { }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
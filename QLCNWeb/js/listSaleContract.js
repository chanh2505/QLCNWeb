/// <reference path="../bower_components/bootbox/bootbox.js" />
/// <reference path="common.js" />
/// <reference path="G:\Work\HOME\QLCNWeb\QLCNWeb\bower_components/jquery/dist/jquery.min.js" />
/// <reference path="contract.js" />

var contractController;
$(document).ready(function () {
    groupElements = {
        form: $("#contract_container"),
        tbContract: $("#tbContract")
    };

    var tableSortOptions = {
        theme: 'green',
        widthFixed: false,
        widgets: ['zebra', 'resizable', 'filter'],
        widgetOptions: {
            resizable: true,
            // These are the default column widths which are used when the table is
            // initialized or resizing is reset; note that the "Age" column is not
            // resizable, but the width can still be set to 40px here
            resizable_widths: ['25%', '10%', '25%', '20%', '10%', '10%']
        }
    };
    var pagerOptions = {
        container: $(".pager"),
        output: 'Page {page:input} of {totalPages}',
        page: 0,
        size: 10,
        savePages: true,
        pageReset: 0,
        removeRows: false,
        cssNext: '.next', // next page arrow
        cssPrev: '.prev', // previous page arrow
        cssFirst: '.first', // go to first page arrow
        cssLast: '.last', // go to last page arrow
        cssPageDisplay: '.pagedisplay', // location of where the "output" is displayed
        cssPageSize: '.pagesize', // page size selector - select dropdown that sets the "size" option
        cssDisabled: 'disabled', // Note there is no period "." in front of this class name
        cssErrorRow: 'tablesorter-errorRow'
    };
    
    contractController = new ContractController(false);
    contractController.getAllContract(groupElements.tbContract).done(function () {
        groupElements.tbContract.tablesorter(tableSortOptions).tablesorterPager(pagerOptions);
    });
});

/// <reference path="../bower_components/bootbox/bootbox.js" />
/// <reference path="common.js" />
/// <reference path="G:\Work\HOME\QLCNWeb\QLCNWeb\bower_components/jquery/dist/jquery.min.js" />

var groupElements;
var currentItem;
$(document).ready(function () {
    groupElements = {
        form: $("#partner_container"),
        btnSave: $("#btnSave"),
        txtCompanyName: $('#txtCompanyName'),
        txtRepName: $("#txtRepName"),
        txtDebt: $("#txtDebt"),
        txtCompanyPhone: $("#txtCompanyPhone"),
        txtRepPhone: $("#txtRepPhone"),
        txtAddress: $("#txtAddress"),
        txtMST: $("#txtMST"),
        tbProduct: $("#tbProduct"),
        btnClear:$("#btnClear")
    };

    initFormValidation();
    // initTextboxNumber();
    initEvents();

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
    groupElements.tbProduct.tablesorter(tableSortOptions).tablesorterPager(pagerOptions);
});

function initEvents() {
    showWaitDialog();
    initEventSaveButton();
    initEventClearButton();
    initAutoNumeric();
    getAllPartners().done(function () {
        closeWaitDialog();
    });
}
function initEventClearButton() {
    groupElements.btnClear.on('click', function () {
        clear();
    });
}
function getAllPartners() {
    var defer = $.Deferred();
    $.ajax({
        contentType: "application/json",
        dataType: "json",
        method: "POST",
        url: "http://localhost:4221/Service.svc/GetAllPartners",
        data: JSON.stringify({ IsSupplier: false })
    }).done(function (data) {
        var html = "";
        if (data && data.length > 0) {
            $.each(data, function (i, item) {
                var row = "";
                row += String.format("<td>{0}</td>", getString(item.CompanyName));
                row += String.format("<td>{0}</td>", getString(item.TaxCode));
                row += String.format("<td>{0}</td>", getString(item.RepName));
                row += String.format("<td>{0}</td>", getString(item.Address));
                row += String.format("<td>{0}</td>", getNumberStr(item.Debt));
                row += String.format("<td><a href='javascript:void(0)' onclick='EditPartner({0})'>{1}</a> | <a href='javascript:void(0)' onclick='DeletePartner({2})'>{3}</a></td>", JSON.stringify(item), "Sửa", item.ID, "Xóa");
                html += String.format("<tr pId='{0}'>{1}</tr>", item.ID, row);
            });
        }
        else {
            html += String.format("<tr><td colspan=5>{0}</td></tr>", "Hiện không có sản phẩm nào!");
        }
        groupElements.tbProduct.find("tbody").html(html);
        groupElements.tbProduct.trigger("page", 0).trigger("update");
        defer.resolve();
    }).fail(function (b) {
    });
    return defer.promise();
}

function EditPartner(json) {
    var item = json;
    if (item) {
        currentItem = item;
        groupElements.txtCompanyName.val(getString(item.CompanyName));
        groupElements.txtCompanyPhone.val(getString(item.CompanyPhone));
        groupElements.txtDebt.val(getNumberStr(item.Debt));
        groupElements.txtAddress.val(getString(item.Address));
        groupElements.txtMST.val(getString(item.TaxCode));
        groupElements.txtRepName.val(getString(item.RepName));
        groupElements.txtRepPhone.val(getString(item.Mobile));
    }
}

function DeletePartner(id) {
    if (id > 0) {

        bootbox.dialog({
            size: "large",
            title: "Cảnh báo",
            message: "Thao tác này sẽ không hoàn lại được, bạn có chắc chắn muốn xóa?",
            buttons: {
                success: {
                    label: 'Có',
                    className: 'btn-success',
                    callback: function () {
                        showWaitDialog();
                        $.ajax({
                            contentType: "application/json",
                            dataType: "json",
                            method: "POST",
                            url: "http://localhost:4221/Service.svc/DeletePartner",
                            data: JSON.stringify({ ID: id })
                        }).done(function (data) {
                            closeWaitDialog();
                            if (data == "1") {
                                groupElements.tbProduct.find("tbody tr[pId='" + id + "']").remove();
                                bootbox.alert("Đã xóa khách hàng thành công!");
                            }
                            else if(data == "0")
                            {
                                bootbox.alert("Không thể xóa khách hàng đã có giao dịch!");
                            }
                            else
                            {
                                bootbox.alert("Có lỗi xảy ra trong quá trình, vui lòng liên hệ admin để được hỗ trợ!");
                            }
                        });
                    }
                },
                cancel: {
                    label: 'Không',
                    className: 'btn-danger'
                }
            },
        });
    }
}

function initEventSaveButton() {
    groupElements.btnSave.on('click', function () {
        showWaitDialog();
        if (groupElements.form.valid()) {
            var partner = {};
            if (currentItem && currentItem.ID > 0) {
                partner = currentItem;
            }
            partner.CompanyName = groupElements.txtCompanyName.val();
            partner.CompanyPhone = groupElements.txtCompanyPhone.val();
            partner.Address = groupElements.txtAddress.val();
            partner.Debt = groupElements.txtDebt.autoNumeric('get');
            partner.TaxCode = groupElements.txtMST.val();
            partner.RepName = groupElements.txtRepName.val();
            partner.Mobile = groupElements.txtRepPhone.val();
            $.ajax({
                contentType: "application/json",
                dataType: "json",
                method: "POST",
                url: "http://localhost:4221/Service.svc/SavePartner",
                data: JSON.stringify(partner)
            }).done(function (data) {
                if (data && data.ID > 0) {
                    if (currentItem && currentItem.ID > 0) {
                        bootbox.alert("Đã cập nhật khách hàng thành công!!!");
                    }
                    else {
                        bootbox.alert("Đã thêm khách hàng thành công!!!");
                        clear();
                    }
                    getAllPartners().done(function () {
                        closeWaitDialog();
                    });
                }
                else {
                    closeWaitDialog();
                    bootbox.alert("Thêm khách hàng thất bại, liên hệ admin để được hỗ trợ!!!");
                }
            }).fail(function (b) {
                closeWaitDialog();
                bootbox.alert("Thêm khách hàng thất bại, liên hệ admin để được hỗ trợ!!!");
            });
        }
    });
}

function initAutoNumeric() {
    groupElements.txtDebt.autoNumeric('init', {
        mDec: 0,
        aForm: false,
        vMin: 0
    });
}

function initFormValidation() {
    // Init method "greaterThan" by extend the method of jquery.validate    
    $.validator.addMethod("greaterThanZero", function (value, element) {
        return this.optional(element) || (parseFloat(value) > 0);
    }, "Number of copy must be greater than zero");
    // Init method "checkboxRequired"
    $.validator.addMethod("checkboxRequired", function (value, elementtxt, elementcb) {
        if ($(elementcb).is(':checked'))
            return this.optional(elementtxt);
    });

    groupElements.form.validate({
        errorClass: "error_form",
        errorElement: "span",
        rules: {
            Name: "required",
            UOM: "required",
            Price: {
                required: true,
                greaterThanZero: false
            },
            Code: "required"
        },
        messages: {
            CompanyName: "Vui lòng nhập tên công ty",
            RepName: "Vui lòng nhập tên người đại diện",
            RepPhone: "Vui lòng nhập số điện thoại người liên hệ ",
            MST: "Vui lòng nhập mã số thuế"
        },
        invalidHandler: function (form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {
                validator.errorList[0].element.focus();
            }
        }
    });
}

function clear()
{
    currentItem = null;
    groupElements.txtAddress.val("");
    groupElements.txtCompanyName.val("");
    groupElements.txtCompanyPhone.val("");
    groupElements.txtDebt.val(0);
    groupElements.txtMST.val("");
    groupElements.txtRepName.val("");
    groupElements.txtRepPhone.val("");
}
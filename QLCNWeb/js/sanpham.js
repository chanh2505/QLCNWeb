/// <reference path="../bower_components/bootbox/bootbox.js" />
/// <reference path="common.js" />
/// <reference path="G:\Work\HOME\QLCNWeb\QLCNWeb\bower_components/jquery/dist/jquery.min.js" />

var groupElements;
var currentItem;
$(document).ready(function () {
    groupElements = {
        form: $("#product_container"),
        btnSave: $("#btnSave"),
        txtPrice: $('#txtPrice'),
        txtName: $("#txtName"),
        txtCode: $("#txtCode"),
        txtUnit: $("#txtUOM"),
        tbProduct: $("#tbProduct")
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
            resizable_widths: ['10%', '30%', '20%', '20%', '10%', '5%']
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
    initAutoNumeric();
    getAllProduct().done(function () {
        closeWaitDialog();
    });
}

function getAllProduct() {
    var defer = $.Deferred();
    $.ajax({
        contentType: "application/json",
        dataType: "json",
        method: "GET",
        url: "http://localhost:4221/Service.svc/GetAllProduct"
    }).done(function (data) {
        var html = "";
        if (data && data.length > 0) {
            $.each(data, function (i, item) {
                var row = "";
                row += String.format("<td>{0}</td>", item.ProductCode);
                row += String.format("<td>{0}</td>", item.ProductName);
                row += String.format("<td>{0}</td>", item.Unit);
                row += String.format("<td>{0}</td>", item.Price);
                row += String.format("<td><a href='javascript:void(0)' onclick='EditProduct({0})'>{1}</a> | <a href='javascript:void(0)' onclick='DeleteProduct({2})'>{3}</a></td>", JSON.stringify(item), "Sửa", item.ID, "Xóa");
                html += String.format("<tr pId='{0}'>{1}</tr>",item.ID, row);
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

function EditProduct(json) {
    var item = json;
    if (item) {
        currentItem = item;
        groupElements.txtCode.val(item.ProductCode);
        groupElements.txtName.val(item.ProductName);
        groupElements.txtPrice.val(item.Price.toLocaleString('en-US', {
            maximumFractionDigits: 0
        }).split(".")[0]);
        groupElements.txtUnit.val(item.Unit);
    }
}

function DeleteProduct(id)
{
    if(id > 0)
    {

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
                            url: "http://localhost:4221/Service.svc/DeleteProduct",
                            data: JSON.stringify({ID:id})
                        }).done(function (data) {
                            closeWaitDialog();
                            if(data == true)
                            {
                                groupElements.tbProduct.find("tbody tr[pId='" + id + "']").remove();
                                bootbox.alert("Đã xóa sản phẩm thành công!");                                
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
            var product = {};
            if (currentItem && currentItem.ID > 0) {
                product = currentItem;
            }
            product.ProductName = groupElements.txtName.val();
            product.ProductCode = groupElements.txtCode.val();
            product.Price = groupElements.txtPrice.autoNumeric('get');
            product.Unit = groupElements.txtUnit.val();
            $.ajax({
                contentType: "application/json",
                dataType: "json",
                method: "POST",
                url: "http://localhost:4221/Service.svc/SaveProduct",
                data: JSON.stringify(product)
            }).done(function (data) {
                if (data && data.ID > 0) {
                    if (currentItem && currentItem.ID > 0) {
                        bootbox.alert("Đã cập nhật sản phẩm thành công!!!");
                    }
                    else {
                        bootbox.alert("Đã thêm sản phẩm thành công!!!");
                    }
                    getAllProduct().done(function () {
                        closeWaitDialog();
                    });
                }
                else {
                    closeWaitDialog();
                    bootbox.alert("Thêm sản phẩm thất bại, liên hệ admin để được hỗ trợ!!!");

                }
            }).fail(function (b) {
                closeWaitDialog();
                bootbox.alert("Thêm sản phẩm thất bại, liên hệ admin để được hỗ trợ!!!");
            });
        }
    });
}

function initAutoNumeric() {
    groupElements.txtPrice.autoNumeric('init', {
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
            Name: "Vui lòng nhập tên sản phẩm",
            UOM: "Vui lòng nhập đơn vị tính ",
            Price: {
                required: "Vui lòng nhập giá sản phẩm",
                greaterThanZero: "Number of copy must be greater than zero"
            },
            Code: "Vui lòng nhập mã sản phẩm"
        },
        invalidHandler: function (form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {
                validator.errorList[0].element.focus();
            }
        }
    });
}
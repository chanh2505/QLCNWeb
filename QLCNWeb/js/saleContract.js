/// <reference path="/bower_components/bootbox/bootbox.js" />
/// <reference path="common.js" />
/// <reference path="/bower_components/jquery/dist/jquery.min.js" />
/// <reference path="contract.js" />
/// <reference path="/Scripts/jslinq.js" />

var groupElements;
var currentItem;
var dialog;
var contractController;
var product = [];

$(document).ready(function () {
    groupElements = {
        form: $("#partner_container"),
        btnSave: $("#btnSave"),
        ddlPartner: $('#slPartner'),
        txtContractNo: $("#txtContractNo"),
        txtFromDate: $("#txtFromDate"),
        txtTodate: $("#txtTodate"),
        txtTotalPrice: $("#txtTotalPrice"),
        txtTotalPriceVat: $("#txtTotalPriceVat"),
        txtPaid: $("#txtPaid"),
        txtDebt: $("#txtDebt"),
        ddlProduct: $("#slProduct"),
        tbProduct: $("#tbProduct"),
        dialogForm: $("#productForm"),
        txtPrice: $("#txtPrice"),
        txtAmount: $("#txtAmount"),
        txtTotalPrice: $("#txtTotalPrice"),
        txtTotalProductPrice: $("#txtTotalProductPrice"),
        checkVat: $("#VAT"),
        btnClear: $("#btnClear")
    };


    dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 300,
        width: 500,
        modal: true,
        buttons: {
            "Thêm sản phẩm": addProduct,
            Cancel: function () {
                dialog.dialog("close");
            }
        },
        close: function () {
            $(groupElements.dialogForm)[0].reset();
        }
    });
    contractController = new ContractController(true);
    initFormValidation();
    // initTextboxNumber();
    initEvents();
    onLoad();
});

function addProduct() {
    var newProduct = {
        ProductId: groupElements.ddlProduct.find("option:selected").val(),
        Price: groupElements.txtPrice.autoNumeric('get'),
        TotalPrice: groupElements.txtTotalProductPrice.autoNumeric('get'),
        Amount: groupElements.txtAmount.autoNumeric('get')
    }
    product.push(newProduct);
    var trProductHtml = "";
    trProductHtml += String.format("<td>{0}</td>", groupElements.ddlProduct.find("option:selected").text());
    trProductHtml += String.format("<td>{0}</td>", newProduct.Price);
    trProductHtml += String.format("<td>{0}</td>", newProduct.Amount);
    trProductHtml += String.format("<td>{0}</td>", newProduct.TotalPrice);
    trProductHtml += String.format("<td><a href='javascript:void(0)' onclick='DeleteProduct({0})'>Xóa</a></td>", newProduct.ProductId);
    groupElements.tbProduct.find("tbody").append(String.format("<tr>{0}</tr>", trProductHtml));
    groupElements.tbProduct.find("tbody").trigger("update");
    dialog.dialog("close");
    calTotalValueContract();
}

function showPopupAddProduct() {
    dialog.dialog("open");
}

function onLoad() {
    var id = getNumber(getParameterByName("id"));
    var tasks = [];
    tasks.push(contractController.bindAllProductToDDL(groupElements.ddlProduct));
    tasks.push(contractController.bindAllPartnerToDDL(groupElements.ddlPartner));
    $.when.apply($, tasks).done(function () {
        if (id > 0) {
            contractController.getContractById({ id: id }).done(function (contract) {
                if(contract && contract.ID > 0)
                {
                    currentItem = contract;
                    groupElements.ddlPartner.find("option[value = '" + contract.Partner + "']").prop("selected", true);
                    groupElements.txtContractNo.val(getString(contract.ContractNo));
                    groupElements.txtTotalPrice.val(getNumberStr(contract.TotalValue));
                    groupElements.checkVat.prop("checked", getBool(contract.IncludedVat));
                    groupElements.txtDebt.val(getNumberStr(contract.Debt));
                    groupElements.txtPaid.val(getNumberStr(contract.Paid));
                    bindProductToGrid(contract.listProduct);
                }
            });
        }
    });
}
function bindProductToGrid(list)
{
    if(list && list.length > 0)
    {
        var tbody = "";
        $.each(list, function (i, item) {
            product.push(item);
            var row = "";
            var productInfo = $linq(contractController.listProduct).firstOrDefault({}, "p=>p.ID ==" + item.ProductId);
            row += String.format("<td>{0}</td>", getString(productInfo.ProductName));
            row += String.format("<td>{0}</td>", item.Price);
            row += String.format("<td>{0}</td>", item.Amount);
            row += String.format("<td>{0}</td>", item.TotalPrice);
            row += String.format("<td><a href='javascript:void(0)' onclick='DeleteProduct({0})'>Xóa</a></td>", item.ProductId);
            tbody += String.format("<tr>{0}</tr>", row);
        });

        groupElements.tbProduct.find("tbody").html(tbody);
        groupElements.tbProduct.find("tbody").trigger("update");
    }
}
function initEvents() {
    showWaitDialog();
    $(".date").datetimepicker({
        format: "DD/MM/YYYY"
    });
    initEventSaveButton();
    initEventClearButton();
    initAutoNumeric();
    initVAT();
    initEventCalTotalPrice();
    closeWaitDialog();
}
function initVAT() {
    groupElements.checkVat.on('change', function () {
        calTotalValueContract();
    });
}

function calTotalValueContract() {
    var total = 0;
    $.each(product, function (i, item) {
        total += getNumber(item.TotalPrice);
    });
    groupElements.txtTotalPrice.val(getNumberStr(total));
    if (groupElements.checkVat.is(":checked") == true) {
        total += total * 10 / 100;
        groupElements.txtTotalPriceVat.val(getNumberStr(total));
    }

}

function initEventCalTotalPrice() {
    groupElements.txtAmount.on('change', function () {
        calTotalPrice();
    });
    groupElements.txtPrice.on('change', function () {
        calTotalPrice();
    });
}

function calTotalPrice() {
    var amount = groupElements.txtAmount.val();
    var price = groupElements.txtPrice.val();
    if (amount && price) {
        var total = getNumber(amount) * getNumber(price);
        groupElements.txtTotalProductPrice.val(getNumberStr(total));
    }
}
function initEventClearButton() {
    groupElements.btnClear.on('click', function () {
        clear();
    });
}

function EditPartner(json) {
    var item = json;
    if (item) {
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
                            else if (data == "0") {
                                bootbox.alert("Không thể xóa khách hàng đã có giao dịch!");
                            }
                            else {
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
            var contract = {};
            if (currentItem && currentItem.ID > 0) {
                contract = currentItem;
            }
            if (product && product.length > 0) {
                var partnerName = "";
                var tmp = groupElements.ddlPartner.find("option:selected").text();
                if (tmp && tmp.indexOf(" - ") >= 0) {
                    partnerName = tmp.split(" - ")[0];
                }
                contract.Partner = groupElements.ddlPartner.find("option:selected").val();
                contract.PartnerName = getString(partnerName);
                contract.ContractNo = groupElements.txtContractNo.val();
                contract.Paid = groupElements.txtPaid.autoNumeric('get');
                contract.Debt = groupElements.txtDebt.autoNumeric('get');
                contract.IncludedVat = groupElements.checkVat.is(":checked");
                contract.TotalValue = contract.IncludedVat ? groupElements.txtTotalPriceVat.autoNumeric('get') : groupElements.txtTotalPrice.autoNumeric('get');
                contract.listProduct = product;
                contract.IsSale = true;
                $.ajax({
                    contentType: "application/json",
                    dataType: "json",
                    method: "POST",
                    url: "http://localhost:4221/Service.svc/SaveContract",
                    data: JSON.stringify(contract)
                }).done(function (data) {
                    if (data && data.ID > 0) {
                        if (currentItem && currentItem.ID > 0) {
                            bootbox.alert("Đã cập nhật đơn hàng thành công!!!");
                        }
                        else {
                            bootbox.alert("Đã thêm đơn hàng thành công!!!");
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
        }
    });
}

function initAutoNumeric() {
    groupElements.txtDebt.autoNumeric('init', {
        mDec: 0,
        aForm: false,
        vMin: 0
    });
    groupElements.txtPaid.autoNumeric('init', {
        mDec: 0,
        aForm: false,
        vMin: 0
    });
    groupElements.txtAmount.autoNumeric('init', {
        mDec: 0,
        aForm: false,
        vMin: 0
    });
    groupElements.txtPrice.autoNumeric('init', {
        mDec: 0,
        aForm: false,
        vMin: 0
    });
    groupElements.txtTotalPrice.autoNumeric('init', {
        mDec: 0,
        aForm: false,
        vMin: 0
    });
    groupElements.txtTotalPriceVat.autoNumeric('init', {
        mDec: 0,
        aForm: false,
        vMin: 0
    });
    groupElements.txtTotalProductPrice.autoNumeric('init', {
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
            ContractNo: "required",
            Partner: "required",
            FromDate: "required",
            ToDate: "required"
        },
        messages: {
            ContractNo: "Vui lòng nhập số hợp đồng",
            Partner: "Vui lòng nhập khách hàng",
            FromDate: "Vui lòng chọn ngày bắt đầu hiệu lực ",
            ToDate: "Vui lòng chọn ngày hết hiệu lực"
        },
        invalidHandler: function (form, validator) {
            var errors = validator.numberOfInvalids();
            if (errors) {
                validator.errorList[0].element.focus();
            }
        }
    });
}

function clear() {
    location.href = "./listSaleContract.html";
}
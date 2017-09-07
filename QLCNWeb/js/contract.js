/// <reference path="common.js" />


function ContractController(isSale) {
    var self = this;

    self.isSupplier = getBool(isSale);

    self.saveContract = function (options) {
        var opt = $.extend({}, {}, options);

    }

    self.bindAllProductToDDL = function (element) {
        var defer = $.Deferred();
        $.ajax({
            contentType: "application/json",
            dataType: "json",
            method: "GET",
            async: false,
            url: "http://localhost:4221/Service.svc/GetAllProduct"
        }).done(function (data) {
            self.listProduct = data;
            var html = "<option>---Chọn sản phẩm---</option>";
            if (data && data.length > 0) {
                $.each(data, function (i, item) {
                    html += String.format("<option value={0}>{1} - {2}</option>", item.ID, item.ProductName, item.ProductCode);
                });
            }
            $(element).html(html);
            defer.resolve();
        }).fail(function (b) {
        });
        return defer.promise();
    }

    self.bindAllPartnerToDDL = function (element) {
        var defer = $.Deferred();
        $.ajax({
            contentType: "application/json",
            dataType: "json",
            method: "POST",
            async: false,
            url: "http://localhost:4221/Service.svc/GetAllPartners",
            data: JSON.stringify({ IsSupplier: self.isSupplier })
        }).done(function (data) {
            var html = "<option>---Chọn khách hàng---</option>";
            if (self.isSupplier) {
                html = "<option>---Chọn đối tác---</option>";
            }
            if (data && data.length > 0) {
                $.each(data, function (i, item) {
                    html += String.format("<option value={0}>{1} - {2}</option>", item.ID, item.CompanyName, item.RepName);
                });
            }
            $(element).html(html);
            defer.resolve();
        }).fail(function (b) {
        });
        return defer.promise();
    }

    self.getAllContract = function (element) {
        var defer = $.Deferred();
        $.ajax({
            contentType: "application/json",
            dataType: "json",
            method: "POST",
            async: false,
            url: "http://localhost:4221/Service.svc/GetAllContract",
            data: JSON.stringify({ IsSale: !self.isSupplier })
        }).done(function (data) {
            var html = "";
            if (data && data.length > 0) {
                $.each(data, function (i, item) {
                    var row = "";
                    var link = String.format("./{0}.html?id={1}", (self.isSupplier ? "PurchaseContract" : "SaleContract"), item.ID);
                    row += String.format("<td>{0}</td>", getString(item.ContractNo));
                    row += String.format("<td>{0}</td>", getString(item.PartnerName));
                    row += String.format("<td>{0}</td>", getString(item.TotalValue));
                    row += String.format("<td>{0}</td>", getString(item.Debt));
                    row += String.format("<td><a href='{0}' target='_blank'>Edit</a></td>", link);
                    html += String.format("<tr>{0}</tr>", row);
                });
            }
            $(element).find("tbody").html(html);
            defer.resolve();
        }).fail(function (b) {
        });
        return defer.promise();
    }

    self.getContractById = function (options) {
        var opt = $.extend({}, {
            id: 0
        }, options);
        var defer = $.Deferred();
        if (opt.id > 0) {
            $.ajax({
                contentType: "application/json",
                dataType: "json",
                method: "POST",
                async: false,
                url: "http://localhost:4221/Service.svc/GetContractById",
                data: JSON.stringify({ ID: opt.id })
            }).done(function (data) {
                defer.resolve(data);
            }).fail(function (b) {
            });
        }
        return defer.promise();
    }
}
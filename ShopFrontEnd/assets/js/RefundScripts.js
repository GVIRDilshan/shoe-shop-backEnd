import {
    address_reg,
    checkFields,
    loading_div,
    sale_id_reg,
    total_points_reg,
    validateOnKeyPressings
} from "./Script.js";
import {RefundModel} from "../models/RefundModel.js";

let sale_id_add = $("#refund-sales-id-add");
let refund_reason_add = $("#refund-reason-add");
let refund_nav_btn = $("#refund-nav-btn");

let refund_date = $("#refund-date");
let refund_sale_id = $("#refund-sales-id");
let refund_reason = $("#refund-reason");
let selected_refund_date = $("#selected-refund-date");

let selected_sale = null;
let cart_list_ar = [];
let refund_list_ar = [];

let searchBarAr = [];

let refund_table_tbody = $("#refund-sec tbody");

let selected_refund = null;

validateOnKeyPressings([sale_id_add, refund_reason_add], [sale_id_reg, address_reg]);

sale_id_add.on('keydown', function (e) {
    if (
        (e.keyCode === 13) &&
        checkFields([sale_id_reg], [sale_id_add], ["Sale Id"])
    ) {
        loading_div.show();
        $.ajax({
            url: `http://localhost:8080/hello-shoe/api/v1/refund/${sale_id_add.val()}`,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                loading_div.hide();
                const diffInMs = new Date(Date.now()) - new Date(data.date);

                const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

                if (diffInDays > 3) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Sale Refund Date Expired',
                        text: 'There are over 3 days sorry !'
                    });
                    return;
                }

                if (data.saleCartDTOList.length <= 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'No items for refund !',
                        text: 'Sales All Items are refunded !'
                    });
                    return;

                }

                selected_sale = data;

                cart_list_ar = JSON.parse(JSON.stringify(selected_sale.saleCartDTOList));

                cart_list_ar.map(function (cart_item) {
                    cart_item.itemIndex = Math.floor(Math.random() * (10000 - 1 + 1)) + 1 + Date.now();

                });

                loadItemCartRefundAdd(cart_list_ar, true , $("#refund-sec #refund-add-wrapper .item-cart-wrapper"));

            },
            error: function (xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Sale load failed',
                    text: 'Check Sale Id !'
                });
                $('#response').text('Error: ' + error);
                loading_div.hide();

                selected_sale = null;
                cart_list_ar = [];
                loadItemCartRefundAdd(cart_list_ar, true , $("#refund-sec #refund-add-wrapper .item-cart-wrapper"));

            }

        });

    }

});

function loadItemCartRefundAdd(saleItemCartList, withBtns , wrapper) {

    let tempWrapperHTML = "";

    saleItemCartList.map(function (cartItem) {
        let tempSize = cartItem.size.startsWith("SIZE_") ? cartItem.size.split("_")[1] : cartItem.size.charAt(0);

        let tempBorderStyle = `1px solid ${cartItem.colour}`;

        let temp_url = `url('${cartItem.image}')`;

        if (withBtns) {

            tempWrapperHTML += `
                    <div class="cart-item" data-cart-item-index=${cartItem.itemIndex}>
                        <div class="cart-item-close-btn"></div>
                        <div class="cart-item-img" style="background-image: ${temp_url}"></div>
                        <div class="cart-item-body-wrapper">
                            <h4 class="cart-item-name">${cartItem.description}</h4>
                            <div class="size" style="background-color: darkgray">${tempSize}</div>
                            <div class="colour" style="border: ${tempBorderStyle}">
                                <div style="background-color: ${cartItem.colour}"></div>
                            </div>
                            <div class="price-single">${cartItem.priceSingle} LKR</div>
                            <h4 class="cart-item-code">${cartItem.iCode}</h4>
                            <div class="qty-adjuster-wrapper">
                                <i class="fi fi-rr-minus"></i>
                                <span>${cartItem.qty}</span>
                                <i class="fi fi-rr-plus"></i>
                            </div>
                            <div class="price-all">${cartItem.priceTotal} LKR</div>
                        </div>
                    </div>
            `

        } else {
            tempWrapperHTML += `
                    <div class="cart-item" data-cart-item-index=${cartItem.itemIndex}>
                        <div class="cart-item-img" style="background-image: ${temp_url}"></div>
                        <div class="cart-item-body-wrapper">
                            <h4 class="cart-item-name">${cartItem.description}</h4>
                            <div class="size" style="background-color: darkgray">${tempSize}</div>
                            <div class="colour" style="border: ${tempBorderStyle}">
                                <div style="background-color: ${cartItem.colour}"></div>
                            </div>
                            <div class="price-single">${cartItem.priceSingle} LKR</div>
                            <h4 class="cart-item-code">${cartItem.iCode}</h4>
                            <div class="qty-adjuster-wrapper">
                                <span>${cartItem.qty}</span>
                            </div>
                            <div class="price-all">${cartItem.priceTotal} LKR</div>
                        </div>
                    </div>
            `
        }

    });

    wrapper.html(tempWrapperHTML);

    // close btn
    $("#refund-sec .item-cart-wrapper").on('click', '.cart-item > .cart-item-close-btn', function () {
        cart_list_ar = cart_list_ar.filter(cart_item => cart_item.itemIndex === $(this).closest(".cart-item").data("cart-item-index"));
        $(this).closest(".cart-item").remove();
        console.log(cart_list_ar);

    });

}

$("#refund-sec .item-cart-wrapper").on('click', '.qty-adjuster-wrapper > i:first-child', function () {
    // console.log($(this).closest(".cart-item").data("cart-item-index"));
    let cartItem = getSaleCartItem($(this).closest(".cart-item").data("cart-item-index"));
    if (cartItem.qty - 1 === 0) {
        return;
    }

    cartItem.qty -= 1;
    cartItem.priceTotal = cartItem.priceSingle * cartItem.qty;

    qtyAdjusterValuesSet(cartItem);

});

$("#refund-sec .item-cart-wrapper").on('click', '.qty-adjuster-wrapper > i:nth-child(3)', function () {
    let cartItem = getSaleCartItem($(this).closest(".cart-item").data("cart-item-index"));

    let holder = selected_sale.saleCartDTOList.find(
        qtyHolder =>
            qtyHolder.size === cartItem.size &&
            qtyHolder.colour === cartItem.colour
    );

    if (holder.qty === cartItem.qty) {
        return;
    }

    cartItem.qty += 1;
    cartItem.priceTotal = cartItem.priceSingle * cartItem.qty;

    qtyAdjusterValuesSet(cartItem);

});

function qtyAdjusterValuesSet(cartItem) {
    $("#refund-sec #refund-form .cart-item").map(function () {
        let tempCard = getSaleCartItem($(this).data("cart-item-index"));

        if (tempCard.itemIndex === cartItem.itemIndex) {
            $(this).closest(".cart-item").find(".qty-adjuster-wrapper > span").html(cartItem.qty);
            $(this).closest(".cart-item").find(".price-all").html(cartItem.priceTotal + "LKR");
            return;
        }

    });

}

function getSaleCartItem(index) {
    return cart_list_ar.find(saleCartItem => saleCartItem.itemIndex === index);

}

$("#save-refund-btn").on('click', function () {
    if (!selected_sale) {
        Swal.fire({
            icon: 'error',
            title: 'Select Not Selected',
            text: 'Select a sale first !'
        });
        return
    }

    if (checkFields([address_reg], [refund_reason_add], ["reason"])) {

        loading_div.show();

        getRefundList();

        $.ajax({
            url: `http://localhost:8080/hello-shoe/api/v1/refund`,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: getRefundList(),
            success: function (data) {
                // customer = data;

                loading_div.hide();

                Swal.fire({
                    icon: 'success',
                    title: 'Refund Placed',
                    text: data.oId
                });

                selected_sale = null;
                cart_list_ar = [];
                loadItemCartRefundAdd(cart_list_ar, true , $("#refund-sec #refund-add-wrapper .item-cart-wrapper"));
                clearRefundFieldsAdd();

            },
            error: function (xhr, status, error) {
                loading_div.hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Refund Place Failed'
                });
                $('#response').text('Error: ' + error);
            }
        });

    }

});

function getRefundList() {
    let tempList = [];

    cart_list_ar.map(function (cartItem) {
        // console.log(cartItem.saleId);

        tempList.push(
            new RefundModel(
                "",
                cartItem.priceTotal,
                Date.now(),
                refund_reason_add.val(),
                cartItem.qty,
                "6d2d475f-4a5a-40f8-8af1-0265bf2e77b2",
                selected_sale.oId,
                cartItem.itemSaleId
            )
        );
    });

    console.log(JSON.stringify(tempList));
    return JSON.stringify(tempList);

}

refund_nav_btn.on('click', function () {
    clearRefundFields()
    getLoadAllRefunds();

});

function getLoadAllRefunds() {
    loading_div.show();

    $.ajax({
        url: `http://localhost:8080/hello-shoe/api/v1/refund`,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            refund_list_ar = data;
            console.log(data.length);
            loadAllRefunds(refund_list_ar);

            loading_div.hide();

        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Refunds load failed'
            });
            $('#response').text('Error: ' + error);
            loading_div.hide();

            selected_sale = null;
            cart_list_ar = [];
            loadItemCartRefundAdd(cart_list_ar, true , $("#refund-sec #refund-add-wrapper .item-cart-wrapper"));
        }
    });

}

function loadAllRefunds(ar) {
    refund_table_tbody.empty();

    ar.map(function (refund) {

        refund_table_tbody.append(
            `
                <tr data-refund-id=${refund.rId}>
                    <td>${refund.date}</td>
                    <td>${refund.saleId}</td>
                    <td>${refund.reason}</td>
                    <td>${refund.saleCartDTO.iCode}</td>
                    <td>${refund.value}</td>
                </tr>
            `
        );

    });


}

// searchbar
$("#refund-search-field").on('input', function () {
    searchBarAr = [];

    refund_list_ar.map(function (refund) {
        let tempRefundId = refund.date.toLowerCase();
        let searchBarVal = $("#refund-search-field").val().toLowerCase();

        if (tempRefundId.includes(searchBarVal + "")) {
            searchBarAr.push(refund);

        }

    });

    loadAllRefunds(searchBarAr);


});

// table select
refund_table_tbody.on('click', 'tr', function () {
    clearRefundFields();

    fetchRefund($(this).data("refund-id"));

});

function fetchRefund(rId) {
    loading_div.show();

    $.ajax({
        url: `http://localhost:8080/hello-shoe/api/v1/refund/rid/${rId}`,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            loading_div.hide();

            selected_refund = data;

            loadRefundData();

            selected_sale = null;
            cart_list_ar = [];

        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Item load failed',
                text: 'Check Sale Id !'
            });
            $('#response').text('Error: ' + error);
            loading_div.hide();
            // loadItemCartRefundAdd(cart_list_ar, true , $("#refund-sec #refund-add-wrapper .item-cart-wrapper"));
        }
    });

}

function clearRefundFields() {
    selected_refund = null;
    $("#refund-sec .side-bar-wrapper .item-cart-wrapper").html("");
    selected_refund_date.text("");

    $("#refund-sec .side-bar-wrapper input").val("");
    $("#refund-sec .side-bar-wrapper input").removeClass("is-valid was-validated is-invalid");


}

function clearRefundFieldsAdd() {
    $("#refund-add-wrapper input").val("");
    $("#refund-add-wrapper input").removeClass("is-valid was-validated is-invalid");

}

function loadRefundData() {
    selected_refund_date.text(selected_refund.date);

    refund_date.val(selected_refund.date);
    refund_sale_id.val(selected_refund.saleId);
    refund_reason.val(selected_refund.reason);

    loadItemCartRefundAdd([selected_refund.saleCartDTO] , false , $("#refund-sec .side-bar-wrapper .item-cart-wrapper"));

}





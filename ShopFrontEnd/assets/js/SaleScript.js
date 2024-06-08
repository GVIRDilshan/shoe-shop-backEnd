import {
    address_reg, checkDateFields, checkDateFieldsDifferences, checkFields, checkSelectFields,
    credit_card_digit_reg,
    loading_div,
    toggleBtnColorChanger,
    validateOnKeyPressings
} from "./Script.js";
import {CartItemCardModel} from "../models/CartItemCardModel.js";
import {total_points_reg, price_reg} from "./Script.js";
import {SaleModel} from "../models/SaleModel.js";

let saleList = null;
let customerList = null;
let customerListSearchBar = null;
let saleItemList = null;
let saleItemCartList = [];
let itemsArSearchBar = [];

let selectedCustomer = null;
let selectedSale = null;

let category = "All";
let gender = "All";
let occasion = "All";
let verities = "All";

let saleId = null;
let saleItemListHistory = [];

let itemsArSearchBarHistory = [];

let total = 0;
let points = 0;

let filterAr = [];

let paymentType = null;

let isHistory = false;

$("#sales-nav-btn").on('click', function () {

});

$(window).on('load', function () {
    init();

});

function init() {
    $("#sale-sec .item-cart-wrapper").html("");

    getAllItemsSale();
    getAllSales();
    getAllCustomers();

}

// fetch all items
export function getAllItemsSale() {
    loading_div.show();
    $.ajax({
        url: 'http://localhost:8080/hello-shoe/api/v1/item/getAll',
        method: 'GET',
        dataType: 'json',
        success: function (data) {

            saleItemList = data;
            filterAr = saleItemList;

            loading_div.hide();

            loadItemCards(saleItemList);


        },
        error: function (xhr, status, error) {
            loading_div.hide();
            Swal.fire({
                icon: 'error',
                title: 'Items load failed',
                text: 'Try again!'
            });
            // $('#response').text('Error: ' + error);
        }
    });

}

// fetch all sales
function getAllSales() {
    $.ajax({
        url: 'http://localhost:8080/hello-shoe/api/v1/sale',
        method: 'GET',
        dataType: 'json',
        success: function (data) {

            saleList = data;

            saleId = saleList.length + 1;
            saleId = "O" + saleId.toString().padStart(5, "0");

            $("#sale-order-id").text(saleId);

        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Sales load failed',
                text: 'Try again!'
            });
        }
    });

}

// fetch all customers
export function getAllCustomers() {
    $.ajax({
        url: 'http://localhost:8080/hello-shoe/api/v1/customer',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            customerList = data;

            $("#customer-search-bar-suggestions-set > ul").html("");

            let i = 0;
            customerList.map(function (customer) {
                if (i === 3) {
                    return;
                }

                i++;

                $("#customer-search-bar-suggestions-set > ul").append(`<li data-customer-id=${customer.cId}>${customer.cName} - ${customer.email}</li>`);

            });

        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Customers load failed',
                text: 'Try again!'
            });
        }
    });

}

// searchbar
$("#sale-search-field").on('input', function () {
    if (!isHistory) {
        itemsArSearchBar = [];

        filterAr.map(function (item) {
            let iCodeTemp = item.iCode.toLowerCase();
            let searchBarVal = $("#sale-search-field").val().toLowerCase();

            if (iCodeTemp.includes(searchBarVal + "")) {
                itemsArSearchBar.push(item);

            }

        });

        loadItemCards(itemsArSearchBar);

    } else {
        itemsArSearchBarHistory = [];

        saleList.map(function (sale) {
            let saleId = sale.oId.toLowerCase();
            let searchBarVal = $("#sale-search-field").val().toLowerCase();

            if (saleId.includes(searchBarVal + "")) {
                itemsArSearchBarHistory.push(sale);

            }

        });

        loadAllSales(itemsArSearchBarHistory);

    }

});

function loadItemCards(itemList) {
    let itemCardSetWrapper = $("#body-item-wrapper");
    itemCardSetWrapper.html("");
    // $("#sale-sec .item-cart-wrapper").html("");
    // saleItemCartList = [];

    let itemCardListHtml = "";

    itemList.map(function (saleItem) {

        let temp_url = `url('${saleItem.saleItemImageHolderDTOList[0].image}')`;
        var tempStyle = 'background-image:' + temp_url


        itemCardListHtml +=
            `
                <div class="sale-item-card" data-sale-item-code=${saleItem.iCode}>
                    <div class="sale-item-img" style=${tempStyle}></div>
                    <div class="sale-item-body">
                        <h4 class="sale-item-name">${saleItem.description}</h4>
                        <h4 class="sale-item-id">${saleItem.iCode}</h4>
                        <div class="sale-item-category-set">
                            ${getTags(saleItem.tags)}
                        </div>

                        <div class="size-set-wrapper">

                        </div>

                        <div class="colour-set-wrapper">
                            <span>Colour</span>

                            ${getColours(saleItem.availableColourList)}
                        </div>

                        <div class="sale-item-price">${saleItem.price} LKR</div>

                        <div class="add-to-cart-btn">Add to cart</div>
                    </div>
                </div>
        `

    });

    itemCardSetWrapper.html(itemCardListHtml);

    // colour select action
    $("#body-item-wrapper > .sale-item-card").on('click', '.sale-item-colour', function () {
        $(this).parents(".colour-set-wrapper").children(".sale-item-colour").removeClass("before-content");
        $(this).addClass("before-content");

        let colour = $(this).data("item-colour");

        $(this).closest(".sale-item-card").attr("data-selected-colour", colour);

        let saleItem = getSaleItem($(this).parents(".sale-item-card").data("sale-item-code"));

        let saleItemImageHolderDTO = saleItem.saleItemImageHolderDTOList.find(saleItemImageHolder => saleItemImageHolder.colour === colour);

        let temp_url = `url('${saleItemImageHolderDTO.image}')`;
        var tempStyle = 'background-image:' + temp_url;

        $(this).parents(".sale-item-card").children(".sale-item-img").attr("style", tempStyle);

        getSizes($(this).parents(".sale-item-card").find(".size-set-wrapper"), saleItem.saleItemQtyHolderDTOList, colour);

        $(this).closest(".sale-item-card").attr("data-sale-item-image", saleItemImageHolderDTO.image);


    });

    // size select action
    $("#body-item-wrapper > .sale-item-card").on('click', '.sale-item-size', function () {
        $(this).parents(".size-set-wrapper").children(".sale-item-size").css({border: "unset"});

        let colour = $(this).closest(".sale-item-card").data("selected-colour");
        if (!colour) {
            colour = "black";
        }

        $(this).css({border: "1px solid black"});

        $(this).closest(".sale-item-card").attr("data-selected-size", $(this).data("item-size"));
    });

    // add to cart btn
    $("#body-item-wrapper > .sale-item-card").on('click', '.add-to-cart-btn', function () {
        let saleItem = getSaleItem($(this).parents(".sale-item-card").data("sale-item-code"));
        let selectedColour = $(this).parents(".sale-item-card").attr("data-selected-colour");
        let selectedSize = $(this).parents(".sale-item-card").attr("data-selected-size");
        let selectedImage = $(this).parents(".sale-item-card").attr("data-sale-item-image");

        // console.log(saleItem);

        let existingItem = saleItemCartList.find(
            saleCartItem =>
                saleCartItem.iCode === saleItem.iCode &&
                saleCartItem.colour === selectedColour &&
                saleCartItem.size === selectedSize
        );

        let isQtyAvailable = checkQty(saleItem, selectedColour, selectedSize);

        if (!isQtyAvailable) {
            Swal.fire({
                icon: 'info',
                title: 'Out Of Stock',
                text: 'Out of stock with this colour and size !'
            });

            return;
        }

        if (!existingItem) {
            let cartItem = new CartItemCardModel(
                saleItem.iCode,
                saleItem.description,
                1,
                selectedSize,
                selectedColour,
                saleItem.price,
                saleItem.price,
                selectedImage,
                Math.floor(Math.random() * (10000 - 1 + 1)) + 1 + Date.now(),
                ""
            );

            saleItemCartList.push(cartItem);

            // loadItemCart(cartItem, true);
            loadItemCart(saleItemCartList, false);

        } else {
            existingItem.qty += 1;
            existingItem.priceTotal = (existingItem.priceSingle * existingItem.qty);

            // console.log(saleItemCartList);

            loadItemCart(saleItemCartList, false);

        }

        calcTotal(saleItemCartList);

        getSizes($(this).parents(".sale-item-card").find(".size-set-wrapper"), saleItem.saleItemQtyHolderDTOList, selectedColour);

    });

    // cart item close btn
    $("#sale-sec .item-cart-wrapper").on('click', '.cart-item > .cart-item-close-btn', function () {
        let cartItemId = $(this).closest(".cart-item").data("cart-item-index");
        let cartItem = getSaleCartItem(cartItemId);

        saleItemList.map(function (saleItem) {
            if (!cartItem) {
                return;
            }

            if (saleItem.iCode !== cartItem.iCode) {
                return;
            }

            let holder = saleItem.saleItemQtyHolderDTOList.find(
                qtyHolder =>
                    qtyHolder.size === cartItem.size &&
                    qtyHolder.colour === cartItem.colour
            );

            holder.qty += cartItem.qty;


            $("#body-item-wrapper .sale-item-card").map(function () {
                if ($(this).data("sale-item-code") === cartItem.iCode) {
                    getSizes($(this).find(".size-set-wrapper"), saleItem.saleItemQtyHolderDTOList, cartItem.colour);
                }

            });

            let tempArIndex = saleItemCartList.indexOf(cartItem);
            saleItemCartList.splice(tempArIndex, 1);
            // console.log(saleItemCartList);
            loadItemCart(saleItemCartList, false);
            calcTotal(saleItemCartList);

        });

        // saleItemCartList = saleItemCartList.filter(tempCartItem => tempCartItem.itemIndex === cartItemId);
        //
        // let tempCartItemListHTML = "";
        // $("#sale-sec .cart-item").map(function () {
        //     if ($(this).data("cart-item-index") === cartItemId) {
        //         return;
        //     }
        //
        //     tempCartItemListHTML += $(this).prop('outerHTML');
        // });

        // $("#sale-sec .item-cart-wrapper").html(tempCartItemListHTML);


    });

    $("#body-item-wrapper > .sale-item-card .sale-item-colour:nth-child(2)").click();
    // $("#body-item-wrapper > .sale-item-card .sale-item-size:nth-child(2)").click();


}

function checkQty(saleItem, selectedColour, selectedSize) {
    let isAvailable = false;

    saleItem.saleItemQtyHolderDTOList.map(function (qtyHolder) {
        if (qtyHolder.colour === selectedColour && qtyHolder.size === selectedSize) {
            if (!(qtyHolder.qty > 0)) {
                isAvailable = false;
                return;
            }

            qtyHolder.qty -= 1;
            isAvailable = true;
            return;
        }

    });

    return isAvailable;

}

function loadItemCart(saleItemCartList, isHistoryView) {

    let tempWrapperHTML = "";

    saleItemCartList.map(function (cartItem) {
        let tempSize = cartItem.size.startsWith("SIZE_") ? cartItem.size.split("_")[1] : cartItem.size.charAt(0);

        let tempBorderStyle = `1px solid ${cartItem.colour}`;

        let temp_url = `url('${cartItem.image}')`;

        if (!isHistoryView) {

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
                            <div class="price-all">${cartItem.priceSingle} LKR</div>
                        </div>
                    </div>
            `

        } else {
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
                                <span>${cartItem.qty}</span>
                            </div>
                            <div class="price-all">${cartItem.priceTotal} LKR</div>
                        </div>
                    </div>
            `
        }

    });

    $("#sale-sec .item-cart-wrapper").html(tempWrapperHTML);

}

function getTags(tagList) {
    let tempTags = "";

    tagList.map(function (tag) {
        tempTags += `<span>${tag} </span>`;
    });

    return tempTags;

}

function getSizes(elementWrapper, saleItemQtyHolderDTOList, colour) {
    let tempSizeList = "<span>Size</span>";

    saleItemQtyHolderDTOList.map(function (saleItemQtyHolderDTO) {
        if (saleItemQtyHolderDTO.colour === colour && saleItemQtyHolderDTO.qty > 0) {
            let tempSize = saleItemQtyHolderDTO.size.startsWith("SIZE_") ? saleItemQtyHolderDTO.size.split("_")[1] : saleItemQtyHolderDTO.size.charAt(0);


            tempSizeList += `<span class="sale-item-size" data-item-size=${saleItemQtyHolderDTO.size}>${tempSize}</span>`;

        }

    });

    elementWrapper.html(tempSizeList);

    elementWrapper.find(".sale-item-size:nth-child(2)").click();


}

function getColours(colourList) {
    let tempColourList = "";

    colourList.map(function (colour) {
        let tempColour = colour.toLowerCase();

        var style = "background-color:" + (tempColour === "other" ? "grey" : colour);

        tempColourList += `<div class="sale-item-colour ${tempColour}" style=${style} data-item-colour=${colour}></div>`;
    });

    return tempColourList;

}

function calcTotal(saleItemCartList) {
    let tempTotal = 0;

    saleItemCartList.map(function (saleItemCart) {
        tempTotal += saleItemCart.priceTotal;

    });

    $(".sub-total-value , .total-amount-value").text(tempTotal + "LKR");
    $(".added-points > h4:nth-child(2)").text((Math.floor(tempTotal / 800)));

    total = tempTotal;
    points = (Math.floor(tempTotal / 800));

}

$("#side-bar-header-wrapper > .side-bar-header > i").on('click', function () {
    getAllItemsSale();

});

$("#customer-name-or-loyal-id").on('input', function () {
    setCustomerSuggestionsAction($(this).val());

    selectedCustomer = null;

    $(".c-name-value").text("");
    $(".c-join-date-value").text("");
    $(".c-level-value").text("");
    $(".c-total-points-value").text("");
    $(".c-contacts-value").text("");
    $(".recent-purchase-date").text("");
});

$("#customer-name-or-loyal-id").on('focusin', function () {
    if (isHistory) {
        return;
    }

    $("#customer-search-bar-suggestions-set").show();

});

$("#customer-name-or-loyal-id").on('focusout', function () {
    $("#customer-search-bar-suggestions-set").css({opacity: "0"});
    setTimeout(function () {
        $("#customer-search-bar-suggestions-set").hide();
        $("#customer-search-bar-suggestions-set").css({opacity: "1"});

    }, 300);

});

$("#customer-search-bar-suggestions-set").on('click', 'ul > li', function () {
    let customer = getCustomer($(this).data("customer-id"));

    $("#customer-name-or-loyal-id").val(customer.cName);
    selectedCustomer = customer;

    $(".c-name-value").text(customer.cName);
    $(".c-join-date-value").text(customer.joinDate);
    $(".c-level-value").text(customer.level);
    $(".c-total-points-value").text(customer.totalPoints);
    $(".c-contacts-value").text(customer.contactNo);
    $(".recent-purchase-date").text();

});

function setCustomerSuggestionsAction(text) {
    $("#customer-search-bar-suggestions-set > ul").html("");
    let i = 0;

    customerList.map(function (customer) {

        if (text.length === 0 && i > 2) {
            return;
        }

        if (customer.cName.toLowerCase().startsWith(text.toLowerCase())) {
            $("#customer-search-bar-suggestions-set > ul").append(`<li data-customer-id=${customer.cId}>${customer.cName} - ${customer.email}</li>`);
            // customerListSearchBar.push(customer);

        }
        i++;
    });


}

// filters
$("#filter-btn").on('click', '.dropdown-menu > .dropdown-item', function () {

    if ($(this).text() === "Price") {
        saleItemList.sort(sortByPrice);
        loadItemCards(saleItemList);

    } else if ($(this).text() === "Name") {
        saleItemList.sort(sortByName);
        loadItemCards(saleItemList);

    }

});

$("#all-btn").on('click', '.dropdown-menu > .dropdown-item', function () {
    category = $(this).text();
    $("#all-btn > div > span").text($(this).text() === "All" ? "Category" : $(this).text());

    filter();

});

$("#gender-btn").on('click', '.dropdown-menu > .dropdown-item', function () {
    gender = $(this).text();
    $("#gender-btn > div > span").text($(this).text() === "All" ? "Gender" : $(this).text());

    filter();

});

$("#occasion-btn").on('click', '.dropdown-menu > .dropdown-item', function () {
    occasion = $(this).text();
    $("#occasion-btn > div > span").text($(this).text() === "All" ? "Occasion" : $(this).text());

    filter();

});

$("#verities-btn").on('click', '.dropdown-menu > .dropdown-item', function () {
    verities = $(this).text();
    $("#verities-btn > div > span").text($(this).text() === "All" ? "Verities" : $(this).text());

    filter();

});

function filter() {
    filterAr = [];

    saleItemList.map(function (saleItem) {
        // console.log(saleItem.iCode);

        if (!(saleItem.category === category || category === "All")) {
            return;
        }

        if (!(saleItem.gender === gender || gender === "All")) {
            return;
        }

        if (!(saleItem.occasion === occasion || occasion === "All")) {
            return;
        }

        if (!(saleItem.verities === verities || verities === "All")) {
            return;
        }


        filterAr.push(saleItem);
    });

    loadItemCards(filterAr);

}

$("#sale-sec .item-cart-wrapper").on('click', '.qty-adjuster-wrapper > i:first-child', function () {
    let cartItem = getSaleCartItem($(this).closest(".cart-item").data("cart-item-index"));
    if (cartItem.qty - 1 === 0) {
        return;
    }

    cartItem.qty -= 1;
    cartItem.priceTotal = cartItem.priceSingle * cartItem.qty;

    editQtyHolder(cartItem, false);

    qtyAdjusterValuesSet(cartItem);

});

$("#sale-sec .item-cart-wrapper").on('click', '.qty-adjuster-wrapper > i:nth-child(3)', function () {
    let cartItem = getSaleCartItem($(this).closest(".cart-item").data("cart-item-index"));

    let isOk = false;

    saleItemList.map(function (saleItem) {
        if (saleItem.iCode !== cartItem.iCode) {
            return;
        }

        let holder = saleItem.saleItemQtyHolderDTOList.find(
            qtyHolder =>
                qtyHolder.size === cartItem.size &&
                qtyHolder.colour === cartItem.colour
        );

        isOk = holder.qty !== 0;

    });

    if (!isOk) {
        Swal.fire({
            icon: 'info',
            title: 'Out Of Stock',
            text: 'Out of stock with this colour and size !'
        });
        return;
    }

    cartItem.qty += 1;
    cartItem.priceTotal = cartItem.priceSingle * cartItem.qty;

    editQtyHolder(cartItem, true);

    qtyAdjusterValuesSet(cartItem);

});

function qtyAdjusterValuesSet(cartItem) {
    $("#sale-sec .item-cart-wrapper > .cart-item").map(function () {
        let tempCard = getSaleCartItem($(this).data("cart-item-index"));

        if (tempCard.itemIndex === cartItem.itemIndex) {
            $(this).closest(".cart-item").find(".qty-adjuster-wrapper > span").html(cartItem.qty);
            $(this).closest(".cart-item").find(".price-all").html(cartItem.priceTotal + "LKR");
            return;
        }

    });

    calcTotal(saleItemCartList);
}

function sortByPrice(obj1, obj2) {
    if (obj1.price < obj2.price) {
        return -1;
    }
    if (obj1.price > obj2.price) {
        return 1;
    }
    return 0;

}

function sortByName(obj1, obj2) {
    if (obj1.description < obj2.description) {
        return -1;
    }
    if (obj1.description > obj2.description) {
        return 1;
    }
    return 0;
}

function getSaleItem(iCode) {
    return saleItemList.find(saleItem => saleItem.iCode === iCode);

}

function getSaleCartItem(index) {
    return saleItemCartList.find(saleCartItem => saleCartItem.itemIndex === index);

}

function getCustomer(cId) {
    return customerList.find(customer => customer.cId === cId);

}

function getFilterItem(iCode) {
    return filterAr.find(saleItem => saleItem.iCode === iCode);
}

function editQtyHolder(cartItem, isPlus) {
    saleItemList.map(function (saleItem) {
        if (saleItem.iCode !== cartItem.iCode) {
            return;
        }

        let holder = saleItem.saleItemQtyHolderDTOList.find(
            qtyHolder =>
                qtyHolder.size === cartItem.size &&
                qtyHolder.colour === cartItem.colour
        );

        holder.qty = isPlus ? holder.qty - 1 : holder.qty + 1;

        $("#body-item-wrapper .sale-item-card").map(function () {
            if ($(this).data("sale-item-code") === cartItem.iCode) {
                getSizes($(this).find(".size-set-wrapper"), saleItem.saleItemQtyHolderDTOList, cartItem.colour);
            }

        });


    });


}

// payment part
$("#place-order-btn").on('click', function () {
    if (!paymentType) {
        Swal.fire({
            icon: 'info',
            title: 'Select Payment Type',
            text: 'Select card or cash !'
        });
        return;
    }

    clearPaymentFields();

    if (paymentType === "CASH") {
        $("#sale-payment-field-1").attr('placeholder', 'Cash');
        $("#sale-payment-field-2").attr('placeholder', 'Balance');

        $("#sale-payment-field-1").removeAttr("min", "max");
        $("#sale-payment-field-2").attr("readOnly", "");

        // console.log("hello");
        validateOnKeyPressings([$("#sale-payment-field-1")], [price_reg]);

    } else {
        $("#sale-payment-field-1").attr('placeholder', 'Last 4 Digits');
        $("#sale-payment-field-2").attr('placeholder', 'Bank Name');

        $("#sale-payment-field-2").removeAttr("readOnly");
        $("#sale-payment-field-1").attr({min: '0', max: '9999'});
        validateOnKeyPressings([$("#sale-payment-field-1")], [credit_card_digit_reg]);
        validateOnKeyPressings([$("#sale-payment-field-2")], [address_reg]);
    }

    $("#place-order-details-wrapper").show();

});

$("#sale-payment-field-1").on('input', function () {
    if (paymentType === "CASH") {
        $("#sale-payment-field-2").val($(this).val() - total + " LKR");

    }

});

// purchase btn
$("#purchase-btn").on('click', function () {
    if (!total) {
        Swal.fire({
            icon: 'info',
            title: 'No Items In Cart',
            text: 'Add some items to cart !'
        });
        return;
    }

    if (paymentType === "CASH") {
        if (checkFields([price_reg], [$("#sale-payment-field-1")], ["Cash Field"])) {
            if (total > $("#sale-payment-field-1").val()) {
                Swal.fire({
                    icon: 'info',
                    title: 'Check Cash Amount',
                    text: 'Cash amount not matched !'
                });
                return;

            }
            placeSale();

        }

    } else if (paymentType === "CARD") {
        if (
            checkFields([credit_card_digit_reg, address_reg],
                [$("#sale-payment-field-1"), $("#sale-payment-field-2")],
                ["Digits", "Bank Name"])

        ) {
            placeSale();

        }

    }

});

// place sale
function placeSale() {
    loading_div.show();

    $.ajax({
        url: `http://localhost:8080/hello-shoe/api/v1/sale`,
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: getSaleDetails(),
        success: function (data) {
            // customer = data;

            loading_div.hide();

            Swal.fire({
                icon: 'success',
                title: 'Sale Placed',
                text: data.oId
            });

            getAllCustomers();

            clearPaymentFields();

            saleItemCartList = []
            selectedCustomer = null;
            paymentType = null;
            calcTotal(saleItemCartList);

            init();

            $("#place-order-details-wrapper").hide();

        },
        error: function (xhr, status, error) {
            loading_div.hide();
            Swal.fire({
                icon: 'error',
                title: 'Sale Place Failed'
            });
            $('#response').text('Error: ' + error);
        }
    });

}

function clearPaymentFields() {
    $("#sale-payment-field-1 , #sale-payment-field-2").val("");
    $("#sale-payment-field-1 , #sale-payment-field-2").removeClass("is-valid was-validated is-invalid");


}


$("#order-detail-form > i:first-child").on('click', function () {
    $("#place-order-details-wrapper").hide();

});

$("#cash-payment").on("click", function () {
    paymentType = "CASH";
    toggleBtnColorChanger($(this), $("#card-payment"));

});

$("#card-payment").on("click", function () {
    paymentType = "CARD";
    toggleBtnColorChanger($(this), $("#cash-payment"));

});

function getSaleDetails() {
    let tempQty = 0;

    for (let i = 0; i < saleItemCartList.length; i++) {
        tempQty += saleItemCartList[i].qty;

    }

    let tempCustomerId = selectedCustomer ? selectedCustomer.cId : null;

    let saleModel = new SaleModel(
        saleId,
        tempQty,
        Date.now(),
        paymentType,
        points,
        saleItemCartList,
        tempCustomerId,
        "3abe405a-331f-4737-86d4-3169b9231e26",
        total
    );

    // console.log(JSON.stringify(saleModel));

    return JSON.stringify(saleModel);

}

$("#sale-history-btn").on('click', function () {
    if (!isHistory) {
        clearCustomer();
        loadItemCart([], true);
        calcTotal([]);
        loadAllSales(saleList);
        isHistory = true;

        $("#customer-name-or-loyal-id").attr("readOnly", "");

        $("#place-order-wrapper").hide();
        $("#filter-btn-set-wrapper").hide();
        $("#sale-search-field").val("")
        $("#side-bar-header-wrapper > .side-bar-header > i").hide();
        $("#sale-order-id").text("");

    } else {
        clearCustomer();
        loadItemCart(saleItemCartList, false);
        calcTotal(saleItemCartList);
        isHistory = false;

        $("#customer-name-or-loyal-id").removeAttr("readOnly");

        $("#place-order-wrapper").show();
        $("#filter-btn-set-wrapper").show();
        $("#sale-search-field").val("");
        $("#side-bar-header-wrapper > .side-bar-header > i").show();

        $("#sale-order-id").text(saleId);
    }

});

function loadAllSales(ar) {
    $("#sale-sec .sale-history-tbl > tbody").empty();

    ar.map((sale) => {
        $("#sale-sec .sale-history-tbl > tbody").append(`
            <tr data-sale-id = ${sale.oId}>
                <td>${sale.oId}</td>
                <td>${sale.totalPrice}</td>
                <td>${sale.itemQty}</td>
                <td>${sale.date}</td>
            </tr>
        `);
    });

}

// table select
$("#sale-sec .sale-history-tbl > tbody").on('click', 'tr', function () {
    loading_div.show();
    fetchSale($(this).data("sale-id"));


});

function fetchSale(saleId) {
    $.ajax({
        url: `http://localhost:8080/hello-shoe/api/v1/sale/${saleId}`,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            selectedSale = data;
            saleItemListHistory = selectedSale.saleCartDTOList;

            if (selectedSale.customerId) {
                fetchCustomer(selectedSale.customerId);

            } else {
                fetchCustomer(null);

            }

            $("#sale-order-id").text(selectedSale.oId);

            loadAllSaleDetails();
            calcTotal(selectedSale.saleCartDTOList);

            loading_div.hide();

        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Customer load failed',
                text: 'Try again!'
            });
            $('#response').text('Error: ' + error);
            loading_div.hide();
        }
    });

}

function loadAllSaleDetails() {
    loadItemCart(saleItemListHistory, true);

}

function fetchCustomer(cId) {
    if (cId === null) {
        clearCustomer();
        return;
    }

    $.ajax({
        url: `http://localhost:8080/hello-shoe/api/v1/customer/${cId}`,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            let customer = data;

            $(".c-name-value").text(customer.cName);
            $(".c-join-date-value").text(customer.joinDate);
            $(".c-level-value").text(customer.level);
            $(".c-total-points-value").text(customer.totalPoints);
            $(".c-contacts-value").text(customer.contactNo);
            $(".recent-purchase-date").text();


        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Customer load failed',
                text: 'Try again!'
            });
            $('#response').text('Error: ' + error);
        }
    });

}

function clearCustomer() {
    $("#customer-name-or-loyal-id").val("");
    $(".c-name-value").text("");
    $(".c-join-date-value").text("");
    $(".c-level-value").text("");
    $(".c-total-points-value").text("");
    $(".c-contacts-value").text("");
    $(".recent-purchase-date").text("");

}


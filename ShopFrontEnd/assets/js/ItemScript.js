import {ItemModel} from "../models/ItemModel.js";
import {SupplierModel} from "../models/SupplierModel.js";
import {StockModel} from "../models/StockModel.js";
import {ItemImageModel} from "../models/ItemImageModel.js";
import {ImageHolderModel} from "../models/ImageHolderModel.js";
import {toggleBtnClick, total_points_reg} from "./Script.js";
import {getAllItemsSale} from "./SaleScript.js";

import {
    validateOnKeyPressings,
    checkSelectFields,
    checkDateFieldsDifferences,
    checkFields,
    checkDateFields,
    name_reg,
    address_reg,
    mobile_no_reg,
    email_reg,
    postal_code_reg,
    loading_div,
    password_reg,
    item_code_reg,
    price_reg
} from "./Script.js";

let items_ar = null;
let suppliers_ar = null;
let items_ar_search_bar = null;

let item = null;
let item_image_ar = [];

let update_btn_items = false;
let update_btn_items_stock = false;

let item_img_ar_update = [];

let image_green_add = null;
let image_blue_add = null;
let image_red_add = null;
let image_others_add = null;

let image_green = null;
let image_blue = null;
let image_red = null;
let image_others = null;

// let item_table = $("#item-sec .customer-table > table");
let item_table_tbody = $("#item-sec .item-body-wrapper .item-table > tbody");

let item_qty_table_thead = $("#item-sec #item-stock-qty-table > thead");
let item_qty_table_tbody = $("#item-sec #item-stock-qty-table > tbody");

let item_max_qty_table_thead = $("#item-sec #item-stock-max-qty-table > thead");
let item_max_qty_table_tbody = $("#item-sec #item-stock-max-qty-table > tbody");

let selected_item = $("#item-sec .sale-order-id");

// let item_code_add = $("#item-code-add");
let item_description_add = $("#item-description-add");
let category_add = $("#item-category-add");
let price_buy_add = $("#item-price-buy-add");
let price_sell_add = $("#item-price-sell-add");
let supplier_add = $("#item-supplier-add");
let occasion_add = $("#item-occasion-add");
let verities_add = $("#item-verities-add");
let gender_add = $("#item-gender-add");

let img_green_holder_add = $("#green-img-holder-add");
let img_blue_holder_add = $("#blue-img-holder-add");
let img_red_holder_add = $("#red-img-holder-add");
let img_others_holder_add = $("#others-img-holder-add");

let img_green_add_file_chooser = $("#green-shoes-img");
let img_blue_add_file_chooser = $("#blue-shoes-img");
let img_red_add_file_chooser = $("#red-shoes-img");
let img_others_add_file_chooser = $("#others-shoes-img");

let img_green_update_file_chooser = $("#green-shoes-img-update");
let img_blue_update_file_chooser = $("#blue-shoes-img-update");
let img_red_update_file_chooser = $("#red-shoes-img-update");
let img_others_update_file_chooser = $("#other-shoes-img-update");

let item_code = $("#item-code");
let category = $("#item-category");
let occasion = $("#item-occasion");
let verities = $("#item-verities");
let gender = $("#item-gender");
let supplier = $("#item-supplier");
let item_description = $("#item-description");
let price_buy = $("#item-price-buy");
let price_sell = $("#item-price-sell");
let expected_profit = $("#expected-profit");
let profit_margin = $("#expected-profit-percentage");

let update_btn = $("#update-item-btn");
let update_btn_2 = $("#update-item-btn-2");

let item_img_btn_set = $(".img-btn-set-wrapper label");
let item_img = $(".item-img");

// add list
let reg_list = [
    // item_code_reg,
    name_reg,
    price_reg,
    price_reg

];

let input_list_add = [
    // item_code_add,
    item_description_add,
    price_buy_add,
    price_sell_add

];

let input_list = [
    // item_code_add,
    item_description,
    price_buy,
    price_sell

];

let mg_list_field_validation = [
    // "The Item CODE",
    "item description",
    "price buy",
    "price sell"

];

validateOnKeyPressings(input_list_add, reg_list);

$("#items-nav-btn").click(function () {
    loading_div.show();

    fetchAllSuppliers()
    update_btn_items = false;
    // fieldsSetEditable(false);
    $("#item-search-field").val("");
});


[supplier_add, verities_add, occasion_add, gender_add].map(function (select_field) {
    select_field.change(function () {
        checkSelectFields([select_field]);

    });
});

category_add.on('change', function () {
    checkSelectFields([$(this)]);
    setVerities(verities_add, category_add.val());
    setOccasion(category_add.val());
    setGender(category_add.val());

    imageHoldersHide($(this).val());

});

function imageHoldersHide(category) {
    if (category === "ACCESSORIES") {
        $("#item-add-colour-wrapper > div").hide();
        $("#item-add-green-wrapper").show();
        $("#item-add-green-wrapper > button").hide();
    } else {
        $("#item-add-colour-wrapper > div").show();
        $("#item-add-green-wrapper > button").show();

    }

}


function setVerities(verities_select, category) {
    if (category === "SHOES") {
        verities_select.html(`
            <option value="" selected hidden>Select Verities</option>
            <option value="H">Heel</option>
            <option value="F">Flats</option>
            <option value="W">Wedges</option>
            <option value="FF">Flip Flops</option>
            <option value="SD">Sandals</option>
            <option value="S">Shoes</option>
            <option value="SL">Slippers</option>
        `);
    } else {
        verities_select.html(`
            <option value="" selected hidden>Select Verities</option>
            <option value="SHMP">Shoe Shampoo</option>
            <option value="POLB">Polish Black</option>
            <option value="POLBR">Polish Brown</option>
            <option value="POLDBR">Polish Dark Brown</option>
            <option value="SOF">Full-Socks</option>
            <option value="SOH">Half-Socks</option>
        `);

    }

    verities_select.val("");
    verities_select.removeClass("is-valid was-validated");

}

function setOccasion(category) {
    if (category === "SHOES") {
        occasion_add.html(`
            <option value="" selected hidden>Select Occasion</option>
            <option value="F">FORMAL</option>
            <option value="C">CASUAL</option>
            <option value="S">SPORT</option>
            <option value="I">INDUSTRIAL</option>
        `);
    } else {
        occasion_add.html(`
            <option value=accessories"" selected hidden>Occasion</option>
        `);

    }

    occasion_add.removeClass("is-valid was-validated");

}

function setGender(category) {
    if (category === "SHOES") {
        gender_add.html(`
            <option value="" selected hidden>Select Gender</option>
            <option value="M">MALE</option>
            <option value="W">FEMALE</option>
        `);
    } else {
        gender_add.html(`
            <option value="accessories" selected hidden>Gender</option>
        `);

    }

    gender_add.removeClass("is-valid was-validated");

}

// Item get all ajax
$("#items-nav-btn").click(function () {
    loading_div.show();

    fetchAllItems();
    // update_btn = false;
    // fieldsSetEditable(false);
    $("#customer-search-field").val("");

});


// fetch all items
function fetchAllItems() {
    loading_div.show();
    $.ajax({
        url: 'http://localhost:8080/hello-shoe/api/v1/item',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            items_ar = data;
            loadAllItems(items_ar);
            loading_div.hide();

        },
        error: function (xhr, status, error) {
            loading_div.hide();
            Swal.fire({
                icon: 'error',
                title: 'Employees load failed',
                text: 'Try again!'
            });
            // $('#response').text('Error: ' + error);
        }
    });

}

function loadAllItems(ar) {
    item_table_tbody.empty();

    ar.map((item) => {
        item_table_tbody.append(`
            <tr data-item-code = ${item.iCode}>
                <td>${item.iCode}</td>
                <td>${item.description}</td>
                <td>${item.category}</td>
                <td>${item.priceBuy} LKR</td>
                <td>${item.priceSell} LKR</td>
            </tr>
        `);
    });

}

// table select
item_table_tbody.on('click', 'tr', function () {
    loading_div.show()
    update_btn_items = false;
    fieldsSetEditable([item_description, price_buy, price_sell], false);
    clearFields(true);

    fetchItem($(this).data("item-code"));

});

// searchbar
$("#item-search-field").on('input', function () {
    items_ar_search_bar = [];

    items_ar.map(function (tempItem) {
        let itemDesTemp = tempItem.description.toLowerCase();
        let iCodeTemp = tempItem.iCode.toLowerCase();
        let searchBarVal = $("#item-search-field").val().toLowerCase();

        if (itemDesTemp.includes(searchBarVal + "") || iCodeTemp.includes(searchBarVal + "")) {
            items_ar_search_bar.push(tempItem);

        }
    });

    loadAllItems(items_ar_search_bar);

});

// fetch item
function fetchItem(iCode) {
    // console.log(iCode);
    $.ajax({
        url: `http://localhost:8080/hello-shoe/api/v1/item/${iCode}`,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            item = data;

            loadItemDetails();
            loadItemQtyDetails(item.category === "SHOES");
            loading_div.hide();

        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Supplier load failed',
                text: 'Try again!'
            });
            $('#response').text('Error: ' + error);
            loading_div.hide();
        }
    });

}

function loadItemDetails() {
    let temp_profit_margin = ((item.priceSell - item.priceBuy) / item.priceSell) * 100;
    temp_profit_margin = temp_profit_margin.toFixed(2);

    let tempItemCode = item.iCode;
    let itemOccasion = getOccasion(tempItemCode, item.category);
    let itemVerities = getVerities(tempItemCode, item.category);
    let itemGender = getGender(tempItemCode, item.category);

    selected_item.html(tempItemCode);

    item_code.val(tempItemCode);
    category.val(item.category);
    occasion.val(itemOccasion);
    verities.val(itemVerities);
    gender.val(itemGender);
    supplier.val(item.supplierDTO.supplierName);

    item_description.val(item.description);
    price_buy.val(item.priceBuy);
    price_sell.val(item.priceSell);
    expected_profit.val(item.priceSell - item.priceBuy);
    profit_margin.val(temp_profit_margin + " %");

    loadItemImages();

}

function getOccasion(iCode, category) {
    if (category === "ACCESSORIES") {
        return "";
    }

    let occasion = iCode.charAt(0);

    switch (occasion) {
        case "F":
            return "Formal";
        case "C":
            return "Casual";
        case "S":
            return "Sport";
        case "I":
            return "Industrial";
        default :
            return "";
    }

}

function getVerities(iCode, category) {
    if (category === "SHOES") {
        let tempVerities = iCode.length === 8 ? iCode.charAt(1) : iCode.substring(1, 2);

        switch (tempVerities) {
            case "H" :
                return "Heels";
            case "F" :
                return "Flats";
            case "W" :
                return "Wedges";
            case "FF" :
                return "Flip Flops";
            case "SD" :
                return "Sandals";
            case "S" :
                return "Shoes";
            case "SL" :
                return "Slippers";
            default :
                return null;

        }

    } else {
        let itemID = iCode.split("0")[0];

        switch (itemID) {
            case "SHMP":
                return "Shoe Shampoo";
            case "POLB":
                return "Polish Black";
            case "POLBR":
                return "Polish Brown";
            case "POLDBR":
                return "Polish Dark Brown";
            case "SOF":
                return "Full-Socks";
            case "SOH":
                return "Half-Socks";
            default :
                return "";
        }

    }

}

function getGender(iCode, category) {
    if (category === "SHOES") {
        let tempGender = iCode.length === 8 ? iCode.charAt(2) : iCode.charAt(3);

        switch (tempGender) {
            case "M" :
                return "MALE";
            case "F" :
                return "FEMALE";
            default :
                return "";

        }
    } else {
        return "";
    }

}

function loadItemImages() {
    if (item.category === "SHOES") {
        item_img_btn_set.show();

    } else {
        item_img_btn_set.hide();

    }

    item_img_ar_update = [];

    item.itemImageDTOList.forEach(function (itemImage) {
        item_img_ar_update.push(
            new ImageHolderModel(
                itemImage.itemImageId,
                itemImage.image,
                findColourOfImage(itemImage.itemImageId)
            )
        );
        // console.log(item_img_ar_update[0]);
    });

    // console.log(item_img_ar_update.length);
    loadImage(item_img_ar_update[0]);

}

function loadImage(imageHolder) {
    $("#item-img-wrapper").show();
    let temp_url = null;
    if (imageHolder.image) {
        temp_url = `url('${imageHolder.image}')`;
    } else {
        temp_url = `url('/assets/images/icons/warning.png')`;

    }

    item_img.css('background-image', temp_url);
    imgRadioBtnSelector(imageHolder.colour);

    // console.log(imageHolder.colour);

}

function imgRadioBtnSelector(colour) {
    // $(`#item-img-update-${colour}`).click();
    $(`label[for='item-img-update-${colour}']`).click();

}


function findColourOfImage(imageId) {
    let stock = item.stockList.find(stock => stock.itemImgId === imageId);
    return stock.colour;


}

// qty table load
function loadItemQtyDetails(isShoes) {
    item_qty_table_tbody.empty();
    item_max_qty_table_tbody.empty();
    loadRows("SIZE_5", true);

    if (isShoes) {
        ["SIZE_5", "SIZE_6", "SIZE_7", "SIZE_8", "SIZE_9", "SIZE_10", "SIZE_11"].map(function (size) {
            loadRows(size, false);
        });

    } else {
        ["SMALL", "MEDIUM", "LARGE"].map(function (size) {
            loadRows(size, false);
        });

    }


}

function loadRows(size, setHeaders) {
    let stock_green = getStock(size, "GREEN");
    let stock_blue = getStock(size, "BLUE");
    let stock_red = getStock(size, "RED");
    let stock_other = getStock(size, "OTHER");

    let tableDataList = "";
    let tableDataListMaxQty = "";
    let tableHeaders = `<th scope="col">S/C</th>`;

    ///////////////
    if (stock_green) {
        tableHeaders += `<th scope="col">GREEN</th>`;

        tableDataList +=
            `   <td>
                    <input data-stock =${JSON.stringify(stock_green)} type="number" class="form-control" value=${stock_green.qty} min="0" max=${stock_green.maxQty} readonly>
                    ${getStatus(stock_green.status)}
                </td>`;

        tableDataListMaxQty +=
            `   <td>
                    <input data-stock =${JSON.stringify(stock_green)} type="number" class="form-control" min=${stock_green.qty} value=${stock_green.maxQty} readonly>
                </td>`;
    }

    ////////////////
    if (stock_blue) {
        tableHeaders += `<th scope="col">BLUE</th>`;

        tableDataList +=
            `   <td>
                    <input data-stock =${JSON.stringify(stock_blue)} type="number" class="form-control" value=${stock_blue.qty} min="0" max=${stock_blue.maxQty} readonly>
                    ${getStatus(stock_blue.status)}
                </td>`;

        tableDataListMaxQty +=
            `   <td>
                    <input data-stock =${JSON.stringify(stock_blue)} type="number" class="form-control" min=${stock_blue.qty} value=${stock_blue.maxQty} readonly>
                </td>`;
    }

    ////////////////
    if (stock_red) {
        tableHeaders += `<th scope="col">RED</th>`;

        tableDataList +=
            `   <td>
                    <input data-stock =${JSON.stringify(stock_red)} type="number" class="form-control" value=${stock_red.qty} min="0" max=${stock_red.maxQty} readonly>
                    ${getStatus(stock_red.status)}
                </td>`

        tableDataListMaxQty +=
            `   <td>
                    <input data-stock =${JSON.stringify(stock_red)} type="number" class="form-control" min=${stock_red.qty} value=${stock_red.maxQty} readonly>
                </td>`;

    }

    ////////////////
    if (stock_other) {
        tableHeaders += `<th scope="col">OTHER</th>`;

        tableDataList +=
            `   <td>
                    <input data-stock =${JSON.stringify(stock_other)} type="number" class="form-control" value=${stock_other.qty} min="0" max=${stock_other.maxQty} readonly>
                    ${getStatus(stock_other.status)}
                </td>`

        tableDataListMaxQty +=
            `   <td>
                    <input data-stock =${JSON.stringify(stock_other)} type="number" class="form-control" min=${stock_other.qty} value=${stock_other.maxQty} readonly>
                </td>`;

    }

    // console.log(tableDataList);

    if (setHeaders) {
        item_qty_table_thead.empty();

        item_qty_table_thead.append(`
            <tr>
                ${tableHeaders}
            </tr>
            `
        );

        item_max_qty_table_thead.empty();

        item_max_qty_table_thead.append(`
            <tr>
                ${tableHeaders}
            </tr>
            `
        );
        return;
    }

    item_qty_table_tbody.append(`
            <tr>
                <td>${size}</td>
                ${tableDataList}
            </tr>
        `);

    item_max_qty_table_tbody.append(`
            <tr>
                <td>${size}</td>
                ${tableDataListMaxQty}
            </tr>
        `);
};

function getStock(size, colour) {
    return item.stockList.find(stock => stock.size === size && stock.colour === colour);

}

function getStatus(status) {
    if (status === "NOT_AVAILABLE") {
        return `<i style="color: red" class="fi fi-sr-triangle-warning"></i>`;
    } else if (status === "AVAILABLE") {
        return `<i style="color: green" class="fi fi-ss-check-circle"></i>`;
    } else if (status === "LOW") {
        return `<i style="color: orange" class="fi fi-sr-triangle-warning"></i>`;
    }

}

// suppliers load
function fetchAllSuppliers() {
    $.ajax({
        url: 'http://localhost:8080/hello-shoe/api/v1/supplier',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            suppliers_ar = data;
            loadSuppliers();

        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Suppliers load failed',
                text: 'Try again!'
            });
            // $('#response').text('Error: ' + error);
        }
    });

}

function loadSuppliers() {
    supplier_add.empty();
    supplier_add.append('<option value="" selected hidden>Select Supplier</option>');

    suppliers_ar.map(function (supplier) {
        supplier_add.append(`<option value=${supplier.supplierId} >${supplier.supplierName}</option>`);

    });

}

// profile pic action
function setProfilePicAction(imgHolder, fileChooser, isUpdateImgHolders) {
    imgHolder.click(function () {
        if (isUpdateImgHolders && !update_btn_items) {
            return;
        }
        fileChooser.click();

    });
}

function setProfilePicFileChooserAction(imgHolder, fileChooser) {
    fileChooser.change(function (event) {
        var file = event.target.files[0];

        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                imgHolder.css('background-image', 'url(' + e.target.result + ')');

                if (imgHolder.is(img_green_holder_add)) {
                    // console.log("green");
                    image_green_add = e.target.result;
                } else if (imgHolder.is(img_blue_holder_add)) {
                    // console.log("blue");
                    image_blue_add = e.target.result;
                } else if (imgHolder.is(img_red_holder_add)) {
                    // console.log("red");
                    image_red_add = e.target.result;
                } else if (imgHolder.is(img_others_holder_add)) {
                    // console.log("other");
                    image_others_add = e.target.result;
                }

            };
            reader.readAsDataURL(file);
        }

    });
}

setProfilePicAction(img_green_holder_add, img_green_add_file_chooser, false);
setProfilePicAction(img_blue_holder_add, img_blue_add_file_chooser, false);
setProfilePicAction(img_red_holder_add, img_red_add_file_chooser, false);
setProfilePicAction(img_others_holder_add, img_others_add_file_chooser, false);

setProfilePicFileChooserAction(img_green_holder_add, img_green_add_file_chooser);
setProfilePicFileChooserAction(img_blue_holder_add, img_blue_add_file_chooser);
setProfilePicFileChooserAction(img_red_holder_add, img_red_add_file_chooser);
setProfilePicFileChooserAction(img_others_holder_add, img_others_add_file_chooser);


// save Item
$("#save-item-btn").click(function () {

        if (
            checkFields(reg_list, input_list_add, mg_list_field_validation) &&
            checkSelectFields([supplier_add, category_add, occasion_add, verities_add, gender_add]) &&
            checkImgHolders(true)
        ) {
            // console.log("OK");
            loading_div.show();
            // console.log(getAddPageFieldValues());

            $.ajax({
                url: `http://localhost:8080/hello-shoe/api/v1/item`,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: getAddPageFieldValues(),
                success: function (data) {
                    // customer = data;

                    loading_div.hide();

                    Swal.fire({
                        icon: 'success',
                        title: 'Item Saved',
                        text: data.iCode
                    });

                    clearAddFields();
                    fetchAllItems();

                    getAllItemsSale();


                },
                error: function (xhr, status, error) {
                    loading_div.hide();
                    Swal.fire({
                        icon: 'error',
                        title: 'Item save failed'
                        // text: 'Check duplicate emails !'
                    });
                    $('#response').text('Error: ' + error);
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Fill fields correctly !'
            });
        }

    }
);

function getAddPageFieldValues() {
    let category_temp = category_add.val();
    let temp_i_code = null;
    let item_id_number = items_ar.length + 1;
    item_id_number = item_id_number.toString().padStart(5, '0');

    if (category_temp === "SHOES") {
        temp_i_code = occasion_add.val() + verities_add.val() + gender_add.val() + item_id_number;
    } else {
        temp_i_code = verities_add.val() + item_id_number;
    }

    // console.log(temp_i_code);


    let data = JSON.stringify(new ItemModel(
        temp_i_code,
        item_description_add.val(),
        category_temp,
        price_buy_add.val(),
        price_sell_add.val(),
        getSupplier(),
        getStockList(
            category_temp,
            [image_green_add, image_blue_add, image_red_add, image_others_add],
            item_image_ar
        ),
        item_image_ar
    ));

    console.log(item_image_ar);
    return data;

}

function getSupplier() {
    return new SupplierModel(
        supplier_add.val(),
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
    );

}

function getStockList(category, temp_img_ar, img_ar) {
    if (category === "SHOES") {
        img_ar.length = 0;

        let temp_ar = [];
        let temp_colour_ar = ["GREEN", "BLUE", "RED", "OTHER"];

        L1:for (let i = 0; i < temp_img_ar.length; i++) {
            if (temp_img_ar[i] == null) {
                console.log("null");
                continue L1;
            }

            img_ar.push(
                new ItemImageModel(
                    temp_colour_ar[i].charAt(0) + "",
                    temp_img_ar[i]
                )
            );

            // console.log(img_ar);
            // console.log(item_image_ar);

            for (let j = 5; j <= 11; j++) {
                temp_ar.push(
                    new StockModel(
                        "SIZE_" + j,
                        0,
                        50,
                        temp_colour_ar[i],
                        "NOT_AVAILABLE",
                        temp_colour_ar[i].charAt(0) + ""
                    )
                );

            }

        }

        return temp_ar;

    } else {
        img_ar.length = 0;

        let temp_ar = [];
        let temp_sizes = ["SMALL", "MEDIUM", "LARGE"];

        img_ar.push(
            new ItemImageModel(
                "A",
                image_green_add
            )
        );

        for (let i = 0; i < temp_sizes.length; i++) {
            temp_ar.push(
                new StockModel(
                    temp_sizes[i],
                    0,
                    50,
                    "OTHER",
                    "NOT_AVAILABLE",
                    "A"
                )
            );

        }

        return temp_ar;


    }


}

function checkImgHolders(isAddHolders) {
    if (isAddHolders) {
        return (image_green_add != null || image_blue_add != null || image_red_add != null || image_others_add != null);

    } else {
        // return (image_green != null || image_blue != null || image_red != null || image_others != null);


    }


}

// clear fields
function clearAddFields() {
    $("#item-add-wrapper input , #item-add-wrapper select").val("");
    $("#item-add-wrapper input , #item-add-wrapper select").removeClass("is-valid was-validated");

    $("#item-add-colour-wrapper > div > div > div").css("background-image", "url('/assets/images/icons/photo-camera.png')");

    image_green_add = null;
    image_blue_add = null;
    image_red_add = null;
    image_others_add = null;

    item_image_ar = [];

}

function clearFields(alsoValues) {
    if (alsoValues) {
        $("#item-sec .side-bar-wrapper input , #item-sec .side-bar-wrapper select").val("");
        image_green = null;
        image_blue = null;
        image_red = null;
        image_others = null;

        // item_img_ar_update = [];
        selected_item.html("Not selected yet");

    }

    $("#item-sec .side-bar-wrapper input , #item-sec .side-bar-wrapper select").removeClass("is-valid was-validated");

}

// img buttons action
item_img_btn_set.on('click', function () {
    // console.log($(this).html());

});

$("#item-img-update-GREEN").on('click', function () {
        let imageHolder = item_img_ar_update.find(imageHolder => imageHolder.colour === "GREEN");
        if (imageHolder) {
            loadImage(imageHolder);
        } else {
            if (!update_btn_items) {
                imgRadioBtnSelector(item_img_ar_update[0].colour);
                return;
            }

            loadImage(item_img_ar_update[0]);
            img_green_update_file_chooser.click();
        }

    }
);

$("#item-img-update-BLUE").on('click', function () {
        let imageHolder = item_img_ar_update.find(imageHolder => imageHolder.colour === "BLUE");
        if (imageHolder) {
            loadImage(imageHolder);
        } else {
            if (!update_btn_items) {
                imgRadioBtnSelector(item_img_ar_update[0].colour);
                return;
            }

            loadImage(item_img_ar_update[0]);
            img_blue_update_file_chooser.click();
        }

    }
);

$("#item-img-update-RED").on('click', function () {
        let imageHolder = item_img_ar_update.find(imageHolder => imageHolder.colour === "RED");
        if (imageHolder) {
            loadImage(imageHolder);
        } else {
            if (!update_btn_items) {
                imgRadioBtnSelector(item_img_ar_update[0].colour);
                return;
            }

            loadImage(item_img_ar_update[0]);
            img_red_update_file_chooser.click();
        }

    }
);

$("#item-img-update-OTHER").on('click', function () {
        let imageHolder = item_img_ar_update.find(imageHolder => imageHolder.colour === "OTHER");
        if (imageHolder) {
            loadImage(imageHolder);
        } else {
            if (!update_btn_items) {
                imgRadioBtnSelector(item_img_ar_update[0].colour);
                return;
            }

            loadImage(item_img_ar_update[0]);
            img_others_update_file_chooser.click();
            // console.log("not found");
        }

    }
);

function setProfilePicFileChooserActionUpdate(fileChooser, save_file, colour) {
    fileChooser.change(function (event) {
        var file = event.target.files[0];

        if (file) {

            var reader = new FileReader();
            reader.onload = function (e) {
                item_img.css('background-image', 'url(' + e.target.result + ')');
                save_file = e.target.result;

                item_img_ar_update.push(
                    new ImageHolderModel(
                        colour.charAt(0),
                        e.target.result,
                        colour
                    )
                );

                imgRadioBtnSelector(colour);
            };
            reader.readAsDataURL(file);

        }

    });
}

item_qty_table_tbody.on('change', 'input', function () {
    $(this).data("stock").qty = $(this).val();

});

item_max_qty_table_tbody.on('change', 'input', function () {
    $(this).data("stock").maxQty = $(this).val();

});

// update
update_btn.on('click', function () {
    if (update_btn_items) {
        if (
            checkFields(reg_list, input_list, mg_list_field_validation)
        ) {
            loading_div.show();
            item.description = item_description.val();
            item.priceBuy = price_buy.val();
            item.priceSell = price_sell.val();

            $.ajax({
                url: `http://localhost:8080/hello-shoe/api/v1/item/${item.iCode}`,
                method: 'PUT',
                dataType: 'json',
                contentType: 'application/json',
                data: getUpdatePageFieldValues(),
                success: function (data) {
                    // item = data;

                    loading_div.hide();

                    Swal.fire({
                        icon: 'success',
                        title: 'Item Updated',
                        text: data.iCode
                    });

                    clearFields(false);

                    fetchAllItems();
                    getAllItemsSale();

                    fetchItem(data.iCode);
                    fieldsSetEditable([item_description_add, price_buy_add, price_sell_add], false);
                    update_btn_items = false;
                    $("#item-search-field").val("");

                    // item = null;
                },
                error: function (xhr, status, error) {
                    loading_div.hide();
                    Swal.fire({
                        icon: 'error',
                        title: 'Item update failed'
                        // text: 'Check duplicate emails !'
                    });

                }
            });

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Fill fields correctly !'
            });

        }

    } else {
        if (item == null) {
            Swal.fire({
                icon: 'info',
                title: 'Select Item',
                text: 'Select a item first !'
            });
            return;
        }

        fieldsSetEditable([item_description, price_buy, price_sell], true);
        update_btn_items = true;

    }

});

let input_list_update_2 = $("#item-sec #item-stock-qty-table input , #item-sec #item-stock-max-qty-table input");
let reg_list_update_2 = [];
let mg_list_update_2 = [];

for (let i = 0; i < input_list_update_2.length; i++) {
    reg_list_update_2.push(total_points_reg);
    mg_list_update_2.push("Fields");

}

// update 2
update_btn_2.on('click', function () {
    if (update_btn_items_stock) {
        loading_div.show();

        $.ajax({
            url: `http://localhost:8080/hello-shoe/api/v1/item/qty/${item.iCode}`,
            method: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            data: getStockValues(),
            success: function (data) {
                // item = data;

                loading_div.hide();

                Swal.fire({
                    icon: 'success',
                    title: 'Item Updated',
                    text: data.iCode
                });

                // clearFields(false);

                fetchAllItems();
                fetchItem(data.iCode);

                getAllItemsSale();

                // fieldsSetEditable([item_description_add, price_buy_add, price_sell_add], false);
                $("#item-sec #item-stock-qty-table input , #item-sec #item-stock-max-qty-table input").attr("readonly", "");

                update_btn_items_stock = false;
                $("#item-search-field").val("");

                // item = null;
            },
            error: function (xhr, status, error) {
                loading_div.hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Item update failed'
                    // text: 'Check duplicate emails !'
                });

            }
        });

    } else {
        if (item == null) {
            Swal.fire({
                icon: 'info',
                title: 'Select Item',
                text: 'Select a item first !'
            });
            return;
        }

        // fieldsSetEditable(input_list_update_2, true);
        $("#item-sec #item-stock-qty-table input , #item-sec #item-stock-max-qty-table input").removeAttr("readonly");
        update_btn_items_stock = true;

    }

});

function getStockValues() {
    let tempItemModel = new ItemModel();
    tempItemModel.iCode = item.iCode;

    let tempStockList = [];

    $("#item-sec #item-stock-qty-table input").map(function () {
        tempStockList.push($(this).data("stock"));
    });

    tempStockList.push(new StockModel());

    $("#item-sec #item-stock-max-qty-table input").map(function () {
        tempStockList.push($(this).data("stock"));
    });

    tempItemModel.stockList = tempStockList;

    return JSON.stringify(tempItemModel);

}

// function checkStockList() {
//     $("#item-sec #item-stock-qty-table input , #item-sec #item-stock-max-qty-table input").map(function () {
//         if (!total_points_reg.test($(this).val())) {
//             $(this).addClass("is-invalid form-control:invalid");
//         }
//     });
//
// }

function getUpdatePageFieldValues() {

    let tempItemModel = new ItemModel();
    tempItemModel.iCode = item.iCode;
    tempItemModel.description = item_description.val();
    tempItemModel.priceBuy = price_buy.val();
    tempItemModel.priceSell = price_sell.val();

    tempItemModel.stockList = [];
    tempItemModel.itemImageDTOList = [];

    if (item.category === "SHOES") {
        console.log(item_img_ar_update.length);

        for (let i = 0; i < item_img_ar_update.length; i++) {
            if (item_img_ar_update[i].itemImageId.length === 1) {
                for (let j = 5; j <= 11; j++) {
                    tempItemModel.stockList.push(
                        new StockModel(
                            "SIZE_" + j,
                            0,
                            50,
                            item_img_ar_update[i].colour,
                            "NOT_AVAILABLE",
                            item_img_ar_update[i].itemImageId
                        )
                    );

                }

                tempItemModel.itemImageDTOList.push(
                    new ItemImageModel(
                        item_img_ar_update[i].itemImageId,
                        item_img_ar_update[i].image
                    )
                );
            }
        }

    }


    // console.log(JSON.stringify(tempItemModel));

    return JSON.stringify(tempItemModel);

}

function fieldsSetEditable(ar, isUpdatable) {
    if (isUpdatable) {
        for (let i = 0; i < ar.length; i++) {
            // console.log(ar[i]);
            ar[i].removeAttr("readonly");

        }

    } else {
        for (let i = 0; i < ar.length; i++) {
            ar[i].attr("readonly", "");

        }

    }

}


setProfilePicFileChooserActionUpdate(img_green_update_file_chooser, image_green, "GREEN");
setProfilePicFileChooserActionUpdate(img_blue_update_file_chooser, image_blue, "BLUE");
setProfilePicFileChooserActionUpdate(img_red_update_file_chooser, image_red, "RED");
setProfilePicFileChooserActionUpdate(img_others_update_file_chooser, image_others, "OTHER");

$("#item-sec .toggle-btn-2").on("click", () => {
    if (item == null) {
        Swal.fire({
            icon: 'info',
            title: 'Select Item',
            text: 'Select a item first !'
        });

        toggleBtnClick($("#item-sec .toggle-btn-1"));
        return;
    }

    if (update_btn_items) {
        Swal.fire({
            icon: 'info',
            title: 'Complete Update',
            text: 'Complete update process first !'
        });

        toggleBtnClick($("#item-sec .toggle-btn-1"));
    }

});

$("#item-sec .toggle-btn-1").on("click", () => {

});



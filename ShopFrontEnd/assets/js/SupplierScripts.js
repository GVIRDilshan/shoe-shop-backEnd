import {SupplierModel} from "../models/SupplierModel.js";
import {
    validateOnKeyPressings,
    checkSelectFields,
    checkDateFieldsDifferences,
    checkFields,
    checkDateFields,
    name_reg,
    price_reg,
    address_reg,
    mobile_no_reg,
    email_reg,
    total_points_reg,
    postal_code_reg, loading_div
} from "./Script.js";

let suppliers_ar = null;
let suppliers_ar_search_bar = null;
let supplier = null;

let supplier_table = $("#suppliers-sec .customer-table > table");
let supplier_table_tbody = $("#suppliers-sec .customer-table > table > tbody");

let selected_supplier = $("#suppliers-sec .sale-order-id");

let supplier_name = $("#supplier-name");
let supplier_category = $("#supplier-category");
let mobile_no = $("#supplier-contact-mobile");
let landLineNo = $("#supplier-contact-land");
let email = $("#supplier-email");
let address_no = $("#supplier-address-no");
let address_lane = $("#supplier-address-lane");
let address_city = $("#supplier-address-city");
let state = $("#supplier-state");
let postal_code = $("#supplier-postal-code");
let country = $("#supplier-country");

let supplier_name_add = $("#supplier-name-add");
let supplier_category_add = $("#supplier-category-add");
let mobile_no_add = $("#supplier-contact-mobile-add");
let landLineNo_add = $("#supplier-contact-land-add");
let email_add = $("#supplier-email-add");
let address_no_add = $("#supplier-address-no-add");
let address_lane_add = $("#supplier-address-lane-add");
let address_city_add = $("#supplier-address-city-add");
let state_add = $("#supplier-state-add");
let postal_code_add = $("#supplier-postal-code-add");
let country_add = $("#supplier-country-add");

let update_btn_supplier = false;


// add lists
let reg_list = [
    name_reg,
    mobile_no_reg,
    mobile_no_reg,
    email_reg,
    address_reg,
    address_reg,
    name_reg,
    name_reg,
    postal_code_reg,
    name_reg

];

let input_list_add = [
    supplier_name_add,
    mobile_no_add,
    landLineNo_add,
    email_add,
    address_no_add,
    address_lane_add,
    address_city_add,
    state_add,
    postal_code_add,
    country_add

];

let mg_list_field_validation = [
    "The supplier name",
    "mobile number",
    "landline number",
    "email",
    "address number or name",
    "address lane",
    "address city",
    "address state",
    "postal_code",
    "country"

]

// update lists
let input_list_update = [
    supplier_name,
    mobile_no,
    landLineNo,
    email,
    address_no,
    address_lane,
    address_city,
    state,
    postal_code,
    country

];


validateOnKeyPressings(input_list_add, reg_list);
validateOnKeyPressings(input_list_update, reg_list);

function loadAllSuppliers(ar) {
    supplier_table_tbody.empty();

    ar.map((supplier) => {
        supplier_table_tbody.append(`
            <tr data-supplier-id = ${supplier.supplierId}>
                <td>${supplier.supplierName}</td>
                <td>${supplier.mobileNo}</td>
                <td>${supplier.email}</td>
                <td>${supplier.supplierCategory}</td>
                <td>${supplier.country}</td>
            </tr>
        `);
    });

}

// supplier get all ajax
$("#suppliers-nav-btn").click(function () {
    loading_div.show();

    fetchAllSuppliers()
    update_btn_supplier = false;
    fieldsSetEditable(false);
    $("#supplier-search-field").val("");

});

// fetch all suppliers
function fetchAllSuppliers() {
    $.ajax({
        url: 'http://localhost:8080/hello-shoe/api/v1/supplier',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            suppliers_ar = data;
            loadAllSuppliers(suppliers_ar);
            loading_div.hide();

        },
        error: function (xhr, status, error) {
            loading_div.hide();
            Swal.fire({
                icon: 'error',
                title: 'Suppliers load failed',
                text: 'Try again!'
            });
            // $('#response').text('Error: ' + error);
        }
    });

}

// searchbar
$("#supplier-search-field").on('input', function () {
    suppliers_ar_search_bar = [];

    suppliers_ar.map(function (supplier) {
        let supplierNameTemp = supplier.supplierName.toLowerCase();
        let searchBarVal = $("#supplier-search-field").val().toLowerCase();

        if (supplierNameTemp.includes(searchBarVal + "")) {
            suppliers_ar_search_bar.push(supplier);

        }
    });

    loadAllSuppliers(suppliers_ar_search_bar);

});

// table select
supplier_table_tbody.on('click', 'tr', function () {
    update_btn_supplier = false;
    fieldsSetEditable(false);
    clearFields(true);

    fetchCustomer($(this).data("supplier-id"));

});

function fetchCustomer(supplierId) {
    $.ajax({
        url: `http://localhost:8080/hello-shoe/api/v1/supplier/${supplierId}`,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            supplier = data;

            loadSupplierDetails();

        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: 'error',
                title: 'Supplier load failed',
                text: 'Try again!'
            });
            $('#response').text('Error: ' + error);
        }
    });

}

function loadSupplierDetails() {
    selected_supplier.html(supplier.supplierName);
    supplier_name.val(supplier.supplierName);
    supplier_category.val(supplier.supplierCategory);
    mobile_no.val(supplier.mobileNo);
    landLineNo.val(supplier.landLineNo);
    email.val(supplier.email);
    address_no.val(supplier.addressNoOrName);
    address_lane.val(supplier.addressLane);
    address_city.val(supplier.addressCity);
    state.val(supplier.addressState);
    postal_code.val(supplier.postalCode);
    country.val(supplier.country);

}

// save supplier
$("#save-supplier-btn").click(function () {

    if (
        checkFields(reg_list, input_list_add, mg_list_field_validation) &&
        checkSelectFields([supplier_category_add])
    ) {
        loading_div.show();

        console.log(getAddPageFieldValues());

        $.ajax({
            url: `http://localhost:8080/hello-shoe/api/v1/supplier`,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: getAddPageFieldValues(),
            success: function (data) {
                // supplier = data;

                loading_div.hide();

                Swal.fire({
                    icon: 'success',
                    title: 'supplier Saved',
                    text: data.supplierName
                });

                clearAddFields();
                fetchAllSuppliers();
            },
            error: function (xhr, status, error) {
                loading_div.hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Supplier save failed',
                    text: 'Check duplicate emails !'
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

});

// update employee
$("#update-supplier-btn").click(function () {
    if (!update_btn_supplier) {
        if (supplier == null) {
            Swal.fire({
                icon: 'info',
                title: 'Select Supplier',
                text: 'Select a supplier first !'
            });
            return;
        }
        fieldsSetEditable(true);

        update_btn_supplier = true;
    } else {
        if (
            checkFields(reg_list, input_list_update, mg_list_field_validation) &&
            checkSelectFields([supplier_category])
        ) {
            loading_div.show();

            $.ajax({
                url: `http://localhost:8080/hello-shoe/api/v1/supplier/${supplier.supplierId}`,
                method: 'PUT',
                dataType: 'json',
                contentType: 'application/json',
                data: getUpdatePageFieldValues(),
                success: function (data) {
                    // supplier = data;

                    loading_div.hide();

                    Swal.fire({
                        icon: 'success',
                        title: 'Supplier Updated',
                        text: supplier.cName
                    });

                    clearFields(false);

                    fetchAllSuppliers();

                    fieldsSetEditable(false);
                    update_btn_supplier = false;
                    $("#supplier-search-field").val("");
                    // supplier = null;
                },
                error: function (xhr, status, error) {
                    loading_div.hide();
                    Swal.fire({
                        icon: 'error',
                        title: 'Supplier update failed',
                        text: 'Check duplicate emails !'
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


    }


});


[supplier_category, supplier_category_add].map(function (select_field) {
    select_field.change(function () {
        checkSelectFields([select_field]);
    });
});

function getAddPageFieldValues() {
    return JSON.stringify(
        new SupplierModel(
            "",
            supplier_name_add.val(),
            supplier_category_add.val(),
            mobile_no_add.val(),
            landLineNo_add.val(),
            email_add.val(),
            address_no_add.val(),
            address_lane_add.val(),
            address_city_add.val(),
            state_add.val(),
            postal_code_add.val(),
            country_add.val()
        )
    );

}

function getUpdatePageFieldValues() {
    return JSON.stringify(
        new SupplierModel(
            "",
            supplier_name.val(),
            supplier_category.val(),
            mobile_no.val(),
            landLineNo.val(),
            email.val(),
            address_no.val(),
            address_lane.val(),
            address_city.val(),
            state.val(),
            postal_code.val(),
            country.val()
        )
    );

}

function fieldsSetEditable(setEditable) {
    if (setEditable) {
        $("#suppliers-sec .side-bar-wrapper input").removeAttr("readonly");
        $("#suppliers-sec .side-bar-wrapper select").removeAttr("disabled");

    } else {
        $("#suppliers-sec .side-bar-wrapper input").attr("readonly", "");
        $("#suppliers-sec .side-bar-wrapper select").attr("disabled", "");

    }

}

// clear add fields
function clearAddFields() {
    $("#supplier-add-wrapper input , #supplier-add-wrapper select").val("");
    $("#supplier-add-wrapper input , #supplier-add-wrapper select").removeClass("is-valid was-validated");

}

function clearFields(alsoValues) {
    if (alsoValues) {
        $("#suppliers-sec .side-bar-wrapper input , #suppliers-sec .side-bar-wrapper select").val("");
        selected_supplier.html("Not selected yet");

    }
    $("#suppliers-sec .side-bar-wrapper input , #suppliers-sec .side-bar-wrapper select").removeClass("is-valid was-validated");

}



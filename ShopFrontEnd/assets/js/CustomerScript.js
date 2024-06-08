import {CustomerModel} from "../models/CustomerModel.js";
import {getAllCustomers} from "./SaleScript.js";
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
    postal_code_reg,
    loading_div
} from "./Script.js";

let customers_ar = null;
let customers_ar_searchbar = null;
let customer = null;

let customer_table = $("#customer-sec .customer-table > table");
let customer_table_tbody = $("#customer-sec .customer-table > table > tbody");

let selected_customer = $("#customer-sec .sale-order-id");

let customer_name = $("#customer-name");
let contact = $("#contact");
let email = $("#email");
let gender = $("#gender");
let birthday = $("#birthday");
let total_points = $("#total-points");
let level = $("#level");
let join_date = $("#join-date");
let address_no = $("#address-no");
let address_lane = $("#address-lane");
let address_city = $("#address-city");
let state = $("#state");
let postal_code = $("#postal-code");
let recent_purchase = $("#recent-purchase");

let customer_name_add = $("#customer-name-add");
let contact_add = $("#contact-add");
let email_add = $("#email-add");
let gender_add = $("#gender-add");
let birthday_add = $("#birthday-add");
// let total_points_add = $("#total-points-add");
// let level_add = $("#level-add");
let join_date_add = $("#join-date-add");
let address_no_add = $("#address-no-add");
let address_lane_add = $("#address-lane-add");
let address_city_add = $("#address-city-add");
let state_add = $("#state-add");
let postal_code_add = $("#postal-code-add");

let update_btn = false;


// add lists
let reg_list = [
    name_reg,
    mobile_no_reg,
    email_reg,
    // total_points_reg,
    address_reg,
    address_reg,
    name_reg,
    name_reg,
    postal_code_reg

];

let input_list_add = [
    customer_name_add,
    contact_add,
    email_add,
    // total_points_add,
    address_no_add,
    address_lane_add,
    address_city_add,
    state_add,
    postal_code_add

];

let mg_list_field_validation = [
    "The customer name",
    "contact",
    "email",
    // "total points",
    "address number or name",
    "address lane",
    "address city",
    "address state",
    "postal_code"

]

// update lists
let reg_list_update = [
    name_reg,
    mobile_no_reg,
    email_reg,
    total_points_reg,
    address_reg,
    address_reg,
    name_reg,
    name_reg,
    postal_code_reg

];

let input_list_update = [
    customer_name,
    contact,
    email,
    total_points,
    address_no,
    address_lane,
    address_city,
    state,
    postal_code

];

let mg_list_field_validation_update = [
    "The customer name",
    "contact",
    "email",
    // "total points",
    "address number or name",
    "address lane",
    "address city",
    "address state",
    "postal_code"

]


validateOnKeyPressings(input_list_add, reg_list);
validateOnKeyPressings(input_list_update, reg_list_update);

function loadAllCustomers(ar) {
    customer_table_tbody.empty();

    ar.map((customer) => {
        customer_table_tbody.append(`
            <tr data-customer-id = ${customer.cId}>
                <td>${customer.cName}</td>
                <td>${customer.contactNo}</td>
                <td>${customer.email}</td>
                <td>${customer.gender}</td>
                <td>${customer.birthday}</td>
            </tr>
        `);
    });

}

// Customer get all ajax
$("#customers-nav-btn").click(function () {
    loading_div.show();

    fetchAllCustomers();
    update_btn = false;
    fieldsSetEditable(false);
    $("#customer-search-field").val("");

});

// fetch all customers
function fetchAllCustomers() {
    $.ajax({
        url: 'http://localhost:8080/hello-shoe/api/v1/customer',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            customers_ar = data;
            loadAllCustomers(customers_ar);
            loading_div.hide();

        },
        error: function (xhr, status, error) {
            loading_div.hide();
            Swal.fire({
                icon: 'error',
                title: 'Customers load failed',
                text: 'Try again!'
            });
            // $('#response').text('Error: ' + error);
        }
    });

}

// searchbar
$("#customer-search-field").on('input', function () {
    customers_ar_searchbar = [];

    customers_ar.map(function (customer) {
        let customerNameTemp = customer.cName.toLowerCase();
        let searchBarVal = $("#customer-search-field").val().toLowerCase();

        if (customerNameTemp.includes(searchBarVal + "")) {
            customers_ar_searchbar.push(customer);

        }
    });

    loadAllCustomers(customers_ar_searchbar);

});

// table select
customer_table_tbody.on('click', 'tr', function () {
    update_btn = false;
    fieldsSetEditable(false);
    clearFields(true);

    fetchCustomer($(this).data("customer-id"));

});

// load customer details
function loadCustomerDetails() {
    selected_customer.html(customer.cName);
    customer_name.val(customer.cName);
    contact.val(customer.contactNo);
    email.val(customer.email);
    gender.val(customer.gender);
    birthday.val(customer.birthday);
    total_points.val(customer.totalPoints);
    level.val(customer.level);
    join_date.val(customer.joinDate);
    address_no.val(customer.addressNoOrName);
    address_lane.val(customer.addressLane);
    address_city.val(customer.addressCity);
    state.val(customer.addressState);
    postal_code.val(customer.postalCode);
    recent_purchase.val();

}

function fetchCustomer(cId) {
    $.ajax({
        url: `http://localhost:8080/hello-shoe/api/v1/customer/${cId}`,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            customer = data;

            loadCustomerDetails();

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

// save customer
$("#save-customer-btn").click(function () {

    if (
        checkFields(reg_list, input_list_add, mg_list_field_validation) &&
        checkDateFields([birthday_add, join_date_add]) &&
        checkDateFieldsDifferences(birthday_add, join_date_add) &&
        checkSelectFields([gender_add])
    ) {
        loading_div.show();

        $.ajax({
            url: `http://localhost:8080/hello-shoe/api/v1/customer`,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: getAddPageFieldValues(),
            success: function (data) {
                // customer = data;

                loading_div.hide();

                Swal.fire({
                    icon: 'success',
                    title: 'Customer Saved',
                    text: data.cName
                });

                clearAddFields();
                fetchAllCustomers();
                getAllCustomers();

            },
            error: function (xhr, status, error) {
                loading_div.hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Customer save failed',
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

// update customer
$("#update-customer-btn").click(function () {
    if (!update_btn) {
        if (customer == null) {
            Swal.fire({
                icon: 'info',
                title: 'Select Customer',
                text: 'Select a customer first !'
            });
            return;
        }
        fieldsSetEditable(true);

        update_btn = true;
    } else {
        if (
            checkFields(reg_list_update, input_list_update, mg_list_field_validation_update) &&
            checkDateFields([birthday, join_date]) &&
            checkDateFieldsDifferences(birthday, join_date) &&
            checkSelectFields([gender, level])
        ) {
            loading_div.show();

            $.ajax({
                url: `http://localhost:8080/hello-shoe/api/v1/customer/${customer.cId}`,
                method: 'PUT',
                dataType: 'json',
                contentType: 'application/json',
                data: getUpdatePageFieldValues(),
                success: function (data) {
                    customer = data;

                    loading_div.hide();

                    Swal.fire({
                        icon: 'success',
                        title: 'Customer Updated',
                        text: customer.cName
                    });

                    clearFields(false);

                    fetchAllCustomers();
                    getAllCustomers();

                    fieldsSetEditable(false);
                    update_btn = false;
                    $("#customer-search-field").val("");
                    // customer = null;
                },
                error: function (xhr, status, error) {
                    loading_div.hide();
                    Swal.fire({
                        icon: 'error',
                        title: 'Customer update failed',
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


// field set editable
function fieldsSetEditable(setEditable) {
    if (setEditable) {
        $("#customer-sec .side-bar-wrapper input").removeAttr("readonly");
        $("#customer-sec .side-bar-wrapper select").removeAttr("disabled");
        recent_purchase.attr("readonly", "");

    } else {
        $("#customer-sec .side-bar-wrapper input").attr("readonly", "");
        $("#customer-sec .side-bar-wrapper select").attr("disabled", "");

    }

}

[birthday_add, join_date_add, birthday, join_date].map(function (date_field) {
    date_field.change(function () {
        checkDateFields([date_field]);
    });
});

[gender_add, gender].map(function (select_field) {
    select_field.change(function () {
        checkSelectFields([select_field]);
    });
});

// get add page field values
function getAddPageFieldValues() {
    return JSON.stringify(new CustomerModel(
            "",
            customer_name_add.val(),
            gender_add.val(),
            join_date_add.val(),
            "NEW",
            0,
            birthday_add.val(),
            contact_add.val(),
            email_add.val(),
            address_no_add.val(),
            address_lane_add.val(),
            address_city_add.val(),
            state_add.val(),
            postal_code_add.val()
        )
    );

}

function getUpdatePageFieldValues() {
    return JSON.stringify(new CustomerModel(
            "",
            customer_name.val(),
            gender.val(),
            join_date.val(),
            level.val(),
            total_points.val(),
            birthday.val(),
            contact.val(),
            email.val(),
            address_no.val(),
            address_lane.val(),
            address_city.val(),
            state.val(),
            postal_code.val()
        )
    );

}

function clearAddFields() {
    $("#customer-add-wrapper input , #customer-add-wrapper select").val("");
    $("#customer-add-wrapper input , #customer-add-wrapper select").removeClass("is-valid was-validated");

}

function clearFields(alsoValues) {
    if (alsoValues) {
        $("#customer-sec .side-bar-wrapper input , #customer-sec .side-bar-wrapper select").val("");
        selected_customer.html("Not selected yet");

    }
    $("#customer-sec .side-bar-wrapper input , #customer-sec .side-bar-wrapper select").removeClass("is-valid was-validated");
}


// birthday email sending




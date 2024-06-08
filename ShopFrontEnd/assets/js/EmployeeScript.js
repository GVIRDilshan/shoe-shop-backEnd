import {EmployeeModel} from "../models/EmployeeModel.js";
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
    loading_div,
    password_reg
} from "./Script.js";

let employees_ar = null;
let employees_ar_search_bar = null;
let employee = null;

let employee_table = $("#employees-sec .customer-table > table");
let employee_table_tbody = $("#employees-sec .customer-table > table > tbody");

let selected_employee = $("#employees-sec .sale-order-id");

let profile_pic_file_chooser = $("#employee-profile-pic-file-chooser");
let profile_pic_file_chooser_add = $("#employee-profile-pic-file-chooser-add");

let employee_name = $("#employee-name");
let contact_no = $("#employee-contact");
let profile_pic = $("#employee-profile-pic");
let email = $("#employee-email");
let gender = $("#employee-gender");
let birthday = $("#employee-birthday");
let access_role = $("#access-role");
let password = $("#employee-password");
let join_date = $("#employee-join-date");
let branch = $("#employee-branch");
let status = $("#employee-status");
let designation = $("#employee-designation");
let address_no = $("#employee-address-no");
let address_lane = $("#employee-address-lane");
let address_city = $("#employee-address-city");
let state = $("#employee-state");
let postal_code = $("#employee-postal-code");
let emergency_contact_name = $("#employee-emergency-contact-name");
let emergency_contact_no = $("#employee-emergency-contact");

let employee_name_add = $("#employee-name-add");
let contact_no_add = $("#employee-contact-add");
let profile_pic_add = $("#employee-profile-pic-add");
let email_add = $("#employee-email-add");
let gender_add = $("#employee-gender-add");
let birthday_add = $("#employee-birthday-add");
let access_role_add = $("#access-role-add");
let password_add = $("#employee-password-add");
let join_date_add = $("#employee-join-date-add");
let branch_add = $("#employee-branch-add");
let status_add = $("#employee-status-add");
let designation_add = $("#employee-designation-add");
let address_no_add = $("#employee-address-no-add");
let address_lane_add = $("#employee-address-lane-add");
let address_city_add = $("#employee-address-city-add");
let state_add = $("#employee-state-add");
let postal_code_add = $("#employee-postal-code-add");
let emergency_contact_name_add = $("#employee-emergency-contact-name-add");
let emergency_contact_no_add = $("#employee-emergency-contact-add");

let update_btn_employee = false;
let selected_img_add = null;

// add list
let reg_list = [
    name_reg,
    mobile_no_reg,
    email_reg,
    password_reg,
    address_reg,
    name_reg,
    address_reg,
    address_reg,
    address_reg,
    name_reg,
    name_reg,
    postal_code_reg,
    name_reg,
    mobile_no_reg

];

let input_list_add = [
    employee_name_add,
    contact_no_add,
    email_add,
    password_add,
    branch_add,
    status_add,
    designation_add,
    address_no_add,
    address_lane_add,
    address_city_add,
    state_add,
    postal_code_add,
    emergency_contact_name_add,
    emergency_contact_no_add

];

let mg_list_field_validation = [
    "The employee name",
    "mobile number",
    "email",
    "password",
    "branch",
    "status",
    "designation",
    "address number or name",
    "address lane",
    "address city",
    "address state",
    "postal_code",
    "emergency contact person",
    "emergency contact no"

];

// update list
let input_list_update = [
    employee_name,
    contact_no,
    email,
    password,
    branch,
    status,
    designation,
    address_no,
    address_lane,
    address_city,
    state,
    postal_code,
    emergency_contact_name,
    emergency_contact_no

];

validateOnKeyPressings(input_list_add, reg_list);
validateOnKeyPressings(input_list_update, reg_list);

function loadAllSuppliers(ar) {
    employee_table_tbody.empty();

    ar.map((employee) => {
        let temp_url = null;
        if (employee.profilePic) {
            temp_url = `'data:image/png;base64,${employee.profilePic}'`;
        } else {
            temp_url = `/assets/images/icons/warning.png`;

        }

        employee_table_tbody.append(`
            <tr data-employee-id = ${employee.employeeId}>
                <td>
                    <div style="background-image : url(${temp_url})"
                    class="employee-profile-pic-row"></div>
                </td>
                <td>${employee.employeeName}</td>
                <td>${employee.contactNo}</td>
                <td>${employee.email}</td>
                <td>${employee.gender}</td>
            </tr>
        `);
    });

}

// supplier get all ajax
$("#employees-nav-btn").click(function () {
    // console.log("hello");
    loading_div.show();

    fetchAllEmployees();
    update_btn_employee = false;
    fieldsSetEditable(false);
    $("#employees-search-field").val("");

});

// fetch all suppliers
function fetchAllEmployees() {
    $.ajax({
        url: 'http://localhost:8080/hello-shoe/api/v1/employee',
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            employees_ar = data;
            loadAllSuppliers(employees_ar);
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

// table select
employee_table_tbody.on('click', 'tr', function () {
    update_btn_employee = false;
    fieldsSetEditable(false);
    clearFields(true);

    fetchCustomer($(this).data("employee-id"));

});

function fetchCustomer(employeeId) {
    $.ajax({
        url: `http://localhost:8080/hello-shoe/api/v1/employee/${employeeId}`,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            employee = data;

            loadEmployeeDetails();

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

function loadEmployeeDetails() {
    let temp_url = null;
    if (employee.profilePic) {
        temp_url = `url('data:image/png;base64,${employee.profilePic}')`;
    } else {
        temp_url = `url('/assets/images/icons/warning.png')`;

    }

    selected_employee.html(employee.employeeName)
    employee_name.val(employee.employeeName);
    contact_no.val(employee.contactNo);
    email.val(employee.email);
    profile_pic.css('background-image', temp_url);
    gender.val(employee.gender);
    birthday.val(employee.birthday);
    access_role.val(employee.accessRole);
    password.val(atob(employee.password));
    join_date.val(employee.joinDate);
    branch.val(employee.branch);
    status.val(employee.status);
    designation.val(employee.designation);
    address_no.val(employee.addressNoOrName);
    address_lane.val(employee.addressLane);
    address_city.val(employee.addressCity);
    state.val(employee.addressState);
    postal_code.val(employee.postalCode);
    emergency_contact_name.val(employee.emergencyContactPerson);
    emergency_contact_no.val(employee.emergencyContactNumber);

}

// searchbar
$("#employees-search-field").on('input', function () {
    employees_ar_search_bar = [];

    employees_ar.map(function (employee) {
        let employeeNameTemp = employee.employeeName.toLowerCase();
        let searchBarVal = $("#employees-search-field").val().toLowerCase();

        if (employeeNameTemp.includes(searchBarVal + "")) {
            employees_ar_search_bar.push(employee);

        }
    });

    loadAllSuppliers(employees_ar_search_bar);

});

// save employee
$("#save-employee-btn").click(function () {
    if (
        checkFields(reg_list, input_list_add, mg_list_field_validation) &&
        checkDateFields([birthday_add, join_date_add]) &&
        checkDateFieldsDifferences(birthday_add, join_date_add) &&
        checkSelectFields([gender_add, access_role_add]) &&
        checkImageIsSelectedAdd()

    ) {
        loading_div.show();

        $.ajax({
            url: `http://localhost:8080/hello-shoe/api/v1/employee`,
            method: 'POST',
            dataType: 'json',
            processData: false,
            contentType: false,
            data: getAddPageFieldValues(),
            success: function (data) {
                // supplier = data;

                loading_div.hide();

                Swal.fire({
                    icon: 'success',
                    title: 'supplier Saved',
                    text: data.employeeName
                });

                clearAddFields();
                fetchAllEmployees();

                profile_pic_add.css("background-image", "url('/assets/images/icons/photo-camera.png')");
                selected_img_add = null;

            },
            error: function (xhr, status, error) {
                loading_div.hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Employee save failed',
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
$("#update-employee-btn").click(function () {
    if (!update_btn_employee) {
        if (employee == null) {
            Swal.fire({
                icon: 'info',
                title: 'Select Employee',
                text: 'Select a employee first !'
            });
            return;
        }
        fieldsSetEditable(true);

        update_btn_employee = true;
    } else {
        if (
            checkFields(reg_list, input_list_update, mg_list_field_validation) &&
            checkDateFields([birthday, join_date]) &&
            checkDateFieldsDifferences(birthday, join_date) &&
            checkSelectFields([gender, access_role]) &&
            checkImageIsSelected()
        ) {
            loading_div.show();
            $.ajax({
                url: `http://localhost:8080/hello-shoe/api/v1/employee/${employee.employeeId}`,
                method: 'PUT',
                dataType: 'json',
                processData: false,
                contentType: false,
                data: getUpdatePageFieldValues(),
                success: function (data) {
                    // supplier = data;

                    loading_div.hide();

                    Swal.fire({
                        icon: 'success',
                        title: 'Employee Updated',
                        text: employee.cName
                    });

                    clearFields(false);
                    // profile_pic.css("background-image", "url('/assets/images/icons/photo-camera.png')");

                    fetchAllEmployees();

                    fieldsSetEditable(false);
                    update_btn_employee = false;
                    $("#supplier-search-field").val("");
                    // employee = null;
                },
                error: function (xhr, status, error) {
                    loading_div.hide();
                    Swal.fire({
                        icon: 'error',
                        title: 'Employee update failed',
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

function getUpdatePageFieldValues() {
    if (typeof employee.profilePic === typeof "s") {
        function base64ToFile(base64, filename, mimeType) {
            // Decode base64 string to binary format
            var byteString = atob(base64);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            // Create a Blob object
            var blob = new Blob([ab], {type: mimeType});

            // Create a File object
            var file = new File([blob], filename, {type: mimeType});
            return file;

        }

        var base64String = employee.profilePic;
        var fileName = "img.png";
        var mimeType = "image/png";

        employee.profilePic = base64ToFile(base64String, fileName, mimeType);
        return loadUpdatePageFieldValues();


    } else {
        return loadUpdatePageFieldValues();

    }

}

function loadUpdatePageFieldValues() {
    let employeeModel = new EmployeeModel(
        "",
        employee_name.val(),
        employee.profilePic,
        gender.val(),
        status.val(),
        designation.val(),
        access_role.val(),
        birthday.val(),
        join_date.val(),
        branch.val(),
        contact_no.val(),
        email.val(),
        address_no.val(),
        address_lane.val(),
        address_city.val(),
        state.val(),
        postal_code.val(),
        btoa(password.val()),
        emergency_contact_name.val(),
        emergency_contact_no.val()
    );

    let formData = new FormData();
    for (var key in employeeModel) {
        formData.append(key, employeeModel[key]);
    }

    // console.log(formData.get("profilePic"));

    return formData;

}

function getAddPageFieldValues() {
    let employeeModel = new EmployeeModel(
        "",
        employee_name_add.val(),
        selected_img_add,
        gender_add.val(),
        status_add.val(),
        designation_add.val(),
        access_role_add.val(),
        birthday_add.val(),
        join_date_add.val(),
        branch_add.val(),
        contact_no_add.val(),
        email_add.val(),
        address_no_add.val(),
        address_lane_add.val(),
        address_city_add.val(),
        state_add.val(),
        postal_code_add.val(),
        btoa(password_add.val()),
        emergency_contact_name_add.val(),
        emergency_contact_no_add.val()
    );

    let formData = new FormData();
    for (var key in employeeModel) {
        console.log(key + " " + employeeModel[key]);
        formData.append(key, employeeModel[key]);
    }

    return formData;


}

function fieldsSetEditable(setEditable) {
    if (setEditable) {
        $("#employees-sec .side-bar-wrapper input").removeAttr("readonly");
        $("#employees-sec .side-bar-wrapper select").removeAttr("disabled");

    } else {
        $("#employees-sec .side-bar-wrapper input").attr("readonly", "");
        $("#employees-sec .side-bar-wrapper select").attr("disabled", "");

    }

}

// profile pic action
function setProfilePicAction(outerDiv, fileChooser) {
    outerDiv.click(function () {
        if (outerDiv.is(profile_pic) && !update_btn_employee) {
            return;
        }
        fileChooser.click();

    });
}

function setProfilePicFileChooserAction(profilePic, fileChooser) {
    fileChooser.change(function (event) {
        var file = event.target.files[0];

        if (file) {
            if (profile_pic.is(profilePic)) {
                employee.profilePic = file;

            } else {
                selected_img_add = file;

            }

            var reader = new FileReader();
            reader.onload = function (e) {
                profilePic.css('background-image', 'url(' + e.target.result + ')');
            };
            reader.readAsDataURL(file);
        }

    });
}

setProfilePicAction(profile_pic, profile_pic_file_chooser);
setProfilePicFileChooserAction(profile_pic, profile_pic_file_chooser);

setProfilePicAction(profile_pic_add, profile_pic_file_chooser_add);
setProfilePicFileChooserAction(profile_pic_add, profile_pic_file_chooser_add);

function checkImageIsSelected() {
    if (employee.profilePic) {
        return true;

    } else {
        return false;

    }

}

function checkImageIsSelectedAdd() {
    if (selected_img_add) {
        return true;

    } else {
        return false;

    }

}

[access_role, access_role_add, gender, gender_add].map(function (select_field) {
    select_field.change(function () {
        checkSelectFields([select_field]);
    });
});

// clear add fields
function clearAddFields() {
    $("#employees-sec input , #employees-add-wrapper select").val("");
    $("#employees-sec input , #employees-add-wrapper select").removeClass("is-valid was-validated");

}

function clearFields(alsoValues) {
    if (alsoValues) {
        $("#employees-sec .side-bar-wrapper input , #employees-sec .side-bar-wrapper select").val("");
        selected_employee.html("Not selected yet");

    }

    $("#employees-sec .side-bar-wrapper input , #employees-sec .side-bar-wrapper select").removeClass("is-valid was-validated");

}



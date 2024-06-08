$(".toggle-btn-2").on("click", function () {
    $(this).parents("section").find(".side-bar-body").hide();
    $(this).parents("section").find(".side-bar-body-2").show();

    // $(".side-bar-body").hide();
    // $(".side-bar-body-2").show();

    $(this)

    toggleBtnColorChanger($(this), $(this).parents("section").find(".toggle-btn-1"));

});

$(".toggle-btn-1").on("click", function () {
    $(this).parents("section").find(".side-bar-body").show();
    $(this).parents("section").find(".side-bar-body-2").hide();
    // $(".side-bar-body").show();
    // $(".side-bar-body-2").hide();


    toggleBtnColorChanger($(this), $(this).parents("section").find(".toggle-btn-2"));

});

$(".toggle-btn-1").click();

export function toggleBtnClick(btn) {
    btn.click();
}

// $("#customer-toggle-btn").click();
export function toggleBtnColorChanger(btn1, btn2) {
    btn1.css({"backgroundColor": "var(--light-green)"});
    btn2.css({"backgroundColor": "unset"});

}

// $(".body-wrapper").css({"padding-top": "0" , "margin-top":"144px" , "height":"1000px" , "backgroundColor":"blue" });

// $(".filter-btn-set-wrapper").hide();
// $("#filter-btn").hide();
// $("#body-item-wrapper").hide();

function navigateSections(section) {
    $("section").hide();

    section.show();

}

// navigateSections($(".sale-sec"));

// $("#admin-panel-nav-btn").click(function () {
//     navigateSections($(""));
//
// });

$("#sales-nav-btn").click(function () {
    navigateSections($("#sale-sec"));

});

$("#items-nav-btn").click(function () {
    navigateSections($("#item-sec"));

});

$("#customers-nav-btn").click(function () {
    navigateSections($("#customer-sec"));

});

$("#suppliers-nav-btn").click(function () {
    navigateSections($("#suppliers-sec"));

});

$("#employees-nav-btn").click(function () {
    navigateSections($("#employees-sec"));

});

$("#resupply-nav-btn").click(function () {
    navigateSections($("#resupply-sec"));

});

$("#refund-nav-btn").click(function () {
    navigateSections($("#refund-sec"));

});

$("#sale-history-btn").click(function () {
    $("#order-history-body-wrapper").toggle();
    $("#body-item-wrapper").toggle();

});

// $("#item-customer-toggle-set > div").click(function () {
//    $(".item-details-wrapper").hide();
//    // $("").toggle();
//
// });

$("#save-item-btn").click(function () {


});


///////////////////////////////////////////////////////////////////////////////////

$("#add-new-item-btn").click(function () {
    $("#item-add-wrapper").toggle();

});

$("#add-new-customer-btn").click(function () {
    $("#customer-add-wrapper").toggle();

});

$("#add-new-supplier-btn").click(function () {
    $("#supplier-add-wrapper").toggle();

});

$("#add-new-employee-btn").click(function () {
    $("#employees-add-wrapper").toggle();

});

$("#add-new-resupply-btn").click(function () {
    $("#resupply-add-wrapper").toggle();

});

$("#add-new-refund-btn").click(function () {
    $("#refund-add-wrapper").toggle();

});


$("#item-form > i:first-child").click(function () {
    $("#item-add-wrapper").toggle();

});

$("#customer-form > i:first-child").click(function () {
    $("#customer-add-wrapper").toggle();

});

$("#supplier-form > i:first-child").click(function () {
    $("#supplier-add-wrapper").toggle();

});

$("#employee-form > i:first-child").click(function () {
    $("#employees-add-wrapper").toggle();

});

$("#resupply-form > i:first-child").click(function () {
    $("#resupply-add-wrapper").toggle();

});

$("#refund-form > i:first-child").click(function () {
    $("#refund-add-wrapper").toggle();

});

$("#refund-nav-btn").click();
navigateSections($("#login-sec"));


/////////////////////////////////////////////////////////////////////////////////

/*$(document).ready(function(){
    // When the button is clicked, trigger the hidden file input
    $("#photoSelectButton").click(function() {
        $("#photoInput").click();
    });

    // When a photo is selected, handle it
    $("#photoInput").change(function() {
        // Get the selected photo
        var photo = this.files[0];

        // Ensure a photo was selected
        if (photo) {
            // Do something with the photo, such as displaying it
            displayPhoto(photo);
        }
    });

    // Function to display the selected photo
    function displayPhoto(photo) {
        var reader = new FileReader();

        reader.onload = function(e) {
            // Create an image element and set its source to the selected photo
            var img = $("<img>").attr("src", e.target.result);

            // Append the image to a container element
            $("#photoContainer").empty().append(img);
        };

        // Read the selected photo as a data URL
        reader.readAsDataURL(photo);
    }
});*/


// validations
export function validateOnKeyPressings(input_fields, reg_list) {
    for (let i = 0; i < input_fields.length; i++) {
        input_fields[i].on('input', function () {
            if (reg_list[i].test(input_fields[i].val())) {
                $(this).addClass("is-valid was-validated");
                $(this).removeClass("is-invalid was-validated form-control:invalid");
            } else {
                $(this).addClass("is-invalid was-validated form-control:invalid");
                $(this).removeClass("is-valid was-validated form-control:valid");

            }

        });
    }

}

// check field validation dates differences
export function checkDateFieldsDifferences(date_field_1, date_field_2) {
    if (new Date(date_field_1.val()) <= new Date(date_field_2.val())) {
        date_field_2.addClass("is-valid was-validated");
        date_field_2.removeClass("is-invalid was-validated form-control:invalid");
        return true;
    } else {
        date_field_2.addClass("is-invalid was-validated form-control:invalid");
        return false;
    }

}

// check field validations selects
export function checkSelectFields(temp_select_list) {
    for (let i = 0; i < temp_select_list.length; i++) {

        if (!temp_select_list[i].val()) {
            temp_select_list[i].addClass("is-invalid was-validated form-control:invalid");
            return false;
        } else {
            temp_select_list[i].addClass("is-valid was-validated");
            temp_select_list[i].removeClass("is-invalid was-validated form-control:invalid");

        }

    }

    return true;

}

// check field validation
export function checkFields(temp_reg_list, temp_field_list, temp_mg_list) {
    for (let i = 0; i < temp_field_list.length; i++) {
        if (!temp_reg_list[i].test(temp_field_list[i].val())) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Input',
                text: 'Fill ' + temp_mg_list[i] + " correctly !"
            });
            temp_field_list[i].addClass("is-invalid was-validated form-control:invalid");
            return false;
        }

    }


    return true;

}

// check field validation dates
export function checkDateFields(temp_field_list) {
    for (let i = 0; i < temp_field_list.length; i++) {
        if (!temp_field_list[i].val()) {
            temp_field_list[i].addClass("is-invalid was-validated form-control:invalid");
            return false;
        } else {
            let temp_year = temp_field_list[i].val().substring(0, 4);

            if (temp_year > new Date().getFullYear() || temp_year < 1900) {
                return false;
            }

            temp_field_list[i].addClass("is-valid was-validated");
            temp_field_list[i].removeClass("is-invalid was-validated form-control:invalid");

        }

    }

    return true;

}

export const name_reg = /^[A-Za-z\s\-']{3,50}$/;
export const address_reg = /^[A-Za-z0-9]{3,50}$/;
export const price_reg = /^\d{1,7}(\.\d{2})?$/;
export const mobile_no_reg = /^((\+94)|(0))+(\d{9})$/;
export const email_reg = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
export const total_points_reg = /^\b(0|[1-9]\d{0,2}|1000)\b$/;
export const postal_code_reg = /^\d{5}$/;
// export const password_reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
export const password_reg = /^.{8,}$/;
export const item_code_reg = /^(F|C|I|S)(H|F|W|FF|SD|S|SL)(M|W)\d{5}$/;
export const sale_id_reg = /^(O)\d{5}$/;

export const credit_card_digit_reg = /^\d{4}$/;

export let loading_div = $("#loading_div");





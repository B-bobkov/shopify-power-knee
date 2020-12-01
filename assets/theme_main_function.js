var screenWidth; //screen width of device
var ex_screenWidth; // screen width of device before one sec

var slider_cart_order_price; // order price without any discount | calculate from the cart product list in ajax cart
var ex_slider_cart_order_price; // order price without any discount before one sec
var cart_discounted_price; // total discount (automatic or mannual code) | get val from displayed summary bar
var subTotal_price; //price that customer has to pay | calculate by slider_cart_order_price minus  cart_discounted_price

var discountCode; // text in the discount input box
var discounted_value; // discounted price when manually apply discount | fixed or % off
var current_discount_title, current_discount_type, current_discount_val; // applied discount title, fixed_amount or percentage, how much it is-value is minus
var automatic_discount_amount; // automatic discount amount + value ; from cart.js api
var haveTo_apply_new_discount = "yes"; // flag for apply new discount after reduced cart amount from automatic discount

var list_of_sale_price = new Array(100);
var cycle_of_second_timer;
var compared_prc_saving = 0;

window.onload = startThemeFunction;

function startThemeFunction() {
    console.log("Fully loaded, now start theme function");
    make_Bt_sticky_content_blocks_ajax_cart(); //when screen width changes, needed to be called


    setTimeout(function() { main_timer_function(); }, 5000); // need to be calibrated
    if (window.location.href.indexOf("preview") < 0) {
        check_if_emptyCart_orNot();
    } else {
        display_gaps_on_theme_preview();
    }
}


function main_timer_function() {

    console.log(cycle_of_second_timer);

    setInterval(function() {

        console.log("Hello, I am theme timer");

        if (window.location.href.indexOf("preview") > 0) { // WHEN ON THEME EDITOR
            preview_CartProduct_for_theme_edit(); //make it possible to keep it displayed by adding solid part
            make_Bt_sticky_content_blocks_ajax_cart(); //when screen width changes, needed to be called
            $("#loading_cart_wrapper").hide();
            if ($("#preview_empty_cart").val() == "true") {
                $("#empty_cart_wrapper").show();
            } else {
                $("#empty_cart_wrapper").hide();
            }
            calculates_cart_price();
            if ($(".free_shipping_motivator_bar").length > 0) motivate_freeshippin(); // this is needed when order price changes
            if ($(".discount_motivator_bar").length > 0) motivate_discount(); // this is needed when order price changes
            $('#ajax_cart_total_price').text($('#ajax_cart_curr_symbol').text() + slider_cart_order_price);
            display_gaps_on_theme_preview();
            display_gaps_on_theme_preview();
        } else { // WHEN ON STORE SITE
            calculates_cart_price(); // this must be here cos it set criteria!!!
            update_savings_added_by_gap();
        }

        check_if_screenWidth_changed(); //if true, make element bottom sticky in mobile and laptop mode

        if ($(".shipping_price_summ_bar").length > 0) autofill_shipping_price_to_zero_when_not_filled(); // is this needed to be in timer?

        check_if_cartOrderPrice_changed(); //check if cart order price is changed, if true, fetch new cart information, also change discounts, saving display, motivate...


        if ($(".total__price_summ_bar").length > 0) display_cart_price_in_total_sum();

    }, 1000);

}

function preview_CartProduct_for_theme_edit() {
    des = document.getElementById("ajax_cart_product_container");
    var ttt = "<div class='cart_product_wrapper'><div class='ajaxcart__row'> <div class='ajaxcart__product' data-line='2'> <div class='grid grid--half-gutters'> <div class='grid__item one-quarter'> <a class='cart_product_img_with_variant' href='/products/demo-product?variant=34159597191300'><img src='https://cdn.shopify.com/s/files/1/0287/5624/6660/products/PAPKit-1_1000x1000_0212c4df-7097-470a-8716-a0ef67f3b9a3_small.jpg?v=1588329974' alt='Sunny Skin™ Skin Tightening Wand'></a> </div> <div class='grid__item three-quarters'> <div class='ajaxcart__product-name-wrapper'> <a href='/products/demo-product?variant=34159597191300' class='ajaxcart__product-name'>Sunny Skin™ Skin Tightening Wand</a> <span class='ajaxcart__product-meta'>⠀</span> <div class='remove ajaxifyCart--remove' data-line='2' ><svg width='9' viewBox='0 0 10 10'><path d='M9.677 8.118a1.102 1.102 0 11-1.559 1.56L5 6.558 1.882 9.677a1.102 1.102 0 11-1.56-1.559L3.442 5 .323 1.882A1.102 1.102 0 111.882.322L5 3.442 8.118.323a1.102 1.102 0 111.56 1.559L6.558 5l3.118 3.118z'></path></svg></div> </div> <div class='grid line_item_main_bt'> <div class='grid__item one-third'> <div class='ajaxcart__qty'> <button type='button' class='ajaxcart__qty-adjust ajaxcart__qty--minus' data-id='34159597191300:e149465fd615c4a3267d7b1f84cfbb3a' data-qty='19' data-line='2' aria-label='Reduce item quantity by one'> <span class='icon icon-minus' aria-hidden='true'></span> <span class='icon__fallback-text' aria-hidden='true'>−</span> </button> <input type='text' name='updates[]' class='ajaxcart__qty-num' value='20' min='0' data-id='34159597191300:e149465fd615c4a3267d7b1f84cfbb3a' data-line='2' aria-label='quantity' pattern='[0-9]*'> <button type='button' class='ajaxcart__qty-adjust ajaxcart__qty--plus' data-id='34159597191300:e149465fd615c4a3267d7b1f84cfbb3a' data-line='2' data-qty='21' aria-label='Increase item quantity by one'> <span class='icon icon-plus' aria-hidden='true'></span> <span class='icon__fallback-text' aria-hidden='true'>+</span> </button> </div> </div> <div class='grid__item one-third text-right sale_price_wrapper'><span class='sale_price'>$3199.00</span></div> <div class='grid__item one-third text-right actual_price'> <span class='money'>$1,199.00</span> </div> </div> </div> </div> </div> </div> <div class='ajaxcart__row'> <div class='ajaxcart__product' data-line='3'> <div class='grid grid--half-gutters'> <div class='grid__item one-quarter'> <a class='cart_product_img_with_variant' href='/products/baby-diaper-bag-with-usb-port-71574?variant=34378914791556'><img src='https://cdn.shopify.com/s/files/1/0287/5624/6660/products/43ef0478505572009ccdee8eb6cc1c82_small.jpg?v=1604933316' alt='Baby Diaper Bag with USB Port'></a> </div> <div class='grid__item three-quarters'> <div class='ajaxcart__product-name-wrapper'> <a href='/products/baby-diaper-bag-with-usb-port-71574?variant=34378914791556' class='ajaxcart__product-name'>Baby Diaper Bag with USB Port</a> <span class='ajaxcart__product-meta'>Pink⠀</span> <div class='remove ajaxifyCart--remove' data-line='3'><svg width='9' viewBox='0 0 10 10'><path d='M9.677 8.118a1.102 1.102 0 11-1.559 1.56L5 6.558 1.882 9.677a1.102 1.102 0 11-1.56-1.559L3.442 5 .323 1.882A1.102 1.102 0 111.882.322L5 3.442 8.118.323a1.102 1.102 0 111.56 1.559L6.558 5l3.118 3.118z'></path></svg></div> </div> <div class='grid line_item_main_bt'> <div class='grid__item one-third'> <div class='ajaxcart__qty'> <button type='button' class='ajaxcart__qty-adjust ajaxcart__qty--minus' data-id='34378914791556:9f7921bd5dc16dacb1fdd3691d1e72ef' data-qty='26' data-line='3' aria-label='Reduce item quantity by one'> <span class='icon icon-minus' aria-hidden='true'></span> <span class='icon__fallback-text' aria-hidden='true'>−</span> </button> <input type='text' name='updates[]' class='ajaxcart__qty-num' value='27' min='0' data-id='34378914791556:9f7921bd5dc16dacb1fdd3691d1e72ef' data-line='3' aria-label='quantity' pattern='[0-9]*'> <button type='button' class='ajaxcart__qty-adjust ajaxcart__qty--plus' data-id='34378914791556:9f7921bd5dc16dacb1fdd3691d1e72ef' data-line='3' data-qty='28' aria-label='Increase item quantity by one'> <span class='icon icon-plus' aria-hidden='true'></span> <span class='icon__fallback-text' aria-hidden='true'>+</span> </button> </div> </div> <div class='grid__item one-third text-right sale_price_wrapper'><span class='sale_price'>$4050.00</span></div> <div class='grid__item one-third text-right actual_price'> <span class='money'>$3,676.86</span> </div> </div> </div> </div> </div> </div> </div> ";
    des.innerHTML = ttt + "<input class='sticky_lap' type='text' value='stick_lap_no'><input class='sticky_mob' type='text' value='stick_mob_no'>";
}

function make_Bt_sticky_content_blocks_ajax_cart() {

    var ajax_cart_block_container = document.getElementById("cart_blocks_container");
    var bt_sticked_blocks = document.getElementById("bt_sticked_blocks");

    if (ajax_cart_block_container.children[0].hasAttribute("data-order") == false) {
        for (let index = 0; index < ajax_cart_block_container.childElementCount; index++) {
            ajax_cart_block_container.children[index].setAttribute("data-order", index);
        }
    }

    // Read bt_sticky attr of elements in TOP DIV and let them down to the sticky_bt_div  need to be searched up_side_down ****
    for (let index = ajax_cart_block_container.childElementCount - 2; index > -1; index--) {
        var sticky_lap = document.getElementsByClassName('sticky_lap')[index].value;
        var sticky_mob = document.getElementsByClassName('sticky_mob')[index].value;

        if (sticky_lap == 'stick_lap_yes' && window.innerWidth >= 600) {
            bt_sticked_blocks.appendChild(ajax_cart_block_container.children[index]);
        }
        if (sticky_mob == 'stick_mob_yes' && window.innerWidth < 600) {
            bt_sticked_blocks.appendChild(ajax_cart_block_container.children[index]);
        }
    }


    // Read bt_sticky attr of elements in BT DIV and let them up to the top_div  need to be searched up_side_down ****
    for (let index = 0; index < bt_sticked_blocks.childElementCount; index++) {
        var sticky_lap = bt_sticked_blocks.children[index].getElementsByTagName("div")[0].getElementsByClassName("sticky_lap")[0].value;
        var sticky_mob = bt_sticked_blocks.children[index].getElementsByTagName("div")[0].getElementsByClassName("sticky_mob")[0].value;

        if (sticky_lap == 'stick_lap_no' && window.innerWidth >= 600) {
            console.log("moveup!!");
            var xxx = parseInt(bt_sticked_blocks.children[index].getAttribute("data-order"));
            ajax_cart_block_container.insertBefore(bt_sticked_blocks.children[index], ajax_cart_block_container.children[xxx]);
        }

        if (sticky_mob == 'stick_mob_no' && window.innerWidth < 600) {
            console.log("moveup!!");
            var xxx = parseInt(bt_sticked_blocks.children[index].getAttribute("data-order"));
            ajax_cart_block_container.insertBefore(bt_sticked_blocks.children[index], ajax_cart_block_container.children[xxx]);
        }
    }

    //Reorder elements in BT DIV
    bt_sticked_blocks_jQueryObject = $("#bt_sticked_blocks");
    bt_sticked_blocks_jQueryObject.find('[data-order]').sort(function(a, b) {
            return +a.dataset.order - +b.dataset.order;
        })
        .appendTo(bt_sticked_blocks_jQueryObject);

    ajax_cart_block_container.style.bottom = bt_sticked_blocks.offsetHeight + "px";

}

function autofill_shipping_price_to_zero_when_not_filled() {
    if ($(".shipping_prc_bar_right_price p:first").text() == "") $(".shipping_prc_bar_right_price").append("<p>$0.00</p>");
}

function motivate_freeshippin() {

    if (document.getElementById('val_to_unlock_freeshipping').value == '') {
        var setVal_to_freeshipping = 0;
    } else {
        var setVal_to_freeshipping = parseFloat(document.getElementById('val_to_unlock_freeshipping').value);
    }

    var free_shipping_motivator_amount_price_style = document.getElementById('free_shipping_motivator_amount_price_style').value;
    var free_shipping_moti_congra_show_style = document.getElementById('free_shipping_moti_congra_show_style').value;
    var change_free_shipping_motivator_cong_bg = document.getElementById('change_free_shipping_motivator_cong_bg').value;
    var free_shipping_motivator_cong_bg_col = document.getElementById('free_shipping_motivator_cong_bg_col').value;
    var free_shipping_motivator_cong_bg_col_origin = document.getElementById('free_shipping_motivator_cong_bg_col_origin').value;

    if (slider_cart_order_price > setVal_to_freeshipping) {
        $(".free_shipping_moti_progressbar").width("100%");
        $(".free_shipping_moti_congra_txt").show();
        $(".free_shipping_moti_headline").hide();
        if (free_shipping_moti_congra_show_style != 'Headline_&_Progress_Bar') $(".free_shipping_moti_prog_wrapper").hide();
        if (change_free_shipping_motivator_cong_bg == 'true') $(".free_shipping_motivator_bar").css("background-color", free_shipping_motivator_cong_bg_col);

    } else {
        $(".free_shipping_motivator_bar").css("background-color", free_shipping_motivator_cong_bg_col_origin);
        $(".free_shipping_moti_progressbar").width(slider_cart_order_price / setVal_to_freeshipping * 100 + "%");
        $(".free_shipping_moti_congra_txt").hide();
        $(".free_shipping_moti_headline").show();
        $(".free_shipping_moti_prog_wrapper").show();
        if (free_shipping_motivator_amount_price_style == "$10.00") {
            var left_amount_for_freeshipping = "$" + (setVal_to_freeshipping - slider_cart_order_price).toFixed(2);
            $(".money_away_from_freeshipping").text(left_amount_for_freeshipping);
        } else {
            var left_amount_for_freeshipping = "$" + parseInt(setVal_to_freeshipping - slider_cart_order_price);
            $(".money_away_from_freeshipping").text(left_amount_for_freeshipping);
        }
    }

}

function calculates_cart_price() {
    var value = 0;
    var len = $(".grid__item.one-third.text-right.actual_price>span").length;
    for (let index = 0; index < len; index++) {
        value += parseInt($(".grid__item.one-third.text-right.actual_price>span")[index].innerHTML.replace(/\D/g, ''))
    }
    slider_cart_order_price = value / 100;
}

function motivate_discount() {

    if (document.getElementById('discount_motivator_order_val').value == '') {
        var setVal_to_discount = 0;
    } else {
        var setVal_to_discount = parseFloat(document.getElementById('discount_motivator_order_val').value);
    }

    var discount_motivator_price_style = document.getElementById('discount_motivator_price_style').value;
    var discount_motivator_congra_pos = document.getElementById('discount_motivator_congra_pos').value;
    var discount_motivator_cong_bg = document.getElementById('discount_motivator_cong_bg').value;
    var discount_motivator_cong_bg_col = document.getElementById('discount_motivator_cong_bg_col').value;
    var discount_motivator_bg_col = document.getElementById('discount_motivator_bg_col').value;

    if (slider_cart_order_price > setVal_to_discount) {
        $(".discount_moti_progressbar").width("100%");
        $(".discount_moti_congra_txt").show();
        $(".discount_moti_headline").hide();
        if (discount_motivator_congra_pos != 'Headline_&_Progress_Bar') $(".discount_moti_prog_wrapper").hide();
        if (discount_motivator_cong_bg == 'true') $(".discount_motivator_bar").css("background-color", discount_motivator_cong_bg_col);

    } else {
        $(".discount_motivator_bar").css("background-color", discount_motivator_bg_col);
        $(".discount_moti_progressbar").width(slider_cart_order_price / setVal_to_discount * 100 + "%");
        $(".discount_moti_congra_txt").hide();
        $(".discount_moti_headline").show();
        $(".discount_moti_prog_wrapper").show();
        if (discount_motivator_price_style == "$10.00") {
            var left_amount_for_discount = "$" + (setVal_to_discount - slider_cart_order_price).toFixed(2);
            $(".money_away_from_discount").text(left_amount_for_discount);
        } else {
            var left_amount_for_discount = "$" + parseInt(setVal_to_discount - slider_cart_order_price);
            $(".money_away_from_discount").text(left_amount_for_discount);
        }
    }

}

function display_cart_price_in_total_sum() {
    if (subTotal_price != undefined) $('#ajax_cart_total_price').text($('#ajax_cart_curr_symbol').text() + subTotal_price);
}

$("#add_coupon_code").click(async function() {
    console.log("apply btn clicked");

    discountCode = $("#coupon_code").val();

    if (discountCode != "") {
        $("#add_coupon_code").css("background-position-x", "center");
        $("#add_coupon_code>p").css("visibility", "hidden");
        result = await fetch(`/admin/discount_codes/lookup.json?code=${discountCode}`);
        if (result.status == 200) {
            console.log("valid code");
            $(".invalid_dis_code").hide();

            apply_mannual_discount_code();

        } else {
            console.log("invalid code");
            $(".invalid_dis_code").show();
            empty_discount();
        }

        $("#add_coupon_code").css("background-position-x", "-100px");
        $("#add_coupon_code>p").css("visibility", "visible");

    }

});

function add_automatic_discount_info_to_savings_sum() {
    $(".right_part>p").text("-" + $('#ajax_cart_curr_symbol').text() + (automatic_discount_amount / 100).toFixed(2));
    $(".discount_icon_wrapper").css("visibility", "hidden");
    deactivate_discountApplyBlock();
}

function activate_discountApplyBlock() {
    $("#add_coupon_code").prop('disabled', false);
    $("#coupon_code").prop('disabled', false);
}

function deactivate_discountApplyBlock() {
    $("#add_coupon_code").prop('disabled', true);
    $("#coupon_code").prop('disabled', true);
}

function apply_mannual_discount_code() {

    $.get("https://f407f879de9b7e98781336e94b0b139f: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@power-knee-demo.myshopify.com/admin/api/2020-10/price_rules.json", function(data, status) {
        var len = data.price_rules.length;
        for (let index = 0; index < len; index++) {

            if (data.price_rules[index].title.toUpperCase() == discountCode.toUpperCase()) {

                current_discount_title = data.price_rules[index].title;
                current_discount_type = data.price_rules[index].value_type;
                current_discount_val = data.price_rules[index].value;

                calculate_and_dispaly_mannual_discountCode();
                calculates_cart_discounted_price();
            }
        }
    });

    $("#add_coupon_code").css("background-position-x", "-100px");
    $("#add_coupon_code>p").css("visibility", "visible");
    $(".invalid_dis_code").hide();

}

$("#discount_icon_close").click(function() {
    empty_discount();
    $("#coupon_code").val("");
    calculates_cart_discounted_price();
});

function empty_discount() {
    $(".right_part>p").text("");
    $(".discount_icon_wrapper").css("visibility", "hidden");
    discounted_value = 0;
    discountCode = "";
}

function calculates_cart_discounted_price() {

    if ($(".right_part>p").text() == "") {
        cart_discounted_price = 0
    } else {
        cart_discounted_price = parseInt($(".right_part>p").text().replace(/\D/g, '')) / 100;
    }
    subTotal_price = (slider_cart_order_price - cart_discounted_price).toFixed(2);
    display_cart_price_in_total_sum();
}

function check_if_screenWidth_changed() {
    screenWidth = window.innerWidth;

    if (screenWidth != ex_screenWidth) {
        console.log("screenwidth changed");
        make_Bt_sticky_content_blocks_ajax_cart(); // only needed to called when screen width changes
        ex_screenWidth = screenWidth;
    }
}

function check_if_cartOrderPrice_changed() {
    if (slider_cart_order_price != ex_slider_cart_order_price) { // ORDER CHANGED!!!
        console.log("cart_order_price changed");

        make_list_of_sales_price();

        cartContents = fetch('/cart.js').then(response => response.json()).then(data => {
            automatic_discount_amount = data.total_discount;
            if (automatic_discount_amount > 0) { // if automatic discount is applied...
                add_automatic_discount_info_to_savings_sum();
                haveTo_apply_new_discount = "yes";
                $("#coupon_code").val("");
            }
            if (automatic_discount_amount == 0) { // if manunal discount was applied before
                activate_discountApplyBlock();
                if (discountCode != undefined) {
                    if (haveTo_apply_new_discount == "yes") { // check if discount code is changed?
                        apply_mannual_discount_code();
                        $("#coupon_code").val(discountCode);
                        haveTo_apply_new_discount = "no";
                    }
                    calculate_and_dispaly_mannual_discountCode();
                } else {
                    $(".right_part>p").text("");
                }
            }

            if ($(".free_shipping_motivator_bar").length > 0) motivate_freeshippin(); // this is needed when order price changes
            if ($(".discount_motivator_bar").length > 0) motivate_discount(); // this is needed when order price changes
            calculates_cart_discounted_price();

        });

    }
    ex_slider_cart_order_price = slider_cart_order_price;
}

function calculate_and_dispaly_mannual_discountCode() {
    if (current_discount_type == "percentage") discounted_value = slider_cart_order_price * parseInt(current_discount_val) / -100;
    if (current_discount_type == "fixed_amount") discounted_value = parseInt(current_discount_val) * -1;

    $("#applied_discount_name").text(current_discount_title);
    if ($("#coupon_code").val() != "") $(".discount_icon_wrapper").css("visibility", "visible");
    if ($("#coupon_code").val() != "") {
        $(".right_part>p").text("-" + $('#ajax_cart_curr_symbol').text() + discounted_value.toFixed(2));
    } else {
        $(".right_part>p").text("");
    }
}

function check_if_emptyCart_orNot() {
    var haveTogetSalePrice = "yes";
    cycle_of_second_timer = 0;

    setInterval(function() {
        cycle_of_second_timer += 1;
        if ($(".ajaxcart__row").length + $("#CartContainer>p.cart--empty-message").length > 0) { //Ajax Cart Loaded!!!

            $("#loading_cart_wrapper").fadeOut(); // Loading disappears!

            if ($(".ajaxcart__row").length == 0) { // Empty Cart!!!
                $("#empty_cart_wrapper").fadeIn();
            } else { // Not Empty Cart!!!

                $("#empty_cart_wrapper").fadeOut();

                if (cycle_of_second_timer < 49) { //////////// Calibrated
                    calculates_cart_price();
                    if ($(".free_shipping_motivator_bar").length > 0) motivate_freeshippin(); // this is needed when order price changes
                    if ($(".discount_motivator_bar").length > 0) motivate_discount(); // this is needed when order price changes
                    $('#ajax_cart_total_price').text($('#ajax_cart_curr_symbol').text() + slider_cart_order_price.toFixed(2));

                    make_Bt_sticky_content_blocks_ajax_cart(); // has to be executed only once
                    display_gaps_at_savings_sum_at_beginning();
                }

                if (haveTogetSalePrice == "yes") {
                    make_list_of_sales_price();
                    haveTogetSalePrice = "no";
                }

                display_sale_price_and_calc_gaps();
            }
        }
    }, 100);
}

function make_list_of_sales_price() {
    var cartProduct_img_link = document.getElementsByClassName("cart_product_img_with_variant");
    var cart_product_qty = document.getElementsByClassName("ajaxcart__qty-num");
    var len = cartProduct_img_link.length;
    var compared_price;
    for (let index = 0; index < len; index++) {
        variant = cartProduct_img_link[index].href.split("variant=")[1];
        $.get("https://f407f879de9b7e98781336e94b0b139f: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@power-knee-demo.myshopify.com/admin/api/2020-04/variants/" + variant + ".json", function(data, status) {
            if (data.variant.compare_at_price != null) {
                compared_price = parseFloat(data.variant.compare_at_price) * parseInt(cart_product_qty[index].value);
                var displayed_sale_price = $('#ajax_cart_curr_symbol').text() + compared_price.toFixed(2);
                list_of_sale_price[index] = displayed_sale_price;
            } else {
                list_of_sale_price[index] = "";
            }
        });
    }
}

function display_sale_price_and_calc_gaps() {
    var sale_price_span = document.getElementsByClassName("sale_price");
    var len = sale_price_span.length;
    var gap = 0;
    for (let index = 0; index < len; index++) {
        sale_price_span[index].textContent = list_of_sale_price[index];
        if (list_of_sale_price[index] != "" && list_of_sale_price[index] != undefined)
            gap += (parseInt(list_of_sale_price[index].replace(/\D/g, '')) - parseInt($(".grid__item.one-third.text-right.actual_price>span")[index].innerHTML.replace(/\D/g, ''))) / 100;
    }
    compared_prc_saving = gap;
}

function display_gaps_at_savings_sum_at_beginning() {
    if (compared_prc_saving != 0)
        $(".right_part_2>p").text("-" + $('#ajax_cart_curr_symbol').text() + compared_prc_saving.toFixed(2));
}


function update_savings_added_by_gap() {
    var tmp = compared_prc_saving + cart_discounted_price;

    if (cart_discounted_price != undefined) {
        if (tmp == 0) {
            $(".right_part_2>p").text("");
        } else {
            $(".right_part_2>p").text("-" + $('#ajax_cart_curr_symbol').text() + tmp.toFixed(2));
        }
    }
}

// $("#test").click(function() {
//     console.log("test clicked!");
//     discountCode = "smile";
//     apply_mannual_discount_code();
//     $('#coupon_code').val(discountCode);
//     document._checkout_form.action = document._checkout_form.action + '?discount=' + discountCode;
// });

function display_gaps_on_theme_preview() {
    var sale_price_span = document.getElementsByClassName("sale_price");
    var len = sale_price_span.length;
    var gap = 0;
    for (let index = 0; index < len; index++) {
        if (sale_price_span[index].textContent != "")
            gap += (parseInt(sale_price_span[index].textContent.replace(/\D/g, '')) - parseInt($(".grid__item.one-third.text-right.actual_price>span")[index].innerHTML.replace(/\D/g, ''))) / 100;
    }
    $(".right_part_2>p").text("-" + $('#ajax_cart_curr_symbol').text() + gap.toFixed(2));
}
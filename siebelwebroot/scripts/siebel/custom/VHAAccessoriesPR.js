if (typeof SiebelAppFacade.VHAAccessoriesPR === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.VHAAccessoriesPR");
    define("siebel/custom/VHAAccessoriesPR", [
            "order!siebel/phyrenderer", "siebel/custom/VHABTProcessCall"
        ], function () {
        SiebelAppFacade.VHAAccessoriesPR = (function () {
            function VHAAccessoriesPR(pm) {
                SiebelAppFacade.VHAAccessoriesPR.superclass.constructor.call(this, pm);
            }
            SiebelJS.Extend(VHAAccessoriesPR, SiebelAppFacade.PhysicalRenderer);
            //var uibusy ={selfbusy:false, mask:true, async:false,opdecode:true,target:SiebelApp.S_App.GetTargetViewContainer(),EnableProgressBar:true};
            var intitialData = {
                insBC: {
                    id: ""
                },
                billingAccount: {
                    id: "",
                    accountNumber: "",
                    deliveryMethod: "",
                    deliveryEmail: "",
                    notifyVia: "",
                    notifyEmail: "",
                    notifyTxt: "",
                    paymentMethod: {
                        type: "",
                        bsb: "",
                        bankDetails: "",
                        accountNumber: "",
                        accountName: "",
                        CCToken: "",
                        CCExprDate: "",
                        CCExprMonth: "",
                        CCExprYear: "",
                        CCHolder: "",
                        CCType: "",
                        CCFirst6: "",
                        CCLast4: ""
                    }
                },
                featureConfig: {
                    planId: "",
                    roaming: "",
                    dataAddOn: "",
                    dataAddOnGlobalId: "",
                    dataAddOnProdId: "",
                    dataAddOndollar: "",
                    dataAddOnsamid: "",
                    iddAddOn: "",
                    iddAddOnGlobalId: "",
                    iddAddOnProdId: "",
                    iddAddOndollar: "",
                    iddAddOnsamid: "",
                    recurringDiscounts: ""
                }
            };

            var addOnData = {};
            var addOnLoaded = false;
            var restrictedDiscount = {};
            //["New Customer", "Existing CA", "Existing BA"];
            var layoutType = "New Customer";
            var out = "";
            var resultset = "";
            var SiebelMessage = "";
            var ParentIC = "";
            var sMobile;
            VHAAccessoriesPR.prototype.ShowUI = function () {
                SiebelAppFacade.VHAAccessoriesPR.superclass.ShowUI.call(this);
                var pm = this.GetPM();
                var IAAppletId = pm.Get("GetFullId");
                $("#" + IAAppletId).html(getHtmlTemplate());
                $('.direct-debit').addClass('VFDisplayNone');
                $('.credit-debit').addClass('VFDisplayNone');
                //sBindEnts(pm);
                BTRender(pm); //Balji M -Miami 09/May/2022
                intitialData.insBC.id = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VHA TOT Generic BC").GetFieldValue("Id");
                var sBillAId = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VHA TOT Generic BC").GetFieldValue("Billing Account Id");
                if (sBillAId != "")
                    VHAAccessoriesPR.initializeBillingAccount(sBillAId, "Y", "Default");
                else
                    VHAAccessoriesPR.initializeBillingAccount("NA", "Y", "NA");
                var Inputs = SiebelApp.S_App.NewPropertySet();
                var Outs = SiebelApp.S_App.NewPropertySet();
                Inputs.SetProperty("Responsibility", "VF Function Access - Restricted Products");
                Outs = VHAAppUtilities.CallBS(
                        "VF Check Responsibilities", "Check Responsibilities",
                        Inputs, {});
                if (Outs.propArray.Exists != "Y")
                    $('.discounts-method>div').addClass('applet-button-readonly').removeClass('applet-button-passive').removeClass('applet-button-active');
            };

            VHAAccessoriesPR.prototype.BindEvents = function () {
                SiebelAppFacade.VHAAccessoriesPR.superclass.BindEvents.apply(
                    this,
                    arguments);
                var pm = this.GetPM();
                $('.submit-data').off("click").on("click", function () {
                    //test="Y";
                    VHAAccessoriesPR.submitData();
                });
                $('.input-field.bsb').autocomplete({
                    source: function (request, response) {
                        var Inps = SiebelApp.S_App.NewPropertySet();
                        var Outs = SiebelApp.S_App.NewPropertySet();
                        Inps.SetProperty("Parameters", "BSB Number,Institution Code,Branch Name,Bank Address,Bank Suburb,Bank State,Bank Postcode,Payment Types");
                        Inps.SetProperty("search-string", request.term);
                        Outs = VHAAppUtilities.CallBS(
                                "VF Retrieve BSB Service", "Query",
                                Inps, "");
                        response(Outs.childArray.map(function (a) {
                                return {
                                    label: a.propArray["BSB Number"],
                                    value: a.propArray["BSB Number"],
                                    BankDetails: a.propArray["Branch Name"] + ' ' + a.propArray["BSB Number"],
                                    type: "BSB"
                                }
                            }));
                    },
                    minLength: 6,
                    select: selectAutoCompleteVal
                });
                $(".applet-title-data").on("click", ".new-billing-account", {}, function () {
                    resetBilingAccount();
                    $('.account-number').attr("entered", ""); //VHA Guru : Added to nullify BAN in existing customer TOT when changed to New BA in order journey
                    updateBillingAccId("");
                });
                $(".delivery-method").on("click", ".applet-button", {}, function () {
                    if ($(this).hasClass("applet-button-active")) {
                        return;
                    }
                    $('.parent-controls-container.delivery-method').next('.VHAAccErr').remove();
                    $(".delivery-method .applet-button-active")
                    .removeClass("applet-button-active")
                    .addClass("applet-button-passive");
                    $(this)
                    .addClass("applet-button-active")
                    .removeClass("applet-button-passive");

                    var val = $(this).attr("val");
                    intitialData.billingAccount.deliveryMethod = val;
                    intitialData.billingAccount.deliveryEmail = "";
                    $(".delivery-method .input-field").val('');
                    switch (val) {
                    case "Email":
                        $("#billing-delivery-email-id").removeClass("VFDisplayNone");
                        break;
                    default:
                        $("#billing-delivery-email-id").addClass("VFDisplayNone");
                        break;
                    }
                });
                $(".notification-method").on("click", ".applet-button", {}, function () {
                    if ($(this).hasClass("applet-button-active")) {
                        return;
                    }
                    $('.parent-controls-container.notification-method').next('.VHAAccErr').remove();
                    $(".notification-method .applet-button-active")
                    .removeClass("applet-button-active")
                    .addClass("applet-button-passive");
                    $(this)
                    .addClass("applet-button-active")
                    .removeClass("applet-button-passive");

                    var val = $(this).attr("val");
                    intitialData.billingAccount.notifyVia = val;
                    $("#billing-notify-email-id").addClass("VFDisplayNone");
                    $("#billing-notify-text").addClass("VFDisplayNone");
                    $(".notification-method .input-field").val('');
                    intitialData.billingAccount.notifyEmail = "";
                    intitialData.billingAccount.notifyTxt = "";
                    switch (val) {
                    case "Email":
                        $("#billing-notify-email-id").removeClass("VFDisplayNone");
                        break;
                    case "TXT":
                        $("#billing-notify-text").removeClass("VFDisplayNone");
                        break;
                    default:
                        $("#billing-notify-text").removeClass("VFDisplayNone");
                        $("#billing-notify-email-id").removeClass("VFDisplayNone");
                        break;
                    }
                });
                $(".payment-method").on("click", ".applet-button", {}, function () {
                    if ($(this).hasClass("applet-button-active")) {
                        return;
                    }
                    $('.parent-controls-container.payment-method').next('.VHAAccErr').remove();
                    $('#ToTEmpPymt').remove();
                    $('.VHADDFldErr').remove();
                    $(".payment-method .applet-button-active")
                    .removeClass("applet-button-active")
                    .addClass("applet-button-passive");
                    $(this)
                    .addClass("applet-button-active")
                    .removeClass("applet-button-passive");
                    var val = $(this).attr("val");
                    intitialData.billingAccount.paymentMethod.type = val;
                    $(".direct-debit").addClass("VFDisplayNone");
                    $(".credit-debit").addClass("VFDisplayNone");
                    switch (val) {
                    case "Direct Debit":
                        $(".direct-debit").removeClass("VFDisplayNone");
                        resetcreditCard();
                        break;
                    case "Credit Card":
                        $(".credit-debit").removeClass("VFDisplayNone");
                        resetdirectDebit();
                        break;
                    default:
                        resetdirectDebit();
                        resetcreditCard();
                        break;
                    }
                    function resetdirectDebit() {
                        $('.direct-debit input').val('');
                        intitialData.billingAccount.paymentMethod.bsb = "";
                        intitialData.billingAccount.paymentMethod.bankDetails = "";
                        intitialData.billingAccount.paymentMethod.accountNumber = "";
                        intitialData.billingAccount.paymentMethod.accountName = "";
                    }
                    function resetcreditCard() {
                        $('.credit-debit input').val('');
                        intitialData.billingAccount.paymentMethod.CCExprDate = "";
                        intitialData.billingAccount.paymentMethod.CCToken = "";
                        intitialData.billingAccount.paymentMethod.CCExprMonth = "";
                        intitialData.billingAccount.paymentMethod.CCExprYear = "";
                        intitialData.billingAccount.paymentMethod.CCHolder = "";
                        intitialData.billingAccount.paymentMethod.CCType = "";
                        intitialData.billingAccount.paymentMethod.CCFirst6 = ""; //Balaji M - Added for miami 09/May/2022
                        intitialData.billingAccount.paymentMethod.CCLast4 = ""; //Balaji M - Added for miami 09/May/2022
                    }
                });
                $(".roaming-method").on("click", ".applet-button", {}, function () {
                    if ($(this).hasClass("applet-button-active")) {
                        return;
                    }
                    $(".roaming-method .applet-button-active")
                    .removeClass("applet-button-active")
                    .addClass("applet-button-passive");
                    $(this)
                    .addClass("applet-button-active")
                    .removeClass("applet-button-passive");
                    var selVal = $(this).text();
                    intitialData.featureConfig.roaming = selVal == "Off" ? "" : selVal;
                    /*var selectionObj={"type":"vha-tot-addons",
                    "subType":"cart-roaming-addons",
                    "dollar":selVal=="$5 Roaming"?"$ 5.00":selVal=="PAYG"?"$ 10.00":"$ 0",
                    "value": selVal};
                    SiebelAppFacade.VHAToTCommonViewPR.addCartItems(selectionObj);*/
                });
                $(".data-addon-method").on("click", ".applet-button", {}, function () {
                    if ($(this).hasClass("applet-button-active")) {
                        return;
                    }
                    $('#feature-config-addon').val("");
                    if (!addOnLoaded) {
                        VHAAccessoriesPR.getAddonsList("N");
                    }
                    $(".data-addon-method .applet-button-active")
                    .removeClass("applet-button-active")
                    .addClass("applet-button-passive");
                    $(this)
                    .addClass("applet-button-active")
                    .removeClass("applet-button-passive");

                    var val = $(this).attr("val");
                    var featrueConfigAddon = "#feature-config-addon";
                    var featureDropDown = ".addon-drop-down";
                    var container = ".data-addon-container";
                    $(container).removeClass("VFDisplayNone");
                    // $(featureDropDown).addClass("VFDisplayNone");
                    switch (val) {
                    case "OneOff":
                        $(featrueConfigAddon).autocomplete({
                            source: addOnData.dataOneOff.map(function (a) {
                                return {
                                    label: a.name,
                                    value: a.name,
                                    chargeType: a.chargeType,
                                    dollar: a.dollar,
                                    type: "data",
                                    GbProdId: a.GbProdId,
                                    ProdId: a.ProdId,
                                    SamId: a.SamId
                                };
                            }),
                            minLength: 0,
                            select: selectAutoCompleteVal
                        });
                        $(featureDropDown).click(dropDownTrigger);
                        break;
                    case "Recurring":
                        $(featrueConfigAddon).autocomplete({
                            source: addOnData.dataRecurring.map(function (a) {
                                return {
                                    label: a.name,
                                    value: a.name,
                                    chargeType: a.chargeType,
                                    dollar: a.dollar,
                                    type: "data",
                                    GbProdId: a.GbProdId,
                                    ProdId: a.ProdId,
                                    SamId: a.SamId
                                };
                            }),
                            minLength: 0,
                            select: selectAutoCompleteVal
                        });
                        $(featureDropDown).click(dropDownTrigger);
                        break;
                    default:
                        $(container).addClass("VFDisplayNone");
                        intitialData.featureConfig.dataAddOn = "";
                        intitialData.featureConfig.dataAddOnGlobalId = "";
                        intitialData.featureConfig.dataAddOnProdId = "";
                        intitialData.featureConfig.dataAddOndollar = "";
                        intitialData.featureConfig.dataAddOnsamid = "";
                        //remove from cart
                        var selectionObj = {
                            "type": "vha-tot-addons",
                            "subType": "cart-data-addons",
                            "dollar": "$ 0",
                            "value": val
                        };
                        SiebelAppFacade.VHAToTCommonViewPR.addCartItems(selectionObj);
                        break;
                    }

                });
                $(".international-call-method").on(
                    "click",
                    ".applet-button", {},
                    function () {
                    if ($(this).hasClass("applet-button-active")) {
                        return;
                    }
                    $('#feature-config-idd').val("");
                    if (!addOnLoaded) {
                        VHAAccessoriesPR.getAddonsList("N");
                    }
                    $(".international-call-method .applet-button-active")
                    .removeClass("applet-button-active")
                    .addClass("applet-button-passive");
                    $(this)
                    .addClass("applet-button-active")
                    .removeClass("applet-button-passive");
                    var val = $(this).attr("val");
                    var featureConfigIdd = "#feature-config-idd";
                    var featureDropDown = ".idd-drop-down";
                    var container = ".idd-addon-container";
                    $(container).removeClass("VFDisplayNone");
                    //$(featureConfigIdd).addClass("VFDisplayNone");
                    //$(featureDropDown).addClass("VFDisplayNone");
                    switch (val) {
                    case "OneOff":
                        $(featureConfigIdd).autocomplete({
                            source: addOnData.iddOneOff.map(function (a) {
                                return {
                                    label: a.name,
                                    value: a.name,
                                    chargeType: a.chargeType,
                                    dollar: a.dollar,
                                    type: "idd",
                                    GbProdId: a.GbProdId,
                                    ProdId: a.ProdId,
                                    SamId: a.SamId
                                };
                            }),
                            minLength: 0,
                            select: selectAutoCompleteVal
                        });
                        $(featureDropDown).click(dropDownTrigger);
                        break;
                    case "Recurring":
                        $(featureConfigIdd).autocomplete({
                            source: addOnData.iddRecurring.map(function (a) {
                                return {
                                    label: a.name,
                                    value: a.name,
                                    chargeType: a.chargeType,
                                    dollar: a.dollar,
                                    type: "idd",
                                    GbProdId: a.GbProdId,
                                    ProdId: a.ProdId,
                                    SamId: a.SamId
                                };
                            }),
                            minLength: 0,
                            select: selectAutoCompleteVal
                        });
                        $(featureDropDown).click(dropDownTrigger);
                        break;
                    default:
                        $(container).addClass("VFDisplayNone");
                        intitialData.featureConfig.iddAddOn = "";
                        intitialData.featureConfig.iddAddOnGlobalId = "";
                        intitialData.featureConfig.iddAddOnProdId = "";
                        intitialData.featureConfig.iddAddOndollar = "";
                        intitialData.featureConfig.iddAddOnsamid = "";
                        var selectionObj = {
                            "type": "vha-tot-addons",
                            "subType": "cart-idd-addons",
                            "dollar": "$ 0",
                            "value": val
                        };
                        SiebelAppFacade.VHAToTCommonViewPR.addCartItems(selectionObj);
                        break;
                    }
                });
                $(".discounts-method").on("click", ".applet-button", {}, function () {
                    if ($(this).hasClass("applet-button-active")) {
                        return;
                    }
                    $(".discounts-method .applet-button-active")
                    .removeClass("applet-button-active")
                    .addClass("applet-button-passive");
                    $(this)
                    .addClass("applet-button-active")
                    .removeClass("applet-button-passive");

                    var val = $(this).attr("val");
                    switch (val) {
                    case "Recurring":
                        $(".product-selection").removeClass("VFDisplayNone");
                        setupRestrictedDiscount();
                        break;
                    default:
                        $(".restricted-discount-line").remove();
                        $(".product-selection").addClass("VFDisplayNone");
                    }
                });

                $("#VHAExistingBill").on("click", function () {
                    $(".existing-billing-account-rec").removeClass("VFDisplayNone");
                });

                $(".VHAPopupCloseCircle").on("click", function () {
                    $(".existing-billing-account-rec").addClass("VFDisplayNone");
                });

                $('.account-number').blur(function () {
                    accountNumberMask();
                });
                $('.account-number').focus(function () {
                    $('.account-number').val($('.account-number').attr("entered"));
                });
            };

            var accountNumberMask = function () {
                if ($('.account-number').val().length < 1) {
                    $('.account-number').attr("entered", "");
                } else {
                    $('.account-number').attr("entered", $('.account-number').val());
                    var a = '';
                    for (var i = 0; i < ($('.account-number').val().length); i++) {
                        if (i < ($('.account-number').val().length - 4)) {
                            a = a + '*';
                        } else {
                            a = a + $('.account-number').val().substring(i, i + 1);
                        }
                    }
                    $('.account-number').val(a);
                }
            }

            var resetBilingAccount = function () {
                $('.billing-account-number').text('');
                $('.billing-account .applet-button-active').removeClass('applet-button-active').addClass('applet-button-passive');
                $('.billing-account input').val('');
                $('.credit-debit,.direct-debit,#billing-notify-text,#billing-notify-email-id,#billing-delivery-email-id').addClass("VFDisplayNone");
                intitialData.billingAccount.id = "";
                intitialData.billingAccount.accountNumber = "";
                intitialData.billingAccount.deliveryMethod = "";
                intitialData.billingAccount.deliveryEmail = "";
                intitialData.billingAccount.notifyVia = "";
                intitialData.billingAccount.notifyEmail = "";
                intitialData.billingAccount.notifyTxt = "";
                intitialData.billingAccount.paymentMethod.type = "";
                intitialData.billingAccount.paymentMethod.bsb = "";
                intitialData.billingAccount.paymentMethod.bankDetails = "";
                intitialData.billingAccount.paymentMethod.accountNumber = "";
                intitialData.billingAccount.paymentMethod.accountName = "";
                intitialData.billingAccount.paymentMethod.CCExprDate = "";
                intitialData.billingAccount.paymentMethod.CCToken = "";
                intitialData.billingAccount.paymentMethod.CCExprMonth = "";
                intitialData.billingAccount.paymentMethod.CCExprYear = "";
                intitialData.billingAccount.paymentMethod.CCHolder = "";
                intitialData.billingAccount.paymentMethod.CCType = "";
                intitialData.billingAccount.paymentMethod.CCFirst6 = ""; //Balaji M - Added for miami 09/May/2022
                intitialData.billingAccount.paymentMethod.CCLast4 = ""; //Balaji M - Added for miami 09/May/2022
            }
            VHAAccessoriesPR.resetConfigFeatures = function () {
                $('.feature-config input').val('').prop("checked", false);
                $('.feature-config .applet-button-active').removeClass('applet-button-active').addClass('applet-button-passive');
                $('.feature-config .applet-button[val="Off"],[val="NotInterested"]').addClass('applet-button-active').removeClass('applet-button-passive');
                $('.data-addon-container, .idd-addon-container').addClass('VFDisplayNone');
                $('.product-selection .input-field').prop('readonly', true).val('');
                $('.product-selection .input-checkbox').prop('checked', false);
                $(".restricted-discount-line").remove();
                $(".product-selection").addClass("VFDisplayNone");
                intitialData.featureConfig.planId = "";
                intitialData.featureConfig.roaming = "";
                intitialData.featureConfig.dataAddOn = "";
                intitialData.featureConfig.dataAddOndollar = "";
                intitialData.featureConfig.dataAddOnGlobalId = "";
                intitialData.featureConfig.dataAddOnProdId = "";
                intitialData.featureConfig.iddAddOn = "";
                intitialData.featureConfig.iddAddOndollar = "";
                intitialData.featureConfig.iddAddOnsamid = "";
                intitialData.featureConfig.dataAddOnsamid = "";
                intitialData.featureConfig.iddAddOnGlobalId = "";
                intitialData.featureConfig.iddAddOnProdId = "";
                intitialData.featureConfig.recurringDiscounts = "";
            }
            VHAAccessoriesPR.submitData = function () {
                var billingAccount = intitialData.billingAccount;
                var sPrcd = mValidate(billingAccount);
                if (sPrcd) {
                    if (intitialData.billingAccount.deliveryMethod == "Email") {
                        intitialData.billingAccount.deliveryEmail = $(
                                "#billing-delivery-email-id").val();
                    }

                    if (intitialData.billingAccount.notifyVia == "Email") {
                        intitialData.billingAccount.notifyEmail = $("#billing-notify-email-id").val();
                    } else if (intitialData.billingAccount.notifyVia == "TXT") {
                        intitialData.billingAccount.notifyTxt = $("#billing-notify-text").val();
                    } else if (intitialData.billingAccount.notifyVia == "Email and TXT") {
                        intitialData.billingAccount.notifyEmail = $("#billing-notify-email-id").val();
                        intitialData.billingAccount.notifyTxt = $("#billing-notify-text").val();
                    }

                    if (billingAccount.paymentMethod.type == "Direct Debit") {
                        intitialData.billingAccount.paymentMethod.bsb = $(
                                ".direct-debit .bsb").val();
                        intitialData.billingAccount.paymentMethod.bankDetails = $(
                                ".direct-debit .bank-details").val();
                        intitialData.billingAccount.paymentMethod.accountNumber = $(
                                ".direct-debit .account-number").attr("entered");
                        intitialData.billingAccount.paymentMethod.accountName = $(
                                ".direct-debit .account-name").val();
                    } else if (billingAccount.paymentMethod.type == "Credit Card") {}
                    else if (billingAccount.paymentMethod.type == "Other") {}
                    var recurringDiscountsArray = new Array();
                    $(".product-selection .input-checkbox").each(function (e) {
                        if ($(this).is(":checked")) {
                            var id = $(this).attr("id");
                            var amount = $("#amount-" + id).val();
                            var period = $("#period-" + id).val();
                            var reasonCode = $("#reason-code-" + id).val();
                            var productName = $(this).attr("name");
                            var samid = $(this).attr("samid");
                            var gProdId = "Recurring Discount";
                            var percent = id == "1-4LV7C3N" ? "10" : "";
                            recurringDiscountsArray.push(
                                id +
                                ";" +
                                samid +
                                ";" +
                                amount +
                                ";" +
                                period +
                                ";" +
                                reasonCode +
                                ";" +
                                productName +
                                ";" +
                                gProdId +
                                ";" +
                                percent +
                                ";");
                        }
                    });
                    var recurringDiscounts = "";
                    for (a = 0; a < recurringDiscountsArray.length; a++) {
                        if (a == 0) {
                            recurringDiscounts = recurringDiscountsArray[a];
                        } else {
                            recurringDiscounts += "|" + recurringDiscountsArray[a];
                        }
                    }
                    intitialData.featureConfig.recurringDiscounts = recurringDiscounts;
                    var dataAddOns = intitialData.featureConfig.dataAddOn;
                    var iddAddOns = intitialData.featureConfig.iddAddOn;
                    //var roam = intitialData.featureConfig.roaming;
                    //var roamings=roam=="$5 Roaming"?"Daily Pass - Use Your Plan Overseas":roam;

                    var addOns =
                        dataAddOns == "" ?
                        iddAddOns :
                        iddAddOns == "" ?
                        dataAddOns :
                        dataAddOns + ";" + iddAddOns;

                    //addOns=addOns==""?roamings:addOns+";"+roamings;
                    var BAAct = intitialData.billingAccount.id == "" ? "New" : "Existing";
                    var Inps = SiebelApp.S_App.NewPropertySet();
                    var Outs = SiebelApp.S_App.NewPropertySet();

                    Inps.SetProperty("Object Id", intitialData.insBC.id);
                    Inps.SetProperty(
                        "Notify Bill Via",
                        intitialData.billingAccount.deliveryMethod);
                    Inps.SetProperty(
                        "Email Bill To",
                        intitialData.billingAccount.deliveryEmail);
                    Inps.SetProperty(
                        "Payment Type",
                        intitialData.billingAccount.paymentMethod.type);
                    Inps.SetProperty(
                        "Notify Alerts Via",
                        intitialData.billingAccount.notifyVia);
                    Inps.SetProperty(
                        "Notification Email",
                        intitialData.billingAccount.notifyEmail);
                    Inps.SetProperty(
                        "Notification MSISDN",
                        intitialData.billingAccount.notifyTxt);
                    Inps.SetProperty(
                        "Bank Branch",
                        intitialData.billingAccount.paymentMethod.bsb);
                    Inps.SetProperty(
                        "Bank Name",
                        intitialData.billingAccount.paymentMethod.bankDetails);
                    Inps.SetProperty(
                        "Bank Account Number",
                        intitialData.billingAccount.paymentMethod.accountNumber);
                    Inps.SetProperty(
                        "Bank Account Name",
                        intitialData.billingAccount.paymentMethod.accountName);
                    Inps.SetProperty(
                        "CCNum",
                        intitialData.billingAccount.paymentMethod.CCToken);
                    Inps.SetProperty(
                        "CCExprMonth",
                        intitialData.billingAccount.paymentMethod.CCExprMonth);
                    Inps.SetProperty(
                        "CCExprYear",
                        intitialData.billingAccount.paymentMethod.CCExprYear);
                    Inps.SetProperty(
                        "CCHolder",
                        intitialData.billingAccount.paymentMethod.CCHolder);
                    Inps.SetProperty(
                        "CCType",
                        intitialData.billingAccount.paymentMethod.CCType);
                    //Balaji M - Added for miami 09/May/2022
                    Inps.SetProperty(
                        "CCFirst6",
                        intitialData.billingAccount.paymentMethod.CCFirst6);
                    //Balaji M - Added for miami 09/May/2022
                    Inps.SetProperty(
                        "CCLast4",
                        intitialData.billingAccount.paymentMethod.CCLast4);
                    Inps.SetProperty(
                        "Billing Account Row Id",
                        intitialData.billingAccount.id);
                    Inps.SetProperty(
                        "BA Action",
                        BAAct);
                    Inps.SetProperty(
                        "Recurring Discounts",
                        intitialData.featureConfig.recurringDiscounts);
                    Inps.SetProperty("Roaming Product", intitialData.featureConfig.roaming);
                    Inps.SetProperty("Add-Ons", addOns);
                    Inps.SetProperty("PlanId", intitialData.featureConfig.planId);
                    Outs = VHAAppUtilities.CallWorkflow(
                            "VHA TOT Order Flow Wrapper Workflow",
                            Inps);
                    if (Outs.propArray["Error Code"] != "" || Outs.propArray["Error Message"] != "") {
                        alert(Outs.propArray["Error Code"] + "\n" + Outs.propArray["Error Message"]);
                        return {
                            "NextStep": false,
                            "asyncInp": "",
                            "pdfInp": ""
                        };
                    } else if (Outs.propArray["InlineMessageShown"] != "" && Outs.propArray["InlineMessageShown"] != undefined) {
                        return {
                            "NextStep": false,
                            "asyncInp": "",
                            "pdfInp": ""
                        };
                    } else {
                        var inpArg = "Object Id=" + intitialData.insBC.id + "&";
                        inpArg = inpArg + "Notify Bill Via=" + intitialData.billingAccount.deliveryMethod + "&";
                        inpArg = inpArg + "Email Bill To=" + intitialData.billingAccount.deliveryEmail + "&";
                        inpArg = inpArg + "Payment Type=" + intitialData.billingAccount.paymentMethod.type + "&";
                        inpArg = inpArg + "Notify Alerts Via=" + intitialData.billingAccount.notifyVia + "&";
                        inpArg = inpArg + "Notification Email=" + intitialData.billingAccount.notifyEmail + "&";
                        inpArg = inpArg + "Notification MSISDN=" + intitialData.billingAccount.notifyTxt + "&";
                        inpArg = inpArg + "Bank Branch=" + intitialData.billingAccount.paymentMethod.bsb + "&";
                        inpArg = inpArg + "Bank Name=" + intitialData.billingAccount.paymentMethod.bankDetails + "&";
                        inpArg = inpArg + "Bank Account Number=" + intitialData.billingAccount.paymentMethod.accountNumber + "&";
                        inpArg = inpArg + "Bank Account Name=" + intitialData.billingAccount.paymentMethod.accountName + "&";
                        inpArg = inpArg + "CCNum=" + intitialData.billingAccount.paymentMethod.CCToken + "&";
                        inpArg = inpArg + "CCExprMonth=" + intitialData.billingAccount.paymentMethod.CCExprMonth + "&";
                        inpArg = inpArg + "CCExprYear=" + intitialData.billingAccount.paymentMethod.CCExprYear + "&";
                        inpArg = inpArg + "CCHolder=" + intitialData.billingAccount.paymentMethod.CCHolder + "&";
                        inpArg = inpArg + "CCType=" + intitialData.billingAccount.paymentMethod.CCType + "&";
                        inpArg = inpArg + "Billing Account Row Id=" + intitialData.billingAccount.id + "&";
                        inpArg = inpArg + "BA Action=" + BAAct + "&";
                        inpArg = inpArg + "Recurring Discounts=" + intitialData.featureConfig.recurringDiscounts + "&";
                        inpArg = inpArg + "Roaming Product=" + intitialData.featureConfig.roaming + "&";
                        inpArg = inpArg + "Add-Ons=" + addOns + "&";
                        inpArg = inpArg + "PlanId=" + intitialData.featureConfig.planId + "&";
                        inpArg = inpArg + "ProcessName=VHA TOT Order Line Item Flow Wrapper Workflow";
                        return {
                            "NextStep": true,
                            "asyncInp": inpArg,
                            "pdfInp": intitialData.featureConfig
                        };
                    }
                } else {
                    return {
                        "NextStep": false,
                        "asyncInp": "",
                        "pdfInp": ""
                    };
                }
            };
            VHAAccessoriesPR.initializeBillingAccount = function (BillingAccId, callservice, toDo) {
                var sAppList = SiebelApp.S_App.GetActiveView().GetAppletMap();
                sAppList["VHA Transfer Authorization Applet"].GetPModel().ExecuteMethod("InvokeMethod", "RefreshRecord", SiebelApp.S_App.NewPropertySet());
                var headerBC = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VHA TOT Generic BC");
                var sRowId = headerBC.GetFieldValue("Account Id");
                if (sRowId != "") {
                    resetBilingAccount();
                    if (callservice == "Y")
                        GetData(sRowId);
                    var sVHAInvoiceProfile = "";
                    var listOfassetHd = SiebelMessage.GetChild(0);
                    $(".existing-billing-account-rec").empty();
                    if (listOfassetHd.GetChildCount() > 0) {
                        var template_child = '<div class="VHAEABiling VHAPickRows">\
                            <div class="vha-tot-close"></div>\
                            <div class="vha-billing-header">\
                            <div class="VHAExistBillDivHeader">Mobile Number</div>\
                            <div class="VHAExistBillDivHeader">BAN</div>\
                            </div>';
                        for (var i = 0; i < listOfassetHd.GetChildCount(); i++) {
                            var sAssethd = listOfassetHd.GetChild(i);
                            template_child = template_child + '<div class="VHABAreclines"><div class="VHAExistBillDiv">' + sAssethd.GetProperty("Primary MSISDN") + '</div>\
                                <div class="VHAExistBillDiv vhabanum">' + sAssethd.GetProperty("Billing Account Number") + '</div>\
                                <div class="VHAPickDiv"><a href="#" class="VHABillPick VHABillPick' + i + '" id =' + sAssethd.GetProperty("Billing Account Id") + ' >Pick</a></div></div>';
                            var sListOfComInv = sAssethd.GetChild(0).GetChild(0);
                            if (sListOfComInv.GetProperty('Account Id') == BillingAccId) {
                                sVHAInvoiceProfile = sListOfComInv;
                            }
                        }
                        template_child = template_child + '</div>';
                        $(".existing-billing-account-rec").append(template_child);
                        var l = $(".VHAEABiling .VHABillPick").length;
                        for (var a = 0; a < l; a++) {
                            $($($(".VHABillPick"))[a]).off("click").on("click", function () {
                                VHAAccessoriesPR.initializeBillingAccount(this.id, "N", "Default");
                                VHAAccessoriesPR.initializeBundleSave();
                                $(".existing-billing-account-rec").addClass("VFDisplayNone");
                                updateBillingAccId(this.id);
                            });
                        }
                    } else
                        $(".existing-billing-account-rec").append('<div class="VHAEABiling VHAPickRows"><div class="vhaBAnorec">No record exists</div><div class="vha-tot-close"></div></div>');

                    $('.vha-tot-close').off("click").on("click", function () {
                        $(".existing-billing-account-rec").addClass("VFDisplayNone");
                    });
                    if (sVHAInvoiceProfile != "" && toDo == "Default") {
                        intitialData.billingAccount.id = sVHAInvoiceProfile.GetProperty("Account Id");
                        intitialData.billingAccount.notifyVia = sVHAInvoiceProfile.GetProperty("Notification Method");
                        intitialData.billingAccount.accountNumber = sVHAInvoiceProfile.GetProperty("Billing Account Number");
                        intitialData.billingAccount.deliveryEmail = sVHAInvoiceProfile.GetProperty("Email Bill To");
                        intitialData.billingAccount.deliveryMethod = sVHAInvoiceProfile.GetProperty("VHA Delivery Method Calc");
                        intitialData.billingAccount.notifyEmail = sVHAInvoiceProfile.GetProperty("Email"); ;
                        intitialData.billingAccount.notifyTxt = sVHAInvoiceProfile.GetProperty("MSISDN For TXT");
                        intitialData.billingAccount.paymentMethod.bsb = sVHAInvoiceProfile.GetProperty("Bank Branch");
                        intitialData.billingAccount.paymentMethod.bankDetails = sVHAInvoiceProfile.GetProperty("Bank Name");
                        intitialData.billingAccount.paymentMethod.accountNumber = sVHAInvoiceProfile.GetProperty("Bank Account Number");
                        intitialData.billingAccount.paymentMethod.accountName = sVHAInvoiceProfile.GetProperty("Bank Account Name");
                        intitialData.billingAccount.paymentMethod.type = sVHAInvoiceProfile.GetProperty("Payment Type");
                        intitialData.billingAccount.paymentMethod.CCToken = sVHAInvoiceProfile.GetProperty("Credit Card Number");
                        intitialData.billingAccount.paymentMethod.CCExprDate = sVHAInvoiceProfile.GetProperty("Credit Card Expiration Date");
                        intitialData.billingAccount.paymentMethod.CCExprMonth = sVHAInvoiceProfile.GetProperty("Expiration Month");
                        intitialData.billingAccount.paymentMethod.CCExprYear = sVHAInvoiceProfile.GetProperty("Expiration Year");
                        intitialData.billingAccount.paymentMethod.CCHolder = sVHAInvoiceProfile.GetProperty("Credit Card Name");
                        intitialData.billingAccount.paymentMethod.CCType = sVHAInvoiceProfile.GetProperty("Credit Card Type");
                        intitialData.billingAccount.paymentMethod.CCFirst6 = sVHAInvoiceProfile.GetProperty("Credit Card First 6"); //Balaji M - added for Miami 09/May/2022
                        intitialData.billingAccount.paymentMethod.CCLast4 = sVHAInvoiceProfile.GetProperty("Credit Card Last 4"); //Balaji M - added for Miami 09/May/2022
                        layoutType = "Existing BA";
                        //}

                        //debugger;
                        /*switch (layoutType) {
                        case "New Customer":
                        $(".existing-billing-account").addClass("VFDisplayNone");
                        break;
                        case "Existing CA":
                        break;
                        case "Existing BA":
                        break;
                        default:
                        }*/

                        if (intitialData.billingAccount.id == null) {
                            return;
                        }

                        var billingAccount = intitialData.billingAccount;

                        $(".billing-account-number").html(
                            "BAN - " + billingAccount.accountNumber);

                        if (billingAccount.deliveryMethod == "Email") {
                            $("#billing-delivery-email-id").removeClass("VFDisplayNone");
                            $(".delivery-method div[val='Email']")
                            .removeClass("applet-button-passive")
                            .addClass("applet-button-active");
                            $('#billing-delivery-email-id').val(billingAccount.deliveryEmail);
                        } else if (billingAccount.deliveryMethod == "MyVodafone") {
                            $(".delivery-method div[val='MyVodafone']")
                            .removeClass("applet-button-passive")
                            .addClass("applet-button-active");
                        } else if (billingAccount.deliveryMethod == "Paper") {
                            $(".delivery-method div[val='Paper']")
                            .removeClass("applet-button-passive")
                            .addClass("applet-button-active");
                        }

                        if (billingAccount.notifyVia == "Email") {
                            $(".notification-method div[val='Email']")
                            .removeClass("applet-button-passive")
                            .addClass("applet-button-active");
                            $("#billing-notify-email-id").removeClass("VFDisplayNone");
                            $("#billing-notify-email-id").val(billingAccount.notifyEmail);
                        } else if (billingAccount.notifyVia == "TXT") {
                            $(".notification-method div[val='TXT']")
                            .removeClass("applet-button-passive")
                            .addClass("applet-button-active");
                            $("#billing-notify-text").removeClass("VFDisplayNone");
                            $("#billing-notify-text").val(billingAccount.notifyTxt);
                        } else if (billingAccount.notifyVia == "Email and TXT") {
                            $(".notification-method div[val='Email and TXT']")
                            .removeClass("applet-button-passive")
                            .addClass("applet-button-active");
                            $("#billing-notify-text").removeClass("VFDisplayNone");
                            $("#billing-notify-email-id").removeClass("VFDisplayNone");
                            $("#billing-notify-email-id").val(billingAccount.notifyEmail);
                            $("#billing-notify-text").val(billingAccount.notifyTxt);
                        }

                        if (billingAccount.paymentMethod.type == "Direct Debit") {
                            $(".payment-method div[val='Direct Debit']")
                            .removeClass("applet-button-passive")
                            .addClass("applet-button-active");
                            $(".direct-debit").removeClass("VFDisplayNone");
                            $(".direct-debit .bsb").val(billingAccount.paymentMethod.bsb);
                            $(".direct-debit .bank-details").val(
                                billingAccount.paymentMethod.bankDetails);
                            $(".direct-debit .account-number").val(
                                billingAccount.paymentMethod.accountNumber);
                            $(".direct-debit .account-name").val(
                                billingAccount.paymentMethod.accountName);
                        } else if (billingAccount.paymentMethod.type == "Credit Card") {
                            $(".payment-method div[val='Credit Card']")
                            .removeClass("applet-button-passive")
                            .addClass("applet-button-active");
                            $(".credit-debit").removeClass("VFDisplayNone");
                            //Balaji M - added for mimai - 09/May/2022
							var sLst4 = billingAccount.paymentMethod.CCLast4;
							var sTkn = billingAccount.paymentMethod.CCToken;
							if (sLst4 != "") {
								$(".credit-debit .card-token-number").val("**** **** **** " + sLst4); // Balaji M added for Miami 09/May/2022
							} else {
								$(".credit-debit .card-token-number").val("**** **** **** " + sTkn.substring(sTkn.length - 4, sTkn.length));
							}
							//$(".credit-debit .card-token-number").val(
                              //  billingAccount.paymentMethod.CCToken);
                            var sCCExpYrLen = billingAccount.paymentMethod.CCExprYear.length;
                            $(".credit-debit .expiry-date").val(
                                billingAccount.paymentMethod.CCExprMonth + "/" + billingAccount.paymentMethod.CCExprYear.substring(sCCExpYrLen - 2, sCCExpYrLen));
                        } else if (billingAccount.paymentMethod.type == "Other") {
                            $(".payment-method div[val='Other']")
                            .removeClass("applet-button-passive")
                            .addClass("applet-button-active");
                        }
                        accountNumberMask();
                        //initializeBundleSave();
                    }
                }
            };

            VHAAccessoriesPR.initializeBundleSave = function () {
                //debugger;
                var Inps = SiebelApp.S_App.NewPropertySet();
                var Outs = SiebelApp.S_App.NewPropertySet();
                Inps.SetProperty("Object Id", intitialData.insBC.id);
                Inps.SetProperty("BillingAccountId", intitialData.billingAccount.id);
                Outs = VHAAppUtilities.CallWorkflow(
                        "VHA TOT Bundle Save Offers Workflow",
                        Inps, {});
                var selectionObj = {
                    "type": "cart-discount-bundle",
                    "subType": "cart-discount-bundle",
                    "dollar": Outs.propArray.PDDiscIncGST,
                    "value": Outs.propArray.PDDiscIncGST
                };
                SiebelAppFacade.VHAToTCommonViewPR.addCartItems(selectionObj);
            };

            VHAAccessoriesPR.setCCParameters = function (ResultSet) {
                var sLen = ResultSet.GetProperty("CCExpYr").length;
                $('.expiry-date').val(ResultSet.GetProperty("CCExpMon") + "/" + ResultSet.GetProperty("CCExpYr").substring(sLen - 2, sLen));
                var sTkn = ResultSet.GetProperty("CCToken");
                var sLst4 = ResultSet.GetProperty("CCLast4Digits");
                if (sLst4 != "") {
                    $('.card-token-number').val("**** **** **** " + sLst4); // Balaji M added for Miami 09/May/2022
                } else {
                    $('.card-token-number').val("**** **** **** " + sTkn.substring(sTkn.length - 4, sTkn.length));
                }

                intitialData.billingAccount.paymentMethod.CCToken = ResultSet.GetProperty("CCToken");
                intitialData.billingAccount.paymentMethod.CCExprDate = ResultSet.GetProperty("CCExpMon") + "/" + ResultSet.GetProperty("CCExpYr").substring(sLen - 2, sLen);
                intitialData.billingAccount.paymentMethod.CCExprMonth = ResultSet.GetProperty("CCExpMon");
                intitialData.billingAccount.paymentMethod.CCExprYear = ResultSet.GetProperty("CCExpYr");
                intitialData.billingAccount.paymentMethod.CCHolder = ResultSet.GetProperty("CCHolder");
                intitialData.billingAccount.paymentMethod.CCType = ResultSet.GetProperty("CCType");
                intitialData.billingAccount.paymentMethod.CCFirst6 = ResultSet.GetProperty("CCFirst6Digits"); // Balaji M added for Miami 09/May/2022
                intitialData.billingAccount.paymentMethod.CCLast4 = ResultSet.GetProperty("CCLast4Digits"); // Balaji M added for Miami 09/May/2022
            }

            VHAAccessoriesPR.getAddonsList = function (setRoaming) {
                intitialData.featureConfig.planId = $("#planIdInCart").text();
                var Inps = SiebelApp.S_App.NewPropertySet();
                var Outs = SiebelApp.S_App.NewPropertySet();
                Inps.SetProperty("Object Id", intitialData.insBC.id);
                //SiebelApp.S_App.uiStatus.Busy(uibusy);
                Outs = VHAAppUtilities.CallWorkflow(
                        "VHA Get Proposition Product Details Workflow",
                        Inps, {});
                //SiebelApp.S_App.uiStatus.Free();
                var roamList = Outs.GetChild(0)
                    .GetChild(0)
                    .GetChild(0)
                    .GetChildByType("ListOfRoaming");
                var addOnList = Outs.GetChild(0)
                    .GetChild(0)
                    .GetChild(0)
                    .GetChildByType("ListOfAddons");
                var length = addOnList.GetChildCount();
                var idd = new Array();
                var data = new Array();
                for (var i = 0; i < length; i++) {
                    var currProp = addOnList.GetChild(i);
                    var Object = {
                        chargeType: currProp.GetProperty("Charge Type"),
                        name: currProp.GetProperty("Name"),
                        dollar: currProp.GetProperty("Dollar"),
                        GbProdId: currProp.GetProperty("Global Prod Id"),
                        ProdId: currProp.GetProperty("Prod Id"),
                        SamId: currProp.GetProperty("SAM Id")
                    };
                    if (currProp.GetProperty("Addon Type") == "IDD") {
                        idd.push(Object);
                    } else if (currProp.GetProperty("Addon Type") == "Data") {
                        data.push(Object);
                    }
                }

                var dataRecurring = data.filter(function (temp) {
                    return temp.chargeType == "Recurring";
                });
                var dataOneOff = data.filter(function (temp) {
                    return temp.chargeType == "One-off Charge";
                });
                var iddRecurring = idd.filter(function (temp) {
                    return temp.chargeType == "Recurring";
                });
                var iddOneOff = idd.filter(function (temp) {
                    return temp.chargeType == "One-off Charge";
                });

                addOnData = {
                    dataRecurring,
                    dataOneOff,
                    iddOneOff,
                    iddRecurring
                };
                addOnLoaded = true;
                if (setRoaming == "Y") {
                    var rlen = roamList.GetChildCount();
                    if (rlen > 0) {
                        var currProp = roamList.GetChild(0);
                        $(".roaming-method>div").each(function (index, item) {
                            if ($(item).attr('val') == "5Roaming") {
                                $(item).removeClass('applet-button-passive').removeClass('applet-button-readonly').addClass('applet-button-active');
                                intitialData.featureConfig.roaming = $(item).text();
                            } else
                                $(item).removeClass('applet-button-active').removeClass('applet-button-readonly').addClass('applet-button-passive');
                        });
                    } else {
                        $(".roaming-method>div").each(function (index, item) {
                            if ($(item).attr('val') == "Off")
                                $(item).removeClass('applet-button-passive').removeClass('applet-button-readonly').addClass('applet-button-active');
                            else
                                $(item).removeClass('applet-button-active').removeClass('applet-button-passive').addClass('applet-button-readonly');
                        });
                        intitialData.featureConfig.roaming = "";
                    }
                }
            };

            var getHtmlTemplate = function (data) {
                return '<div class="applet-from billing-account">\
                <div>\
                <span class="VHAFormTitle">Billing Details</span>\
                <div class="applet-link existing-billing-account"><span id="VHAExistingBill">Existing Billing Account</span>\
                <div class="existing-billing-account-rec VFDisplayNone"></div>\
                </div>\
                </div>\
                <div class="applet-title-data">\
                <span class="applet-title-data-label billing-account-number"></span>\
                <span class="applet-link new-billing-account">New Billing Account</span>\
                </div>\
                <div>\
                <div class="parent-controls-container delivery-method">\
                <span class="field-label field-label-override">Notify Bill Via</span><!--Delivery Method-->\
                <div class="applet-button applet-button-passive" val="Email">Email</div>\
                <div class="applet-button applet-button-passive" val="MyVodafone">My Vodafone</div>\
                <div class="applet-button applet-button-passive" val="Paper">Paper</div>\
                <input class="input-field input-margin-left VFDisplayNone" type="email" id="billing-delivery-email-id" placeholder="delivery email"/>\
                </div>\
                <div class="parent-controls-container notification-method">\
                <span class="field-label field-label-override">Notify Alerts Via</span>\
                <div class="applet-button applet-button-passive" val="Email">Email</div>\
                <div class="applet-button applet-button-passive" val="TXT">TXT</div>\
                <div class="applet-button applet-button-passive" val="Email and TXT">Both</div>\
                <input class="input-field input-margin-left VFDisplayNone" type="email" id="billing-notify-email-id" placeholder="notification email"/>\
                <input class="input-field input-margin-left VFDisplayNone" type="number" id="billing-notify-text" placeholder="notification TXT"/>\
                </div>\
                <div class="parent-controls-container payment-method">\
                <span class="field-label field-label-override">Payment Method</span>\
                <div class="applet-button applet-button-passive" val="Direct Debit">Direct Debit</div>\
                <div class="applet-button applet-button-passive" val = "Credit Card">Credit Card</div>\
                <div class="applet-button applet-button-passive" val="Other">Other</div>\
                </div>\
                <div class="credit-debit">\
                <button class="vha-custom-button vhasecondarybtn input-margin-left" id="ToTCaptureCC">Capture Credit Card Details</button>\
                <div class="parent-controls-container"><div class="applet-label-input-control input-margin-left">\
                <span class="input-field-label">Card Token Number</span>\
                <input class="input-field card-token-number" readonly/>\
                </div>\
                <div class="applet-label-input-control input-margin-left">\
                <span class="input-field-label">Expiry Date</span>\
                <input class="input-field expiry-date" readonly/>\
                </div>\
                </div>\
                </div>\
                <div class="parent-controls-container direct-debit">\
                <div class="applet-label-input-control input-margin-left">\
                <span class="input-field-label">BSB</span>\
                <div class="flex_row_container VHAJustContentStart VHAParentRelative">\
                <input class="input-field bsb"/>\
                </div>\
                </div>\
                <div class="applet-label-input-control input-margin-left">\
                <span class="input-field-label">Bank Details</span>\
                <input class="input-field bank-details" readonly/>\
                </div>\
                <div class="applet-label-input-control input-margin-left">\
                <span class="input-field-label">Account Number</span>\
                <input class="input-field account-number"/>\
                </div>\
                <div class="applet-label-input-control input-margin-left">\
                <span class="input-field-label">Account Name</span>\
                <input class="input-field account-name"/>\
                </div>\
                </div>\
                </div>\
                </div>\
                <div class="applet-from feature-config">\
                <div>\
                <span class="VHAFormTitle">Configure Additional Features</span>\
                </div>\
                <div>\
                <div class="parent-controls-container roaming-method">\
                <span class="field-label field-label-override">Internation Roaming Plan to be Active on</span>\
                <div class="applet-button applet-button-passive" val="5Roaming">$5 Roaming</div>\
                <div class="applet-button applet-button-passive" val="PAYG">PAYG</div>\
                <div class="applet-button applet-button-passive" val="Off">Off</div>\
                </div>\
                <div class="parent-controls-container data-addon-method">\
                <span class="field-label field-label-override">Add Data Add-ons</span>\
                <div class="applet-button applet-button-active" val="NotInterested">Not Interested</div>\
                <div class="applet-button applet-button-passive" val="OneOff">One-Off</div>\
                <div class="applet-button applet-button-passive" val="Recurring">Recurring</div>\
                <div class="VFDisplayNone parent-controls-container data-addon-container">\
                <input class="input-field input-margin-left" id="feature-config-addon" placeholder="select"/>\
                <span class="siebui-icon-dropdown applet-form-combo applet-list-combo addon-drop-down" parId="#feature-config-addon" data-allowdblclick="true"></span>\
                </div>\
                </div>\
                <div class="parent-controls-container international-call-method">\
                <span class="field-label field-label-override">Add International Calls Add-ons</span>\
                <div class="applet-button applet-button-active" val="NotInterested">Not Interested</div>\
                <div class="applet-button applet-button-passive" val="OneOff">One-Off</div>\
                <div class="applet-button applet-button-passive" val="Recurring">Recurring</div>\
                <div class="VFDisplayNone parent-controls-container idd-addon-container">\
                <input class="input-field input-margin-left" id="feature-config-idd" placeholder="select"/>\
                <span class="siebui-icon-dropdown applet-form-combo applet-list-combo idd-drop-down" parId="#feature-config-idd" data-allowdblclick="true"></span>\
                </div>\
                </div>\
                <div class="parent-controls-container discounts-method">\
                <span class="field-label field-label-override">Add Restricted Discounts</span>\
                <div class="applet-button applet-button-active" val="NotInterested">Not Interested</div>\
                <div class="applet-button applet-button-passive" val="Recurring">Recurring</div>\
                </div>\
                <div class="parent-controls-container">\
                <div class="applet-subsection product-selection VFDisplayNone">\
                <div class="parent-controls-container">\
                <span class="item-label-title vcol-1">Products</span>\
                <span class="item-label-title vcol-2">Amount</span>\
                <span class="item-label-title vcol-3">Period</span>\
                <span class="item-label-title vcol-4">Reason Code</span>\
                </div>\
                </div>\
                </div>\
                </div>\
                <div class="applet-button applet-button-active submit-data VFDisplayNone">Submit Order</div>\
                </div>\
                <div id = "openModal" width = "100px" height = "100px" class = "modalDialog VHADisplayNone">\
                <div>\
                <div id = "VHAPrimaryIDTypesIDDetails">\
                <span class="VHAPopupCloseCircle">X</span>\
                <div class="VHADialogSectionHeader flex_row_container">\
                <div class="VHAExistBillDivHeader">Mobile Number</div>\
                <div class="VHAExistBillDivHeader">BAN</div>\
                </div>\
                <div class="VHADialogSection"></div>\
                </div>\
                </div>\
                </div>\
                </div>';
            };
            //<span class="siebui-icon-dropdown applet-form-combo applet-list-combo" id="BSB_drop_down" data-allowdblclick="true"></span>

            var setupRestrictedDiscount = function () {
                var productList = new Array();
                $.ajax({
                    dataType: "json",
                    url: "scripts/siebel/custom/restricted-discounts.json",
                    data: "",
                    async: false,
                    success: function (data) {
                        restrictedDiscount = data;
                    }
                });
                productList = restrictedDiscount.productList;
                $(".restricted-discount-line").remove();
                for (a = 0; a < productList.length; a++) {
                    $(".applet-subsection.product-selection").append(
                        getrestirctedDiscount(productList[a]));
                }
                $(".reason-code").autocomplete({
                    source: restrictedDiscount.reasonCode.map(function (a) {
                        return {
                            label: a,
                            value: a
                        };
                    }),
                    minLength: 0,
                    select: selectAutoCompleteVal,
                    change: restrictedDiscountCartUpt
                });
                $(".reason-code-drop-down").click(dropDownTrigger);
                var period = new Array();
                for (var i = 2; i <= 36; i++) {
                    period.push(i);
                }
                $(".period").autocomplete({
                    source: period.map(function (a) {
                        return {
                            label: a,
                            value: a
                        };
                    }),
                    minLength: 0,
                    select: selectAutoCompleteVal,
                    change: restrictedDiscountCartUpt
                });
                $(".period-drop-down").click(dropDownTrigger);
                $('.product-selection .input-field').prop('readonly', true);
                $('.product-selection .input-checkbox').change(function () {
                    if ($(this).prop('checked') == true) {
                        $(this).parent().parent().find('.input-field').not('#amount-1-4LV7C3N').prop('readonly', false);
                    } else {
                        $(this).parent().parent().find('.input-field').val('');
                        $(this).parent().parent().find('.input-field').prop('readonly', true);
                        restrictedDiscountCartUpt();
                    }
                });
                $('.product-selection .reason-code,.product-selection .amount,.product-selection .period').change(function () {
                    restrictedDiscountCartUpt();
                });
            };

            var selectAutoCompleteVal = function (e, u) {
                e.preventDefault();
                $(this).val(u.item.value);
                switch (u.item.type) {
                case "data":
                    if (u.item.dollar == undefined)
                        u.item.dollar = 0;
                    intitialData.featureConfig.dataAddOn = u.item.value;
                    intitialData.featureConfig.dataAddOnGlobalId = u.item.GbProdId;
                    intitialData.featureConfig.dataAddOnProdId = u.item.ProdId;
                    intitialData.featureConfig.dataAddOndollar = u.item.dollar;
                    intitialData.featureConfig.dataAddOnsamid = u.item.SamId;
                    var selectionObj = {
                        "type": "vha-tot-addons",
                        "subType": "cart-data-addons",
                        "dollar": "$ " + Number(u.item.dollar).toFixed(2),
                        "value": u.item.chargeType
                    };
                    SiebelAppFacade.VHAToTCommonViewPR.addCartItems(selectionObj);
                    break;
                case "idd":
                    if (u.item.dollar == undefined)
                        u.item.dollar = 0;
                    intitialData.featureConfig.iddAddOn = u.item.value;
                    intitialData.featureConfig.iddAddOnGlobalId = u.item.GbProdId;
                    intitialData.featureConfig.iddAddOnProdId = u.item.ProdId;
                    intitialData.featureConfig.iddAddOndollar = u.item.dollar;
                    intitialData.featureConfig.iddAddOnsamid = u.item.SamId;
                    var selectionObj = {
                        "type": "vha-tot-addons",
                        "subType": "cart-idd-addons",
                        "dollar": "$ " + Number(u.item.dollar).toFixed(2),
                        "value": u.item.chargeType
                    };
                    SiebelAppFacade.VHAToTCommonViewPR.addCartItems(selectionObj);
                    break;
                case "BSB":
                    $('.bank-details').val(u.item.BankDetails);
                    break;
                }
            };

            var restrictedDiscountCartUpt = function () {
                var rdamt = 0;
                $('.product-selection .restricted-discount-line').each(function () {
                    if ($(this).find('.input-checkbox').prop('checked') == true) {
                        if ($(this).find('.amount').val() != "") {
                            var amt = Number($(this).find('.amount').val());
                            rdamt = rdamt + (amt + (amt * 0.1));
                        } else {
                            if ($(this).find('.input-checkbox').attr('id') == "1-4LV7C3N") {
                                var hdplan = Number($('.vha-tot-setupsecl .vha-tot-headerplan .vha-tot-cartval').text().replace("$", ""));
                                rdamt = rdamt + (hdplan * 0.1);
                            }
                        }
                    }
                });
                var selectionObj = {
                    "type": "cart-discount-restrict",
                    "subType": "cart-discount-restrict",
                    "dollar": rdamt,
                    "value": rdamt
                };
                SiebelAppFacade.VHAToTCommonViewPR.addCartItems(selectionObj);
                console.log(rdamt);
            }

            var dropDownTrigger = function (e) {
                $($(this).attr("parId")).autocomplete("search", "");
            };

            var getrestirctedDiscount = function (data) {
                var x =
                    '<div class="parent-controls-container restricted-discount-line">' +
                    '<div class="vcol-1">' +
                    '<input type="checkbox" id="' +
                    data.id +
                    '" name="' +
                    data.name +
                    '" samid="' +
                    data.samid +
                    '" class="input-checkbox">' +
                    '<label for="' +
                    data.id +
                    '" class="item-checkbox-label">' +
                    data.name +
                    "</label>" +
                    "</div>" +
                    '<div class="vcol-2">' +
                    '<input class="input-field input-override amount" id="amount-' +
                    data.id +
                    '" type="number"/> ' +
                    "</div>" +
                    '<div class="vcol-3">' +
                    '<input class="input-field input-override period" id="period-' +
                    data.id +
                    '"/> ' +
                    '<span class="siebui-icon-dropdown applet-form-combo applet-list-combo period-drop-down" parId="#period-' +
                    data.id +
                    '" data-allowdblclick="true"></span>' +
                    "</div>" +
                    '<div class="vcol-4">' +
                    '<input class="input-field input-override reason-code" id="reason-code-' +
                    data.id +
                    '"/> ' +
                    '<span class="siebui-icon-dropdown applet-form-combo applet-list-combo reason-code-drop-down" parId="#reason-code-' +
                    data.id +
                    '" data-allowdblclick="true"></span>' +
                    "</div>" +
                    "</div>";

                return x;
            };

            function GetData(AccRowId) {
                $('.VHAEABiling').remove();
                var ser = SiebelApp.S_App.GetService("Workflow Process Manager");
                var Inputs = SiebelApp.S_App.NewPropertySet();
                //var sRowId= "2-CIMYL4M";
                Inputs.SetProperty("ProcessName", "VHA Get Account Details Process Workflow");
                Inputs.SetProperty("RowId", AccRowId);
                out = ser.InvokeMethod("RunProcess", Inputs);
                resultset = out.GetChildByType("ResultSet");
                SiebelMessage = resultset.GetChildByType("SiebelMessage");
            }
            function sBindEnts(pm) {
                $('#ToTCaptureCC').off("click").on("click", function () {
                    if ($("#VFPPOUIPayCorpIFrame").length) {
                        alert("There is a Pay Corp form open");
                        return
                    }
                    var ser = SiebelApp.S_App.GetService("Workflow Process Manager");
                    var Inputs = SiebelApp.S_App.NewPropertySet();
                    Inputs.SetProperty("ProcessName", "VF PCI INIT Workflow");
                    var BAN = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VHA TOT Generic BC").GetFieldValue("Id")
                        BAN = "BAN:" + BAN;
                    Inputs.SetProperty("CompName", "VFBillProfUpdate");
                    Inputs.SetProperty("ClientRef", BAN);
                    Inputs.SetProperty("Identifier", SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VHA TOT Generic BC").GetFieldValue("Id"));
                    try {
                        var out = ser.InvokeMethod("RunProcess", Inputs);
                        var ResultSet = out.GetChildByType("ResultSet");
                        var ActiveApplet = pm.Get("GetName");
                        var CreditCardApplet = SiebelApp.S_App.GetActiveView().GetApplet(ActiveApplet);
                        var PayCorpURL = ResultSet.GetProperty("Paycorp URL");
                        var ErrorMessage = ResultSet.GetProperty("Error Message");
                        if (ErrorMessage != "") {
                            alert("Integration error with external system EAI.Please Contact the System Administrator")
                        } else {
                            $('.credit-debit').addClass("VFDisplayNone");
                            $("#ToTCaptureCC").parent().after("<div class='VFPPOUIPayCorpIFramePar'><div id='VFPPOUIPayCorpIFrame' style='height:430px;'><iframe id='VFPPOUIPayCorpIFrameID' src='" + PayCorpURL + "' class='VFPayCorpiFrameheight'></iframe></div><div class='VFPPOUIPayCorpSubmit appletButton'>Submit</div><div class='VFPPOUIPayCorpCancle appletButton'>Cancel</div></div>")
                            $('.VFPPOUIPayCorpSubmit').on("click", function VFPPOUIPayCorpSubmit(e) {
                                var paymentFrame = document.getElementById("VFPPOUIPayCorpIFrameID").contentWindow;
                                paymentFrame.postMessage(JSON.stringify({
                                        type: "SUBMIT"
                                    }), "*")
                            });
                            $('.VFPPOUIPayCorpCancle').on("click", function VFPPOUIPayCorpCancle(e) {
                                $('.credit-debit').removeClass("VFDisplayNone");
                                $(".VFPPOUIPayCorpIFramePar").remove();

                            });
                        }
                    } catch (e) {
                        alert(e.message)
                    }
                    finally {}

                });

            }

            function BTRender(pm) {// Balaji M - added for Miami 09/May/2022
                $('#ToTCaptureCC').off("click").on("click", function () {
                    $("#maskoverlay").styleShow();
					if ($("#BrainTreeDiv").length) {
                        alert("There is a Paypal Braintree form open");
                        return
                    }
                    var main = function () {
                        //console.log("main function execution started");
                        var authTokenBT = "";
                        var ser = SiebelApp.S_App.GetService("Workflow Process Manager");
                        var Inputs = SiebelApp.S_App.NewPropertySet();
                        Inputs.SetProperty("ProcessName", "VF PP BT INIT Workflow");
                        var BAN = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VHA TOT Generic BC").GetFieldValue("Id")
                            BAN = "BAN:" + BAN;
                        Inputs.SetProperty("CompName", "VFBillProfUpdate");
                        Inputs.SetProperty("ClientRef", BAN);
                        Inputs.SetProperty("Identifier", SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VHA TOT Generic BC").GetFieldValue("Id"));
                        try {
                            var out = ser.InvokeMethod("RunProcess", Inputs);
                            var ResultSet = out.GetChildByType("ResultSet");
                            tokenBCId = ResultSet.GetProperty("tokenBCId");
                            authTokenBT = ResultSet.GetProperty("PaymentClientToken");
                            var ErrorMessage = ResultSet.GetProperty("Error Message");
                            if (ErrorMessage != "") {
                                authTokenBT = "";
                                ExitBTframe();
                                console.log(ErrorMessage);
								$("#maskoverlay").styleHide();
                                alert("Integration error with external system EAI.Please Contact the System Administrator");
                            }
                        } catch (e) {
							$("#maskoverlay").styleHide();
                            alert(e.message);
                        }
                        finally {}
                        if (authTokenBT != "") {
                            $('.credit-debit').addClass("VFDisplayNone");
                            $("#ToTCaptureCC").parent().after(VFBTFormConstruct());
                            hostFields(pm, authTokenBT, tokenBCId, SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VHA TOT Generic BC").GetFieldValue("Account Id"), "");
                            $("#BrainTreeDiv").show();														
                        }												
                    }					
					load_scripts(main);					
                });
            }

            function updateBillingAccId(bId) {
                var headerBC = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VHA TOT Generic BC");
                var Inputs = SiebelApp.S_App.NewPropertySet();
                var Outs = SiebelApp.S_App.NewPropertySet();
                Inputs.SetProperty("BusObj", "VHA TOT Generic BO");
                Inputs.SetProperty("BusComp", "VHA TOT Generic BC");
                Inputs.SetProperty("Id", headerBC.GetFieldValue("Id"));
                Inputs.SetProperty("Billing Account Id", bId);
                Outs = VHAAppUtilities.CallBS(
                        "VHA TOT Processing Service", "BCSetField",
                        Inputs, {});
                var sAppList = SiebelApp.S_App.GetActiveView().GetAppletMap();
                sAppList["VHA Transfer Authorization Applet"].GetPModel().ExecuteMethod("InvokeMethod", "RefreshRecord", SiebelApp.S_App.NewPropertySet());
            }
            function mValidateFrmtBS(sEml, sPhn, sPin) {
                var Inps = SiebelApp.S_App.NewPropertySet();
                Inps.SetProperty("EmailAddress", sEml);
                Inps.SetProperty("PhoneNumber", sPhn);
                Inps.SetProperty("PIN", sPin);
                var Outps = VHAAppUtilities.CallWorkflow("VHA TOT Customer Details Validation WF", Inps, {});
                return Outps;
            }
            function mValidate(billingAccount) {
                var sProceed = true;
                $('.VHAAccErr').remove();
                if (billingAccount.deliveryMethod == "") {
                    sProceed = false;
                    if ($('#ToTEmpdelmethod').length == 0)
                        $('.parent-controls-container.delivery-method').after("<div class='VHAAccErr ml-2' id='ToTEmpdelmethod' style='color:red;padding-left: 130px;'>Please select 'Notify Bill Via'</div>");
                } else {
                    if ($("#billing-delivery-email-id").val() == "" && billingAccount.deliveryMethod == "Email") {
                        if ($('#ToTEmpdelmail').length == 0)
                            $('.parent-controls-container.delivery-method').after("<div class='VHAAccErr ml-2' id='ToTEmpdelmail' style='color:red;padding-left: 130px;'>Please enter delivery email</div>");
                        sProceed = false;
                    }
                    if ($("#billing-delivery-email-id").val() != "" && billingAccount.deliveryMethod == "Email") {
                        var sOp = mValidateFrmtBS($("#billing-delivery-email-id").val(), "", "");
                        if (sOp.GetProperty("ErrorEmail") != "") {
                            if ($('#ToTInvdelmail').length == 0)
                                $('.parent-controls-container.delivery-method').after("<div class='VHAAccErr ml-2' id='ToTInvdelmail' style='color:red;padding-left: 130px;'>" + sOp.GetProperty("ErrorEmail") + "</div>");
                            sProceed = false;
                        }
                    }
                }
                if (billingAccount.notifyVia == "") {
                    if ($('#ToTEmpnotvia').length == 0)
                        $('.parent-controls-container.notification-method').after("<div class='VHAAccErr ml-2' id='ToTEmpnotvia' style='color:red;padding-left: 130px;'>Please select 'Notify Alerts Via'</div>");
                    sProceed = false;
                } else {
                    if (billingAccount.notifyVia == "Email and TXT") {
                        if ($("#billing-notify-email-id").val() == "" && ($("#billing-notify-text").val() == "")) {
                            if ($('#ToTEmpnotmailtxt').length == 0)
                                $('.parent-controls-container.notification-method').after("<div class='VHAAccErr ml-2' id='ToTEmpnotmailtxt' style='color:red;padding-left: 130px;'>Please enter notification text and notification email</div>");
                            sProceed = false;
                        } else {
                            if ($("#billing-notify-text").val() == "") {
                                if ($('#ToTEmpnottxt').length == 0)
                                    $('.parent-controls-container.notification-method').after("<div class='VHAAccErr ml-2' id='ToTEmpnottxt' style='color:red;padding-left: 130px;'>Please enter notification text</div>");
                                sProceed = false;
                            } else {
                                var sOp = mValidateFrmtBS("", $("#billing-notify-text").val(), "");
                                if (sOp.GetProperty("ErrorNumber") != "") {
                                    if ($('#ToTInvnottxt').length == 0)
                                        $('.parent-controls-container.notification-method').after("<div class='VHAAccErr ml-2' id='ToTInvnottxt' style='color:red;padding-left: 130px;'>" + sOp.GetProperty("ErrorNumber") + "</div>");
                                    sProceed = false;
                                }
                            }
                            if ($("#billing-notify-email-id").val() == "") {
                                if ($('#ToTEmpnotmail').length == 0)
                                    $('.parent-controls-container.notification-method').after("<div class='VHAAccErr ml-2' id='ToTEmpnotmail' style='color:red;padding-left: 130px;'>Please enter notification email</div>");
                                sProceed = false;
                            } else {
                                var sOp = mValidateFrmtBS($("#billing-notify-email-id").val(), "", "");
                                if (sOp.GetProperty("ErrorEmail") != "") {
                                    if ($('#ToTInvnotml').length == 0)
                                        $('.parent-controls-container.notification-method').after("<div class='VHAAccErr ml-2' id='ToTInvnotml' style='color:red;padding-left: 130px;'>" + sOp.GetProperty("ErrorEmail") + "</div>");
                                    sProceed = false;
                                }
                            }
                        }
                    } else {
                        if (billingAccount.notifyVia == "Email" && $("#billing-notify-email-id").val() == "") {
                            if ($('#ToTEmpnotmail').length == 0)
                                $('.parent-controls-container.notification-method').after("<div class='VHAAccErr ml-2' id='ToTEmpnotmail' style='color:red;padding-left: 130px;'>Please enter notification email</div>");
                            sProceed = false;
                        }
                        if (billingAccount.notifyVia == "Email" && $("#billing-notify-email-id").val() != "") {
                            var sOp = mValidateFrmtBS($("#billing-notify-email-id").val(), "", "");
                            if (sOp.GetProperty("ErrorEmail") != "") {
                                if ($('#ToTInvnottxt').length == 0)
                                    $('.parent-controls-container.notification-method').after("<div class='VHAAccErr ml-2' id='ToTInvnottxt' style='color:red;padding-left: 130px;'>" + sOp.GetProperty("ErrorEmail") + "</div>");
                                sProceed = false;
                            }
                        }
                        if (billingAccount.notifyVia == "TXT" && $("#billing-notify-text").val() == "") {
                            if ($('#ToTEmpnottxt').length == 0)
                                $('.parent-controls-container.notification-method').after("<div class='VHAAccErr ml-2' id='ToTEmpnottxt' style='color:red;padding-left: 130px;'>Please enter notification text</div>");
                            sProceed = false;
                        }
                        if (billingAccount.notifyVia == "TXT" && $("#billing-notify-text").val() != "") {
                            var sOp = mValidateFrmtBS("", $("#billing-notify-text").val(), "");
                            if (sOp.GetProperty("ErrorNumber") != "") {
                                if ($('#ToTInvnottxt').length == 0)
                                    $('.parent-controls-container.notification-method').after("<div class='VHAAccErr ml-2' id='ToTInvnottxt' style='color:red;padding-left: 130px;'>" + sOp.GetProperty("ErrorNumber") + "</div>");
                                sProceed = false;
                            }
                        }
                    }

                }
                if (billingAccount.paymentMethod.type == "") {
                    if ($('#ToTEmpPymt').length == 0)
                        $('.parent-controls-container.direct-debit').after("<div class='VHAAccErr ml-2' id='ToTEmpPymt' style='color:red;padding-left: 130px;'>Please select 'Payment method'</div>");
                    sProceed = false;
                } else if (billingAccount.paymentMethod.type == "Direct Debit") {
                    if ($(".direct-debit .bsb").val() == "") {
                        sProceed = false;
                        if ($('#ToTEmpbsb').length == 0)
                            $(".direct-debit .bsb").parent().parent().append("<div class='VHAAccErr ml-2 VHADDFldErr' id='ToTEmpbsb' style='color:red;'>Please enter BSB</div>");
                    }
                    if ($(".direct-debit .bank-details").val() == "") {
                        if ($('#ToTEmpbankdt').length == 0)
                            $(".direct-debit .bank-details").parent().append("<div class='VHAAccErr ml-2 VHADDFldErr' id='ToTEmpbankdt' style='color:red;'>Please enter bank details</div>");
                        sProceed = false;
                    }
                    if ($(".direct-debit .account-number").attr("entered") == "" || (!$(".direct-debit .account-number").attr("entered"))) {
                        if ($('#ToTEmpaccnum').length == 0)
                            $(".direct-debit .account-number").parent().append("<div class='VHAAccErr ml-2 VHADDFldErr' id='ToTEmpaccnum' style='color:red;'>Please enter account number</div>");
                        sProceed = false;
                    }
                    if (isNaN($(".direct-debit .account-number").attr("entered"))) //Guru : 15/09/2021 : Added for PKE000000086815 : DD files from BRM to PSM
                    {
                        $(".direct-debit .account-number").parent().append("<div class='VHAAccErr ml-2 VHADDFldErr' id='ToTEmpaccnum' style='color:red;'>Please enter valid account number</div>");
                        sProceed = false;
                    }
                    var bankPattern = /^((?!0+$)(?![1-9]{2}0+$)(?![1-9]0+$))\d{6,9}$/g; //02/JUNE/2023 AMEER BASHA Added Validation for PKE000000108978
                    if (!($(".direct-debit .account-number").attr("entered")).match(bankPattern))
					{
						$(".direct-debit .account-number").parent().append("<div class='VHAAccErr ml-2 VHADDFldErr' id='ToTEmpaccnum' style='color:red;'>Invalid bank account number</div>");
						sProceed = false;
					}//End. AMEER BASHA PKE000000108978
                    if ($(".direct-debit .account-name").val() == "") {
                        if ($('#ToTEmpaccname').length == 0)
                            $(".direct-debit .account-name").parent().append("<div class='VHAAccErr ml-2 VHADDFldErr' id='ToTEmpaccname' style='color:red;'>Please enter account name</div>");
                        sProceed = false;
                    }
                    if ($(".direct-debit .account-name").val() != "") //Guru : 15/09/2021 : Added for PKE000000086815 : DD files from BRM to PSM
                    {    /* Space Added in Account Name for PKE000000123692 Added for PKE : INDIVAR -10/03/2025 */
                        if (/[^a-z\s]/i.test($('.direct-debit .account-name').val())) {  
                            $(".direct-debit .account-name").parent().append("<div class='VHAAccErr ml-2 VHADDFldErr' id='ToTEmpaccname' style='color:red;'>Please enter valid account name</div>");
                            sProceed = false;
                        }
                    }
                } else if (billingAccount.paymentMethod.type == "Credit Card") {
                    if ($('.card-token-number').val() == "") {
                        if ($('#ToTEmpCCTkn').length == 0)
                            $('.card-token-number').parent().append("<div class='VHAAccErr ml-2 VHADDFldErr' id='ToTEmpCCTkn' style='color:red;'>Please enter Card token number</div>");
                        sProceed = false;
                    }
                    if ($('.expiry-date').val() == "") {
                        if ($('#ToTEmpCCExpDt').length == 0)
                            $('.expiry-date').parent().append("<div class='VHAAccErr ml-2 VHADDFldErr' id='ToTEmpCCExpDt' style='color:red;'>Please enter expiry date</div>");
                        sProceed = false;
                    }
                }
                return sProceed;
            }
            return VHAAccessoriesPR;
        })();
        return "SiebelAppFacade.VHAAccessoriesPR";
    });
}

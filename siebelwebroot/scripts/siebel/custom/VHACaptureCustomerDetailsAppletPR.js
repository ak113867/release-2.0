if (typeof(SiebelAppFacade.VHACaptureCustomerDetailsAppletPR) === "undefined") {

 SiebelJS.Namespace("SiebelAppFacade.VHACaptureCustomerDetailsAppletPR");
 define("siebel/custom/VHACaptureCustomerDetailsAppletPR", ["order!siebel/phyrenderer", "order!siebel/custom/VHAAppUtilities"],function () {
   SiebelAppFacade.VHACaptureCustomerDetailsAppletPR = (function () {
	 var siebConsts = SiebelJS.Dependency("SiebelApp.Constants");
    function VHACaptureCustomerDetailsAppletPR(pm) {
     SiebelAppFacade.VHACaptureCustomerDetailsAppletPR.superclass.constructor.apply(this, arguments);
	  this.GetPM().AttachPostProxyExecuteBinding("GetURL", VHACovergaeCheck, {
                    scope: this,
                    sequence: false
                });
    }

    SiebelJS.Extend(VHACaptureCustomerDetailsAppletPR, SiebelAppFacade.PhysicalRenderer);
		var MapShed = {
                Mobile: {
                    m5G: {
                        indoor: false,
                        outdoor: false
                    },
                    m5GSA: {
                        indoor: false,
                        outdoor: false
                    },
                    m5GNSA: {
                        indoor: false,
                        outdoor: false
                    },
                    m4G: {
                        indoor: false,
                        outdoor: false
                    },
                    m4GSA: {
                        indoor: false,
                        outdoor: false
                    },
                    m4GNSA: {
                        indoor: false,
                        outdoor: false
                    },
                    m3G: {
                        indoor: false,
                        outdoor: false
                    }
                },
                FWA: {
                    f4G: {
                        is4G: false
                    },
                    f5G: {
                        is5G: false
                    },
                    f5GSA: {
                        is5Gsa: false
                    },					
                    f5GNSA: {
                        is5Gnsa: false
                    }
                }
            };
			var authdetails;
			var stepAuthPbj={};
			var PhnVerifyFlag_step2;
			var EmailVerifyFlag_step2;
			var otpAutentication;
			var AuthmethodType;
			var OtpStep2;
            var verifiedStep2;
			var IdsightDetails;
    VHACaptureCustomerDetailsAppletPR.prototype.Init = function () {
     SiebelAppFacade.VHACaptureCustomerDetailsAppletPR.superclass.Init.apply(this, arguments);
	 
	 
                
                var this_t = this;
                this.GetPM().AddMethod("FieldChange", OnFieldChange, {
                    sequence: false,
                    scope: this
                });
                function OnFieldChange(control, value) {

                    $('[aria-label="Map URL Field"]').parent().hide();
                    //if (control.GetName() == "Map URL" || control.GetName() == "Map URL Field") {
                    //
                    // }
                    if (control.GetName() == "Address Status Display" || control.GetName() == "Address Status") {
                        $('[name=' + this.GetPM().Get("GetControls")["WSDL Address"].GetInputName() + ']').closest('tr').find('[aria-label="Address Status"]').parent().find('div').remove();
                        var sStatusClass = (value == "Valid") ? "Class_Active" : ((value == "Not Valid") ? "Class_Inactive" : "");
                        if (sStatusClass != "") {
                            $('[name=' + this.GetPM().Get("GetControls")["WSDL Address"].GetInputName() + ']').closest('tr').find('[aria-label="Address Status"]').addClass("VFDisplayNone").parent().append("<div><span class=' dot_" + sStatusClass + "'></span> <span  class=' AddressStatusStyle " + sStatusClass + "'>" + value + "</span></div>");
                        }
                    }
                    if (control.GetName() == "Shipment Address Status") {
                        $('[name=' + this.GetPM().Get("GetControls")["Shipment Address Status"].GetInputName() + ']').parent().find('div').remove();
                        //$('[aria-labelledby="Shipment_Address_Status_Label"]').parent().find('div').remove();
                        var sStatusClass = (value == "Valid") ? "Class_Active" : ((value == "Not Valid") ? "Class_Inactive" : "");
                        if (sStatusClass != "") {
                            //$('[aria-labelledby="Shipment_Address_Status_Label"]').addClass("VFDisplayNone").parent().append("<div><span class=' dot_" + sStatusClass + "'></span> <span  class=' AddressStatusStyle " + sStatusClass + "'>" + value + "</span></div>");
                            $('[name=' + this.GetPM().Get("GetControls")["Shipment Address Status"].GetInputName() + ']').addClass("VFDisplayNone").parent().append("<div><span class=' dot_" + sStatusClass + "'></span> <span  class=' AddressStatusStyle " + sStatusClass + "'>" + value + "</span></div>");
                        }
                    }
                    if (control.GetName() == "Status") {
                        //$('[aria-label="Coverage Check Status"]').parent().find('div').remove();
                        $('[name=' + this.GetPM().Get("GetControls")["Status"].GetInputName() + ']').parent().find('div').remove();
                        var sStatClass = (value == "Error") ? "Class_Inactive" : ((value == "Completed" || value == "Checked") ? "Class_Active" : ((value == "Submitted") ? "Submitted" : ""));
                        if (sStatClass != "") {
                            //$('[aria-label="Coverage Check Status"]').addClass("VFDisplayNone").parent().append("<div><span  class=' CoverageChckSts dot_" + sStatClass + "'></span> <span class=' AddressStatusStyle " + sStatClass + "'>" + value + "</span></div>");
                            $('[name=' + this.GetPM().Get("GetControls")["Status"].GetInputName() + ']').addClass("VFDisplayNone").parent().append("<div><span class=' dot_" + sStatClass + "'></span> <span  class=' AddressStatusStyle " + sStatClass + "'>" + value + "</span></div>");
                        }
                    }
					//vasavi added for RAF Project
                    if (control.GetName() == "RAF Status") {
                        $('[name=' + this.GetPM().Get("GetControls")["RAF Status"].GetInputName() + ']').parent().find('div').remove();
                        var sStatClass = (value == "Valid") ? "Class_Active" : ((value == "Invalid") ? "Class_Inactive" :  "");
                        if (sStatClass != "") {
                            $('[name=' + this.GetPM().Get("GetControls")["RAF Status"].GetInputName() + ']').addClass("VFDisplayNone").parent().append("<div><span class=' dot_" + sStatClass + "'></span> <span  class=' AddressStatusStyle " + sStatClass + "'>" + value + "</span></div>");
                        }
                    }
					if (control.GetName() == "VF Customer Type") {
						var controls = this.GetPM().Get("GetControls");
						var control = controls[ "VF Customer Type" ];
						var value = this.GetPM().ExecuteMethod( "GetFieldValue", control );
						var sId = this.GetPM().Get("GetId");
						if(value == "Sole Trader"){
								 $('[aria-label="Customer Type Form Applet:Validate RAF Code"]').parent().show();
								 $('[aria-label="Enter RAF Code"]').parent().show();
								 $('#VHA_RAF_Code_Label_'+sId+'').show();      
						}
						else{
								$( '[aria-label="Customer Type Form Applet:Validate RAF Code"]').parent().hide();
								$('[aria-label="Enter RAF Code"]').parent().hide();
								$('#VHA_RAF_Code_Label_'+sId+'').hide();
						}
					}// end code vasavi added for RAF Project
                }
                this.GetPM().AttachPMBinding("PostExecute", function (method_name, input_property_set, output_property_set) {
                    if (method_name == "PostChanges" && input_property_set.GetProperty("SWEPOC") == "Receive Unknown Flag") {
                        var AppletName = GetActiveCreditAppletName();
                        var ShipingApplet = SiebelApp.S_App.GetActiveView().GetApplet(AppletName);
                        if (VFTaskSessionVariable.GetValue(AppletName + "_ManualAddressChecked") == "Y" && ShipingApplet != "" && ShipingApplet != null && $("[name='" + ShipingApplet.GetControl("Pick Primary Address").GetInputName() + "']").val() == "Y") {
                            $("input[name='" + ShipingApplet.GetControl("Manual Address Entry").GetInputName() + "']").prop('checked', true);
                            $("input[name='" + ShipingApplet.GetControl("Manual Address Entry").GetInputName() + "']").trigger("click");
                        }
                    }
                });
	 
    }

    VHACaptureCustomerDetailsAppletPR.prototype.ShowUI = function () {
                SiebelAppFacade.VHACaptureCustomerDetailsAppletPR.superclass.ShowUI.call(this);
                var this_t = this;
                var controls = this.GetPM().Get("GetControls");
                var sAppltName = this.GetPM().Get("GetName");
                var sAppltId = "s_" + this.GetPM().Get("GetFullId") + "_div";
                VHAAppUtilities.ShowToolTip(sAppltName, sAppltId);
                var sView = SiebelApp.S_App.GetActiveView().GetName();
                var sAIN = this.GetPM().Get("GetId");
				if(SiebelApp.S_App.GetProfileAttr("VHANewOrg") == "Vodafone AU"){$("[id^='Title_Label'] > img").remove();} //Added for title transfer 
                //$('[name=' + this_t.GetPM().Get("GetControls")["Map URL Field"].GetInputName() + ']').parent().hide();
                //$("#Map_URL_Field_Label" + this.GetPM().Get("GetId")).hide();
                $("#Map_URL_Field_Label" + this.GetPM().Get("GetId")).parent().hide();
                //$('[aria-labelledby*="Map URL"]').not('[aria-labelledby=' + $('[name=' + this_t.GetPM().Get("GetControls")["Map URL"].GetInputName() + ']').attr('aria-labelledby') + '], [aria-labelledby="WSDL_Shipment_Address_Label"]').closest('td').parent().css("display", "none");
                //$('[aria-labelledby*="WSDL_"]').not('[aria-labelledby=' + $('[name=' + this_t.GetPM().Get("GetControls")["WSDL Address"].GetInputName() + ']').attr('aria-labelledby') + '], [aria-labelledby="WSDL_Shipment_Address_Label"]').closest('td').parent().css("display", "none");
                //$('[aria-labelledby*="WSDL_"]').not('[aria-labelledby=' + $("WSDL_Address_Label" + this.GetPM().Get("GetId")).attr('aria-labelledby') + '], [aria-labelledby="WSDL_Shipment_Address_Label"]').closest('td').parent().css("display", "none");
                //$('[aria-labelledby*="WSDL_"]').not('[aria-labelledby="WSDL_Address_Label_' + this.GetPM().Get("GetId")], [aria-labelledby="WSDL_Shipment_Address_Label_" + this.GetPM().Get("GetId")]').closest('td').parent().css("display", "none");
                $('[aria-labelledby*="WSDL_"]').not('[aria-labelledby="WSDL_Address_Label_' + sAIN + '"], [aria-labelledby="WSDL_Shipment_Address_Label_' + sAIN + '"]').closest('td').parent().css("display", "none");

                var sFlowName = $('.siebui-applet-taskui-h').html().slice(0, ($('.siebui-applet-taskui-h').html().indexOf('<span class="siebui-taskui-title">')));
                this.GetPM().AttachPMBinding("FieldChange", this.SetControlValue, {
                    scope: this
                });
                setTimeout(function () {
                    if (sAppltName == "VF Out of Stock Summary Form Applet - TBUI" || sAppltName == "VF Out of Stock Summary Form Applet - Upgrade TBUI" || sAppltName == "VHA Out of Stock Summary Form Applet - TBUI HI" || sAppltName == "VHA SIM Ordering TBUI Applet")
                        //$('[aria-labelledby="Manual_Address_Ident_Label"]').parent().hide();
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Address Ident"].GetInputName() + ']').parent().hide();
                    if (sAppltName == "VHA Capture Customer Details Toggle Form Applet Person TBUI") {
                        $('[name=' + this_t.GetPM().Get("GetControls")["WSDL Address"].GetInputName() + ']').closest('tr').find('[aria-labelledby=' + $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').attr('aria-labelledby') + ']').parent().append('<div class="ChevronActive VHAShipmentChevron" id="ShipCollapse_up"></div>');
                        $('[name=' + this_t.GetPM().Get("GetControls")["Map URL Field"].GetInputName() + ']').parent().hide();
                    }
                    if (sAppltName == "VHA Capture Customer Manual Address Details Person TBUI Shipment" || sAppltName == "VHA Capture Customer Details Toggle Form Applet Corporate Manual TBUI Ship" || sAppltName == "VHA Capture Customer Details Toggle Form Applet Corporate Manual TBUI" || sAppltName == "VHA Capture Customer Manual Address Details Person TBUI")
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').parent().append('<div class="ChevronActive VHAShipmentChevron" id="ShipCollapse_up"></div>');
                    if (sAppltName == "VHA Capture Customer Details Toggle Form Applet Corporate Manual TBUI S Man" || sAppltName == "VHA Capture Customer Manual Address Details Person TBUI Shipment Manual") {
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').parent().append('<div class="ChevronActive VHAShipmentChevron" id="manShipCollapse_up"></div>');
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').parent().append('<div class="ChevronActive VHAShipmentChevron" id="ShipmanCollapse_up"></div>');
                    }
                    if (sAppltName == "VHA Capture Customer Details Toggle Form Applet Person TBUI") {
                        //$('[aria-labelledby*="WSDL_"]').not('[aria-labelledby=' + $('[name=' + this_t.GetPM().Get("GetControls")["WSDL Address"].GetInputName() + ']').attr('aria-labelledby') + '], [aria-labelledby="WSDL_Shipment_Address_Label"]').closest('td').parent().css("display", "none");
                        var str1 = this_t.GetPM().Get("GetControls")["WSDL Address"] === undefined ? "" : $('[name=' + this_t.GetPM().Get("GetControls")["WSDL Address"].GetInputName() + ']').attr('aria-labelledby');
                        var str2 = this_t.GetPM().Get("GetControls")["WSDL Shipment Address"] === undefined ? "" : $('[name=' + this_t.GetPM().Get("GetControls")["WSDL Shipment Address"].GetInputName() + ']').attr('aria-labelledby');
                        var strF
                        if (str1 != "") {
                            strF = '[aria-labelledby=' + str1 + ']';
                        }
                        if (str2 != "") {
                            if (strF != "") {
                                strF = strF + ', [aria-labelledby=' + str2 + ']';
                            } else {
                                strF = '[aria-labelledby=' + str2 + ']';
                            }
                        }
                        console.log(strF);
                        $('[aria-labelledby*="WSDL_"]').not(strF).closest('td').parent().css("display", "none");
                        $('[name=' + this_t.GetPM().Get("GetControls")["WSDL Address"].GetInputName() + ']').parent().find(".siebui-icon-pick").remove();
                    }

                    $('[name=' + this_t.GetPM().Get("GetControls")["WSDL Address"].GetInputName() + ']').parent().find(".siebui-icon-pick").remove();

                    $.each(this_t.GetPM().Get("GetControls"), function (controlName, controlObj) {
                        switch (controlName) {
                        case "WSDL Shipment Address":
                            $('[name=' + controlObj.GetInputName() + ']').parent().find(".siebui-icon-pick").remove();
                            var ShipAddressStatus = $('[name=' + controlObj.GetInputName() + ']').closest('tr').find('[aria-labelledby=' + $('[name=' + this_t.GetPM().Get("GetControls")["Shipment Address Status"].GetInputName() + ']').attr('aria-labelledby') + ']').val();
                            var shipStatusClass = (ShipAddressStatus == "Valid") ? "Class_Active" : ((ShipAddressStatus == "Not Valid") ? "Class_Inactive" : "");
                            if (shipStatusClass != "") {
                                $('[name=' + controlObj.GetInputName() + ']').closest('tr').find('[aria-labelledby=' + $('[name=' + this_t.GetPM().Get("GetControls")["Shipment Address Status"].GetInputName() + ']').attr('aria-labelledby') + ']').addClass("VFDisplayNone").parent().append("<div><span class=' dot_" + shipStatusClass + "'></span> <span class=' AddressStatusStyle " + shipStatusClass + "'>" + ShipAddressStatus + "</span></div>");
                            }
                            break;
                        case "Address":
                            $('[name=' + controlObj.GetInputName() + ']').parent().find(".siebui-icon-pick").remove();
                            break;
                        case "Cal Full Address":
                            $('[name=' + controlObj.GetInputName() + ']').parent().parent().parent().hide();
                            break;
                        case "Address Selected":
                            $('[name=' + controlObj.GetInputName() + ']').css("width", "240px");
                            break;
                        case "WSDL Address":
                            $('[name=' + controlObj.GetInputName() + ']').closest('tr').find('[aria-label="Address Status"]').addClass("VFDisplayNone");
                            var SAddressStatus = $('[name=' + controlObj.GetInputName() + ']').closest('tr').find('[aria-label="Address Status"]').val();
                            var sStatusClass = (SAddressStatus == "Valid") ? "Class_Active" : ((SAddressStatus == "Not Valid") ? "Class_Inactive" : "");
                            if (sStatusClass != "") {
                                $('[name=' + controlObj.GetInputName() + ']').closest('tr').find('[aria-label="Address Status"]').addClass("VFDisplayNone").parent().append("<div><span class=' dot_" + sStatusClass + "'></span> <span class=' AddressStatusStyle " + sStatusClass + "'>" + SAddressStatus + "</span></div>");
                            }
                            break;
                        }
                        //console.log(controlName, controlObj.GetName());
                    });

                    //$('[aria-labelledby="WSDL_Shipment_Address_Label"]').parent().find(".siebui-icon-pick").remove();
                    //$('[aria-labelledby="Address_Label"]').parent().find(".siebui-icon-pick").remove();
                    //$('[aria-labelledby="Cal_Full_Address_Label"]').parent().parent().parent().hide();
                    //$('[aria-labelledby="Address_Selected_Label"]').css("width", "240px");
                    //$('[name=' + this_t.GetPM().Get("GetControls")["WSDL Address"].GetInputName() + ']').closest('tr').find('[aria-label="Address Status"]').addClass("VFDisplayNone");

                    $('[aria-label="Coverage Check Status"]').addClass("VFDisplayNone");
					$('[aria-label="RAF Status"]').addClass("VFDisplayNone");//vasavi added for RAF code

                    if (sAppltName == "VHA Capture Customer Details Toggle Form Applet Person TBUI Shipment" || sAppltName == "VHA Capture Customer Manual Address Details Person TBUI Shipment" || sAppltName == "VHA Capture Customer Details Toggle Form Applet Corporate Manual TBUI Ship" || sAppltName == "VHA Capture Customer Details Toggle Form Applet Corporate TBUI Shipment") {
                        $('[name=' + this_t.GetPM().Get("GetControls")["Shipment Address Status"].GetInputName() + ']').addClass("VFDisplayNone");
                        //$('[aria-labelledby="Shipment_Address_Status_Label"]').addClass("VFDisplayNone");
                    }
                    if ("" + sView == "VF Capture Customer Details – Postpay TBUI" || "" + sView == "VF Capture Exst Customer Details Postpay TBUI" || "" + sView == "VF Capture Customer Details Postpay UNISIM TBUI" || "" + sView == "VHA PosttoPre Capture Customer Details View") {
                        VHACovergaeCheck("",this_t);
                        var sCoverageCheckStatus = $('[aria-label="Coverage Check Status"]').val();
                        var sStatClass = (sCoverageCheckStatus == "Error") ? "Class_Inactive" : ((sCoverageCheckStatus == "Completed" || sCoverageCheckStatus == "Checked") ? "Class_Active" : ((sCoverageCheckStatus == "Submitted") ? "Submitted" : ""))
                        if (sStatClass != "") {
                            //$('[aria-label="Coverage Check Status"]').addClass("VFDisplayNone").parent().append("<div><span  class=' CoverageChckSts dot_" + sStatClass + "'></span> <span class=' AddressStatusStyle " + sStatClass + "'>" + sCoverageCheckStatus + "</span></div>");
                            $('[name=' + this.GetPM().Get("GetControls")["Status"].GetInputName() + ']').addClass("VFDisplayNone").parent().append("<div><span class=' dot_" + sStatusClass + "'></span> <span  class=' AddressStatusStyle " + sStatusClass + "'>" + value + "</span></div>");
                        }
                    }
					
					//vasavi added for RAF Project
					var sRAFStatus = $('[aria-label="RAF Status"]').val();
					var sStatClass = (sRAFStatus == "Valid") ? "Class_Active" : ((sRAFStatus == "Invalid") ? "Class_Inactive" : "")
                    if (sStatClass != "") {
                         $('[name=' + this.GetPM().Get("GetControls")["RAF Status"].GetInputName() + ']').addClass("VFDisplayNone").parent().append("<div><span class=' dot_" + sStatusClass + "'></span> <span  class=' AddressStatusStyle " + sStatusClass + "'>" + value + "</span></div>");
                    }//end code vasavi added for RAF Project
					
                    //$('[aria-labelledby="Address_Selected_Label"]').css("width", "240px");
                    /*var SAddressStatus = $('[name=' + this_t.GetPM().Get("GetControls")["WSDL Address"].GetInputName() + ']').closest('tr').find('[aria-label="Address Status"]').val();
                    var sStatusClass = (SAddressStatus == "Valid") ? "Class_Active" : ((SAddressStatus == "Not Valid") ? "Class_Inactive" : "");
                    if (sStatusClass != "") {
                    $('[name=' + this_t.GetPM().Get("GetControls")["WSDL Address"].GetInputName() + ']').closest('tr').find('[aria-label="Address Status"]').addClass("VFDisplayNone").parent().append("<div><span class=' dot_" + sStatusClass + "'></span> <span class=' AddressStatusStyle " + sStatusClass + "'>" + SAddressStatus + "</span></div>");
                    }*/
                    /*var ShipAddressStatus = $('[aria-labelledby="WSDL_Shipment_Address_Label"]').closest('tr').find('[aria-labelledby="Shipment_Address_Status_Label"]').val();
                    var shipStatusClass = (ShipAddressStatus == "Valid") ? "Class_Active" : ((ShipAddressStatus == "Not Valid") ? "Class_Inactive" : "");
                    if (shipStatusClass != "") {
                    $('[aria-labelledby="WSDL_Shipment_Address_Label"]').closest('tr').find('[aria-labelledby="Shipment_Address_Status_Label"]').addClass("VFDisplayNone").parent().append("<div><span class=' dot_" + shipStatusClass + "'></span> <span class=' AddressStatusStyle " + shipStatusClass + "'>" + ShipAddressStatus + "</span></div>");
                    }*/
                }, 1);
                if (sView == "VF Prepay Customer and Address info View - TBUI" || sView == "VF Capture Exst Customer Details Postpay TBUI") {
                    $("#Map_URL_Label").parent().parent().next('td').wrapInner('<div id="VHACovergaeCheck" class="VHACovergaeCheck"/>');
                    $('[aria-label="Coverage Check"]').parent().addClass("VHACovergaeCheckButton");
                }
                setTimeout(function () {
                    if (sAppltName == "VHA Out of Stock Summary Form Applet - TBUI HI" || sAppltName == "VF Out of Stock Summary Form Applet - Upgrade TBUI" || sAppltName == "VF Out of Stock Summary Form Applet - TBUI") {
                        var ser = SiebelApp.S_App.GetService("VF BS Process Manager");
                        var Inputs = SiebelApp.S_App.NewPropertySet();
                        Inputs.SetProperty("Service Name", "VF TBUI BS Utilities");
                        Inputs.SetProperty("Method Name", "CheckExistingCA");
                        if (sAppltName == "VF Out of Stock Summary Form Applet - TBUI")
                            Inputs.SetProperty("Account Id", $('[aria-label="Customer Id:"]').val());
                        else
                            Inputs.SetProperty("Account Id", $('[aria-label="Customer Row Id"]').val());
                        var Output = ser.InvokeMethod("Run Process", Inputs);
                        var Reset = Output.GetChildByType("ResultSet");
                        var sExistCustomer = Reset.GetProperty("ExistingCustomer");
                        var sExist = Reset.GetProperty("Exists");
                        if (sExistCustomer == "N") {
                            var AppletName = GetActiveCreditAppletName();
                            if (AppletName == "VF Out of Stock Summary Form Applet - TBUI") {
                                var ShipingApplet = SiebelApp.S_App.GetActiveView().GetApplet(AppletName);
                                var IntelligentSearchAddressCtrl = $("input[name='" + ShipingApplet.GetControl("VF Intelligence Search Address").GetInputName() + "']");
                                IntelligentSearchAddressCtrl.attr("readonly", "readonly");
                            }
                        }
                    }
                }, 5);
                if (sView == "VF Prepay Customer and Address info View - TBUI") {
                    $('[name=' + this_t.GetPM().Get("GetControls")["Address"].GetInputName() + ']').autocomplete({
                        source: function (request, response) {
                            var sResp = VHAAppUtilities.doSearchAddress(request, "physical");
                            if (sResp != false) {
                                response(sResp);
                            } else {
                                response([]);
                            }
                            mSetPrflAttr("Prepay QAS Query Executed", "Y");
                        },
                        minLength: 10,
                        select: function (event, ui) {
                            var sResp = VHAAppUtilities.getAddress(ui);
                            if (sResp != false) {
                                var Inputs = SiebelApp.S_App.NewPropertySet();
                                Inputs.SetProperty("ViewName", SiebelApp.S_App.GetActiveView().GetName());
                                Inputs.SetProperty("Action", "PrepayAddress");
                                VHAAppUtilities.updateAddress(sResp, Inputs);
                            }
                        }
                    });
                }
                var sViewName = SiebelApp.S_App.GetProfileAttr("ViewName");
                var sView = SiebelApp.S_App.GetActiveView().GetName();

                //these views doesn't have WSDL_Shipment_Address_Label,WSDL_Address_Label control mapped in any of the applet
                if ("" + sView == "VF Capture Customer Details – Postpay TBUI" || "" + sView == "VF Capture Exst Customer Details Postpay TBUI" || "" + sView == "VF Capture Customer Details Postpay UNISIM TBUI" || "" + sView == "VHA PosttoPre Capture Customer Details View") {
					if ("" + sView != "VHA PosttoPre Capture Customer Details View") {
                    $('[name=' + this_t.GetPM().Get("GetControls")["Change Address"].GetInputName() + ']').change(function () {
                        $('.ccNwkpar').remove();
                    });
					}
                    this_t.GetPM().Get("GetControls")["WSDL Address"] === undefined ? "" : $('[name=' + this_t.GetPM().Get("GetControls")["WSDL Address"].GetInputName() + ']').autocomplete({
                        source: function (request, response) {
                            var sResp = VHAAppUtilities.doSearchAddress(request, "physical");
                            if (sResp != false) {
                                response(sResp);
                            } else {
                                response([]);
                            }
                            var sProfileAttrName = (sView == "VHA PosttoPre Capture Customer Details View") ? "Prepay QAS Query Executed" : "QAS Query Executed";
                            mSetPrflAttr(sProfileAttrName, "Y");
                        },
                        minLength: 10,
                        select: function (event, ui) {
                            $('.ccNwkpar').remove();
                            var sResp = VHAAppUtilities.getAddress(ui);
                            if (sResp != false) {
                                var Inputs = SiebelApp.S_App.NewPropertySet();
                                Inputs.SetProperty("ViewName", SiebelApp.S_App.GetActiveView().GetName());
                                Inputs.SetProperty("Action", "UpdateTBCAddress");
                                VHAAppUtilities.updateAddress(sResp, Inputs);
                                var SearchString = "[List Of Values.Type]='VHA_AUTO_COVRGE_CHK' AND [List Of Values.Active]='Y'";
                                var sLovFlg = VHAAppUtilities.GetPickListValues("", SearchString);
                                if (sLovFlg == "ON") {
                                    setTimeout(function () {
                                        VHACovergaeCheck(sResp, this_t);
                                    }, 500);

                                }
                            }
                        }
                    });
                    var sAIN1 = this.GetPM().Get("GetId");
                    //$('[aria-labelledby="WSDL_Shipment_Address_Label"]').autocomplete({
                    $('[aria-labelledby="WSDL_Shipment_Address_Label_' + sAIN1 + '"]').autocomplete({
                        source: function (request, response) {
                            var sResp = VHAAppUtilities.doSearchAddress(request, "physical");
                            if (sResp != false) {
                                response(sResp);
                            } else {
                                response([]);
                            }
                            mSetPrflAttr("Shipment QAS Query Executed", "Y");
                        },
                        minLength: 10,
                        select: function (event, ui) {
                            var sResp = VHAAppUtilities.getAddress(ui);
                            if (sResp != false) {
                                var Inputs = SiebelApp.S_App.NewPropertySet();
                                Inputs.SetProperty("ViewName", SiebelApp.S_App.GetActiveView().GetName());
                                Inputs.SetProperty("Action", "UpdateTBCShipAddress");
                                VHAAppUtilities.updateAddress(sResp, Inputs);
                            }
                        }
                    });
                    $('[name=' + this_t.GetPM().Get("GetControls")["CAPIN"].GetInputName() + ']').trigger("click");
                    $('[aria-label="Customer Type:Coverage Check"]').trigger("click");
                    $('[aria-label="Customer Type Form Applet:Coverage Check"]').trigger("click");
                    //$('[name=' + this_t.GetPM().Get("GetControls")["Coverage Check"].GetInputName() + ']').trigger("click");
                }

                var sViewName = SiebelApp.S_App.GetProfileAttr("ViewName");
                if ("" + sView == "VF Connection Wizard View – Shopping Cart – TBUI" || "" + sView == "VF Customise Services View –  TBUI" || "" + sView == "VHA Select Accessory TBUI - Manage APP View" || "" + sView == "VHA SIM Ordering Task View") {
                    $('[name=' + this_t.GetPM().Get("GetControls")["VF Intelligence Search Address"].GetInputName() + ']').keypress(function () {
                        var Inputs = SiebelApp.S_App.NewPropertySet();
                        var Output = SiebelApp.S_App.NewPropertySet();
                        var ser = SiebelApp.S_App.GetService("VF BS Process Manager");
                        Inputs.SetProperty("Service Name", "SIS OM PMT Service");
                        Inputs.SetProperty("Method Name", "Set Profile Attribute");
                        Inputs.SetProperty("Profile Attribute Name", "VFPostCodeAttr");
                        Inputs.SetProperty("Profile Attribute Value", "Invalid");
                        var Output = ser.InvokeMethod("Run Process", Inputs);
                    })
                    $('[name=' + this_t.GetPM().Get("GetControls")["VF Intelligence Search Address"].GetInputName() + ']').autocomplete({
                        source: function (request, response) {
                            var sResp = VHAAppUtilities.doSearchAddress(request, "physical");
                            if (sResp != false) {
                                response(sResp);
                            } else {
                                response([]);
                            }
                            mSetPrflAttr("QAS Query Executed", "Y");
                        },
                        minLength: 10,
                        select: function (event, ui) {
                            var sResp = VHAAppUtilities.getAddress(ui);
                            if (sResp != false) {
                                var Inputs = SiebelApp.S_App.NewPropertySet();
                                Inputs.SetProperty("ViewName", SiebelApp.S_App.GetActiveView().GetName());
                                Inputs.SetProperty("Action", "ShipAddress");
                                mSetPrflAttr("VFPostCodeAttr", "Y");
                                mSetPrflAttr("QAS Pick DTS", "Y");
                                mSetPrflAttr("VHAPSMAShipIdent", "Y");
                                var sErr = VHAAppUtilities.updateAddress(sResp, Inputs);
                                mSetPrflAttr("VHAPSMAShipIdent", "");
                                fUncheckPickPrimary();
                                if (sErr != false) {
                                    var App = SiebelApp.S_App.GetActiveView().GetApplet(GetActiveCreditAppletName());
                                    if (App != "" && App != null) {
                                        this_t.GetPM().Get("GetBusComp").SetFieldValue(App.GetControl("VF Intelligence Search Address").GetFieldName(), "");
                                        return false;
                                    }
                                }
                            }
                        }
                    });
                    var AppletName = GetActiveCreditAppletName();
                    var ShipingApplet = SiebelApp.S_App.GetActiveView().GetApplet(AppletName);
                    var ManualDeliveryCtrl = $("input[name='" + ShipingApplet.GetControl("Manual Delivery Address").GetInputName() + "']");
                    var IntelligentSearchAddressCtrl = $("input[name='" + ShipingApplet.GetControl("VF Intelligence Search Address").GetInputName() + "']");
                    ManualDeliveryCtrl.attr("readonly", "readonly");
                    ManualDeliveryCtrl.closest("tr").hide();
                    if (VFTaskSessionVariable.GetValue(AppletName + "_QASSearchContextFlag") == "Y") {
                        var Inputs = SiebelApp.S_App.NewPropertySet();
                        var Output = SiebelApp.S_App.NewPropertySet();
                        var ser = SiebelApp.S_App.GetService("VF BS Process Manager");
                        Inputs.SetProperty("Service Name", "SIS OM PMT Service");
                        Inputs.SetProperty("Method Name", "Set Profile Attribute");
                        Inputs.SetProperty("Profile Attribute Name", "QAS Query Executed");
                        Inputs.SetProperty("Profile Attribute Value", "Y");
                        var Output = ser.InvokeMethod("Run Process", Inputs);
                    }
                    if (VFTaskSessionVariable.GetValue(AppletName + "_ManualAddressChecked") == "Y") {
                        setTimeout(function () {
                            $("input[name='" + ShipingApplet.GetControl("Manual Address Entry").GetInputName() + "']").prop('checked', true);
                            ManualDeliveryCtrl.attr("readonly", "readonly").closest("tr").show();
                            IntelligentSearchAddressCtrl.attr("readonly", "readonly").closest("tr").hide();
                        }, 100);
                    } else {
                        setTimeout(function () {
                            $("input[name='" + ShipingApplet.GetControl("Manual Address Entry").GetInputName() + "']").prop('checked', false);
                            ManualDeliveryCtrl.attr("readonly", "readonly").closest("tr").hide();
                            IntelligentSearchAddressCtrl.removeAttr("readonly").closest("tr").show();
                            if ((AppletName == "VHA Out of Stock Summary Form Applet - TBUI HI" || AppletName == "VF Out of Stock Summary Form Applet - Upgrade TBUI" || AppletName == "VF Out of Stock Summary Form Applet - TBUI")) {
                                var ser = SiebelApp.S_App.GetService("VF BS Process Manager");
                                var Inputs = SiebelApp.S_App.NewPropertySet();
                                Inputs.SetProperty("Service Name", "VF TBUI BS Utilities");
                                Inputs.SetProperty("Method Name", "CheckCustActiveVoiceService");
                                if (AppletName == "VF Out of Stock Summary Form Applet - TBUI")
                                    Inputs.SetProperty("Account Id", $('[aria-label="Customer Id:"]').val());
                                else
                                    Inputs.SetProperty("Account Id", $('[aria-label="Customer Row Id"]').val());
                                var Output = ser.InvokeMethod("Run Process", Inputs);
                                var Reset = Output.GetChildByType("ResultSet");
                                var sActiveServExist = Reset.GetProperty("ActiveServiceExist");
                                Inputs = SiebelApp.S_App.NewPropertySet();
                                Inputs.SetProperty("Service Name", "VF TBUI BS Utilities");
                                Inputs.SetProperty("Method Name", "CheckExistingCA");
                                if (AppletName == "VF Out of Stock Summary Form Applet - TBUI")
                                    Inputs.SetProperty("Account Id", $('[aria-label="Customer Id:"]').val());
                                else
                                    Inputs.SetProperty("Account Id", $('[aria-label="Customer Row Id"]').val());
                                Output = ser.InvokeMethod("Run Process", Inputs);
                                Reset = Output.GetChildByType("ResultSet");
                                var sExistCustomer = Reset.GetProperty("ExistingCustomer");
                                if (sExistCustomer == "N") {
                                    IntelligentSearchAddressCtrl.attr("readonly", "readonly");
                                }
                            }
                        }, 100);
                    }
                    $("input[name='" + ShipingApplet.GetControl("Manual Address Entry").GetInputName() + "']").click(function () {
                        var App = SiebelApp.S_App.GetActiveView().GetApplet(GetActiveCreditAppletName());
                        var sSIMOrderingTBUIApplet = SiebelApp.S_App.GetActiveView().GetApplet("VHA SIM Ordering TBUI Applet");
                        var pm = App.GetPModel();
                        if (VFTaskSessionVariable.GetValue(AppletName + "_QASSearchContextFlag") != "Y") {
                            var IsValidSearch = SiebelApp.S_App.GetProfileAttr("QAS Query Executed");
                            if (IsValidSearch == "Y") {
                                VFTaskSessionVariable.SetValue(AppletName + "_QASSearchContextFlag", "Y");
                            }
                        }
                        if ($(this).is(":checked")) {
                            if (VFTaskSessionVariable.GetValue(AppletName + "_QASSearchContextFlag") == "Y") {
                                ManualDeliveryCtrl.attr("readonly", "readonly").closest("tr").show();
                                VFTaskSessionVariable.SetValue(AppletName + "_ManualAddressChecked", "Y");
                                IntelligentSearchAddressCtrl.closest("tr").hide();
                                var ManualAddressControl = ShipingApplet.GetControl("Manual Delivery Address");
                                var ManualAddressCtrlVal = pm.ExecuteMethod("GetFieldValue", ManualAddressControl);
                                pm.ExecuteMethod("SetFormattedValue", ShipingApplet.GetControl("VF Intelligence Search Address"), ManualAddressCtrlVal);
                                fUncheckPickPrimary();
                                if (App != "" && App != null) {
                                    pm.Get("GetBusComp").SetFieldValue(App.GetControl("Manual Address Ident").GetFieldName(), "Y");
                                    pm.Get("GetBusComp").WriteRecord();
                                }
                                $(this).prop("checked", true);
                            } else {
                                alert("Please do PSMA Search atleast once to proceed further");
                                $(this).prop('checked', false);
                            }
                            var Inputs = SiebelApp.S_App.NewPropertySet();
                            var Output = SiebelApp.S_App.NewPropertySet();
                            var ser = SiebelApp.S_App.GetService("VF BS Process Manager");
                            Inputs.SetProperty("Service Name", "SIS OM PMT Service");
                            Inputs.SetProperty("Method Name", "Set Profile Attribute");
                            Inputs.SetProperty("Profile Attribute Name", "VFPostCodeAttr");
                            Inputs.SetProperty("Profile Attribute Value", "N");
                            var Output = ser.InvokeMethod("Run Process", Inputs);
                        } else {
                            ManualDeliveryCtrl.attr("readonly", "readonly").closest("tr").hide();
                            IntelligentSearchAddressCtrl.closest("tr").show();
                            VFTaskSessionVariable.SetValue(AppletName + "_ManualAddressChecked", "N");
                            IntelligentSearchAddressCtrl.removeAttr("readonly");
                            var Inputs = SiebelApp.S_App.NewPropertySet();
                            var Output = SiebelApp.S_App.NewPropertySet();
                            var ser = SiebelApp.S_App.GetService("VF BS Process Manager");
                            Inputs.SetProperty("Service Name", "SIS OM PMT Service");
                            Inputs.SetProperty("Method Name", "Set Profile Attribute");
                            Inputs.SetProperty("Profile Attribute Name", "VFPostCodeAttr");
                            Inputs.SetProperty("Profile Attribute Value", "Invalid");
                            var Output = ser.InvokeMethod("Run Process", Inputs);
                            if (App != "" && App != null) {
                                pm.Get("GetBusComp").SetFieldValue(App.GetControl("Manual Address Ident").GetFieldName(), "");
                                pm.Get("GetBusComp").WriteRecord();
                            }
                        }
                        console.log(VFTaskSessionVariable.GetValue(AppletName + "_ManualAddressChecked"));
                    })
                }
            
		 $('[title-preserved="VF Capture Customer Details – TBUI – ID Scan Disabled"] .minibuttonOn a').after('<button class="appletButton" id="tbui-mfa-prepay">Authenticate</button>');
		 if(TheApplication().GetProfileAttr("VHA User Type") == 'Care'){
				 $('#idSighted,label[for="idSighted"]').addClass("displaynone");
				 $('#inApp,label[for="inApp"]').addClass("displaynone");
		}
		else{
				 $('#idSighted,label[for="idSighted"]').removeClass("displaynone");		
				  if(SiebelApp.S_App.GetProfileAttr('TPG Retail Access') === "Y"){
					  $('#inApp,label[for="inApp"]').removeClass("displaynone");				     
				 }
				 else{
					 $('#inApp,label[for="inApp"]').addClass("displaynone");				    
				 }
		}
		 $('#vha-phoneinput-Id').attr('autocomplete', 'off');
		  $('#vha-emailinput-Id').attr('autocomplete', 'off');
		  $('#vha-ret-driverlic-Id').attr('autocomplete', 'off');
    }

    VHACaptureCustomerDetailsAppletPR.prototype.BindData = function (bRefresh) {
     SiebelAppFacade.VHACaptureCustomerDetailsAppletPR.superclass.BindData.apply(this, arguments);
    }

    VHACaptureCustomerDetailsAppletPR.prototype.BindEvents = function () {
     SiebelAppFacade.VHACaptureCustomerDetailsAppletPR.superclass.BindEvents.apply(this, arguments);
	  var view = SiebelApp.S_App.GetActiveView();
                var appletMap = view.GetAppletMap();
                var ShipingApplet = SiebelApp.S_App.GetActiveView().GetApplet(GetActiveCreditAppletName());
                if (ShipingApplet != "" && ShipingApplet != null) {
                    var IntelligentSearchAddressCtrl = $("input[name='" + ShipingApplet.GetControl("VF Intelligence Search Address").GetInputName() + "']");
                    IntelligentSearchAddressCtrl.on('input', function () {
                        fUncheckPickPrimary();
                    });
                }
                var myApplet1 = appletMap['VHA Capture Customer Details Toggle Form Applet Person TBUI Shipment Manual'];
                var myApplet2 = appletMap['VHA Capture Customer Manual Address Details Person TBUI Shipment'];
                var myApplet3 = appletMap['VHA Capture Customer Details Toggle Form Applet Corporate Manual TBUI Ship'];
                var myApplet4 = appletMap['VHA Capture Customer Details Toggle Form Applet Corporate Manual TBUI S Man'];
                var myApplet5 = appletMap['VHA Capture Customer Manual Address Details Person TBUI Shipment Manual'];
                var myApplet6 = appletMap['VHA Capture Customer Details Toggle Form Applet Corporate TBUI Ship Manual'];
                var myApplet7 = appletMap['VHA Capture Customer Manual Address Details Person TBUI'];
                var myApplet8 = appletMap['VHA Capture Customer Details Toggle Form Applet Corporate Manual TBUI'];
                if (!(myApplet1 == undefined || myApplet1 == "") || !(myApplet6 == undefined || myApplet6 == "")) {
                    var pm1;
                    if (!(myApplet1 == undefined || myApplet1 == ""))
                        pm1 = myApplet1.GetPModel();
                    if (!(myApplet6 == undefined || myApplet6 == ""))
                        pm1 = myApplet6.GetPModel();
                    var AppletId = pm1.Get("GetFullId");
                    $("#s_" + AppletId + "_div").delegate("#ShipCollapse_up", "click", function () {
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('tr').parent().find('tr').slice(-6, -1).addClass("VFDisplayNone");
                        $("#ShipCollapse_up").remove();
                        $('[name=' + this_t.GetPM().Get("GetControls")["WSDL Address"].GetInputName() + ']').closest('tr').find('[aria-labelledby=' + $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').attr('aria-labelledby') + ']').parent().append('<div class="ChevronInactive VHAShipmentChevron" id="ShipCollapse_down"></div>');
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('td').addClass("Cls_ShipCollapse_down");
                    });
                    $("#s_" + AppletId + "_div").delegate("#ShipCollapse_down", "click", function () {
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('td').removeClass("Cls_ShipCollapse_down");
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('tr').parent().find('tr').slice(-7).removeClass("VFDisplayNone");
                        $('[name=' + this_t.GetPM().Get("GetControls")["WSDL Address"].GetInputName() + ']').closest('tr').find('[aria-labelledby=' + $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').attr('aria-labelledby') + ']').parent().append('<div class="ChevronActive VHAShipmentChevron" id="ShipCollapse_up"></div>');
                        $("#ShipCollapse_down").remove();
                    });
                }
                if (!(myApplet2 == undefined || myApplet2 == "") || !(myApplet3 == undefined || myApplet3 == "")) {
                    var pm1;
                    if (!(myApplet2 == undefined || myApplet2 == ""))
                        pm1 = myApplet2.GetPModel();
                    if (!(myApplet3 == undefined || myApplet3 == ""))
                        pm1 = myApplet3.GetPModel();
                    var AppletId = pm1.Get("GetFullId");
                    $("#s_" + AppletId + "_div").delegate("#ShipCollapse_up", "click", function () {
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('tr').parent().find('tr').slice(-8, -3).addClass("VFDisplayNone");
                        $("#ShipCollapse_up").remove();
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').parent().append('<div class="ChevronInactive VHAShipmentChevron" id="ShipCollapse_down"></div>');
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('td').addClass("Cls_ShipCollapse_down");
                    });
                    $("#s_" + AppletId + "_div").delegate("#ShipCollapse_down", "click", function () {
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('td').removeClass("Cls_ShipCollapse_down");
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('tr').parent().find('tr').slice(-8).removeClass("VFDisplayNone");
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').parent().append('<div class="ChevronActive VHAShipmentChevron" id="ShipCollapse_up"></div>');
                        $("#ShipCollapse_down").remove();
                    });
                }
                if (!(myApplet7 == undefined || myApplet7 == "") || !(myApplet8 == undefined || myApplet8 == "")) {
                    var pm1;
                    if (!(myApplet7 == undefined || myApplet7 == ""))
                        pm1 = myApplet7.GetPModel();
                    if (!(myApplet8 == undefined || myApplet8 == ""))
                        pm1 = myApplet8.GetPModel();
                    var AppletId = pm1.Get("GetFullId");
                    $("#s_" + AppletId + "_div").delegate("#ShipCollapse_up", "click", function () {
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('tr').parent().find('tr').slice(-6, -2).addClass("VFDisplayNone");
                        $("#ShipCollapse_up").remove();
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').parent().append('<div class="ChevronInactive VHAShipmentChevron" id="ShipCollapse_down"></div>');
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('td').addClass("Cls_ShipCollapse_down");
                    });
                    $("#s_" + AppletId + "_div").delegate("#ShipCollapse_down", "click", function () {
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('td').removeClass("Cls_ShipCollapse_down");
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('tr').parent().find('tr').slice(-6).removeClass("VFDisplayNone");
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').parent().append('<div class="ChevronActive VHAShipmentChevron" id="ShipCollapse_up"></div>');
                        $("#ShipCollapse_down").remove();
                    });
                }
                if (!(myApplet4 == undefined || myApplet4 == "") || !(myApplet5 == undefined || myApplet5 == "")) {
                    var pm1;
                    var startHide;
                    if (!(myApplet4 == undefined || myApplet4 == "")) {
                        pm1 = myApplet4.GetPModel();
                        startHide = -12;
                    }
                    if (!(myApplet5 == undefined || myApplet5 == "")) {
                        pm1 = myApplet5.GetPModel();
                        startHide = -14;
                    }
                    var AppletId = pm1.Get("GetFullId");
                    $("#s_" + AppletId + "_div").delegate("#manShipCollapse_up", "click", function () {
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('tr').parent().find('tr').slice(startHide, -8).find("td div.mceGridField,td div.mceGridLabel").addClass("VFDisplayNone");
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('tr').parent().find('tr').slice(-13, -8).find('td:eq(0)').height(0)
                        $("#manShipCollapse_up").remove();
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').parent().append('<div class="ChevronInactive VHAShipmentChevron" id="manShipCollapse_down"></div>');
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('td').addClass("Cls_ShipCollapse_down");
                    });
                    $("#s_" + AppletId + "_div").delegate("#manShipCollapse_down", "click", function () {
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('td').removeClass("Cls_ShipCollapse_down");
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('tr').parent().find('tr').slice(startHide, -8).find("td div.mceGridField,td div.mceGridLabel").removeClass("VFDisplayNone");
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').parent().append('<div class="ChevronActive VHAShipmentChevron" id="manShipCollapse_up"></div>');
                        $("#manShipCollapse_down").remove();
                    });
                    $("#s_" + AppletId + "_div").delegate("#ShipmanCollapse_up", "click", function () {
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('tr').parent().find('tr').slice(-6, -1).addClass("VFDisplayNone");
                        $("#ShipmanCollapse_up").remove();
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').parent().append('<div class="ChevronInactive VHAShipmentChevron" id="ShipmanCollapse_down"></div>');
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('td').addClass("Cls_ShipCollapse_down");
                    });
                    $("#s_" + AppletId + "_div").delegate("#ShipmanCollapse_down", "click", function () {
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('td').removeClass("Cls_ShipCollapse_down");
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').closest('tr').parent().find('tr').slice(-6, -1).removeClass("VFDisplayNone");
                        $('[name=' + this_t.GetPM().Get("GetControls")["Manual Shipment Address"].GetInputName() + ']').parent().append('<div class="ChevronActive VHAShipmentChevron" id="ShipmanCollapse_up"></div>');
                        $("#ShipmanCollapse_down").remove();
                    });
                }
	   // authentication start
			 $('#tbui-mfa-prepay').on("click", function () {
                      authdetails = getdetails();	
					  authcontdetails();
					 $("#myModal").removeClass("displaynone");
             });
			 
			 $(".vha-ret-popup-close-btn").on("click", function () {
				$("#myModal").addClass("displaynone");
				resetMFA();
             });
			  $("#vha-cont-prof-nextbtn").on("click", function () {
				  if(verifiedStep2 === "Y")
				  {
				    SiebelApp.S_App.SetProfileAttr("VHAPrepayAuthenticated", "Yes");
					$("#myModal").addClass("displaynone");
					resetMFA();
				  }				
				  else
				  {
					  alert("Please authenticate customer before proceeding");
				  }
				
              });
			
                $('input[name="authMethod"]').on("change", function () {
                    $(".send-otp").hide();
                    $(".resend-otp").hide();
                    $(".otp-status").hide();
                    $(".validated-status").hide();
                    $("#vha-idsight-send-otp-btn").addClass("displaynone");
                    $("#vha-inapp-send-otp-btn").addClass("displaynone");
                    $("#vha-email-send-otp-parent").addClass("displaynone");
                    $("#vha-phone-send-otp-parent").addClass("displaynone");
                    // $(".vha-ret-validate-form").addClass("displaynone");
                    // $("#vha-ret-validate-form-btn").addClass("displaynone");
                    $("#vha-ret-confirmCode").val("");
                    $(".refreshicon").addClass("displaynone");
                    switch (this.value) {
                        case "idSighted":
                            //  $("#vha-idsight-send-otp-btn").show();
                            $("#vha-idsight-send-otp-btn").removeClass("displaynone");
                            AuthmethodType = "idSighted";
                            break;
                        case "email":
                            AuthmethodType = "email";
                            if (EmailVerifyFlag_step2 === "Y") {
                                $("#vha-email-send-otp-btn").show();
                            } else {
                                $("#valiadte-email").show();
                            }
                            break;
                        case "phone":
                            AuthmethodType = "phone";
                            if (PhnVerifyFlag_step2 === "Y") {
                                $("#vha-phone-send-otp-btn").show();
                            } else {
                                $("#valiadte-phone").show();
                            }
                            break;
                        case "inApp":
                            $("#vha-inapp-send-otp-btn").removeClass("displaynone");
                            AuthmethodType = "inApp";
                            break;
                    }
                });

                $("#vha-idsight-validateId-btn").on("click", function () {
                    var userid = $('#vha-ret-driverlic-Id').val();
						if(userid === IdsightDetails.IdReferenceNumber){
							 verifiedStep2 = "Y";
							 $(".IdentrySucess").removeClass("displaynone");
							  $(".IdentryFail").addClass("displaynone");
						}
						else{
							$(".IdentrySucess").addClass("displaynone");
							$(".IdentryFail").removeClass("displaynone");
						}
                });
                $("#vha-inapp-checkbox").on("change", function () {
                    if ($(this).is(":checked")) {
                       verifiedStep2 = "Y";
                    } else {
                        verifiedStep2 = "N";
                    }
                });
                $("#valiadte-email").on("click", function () {
                    var data;
					$("#vha-step2-mail-unverified").text("Email sent");
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            data = verifyEmailSms(stepAuthPbj, "step2");
                            if (data.ErrCd === "0" || data.ErrCd === "") $("#vha-step2-mail-refresh").removeClass("displaynone");
                            else alert(data.ErrMsg);
                        }, 0);
                    });
                });

                $("#valiadte-phone").on("click", function () {
                    var data;
					$("#vha-step2-phone-unverified").text("SMS sent");
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            data = verifyEmailSms(stepAuthPbj, "step2");
                            if (data.ErrCd === "0" || data.ErrCd === "") $("#vha-step2-phone-refresh").removeClass("displaynone");
                            else alert(data.ErrMsg);
                        }, 0);
                    });
                });
                $(".refreshicon").on("click", function () {
                    var getflags = getdetails("step2");
                    PhnVerifyFlag_step2 = getflags["Contact Number Validated"];
                    EmailVerifyFlag_step2 = getflags["Email Address Validated"];
                    if (AuthmethodType === "phone") {
                        if (PhnVerifyFlag_step2 === "Y") {
                            $("#vha-step2-phone-traingexclm").addClass("displaynone");
                            $("#vha-step2-phone-tickmark").removeClass("displaynone");
                            $(this).addClass("displaynone");
                           // $("#valiadte-phone").addClass("displaynone");
							$("#valiadte-phone").hide();
                            $("#vha-phone-send-otp-btn").show();
							$('#vha-step2-phone-unverified').text("Verified");
							$("#vha-step2-phone-unverified").removeClass("displaynone");
                        } else {
                            $("#vha-step2-phone-traingexclm").removeClass("displaynone");
                            $("#vha-step2-phone-tickmark").addClass("displaynone");
							$('#vha-step2-phone-unverified').text("Unverified");
							$("#vha-step2-phone-unverified").removeClass("displaynone");
                        }
                    }
                    if (AuthmethodType === "email") {
                        if (EmailVerifyFlag_step2 === "Y") {
                            $("#vha-step2-mail-traingexclm").addClass("displaynone");
                            $("#vha-step2-mail-tickmark").removeClass("displaynone");
                            $(this).addClass("displaynone");
                          //  $("#valiadte-email").addClass("displaynone"); 
						    $("#valiadte-email").hide();
                            $("#vha-email-send-otp-btn").show();
							$("#vha-step2-mail-unverified").text("Verified");
							$("#vha-step2-mail-unverified").removeClass("displaynone");
                        } else {
                            $("#vha-step2-mail-traingexclm").removeClass("displaynone");
                            $("#vha-step2-mail-tickmark").addClass("displaynone");
							$("#vha-step2-mail-unverified").text("Unverified");
							$("#vha-step2-mail-unverified").removeClass("displaynone");
                        }
                    }
                });
                $(".vha-ret-validate-form-btn").on("click", function () {
                    if (OtpStep2 != "") {
                        if (AuthmethodType === "phone") var userotp = $("#vha-phoneinput-Id").val();
                        else var userotp = $("#vha-emailinput-Id").val();

                        if (userotp === OtpStep2) {
                            verifiedStep2 = "Y";
                            // alert("verified");
                            if (AuthmethodType === "email") {
                                $(".emailauthSuccess").removeClass("displaynone");
                                $(".emailauthFail").addClass("displaynone");
                            }
                            if (AuthmethodType === "phone") {
                                $(".phoneauthSuccess").removeClass("displaynone");
                                $(".phoneauthFail").addClass("displaynone");
                            }
                        } else {
                            verifiedStep2 = "N";
                            // alert("enter correct otp");
                            if (AuthmethodType === "email") {
                                $(".emailauthSuccess").addClass("displaynone");
                                $(".emailauthFail").removeClass("displaynone");
                            }
                            if (AuthmethodType === "phone") {
                                $(".phoneauthSuccess").addClass("displaynone");
                                $(".phoneauthFail").removeClass("displaynone");
                            }
                        }
                    }
                });
                $("#vha-email-send-otp-btn").on("click", function () {
                    $(this).hide();
					$('#vha-emailinput-Id').val('');
					$(".emailauthSuccess").addClass("displaynone");
					$(".emailauthFail").addClass("displaynone");
                    //$("#email-status").text("Email sent").show();
                    $("#vha-email-send-otp-parent").removeClass("displaynone");
                    var showotp;
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            var response = SendOTP(stepAuthPbj,"step2");
                            showotp = response.GetChildByType("ResultSet").propArray.OTP;
                            //$("#vha-ret-confirmCode").val(showotp);

                            OtpStep2 = showotp;
                        }, 0);
                    });
                    //SendOTP(stepAuthPbj);
                    setTimeout(function () {
                        $("#email-status").hide();
                        // if (showotp === "")
                        $("#vha-email-resend-otp-btn").show();
                    }, 0);
                });
                
                $("#vha-phone-send-otp-btn").on("click", function () {
                    $(this).hide();
					$('#vha-phoneinput-Id').val('');
					 $(".phoneauthSuccess").addClass("displaynone");
					 $(".phoneauthFail").addClass("displaynone");
                   // $("#phone-status").text("SMS sent").show();
                    $("#vha-phone-send-otp-parent").removeClass("displaynone");                  
                    var showotp;
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            var response = SendOTP(stepAuthPbj,"step2");
                            showotp = response.GetChildByType("ResultSet").propArray.OTP;
                            //$("#vha-ret-confirmCode").val(showotp);

                            OtpStep2 = showotp;
                        }, 0);
                    });
                    //SendOTP(stepAuthPbj);
                    setTimeout(function () {
                        $("#phone-status").hide();
                        //  if (showotp === "")
                        $("#vha-phone-resend-otp-btn").show();
                    }, 0);
                });

                $(".resend-otp").on("click", function () {
                    const id = $(this).attr("id");
                    //    const sendId = id.replace('resend', 'send');
                    $(this).hide();
                    switch (AuthmethodType) {
                        case "idSighted":
                            $("#idsight-status").text("Code sent").show();
                            break;
                        case "email":
                          //  $("#email-status").text("Email sent").show();
							 var showotp;
							  $('#vha-emailinput-Id').val('');
							$(".emailauthSuccess").addClass("displaynone");
							$(".emailauthFail").addClass("displaynone");
							requestAnimationFrame(() => {
								setTimeout(() => {
									var response = SendOTP(stepAuthPbj,"step2");
									showotp = response.GetChildByType("ResultSet").propArray.OTP;
									//$("#vha-ret-confirmCode").val(showotp);

									OtpStep2 = showotp;
								}, 0);
							});
                            break;
                        case "phone":
                           // $("#phone-status").text("SMS sent").show();
						    var showotp;
							$('#vha-phoneinput-Id').val('');
							 $(".phoneauthSuccess").addClass("displaynone");
							 $(".phoneauthFail").addClass("displaynone");
							requestAnimationFrame(() => {
								setTimeout(() => {
									var response = SendOTP(stepAuthPbj,"step2");
									showotp = response.GetChildByType("ResultSet").propArray.OTP;
									//$("#vha-ret-confirmCode").val(showotp);

									OtpStep2 = showotp;
								}, 0);
							});
                            break;
                        case "inApp":
                            $("#inapp-status").text("Code sent").show();
                            break;
                    }
                    setTimeout(function () {
                        $(".otp-status").hide();
                        $(`#${id}`).show();
                    }, 0);
                });

                //authentication end
	   
    }

    VHACaptureCustomerDetailsAppletPR.prototype.EndLife = function () {
     SiebelAppFacade.VHACaptureCustomerDetailsAppletPR.superclass.EndLife.apply(this, arguments);
	  if (SiebelApp.S_App.GetActiveView().GetName() == "VHA SIM Ordering Task View") {
                    VFTaskSessionVariable.SetValue("VHA SIM Ordering TBUI Applet_ManualAddressChecked", "N");
                    VFTaskSessionVariable.SetValue("VHA SIM Ordering TBUI Applet_QASSearchContextFlag", "N");
                }
    }
	
	 // send otp
            function SendOTP(item,callfrom) {
                var ser = SiebelApp.S_App.GetService("Workflow Process Manager");
                var Input = SiebelApp.S_App.NewPropertySet();
                Input.SetProperty("ProcessName", "VHA Generate OTP Process");
                Input.SetProperty("OrgName", item.OrgName);
                Input.SetProperty("ARII", item.ARII);
                Input.SetProperty("ContactId", item.ContactId);
                Input.SetProperty("AccountObjectId", item.AccountObjectId);
				Input.SetProperty("AccId", item.AccountObjectId);
                if(callfrom === "step2"){
					if (AuthmethodType === "email"){
						Input.SetProperty("EmailAddr", item.EmailOTP);
						Input.SetProperty("EmailOTP", "ConEmailOTP");
					} 
						
					else Input.SetProperty("MSISDN", item.MSISDN);
				}
			/*	else{
					if (AuthmethodType3 === "email") {
						Input.SetProperty("EmailAddr", item.EmailOTP);
						Input.SetProperty("EmailOTP", "ConEmailOTP");
					}
						
					else Input.SetProperty("MSISDN", item.MSISDN);
				} */
                
                var Outputs = ser.InvokeMethod("RunProcess", Input);
                return Outputs;
            }
			// email or sms verify

            function verifyEmailSms(item, callfrom) {
                var ser = SiebelApp.S_App.GetService("Workflow Process Manager");
                var Input = SiebelApp.S_App.NewPropertySet();
                //var ObjectId = SiebelApp.S_App.GetProfileAttr("VHA-INV-CON-ID");
                Input.SetProperty("Object Id", item.ContactId);
                Input.SetProperty("sConId", item.ContactId);
				if(callfrom === "step2"){
					 if (AuthmethodType === "email") {
						Input.SetProperty("sType", "Email");
						Input.SetProperty("sValue", item.EmailOTP);
						}
					if (AuthmethodType === "phone") {
							Input.SetProperty("sType", "SMS");
							Input.SetProperty("sValue", item.MSISDN);
					 }
				}
				else{
					if (AuthmethodType3 === "email") {
                    Input.SetProperty("sType", "Email");
                    Input.SetProperty("sValue", item.EmailOTP);
					}
					if (AuthmethodType3 === "phone") {
						Input.SetProperty("sType", "SMS");
						Input.SetProperty("sValue", item.MSISDN);
					}
				}
               
                Input.SetProperty("ProcessName", "VHA Digital Email SMS Verification Process");
                var Outputs = ser.InvokeMethod("RunProcess", Input);
                var datatemp = Outputs.childArray[0].propArray;
                return datatemp;
            }
			//Id entry 
			function getIDdetails(ConId) {
				var ser = SiebelApp.S_App.GetService("Workflow Process Manager");
				var Input = SiebelApp.S_App.NewPropertySet();
				Input.SetProperty("ProcessName", "VF Get Contact Verified Info");
				Input.SetProperty("Contact Id", ConId);
				Input.SetProperty("FlowType", "IDdata");
				var Outputs = ser.InvokeMethod("RunProcess", Input);                
				var proparray = Outputs.childArray[0].propArray;
				return proparray;
			}
			//reset mfa
			function resetMFA(){
			$("#vha-email-send-otp-parent").addClass("displaynone");
			 $("#vha-idsight-send-otp-btn").addClass("displaynone");
			 $("#vha-inapp-send-otp-btn").addClass("displaynone");
			 $("#vha-phone-send-otp-parent").addClass("displaynone");
			 $('#vha-phoneinput-Id').val('');
			 $(".phoneauthSuccess").addClass("displaynone");
			 $(".phoneauthFail").addClass("displaynone");
			 $('#vha-emailinput-Id').val('');
			 $(".emailauthSuccess").addClass("displaynone");
			 $(".emailauthFail").addClass("displaynone"); 
			 $('#vha-ret-driverlic-Id').val('');
			// $('input[name=authMethod]').prop('checked', false);
			$(".authenticate-sections").find("input[type='radio'], input[type='checkbox']").prop("checked", false);
			 $(".send-otp").hide();
			$(".resend-otp").hide();
			$(".otp-status").hide(); 
			$(".validated-status").hide();
			
			$(".IdentrySucess").addClass("displaynone");
            $(".IdentryFail").addClass("displaynone");
			$(".refreshicon").addClass("displaynone");
			verifiedStep2 = "N";
			
		}  
            function authcontdetails() {
				IdsightDetails = getIDdetails(authdetails["Contact Id"]);
				if (IdsightDetails.IdType != undefined && IdsightDetails.IdType != "") {
					$('#idSighted').parent().css('pointer-events', 'auto');
					$('#idSighted').parent().css('color', '#002244');
					var idtype = IdsightDetails.IdType+" "+"****"+IdsightDetails.IdReferenceNumber.slice(-4);
					$("#mfa-step2-IdentryVal").text(idtype);
				} else {
					$('#idSighted').parent().css('pointer-events', 'none');
					$('#idSighted').parent().css('color', 'darkgray');
					$("#mfa-step2-IdentryVal").text("");

				}
				
				
				const phoneNumber = authdetails["Home Phone #"];
                const maskedNumber = phoneNumber.substring(0, 2) + "xxxxxx" + phoneNumber.substring(phoneNumber.length - 3);

                const email = authdetails["Email Address"];
                const [username, domain] = email.split("@");
             //   const maskLength = username.length - 2;
             //   const maskedMiddle = "x".repeat(maskLength > 0 ? maskLength : 0);
                const maskedEmail = username.charAt(0) + "xxxxxxxxxx" + username.charAt(username.length - 1) + "@" + domain;
			
				let maskedName = authdetails["Full Name"].replace(/(\b\w)(\w*)/g, (_, first, rest) => first + "x".repeat(rest.length));
				$("#vha-ret-authName").text(maskedName);
                $("#vha-ret-authDob").text(authdetails["Birth Date"]);
                $("#vha-ret-authEmailDisplay").text(maskedEmail);
                $("#vha-ret-authPhoneDisplay").text(maskedNumber);
                stepAuthPbj.ARII = authdetails.AccARII;
                stepAuthPbj.OrgName = authdetails.AccOrg;
                stepAuthPbj.ContactId = authdetails["Contact Id"];
                stepAuthPbj.AccountObjectId = authdetails["AccId"];
                stepAuthPbj.MSISDN = authdetails["Home Phone #"];
                stepAuthPbj.EmailOTP = authdetails["Email Address"];
                
                PhnVerifyFlag_step2 = authdetails["Contact Number Validated"];
                EmailVerifyFlag_step2 = authdetails["Email Address Validated"];
				$(".unverifiedbtn").addClass("displaynone");
				
                if (PhnVerifyFlag_step2 === "Y") {
                    $("#vha-step2-phone-traingexclm").addClass("displaynone");
                    $("#vha-step2-phone-tickmark").removeClass("displaynone");
					$('#vha-step2-phone-unverified').text("Verified");
				    $("#vha-step2-phone-unverified").removeClass("displaynone");
                } else {
                    $("#vha-step2-phone-traingexclm").removeClass("displaynone");
                    $("#vha-step2-phone-tickmark").addClass("displaynone");
					$('#vha-step2-phone-unverified').text("Unverified");
				    $("#vha-step2-phone-unverified").removeClass("displaynone");
                }
                if (EmailVerifyFlag_step2 === "Y") {
                    $("#vha-step2-mail-traingexclm").addClass("displaynone");
                    $("#vha-step2-mail-tickmark").removeClass("displaynone");
					$("#vha-step2-mail-unverified").text("Verified");
				    $("#vha-step2-mail-unverified").removeClass("displaynone");
                } else {
                    $("#vha-step2-mail-traingexclm").removeClass("displaynone");
                    $("#vha-step2-mail-tickmark").addClass("displaynone");
					$("#vha-step2-mail-unverified").text("Unverified");
				    $("#vha-step2-mail-unverified").removeClass("displaynone");
                }
            }
            function getdetails() {
                var ser = SiebelApp.S_App.GetService("Workflow Process Manager");
                var Input = SiebelApp.S_App.NewPropertySet();
				//var ObjectId = authdetails.ConId;
				//var ObjectId = "2-CJHYJT0";
				var ObjectId = SiebelApp.S_App.GetActiveBusObj('Order Entry UNISIM BO').GetBusCompByName('VF Capture Customer Details UNISIM TBC').GetFieldValue('Primary Contact Id');
                Input.SetProperty("Contact Id", ObjectId);
                Input.SetProperty("ProcessName", "VF Get Contact Verified Info");
                var Outputs = ser.InvokeMethod("RunProcess", Input);
                var datatemp = Outputs.childArray[0].propArray;
                return datatemp;
            }
			 function VHACovergaeCheck(sResp, this_t) { // ??
                if (sResp == "") {
                    var ui= {
                        item: {
                            id: ""
                        }
                    };
                    //VHA Store Pickup Reservation Service_Test
                    var nInputs = SiebelApp.S_App.NewPropertySet();
                    nInputs.SetProperty("CustId", $('[aria-label="Customer Id:"]').val());
					var scustid = $('[aria-label="Customer Id:"]').val();
					if (scustid != "")
					{					
                    var sOut = VHAAppUtilities.CallBS("VHA Store Pickup Reservation Service BS MOCN", "GetAddressId", nInputs, "")
                        //GetAddressId  - CustId - AddrItemId
                        // call psma to get lat & long
                        ui.item.id = sOut.propArray.AddrItemId;
                    var sResp = VHAAppUtilities.getAddress(ui);
					}
                }
                if (sResp != "")
				fCoverageCheck(sResp, this_t);

                var sView = SiebelApp.S_App.GetActiveView().GetName();
                var BO = SiebelApp.S_App.GetActiveBusObj();
                var BC;
                if (sView == "VF Prepay Customer and Address info View - TBUI") {
                    BC = BO.GetBusCompByName("VF New Account Contact PrePay TBC");
                }
                if (sView == "VF Capture Customer Details Postpay UNISIM TBUI") {
                    BC = BO.GetBusCompByName("VF Capture Customer Details UNISIM TBC");
                } else if (sView == "VF Capture Exst Customer Details Postpay TBUI" || sView == "VF Capture Customer Details – Postpay TBUI") {
                    BC = BO.GetBusCompByName("VF Capture Customer Details TBC");
                }
                var sMapURL = BC.GetFieldValue("Map URL");
                if (sMapURL != "")
                    ($('.siebui-icon-location').length > 0) ? $(".siebui-icon-location").attr("href", sMapURL) : $("#Map_URL_Caption_Label_" + this_t.GetPM().Get("GetId")).parent().append("<a class ='siebui-icon-location' href='" + sMapURL + "'target=_blank></a>");
            }
            function fCoverageCheck(sResp, this_t) {
                //$('[aria-label="Customer Type:Coverage Check"]').trigger("click")
                // $('[aria-label="Customer Type Form Applet:Coverage Check"]').trigger("click");
                //$('[name=' + this_t.GetPM().Get("GetControls")["Coverage Check"].GetInputName() + ']').trigger("click");
                var nser = SiebelApp.S_App.GetService("VF BS Process Manager");
                var nInputs = SiebelApp.S_App.NewPropertySet();
                nInputs.SetProperty("Service Name", "VHA Store Pickup Reservation Service BS MOCN");
                nInputs.SetProperty("role", "VCS");
                nInputs.SetProperty("longitude", sResp.address.geometry.coordinates[0]); //??
                nInputs.SetProperty("latitude", sResp.address.geometry.coordinates[1]);
				var sView = SiebelApp.S_App.GetActiveView().GetName();
				if (sView == "VF Capture Customer Details Postpay UNISIM TBUI") {                    
				var vSessionId = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VF Capture Customer Details UNISIM TBC").GetFieldValue("Id");
				}else if (sView == "VF Capture Exst Customer Details Postpay TBUI" || sView == "VF Capture Customer Details – Postpay TBUI"){				
                var vSessionId = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VF Capture Customer Details TBC").GetFieldValue("Id");
				}
                nInputs.SetProperty("SessionId", vSessionId);
                nInputs.SetProperty("Method Name", "CoverageCheck");
                var ROups = nser.InvokeMethod("Run Process", nInputs);
                var CCAppId = this_t.GetPM().Get("GetFullId");
				var s4G,s5G,s5Gsa,s5Gnsa;
                var resultCov = [];
                for (let i = 0; i < ROups.GetChildByType("ResultSet").childArray[1].childArray.length; i++) { 
                    var curPropArr = ROups.GetChildByType("ResultSet").childArray[1].childArray[i].propArray;
                    resultCov.push(curPropArr);
                }
                
				//console.log(resultCov);
				//var suiURL = ROups.childArray[0].childArray[0].childArray[1].childArray[3].childArray[0].propArray.uiUrl;
				var suiURL = SiebelApp.S_App.GetProfileAttr("URL1");
				//SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VF Capture Customer Details TBC").SetFieldValue("Map URL", "https://mapt.vodafone.com.au/VHAMap/apps/retail-vf?lat=-33.52220942&lon=151.19767066&zl=16&device=generic5g");
				if (sView == "VF Capture Customer Details Postpay UNISIM TBUI") {                    
				SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VF Capture Customer Details UNISIM TBC").SetFieldValue("Map URL", suiURL);
				}else if (sView == "VF Capture Exst Customer Details Postpay TBUI" || sView == "VF Capture Customer Details – Postpay TBUI"){				
                SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VF Capture Customer Details TBC").SetFieldValue("Map URL", suiURL);
				}								
                const arrSite = [...new Set(resultCov.map(x => x.Site))];
                var ccpardiv = '<div class="ccNwkpar">';
                var hdrdiv = "";
                console.log(arrSite);
                arrSite.forEach(function (item1, index) {
                    // console.log(index+". "+item);
                    var arrNetwork = resultCov.filter(function (a) {
                        return a.Site == item1;
                    });
                    console.log(arrNetwork);
                    hdrdiv = hdrdiv + '<div class="ccNwkchdmain"><div class="ccNwkhdr" id="ccNwkhdr"' + index + '>' + item1 + '</div><div class="ccNwkchd">';
                    arrNetwork.forEach(function (item2, index) {
                        if (item2.PropName != "") {
                            // console.log(item.PropName+' == '+item.PropValue);
                            switch (item1) {
                            case "4G/5G Home Internet":
                                switch (item2.PropName) {
                                case "is4G":
                                    MapShed.FWA.f4G.is4G = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is5G":
                                    MapShed.FWA.f5G.is5G = item2.PropValue == "true" ? true : false;
                                    break;									
                                case "is5Gsa":
                                    MapShed.FWA.f5GSA.is5Gsa = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is5Gnsa":
                                    MapShed.FWA.f5GNSA.is5Gnsa = item2.PropValue == "true" ? true : false;
                                    break;
                                };
                                break;
                            case "Mobile Coverage": //"mobilestatus":
                                switch (item2.PropName) {
                                case "is5Gindoor":
                                    MapShed.Mobile.m5G.indoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is5Goutdoor":
                                    MapShed.Mobile.m5G.outdoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is5GindoorNsa":
                                    MapShed.Mobile.m5GNSA.indoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is5GoutdoorNsa":
                                    MapShed.Mobile.m5GNSA.outdoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is5GindoorSa":
                                    MapShed.Mobile.m5GSA.indoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is5GoutdoorSa":
                                    MapShed.Mobile.m5GSA.outdoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is4Gindoor":
                                    MapShed.Mobile.m4G.indoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is4Goutdoor":
                                    MapShed.Mobile.m4G.outdoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is4GindoorNsa":
                                    MapShed.Mobile.m4GNSA.indoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is4GoutdoorNsa":
                                    MapShed.Mobile.m4GNSA.outdoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is4GindoorSa":
                                    MapShed.Mobile.m4GSA.indoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is4GoutdoorSa":
                                    MapShed.Mobile.m4GSA.outdoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is3Gindoor":
                                    MapShed.Mobile.m3G.indoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is3Goutdoor":
                                    MapShed.Mobile.m3G.outdoor = item2.PropValue == "true" ? true : false;
                                    break;
                                }
                                break;
                            default:
                                break;
                            }

                            /*if (item2.PropValue == "true")
                            var div = '<div class="ccNwk  btn CoverageCheckActive" id="ccNwk"' + index + '> ' + item2.PropName + '</div>';
                            else
                            var div = '<div class="ccNwk btn CoverageCheckInactive" id="ccNwk"' + index + '> ' + item2.PropName + '</div>';

                            hdrdiv = hdrdiv + div;*/
                        }
                    });
                    var div = "";
                    switch (item1) {
                    case "4G/5G Home Internet":
                        var dVal = MapShed.FWA.f4G.is4G == true ? "4G – Available" : "4G - Not available";
                        var dCls = MapShed.FWA.f4G.is4G == true ? "ccmsGreen" : "ccmsRed";
                        div = div + '<div class="ccNwk  btn ' + dCls + '" id="f4G"> ' + dVal + '</div>';
						s4G = MapShed.FWA.f4G.is4G;
						var s5GShow =  VHAAppUtilities.GetPickListValues("", "[List Of Values.Type]='VHA_COV_TYPE' AND [List Of Values.Name]='FWA5G_SHOW_ICON' AND [List Of Values.Active]='Y'");                            
                        if (s5GShow == "ON")
						{
                        var dVal = MapShed.FWA.f5G.is5G == true ? "5G – Available" : "5G – Not available";
                        var dCls = MapShed.FWA.f5G.is5G == true ? "ccmsGreen" : "ccmsRed";
                        div = div + '<div class="ccNwk  btn ' + dCls + '" id="f5G"> ' + dVal + '</div>';
						s5G = MapShed.FWA.f5G.is5G;
						}

                        var dVal = MapShed.FWA.f5GNSA.is5Gnsa == true ? "5G NSA – Available" : "5G NSA – Not available";
                        var dCls = MapShed.FWA.f5GNSA.is5Gnsa == true ? "ccmsGreen" : "ccmsRed";
                        div = div + '<div class="ccNwk  btn ' + dCls + '" id="f5GNSA"> ' + dVal + '</div>';
						s5Gnsa = MapShed.FWA.f5GNSA.is5Gnsa;
                        break;
                    case "Mobile Coverage": //"mobilestatus":
                        var m = MapShed.Mobile.m3G;
                        var dVal = m.indoor == true && m.outdoor == true ? "3G - Indoor & Outdoor" : m.indoor == false && m.outdoor == true ? "3G - Outdoor Only" : m.indoor == true && m.outdoor == false ? "3G - Indoor Only" : "3G - No coverage";
                        var dCls = m.indoor == true && m.outdoor == true ? "ccmsGreen" : m.indoor == false && m.outdoor == true ? "ccmsOrange" : m.indoor == true && m.outdoor == false ? "ccmsOrange" : "ccmsRed";
                        MapShed.FWA.f4G.is4G == true ? "ccmsGreen" : "ccmsRed";
                        div = div + '<div class="ccNwk  btn ' + dCls + '" id="m3G"> ' + dVal + '</div>';

                        m = MapShed.Mobile.m4G;
                        var dVal = m.indoor == true && m.outdoor == true ? "4G - Indoor & Outdoor" : m.indoor == false && m.outdoor == true ? "4G - Outdoor Only" : m.indoor == true && m.outdoor == false ? "4G - Indoor Only" : "4G - No coverage";
                        var dCls = m.indoor == true && m.outdoor == true ? "ccmsGreen" : m.indoor == false && m.outdoor == true ? "ccmsOrange" : m.indoor == true && m.outdoor == false ? "ccmsOrange" : "ccmsRed";
                        MapShed.FWA.f4G.is4G == true ? "ccmsGreen" : "ccmsRed";
                        div = div + '<div class="ccNwk  btn ' + dCls + '" id="m4G"> ' + dVal + '</div>';
                        /*
                        m=MapShed.Mobile.m4GSA;
                        var dVal = m.indoor==true&&m.outdoor==true?"4G SA - Indoor & Outdoor":m.indoor==false&&m.outdoor==true?"4G SA - Outdoor Only":m.indoor==true&&m.outdoor==false?"4G SA - Indoor Only":"4G SA - No coverage";
                        var dCls = m.indoor==true&&m.outdoor==true?"ccmsGreen":m.indoor==false&&m.outdoor==true?"ccmsOrange":m.indoor==true&&m.outdoor==false?"ccmsOrange":"ccmsRed";
                        MapShed.FWA.f4G.is4G==true?"ccmsGreen":"ccmsRed";
                        div = div + '<div class="ccNwk  btn '+dCls+'" id="m4GSA"> ' + dVal + '</div>';

                        m=MapShed.Mobile.m4GNSA;
                        var dVal = m.indoor==true&&m.outdoor==true?"4G NSA - Indoor & Outdoor":m.indoor==false&&m.outdoor==true?"4G NSA - Outdoor Only":m.indoor==true&&m.outdoor==false?"4G NSA - Indoor Only":"4G NSA - No coverage";
                        var dCls = m.indoor==true&&m.outdoor==true?"ccmsGreen":m.indoor==false&&m.outdoor==true?"ccmsOrange":m.indoor==true&&m.outdoor==false?"ccmsOrange":"ccmsRed";
                        MapShed.FWA.f4G.is4G==true?"ccmsGreen":"ccmsRed";
                        div = div + '<div class="ccNwk  btn '+dCls+'" id="m4GNSA"> ' + dVal + '</div>';
						
                        m = MapShed.Mobile.m5GSA;
                        var dVal = m.indoor == true && m.outdoor == true ? "5G SA - Indoor & Outdoor" : m.indoor == false && m.outdoor == true ? "5G SA - Outdoor Only" : m.indoor == true && m.outdoor == false ? "5G SA - Indoor Only" : "5G SA - No coverage";
                        var dCls = m.indoor == true && m.outdoor == true ? "ccmsGreen" : m.indoor == false && m.outdoor == true ? "ccmsOrange" : m.indoor == true && m.outdoor == false ? "ccmsOrange" : "ccmsRed";
                        MapShed.FWA.f4G.is4G == true ? "ccmsGreen" : "ccmsRed";
                        div = div + '<div class="ccNwk  btn ' + dCls + '" id="m5GSA"> ' + dVal + '</div>';						
						*/
                        m=MapShed.Mobile.m5G;
                        var dVal = m.indoor==true&&m.outdoor==true?"5G - Indoor & Outdoor":m.indoor==false&&m.outdoor==true?"5G - Outdoor Only":m.indoor==true&&m.outdoor==false?"5G - Indoor Only":"5G - No coverage";
                        var dCls = m.indoor==true&&m.outdoor==true?"ccmsGreen":m.indoor==false&&m.outdoor==true?"ccmsOrange":m.indoor==true&&m.outdoor==false?"ccmsOrange":"ccmsRed";
                        MapShed.FWA.f4G.is4G==true?"ccmsGreen":"ccmsRed";
                        div = div + '<div class="ccNwk  btn '+dCls+'" id="m5G"> ' + dVal + '</div>';                        

                        m = MapShed.Mobile.m5GNSA;
                        var dVal = m.indoor == true && m.outdoor == true ? "5G NSA - Indoor & Outdoor" : m.indoor == false && m.outdoor == true ? "5G NSA - Outdoor Only" : m.indoor == true && m.outdoor == false ? "5G NSA - Indoor Only" : "5G NSA - No coverage";
                        var dCls = m.indoor == true && m.outdoor == true ? "ccmsGreen" : m.indoor == false && m.outdoor == true ? "ccmsOrange" : m.indoor == true && m.outdoor == false ? "ccmsOrange" : "ccmsRed";
                        MapShed.FWA.f4G.is4G == true ? "ccmsGreen" : "ccmsRed";
                        div = div + '<div class="ccNwk  btn ' + dCls + '" id="m5GNSA"> ' + dVal + '</div>';

                        break;
                    }
                    hdrdiv = hdrdiv + div;
                    hdrdiv = hdrdiv + '</div></div>';
                    //console.log(hdrdiv);
                });

                console.log(MapShed);
				var nwkmsg ="";
				if (s4G == true || (s5G == true || s5Gnsa == true))
				nwkmsg ="";
				else
				nwkmsg ="";
                //nwkmsg = '<div class="ccNwkMsg">4G and 5G Home Internet services are not currently available at this address. You will not be able to connect these services at this address.</div>';
                ccpardiv = ccpardiv + hdrdiv + nwkmsg + '</div>';
                $("#s_" + CCAppId + "_div div.siebui-collapsible-applet-content").append(ccpardiv);
                //$() get cha
                $('[name=' + this_t.GetPM().Get("GetControls")["Change Address"].GetInputName() + ']').click;
            }
            function GetActiveCreditAppletName() {
                var AppletMap = SiebelApp.S_App.GetActiveView().GetAppletMap();
                var AppletList = ["VF Out of Stock Summary Form Applet - Upgrade TBUI", "VF Out of Stock Summary Form Applet - TBUI", "VHA Out of Stock Summary Form Applet - TBUI HI", "VHA SIM Ordering TBUI Applet"];
                var AppletName = "";
                for (var i = 0; i < AppletList.length; i++) {
                    if (AppletMap[AppletList[i]]) {
                        AppletName = AppletList[i];
                        break;
                    }
                }
                return AppletName;
            }
            function fUncheckPickPrimary() {
                var sFlowName = $('.siebui-applet-taskui-h').html().slice(0, ($('.siebui-applet-taskui-h').html().indexOf('<span class="siebui-taskui-title">')));
                var ShipingApplet = SiebelApp.S_App.GetActiveView().GetApplet(GetActiveCreditAppletName());
                if (ShipingApplet != "" && ShipingApplet != null && GetActiveCreditAppletName() != "VHA SIM Ordering TBUI Applet") {
                    var PM = ShipingApplet.GetPModel();
                    var IntelligentSearchAddressCtrl = $("input[name='" + ShipingApplet.GetControl("VF Intelligence Search Address").GetInputName() + "']");
                    if (SiebelApp.S_App.GetProfileAttr("VHAConnectFBB") != "Y" && sFlowName.search("Pre to Post Transfer") == -1) {
                        var sPickPrimaryControl = ShipingApplet.GetControl("Pick Primary Address");
                        var sPickPrimaryCntrlVal = PM.ExecuteMethod("GetFieldValue", sPickPrimaryControl);
                        if (sPickPrimaryCntrlVal == "Y") {
                            var Inputs = SiebelApp.S_App.NewPropertySet();
                            var Output = SiebelApp.S_App.NewPropertySet();
                            var ser = SiebelApp.S_App.GetService("VF BS Process Manager");
                            Inputs.SetProperty("Service Name", "SIS OM PMT Service");
                            Inputs.SetProperty("Method Name", "Set Profile Attribute");
                            Inputs.SetProperty("Profile Attribute Name", "VHAUncheckPickPrimaryFlag");
                            Inputs.SetProperty("Profile Attribute Value", "Y");
                            var Output = ser.InvokeMethod("Run Process", Inputs);
                            PM.ExecuteMethod("SetFormattedValue", ShipingApplet.GetControl("Pick Primary Address"), "N");
                        }
                    }
                }
            }
            function mSetPrflAttr(name, val) {
                var Inputs = SiebelApp.S_App.NewPropertySet();
                var Output = SiebelApp.S_App.NewPropertySet();
                var ser = SiebelApp.S_App.GetService("VF BS Process Manager");
                Inputs.SetProperty("Service Name", "SIS OM PMT Service");
                Inputs.SetProperty("Method Name", "Set Profile Attribute");
                Inputs.SetProperty("Profile Attribute Name", name);
                Inputs.SetProperty("Profile Attribute Value", val);
                var Output = ser.InvokeMethod("Run Process", Inputs)
            }

    return VHACaptureCustomerDetailsAppletPR;
   }()
  );
  return "SiebelAppFacade.VHACaptureCustomerDetailsAppletPR";
 })
}

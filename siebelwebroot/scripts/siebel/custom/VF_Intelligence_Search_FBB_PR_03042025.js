if (typeof (SiebelAppFacade.VF_Intelligence_Search_FBB_PR) === "undefined") {

	SiebelJS.Namespace("SiebelAppFacade.VF_Intelligence_Search_FBB_PR");
	define("siebel/custom/VF_Intelligence_Search_FBB_PR", ["siebel/phyrenderer"],
		function () {
			SiebelAppFacade.VF_Intelligence_Search_FBB_PR = (function () {
				
				var OrgName = SiebelApp.S_App.GetProfileAttr("VHANewOrg");
				
				
				function VF_Intelligence_Search_FBB_PR(pm) {
					SiebelAppFacade.VF_Intelligence_Search_FBB_PR.superclass.constructor.apply(this, arguments);
					//Chitra Added for upgarde OUI SQ availablity change
					this.GetPM().AttachPostProxyExecuteBinding("SiteQualification", SiteQualification, {
						scope: this,
						sequence: false
					});
					this.GetPM().AttachPostProxyExecuteBinding("ChangeAddress", SiteQualification, {
						scope: this,
						sequence: false
					});
				}

				SiebelJS.Extend(VF_Intelligence_Search_FBB_PR, SiebelAppFacade.PhysicalRenderer);
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

				VF_Intelligence_Search_FBB_PR.prototype.Init = function () {
					SiebelAppFacade.VF_Intelligence_Search_FBB_PR.superclass.Init.apply(this, arguments);
					this.GetPM().AddMethod("FieldChange", OnFieldChange, { sequence: false, scope: this });
				}

				VF_Intelligence_Search_FBB_PR.prototype.ShowUI = function () {
					SiebelAppFacade.VF_Intelligence_Search_FBB_PR.superclass.ShowUI.apply(this, arguments);
										
					$('#Address_Label_5').parents('td').attr('colspan','1');
					$('#Opticomm_Label_5').parents('td').attr('colspan','1');
					$('#Vision_Label_5').parents('td').attr('colspan','1');
					$('#NBN_Label_5').parents('td').attr('colspan','1');
					$('.siebui-icon-changeaddress').parents('td').attr('colspan','1');
					$('#PreferredWholesaler_Label_5').parents('td').attr('colspan','1');
					$('#Planned_Serviceability_Date_Label_5').parents('td').attr('colspan','1');
					$('#Customer_Authorization_Taken_Label_5').parents('td').attr('colspan','1');
					$('input[aria-labelledby="NBN_Label_5"]').parents('td').attr('colspan','1');
					$('input[aria-labelledby="Available_Wholesalers_Label_5"]').parents('td').attr('colspan','1');
					$('input[aria-label="Address"]').parents('td').attr('colspan','4');
					$('input[aria-labelledby="Access_Technology_Label_5"]').parents('td').next().remove();
					$('input[aria-labelledby="New_Development_Charge_Label_5"]').parents('td').next().remove();
					$('input[aria-labelledby="Customer_Authorization_Taken_Label_5"]').parents('td').next().remove()
					
					var SQAvailability2;
					var t_this = this;
					setTimeout(function () {
						var controls = t_this.GetPM().Get("GetControls");
						//Added for Nov Release 2020
						var sMSISDNA, vSQId, sEntitlementName, sCheckBusiness, sCustName, sMSISDN;
						if (SiebelApp.S_App.GetProfileAttr("TBUIPostExstCust") == "N") {
							SiebelApp.S_App.SetProfileAttr("SendSMSY", "");
							SiebelApp.S_App.SetProfileAttr("sMSISDNPC", "");

						}
						var sSendNBNSQSMS = SiebelApp.S_App.GetProfileAttr("SendSMSY");
						if (sSendNBNSQSMS == "SendQASSMS") {
							$('#NBN_Send_SMS1_Label').show();
							
						}
						else {
							$('#NBN_Send_SMS1_Label').hide();
							
						}

						var SessionApplet1 = SiebelApp.S_App.GetActiveView().GetApplet("VF Task Session Form Applet – TBUI");
						var sAccountId = SessionApplet1.GetBusComp().GetFieldValue("Customer Row Id");
						var OrgName = SiebelApp.S_App.GetProfileAttr("VHANewOrg");
						
						if (SiebelApp.S_App.GetProfileAttr("TBUIPostExstCust") != "N" && (sAccountId != null || sAccountId != "")) {

							var Inputs = SiebelApp.S_App.NewPropertySet();
							var Outs = SiebelApp.S_App.NewPropertySet();
							Inputs.SetProperty("Account Id", sAccountId);
							Outs = VHAAppUtilities.CallBS(
								"VF Postpay Utilities TBUI", "GetPrimaryContactNumber",
								Inputs, {}
							);
							sMSISDN = Outs.GetProperty("Home Phone");
							sCustName = Outs.GetProperty("FirstName");
							SiebelApp.S_App.SetProfileAttr("sCustName1", sCustName);
							SiebelApp.S_App.SetProfileAttr("sMSISDNPC", sMSISDN);
						}
						/*$("input[name="+controls["NBN Location Id"].GetInputName()+"]").addClass("VFDisplayNone");
						$("#NBN_Location_Id_Label").parent().addClass("VFDisplayNone");*/ 
						if (SiebelApp.S_App.GetProfileAttr("TBUIPostExstCust") == "Y") {
							$("input[name='" + controls["Address"].GetInputName() + "']").after('<img class="VHANBNValidate" src="images/custom/motion-sensor-hi.png"></img>');
							//$("input[name='" + controls["Address"].GetInputName() + "']").after('<img class="VHANBNValidate" src="images/custom/VHA_Logo.svg"></img>');

						}
						if (!($("#" + controls["Check NBN Address"].GetInputName() + "_Ctrl").hasClass("VFDisplayNone"))) {
							$("#" + controls["Check NBN Address"].GetInputName() + "_Ctrl").addClass("VFDisplayNone");
							$("#" + controls["Site Qualification"].GetInputName() + "_Ctrl").addClass("VFDisplayNone");
							//Madhu-01Jan2020- Two dummy controls in more mode to enable applet toggle
							$('#NBN_Location_Id_Label_' + t_this.GetPM().Get("GetId")).closest('td').hide();
							$('#NBN_Location_Id_Label_' + t_this.GetPM().Get("GetId")).closest('td').next('td').hide();

							//Chitra Added for upgarde OUI SQ availablity change
							var sAIN = SiebelApp.S_App.GetActiveView().GetActiveApplet().GetId();
							var SQAvailability = $('[aria-labelledby="Can_Custoemr_Get_NBN_Label_'+sAIN+'"]').val();
							if (SQAvailability == "Yes") {
								$('[aria-labelledby="Can_Custoemr_Get_NBN_Label_'+sAIN+'"]').addClass('VHAActiveBorderColour').removeClass('VHAInactiveBorderColour');
							}
							else if (SQAvailability == "No") {
								$('[aria-labelledby="Can_Custoemr_Get_NBN_Label_'+sAIN+'"]').removeClass('VHAActiveBorderColour').addClass('VHAInactiveBorderColour');
							}
							else {
								$('[aria-labelledby="Can_Custoemr_Get_NBN_Label_'+sAIN+'"]').removeClass('VHAActiveBorderColour').removeClass('VHAInactiveBorderColour');
							}

							var sView = SiebelApp.S_App.GetActiveView().GetName();
							//$('[aria-labelledby*="WSDL_"]').not('[aria-labelledby="WSDL_Address_Label"]').closest('td').parent().css("display", "none");
							//$('[aria-labelledby*="WSDL_"]').not('[aria-labelledby="WSDL_Address_Label"]').closest('td').css("display","none");
							//$('[id*="WSDL_"]').not('[id="WSDL_Address_Label"]').closest('td').css("display","none");
							//$('[aria-labelledby="Address_Label"]').parent().find('img').remove();
							//$('[aria-labelledby="Address_Label"]').parent().find('img').remove();/*Keerthana - Commented to fix upgrade issue in IP18- 14/03/2019*/
							//$('[aria-labelledby="Address_Label"]').parent().find(".siebui-icon-pick").remove(); /*Keerthana - Added to fix upgrade issue in IP18- 14/03/2019*/
							$('[name='+t_this.GetPM().Get("GetControls")["Address"].GetInputName()+']').parent().find(".siebui-icon-pick").remove(); /*Keerthana - Added to fix upgrade issue in IP18- 14/03/2019*/
							$('[title="Show Available"]').hide();
							if(SiebelApp.S_App.GetProfileAttr("ManageServicesSubType") == "Change Technology")
							{
								$('[title="Clear"]').hide();
								$('[aria-label="Connection Address"]').parents('tr').next('tr').hide();
								
								//var sId = this.GetPM().Get("GetId");
								//$('#VHA_NBN_Retrieve_Plans_Label_'+sId+'').hide();
								$('#VHA_NBN_Retrieve_Plans_Label_4').hide();
								$('[aria-label = "Retrieve NBN Business Plans Only?"]').hide();

							}
							//$('[aria-labelledby="Cal_Full_Address_Label"]').parent().parent().parent().hide();
							//Chitra Added for upgarde OUI SQ availablity change
							$('#NBN_Address_Information_Label_' + t_this.GetPM().Get("GetId")).parent().parent().parent().parent().parent().parent().before("<div class = 'VHANBNAddreSection'><div class='VHANBNPageLabel VHANBNAddressLabel'>NBN Address Information</div><div class='VHANBNPageLabel VHANBNAddressSearchLabel'>Address Search Results</div></div>");
							$('#Service_Request_Label').parent().parent().parent().parent().parent().parent().before("<div class = 'VHANBNSRSection'><div class='VHANBNPageLabel VHANBNSRLabel'>Service Request(When NBN Address is not available)</div></div>");
							$('#Capture_Lead_Details_Label').parent().parent().parent().parent().parent().parent().before("<div class = 'VHANBNSRSection'><div class='VHANBNPageLabel VHANBNLeadLabel'>Capture Lead Details (In case Site/Address is not in NBN/VHA footprint or Customer not interested)</div></div>");
							$('#Site_Qualilfication_Label_' + t_this.GetPM().Get("GetId")).parent().parent().parent().parent().parent().parent().before("<div class='VHANBNPageLabel VHANBNSQLabel'>NBN Availability Status<div class='siebui-applet-container siebui-collapsible siebui-collapsible-applet-container VHASQExpandCollapse'><span class='siebui-button-secondary siebui-btn-icon-expanded VHASQInfoexpand VHADisplayblock'><a href='javascript:void()' role='link' tabindex='0' aria-label='NBNSQ:Expand Applet'></a></span><span class='siebui-button-secondary siebui-btn-icon-collapsed VHASQInfocollapse VHADisplaynone'><a href='javascript:void()' role='link' tabindex='0' aria-label='NBN:Collapse Applet'></a></span></div></div>");
							if ($('.VHANBNOrderInfoLabel').length == 0) $('#Order_Information_Label').parent().parent().parent().parent().parent().parent().before("<div class='VHANBNPageLabel VHANBNOrderInfoLabel'>Order Information<div class='siebui-applet-container siebui-collapsible siebui-collapsible-applet-container VHAOrderExpandCollapse'><span class='siebui-button-secondary siebui-btn-icon-expanded VHAOrderInfoexpand VHADisplayblock'><a href='javascript:void()' role='link' tabindex='0' aria-label='NBNSQ:Expand Applet'></a></span><span class='siebui-button-secondary siebui-btn-icon-collapsed VHAOrderInfocollapse VHADisplaynone'><a href='javascript:void()' role='link' tabindex='0' aria-label='NBN:Collapse Applet'></a></span></div></div>");
							else {
								$('.VHAOrderInfocollapse').addClass("VHADisplaynone").removeClass("VHADisplayblock");
								$('.VHAOrderInfoexpand').addClass("VHADisplayblock").removeClass("VHADisplaynone");
							}
							$('#NBN_Address_Information_Label_' + t_this.GetPM().Get("GetId")).parent().hide();
							$('#Address_Search_Results_Label_' + t_this.GetPM().Get("GetId")).parent().hide();
							$('#Site_Qualilfication_Label_' + t_this.GetPM().Get("GetId")).parent().hide();
							$('#Order_Information_Label').parent().hide();
							$('#Service_Request_Label').parent().hide();
							$('#Capture_Lead_Details_Label').parent().hide();

							var BO = SiebelApp.S_App.GetActiveBusObj();
							var BC = BO.GetBusCompByName("VHA Site Qualification BC");
							var Id = BC.GetFieldValue("Id");
							if (Id == "") {
								/*$("#Site_Qualilfication_Label").parent().parent().parent().parent().siblings().hide();*/
								$('.VHANBNSQLabel').siblings().hide();
								$('.VHANBNOrderInfoLabel').siblings().hide();
								//$('[title="Service List List Applet"]').parent().hide();
								$('[title="Service List"]').siblings().hide();
							}
							else {
								$('.VHASQInfoexpand').addClass("VHADisplaynone").removeClass("VHADisplayblock");
								$('.VHASQInfocollapse').addClass("VHADisplayblock").removeClass("VHADisplaynone");
								$('.VHAOrderInfocollapse').addClass("VHADisplayblock").removeClass("VHADisplaynone");
								$('.VHAOrderInfoexpand').addClass("VHADisplaynone").removeClass("VHADisplayblock");
							}

							$('.VHANBNAddreSection').next('table').find('.siebui-icon-bttns_more').addClass("VHADisplaynone");//SIT mANI
							//$(".siebui-icon-bttns_more").addClass("VHADisplaynone");//SIT mANI	

							var sViewName = SiebelApp.S_App.GetProfileAttr("ViewName");
							var sView = SiebelApp.S_App.GetActiveView().GetName();
							if ("" + sView == "VHA NBN Site Qualification Postpay TBUI") {

								//$('[aria-labelledby="Refine_Address_Search_Label"]').css("border","none !important");
								//  Madhu;08May19;Commenting this code block as thi control is no longer used
								//$('[aria-labelledby="Refine_Address_Search_Label"]') replaced by $('[name='+t_this.GetPM().Get("GetControls")["Refine Address Search"].GetInputName()+']')
								$('[name='+t_this.GetPM().Get("GetControls")["Refine Address Search"].GetInputName()+']').addClass("vha_remove_border");
								$('[name='+t_this.GetPM().Get("GetControls")["Refine Address Search"].GetInputName()+']').next('.siebui-icon-pick').css("border", "none");
								$('[name='+t_this.GetPM().Get("GetControls")["Refine Address Search"].GetInputName()+']').css("width", "0px");
								$('[name='+t_this.GetPM().Get("GetControls")["Refine Address Search"].GetInputName()+']').css("height", "0px");
								$('[name='+t_this.GetPM().Get("GetControls")["Refine Address Search"].GetInputName()+']').css("padding", "7px");
								$('[name='+t_this.GetPM().Get("GetControls")["Refine Address Search"].GetInputName()+']').css("padding-top", "0px");
								$('[name='+t_this.GetPM().Get("GetControls")["Refine Address Search"].GetInputName()+']').css("padding-bottom", "0px");
								// Balamurugan - 04May2020 - QAStoPSMA - Commented lines from 123 to 217
								/*$('[aria-labelledby="Address_Label"]').autocomplete({
									source : function (request, response) {
										//VHAAppUtilities.DisplaySpinner($("input[name='"+controls["Address"].GetInputName()+"']"));
										$('img.VHANBNValidate').addClass("VFDisplayNone");
										var service = SiebelApp.S_App.GetService("QAS WSDL");
										var inPS = SiebelApp.S_App.NewPropertySet();
										var sValue = $('[aria-labelledby="Address_Label"]').val();
										inPS.SetProperty("SearchString", sValue);
										if (service) {
											var outPS = service.InvokeMethod("DoSearchProxy", inPS);
											var resultSet = outPS.GetChild(0);
											var addrCount = resultSet.GetChildCount();
											var addrArray = [];
											if (resultSet) {
												for (var i = 0; i < addrCount; i++) {
													addrArray.push(resultSet.GetChild(i).GetProperty("QAS Wsdl Address") + "~^" + resultSet.GetChild(i).GetProperty("QAS Wsdl Moniker"));
												}
											}
											//Added for PKE fix - Chitra
											var Inputs = SiebelApp.S_App.NewPropertySet();
											var Output = SiebelApp.S_App.NewPropertySet();
											var ser = SiebelApp.S_App.GetService("VF BS Process Manager");
											Inputs.SetProperty("Service Name", "SIS OM PMT Service");
											Inputs.SetProperty("Method Name", "Set Profile Attribute");
											Inputs.SetProperty("Profile Attribute Name", "QAS Query Executed");
											Inputs.SetProperty("Profile Attribute Value", "Y");
											
											var Output = ser.InvokeMethod("Run Process", Inputs);
										}
										response($.map(addrArray, function (item, id) {
												//VHAAppUtilities.HideSpinner();
												var res = item.split("~^");
												return {
													value : res[0],
													id : res[1]
												}
											}));
									},
									minLength : 10,
									appendTo: $('[aria-labelledby="Address_Label"]').parent(),
									select : function (event, ui) {
										var sPickAddr = ui.item.value;
										var sMonikerval = ui.item.id;
										var service = SiebelApp.S_App.GetService("QAS WSDL");
										var inPS = SiebelApp.S_App.NewPropertySet();
										inPS.SetProperty("PickMoniker", sMonikerval);
										inPS.SetProperty("PickFullAddr", sPickAddr);
										if (service) {
											//VHAAppUtilities.DisplaySpinner($("input[name='"+controls["Address"].GetInputName()+"']"));
											var outPS = service.InvokeMethod("GetAddressPostpayOUI", inPS);
											var resultSet = outPS.GetChild(0).GetChild(0);
			
											var sPickFullAddr = resultSet.GetProperty("QAS Wsdl Address");
											var sUnitType = resultSet.GetProperty("Floor Type");
											var sUnitNumber = resultSet.GetProperty("Floor");
											var sBuildingName = resultSet.GetProperty("Address Building");
											var sBuildingNumber = resultSet.GetProperty("Street Number");
											var sStreetName = resultSet.GetProperty("Street Name");
											var sStreetType = resultSet.GetProperty("Street Type");
											var sSuburb = resultSet.GetProperty("Suburb");
											var sState = resultSet.GetProperty("State");
											var sPostcode = resultSet.GetProperty("Post Code");
											var sCountry = resultSet.GetProperty("Country");
											var sDPID = resultSet.GetProperty("DPID");
											var WSDLValidationStatus = resultSet.GetProperty("Validation Status");
											var WSDLAddressType = resultSet.GetProperty("Address Type");
											var WSDLPOBox = resultSet.GetProperty("PO Box");
											var WSDLPrivateBag = resultSet.GetProperty("Private Bag");
			
											var sservice = SiebelApp.S_App.GetService("QAS WSDL");
											var inpPS = SiebelApp.S_App.NewPropertySet();
											var outpPS = SiebelApp.S_App.NewPropertySet();
											inpPS.SetProperty("sPickFullAddr", sPickFullAddr);
											inpPS.SetProperty("sUnitType", sUnitType);
											inpPS.SetProperty("sUnitNumber", sUnitNumber);
											inpPS.SetProperty("sBuildingName", sBuildingName);
											inpPS.SetProperty("sBuildingNumber", sBuildingNumber);
											inpPS.SetProperty("sStreetName", sStreetName);
											inpPS.SetProperty("sStreetType", sStreetType);
											inpPS.SetProperty("sSuburb", sSuburb);
											inpPS.SetProperty("sState", sState);
											inpPS.SetProperty("sPostcode", sPostcode);
											inpPS.SetProperty("sCountry", sCountry);
											inpPS.SetProperty("sDPID", sDPID);
											inpPS.SetProperty("WSDLAddressType", WSDLAddressType);
											inpPS.SetProperty("WSDLPOBox", WSDLPOBox);
											inpPS.SetProperty("WSDLPrivateBag", WSDLPrivateBag);
			
											outpPS = sservice.InvokeMethod("UpdateAddressPostpayOUI", inpPS);
																	
											TriggerNBNAddress (sSuburb,sStreetName,sStreetType,sBuildingName,sUnitType,sUnitNumber,sBuildingNumber,sPostcode,sState)
										}
									}
			
								});*/
								if(SiebelApp.S_App.GetProfileAttr("ManageServicesSubType") != "Change Technology"){
									$('[aria-label="Connection Address"]').removeAttr('readonly')
								}

								if(SiebelApp.S_App.GetProfileAttr("TBUIPostExstCust") == "Y" && SiebelApp.S_App.GetProfileAttr("ManageServicesSubType") == "Change Technology" && SiebelApp.S_App.GetProfileAttr("COTPSMASingleCall") == "COTPSMASingleCall")
								{
								TriggerNBNAddress();
								}

								$('[name='+t_this.GetPM().Get("GetControls")["Address"].GetInputName()+']').autocomplete({
									source: function (request, response) {
										$('img.VHANBNValidate').addClass("VFDisplayNone");
										var sResp = VHAAppUtilities.doSearchAddress(request, "physical");
										if (sResp != false) {
											response(sResp);
										}
										else { // when error/message/fault
											response([]);
										}
										mSetPrflAttr("QAS Query Executed", "Y");
									},
									minLength: 10,
									select: function (event, ui) {
										var sResp = VHAAppUtilities.getAddress(ui);
										if (sResp != false) {
											var sAddrAllowedFlg = 'Y';
											$.map(sResp.address.properties, function (i, j) {
												if (j == "postal_delivery_type" && i != null && i != "") {
													sAddrAllowedFlg = 'N';
												}
											});
											if (sAddrAllowedFlg == "Y") {
												var Inputs = SiebelApp.S_App.NewPropertySet();
												Inputs.SetProperty("ViewName", SiebelApp.S_App.GetActiveView().GetName());
												Inputs.SetProperty("Action", "UpdateTBCAddress");
												VHAAppUtilities.updateAddress(sResp, Inputs);
												SiebelApp.S_App.SetProfileAttr("SkipGeo","");
												TriggerNBNAddress();
												//fCoverageCheck(sResp, t_this);
											//SiebelApp.S_App.GetActiveView().GetApplet("VHA SQ Service List Applet TBUI").InvokeMethod("Refresh");
											}
											else {
												$('[name='+t_this.GetPM().Get("GetControls")["Address"].GetInputName()+']').val("");
												alert("Invalid Address Type. Address must have type as Street or Rural.");
												return false;
											}
										}
										$('div[aria-label="Service List in Order Information"] .siebui-applet').show();
										// Start -> Santhoshb added for NBN 06/02/2025
										var AvcIdLabelHide = $("#Access_Service_ID_\\(AVC_ID\\)_Label_5");
										var AvcIdTextHide = $('input[aria-labelledby="Access_Service_ID_(AVC_ID)_Label_5"]').parent();					AvcIdLabelHide.hide()
										AvcIdTextHide.hide()
										$("#Site_Restriction_Label_5").addClass("VHADisplaynone");
										$('textarea[aria-label="Site Restriction"]').addClass('VHADisplaynone');
										// End -> Santhoshb added for NBN 06/02/2025
									}
								});
								var NBNcheckbox = $('input[aria-label="NBN"]');
									NBNcheckbox.on("change",function(){
										if(this.checked){
											SiebelApp.S_App.SetProfileAttr("OverrideNetwork","NBN");
											var locationID = SiebelApp.S_App.GetActiveBusObj('Order Entry (Sales)').GetBusCompByName('VHA Site Qualification BC').GetFieldValue('NBN Location Id');
											updateSelectedNBNAddress(locationID);
										}
								});
								var NBNcheckbox = $('input[aria-label="OPTICOMM"]');
									NBNcheckbox.on("change",function(){
										if(this.checked){
											SiebelApp.S_App.SetProfileAttr("OverrideNetwork","Opticomm");
											var locationID = SiebelApp.S_App.GetActiveBusObj('Order Entry (Sales)').GetBusCompByName('VHA Site Qualification BC').GetFieldValue('Opticomm Location Id');
											updateSelectedNBNAddress(locationID);
										}
								});
								var NBNcheckbox = $('input[aria-label="VISION"]');
									NBNcheckbox.on("change",function(){
										if(this.checked){
											SiebelApp.S_App.SetProfileAttr("OverrideNetwork","Vision");
											var locationID = SiebelApp.S_App.GetActiveBusObj('Order Entry (Sales)').GetBusCompByName('VHA Site Qualification BC').GetFieldValue('Vision Location Id');
											updateSelectedNBNAddress(locationID);
										}
								});
							}
							//manikandan- for task pane auto close
							//$(".siebui-icon-bttns_more").addClass("VHADisplaynone");
							$('.VHANBNAddreSection').next('table').find('.siebui-icon-bttns_more').addClass("VHADisplaynone");
						}
					}, 1);
				}
				function fCoverageCheck(sResp, this_t) {
                //$('[aria-label="Customer Type:Coverage Check"]').trigger("click")
                // $('[aria-label="Customer Type Form Applet:Coverage Check"]').trigger("click");
                //$('[name=' + this_t.GetPM().Get("GetControls")["Coverage Check"].GetInputName() + ']').trigger("click");
                var nser = SiebelApp.S_App.GetService("VF BS Process Manager");
                var nInputs = SiebelApp.S_App.NewPropertySet();
                nInputs.SetProperty("Service Name", "VF Test");
                nInputs.SetProperty("role", "VCS");
                nInputs.SetProperty("longitude", sResp.address.geometry.coordinates[0]);
                //??
                nInputs.SetProperty("latitude", sResp.address.geometry.coordinates[1]);
                var sView = SiebelApp.S_App.GetActiveView().GetName();
                if (sView == "VF Capture Customer Details Postpay UNISIM TBUI") {
                    var vSessionId = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VF Capture Customer Details UNISIM TBC").GetFieldValue("Id");
                } else if (sView == "VF Capture Exst Customer Details Postpay TBUI" || sView == "VHA NBN Site Qualification Postpay TBUI") {
                    var vSessionId = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VF Capture Customer Details TBC").GetFieldValue("Id");
                }
                nInputs.SetProperty("SessionId", vSessionId);
                nInputs.SetProperty("Method Name", "SQCoverageCheck");
                var ROups = nser.InvokeMethod("Run Process", nInputs);
                var CCAppId = this_t.GetPM().Get("GetFullId");
                var s4G, s5G, s5Gsa, s5Gnsa;
                var resultCov = [];
                for (let i = 0; i < ROups.GetChildByType("ResultSet").childArray[0].childArray.length; i++) {
                    var curPropArr = ROups.GetChildByType("ResultSet").childArray[0].childArray[i].propArray;
                    resultCov.push(curPropArr);
                }

                //console.log(resultCov);
                //var suiURL = ROups.childArray[0].childArray[0].childArray[1].childArray[3].childArray[0].propArray.uiUrl;
                /*var suiURL = SiebelApp.S_App.GetProfileAttr("URL1");
                //SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VF Capture Customer Details TBC").SetFieldValue("Map URL", "https://mapt.vodafone.com.au/VHAMap/apps/retail-vf?lat=-33.52220942&lon=151.19767066&zl=16&device=generic5g");
                if (sView == "VF Capture Customer Details Postpay UNISIM TBUI") {
                    SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VF Capture Customer Details UNISIM TBC").SetFieldValue("Map URL", suiURL);
                } else if (sView == "VF Capture Exst Customer Details Postpay TBUI" || sView == "VF Capture Customer Details � Postpay TBUI") {
                    SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VF Capture Customer Details TBC").SetFieldValue("Map URL", suiURL);
                }*/
				
                const arrSite = [...new Set(resultCov.map(x=>x.Site))];
                var ccpardiv = '<div class="ccNwkpar">';
                var hdrdiv = "";
                console.log(arrSite);
                arrSite.forEach(function(item1, index) {
                    // console.log(index+". "+item);
                    var arrNetwork = resultCov.filter(function(a) {
                        return a.Site == item1;
                    });
                    console.log(arrNetwork);
                    hdrdiv = hdrdiv + '<div class="ccNwkchdmain"><div class="ccNwkhdr" id="ccNwkhdr"' + index + '>' + item1 + '</div><div class="ccNwkchd">';
                    arrNetwork.forEach(function(item2, index) {
                        if (item2.PropName != "") {
                            // console.log(item.PropName+' == '+item.PropValue);
                            switch (item1) {
                            case "fwastatus":
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
                                }
                                ;break;
                            case "Mobile Coverage":
                                //"mobilestatus":
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
                    case "fwastatus":
                        var dVal = MapShed.FWA.f4G.is4G == true ? "4G - Available" : "4G - Not available";
                        var dCls = MapShed.FWA.f4G.is4G == true ? "ccmsGreen" : "ccmsRed";
                        div = div + '<div class="ccNwk  btn ' + dCls + '" id="f4G"> ' + dVal + '</div>';
                        s4G = MapShed.FWA.f4G.is4G;
                        var s5GShow = VHAAppUtilities.GetPickListValues("", "[List Of Values.Type]='VHA_COV_TYPE' AND [List Of Values.Name]='FWA5G_SHOW_ICON' AND [List Of Values.Active]='Y'");
                        if (s5GShow == "ON") {
                            var dVal = MapShed.FWA.f5G.is5G == true ? "5G - Available" : "5G - Not available";
                            var dCls = MapShed.FWA.f5G.is5G == true ? "ccmsGreen" : "ccmsRed";
                            div = div + '<div class="ccNwk  btn ' + dCls + '" id="f5G"> ' + dVal + '</div>';
                            s5G = MapShed.FWA.f5G.is5G;
                        }

                        var dVal = MapShed.FWA.f5GNSA.is5Gnsa == true ? "5G NSA - Available" : "5G NSA - Not available";
                        var dCls = MapShed.FWA.f5GNSA.is5Gnsa == true ? "ccmsGreen" : "ccmsRed";
                        div = div + '<div class="ccNwk  btn ' + dCls + '" id="f5GNSA"> ' + dVal + '</div>';
                        s5Gnsa = MapShed.FWA.f5GNSA.is5Gnsa;
                        break;
                    case "Mobile Coverage":
                        //"mobilestatus":
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
                        
                        m = MapShed.Mobile.m5G;
                        var dVal = m.indoor == true && m.outdoor == true ? "5G - Indoor & Outdoor" : m.indoor == false && m.outdoor == true ? "5G - Outdoor Only" : m.indoor == true && m.outdoor == false ? "5G - Indoor Only" : "5G - No coverage";
                        var dCls = m.indoor == true && m.outdoor == true ? "ccmsGreen" : m.indoor == false && m.outdoor == true ? "ccmsOrange" : m.indoor == true && m.outdoor == false ? "ccmsOrange" : "ccmsRed";
                        MapShed.FWA.f4G.is4G == true ? "ccmsGreen" : "ccmsRed";
                        div = div + '<div class="ccNwk  btn ' + dCls + '" id="m5G"> ' + dVal + '</div>';

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
                var nwkmsg = "";
                if (s4G == true || (s5G == true || s5Gnsa == true))
                    nwkmsg = "";
                else
                    nwkmsg = "";
                //nwkmsg = '<div class="ccNwkMsg">4G and 5G Home Internet services are not currently available at this address. You will not be able to connect these services at this address.</div>';
                ccpardiv = ccpardiv + hdrdiv + nwkmsg + '</div>';
                //$("#s_" + CCAppId + "_div div.siebui-collapsible-applet-content").append(ccpardiv);
				$("#"+CCAppId).next().find('.siebui-collapsible-applet-content').append(ccpardiv);
                //$() get cha
                $('[name=' + this_t.GetPM().Get("GetControls")["Change Address"].GetInputName() + ']').click;
				//$('.ccNwkpar').remove();
            }
				function mCamelCase(str) {
					var sWrdsArr = str.split(' ');
					str = "";
					$.each(sWrdsArr, function (ind, val) {
						if (ind != 0)
							str = str + " " + val[0].toUpperCase() + val.toLowerCase().substring(1);
						else
							str = str + val[0].toUpperCase() + val.toLowerCase().substring(1);
					});
					return str;
				}
				function OnFieldChange(control, value) {
					if (control.GetName() == "Address" && value == "") {
						$('img.VHANBNValidate').addClass("VFDisplayNone");
						$('.ccNwkpar').remove();
						SiebelApp.S_App.SetProfileAttr("Cleared","Y");
					}
				}
				//Added for Nov Release 2020
				function TriggerNBNAddressSMS(sMSISDNA) {
					var psInputs2 = SiebelApp.S_App.NewPropertySet();
					var psOutputs2 = SiebelApp.S_App.NewPropertySet();
					psInputs2.SetProperty("System Preference Name", "VHA Send NBN SMS");
					psOutputs2 = VHAAppUtilities.CallBS(
						"VF Get System Preference", "Get System Preference",
						psInputs2, {}
					);

					var sEntitlementName = psOutputs2.GetProperty("System Preference Comments");
					var sTiming = psOutputs2.GetProperty("System Preference Value");
					if (sTiming == "Business Hours") {
						sCheckBusiness = "Y";
					}
					else {
						sCheckBusiness = "N";
					}
					var sWFBS = "Workflow Process Manager";
					var psInput1 = SiebelApp.S_App.NewPropertySet();
					var psOutput2 = SiebelApp.S_App.NewPropertySet();
					psInput1.SetProperty("ProcessName", "VHA Send SMS/Email Workflow");
					psInput1.SetProperty("Notifiation Method", "TXT");
					psInput1.SetProperty("MSISDN", sMSISDNA);
					psInput1.SetProperty("Object Id", getSessionId());
					psInput1.SetProperty("ActivityCreationRequired", "N");
					psInput1.SetProperty("SMS Template Name", sEntitlementName);
					psInput1.SetProperty("SourceBusObj", "VHA NBN Address SMS BO");
					psInput1.SetProperty("CheckBusinessHours", sCheckBusiness);
					SiebelApp.S_App.SetProfileAttr("SMSSendInp", sEntitlementName + sCheckBusiness + sMSISDNA);
					psOutput2 = VHAAppUtilities.CallBS(
						"Workflow Process Manager", "RunProcess",
						psInput1, {}
					);
					

					var sErrorCode = psOutput2.GetProperty("Error Code");

					return (sErrorCode);
				}
				//ends Nov Release Code
				function TriggerNBNAddress() {
					var service = SiebelApp.S_App.GetService("QAS WSDL");
					var inPS = SiebelApp.S_App.NewPropertySet();
					if (service) {
						var outPS = service.InvokeMethod("QueryTBC", inPS);
						var resultSet = outPS.GetChild(0).GetChildByType("QueryFieldValues");
						var sSuburb = resultSet.GetProperty("sSuburb");
						var sStreetName = resultSet.GetProperty("sStreetName");
						var sStreetType = resultSet.GetProperty("sStreetType");
						var sBuildingName = resultSet.GetProperty("sBuildingName");
						var sUnitType = resultSet.GetProperty("sUnitType");
						var sUnitNumber = resultSet.GetProperty("sUnitNumber");
						var sBuildingNumber = resultSet.GetProperty("sBuildingNumber");
						var sPostcode = resultSet.GetProperty("sPostcode");
						var sState = resultSet.GetProperty("sState");
						var sInterfaceCallBS = "Workflow Process Manager";
						//var WFProcessName = "VHA Generic VBC";
					    var WFProcessName = "VHA OneSQ REST API Process";
						var BOMap = "VHA VBC Generic";
						var BO = "VHA VBC Generic";
						var BCMap = "List Of Values";
						var BC = "VF Transaction Settings";
						var sIntCallInputs = SiebelApp.S_App.NewPropertySet();
						var sIntCallOutputs = SiebelApp.S_App.NewPropertySet();

						var ser = SiebelApp.S_App.GetService(sInterfaceCallBS);
						//var propName = Inputs.GetFirstProperty();
						sIntCallInputs.SetProperty("Service Name", sInterfaceCallBS);
						sIntCallInputs.SetProperty("Method Name", "Run Process");


						//sIntCallInputs.SetProperty("SessionId",sessionId);
						sIntCallInputs.SetProperty("ProcessName", WFProcessName);
						sIntCallInputs.SetProperty("BusObjectMap", BOMap);
						sIntCallInputs.SetProperty("BusObject", BO);
						sIntCallInputs.SetProperty("BusCompMap", BCMap);
						sIntCallInputs.SetProperty("BusComp", BC);
						sIntCallInputs.SetProperty("ManualSearch", 'Y');
						//sIntCallInputs.SetProperty("TransactionName", "VHA NBN Query Address");
						sIntCallInputs.SetProperty("TransactionType", "VBC_QUERY");
						sIntCallInputs.SetProperty("LOVType", "VHA_NBN_TOUCHPOINT");
						sIntCallInputs.SetProperty("Value", "VHANBNAddressMapQASNewCustomer");
						
						sIntCallInputs.SetProperty("suburb", sSuburb);
						sIntCallInputs.SetProperty("streetName", sStreetName);
						sIntCallInputs.SetProperty("streetType", sStreetType);
						sIntCallInputs.SetProperty("buildingName", sBuildingName);
						sIntCallInputs.SetProperty("unitType", sUnitType);
						sIntCallInputs.SetProperty("unitNumber", sUnitNumber);
						//sIntCallInputs.SetProperty("buildingLevelNumber", sBuildingNumber);
						sIntCallInputs.SetProperty("streetNumber", sBuildingNumber);
						sIntCallInputs.SetProperty("postcode", sPostcode);
						sIntCallInputs.SetProperty("state", sState);
						sIntCallInputs.SetProperty("streetNumber2", "");
						sIntCallInputs.SetProperty("streetTypeSuffix", "");
						sIntCallInputs.SetProperty("complexRoadName", "");
						sIntCallInputs.SetProperty("complexRoadTypeCode", "");
						sIntCallInputs.SetProperty("secondaryComplexName", "");
						sIntCallInputs.SetProperty("complexRoadNumber1", "");
						sIntCallInputs.SetProperty("complexRoadNumber2", "");
						sIntCallInputs.SetProperty("complexRoadSuffixCode", "");
						sIntCallInputs.SetProperty("buildingLevelType", "");
						sIntCallInputs.SetProperty("planNumber", "");						
						sIntCallInputs.SetProperty("TransactionName", "VHAOneSQRESTAPI"); 
						sIntCallInputs.SetProperty("MapName", "VHA OneSQ REST API Response Map");						
						sIntCallInputs.SetProperty("FlowName", "SQ");
						sIntCallInputs.SetProperty("OutputIntObjectName", "VHAOneSQRESTAPIIO");
						sIntCallInputs.SetProperty("FlowOneSQ","Addr");
						sIntCallInputs.SetProperty("SessionId",SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VF Capture Customer Details TBC").GetFieldValue("Id"));
						
						
						var sNetwork = "";						
						if (SiebelApp.S_App.GetProfileAttr("VHANewOrg") == "Kogan"){
							sNetwork = "NBN";
						}	
						if($('[aria-labelledby*="VHA_NBN_Retrieve_Plans"]').is(":checked") == true){
							sNetwork = "NBN";							
						}						
						sIntCallInputs.SetProperty("serviceName", sNetwork);
						
						
						
						if(SiebelApp.S_App.GetProfileAttr("MultiaddLocID") != "")
						{
							sIntCallInputs.SetProperty("NBN Location Id", SiebelApp.S_App.GetProfileAttr("MultiaddLocID"));
							TheApplication().SetProfileAttr("PickLocId", SiebelApp.S_App.GetProfileAttr("MultiaddLocID"))
							
								//SiebelApp.S_App.SetProfileAttr("Street Road Number1",$(this).attr("data-lid"));								
								
								sIntCallInputs.SetProperty("suburb", SiebelApp.S_App.GetProfileAttr("Locality Suburb Name"));
								sIntCallInputs.SetProperty("streetName", SiebelApp.S_App.GetProfileAttr("Street Road Name"));
								sIntCallInputs.SetProperty("streetType", sStreetType);
								sIntCallInputs.SetProperty("buildingName", sBuildingName);
								sIntCallInputs.SetProperty("unitType", SiebelApp.S_App.GetProfileAttr("Unit Type"));
								sIntCallInputs.SetProperty("unitNumber", SiebelApp.S_App.GetProfileAttr("Unit Number"));
								sIntCallInputs.SetProperty("streetNumber", SiebelApp.S_App.GetProfileAttr("Street Road Number1"));
								sIntCallInputs.SetProperty("postcode", SiebelApp.S_App.GetProfileAttr("Post Code"));
								sIntCallInputs.SetProperty("state", SiebelApp.S_App.GetProfileAttr("State Territory Code"));
								
						}
						sIntCallOutputs = ser.InvokeMethod("RunProcess", sIntCallInputs);
						//var multiLocID = sIntCallOutputs.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(0).childArray[0].propArray["NBN Location Id"];
						if(SiebelApp.S_App.GetProfileAttr("MultiAddr") == 'Y' && SiebelApp.S_App.GetProfileAttr("MultiaddLocID") == "")
						{
							var multiAddData = sIntCallOutputs.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(0).childArray;
							if(multiAddData != undefined)
							{
								var selectth = '<div class="main-bg-grey mt-5 pt-3 mutiAddressPopup" id="HomeAuthent" style="z-index: 9999;position: relative;"><div id="table-myModal" class="modal"><div class="table-modal-content" style="height:80%;overflow-y: scroll;"><h4 class="fs-1 pb-4 pl-4"><strong>Select a Address</strong></h4><div><span class="vha-popup-close mt-n65px mt-1 ml-668px vhaAddressClose" id="vha-ret-table-close-btn">X</span></div><div class="fs-1 fw-bold pb-4 ll-4"></div><table class="table table-bordered width-80p bg-white vha-ret-table-authen"><thead><tr><th>Address</th><th>Network</th><th>Location ID</th><th>Select</th></tr></thead><tbody></tbody></table><button class="skip vha-ret-popup-close-btn-home vhaAddressClose" id="vha-cont-prof-skipbtn-home">Cancel</button></div></div></div>';
								
								$('body').append(selectth);
								
								$.each(multiAddData, function (index, item) {
									 var row = $("<tr class='siebui-form' data-index='0' data-item=''>").attr("data-index", index);
									 
									 var multiUnitNum = item.propArray['Unit Number'] !== undefined ? item.propArray['Unit Number'] : "";
									 var multiUnitType = item.propArray['Unit Type'] !== undefined ? item.propArray['Unit Type'] : "";
									 
									 if(item.propArray['NBN Location Id'].substring(0, 3) == "LOC"){ var networkName = "NBN" }
									 else if(item.propArray['NBN Location Id'].substring(0, 3) == "OPC"){ var networkName = "OPTICOMM" }
									 else{ var networkName = "VISION" }
									 
									 var multiStNum = item.propArray['Street Road Number1'] !== undefined ? item.propArray['Street Road Number1'] : "";
									 var multiStName = item.propArray['Street Road Name'] !== undefined ? item.propArray['Street Road Name'] : "";
									 var multiStRdType = item.propArray['Street Road Type Code'] !== undefined ? item.propArray['Street Road Type Code'] : "";
									 var multiSubrub = item.propArray['Locality Suburb Name'] !== undefined ? item.propArray['Locality Suburb Name'] : "";
									 var multiStTeritCode = item.propArray['State Territory Code'] !== undefined ? item.propArray['State Territory Code'] : "";
									 var multiPostCode = item.propArray['Post Code'] !== undefined ? item.propArray['Post Code'] : "";
									 
									 
									 row.append($("<td style='vertical-align:middle'>").text(multiUnitType +" "+multiUnitNum +" "+multiStNum +" "+multiStName+" "+multiStRdType+", "+multiSubrub+", "+multiStTeritCode+" "+multiPostCode ));
									 
									 //$.unitTypeCode + $.unitNumber + $.levelTypeCode + $.levelNumber + $.roadNumber1 + '-' + $.roadNumber2 + $.roadName + $.roadTypeCode + ',' + $.localityName + ',' + $.stateTerritoryCode
									 
									 row.append($("<td style='vertical-align:middle'>").text(networkName));
									 row.append($("<td style='vertical-align:middle'>").text(item.propArray['NBN Location Id']));
									 row.append($("<td class='mceField'><button type='button' class='siebui-ctrl-btn siebui-icon-selectAddress  appletButton multiSelectBtn' data-lid='"+item.propArray['NBN Location Id']+"' data-sroadn1='"+multiStNum+"' data-sroadn='"+multiStName+"' data-subrub='"+multiSubrub+"' data-utype='"+multiUnitType+"' data-unumber='"+multiUnitNum+"' data-stcode='"+multiStTeritCode+"' data-sttypecode='"+multiStRdType+"'  data-pocode='"+multiPostCode+"' id='multiSelectAddBtn' name='Select' data-display='Select' tabindex='0' title='Select' aria-label='Select' ><span>Select</span></button>"));
																					 
									 $(".vha-ret-table-authen tbody").append(row);
								});
							
								//$('body').append(selectth);
								
								$(".vhaAddressClose").on("click", function () {
									$(".mutiAddressPopup").addClass("displaynone");
									$('.mutiAddressPopup').remove();
								});
								$('.multiSelectBtn').on('click',function(){
									$(".mutiAddressPopup").addClass("displaynone");
									//updateSelectedNBNAddress($(this).attr("data-lid"));
									$('.mutiAddressPopup').remove();
									SiebelApp.S_App.SetProfileAttr("MultiaddLocID",$(this).attr("data-lid"));
									
									SiebelApp.S_App.SetProfileAttr("Street Road Number1",$(this).attr("data-sroadn1"));
									SiebelApp.S_App.SetProfileAttr("Street Road Name",$(this).attr("data-sroadn"));
									SiebelApp.S_App.SetProfileAttr("Locality Suburb Name",$(this).attr("data-subrub"));
									SiebelApp.S_App.SetProfileAttr("State Territory Code",$(this).attr("data-stcode"));
									SiebelApp.S_App.SetProfileAttr("Unit Type",$(this).attr("data-utype"));
									SiebelApp.S_App.SetProfileAttr("Unit Number",$(this).attr("data-unumber"));
									SiebelApp.S_App.SetProfileAttr("Post Code",$(this).attr("data-pocode"));
									SiebelApp.S_App.SetProfileAttr("Street Road Type Code",$(this).attr("data-sttypecode"));
									
									
									TriggerNBNAddress();
								})
						
							}
						}
						else if(SiebelApp.S_App.GetProfileAttr("MultiaddLocID") != "")
						{
							SiebelApp.S_App.SetProfileAttr("MultiaddLocID", "");
							
							var svcUI = TheApplication().GetService("FINS Teller UI Navigation");
							var psIn = TheApplication().NewPropertySet();
							var psOut = TheApplication().NewPropertySet();
							psIn.SetProperty("Refresh All","Y");
							svcUI.InvokeMethod("RefreshCurrentApplet",psIn,psOut);
							
							$('[data-display="Coverage Check"]').click();
						}
						else{
							var emptyparam = '';
							//updateSelectedNBNAddress(emptyparam);
							
							var svcUI = TheApplication().GetService("FINS Teller UI Navigation");
							var psIn = TheApplication().NewPropertySet();
							var psOut = TheApplication().NewPropertySet();
							psIn.SetProperty("Refresh All","Y");
							svcUI.InvokeMethod("RefreshCurrentApplet",psIn,psOut);
							
							$('[data-display="Coverage Check"]').click();
						}
						
						//sIntCallOutputs = sInterfaceCallBS.InvokeMethod("GenericVBCCall", sIntCallInputs);
						/*var AdderssList = sIntCallOutputs.GetChildByType("ResultSet")
							.GetChildByType("NBNRespMsg")
							.GetChildByType("ListOfVHA NBN Query Address Response IO")
							.GetChildByType("ListOfInterface")
							.GetChildByType("ListOfNBNAddressResponse")
							.GetChildByType("NBNAddressResponse")
							.GetChildByType("ListOfVHA NBN Query Address");
						AdderssList = VHAAppUtilities.SiebelMessageToArray(AdderssList);*/
						
						//appendDialogTemplate();
						//$(".VHADialogDataSection").html("");
						//VHAAppUtilities.SetConstants("NBNAddressList", AdderssList);

						//var AdderssListLen = AdderssList.length;
						/*var Multiaddser = SiebelApp.S_App.GetService("Workflow Process Manager");
                        var MultiaddInp = SiebelApp.S_App.NewPropertySet();
                        MultiaddInp.SetProperty("ProcessName", "VHA OneSQ REST API Process");
						var MultiAddout = Multiaddser.InvokeMethod("RunProcess", MultiaddInp);
						console.log(MultiAddout);*/
						
						//Profile attribute Settings for CVC call decoupling
						SiebelApp.S_App.SetProfileAttr("GeoAPICalled", "");
						SiebelApp.S_App.SetProfileAttr("GeoSQId", "");
						SiebelApp.S_App.SetProfileAttr("GeoNetwork", "");						
						var sBO = SiebelApp.S_App.GetActiveBusObj();
						var sBC = sBO.GetBusCompByName("VHA Site Qualification BC");
						var sSQId = sBC.GetFieldValue("Id");
						var sConfirmedNetwork = sBC.GetFieldValue("OneSQConfirmedNetwork");
						if(sSQId!= "" && sConfirmedNetwork!= ""){
							SiebelApp.S_App.SetProfileAttr("GeoAPICalled", "Y"); 
							SiebelApp.S_App.SetProfileAttr("GeoSQId", sSQId);
							SiebelApp.S_App.SetProfileAttr("GeoNetwork", sConfirmedNetwork);
						}
												
					}
				}
				function getSessionId() {
					var SessionApplet = SiebelApp.S_App.GetActiveView().GetApplet("VF Task Session Form Applet – TBUI");
					var pm = SessionApplet.GetPModel();
					var RecSet = pm.Get("GetRecordSet");
					return RecSet[0]["Session Id"];
				}
				function getFullAddress(AddressList) {
					//Prabakaran S. 11/08/2021: Added condition to handle undefined attributes
					var AddGeoCode = typeof(AddressList["Address Geography Code"])=="undefined"? "" : AddressList["Address Geography Code"];
					var AddrSiteBldgName = typeof(AddressList["Address Site Building Name"])=="undefined"? "" : AddressList["Address Site Building Name"];
					var Lat = typeof(AddressList["Latitude"])=="undefined"? "" : AddressList["Latitude"];
					var LevelNum = typeof(AddressList["Level Number"])=="undefined"? "" : AddressList["Level Number"];
					var LevelType = typeof(AddressList["Level Type"])=="undefined"? "" : AddressList["Level Type"];
					var LocSubName = typeof(AddressList["Locality Suburb Name"])=="undefined"? "" : AddressList["Locality Suburb Name"];
					var LocDesc = typeof(AddressList["Location Descriptor"])=="undefined"? "" : AddressList["Location Descriptor"];
					var Long = typeof(AddressList["Longitude"])=="undefined"? "" : AddressList["Longitude"];
					var LotNum = typeof(AddressList["Lot Number"])=="undefined"? "" : AddressList["Lot Number"];
					var NBNLocId = typeof(AddressList["NBN Location Id"])=="undefined"? "" : AddressList["NBN Location Id"];
					var PlanNum = typeof(AddressList["Plan Number"])=="undefined"? "" : AddressList["Plan Number"];
					var PostCode = typeof(AddressList["Post Code"])=="undefined"? "" : AddressList["Post Code"];
					var SecRoadName = typeof(AddressList["Secondary Road Name"])=="undefined"? "" : AddressList["Secondary Road Name"];
					var SecRoadNum1 = typeof(AddressList["Secondary Road Number1"])=="undefined"? "" : AddressList["Secondary Road Number1"];
					var SecRoadNum2 = typeof(AddressList["Secondary Road Number2"])=="undefined"? "" : AddressList["Secondary Road Number2"];
					var SecRoadSuffCode = typeof(AddressList["Secondary Road Suffix Code"])=="undefined"? "" : AddressList["Secondary Road Suffix Code"];
					var SecRoadTypeCode = typeof(AddressList["Secondary Road Type Code"])=="undefined"? "" : AddressList["Secondary Road Type Code"];
					var SecSiteBldgName = typeof(AddressList["Secondary Site Building Name"])=="undefined"? "" : AddressList["Secondary Site Building Name"];
					var StateTerritoryCode = typeof(AddressList["State Territory Code"])=="undefined"? "" : AddressList["State Territory Code"];
					var StRoadName = typeof(AddressList["Street Road Name"])=="undefined"? "" : AddressList["Street Road Name"];
					var StRoadNum1 = typeof(AddressList["Street Road Number1"])=="undefined"? "" : AddressList["Street Road Number1"];
					var StRoadNum2 = typeof(AddressList["Street Road Number2"])=="undefined"? "" : AddressList["Street Road Number2"];
					var StRoadTypeCode = typeof(AddressList["Street Road Type Code"])=="undefined"? "" : AddressList["Street Road Type Code"];
					var StRoadTypeSuffCode = typeof(AddressList["Street Road Type Suffix Code"])=="undefined"? "" : AddressList["Street Road Type Suffix Code"];
					var UnitNum = typeof(AddressList["Unit Number"])=="undefined"? "" : AddressList["Unit Number"];
					var UnitType = typeof(AddressList["Unit Type"])=="undefined"? "" : AddressList["Unit Type"];


					var NBNAddrCalc1Unit = (UnitType == "") ? ((UnitNum == "") ? "" : UnitNum + ",") : ((UnitNum == "") ? UnitType + "," : UnitType + " " + UnitNum + ",");
					var NBNAddrCalc2LOT = (LotNum == "") ? "" : "LOT " + LotNum + ",";
					var NBNAddrCalc3Street = (StRoadNum1 == "") ? ((StRoadNum2 == "") ? ((StRoadName == "") ? ((StRoadTypeCode == "") ? "" : StRoadTypeCode + ",") : StRoadName + " " + StRoadTypeCode + ",") : ((StRoadName == "") ? ((StRoadTypeCode == "") ? StRoadNum2 + "," : StRoadNum2 + " " + StRoadTypeCode + ",") : StRoadNum2 + " " + StRoadName + " " + StRoadTypeCode + ",")) : ((StRoadNum2 == "") ? ((StRoadName == "") ? ((StRoadTypeCode == "") ? "" : StRoadNum1 + " " + StRoadTypeCode + ",") : StRoadNum1 + " " + StRoadName + " " + StRoadTypeCode + ",") : ((StRoadName == "") ? ((StRoadTypeCode == "") ? StRoadNum1 + "-" + StRoadNum2 + "," : StRoadNum1 + "-" + StRoadNum2 + " " + StRoadTypeCode + ",") : StRoadNum1 + "-" + StRoadNum2 + " " + StRoadName + " " + StRoadTypeCode + ","));
					var NBNAddrCalc4Locality = (LocSubName == "") ? ((StateTerritoryCode == "") ? ((PostCode == "") ? "" : PostCode) : StateTerritoryCode + " " + PostCode) : ((StateTerritoryCode == "") ? ((PostCode == "") ? LocSubName : LocSubName + " " + PostCode) : LocSubName + " " + StateTerritoryCode + " " + PostCode);
					var NBNAddrCalc5Level = (LevelType == "") ? ((LevelNum == "") ? "" : LevelNum) : ((LevelNum == "") ? LevelType : LevelType + " " + LevelNum);
					var NBNAddrCalc6AddressSite = (AddrSiteBldgName == "") ? "" : AddrSiteBldgName;
					var NBNAddrCalc7ComplexRoad = (SecRoadNum1 == "") ? ((SecRoadNum2 == "") ? "" : SecRoadNum2 + ",") : ((SecRoadNum2 == "") ? SecRoadNum1 + "," : SecRoadNum1 + "-" + SecRoadNum2 + ",");
					var NBNAddrCalc8ComplexStreet = (SecRoadName == "") ? ((SecRoadTypeCode == "") ? "" : SecRoadTypeCode + ",") : ((SecRoadTypeCode == "") ? SecRoadName + "," : SecRoadName + " " + SecRoadTypeCode + ",");
					var NBNAddrCalc9ComplexBuilding = (SecSiteBldgName == "") ? "" : SecSiteBldgName;
					NBNAddrCalc5Level = NBNAddrCalc5Level ? "(" + NBNAddrCalc5Level + ")" : NBNAddrCalc5Level;

					var NBNAddrCalc = NBNAddrCalc1Unit + " " +
						NBNAddrCalc2LOT + " " +
						NBNAddrCalc3Street + " " +
						NBNAddrCalc4Locality + " " +
						NBNAddrCalc6AddressSite + " " +
						NBNAddrCalc7ComplexRoad + " " +
						NBNAddrCalc8ComplexStreet + " " +
						NBNAddrCalc9ComplexBuilding + " " +
						NBNAddrCalc5Level;

					return NBNAddrCalc;

				}

				function appendDialogTemplate() {
					var Template = '<div id = "openModal" class = "modalDialog VHADisplayNone">\
						<div>\
							<div id = "VHAPrimaryIDTypesIDDetails">\
							<span class="VHAPopupClose">X</span>\
								<div class="VHADialogSectionHeader">\
									<h2 class="VHAIDPopUpHeader"> Confirm Address </h2>\
								</div>\
								<div class="VHADialogDataSection">\
								</div>\
								<div class="VHADialogButtonBar">\
									<div class="VHAAlertOKBtn VHANBNAddressDialogueClose appletButton">Close</div>\
								</div>\
							</div>\
						</div>\
					</div>';

					$("#openModal").remove();
					$('body').append(Template);
					//Below events are added here because they do not work when added as part of the bindevents function
					$("#openModal").delegate(".VHAPopupClose,.VHANBNAddressDialogueClose", "click", {}, function (e) {
						$("#openModal").remove();
					});
					$("#openModal").delegate(".VHASelectNBNAddress", "click", { ctx: this }, processSelectNBNAddressSelect);
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
				VF_Intelligence_Search_FBB_PR.prototype.BindData = function (bRefresh) {
					SiebelAppFacade.VF_Intelligence_Search_FBB_PR.superclass.BindData.apply(this, arguments);
				}
				//Chitra Added for upgarde OUI SQ availablity change
				VF_Intelligence_Search_FBB_PR.prototype.BindEvents = function () {
					SiebelAppFacade.VF_Intelligence_Search_FBB_PR.superclass.BindEvents.apply(this, arguments);
					/* $(".siebui-applet-content").delegate(".VHASQExpandCollapse", "click", function () { 
									 ExpandCollapse("SQExpandCollapse");
							 	
							 });
				 $(".siebui-view").delegate(".VHAOrderExpandCollapse", "click", function () {
									 ExpandCollapse("OrderExpandCollapse");
							 	
							 });*/
					$('[aria-label="Press F2 for Selection Field"]').on('click',function(){
						if($(this).prev().attr('aria-label') == "Can't find address? Refine Address Search")
						{
							setTimeout(() => {
							var locSwitchLov = VHAAppUtilities.GetPickListValues("", "[List Of Values.Type]='VF_CR_ENABLE_FLAG' AND [List Of Values.Name]='LOCSwitch' AND [List Of Values.Active]='Y'")[0];
							if(locSwitchLov == 'OFF'){
								$('span[id*="NBN_Location_Id_Search_Label"]').parent().addClass('displaynone');
								$('input[aria-label="NBN Location Id Search"]').addClass('displaynone');
							}
								else{
									$('span[id*="NBN_Location_Id_Search_Label"]').parent().removeClass('displaynone');
								$('input[aria-label="NBN Location Id Search"]').removeClass('displaynone');
								}
							},500);
						}		
					})			
					
							
						
						var BusinessNBNPlancheck = $('[aria-labelledby*="VHA_NBN_Retrieve_Plans"]');
									BusinessNBNPlancheck.on("change",function(){
										if(this.checked){
											SiebelApp.S_App.SetProfileAttr("BusinessNBNPlancheck","Y");											
										}
										else{
											SiebelApp.S_App.SetProfileAttr("BusinessNBNPlancheck","N");
										}										
								});
						
						
		
					setTimeout(function () {
						$(".VHASQExpandCollapse").on("click", ".siebui-button-secondary", function () {
							ExpandCollapse("SQExpandCollapse");

						});
						$(".VHAOrderExpandCollapse").on("click", ".siebui-button-secondary", function () {
							ExpandCollapse("OrderExpandCollapse");

						});
						$(".VHANBNAddreSection~table").on("click", ".VHANBNValidate", function () {
							TriggerNBNAddress();
						});

					}, 40);
					
					

				}





				//$(".VHAPopupClose").on("click", function(e){$("#openModal").remove();});
				/*$("#openModal").delegate(".VHAPopupClose,.VHANBNAddressDialogueClose", "click", {},  function (e){
					$("#openModal").remove();
				});
				
				$("#openModal").on("click", ".VHANBNAddressDialogueClose", { ctx: this }, function (){
					$("#openModal").remove();
				});*/
				//$("#openModal").delegate(".VHASelectNBNAddress", "click", { ctx: this },processSelectNBNAddressSelect);

				function processSelectNBNAddressSelect(e) {
					updateSelectedNBNAddress($(this).attr("locid"));
				}
				function updateSelectedNBNAddress(SelectedLOCId) {
					var SelectedNBNAddressList = VHAAppUtilities.GetConstants("NBNAddressList");
					var SelectedNBNAddressListLen = SelectedNBNAddressList.length;
					var SelectedNBNAddress = {};
					for (var i = 0; i < SelectedNBNAddressListLen; i++) {
						if (SelectedNBNAddressList[i]["NBN Location Id"] === SelectedLOCId) {
							SelectedNBNAddress = SelectedNBNAddressList[i];
							break;
						}
					}

					var Inputs = VHAAppUtilities.CreateSiebelPropertySet(SelectedNBNAddress);
					Inputs.SetProperty("SessionId", getSessionId());
					var Outputs = VHAAppUtilities.CallBS("VHA Utilities BS", "InsertNBNAddress", Inputs);

					var SQApplet = SiebelApp.S_App.GetActiveView().GetApplet("VHA SQ Address Form Applet TBUI");
					var controls = SQApplet.GetControls();
					var SQBtn = controls["Site Qualification"].GetInputName();
					$('[name="' + SQBtn + '"]').trigger("click");
					$("#openModal").remove();
					//$('input[aria-label="Address"]').val(SiebelApp.S_App.GetActiveBusObj('Order Entry (Sales)').GetBusCompByName('VHA Connect FBB TBC').GetFieldValue('WSDL Address'));
					//$('div[aria-label="Service List in Order Information"] .siebui-applet').show();
				}
				//Chitra Added for upgarde OUI SQ availablity change
				function ExpandCollapse(OrderSQ) {
					if (OrderSQ == "SQExpandCollapse") {
						if ($('.VHASQInfoexpand').hasClass("VHADisplayblock")) {
							$('.VHASQInfoexpand').addClass("VHADisplaynone").removeClass("VHADisplayblock");
							$('.VHASQInfocollapse').addClass("VHADisplayblock").removeClass("VHADisplaynone");
							$('.VHANBNSQLabel').siblings().show();
							$('[title="Service List"]').siblings().show();
							var sAIN = SiebelApp.S_App.GetActiveView().GetActiveApplet().GetId();
							var SQAvailability10 = $('[aria-labelledby="Can_Custoemr_Get_NBN_Label_'+sAIN+'"]').val();
							if (SQAvailability == "Yes") {
								$('[aria-labelledby="Can_Custoemr_Get_NBN_Label_'+sAIN+'"]').addClass('VHAActiveBorderColour').removeClass('VHAInactiveBorderColour');

							}
							else if (SQAvailability == "No") {
								$('[aria-labelledby="Can_Custoemr_Get_NBN_Label_'+sAIN+'"]').removeClass('VHAActiveBorderColour').addClass('VHAInactiveBorderColour');
							}
							else {
								$('[aria-labelledby="Can_Custoemr_Get_NBN_Label_'+sAIN+'"]').removeClass('VHAActiveBorderColour').removeClass('VHAInactiveBorderColour');
							}

						}
						else {
							$('.VHASQInfoexpand').addClass("VHADisplayblock").removeClass("VHADisplaynone");
							$('.VHASQInfocollapse').addClass("VHADisplaynone").removeClass("VHADisplayblock");
							$('.VHANBNSQLabel').siblings().hide();
							$('[title="Service List"]').siblings().hide();

						}
					}
					else if (OrderSQ == "OrderExpandCollapse") {
						if ($('.VHAOrderInfoexpand').hasClass("VHADisplayblock")) {
							$('.VHAOrderInfoexpand').addClass("VHADisplaynone").removeClass("VHADisplayblock");
							$('.VHAOrderInfocollapse').addClass("VHADisplayblock").removeClass("VHADisplaynone");
							$('.VHANBNOrderInfoLabel').siblings().show();

						}
						else {
							$('.VHAOrderInfoexpand').addClass("VHADisplayblock").removeClass("VHADisplaynone");
							$('.VHAOrderInfocollapse').addClass("VHADisplaynone").removeClass("VHADisplayblock");
							$('.VHANBNOrderInfoLabel').siblings().hide();

						}
					}
				}
				//Chitra Added for upgarde OUI SQ availablity change
				function SiteQualification(pm) {
					var sFlowName = $('.siebui-applet-taskui-h').html();
					function PostSiteQual() {
						$('.VHASQInfoexpand').addClass("VHADisplaynone").removeClass("VHADisplayblock");
						$('.VHASQInfocollapse').addClass("VHADisplayblock").removeClass("VHADisplaynone");
						$('.VHANBNSQLabel').siblings().show();
						/*$("#Site_Qualilfication_Label").parent().parent().parent().parent().siblings().show();*/
						$('[title="Service List"]').siblings().show();
						//$("#Order_Information_Label").parent().parent().parent().parent().siblings().show();
						$('.VHANBNOrderInfoLabel').siblings().show();
						setTimeout(function () {
							if ($('.VHANBNOrderInfoLabel').length == 0) {

								$('#Order_Information_Label').parent().parent().parent().parent().parent().parent().before("<div class='VHANBNPageLabel VHANBNOrderInfoLabel'>Order Information<div class='siebui-applet-container siebui-collapsible siebui-collapsible-applet-container VHAOrderExpandCollapse'><span class='siebui-button-secondary siebui-btn-icon-expanded VHAOrderInfoexpand VHADisplayblock'><a href='javascript:void()' role='link' tabindex='0' aria-label='NBNSQ:Expand Applet'></a></span><span class='siebui-button-secondary siebui-btn-icon-collapsed VHAOrderInfocollapse VHADisplaynone'><a href='javascript:void()' role='link' tabindex='0' aria-label='NBN:Collapse Applet'></a></span></div></div>");
								$('#Order_Information_Label').parent().hide();

								$('.VHAOrderInfocollapse').addClass("VHADisplayblock").removeClass("VHADisplaynone");
								$('.VHAOrderInfoexpand').addClass("VHADisplaynone").removeClass("VHADisplayblock");

								//Adds for Change Location Nov Release 2020	
								var sAIN = SiebelApp.S_App.GetActiveView().GetActiveApplet().GetId();								
								var SQAvailability2 = $('[aria-labelledby="Can_Custoemr_Get_NBN_Label_'+sAIN+'"]').val();

							}
						}, 20);
						var sAIN = SiebelApp.S_App.GetActiveView().GetActiveApplet().GetId();	
						var SQAvailability = $('[aria-labelledby="Can_Custoemr_Get_NBN_Label_'+sAIN+'"]').val();
						if (SQAvailability == "Yes") {
							$('[aria-labelledby="Can_Custoemr_Get_NBN_Label_'+sAIN+'"]').addClass('VHAActiveBorderColour').removeClass('VHAInactiveBorderColour');
							//Adds for Connect Nov Release 2020
							var sNBNAddress1 = $('[name='+t_this.GetPM().Get("GetControls")["NBN Address"].GetInputName()+']').val();
							SiebelApp.S_App.SetProfileAttr("sNBNAddress1", sNBNAddress1);
							var sMSISDN2 = SiebelApp.S_App.GetProfileAttr("sMSISDNPC");
							if ((sMSISDN2 != "" && sMSISDN2 != null) && (OrgName == "Vodafone AU")) {

								var sErr = TriggerNBNAddressSMS(sMSISDN2);
								if (sErr == null || sErr == "") {
									//$('#NBN_Send_SMS1_Label').show();
									SiebelApp.S_App.SetProfileAttr("SendSMSY", "SendQASSMS");
									
								}
								else {
									//$('#NBN_Send_SMS1_Label').hide();
									SiebelApp.S_App.SetProfileAttr("SendSMSY", "");
									
								}

							}
						}
						else if (SQAvailability == "No") {
							$('[aria-labelledby="Can_Custoemr_Get_NBN_Label_'+sAIN+'"]').removeClass('VHAActiveBorderColour').addClass('VHAInactiveBorderColour');
							SiebelApp.S_App.SetProfileAttr("SendSMSY", "");


						}
						else {
							$('[aria-labelledby="Can_Custoemr_Get_NBN_Label_'+sAIN+'"]').removeClass('VHAActiveBorderColour').removeClass('VHAInactiveBorderColour');
							SiebelApp.S_App.SetProfileAttr("SendSMSY", "");
							
						}
						//var sms1 = SiebelApp.S_App.GetProfileAttr("SendSMSY");
						//HereSendQASSMSConnect NBN: NBN Availability
						if (sFlowName == "Connect NBN: NBN Availability") {
							var sms1 = SiebelApp.S_App.GetProfileAttr("SendSMSY");
							
							if (sms1 == "SendQASSMS") {
								$('#NBN_Send_SMS1_Label').show();
								
							}
							else {
								$('#NBN_Send_SMS1_Label').hide();
								
							}

						}

					}
					if (pm == "SiteQualification") {
						if (sFlowName != "Manage Service: NBN Availability")
							PostSiteQual();
					}
					else if (pm == "ChangeAddress") {
						/*$("#Site_Qualilfication_Label").parent().parent().parent().parent().siblings().hide();*/
						setTimeout(function () {
							$('img.VHANBNValidate').addClass("VFDisplayNone");
							$('.VHASQInfoexpand').addClass("VHADisplayblock").removeClass("VHADisplaynone");
							$('.VHASQInfocollapse').addClass("VHADisplaynone").removeClass("VHADisplayblock");
							$('.VHANBNSQLabel').siblings().hide();
							$('[title="Service List"]').siblings().hide();
							if ($('.VHANBNOrderInfoLabel').length == 0)
								$('#Order_Information_Label').parent().parent().parent().parent().parent().parent().before("<div class='VHANBNPageLabel VHANBNOrderInfoLabel'>Order Information<div class='siebui-applet-container siebui-collapsible siebui-collapsible-applet-container VHAOrderExpandCollapse'><span class='siebui-button-secondary siebui-btn-icon-expanded VHAOrderInfoexpand VHADisplayblock'><a href='javascript:void()' role='link' tabindex='0' aria-label='NBNSQ:Expand Applet'></a></span><span class='siebui-button-secondary siebui-btn-icon-collapsed VHAOrderInfocollapse VHADisplaynone'><a href='javascript:void()' role='link' tabindex='0' aria-label='NBN:Collapse Applet'></a></span></div></div>");
							$('.VHANBNOrderInfoLabel').siblings().hide();
							$('.VHAOrderInfocollapse').addClass("VHADisplaynone").removeClass("VHADisplayblock");
							$('.VHAOrderInfoexpand').addClass("VHADisplayblock").removeClass("VHADisplaynone");
						}, 20);
					}
					//manikandan- for task pane auto close--start
					if (sFlowName == "Manage Service: NBN Availability") {
						
						//$(".siebui-icon-bttns_more").click();
						$('.VHANBNAddreSection').next('table').find('.siebui-icon-bttns_more').click();
						setTimeout(function () { PostSiteQual(); }, 20);
						//$(".siebui-icon-bttns_more").addClass("VHADisplaynone");
						$('.VHANBNAddreSection').next('table').find('.siebui-icon-bttns_more').addClass("VHADisplaynone");
						var sAIN = SiebelApp.S_App.GetActiveView().GetActiveApplet().GetId();
						SQAvailability2 = $('[aria-labelledby="Can_Custoemr_Get_NBN_Label_'+sAIN+'"]').val();
						
						SiebelApp.S_App.SetProfileAttr("SQAvailability21", SQAvailability2);

					}
					//manikandan- for task pane auto close--end
				}

				VF_Intelligence_Search_FBB_PR.prototype.EndLife = function () {
					SiebelAppFacade.VF_Intelligence_Search_FBB_PR.superclass.EndLife.apply(this, arguments);
					//$(".siebui-icon-bttns_more").removeClass("VHADisplaynone");
					$('.VHANBNAddreSection').next('table').find('.siebui-icon-bttns_more').removeClass("VHADisplaynone");

				}

				return VF_Intelligence_Search_FBB_PR;
			}()
			);
			return "SiebelAppFacade.VF_Intelligence_Search_FBB_PR";
		})
}

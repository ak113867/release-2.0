if (typeof(SiebelAppFacade.VHAConnectionFormAppletPR) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.VHAConnectionFormAppletPR");
    define("siebel/custom/VHAConnectionFormAppletPR", ["order!siebel/phyrenderer"], function() {
        SiebelAppFacade.VHAConnectionFormAppletPR = (function() {
                function VHAConnectionFormAppletPR(pm) {
                    SiebelAppFacade.VHAConnectionFormAppletPR.superclass.constructor.call(this, pm);
                }
                SiebelJS.Extend(VHAConnectionFormAppletPR, SiebelAppFacade.PhysicalRenderer);
                VHAConnectionFormAppletPR.prototype.ShowUI = function() {
                    SiebelAppFacade.VHAConnectionFormAppletPR.superclass.ShowUI.call(this);
                    var pm = this.GetPM();
                    /*var CustomerId = pm.Get("GetBusComp").GetFieldValue("Id");
                    var ser = SiebelApp.S_App.GetService("VF BS Process Manager");
                    var Inputs = SiebelApp.S_App.NewPropertySet();
                    var Output = SiebelApp.S_App.NewPropertySet();
                    Inputs.SetProperty("Service Name", "SIS OM PMT Service");
                    Inputs.SetProperty("Method Name", "Set Profile Attribute");
                    Inputs.SetProperty("Profile Attribute Name", "VHACustomerId");
                    Inputs.SetProperty("Profile Attribute Value", CustomerId);
                    Output = ser.InvokeMethod("Run Process", Inputs);*/
                    var controls = pm.Get("GetControls");
                    var Accstatusctrl = controls["AccountStatus"].GetInputName();

                    var Mode = SiebelApp.S_App.GetActiveView().GetApplet(pm.Get("GetName")).GetMode();
                    setTimeout(function() {
					
					
					/* Added fot transfer Service show and hide*/
					/*TULASIY:16-09-2022::Modified for upgrade 22.7 issues*/
					  var uCustSegmnt = "VF_Customer_Segment_Label_"+pm.Get("GetId");
					  if($('[aria-labelledby='+uCustSegmnt+']').val() != "" ) {
							SiebelJS.Log("Customer Segment is not null");
							$('[aria-label="Customer Account Form Applet:Transfer Service"]').hide();
					  }
					  if(SiebelApp.S_App.GetProfileAttr("VHA User Type") == "Retail")
					  {
						SiebelJS.Log("Retail User");
						$('[aria-label="Customer Account Form Applet:Transfer Service"]').hide();  
					  }

                        if (Mode == "Base" || Mode == "Edit") {
							/*TULASIY:15-09-2022::Modified for upgrade 22.7 issues*/
                            $("input[name='" + Accstatusctrl + "']").siblings("span").removeClass("siebui-icon-dropdown");
                            $("input[name='" + Accstatusctrl + "']").removeClass("siebui-ctrl-select");
                            $("input[name='" + Accstatusctrl + "']").removeClass("siebui-input-popup");
                            $("input[name='" + Accstatusctrl + "']").addClass("RemoveBorder");

                            if ($("input[name='" + Accstatusctrl + "']").val() == "Active") {

                                /*Mani- SIT Sanity Defects*/
								/*TULASIY:15-09-2022::Modified for upgrade 22.7 issues*/
                                $("input[name='" + Accstatusctrl + "']").parent().prepend('<span class="dot_Class_Active"></span>');
                                $("input[name='" + Accstatusctrl + "']").addClass("siebui-value Class_Active AccountStatusLabel");
                            }


                            if ($("input[name='" + Accstatusctrl + "']").val() == "Inactive") {

                                /*Mani- SIT Sanity Defects*/
								/*TULASIY:15-09-2022::Modified for upgrade 22.7 issues*/
                                $("input[name='" + Accstatusctrl + "']").parent().prepend('<span class="dot_Class_Inactive"></span>');
                                $("input[name='" + Accstatusctrl + "']").addClass("siebui-value Class_Inactive AccountStatusLabel");
                            }
                        }
                    }, 5);
					
							
				if(Mode == "Base" || Mode == "Edit" )
				{
					var cutomerType = SiebelApp.S_App.GetActiveBusObj('Account').GetBusCompByName('Account').GetFieldValue('VF Customer Type');
					var customerSegment = SiebelApp.S_App.GetActiveBusObj('Account').GetBusCompByName('Account').GetFieldValue('VF Customer Segment');
					if(cutomerType == 'Person' || customerSegment == 'Consumer' || customerSegment == '')
					{	
						$('input[aria-label="Registered Company #"]').parents('td').parent('tr').hide();
						$('input[aria-label="Number of Employees"]').parents('td').parent('tr').hide();
						$('input[aria-label="Business Location"]').parents('td').parent('tr').hide();	
						$('input[aria-label="Registered Company Name"]').parents('td').parent('tr').hide();
						$('input[aria-label="Dissolved"]').parents('td').parent('tr').hide();
						$('input[aria-label="Care"]').parents('td').parent('tr').hide();
						$('input[aria-label="Corporate Group"]').parents('td').parent('tr').hide();
						$('button[data-display="Validate"]').parents('td').parent('tr').hide();
					}
					if(customerSegment == 'Business')
					{
						//$('input[aria-label="Bill Segment"]').parents('td').parent('tr').hide();				
					}			
					
				}
				
				if(Mode == "New")
				{					
					if(cutomerType == 'Person' || customerSegment == 'Consumer' || customerSegment ==  undefined)
					{
						$('input[aria-label="Registered Company #"]').parents('td').parent('tr').hide();
						$('input[aria-label="Number of Employees"]').parents('td').parent('tr').hide();
						$('input[aria-label="Business Location"]').parents('td').parent('tr').hide();
						$('input[aria-label="Registered Company Name"]').parents('td').parent('tr').hide();
							$('input[aria-label="Number of Employees"]').parents('td').parent('tr').hide();
							$('input[aria-label="Dissolved"]').parents('td').parent('tr').hide();
							$('input[aria-label="Care"]').parents('td').parent('tr').hide();
							$('input[aria-label="Corporate Group"]').parents('td').parent('tr').hide();						
							$('button[data-display="Validate"]').parents('td').parent('tr').hide();
							//$('span[id*="Business_Name"]').parents('td').parent('tr').hide();
					}
					if(customerSegment == 'Business')
					{
						$('input[aria-label="Bill Segment"]').parents('td').parent('tr').hide();				
					}					
				}
				
				this.GetPM().AttachPMBinding("FieldChange", function(control, field_value){
			
				if(control.GetFieldName() == 'VF Customer Segment' || control.GetFieldName() == 'VF Customer Type')
					{
						if(field_value == 'Person' || field_value == 'Consumer')
						{
							$('input[aria-label="Registered Company #"]').parents('td').parent('tr').hide();
							$('input[aria-label="Number of Employees"]').parents('td').parent('tr').hide();
							$('input[aria-label="Registered Company Name"]').parents('td').parent('tr').hide();
							$('input[aria-label="Dissolved"]').parents('td').parent('tr').hide();
							$('input[aria-label="Care"]').parents('td').parent('tr').hide();
							$('input[aria-label="Corporate Group"]').parents('td').parent('tr').hide();
							$('button[data-display="Validate"]').parents('td').parent('tr').hide();
						}
						if(field_value == 'Business')
						{
							$('input[aria-label="Registered Company #"]').parents('td').parent('tr').show();
							$('input[aria-label="Registered Company Name"]').parents('td').parent('tr').show();
							$('input[aria-label="Number of Employees"]').parents('td').parent('tr').show();
							$('input[aria-label="Dissolved"]').parents('td').parent('tr').show();
							$('input[aria-label="Care"]').parents('td').parent('tr').show();
							$('input[aria-label="Corporate Group"]').parents('td').parent('tr').show();
							$('button[data-display="Validate"]').parents('td').parent('tr').show();
						}
					}
				});

                }
                return VHAConnectionFormAppletPR;
            }
            ());
        return "SiebelAppFacade.VHAConnectionFormAppletPR";
    });
}
/*<ORACLECOPYRIGHT>
* Copyright (C) 2008-2024
* Oracle and Java are registered trademarks of Oracle and/or its affiliates.
* Other names may be trademarks of their respective owners.
* UNIX is a registered trademark of The Open Group.
*
* This software and related documentation are provided under a license agreement
* containing restrictions on use and disclosure and are protected by intellectual property laws.
* Except as expressly permitted in your license agreement or allowed by law, you may not use, copy,
* reproduce, translate, broadcast, modify, license, transmit, distribute, exhibit, perform, publish,
* or display any part, in any form, or by any means. Reverse engineering, disassembly,
* or decompilation of this software, unless required by law for interoperability, is prohibited.
*
* The information contained herein is subject to change without notice and is not warranted to be error-free.
* If you find any errors, please report them to us in writing.
*
* U.S. GOVERNMENT RIGHTS Programs, software, databases, and related documentation and technical data delivered to U.S.
* Government customers are "commercial computer software" or "commercial technical data" pursuant to the applicable
* Federal Acquisition Regulation and agency-specific supplemental regulations.
* As such, the use, duplication, disclosure, modification, and adaptation shall be subject to the restrictions and
* license terms set forth in the applicable Government contract, and, to the extent applicable by the terms of the
* Government contract, the additional rights set forth in FAR 52.227-19, Commercial Computer Software License
* (December 2007). Oracle America, Inc., 500 Oracle Parkway, Redwood City, CA 94065.
*
* This software or hardware is developed for general use in a variety of information management applications.
* It is not developed or intended for use in any inherently dangerous applications, including applications that
* may create a risk of personal injury. If you use this software or hardware in dangerous applications,
* then you shall be responsible to take all appropriate fail-safe, backup, redundancy,
* and other measures to ensure its safe use. Oracle Corporation and its affiliates disclaim any liability for any
* damages caused by use of this software or hardware in dangerous applications.
*
* This software or hardware and documentation may provide access to or information on content,
* products, and services from third parties. Oracle Corporation and its affiliates are not responsible for and
* expressly disclaim all warranties of any kind with respect to third-party content, products, and services.
* Oracle Corporation and its affiliates will not be responsible for any loss, costs,
* or damages incurred due to your access to or use of third-party content, products, or services.
</ORACLECOPYRIGHT>*/
/* 24.2.0.0SIA[2024_02] */
typeof SiebelAppFacade.BuyNowListRenderer=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.BuyNowListRenderer"),define("siebel/buynowlistrenderer",["siebel/jqgridrenderer"],function(){return SiebelAppFacade.BuyNowListRenderer=function(){function n(e){SiebelAppFacade.BuyNowListRenderer.superclass.constructor.call(this,e)}var e=SiebelJS.Dependency("SiebelAppFacade.FacadeConstants"),t=SiebelJS.Dependency("SiebelApp.Constants");return SiebelJS.Extend(n,SiebelAppFacade.JQGridRenderer),n.prototype.BindData=function(e){var n=this.GetPM(),r=n.Get("ListOfColumns"),i=r.length,s=n.Get("GetRecordSet"),o=n.Get("GetImageContext"),u=s?s.length:0;if(n.Get("GetMode")===t.get("SWE_PST_APPLET_MODE_BASE")&&i>0){var a=1;for(a=1;a<i;a++){var f=r[a].control,l=f.GetFieldName(),c="<DIV></DIV>",h=o[0][l]?o[0][l]:c,p=SiebelAppFacade.HTMLTemplateManager.GenerateMarkup({type:t.get("SWE_CTRL_IMAGECONTROL"),src:h,className:"siebui-config-image-ctrl"});if(f.GetFieldName()&&u>0){var d=this.GetPM().Get("GetFullId"),v=$("#"+d).find(".ui-jqgrid-view").attr("id").split("gview_")[1],m=$("#"+v+"_"+l);$("#"+d).addClass("siebui-config-product-compare-applet"),m.prepend('<span class="siebui-config-product-image">'+p+"</span>")}}}SiebelAppFacade.BuyNowListRenderer.superclass.BindData.call(this,e)},n.prototype.ShowSelection=function(){var e=$("#"+this.GetPM().Get("GetFullId")),t=$(e).find("button"),n=SiebelApp.S_App.IsAutoOn();t&&$(t).replaceWith('<input class="appletButton" data-display="'+t.text()+'" action="action" type="button" onclick="Javascript:history.back();"'+'title="Product Comparison:Back" value="'+t.text()+'"/>');if(n==="true"){var r=$(e).find("[class='appletButton']");r.attr("ot","Button"),r.attr("rn","Back"),r.attr("un","Back")}$(e).find("td:not([class]) > table").removeAttr("width"),this.GetSelectedRow()&&SiebelAppFacade.BuyNowListRenderer.superclass.ShowSelection.call(this)},n}(),"SiebelAppFacade.BuyNowListRenderer"}));

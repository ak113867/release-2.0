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
typeof SiebelAppFacade.NavLinkPR=="undefined"&&(SiebelJS.Namespace("SiebelAppFacade.NavLinkPR"),define("siebel/navlinkpr",["siebel/TileLayoutPR"],function(){return SiebelAppFacade.NavLinkPR=function(){function t(e){SiebelAppFacade.NavLinkPR.superclass.constructor.call(this,e)}var e=SiebelJS.Dependency("SiebelApp.Constants");return SiebelJS.Extend(t,SiebelAppFacade.TileLayoutPR),t.prototype.BindData=function(){SiebelAppFacade.NavLinkPR.superclass.BindData.call(this);var e=this.GetPM(),t=e.Get("GetRawRecordSet"),n="";if(SiebelApp.S_App.IsRwd()){var r=e.Get("GetListId");n=r.substr(0,r.length-1)}else{var i=e.Get("GetFullId");n=i+"_tile_"}for(recordIndex=0;recordIndex<t.length;recordIndex++){var s=t[recordIndex]["Error Msg"],o=t[recordIndex]["Record Count Value"],u=n+recordIndex,a=$("#"+u+" .siebui-record-count"),f="",l=u+"_rec_cnt";if(s){SiebelApp.S_App.IsAutoOn()==="true"&&(f=" ot = 'text' rn = '"+l+"' un = '"+l+"'");var c='<span id="'+u+'_err" class="siebui-record-count-err">';c+='<a role="img" tabindex="0" '+f+' > <i class="siebui-icon-record-count-err"></i> </a> </span>',a.html(c),a.click({ctx:this,msg:s},function(e){utils.Alert(e.data.msg)})}else if(o){f="aria-label='Record Count' aria-readonly='true' readonly='readonly'",SiebelApp.S_App.IsAutoOn()==="true"&&(f+=" ot = 'text' rn = '"+l+"' un = '"+l+"'");var h='<span id ="'+l+'_0" name="'+l+'_0" class="siebui-badge" > '+o+"</span>";a.html(h)}else a.addClass("siebui-record-count-hide")}},t}(),"SiebelAppFacade.NavLinkPR"}));

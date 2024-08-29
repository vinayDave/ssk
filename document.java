/*
***************************************************************
*                                                             *
*                           NOTICE                            *
*                                                             *
*   THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS             *
*   CONFIDENTIAL INFORMATION OF INFOR AND/OR ITS AFFILIATES   *
*   OR SUBSIDIARIES AND SHALL NOT BE DISCLOSED WITHOUT PRIOR  *
*   WRITTEN PERMISSION. LICENSED CUSTOMERS MAY COPY AND       *
*   ADAPT THIS SOFTWARE FOR THEIR OWN USE IN ACCORDANCE WITH  *
*   THE TERMS OF THEIR SOFTWARE LICENSE AGREEMENT.            *
*   ALL OTHER RIGHTS RESERVED.                                *
*                                                             *
*   (c) COPYRIGHT 2016 INFOR.  ALL RIGHTS RESERVED.           *
*   THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE            *
*   TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR          *
*   AND/OR ITS AFFILIATES AND SUBSIDIARIES. ALL RIGHTS        *
*   RESERVED.  ALL OTHER TRADEMARKS LISTED HEREIN ARE         *
*   THE PROPERTY OF THEIR RESPECTIVE OWNERS.                  *
*                                                             *
***************************************************************
*/
package mvx.app.pgm.customer;

import mvx.app.common.*;
import mvx.runtime.*;
import mvx.db.dta.*;
import mvx.app.util.*;
import mvx.app.plist.*;
import mvx.app.ds.*;
import mvx.dsp.common.GenericDSP;
import mvx.dsp.obj.*;
import mvx.util.*;


/*
*Modification area - M3
*Nbr            Date   User id     Description
*99999999999999 999999 XXXXXXXXXX  x
*Modification area - Business partner
*Nbr            Date   User id     Description
*99999999999999 999999 XXXXXXXXXX  x
*Modification area - Customer
*Nbr            Date   User id     Description
*  HM3IMPRO-358 240718 KULKOZ      Add Validation Warning
*/

/**
*<BR><B><FONT SIZE=+2>Wrk: Mass update - selection</FONT></B><BR><BR>
*
* This class ...<BR><BR>
*
*/
public class CRS800 extends mvx.app.pgm.CRS800
{
   /**
   *    PEINZ - Init
   */
   public void PEINZ() {
      //   Next step
      picSetMethod('D');
      //   Reset positioning of cursor on subfile
      IN71 = false;
      IN72 = false;
      IN73 = false;
      IN74 = false;
      IN75 = false;
      XXWARN = false; 		//A	HM3IMPRO-358 240712
      DSP.WWFILE.move(XXFILE);
      //   Recieve file description
      XX = 1;
      XX = lookUpEQ(FILE, XX - 1, XXFILE);
      if (XX >= 0) {
         IN92 = true;
         XX++;
      } else {
         IN92 = false;
         XX = -XX;
      }
      XX++;
      COMRTM((new MvxString(7)).moveLeft("CR80000").moveRight(XX, 3), "MVXCON");
      DSP.WTTX50.moveLeft(SRCOMRCM.MSG);
      //   Prepear subfile
      DSP.XERRNA = 0;
      XERRNM = 0;
      IN94 = true;
      IN95 = false;
      DSP.clearSFL("EC");
      IN94 = false;
      IN95 = false;
      IN96 = false;
      PEROL();
   }

   /**
   *    PECHK - Check
   */
   public void PECHK() {
      //   Next step
      picSetMethod('U');
      //   Reset positioning of cursor on subfile
      IN71 = false;
      IN72 = false;
      IN73 = false;
      IN74 = false;
      IN75 = false;
      if (XERRNM == 0) {
         return;
      }
      XXCNTR = 0; 		//A	HM3IMPRO-358 240715
      IN93 = DSP.readSFL("ES");
      while (!IN93) {
    	  // Check if the primary keys of file are filled or not
    	  if (XXCNTR == 0 ){
    		  XXCNTR++;
    		  //If the file is MITMAS
    		  if(DSP.WWFILE.EQ("MITMAS")){
    			  if(DSP.S0FLDI.NE("MMITNO")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		          //   MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    		  if(DSP.WWFILE.EQ("MITFAC")){
    			  if(DSP.S0FLDI.NE("M9FACI")&&DSP.S0FLDI.NE("M9ITNO")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		          //   MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    		  if(DSP.WWFILE.EQ("MITBAL")){
    			  if(DSP.S0FLDI.NE("MBWHLO")&&DSP.S0FLDI.NE("MBITNO")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		     //      MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    		  if(DSP.WWFILE.EQ("MITPCE")){
    			  if(DSP.S0FLDI.NE("MSWHLO")&&DSP.S0FLDI.NE("MSWHSL")&&DSP.S0FLDI.NE("MSSLDS")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		          //   MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    		  if(DSP.WWFILE.EQ("CIDMAS")){
    			  if(DSP.S0FLDI.NE("IDSUNO")&&DSP.S0FLDI.NE("IDSUTY")&&DSP.S0FLDI.NE("IDSUNM")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		     //   MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    		  if(DSP.WWFILE.EQ("CIDVEN")){
    			  if(DSP.S0FLDI.NE("IISUNO")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		     //   MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    		  if(DSP.WWFILE.EQ("OCUSMA")){
    			  if(DSP.S0FLDI.NE("OKCUNO")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		     //   MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    		  if(DSP.WWFILE.EQ("MPDWCT")){
    			  if(DSP.S0FLDI.NE("PPFACI")&&DSP.S0FLDI.NE("PPPLGR")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		     //   MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    		  if(DSP.WWFILE.EQ("MPDHED")){
    			  if(DSP.S0FLDI.NE("PHFACI")&&DSP.S0FLDI.NE("PHPRNO")&&DSP.S0FLDI.NE("PHSTRT")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		     //   MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    		  if(DSP.WWFILE.EQ("MPDMAT")){
    			  if(DSP.S0FLDI.NE("PMFACI")&&DSP.S0FLDI.NE("PMPRNO")&&DSP.S0FLDI.NE("PMSTRT")&&DSP.S0FLDI.NE("PMMSEQ")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		     //   MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    		  if(DSP.WWFILE.EQ("MPDOPE")){
    			  if(DSP.S0FLDI.NE("POFACI")&&DSP.S0FLDI.NE("POPRNO")&&DSP.S0FLDI.NE("POSTRT")&&DSP.S0FLDI.NE("POMSEQ")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		     //   MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    		  if(DSP.WWFILE.EQ("MPDSCF")){
    			  if(DSP.S0FLDI.NE("CAPRNO")&&DSP.S0FLDI.NE("CASTRT")&&DSP.S0FLDI.NE("CASUFI")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		     //   MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    		  if(DSP.WWFILE.EQ("MPDSRC")){
    			  if(DSP.S0FLDI.NE("PVFACI")&&DSP.S0FLDI.NE("PVPRNO")&&DSP.S0FLDI.NE("PVSTRT")&&DSP.S0FLDI.NE("PVSUFI")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		     //   MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    		  if(DSP.WWFILE.EQ("MILOMA")){
    			  if(DSP.S0FLDI.NE("LMITNO")&&DSP.S0FLDI.NE("LMBANO")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		     //   MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    		  if(DSP.WWFILE.EQ("MILOIN")){
    			  if(DSP.S0FLDI.NE("LIITNO")&&DSP.S0FLDI.NE("LISERN")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		     //   MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    		  if(DSP.WWFILE.EQ("MLIHED")){
    			  if(DSP.S0FLDI.NE("KAFACI")&&DSP.S0FLDI.NE("KAITNO")&&DSP.S0FLDI.NE("KAANNO")&&DSP.S0FLDI.NE("KAHEDS")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		     //   MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    		  if(DSP.WWFILE.EQ("MLIDET")){
    			  if(DSP.S0FLDI.NE("KBFACI")&&DSP.S0FLDI.NE("KBITNO")&&DSP.S0FLDI.NE("KBANNO")&&DSP.S0FLDI.NE("KBSPOS")&&DSP.S0FLDI.NE("KBSSUB")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		     //   MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    		  if(DSP.WWFILE.EQ("MCFLOC")){
    			  if(DSP.S0FLDI.NE("UJMOTP")&&DSP.S0FLDI.NE("UJCFGL")){
    				  XXWARN = true; 													//A	HM3IMPRO-358 240712
    				  IN73 = true; 														//A	HM3IMPRO-358 240712
    		          picSetMethod('D'); 												//A	HM3IMPRO-358 240712
    		     //   MSGID=ZCR8001 'From Value' and 'To Value' for primary key are blank. Do you want to proceed? 			//A	HM3IMPRO-358 240712
    		          SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
    		          COMPMQ("ZCR8001"); 												//A	HM3IMPRO-358 240712
    		          //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
    		          IN60 = true; 														//A	HM3IMPRO-358 240712
    		          IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
    		          IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
    		          DSP.clearOption(); 												//A	HM3IMPRO-358 240712
    		          DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
    		          return; 															//A	HM3IMPRO-358 240712
    			  }
    		  }
    	  }
    	  SRCOMRCM.MSGF.moveLeftPad("MVXMSG"); 		//A	HM3IMPRO-358 240716
         //   Check from value
         WK1.clear();
         X1 = DSP.S0FLEN;
         X1++;
         if (X1 <= 21) {
            WK1.setCharAt(X1 - 1, '\u0000');
            WK1.setCharAt(X1 - 1, '\u0020');
         }
         WK2.moveLeft(DSP.WSFVAA);
         for (X1 = 1; X1 <= DSP.S0FLEN; X1++) {
            if (X1 <= 21) {
               WK2.setCharAt(X1 - 1, ' ');
            }
         }
         if (X1 > DSP.S0FLEN) {
            X1 = DSP.S0FLEN;// last val for index
         }
         XWK1.moveLeft(WK1);
         XWK2.moveLeft(WK2);
         if (XWK2.NE(XWK1) && !XWK2.isBlank()) {
            IN73 = true;
            picSetMethod('D');
            //   MSGID=WFVA101 From value &1 is invalid
            COMPMQ("WFVA101", formatToString(DSP.WSFVAA));
            //   Mark changed records as changed again
            IN60 = true;
            IN70 = toBoolean(DSP.S0IN70);
            IN76 = toBoolean(DSP.S0IN76);
            DSP.clearOption();
            DSP.updateSFL("ES");
            return;
         }
         //   Check to value
         WK2.moveLeft(DSP.WSTVAA);
         for (X1 = 1; X1 <= DSP.S0FLEN; X1++) {
            if (X1 <= 21) {
               WK2.setCharAt(X1 - 1, ' ');
            }
         }
         if (X1 > DSP.S0FLEN) {
            X1 = DSP.S0FLEN;// last val for index
         }
         XWK1.moveLeft(WK1);
         XWK2.moveLeft(WK2);
         if (XWK2.NE(XWK1) && !XWK2.isBlank()) {
            IN74 = true;
            picSetMethod('D');
            //   MSGID=WTVA101 To value &1 is invalid
            COMPMQ("WTVA101", formatToString(DSP.WSTVAA));
            //   Mark changed records as changed again
            IN60 = true;
            IN70 = toBoolean(DSP.S0IN70);
            IN76 = toBoolean(DSP.S0IN76);
            DSP.clearOption();
            DSP.updateSFL("ES");
            return;
         }
         //   Check new value (Not too long)
         WK2.moveLeft(DSP.WSUVAA);
         for (X1 = 1; X1 <= DSP.S0FLEN; X1++) {
            if (X1 <= 21) {
               WK2.setCharAt(X1 - 1, ' ');
            }
         }
         if (X1 > DSP.S0FLEN) {
            X1 = DSP.S0FLEN;// last val for index
         }
         XWK1.moveLeft(WK1);
         XWK2.moveLeft(WK2);
         if (XWK2.NE(XWK1) && !XWK2.isBlank()) {
            IN75 = true;
            picSetMethod('D');
            //   MSGID=WUVA101 New value &1 is invalid
            COMPMQ("WUVA101", formatToString(DSP.WSUVAA));
            //   Mark changed records as changed again
            IN60 = true;
            IN70 = toBoolean(DSP.S0IN70);
            IN76 = toBoolean(DSP.S0IN76);
            DSP.clearOption();
            DSP.updateSFL("ES");
            return;
         }
         //   Check numeric values
         if (DSP.S0FLDT == 'P') {
            //   Check from value if numeric
            this.PXDCCD = DSP.S0DCCD;
            this.PXFLDD = DSP.S0FLEN%100;
            this.PXEDTC = 'M';
            this.PXDCFM = LDAZD.DCFM;
            this.PXNUM = 0d;
            this.PXALPH.clear();
            WK2.moveLeft(DSP.WSFVAA);
            X1 = DSP.S0FLEN;
            X1++;
            if (X1 <= 21) {
               WK2.fill(' ', X1 - 1);
            }
            this.PXALPH.moveLeft(WK2);
            SRCOMNUM.COMNUM();
            if (SRCOMNUM.PXNMER != 0) {
               IN73 = true;
               picSetMethod('D');
               //   MSGID=XNU0000 Numeric error
               COMPMQ("XNU000" + formatToString(SRCOMNUM.PXNMER, 1));
               //   Mark changed records as changed again
               IN60 = true;
               IN70 = toBoolean(DSP.S0IN70);
               IN76 = toBoolean(DSP.S0IN76);
               DSP.clearOption();
               DSP.updateSFL("ES");
               return;
            }
            XXFVAL = this.PXNUM;
            //   Check to value if numeric
            this.PXDCCD = DSP.S0DCCD;
            this.PXFLDD = DSP.S0FLEN%100;
            this.PXEDTC = 'M';
            this.PXDCFM = LDAZD.DCFM;
            this.PXNUM = 0d;
            this.PXALPH.clear();
            WK2.moveLeft(DSP.WSTVAA);
            X1 = DSP.S0FLEN;
            X1++;
            if (X1 <= 21) {
               WK2.fill(' ', X1 - 1);
            }
            this.PXALPH.moveLeft(WK2);
            SRCOMNUM.COMNUM();
            if (SRCOMNUM.PXNMER != 0) {
               IN74 = true;
               picSetMethod('D');
               //   MSGID=XNU0000 Numeric error
               COMPMQ("XNU000" + formatToString(SRCOMNUM.PXNMER, 1));
               //   Mark changed records as changed again
               IN60 = true;
               IN70 = toBoolean(DSP.S0IN70);
               IN76 = toBoolean(DSP.S0IN76);
               DSP.clearOption();
               DSP.updateSFL("ES");
               return;
            }
            XXTVAL = this.PXNUM;
            //   Check new value if numeric
            this.PXDCCD = DSP.S0DCCD;
            this.PXFLDD = DSP.S0FLEN%100;
            this.PXEDTC = 'M';
            this.PXDCFM = LDAZD.DCFM;
            this.PXNUM = 0d;
            this.PXALPH.clear();
            WK2.moveLeft(DSP.WSUVAA);
            X1 = DSP.S0FLEN;
            X1++;
            if (X1 <= 21) {
               WK2.fill(' ', X1 - 1);
            }
            this.PXALPH.moveLeft(WK2);
            SRCOMNUM.COMNUM();
            if (SRCOMNUM.PXNMER != 0) {
               IN75 = true;
               picSetMethod('D');
               //   MSGID=XNU0000 Numeric error
               COMPMQ("XNU000" + formatToString(SRCOMNUM.PXNMER, 1));
               //   Mark changed records as changed again
               IN60 = true;
               IN70 = toBoolean(DSP.S0IN70);
               IN76 = toBoolean(DSP.S0IN76);
               DSP.clearOption();
               DSP.updateSFL("ES");
               return;
            }
         }
         //   Check from/to value
         if (DSP.S0FLDT == 'A') {
            WK1.moveLeft(DSP.WSFVAA);
            WK2.moveLeft(DSP.WSTVAA);
            X1 = DSP.S0FLEN + 1;
            if (X1 <= 21) {
               WK1.fill(' ', X1 - 1);
               WK2.fill(' ', X1 - 1);
            }
            XWK1.moveLeft(WK1);
            XWK2.moveLeft(WK2);
         }
         
         //check if FROM or TO value is blank 
         
         if(XWK1.NE(XWK2)&& XXWARN == false &&
        		 (DSP.S0FLDI.EQ("MMITNO"))){ 				//A	HM3IMPRO-358 240712
        	 XXWARN = true; 													//A	HM3IMPRO-358 240712
        	 IN73 = true; 														//A	HM3IMPRO-358 240712
             picSetMethod('D'); 												//A	HM3IMPRO-358 240712
             //   MSGID=ZCR8002 Please confirm the range of 'From Value' and 'To value' is correct		//A	HM3IMPRO-358 240712
             SRCOMRCM.MSGF.moveLeftPad("CUSMSG");
             COMPMQ("ZCR8002"); 												//A	HM3IMPRO-358 240712
             //   Mark changed records as changed again 						//A	HM3IMPRO-358 240712
             IN60 = true; 														//A	HM3IMPRO-358 240712
             IN70 = toBoolean(DSP.S0IN70); 										//A	HM3IMPRO-358 240712
             IN76 = toBoolean(DSP.S0IN76); 										//A	HM3IMPRO-358 240712
             DSP.clearOption(); 												//A	HM3IMPRO-358 240712
             DSP.updateSFL("ES"); 												//A	HM3IMPRO-358 240712
             return; 		//A	HM3IMPRO-358 240712
         } 		//A	HM3IMPRO-358 240712


         if (DSP.S0FLDT == 'A' &&
             XWK1.GT(XWK2) ||
             DSP.S0FLDT == 'P' &&
             XXFVAL > (XXTVAL + EPS_9)) {
            IN73 = true;
            picSetMethod('D');
            //   MSGID=XFG0001 From value is greater than to value
            COMPMQ("XFG0001");
            //   Mark changed records as changed again
            IN60 = true;
            IN70 = toBoolean(DSP.S0IN70);
            IN76 = toBoolean(DSP.S0IN76);
            DSP.clearOption();
            DSP.updateSFL("ES");
            return;
         }
         //   Check update code
         if (DSP.WSUUVA < 0 || DSP.WSUUVA > 1) {
            IN71 = true;
            picSetMethod('D');
            //   MSGID=WUU0101 Update new value &1 is invalid
            COMPMQ("WUU0101", formatToString(DSP.WSUUVA, 1));
            //   Mark changed records as changed again
            IN60 = true;
            IN70 = toBoolean(DSP.S0IN70);
            IN76 = toBoolean(DSP.S0IN76);
            DSP.clearOption();
            DSP.updateSFL("ES");
            return;
         }
         //   Check value type
         if (DSP.WSUVAT < 0 || DSP.WSUVAT > 2) {
            IN72 = true;
            picSetMethod('D');
            //   MSGID=WUVA201 Change method &1 is invalid
            COMPMQ("WUVA201", formatToString(DSP.WSUVAT, 1));
            //   Mark changed records as changed again
            IN60 = true;
            IN70 = toBoolean(DSP.S0IN70);
            IN76 = toBoolean(DSP.S0IN76);
            DSP.clearOption();
            DSP.updateSFL("ES");
            return;
         }
         //   Mark changed records as changed again
         IN60 = true;
         IN70 = toBoolean(DSP.S0IN70);
         IN76 = toBoolean(DSP.S0IN76);
         DSP.clearOption();
         DSP.updateSFL("ES");
         IN93 = DSP.readSFL("ES");
      }
   }

    	 	
   public boolean XXWARN; 		//A	HM3IMPRO-358 240712
   public int XXCNTR; 			//A	HM3IMPRO-358 240715
   public String XZFILE;  		//A	HM3IMPRO-358 240715

   //*KEY KSYSTR{

   //public CRS800DSP DSP;

   //public GenericDSP getDSP() {
      //return (GenericDSP)DSP;
   //}

   public String getVer() {
      return version;
   }

   public final String version = "Pgm.Name: CRS800, " + "Source creation date: Tue Oct 30 17:08:20 CET 2001, " + "ID number: 1004458100969";

   public String getVersion() {
      return _version;
   } //·end of method getVersion

   public String getRelease() {
      return _release;
   } //·end of method getRelease

   public String getSpLevel() {
      return _spLevel;
   } //·end of method getSpLevel

   public String getSpNumber() {
      return _spNumber;
   } //·end of method getSpNumber

   public final static String _version = "15";
   public final static String _release = "1";
   public final static String _spLevel = "4";
   public final static String _spNumber ="MAK_KULKOZ_240718_12:09";
   public final static String _GUID = "B6656FC5460849b2B973BD4E806A0211";
   public final static String _tempFixComment = "";
   public final static String _build = "000000000000062";
   public final static String _pgmName = "CRS800";

   public String getGUID() {
      return _GUID;
   } //·end of method getGUID

   public String getTempFixComment() {
      return _tempFixComment;
   } //·end of method getTempFixComment

   public String getVersionInformation() {
      return _version + '.' + _release + '.' + _spLevel + ':' + _spNumber;
   } //·end of method getVersionInformation

   public String getBuild() {
      return (_version + _release + _build + "      " + _pgmName + "                                   ").substring(0, 34);
   } //·end of method getBuild


   /**
   *    INIT - Init subroutine
   */
   public void INIT() {
      XBIN91.fill('0');
      XEIN91.fill('0');
      SYSTR.setDIVI().clear();
      this.PXCONO = LDAZD.CONO;
      this.PXDIVI.clear();
      this.PXPGNM.move(this.DSPGM);
      this.PXAUPF.moveRight(LDAZD.AUPF);
      this.PXDFMI.move("TIME");
      this.PXDATI = 0;
      this.PXDFMO.move("YMD8");
      this.PXOPRM = 1;
      COMDAT();
      this.CUDATE = this.PXDATO;
      //   Check authority
      PXAUTCHK.CAUTCHK();
      this.PXO.move(this.PXALOP);
      //   Not allowed to run program
      if (this.PXALPG == 0) {
         //   MSGID=XAU0002 You are not authorized to run the program &1
         SRCOMRCM.MSGLVL.moveLeft("*PRV");
         COMPMQ("XAU0002", formatToString(this.DSPGM));
         SETLR();
         return;
      }
      //   Field authority
      moveToIN(1, LDAZD.AUFI);
      //   Clear display
      //   Check start values
      IN91 = !SYSTR.CHAIN("00", KSYSTR());
      IN92 = SYSTR.getErr("00");
      if (IN91) {
         SYSTR.clear();
         CSSPIC.move(LDAZD.SPI1);
         CSOUTF.move('1'); 	
         SYSTR.setPAR1().moveLeft(XXPAR1);
         SYSTR.setCONO(LDAZD.CONO);
         SYSTR.setDIVI().clear();
         SYSTR.setPGNM().move(this.DSPGM);
         SYSTR.setRESP().move(LDAZD.RESP);
         SYSTR.setRGDT(this.CUDATE);
         SYSTR.setLMDT(SYSTR.getRGDT());
         SYSTR.WRITE("00");
      }
      XXPAR1.moveLeft(SYSTR.getPAR1());
      IN52 = toBoolean(CSIN52.getChar());
      IN53 = toBoolean(CSIN53.getChar());
      IN54 = toBoolean(CSIN54.getChar());
      CSDCCD.move(' ');
      CSUPDC.move(' ');
      DSP.WWOUTF = toInt(CSOUTF.getChar()); 	
      PXOUTF.moveLeft(CSOUTF); 	
      //   Check start picture
      if (!LDAZZ.FPNM.isBlank() && !LDAZZ.PICC.isBlank()) {
         picSet(LDAZZ.PICC);
      } else {
         picSetPanel(CSSPIC.getChar());
         picSetMethod('I');
      }
      //   Get Free texts
      SYPAR.setCONO(LDAZD.CONO);
      SYPAR.setDIVI().clear();
      SYPAR.setSTCO().clear();
      SYPAR.setSTCO().moveLeft("CRS703");
      IN91 = !SYPAR.CHAIN("00", SYPAR.getKey("00"));
      IN92 = SYPAR.getErr("00");
      if (IN91) {
         CRS703DS.setCRS703DS().clear();
      } else {
         CRS703DS.setCRS703DS().moveLeft(SYPAR.getPARM());
      }
      SYPAR.setSTCO().clear();
      SYPAR.setSTCO().moveLeft("CRS715");
      IN91 = !SYPAR.CHAIN("00", SYPAR.getKey("00"));
      IN92 = SYPAR.getErr("00");
      if (IN91) {
         CRS715DS.setCRS715DS().clear();
      } else {
         CRS715DS.setCRS715DS().moveLeft(SYPAR.getPARM());
      }
      SYPAR.setSTCO().clear();
      SYPAR.setSTCO().moveLeft("CRS712");
      IN91 = !SYPAR.CHAIN("00", SYPAR.getKey("00"));
      IN92 = SYPAR.getErr("00");
      if (IN91) {
         CRS712DS.setCRS712DS().clear();
      } else {
         CRS712DS.setCRS712DS().moveLeft(SYPAR.getPARM());
      }
      SYPAR.setSTCO().clear();
      SYPAR.setSTCO().moveLeft("CRS713");
      IN91 = !SYPAR.CHAIN("00", SYPAR.getKey("00"));
      IN92 = SYPAR.getErr("00");
      if (IN91) {
         CRS713DS.setCRS713DS().clear();
      } else {
         CRS713DS.setCRS713DS().moveLeft(SYPAR.getPARM());
      }
      XNDATR = '\u0000';
      XNDATR = '\u0020';
      XNDATR = '\u0020';
   }

// Movex MDB definitions end

   public void initMDB() {
      CR800 = (mvx.db.dta.CCR800)getMDB("CCR800", CR800);
      CR800.setAccessProfile("00", 'U');
      SYSTR.setAccessProfile("00", 'U');
      SYPAR = (mvx.db.dta.CSYPAR)getMDB("CSYPAR", SYPAR);
      SYPAR.setAccessProfile("00", 'R');
      JBCMD = (mvx.db.dta.CJBCMD)getMDB("CJBCMD", JBCMD);
      JBCMD.setAccessProfile("00", 'U');
      SYCAL.setAccessProfile("00", 'R');
   }

public void initDSP() {
      if (DSP == null) {
         DSP = new CRS800DSP(this);
      }
   }


   public String [][] getCustomerModification() {
      return _customerModifications;
   } // end of method [][] getCustomerModification()

   public final static String [][] _customerModifications={
      {"HM3IMPRO-358","240718","KULKOZ","Add Validation Warning"}
   };
}
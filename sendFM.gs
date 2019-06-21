function postToFilemaker(e) {

  //--- parse the "e" event object that googlesheets passes the script ---//
  validate()
  var googleFormData = JSON.stringify(e) ;  //  Logger.log(googleFormData);

  //--- configure filemaker connection ---//
  var serverPath = "https://yourDomain.com/fmi/data/v1/databases/" ; // change url with your own domain server
  var filename = "databaseName";  // put here database name
  var account = "userFMAccount" ; // use your own FileMaker user
  var password = "userPasswordFMAccount" ; // use your own FileMaker user account password here

  //--- configure filemaker data ---//
  var layout = "googleFormsAnamnesis" ;  // use layout destination name in FileMaker database
  var recordData = { 
                    "formularioData":googleFormData   // substitute "formularioData" by your own destination field name
                   }; 

 //--- all configurations should be set above this comment
 //--- there should be no need to edit the code below...

  login()
  post()
  logout()

  //-- functions

    function login() {
      //authenticate to get FM-Data-token using http
      authUrl = serverPath.concat( filename , "/sessions" ) ;
      var data = {  
                 }
      var payload = JSON.stringify(data);
      var headers =
          {
            "content-type": "application/json",
            "Authorization": "Basic yourOwnBase64UserAndPassword",   // encode "user:password" to base64 and use here
          };
      var options =
          {
            "method": "POST",
            "headers": headers,
            "payload": payload,
            "muteHttpExceptions": true
          };
      var response = UrlFetchApp.fetch(authUrl,options);
      // Logger.log(response.getContentText());
      var dataAll = JSON.parse(response.getContentText());
      // Logger.log(dataAll);
      fmDataToken = dataAll.response.token;
  }
  

  function post() {
      //  use fmDataToken to post to Filemaker using http
      // var url = serverPath.concat("/record/",filename,"/",layout);  //   Logger.log(url); 
      var url = serverPath.concat(filename,"/layouts/",layout,"/records");
      // Logger.log(url);

      var headers =
          {
            "content-type": "application/json",
            "Authorization": "Bearer "+fmDataToken
         };
      Logger.log(headers);
      var data = { "fieldData": recordData } ;
      var payload = JSON.stringify(data);  //   Logger.log(payload);
      var options =
          {
            "method": "POST",
            "headers": headers,
            "payload" : payload,
            "muteHttpExceptions": true
          }
      var response = UrlFetchApp.fetch(url,options);
      var fmApiResponse = response ;
  }
  
  function logout() {
      // logout fmDataToken using http
      outUrl = serverPath.concat( filename , "/sessions" , fmDataToken ) ;
      var headers =
          {
            "content-type": "application/json"
          };
      var options =
          {
            "method": "DELETE",
            "headers": headers,
            "muteHttpExceptions": true
          };
      var response = UrlFetchApp.fetch(outUrl,options);  //  Logger.log(response);
  }

  function validate() {
        // e is the "event" parameter passed from Google Forms.
        // if e is empty, we are debugging script and running it from script editor where no event parameter would be passed
        if (!e){
            e = {"values":["Testing"],"namedValues":{"Message":["Test Data While Debugging"],"Timestamp":["2/9/2018 20:17:37"]},"range":{},"source":{},"authMode":{},"triggerUid":"1296973926"}
        }
        googleFormNamedValues = JSON.stringify(e.namedValues) ;  //  Logger.log(googleFormData);
  }

}


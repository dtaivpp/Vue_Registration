const AWS = require('aws-sdk');

// Used to parse the form data
const querystring = require('querystring');

// Set this to the region you upload the Lambda function to.
AWS.config.update({region: 'us-east-1'});

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

exports.handler = function(evt, context, callback) {
    
    // Parse the querystring for use
    const data = JSON.parse(evt.body);
    const today = new Date();
    const todayString = today.toISOString();

  var requestParams = {
    TableName: "RegistrationTotals",
    Key:{
      "Tabletotal":{ S:"ActiveRegistrants" }
    }
  }

  ddb.getItem(requestParams,function(err, requestedData){
    if(err){
      console.log(err,err.stack);
    } else {
      if((requestedData.Item.Total + data.registrants.length()) > 30){
        data.TableName = "waitlistedRegistrants";
      } else {
        data.TableName = "ActiveRegistrants";
      }
      putElements(getParams());
    }
  });

  function getParams(){
    var params = {
      TableName: data.TableName,
      Item: {
        'NAME' : {S: data.Name},
        'DATE_OF_BIRTH' : {S: data.DOB},
        'PHONE_NUMBER' : {S: data.PhoneNumber},
        'EMAIL' : {S: data.Email},
        'STREET_ADDRESS' :{S: data.StreetAddress},
        'CITY_NAME' : {S: data.City},
        'STATE_NAME' : {S: data.State},
        'ZIPCODE' : {S: data.ZipCode},
        'INQ_DATE' : {S: todayString}
      }
    };
    return params;
  };

  function putElements(params){
    // Call DynamoDB to add the item to the table
    ddb.putItem(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    });
  };
};

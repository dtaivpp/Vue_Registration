var aws = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});

var ses = new aws.SES({
   region: 'us-east-1'
});

const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

exports.handler = function(event, context) {
    console.log("Incoming: ", event);
   // var output = querystring.parse(event);

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
        // For loop to iterate through entries
        data = requestedData;
      //
      sendEmail(data);
    }
  });

  function sendEmail(data){
    var eParams = {
        Destination: {
            ToAddresses: [data.EmailAddress]
        },
        Message: {
            Body: {
                Text: {
                    Data: ""
                }
            },
            Subject: {
                Data: "Registration"
            }
        },
        Source: "Registration@regent.edu"
    };

    console.log('===SENDING EMAIL===');
    var email = ses.sendEmail(eParams, function(err, data){
        if(err) console.log(err);
        else {
            console.log("===EMAIL SENT===");
            console.log(data);


            console.log("EMAIL CODE END");
            console.log('EMAIL: ', email);
            context.succeed(event);

        }
    });
  }
};
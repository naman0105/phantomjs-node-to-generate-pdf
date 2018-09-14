
var pdf = require('html-pdf');
var AWS = require('aws-sdk');
var fs = require('fs');
var ejs = require('ejs');
const path = require('path');

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

var options = { format: 'Letter', phantomPath: './phantomjs_lambda/phantomjs_linux-x86_64' };
var S3config = { bucketName: 'bhashamybucket' };

module.exports.generatePdf = function(event, context, callback) {

  var fileName = event.fileName;
  var filePath = __dirname + "/index.ejs";
  var htmlString = "hel";

  fs.readFile(filePath, function(err, data){
	console.log(data);
	if(err){
		callback("error while rendering data");	
	} else{
		htmlString = ejs.render(data.toString(),{name:event.user.firstName + " " + event.user.lastName,
		email:event.user.email,
		course:event.user.course,
		joinedDate:event.user.joined,
		dateFrom:event.metadata.fromDate,
		dateTill:event.metadata.toDate,
		currentDate: Date.now()
		});
	}

  pdf.create(htmlString, options).toBuffer(function(err, buffer){
      if (err){
        console.log("There was an error generating the PDF file");
        console.log(err);
        var error = new Error("There was an error generating the PDF file");
        callback(error);
      }
      else {
        var s3 = new AWS.S3();
        var params = {
            Bucket : S3config.bucketName,
            Key : 'pdfs/' + fileName + '.pdf',
            Body : buffer
        }

        s3.putObject(params, function(err, data) {
            if (err) {
                console.log("There was an error while saving the PDF to S3");
                console.log(err);
                var error = new Error("There was an error while saving the PDF to S3");
                callback(error);
            } else {
                console.log('Created PDF with data:');
                console.log(data);

                context.done(null, { result: 'Created PDF file' });
            }
        });
      }
  });
});
};

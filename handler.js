
var pdf = require('html-pdf');
// var aws = require('aws-sdk');
var fs = require('fs');
var ejs = require('ejs');
// var nodemailer = require("nodemailer");
const path = require('path');

process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

var options = { format: 'A4', phantomPath: './phantomjs_lambda/phantomjs_linux-x86_64' };
// var S3config = { bucketName: 'bhashamybucket' };

// aws.config.update({region: 'us-east-1'});
// var s3 = new aws.S3();
// var ses = new aws.SES();


    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];


// function getS3File(bucket, key) {
//     return new Promise(function (resolve, reject) {
//         s3.getObject(
//             {
//                 Bucket: bucket,
//                 Key: key
//             },
//             function (err, data) {
//                 if (err) return reject(err);
//                 else return resolve(data);
//             }
//         );
//     })
// }


var formatDate = function(date){

    var d = new Date(date);
   var month = monthNames[d.getMonth()]
   var day = d.getDate()
   var year = d.getFullYear()
   console.log(month + " " + day + ", "+year)
   return month + " " + day + ", "+year 
}

var generatePdf = function(event, context, callback) {

    event = {
    "user": {
        "first_name": "",
        "last_name": "",
        "user_id": "36485",
        "email": "jgkrishnan01@gmail.com",
        "course": "english_to_kanada",
        "joined": "2018-06-26T02:49:16.061Z"
    },
    "metadata": {
        "from_date": "2018/07/16 12:14:47",
        "to_date": "2018/09/14 12:14:47"
    },
    "dates": [
        "07/31/2018",
        "08/02/2018",
        "08/03/2018",
        "08/11/2018",
        "08/12/2018",
        "09/10/2018"
    ],
    "good_words": [
        {
            "word": "noḍi",
            "wordEnglish": "watch",
            "score": 2
        },
        {
            "word": "maaḍi",
            "wordEnglish": "do",
            "score": null
        },
        {
            "word": "hogi",
            "wordEnglish": "go",
            "score": 2.25
        },
        {
            "word": "hogu",
            "wordEnglish": "go",
            "score": 1.7
        },
        {
            "word": "keḷbeḍa",
            "wordEnglish": "don't listen",
            "score": 1.75
        },
        {
            "word": "somaari",
            "wordEnglish": "lazy",
            "score": null
        },
        {
            "word": "aḍuge",
            "wordEnglish": "cook",
            "score": null
        },
        {
            "word": "tagoḷi",
            "wordEnglish": "take",
            "score": 1.25
        },
        {
            "word": "udyaana",
            "wordEnglish": "garden",
            "score": null
        },
        {
            "word": "aagbeḍa",
            "wordEnglish": "don't become",
            "score": 1.75
        },
        {
            "word": "aagi",
            "wordEnglish": "become",
            "score": 1.75
        },
        {
            "word": "sutta",
            "wordEnglish": "round",
            "score": 0.875
        },
        {
            "word": "heḷi",
            "wordEnglish": "tell",
            "score": 1.25
        }
    ],
    "bad_words": [
        {
            "word": "noḍu",
            "wordEnglish": "see",
            "score": 1.75
        },
        {
            "word": "tagoḷbeḍa",
            "wordEnglish": "don't take",
            "score": 2.2857142857142856
        },
        {
            "word": "pakka",
            "wordEnglish": "beside",
            "score": 1
        },
        {
            "word": "keḷi",
            "wordEnglish": "listen",
            "score": 1.25
        },
        {
            "word": "heḷbeḍa",
            "wordEnglish": "don't tell",
            "score": 1.375
        },
        {
            "word": "suttalina",
            "wordEnglish": "around",
            "score": 1.25
        },
        {
            "word": "mara",
            "wordEnglish": "tree",
            "score": null
        },
        {
            "word": "nodbeḍi",
            "wordEnglish": "don't see",
            "score": 2.25
        },
        {
            "word": "muleyalli",
            "wordEnglish": "corner",
            "score": 1.25
        },
        {
            "word": "madhya",
            "wordEnglish": "center",
            "score": 1
        },
        {
            "word": "nera",
            "wordEnglish": "straight",
            "score": 1.25
        },
        {
            "word": "varga",
            "wordEnglish": "class",
            "score": null
        },
        {
            "word": "banni",
            "wordEnglish": "come",
            "score": null
        }
    ],
    "good_lessions": [
        {
            "name": "KFE-L-L11-1",
            "score": 94,
            "title": "Verbs - do, come"
        },
        {
            "name": "KFE-L-L11-2",
            "score": 93.25,
            "title": "Verbs - take, go, become"
        },
        {
            "name": "KFE-L-L11-3",
            "score": 90.75,
            "title": "Verbs - see, hear, tell"
        }
    ],
    "bad_lessions": [
        {
            "name": "KFE-L-L10-3",
            "score": 68,
            "title": "Many more directions"
        },
        {
            "name": "KFE-L-L12-2",
            "score": 50,
            "title": "maaḍi - Present perfect"
        },
        {
            "name": "KFE-L-L10-4",
            "score": 0,
            "title": "This side and that side"
        },
        {
            "name": "KFE-L-L11-5",
            "score": 0,
            "title": "Verbs - speak, read, run"
        }
    ],
    "good_levels": [
        {
            "name": "L11",
            "score": 69.5
        }
    ],
    "bad_levels": [
        {
            "name": "L12",
            "score": 50
        },
        {
            "name": "L10",
            "score": 34
        }
    ]
    }

  console.log(event);

  var fileName = event.user.user_id + event.user.course + Date.now();
  var filePath = __dirname + "/index.ejs";
  var htmlString = "hel";
  var date = new Date()

//logic to get the unique months in dates
  var monthsCalender = []
  var monthFirstDay = []
  var daysActiveMonth = {}
  var monthSelectedNames = []
  var daysForCalender = ['Mo','Tu','We','Th','Fr','Sa','Su']
  var maximumMonths = 3
  var width = 30;
  var noOfDaysMonth = []
  for(var i=event.dates.length-1; i>=0; i--){
    var da = new Date(event.dates[i])
    var mo = da.getMonth();
    if(monthsCalender.indexOf(mo) === -1 && monthsCalender.length == maximumMonths){
        break;
    } 
    else if(monthsCalender.indexOf(mo) === -1){
        monthsCalender.push(mo)
        daysActiveMonth[mo] = []
        daysActiveMonth[mo].push(da.getDate())        
    } else{
        daysActiveMonth[mo].push(da.getDate())
    }
  }
  console.log(monthsCalender)

  for(var i=monthsCalender.length-1; i>=0 ; i--){
    monthSelectedNames.push(monthNames[monthsCalender[i]])
    // console.log(monthsCalender[i] + 1)
    var newDate = monthsCalender[i]+1
    // console.log(newDate)
    var da = new Date(newDate.toString());
    // console.log(da)
    monthFirstDay.push(da.getDay())
  }
  console.log(monthSelectedNames)

  if(monthsCalender.length == 2){
    width = 45
  } else if(monthsCalender.length == 1) {
    width = 90
  }

  for(var i=0; i<12; i++){
    var d = new Date((new Date()).getFullYear(),i,0);
    noOfDaysMonth.push(d.getDate())
  }
  console.log("noofdays",noOfDaysMonth)


  var emailOfUser = event.user.email;

  emailOfUser = "naman@bhasha.io";

  console.log("pdf lambda starting")
  console.log(event.good_lessions.length);

  fs.readFile(filePath, function(err, data){
    console.log(data);
    if(err){
        callback("error while rendering data"); 
    } else{
        htmlString = ejs.render(data.toString(),{name:event.user.first_name + " " + event.user.last_name,
        email:event.user.email,
        course:event.user.course,
        joinedDate:formatDate(event.user.joined),
        dateFrom:formatDate(event.metadata.from_date),
        dateTill:formatDate(event.metadata.to_date),
        currentDate: formatDate(date),
        goodLessions: event.good_lessions,
        badLessions: event.bad_lessions,
        goodLevels: event.good_levels,
        badLevels: event.bad_levels,
        goodWords: event.good_words,
        badWords: event.bad_words,
        monthsCalender: monthsCalender,
        monthFirstDay: monthFirstDay,
        daysActiveMonth: daysActiveMonth,
        width: width + '%',
        monthSelectedNames: monthSelectedNames,
        noOfDaysMonth: noOfDaysMonth,
        daysForCalender: daysForCalender                 
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

                fs.writeFile("exp.pdf",buffer)

      }
  });
});
};
generatePdf()

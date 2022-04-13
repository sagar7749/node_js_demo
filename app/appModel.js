'user strict';
const util = require('util');
var sql = require('./db.js');
var helper = require('./helpers.js');
var dateTime = require('node-datetime');
var dateFormat = require('dateformat');
var async = require("async");
const multer = require('multer');
const path = require('path');
var fs = require('fs');
var moment = require("moment-timezone");
var Request = require("request");
const jwt = require('jsonwebtoken');
var newTimeAgo = require("node-time-ago")
const { json } = require('body-parser');
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
const { first, set } = require('lodash');
const ffmpeg = require('fluent-ffmpeg');
// ffmpeg.setFfmpegPath("/usr/local/bin/ffmpeg");
ffmpeg.setFfmpegPath("C:/FFmpeg/bin/ffmpeg.exe");
ffmpeg.setFfprobePath("C:/FFmpeg/bin/ffprobe.exe");
const shuffle = require('shuffle-array');

// APN
var apn = require('apn');
var join = require('path').join
    , pfx = join(__dirname, '/vipme.p12');

var options = {
    pfx: pfx,
    passphrase: '1234',
    production: false
};
var apnProvider = new apn.Provider(options);

const appName = 'Mosque';

//Model object constructor
var Model = function (object) { };

//console.log(`moment().fromNow()`,moment("2020-05-18", "YYYY-MM-DD").fromNow());

//Braintree Credentials
var braintree = require("braintree");
const { Console } = require('console');
const { exit } = require('process');
var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_merchantId,
    publicKey: process.env.BRAINTREE_publicKey,
    privateKey: process.env.BRAINTREE_privateKey
});

//Strip Payment Gateway
// var stripe = require('stripe')('Your_Secret_Key');
var Publishable_Key = 'pk_test_51IlDtyGAYWqSYyB4N774MgvWPltEVqK9FJBBiezih8pkcr224D87qhKAVmbg0oXAUtMYcwMstAtLkQO9o39GiiCP00tqd3iUNw'
var Secret_Key = 'sk_test_51IlDtyGAYWqSYyB4bv98nFWsSrxf9ek6YXjTJidkLpWQa0sr4Hi3sYQlelCZGU0dGDsI8PZnrbZ1XyUBeELkxBOg00QTvXGuvG'
  
const stripe = require('stripe')(Secret_Key)
  

//TokBox SDK implement

var apiKey = process.env.OPENTOK_apiKey;
var apiSecret = process.env.OPENTOK_apiSecret;
var OpenTok = require('opentok'),
    opentok = new OpenTok(apiKey, apiSecret);


//-------------------------------------------------------------//
Model.demoModel = async function demoModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var response_arr = [];
    var moment = require('moment'); // require
    console.log('--------------------Paymen Gateway------------------');
    /*const customer = await stripe.customers.list({
        email:'malisagar1995@gmail.com'
    });
      console.log('customer',customer);
      console.log('customer',customer.email);
      */
    
    /*------ Get Default Card ----------*/
    // const customer = await stripe.customers.retrieve(
    // 'cus_JfTgZVR9aHv1uW'
    // );

    // var card = await stripe.customers.retrieveSource(
    //     'cus_JfTgZVR9aHv1uW',
    //     'card_1J2A3AGAYWqSYyB4cUmSr9oZ'
    //   );
    //     console.log('card',card);
    // const customer = await stripe.customers.update(
    //     'cus_JfTgZVR9aHv1uW',
    //     { source: card.id },
    // );

    const card = await stripe.customers.createSource(
        'cus_JfTgZVR9aHv1uW',
        {source: 'card_1J2A3AGAYWqSYyB4cUmSr9oZ'}
      );
      

    console.log('customer',customer);

    console.log('--------------------Date Condition------------------');
    var Today = moment().format('YYYY-MM-DD');
    var selectedDate = moment().format('2020-06-25', 'YYYY-MM-DD');
    console.log(' Selected Date', selectedDate, '& Demo current Date', Today);
    if (selectedDate >= Today) {
        console.log('Yes');
    } else {
        console.log('No');
    }
    console.log('--------------------Month Condition------------------');
    var Month = moment().format('YYYY-MM');
    var selectedMonth = moment().format('2020-08', 'YYYY-MM');
    console.log(' Selected Month', selectedMonth, '& Demo current Month', Month);
    if (selectedMonth >= Month) {
        console.log('Yes');
    } else {
        console.log('No');
    }
    console.log('------------------------------------------------------');

    response_arr['success'] = 1;
    response_arr['msg'] = 'This is demo!';
    response_arr['data'] = customer;
    result(null, response_arr);

};

//-----------------Cron-----------------------//
var CronJob = require('cron').CronJob;
// var job = new CronJob('* * * * * *', function() { console.log('You will see this message every second');
var job = new CronJob('*/5 * * * *', function() {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d');
    var Cur_time = dt.format('H:M');
    var moment = require('moment'); // require
    var response_arr = [];
    
    console.log('running a task every 5 minutes');
    
    var query_text = `SELECT *,DATE_FORMAT(date,'%Y-%m-%d') as prayer_date FROM mosque_prayer_time WHERE date(date) = '${today}' AND time(prayer_time) >= '${Cur_time}'  `;
    // console.log('query_text',query_text);
    var q = sql.query(query_text,async function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        for(var i= 0; i < res.length; i++)
        {
            prayer_id = res[i].id;
            mosque_id = res[i].mosque_id;
            prayer_name = res[i].prayer_name;

            var setDate = res[i].prayer_date+' '+res[i].prayer_time;
            var current_DateTime = moment().format('YYYY-MM-DD HH:mm');
            var sub_prayerDateTime = moment(setDate).subtract(30,'minutes').format('YYYY-MM-DD HH:mm');
            // console.log('Currnt  ',current_DateTime);
            // console.log('System ',sub_prayerDateTime);
            
            if(sub_prayerDateTime <= current_DateTime )
            {
                var getUser = await helper.sql_query(sql, `SELECT user_id FROM user_journey WHERE is_default = 1 AND mosque_id = '${mosque_id}' `).catch(console.log);
                // console.log('getUser',getUser);
                for(var j = 0 ; j < getUser.length; j++ )
                {
                    // console.log('prayer_name',getUser[j].user_id);
                    var our_user_id = getUser[j].user_id;

                    // var chk_notification = await helper.sql_query(sql, `SELECT id FROM notifications WHERE from_id = '${mosque_id}' AND user_id = '${our_user_id}' AND activity = 'prayerNotification' AND noti_type = 6 `).catch(console.log);
                    // if(chk_notification == '')
                    // {
                        //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                        var tparam = {
                            'user_ids': [our_user_id], // Registration Token For multiple users
                        };
                        helper.get_registration_token(tparam,async function (res) {
                            // if (res.length > 0) {
                                var regTokens = (res.length > 0) ? res.map(res => res.token) : [];
                                // Send Notification Message : Start
                                
                                // var set_body = `${first_name} ${last_name} wants to hire you at ${work_start_date} ${work_timing}.`;
                                var loginUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${mosque_id}' `).catch(console.log);
                                var set_body = `Dear User,'${loginUser[0].first_name}' '${loginUser[0].last_name}' Mosque '${prayer_name}' prayer start in 20 minutes on '${today}'.`; 
                                var send_param = {
                                    'registration_token': regTokens,
                                    'title': appName,
                                    'body': set_body,
                                    'extra_data': {
                                        "activity": 'prayerNotification',
                                        "user_id": our_user_id,
                                        "mosque_id": mosque_id,
                                        // "order_id": order_item_id,
                                    }
                                };
                                // console.log(send_param);
                                helper.send_notification(send_param, function (send_res) {
                                    // Save Notification Message in DB : Start
                                    var notify_params = {
                                        'user_id': our_user_id,
                                        'from_id': mosque_id,
                                        'activity': 'prayerNotification',
                                        'noti_type': 6,
                                        'description': set_body,
                                        'created_at': today,
                                    }
                                    helper.save_notification(notify_params);                                    
                                });
                                // Send Notification Message : End      
                            // }
                        });
                        //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                    // }
                }
            }
        }
        // console.log('Data Length',res.length);
    });

    //SELECT DISTINCT public_id,mosque_id,project_id,amount,(SELECT  MAX(id) FROM donations WHERE public_id = don.public_id AND mosque_id = don.mosque_id AND project_id = don.project_id AND auto_donation = 1 AND date(created_at) BETWEEN '2021-05-17' AND '2021-06-17'  order by id DESC ) as donation_id FROM donations as don WHERE auto_donation = 1 AND date(created_at) BETWEEN '2021-05-17' AND '2021-06-17'  order by id DESC

    var current_DateTime = moment().format('YYYY-MM-DD');
    var one_month_before = moment(current_DateTime).subtract(1,'M').format('YYYY-MM-DD');
    //date(created_at) BETWEEN '${one_month_before}' AND '${current_DateTime}'
    getAutoDonation = `SELECT * FROM auto_donations WHERE status = 0 AND date(created_at) <= '${one_month_before}' `
    sql.query(getAutoDonation, async function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            if(res.length > 0)
            {
                for(var i = 0 ; i < res.length; i++)
                {
                    // console.log('res',res);
                    var chk_transaction = await helper.sql_query(sql, `SELECT * FROM donations WHERE auto_donation_id = '${res[i].id}' AND date(created_at) <= '${one_month_before}' `).catch(console.log);
                    if(chk_transaction.length > 0 )
                    {
                        // console.log('chk_transaction',chk_transaction);
                    }else{
                        console.log('------Auto Donation Done--------');
                        var chatData = {
                            'project_id': res[i].project_id,
                            'public_id': res[i].public_id,
                            'mosque_id': res[i].mosque_id,
                            'amount': res[i].amount,
                            'auto_donation': '1',
                            'auto_donation_id':res[i].id,
                        }
                        var autoDonation = "INSERT INTO donations SET ?";
                        sql.query(autoDonation, chatData, async function (err, insertData) {
                            if(err) {
                                console.log("error: ", err);
                                result(err, null);
                            } else {
                                console.log('Auto_Donation :',insertData.affectedRows);
                            }
                        });
                    }
                }
            }
        }
    });

    

    
}, null, true, 'America/Los_Angeles');
job.start();
//----------------Cron----------------------//

/*
var https = require('https');
// app.get('/log/goal', function(req, res){
    var options = {
      host : 'api.pray.zone',
      path : '/v2/times/this_week.json?city=surat',
      method : 'GET'
    }
  
    var request = https.request(options, function(response){
      var body = ""
      response.on('data', function(data) {
        body += data;
      });
      response.on('end', function() {
        // res.send(JSON.parse(body));
        var data = JSON.parse(body);
        // console.log('results',data.results);
        // console.log('datetime',data.results.datetime);
        // for(var i=0 ; i < data.results.datetime.length; i++ )
        // {
            
        // }

        for(var i=0 ; i < data.results.datetime.length; i++ )
        {
            var get_date = data.results.datetime[i].date.gregorian;
            
            
            var Fajr = {
                'prayer_name': 'Fajar',
                'prayer_type': '1',
                'date': get_date,
                'prayer_time': data.results.datetime[i].times.Fajr,
                'jamat_time': '',
            }
            var query_text = "INSERT INTO mosque_prayer_time SET ?";
            sql.query(query_text, Fajr, async function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                } else {
                    console.log('res',res);
                }
            });
            console.log('times Fajar',data.results.datetime[i].times.Fajr);
            console.log('times Sunrise',data.results.datetime[i].times.Sunrise);
            console.log('times Dhuhr',data.results.datetime[i].times.Dhuhr);
            console.log('times Asr',data.results.datetime[i].times.Asr);
            console.log('times Maghrib',data.results.datetime[i].times.Maghrib);
            console.log('times Isha',data.results.datetime[i].times.Isha);
            
            var getTime = data.results.datetime[i].times;
           
            console.log('Date',data.results.datetime[i].date.gregorian);
            console.log('Location',data.results.location);
            console.log('');
        }
        

      });
    });
    request.on('error', function(e) {
      console.log('Problem with request: ' + e.message);
    });
    request.end();
//   });
*/

//Chat Module

Model.chatSendMsgModel = function chatSendMsgModel(req, result) {
	var dt = dateTime.create();
	var today = dt.format('Y-m-d H:M:S');
	var fullUrl = req.protocol + '://' + req.get('host');
	var files_param = req.files;
	var param = req.body;

	var sender_id   = (param.sender_id) ? param.sender_id : '';
	var receiver_id = (param.receiver_id) ? param.receiver_id : '';
	var type        = (param.type) ? param.type : '';
	var message     = (param.message) ? param.message : '';
	var file_name     = (param.file_name) ? param.file_name : ''; // file_name important for file Name

	var response_arr = [];
    var chatInfo = [];
    var fs = require('fs');
    var dir = './public/chats';
    var dir1 = './public/chats/thumbnail';
    
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    if (!fs.existsSync(dir1)){
        fs.mkdirSync(dir1);
    }

	var chatData = {
		'sender_id': sender_id,
		'receiver_id': receiver_id,
		'type': type,
		'message': message,
		'created_at': today,
	}

	var query_text = "INSERT INTO chat_messages SET ?";
	sql.query(query_text, chatData, async function (err, res) {
		if(err) {
			console.log("error: ", err);
			result(err, null);
		} else {
			var chatID = res.insertId;

			var chatFileData = {
				'chat_id': chatID,
			}

			// File Upload : Start
			var file_store = [];
			
            var chat_file = (req.files && req.files.chat_file) ? req.files.chat_file : [];
            console.log('chat Name',chat_file);
			if ((type == 2 || type == 3 || type == 4) && chatID && files_param && (typeof chat_file.length === "undefined" ||  chat_file.length > 0)) {
                console.log('check_issue');
				if(typeof chat_file.length === "undefined") {
					var fileLength = 1;
				} else if(chat_file.length > 0) {
					var fileLength = chat_file.length;
                }

				if(fileLength > 1) {
					for(var i = 0; i < fileLength; i++) {
                        
                        if(type == 3)
                        {
                            var fileName = file_name;
                        }else{
                            var fileName = 'chatFile_' + chat_file[i].md5 + path.extname(chat_file[i].name);
                        }
                        // console.log('fileName',fileName);
						// var tinyfileName = 'tinychatFile_' + chat_file[i].md5 + path.extname(chat_file[i].name);
						var newpath = "./public/chats/" + fileName;
						chat_file[i].mv(newpath, function (err) {
							if (err) { result("Error uploading file.", err); return; }
						});
						file_store.push({
							"newpath":newpath,
							// "tinypath":`public/chats/${tinyfileName}`,
							"tinypath":`public/chats/${fileName}`,
						});
						// chatFileData.file = tinyfileName;
						chatFileData.file = fileName;
						var insertChatFileData = "INSERT INTO chat_files SET ?";
						sql.query(insertChatFileData, chatFileData, function(err, result) {
							if(err) {
								console.log("error: ", err);
								result(err, null);
							}
						});
					}
				} else {
					if(type == 3)
                    {
                        // var f_name = chat_file;
                        // console.log('file name',f_name.name);
                        // var fileName = f_name+path.extname(chat_file.name);
                        var fileName = file_name;
                    }else{
                        var fileName = 'chatFile_' + chat_file.md5 + path.extname(chat_file.name);
                    }
					// var tinyfileName = 'tinychatFile_' + chat_file.md5 + path.extname(chat_file.name);
					var newpath = "./public/chats/" + fileName;
					chat_file.mv(newpath, function (err) {
						if (err) { result("Error uploading file.", err); return; }
					});
					file_store.push({
						"newpath":newpath,
						// "tinypath":`public/chats/${tinyfileName}`,
						"tinypath":`public/chats/${fileName}`,
					});
					// chatFileData.file = tinyfileName;
                    chatFileData.file = fileName;
                    
                    var thumbnail_img = (req.files && req.files.thumbnail) ? req.files.thumbnail : [];
                        console.log('Thumbnail Name',thumbnail_img);
                        if ((type == 4) && files_param && (typeof thumbnail_img.length === "undefined" ||  thumbnail_img.length > 0)) {
                            var thumbnail_img_name = 'thumbnailFile' + thumbnail_img.md5 + path.extname(thumbnail_img.name);
                            var newpath1 = "./public/chats/thumbnail/" + thumbnail_img_name;
                            thumbnail_img.mv(newpath1, function (err) {
                                if (err) { result("Error uploading file.", err); return; }
                            });
                            chatFileData.thumbnail = thumbnail_img_name;
                        }

                            // // File Upload : Start
                            // var thumbnail_img = (req.files && req.files.thumbnail) ? req.files.thumbnail : [];
                            // // console.log('profile_img type',typeof pic, 'length :',pic.length);
                            // if ((type == 4) && files_param && typeof thumbnail_img.length === "undefined") {
                            //     // console.log('single file');
                            //     var dir = './public/chats/thumbnail/';
                            //     if (!fs.existsSync(dir1)) {
                            //         fs.mkdirSync(dir1);
                            //     }
                            //     var fileName1 = 'thumbnailFile' + thumbnail_img.md5 + path.extname(thumbnail_img.name);
                            //     var newpath1 = "./public/chats/thumbnail/" + fileName1;
                            //     thumbnail_img.mv(newpath1, function (err) {
                            //         if (err) { result("Error uploading file.", err); return; }
                            //     });
                            //     chatFileData.thumbnail = fileName;
                            // }
                            // // File Upload : End
                        console.log('f',chatFileData);

					var insertPostFileData = "INSERT INTO chat_files SET ?";
					sql.query(insertPostFileData, chatFileData, function(err, result) {
						if(err) {
							console.log("error: ", err);
							result(err, null);
						}
					});
				}
            }
			/*if(file_store.length > 0){
				for (const file_data of file_store) {
					tinify.fromFile(file_data.newpath).toFile(file_data.tinypath, function(err) {
						if (err instanceof tinify.AccountError) {
						//   console.log("The error message is: " + err.message);
						  // Verify your API key and account limit.
						} else if (err instanceof tinify.ClientError) {
						  // Check your source image and request options.
						} else if (err instanceof tinify.ServerError) {
						  // Temporary issue with the Tinify API.
						} else if (err instanceof tinify.ConnectionError) {
						  // A network connection error occurred.
						} else {
						  // Something else went wrong, unrelated to the Tinify API.
						}
						// Remove Original
						fs.unlinkSync(file_data.newpath);
					});
				}
			}*/

			if(chatID) {
                
                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                var tparam = {
                    'user_ids': [receiver_id], // Registration Token For multiple users
                };
               
                helper.get_registration_token(tparam,async function (res) {
                    // console.log("res",res);
                    // if (res.length > 0) {
                        var regTokens = (res.length > 0) ? res.map(res => res.token) : [];
                        // Send Notification Message : Start
                        if(type == 2)
                        {
                            var set_body = 'image receive';
                        }else if(type == 3){
                            var set_body = 'file receive';
                        }else if(type == 4){
                            var set_body = 'video receive';
                        }else{
                            var set_body = message;
                        }

                        var get_sender_name = await helper.sql_query(sql, `SELECT first_name,last_name FROM users WHERE id = '${sender_id}' `).catch(console.log);
                        // if(type == )
                        var extra_data = {
                            'receiver_id': receiver_id,
                            'sender_id': sender_id,
                            'type': type,
                            'message': message,
                        };
                        var send_param = {
                            'registration_token': regTokens,
                            'title':'Chat Message - '+ get_sender_name[0].first_name + ' '+ get_sender_name[0].last_name ,
                            'body': set_body,
                            'extra_data': extra_data,
                        };
                        // console.log(send_param);
                        helper.send_notification(send_param, function (send_res) {
                            // Save Notification Message in DB : Start
                            var notify_params = {
                                'user_id': receiver_id,
                                'from_id': sender_id,
                                'description': set_body,
                                'work_status': 6,
                                'created_at': today,
                            }
                        });
                        // Send Notification Message : End      
                    // }
                });
                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                var chat_files_arr = [];
                var getMsg = `SELECT *,DATE_FORMAT(created_at,'%d-%m-%Y %h:%i') AS created_at FROM chat_messages WHERE id = '${chatID}'`;
                sql.query(getMsg,  function (err, message) {
                    if(err) {
                        console.log("error: ", err);
                        result(err, null);
                    } 
                    var chat_type = message[0].type;
                    // console.log("res",message);
                    // GET FILES
                    var chat_files = "SELECT * FROM chat_files WHERE chat_id = ?;";
                    sql.query(chat_files, [chatID], function(err, chatFileRes) {
                        if(err) {
                            console.log("error: ", err);
                            return result(err, null);
                        }
                        async.forEachOf(chatFileRes, (cf, key, callback1) => {
                            var chatPhotoUrl = cf.file;
                            if(chatPhotoUrl != "" && fs.existsSync(`./public/chats/${chatPhotoUrl}`)) {
                                var chatPhotoPath = fullUrl+"/chats/"+cf.file;
                            } else {
                                var chatPhotoPath = "";
                            }
                            var chatThumbnail = cf.thumbnail;
                            if(chatThumbnail != "" && fs.existsSync(`./public/chats/thumbnail/${chatThumbnail}`)) {
                                var chatThumbnail = fullUrl+"/chats/thumbnail/"+cf.thumbnail;
                            } else {
                                var chatThumbnail = "";
                            }
                            if(chat_type == 2)
                            {
                                var fileList = {
                                    'file_id': cf.id,
                                    'file_name': chatPhotoUrl,
                                    'chat_image': chatPhotoPath,
                                    'chat_video':'',
                                    'chat_file':'',
                                }
                            }else if(chat_type == 4){
                                var fileList = {
                                    'file_id': cf.id,
                                    'chat_image':'',
                                    'file_name': chatPhotoUrl,
                                    'thumbnail_img': chatThumbnail,
                                    'chat_video': chatPhotoPath,
                                    'chat_file':'',
                                }
                            }else{
                                var fileList = {
                                    'file_id': cf.id,
                                    'chat_image':'',
                                    'chat_video':'',
                                    'file_name': chatPhotoUrl,
                                    'chat_file': chatPhotoPath,
                                }
                            }

                            chat_files_arr.push(fileList);
                            callback1();
                        });                
                        var last_msg_time1 = message[0].created_at.split(" ");  
                        var last_msg_time = last_msg_time1[1];
                        chatInfo.push({
                            'id': message[0].id,
                            'type': message[0].type,
                            'sender_id': message[0].sender_id,
                            'receiver_id': message[0].receiver_id,
                            'message': message[0].message,
                            'sent_by_me': (message[0].sender_id == sender_id) ? 1 : 0,
                            'is_seen': message[0].is_seen,
                            'files': chat_files_arr,
                            'deleted_by': message[0].deleted_by,
                            'msg_time': moment(last_msg_time, "hh:mm:ss").format('hh:mm a'),
                            'created_at': moment(message[0].created_at, "DD-MM-YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a'),
                        });
                        response_arr['success'] = 1;
                        response_arr['msg']     = 'Message sent successfully!';
                        response_arr['data'] = chatInfo,
                        result(null, response_arr);
                    });
                    // console.log('chatInfo',chatInfo);
                });

			} else {
				response_arr['success'] = 0;
				response_arr['msg']     = 'Something went wrong to sent message!';
				result(null, response_arr);
			}
		}
	})
};

Model.chatUsersModel = async function chatUsersModel(req, result) {
	var dt = dateTime.create();
	var today = dt.format('Y-m-d H:M:S');
	var fullUrl = req.protocol + '://' + req.get('host');
	var files_param = req.files;
	var param = req.body;

	var user_id   = (param.user_id) ? param.user_id : '';
	var search_text   = (param.search_text) ? param.search_text :'';
    var next_id = (param.next_id) ? param.next_id : 0;
    // var user_type   = (param.user_type) ? param.user_type :'';

	var last_id = parseInt(next_id) + 20;
	
	var response_arr = [];

    var getUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${user_id}' `).catch(console.log);
    var user_type = (getUser[0].user_role == 4) ? 2:1;
    if(user_type == '2')
    {
        var query_text = `
        SELECT MAX(chat_messages.id) as chat_id, users.id,users.mosque_name,users.first_name,users.last_name,users.profile_photo FROM chat_messages LEFT JOIN users ON ((chat_messages.sender_id = '${user_id}' AND chat_messages.receiver_id = users.id) OR (chat_messages.sender_id = users.id AND chat_messages.receiver_id = '${user_id}')) AND chat_messages.deleted_by != '2' WHERE users.first_name LIKE '%${search_text}%' AND users.soft_delete = '0' group by users.id order by chat_id DESC LIMIT 20 OFFSET ${parseInt(next_id)} ;
        `;
    }else{
        var query_text = `
        SELECT MAX(chat_messages.id) as chat_id, users.id,users.mosque_name,users.first_name,users.last_name,users.profile_photo FROM chat_messages LEFT JOIN users ON ((chat_messages.sender_id = '${user_id}' AND chat_messages.receiver_id = users.id) OR (chat_messages.sender_id = users.id AND chat_messages.receiver_id = '${user_id}')) AND chat_messages.deleted_by != '1' WHERE users.first_name LIKE '%${search_text}%' AND users.soft_delete = '0' group by users.id order by chat_id DESC LIMIT 20 OFFSET ${parseInt(next_id)} ;
        `;
    }
    
    // var query_text = `SELECT users.id,users.name,users.username,users.photo FROM followers INNER JOIN users ON users.id = followers.following_id WHERE users.username LIKE '%${search_text}%' AND followers.follower_id = '${user_id}' LIMIT 10 OFFSET ${parseInt(next_id)};`;
	sql.query(query_text, [], function (err, res) {
		if(err) {
			console.log("error: ", err);
			result(err, null);
		} 

		// console.log("res",res);

		var users_arr = [];
		var next_arr = [];

		async.forEachOf(res,async (user, key, callback) => {

			// console.log("user:",user);

			var photoUrl = user.profile_photo;
			if(photoUrl != "" && fs.existsSync(`./public/uploadsProfilePhoto/${photoUrl}`)) {
				var photoPath =  fullUrl+"/uploadsProfilePhoto/"+user.profile_photo;
			} else {
				var photoPath = "";
			}

			// Get Last Message
			var sender_id = user_id;
			var receiver_id = user.id;
            console.log('sender_id',sender_id);
            console.log('receiver_id',receiver_id);
			// var manage_message = await helper.sql_query(sql, `SELECT *,DATE_FORMAT(created_at,'%d-%m-%Y %h:%i') AS created_at FROM chat_messages WHERE ((sender_id = '${sender_id}' AND receiver_id = '${receiver_id}') OR (sender_id = '${receiver_id}' AND receiver_id = '${sender_id}')) AND hired_emp_id = '${user.hired_emp_id}' ORDER BY id DESC LIMIT 1;SELECT id FROM chat_messages WHERE sender_id = '${receiver_id}' AND receiver_id = '${sender_id}' AND hired_emp_id = '${user.hired_emp_id}' AND is_seen = 0;`);
            if(user_type == '2')
            {
                var manage_message = await helper.sql_query(sql, `SELECT chat_messages.id,chat_messages.sender_id,chat_messages.receiver_id,chat_messages.type,IF(chat_messages.message !='',chat_messages.message,chat_files.file) as message,chat_messages.is_seen,DATE_FORMAT(chat_messages.created_at,'%d-%m-%Y %h:%i %a') AS created_at FROM chat_messages LEFT JOIN chat_files ON chat_files.chat_id = chat_messages.id  WHERE  ((chat_messages.sender_id = '${sender_id}' AND chat_messages.receiver_id = '${receiver_id}') OR (chat_messages.sender_id = '${receiver_id}' AND chat_messages.receiver_id = '${sender_id}')) ORDER BY chat_messages.id DESC LIMIT 1;SELECT id FROM chat_messages WHERE sender_id = '${receiver_id}' AND receiver_id = '${sender_id}' AND deleted_by != 2 AND is_seen = 0;`);
            }else{
                var manage_message = await helper.sql_query(sql, `SELECT chat_messages.id,chat_messages.sender_id,chat_messages.receiver_id,chat_messages.type,IF(chat_messages.message !='',chat_messages.message,chat_files.file) as message,chat_messages.is_seen,DATE_FORMAT(chat_messages.created_at,'%d-%m-%Y %h:%i %a') AS created_at FROM chat_messages LEFT JOIN chat_files ON chat_files.chat_id = chat_messages.id  WHERE  ((chat_messages.sender_id = '${sender_id}' AND chat_messages.receiver_id = '${receiver_id}') OR (chat_messages.sender_id = '${receiver_id}' AND chat_messages.receiver_id = '${sender_id}')) ORDER BY chat_messages.id DESC LIMIT 1;SELECT id FROM chat_messages WHERE sender_id = '${receiver_id}' AND receiver_id = '${sender_id}' AND deleted_by != 1 AND is_seen = 0;`);
            }

            console.log('fd',manage_message);
            
            if(manage_message[0].length > 0)
            {
                if(manage_message[0][0].created_at)
                {
                    manage_message[0][0].created_at = moment(manage_message[0][0].created_at, "DD-MM-YYYY hh:mm:ss").format('DD-MM-YYYY hh:mm a');
                }

                var last_msg_time1 = manage_message[0][0].created_at.split(" ");  
                var last_msg_time = last_msg_time1[1];
                
                var chk_msg = manage_message[0][0].message;
                if(chk_msg.length)
                {
                    var set_msg = chk_msg;
                }else{
                    var set_msg = manage_message[0][0].file;
                }
            }else{
                var last_msg_time = '';  
            }
            // console.log('dfg',last_msg_time);
            // if(manage_message,length > 0)
            // {
                var userInfo = {
                    'id': user.id,
                    'name': user.mosque_name,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'profile_pic': photoPath,
                    'last_message_time': moment(last_msg_time, "hh:mm:ss").format('hh:mm a'),
                    // 'is_payment':(user.payment_response)?true:false,
                    'last_message':(manage_message && manage_message[0].length > 0) ? manage_message[0] : [],
                    'total_unseen_msg':(manage_message && manage_message[1].length > 0) ? manage_message[1].length : 0
                }
            // console.log('fd',userInfo);
			users_arr.push(userInfo);
            // }
			callback();

		}, err => {

            if(user_type == '2')
            {
                var query_text = `SELECT MAX(chat_messages.id) as chat_id, users.id,users.mosque_name,users.first_name,users.last_name,users.profile_photo FROM chat_messages LEFT JOIN users ON ((chat_messages.sender_id = '${user_id}' AND chat_messages.receiver_id = users.id) OR (chat_messages.sender_id = users.id AND chat_messages.receiver_id = '${user_id}')) AND chat_messages.deleted_by != '2' WHERE users.first_name LIKE '%${search_text}%' AND users.soft_delete = '0' group by users.id order by chat_id DESC`;
            }else{
                var query_text = `SELECT MAX(chat_messages.id) as chat_id, users.id,users.mosque_name,users.first_name,users.last_name,users.profile_photo FROM chat_messages LEFT JOIN users ON ((chat_messages.sender_id = '${user_id}' AND chat_messages.receiver_id = users.id) OR (chat_messages.sender_id = users.id AND chat_messages.receiver_id = '${user_id}')) AND chat_messages.deleted_by != '1' WHERE users.first_name LIKE '%${search_text}%' AND users.soft_delete = '0' group by users.id order by chat_id DESC`;
            }
			// var query_text = `SELECT users.id,users.name,users.username,users.photo FROM followers INNER JOIN users ON users.id = followers.following_id WHERE users.username LIKE '%${search_text}%' AND followers.follower_id = '${user_id}';`;
			sql.query(query_text, [], async function (err, res) {
				if(err) {
					console.log("error: ", err);
					result(err, null);
				}

				var total = res.length;
				if(last_id > total) {
					last_id = total;
				}

				var nextInfo = {
					'total': total,
					'next_id': last_id
				}
				next_arr.push(nextInfo);

				response_arr['success'] = 1;
				response_arr['msg']     = 'Chat users get successfully!';
				response_arr['data']    = users_arr;
				response_arr['next']    = nextInfo;
				result(null, response_arr);

			});
		});
	});
};

Model.chatMsgListModel = async function chatMsgListModel(req, result) {
	var dt = dateTime.create();
	var today = dt.format('Y-m-d H:M:S');
	var fullUrl = req.protocol + '://' + req.get('host');
	var files_param = req.files;
	var param = req.body;

	var sender_id     = (param.sender_id) ? param.sender_id : '';
	var receiver_id   = (param.receiver_id) ? param.receiver_id : '';

	var next_id = param.next_id;
	var last_id = parseInt(next_id) + 20;
	
	var response_arr = [];
    var getUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${sender_id}' `).catch(console.log);
    var user_type = (getUser[0].user_role == 4) ? 2:1;
    if(user_type == 2)
    {
        var query_text = `UPDATE chat_messages SET is_seen = 1 WHERE sender_id = '${receiver_id}' AND receiver_id = '${sender_id}';SELECT *,DATE_FORMAT(created_at,'%d-%m-%Y %h:%i') AS created_at FROM chat_messages WHERE deleted_by != '2' AND ((sender_id = '${sender_id}' AND receiver_id = '${receiver_id}') OR (sender_id = '${receiver_id}' AND receiver_id = '${sender_id}' )) ORDER BY id DESC LIMIT 20 OFFSET ${parseInt(next_id)};`;
    }else{
        var query_text = `UPDATE chat_messages SET is_seen = 1 WHERE sender_id = '${receiver_id}' AND receiver_id = '${sender_id}';SELECT *,DATE_FORMAT(created_at,'%d-%m-%Y %h:%i') AS created_at FROM chat_messages WHERE deleted_by != '1' AND ((sender_id = '${sender_id}' AND receiver_id = '${receiver_id}') OR (sender_id = '${receiver_id}' AND receiver_id = '${sender_id}' )) ORDER BY id DESC LIMIT 20 OFFSET ${parseInt(next_id)};`;
    }

	// var query_text = `UPDATE chat_messages SET is_seen = 1 WHERE sender_id = '${receiver_id}' AND receiver_id = '${sender_id}';SELECT *,DATE_FORMAT(created_at,'%d-%m-%Y %h:%i') AS created_at FROM chat_messages WHERE ((sender_id = '${sender_id}' AND receiver_id = '${receiver_id}' AND hired_emp_id = '${hired_emp_id}') OR (sender_id = '${receiver_id}' AND receiver_id = '${sender_id}' AND hired_emp_id = '${hired_emp_id}')) ORDER BY id DESC LIMIT 20 OFFSET ${parseInt(next_id)};`;
    console.log('dfg',query_text);
	var q = sql.query(query_text, [], async function (err, res) {
		if(err) {
			console.log("error: ", err);
			return result(err, null);
		} 

		var chatInfo = [];
		var next_arr = [];

		async.forEachOf(res[1], (message, key, callback) => {
			
			var chat_id = message.id;
			var chat_type = message.type;
            var chat_files_arr = [];
            
			// GET FILES
			var chat_files = "SELECT * FROM chat_files WHERE chat_id = ?;";
			sql.query(chat_files, [chat_id], function(err, chatFileRes) {
				if(err) {
					console.log("error: ", err);
					return result(err, null);
				}
				async.forEachOf(chatFileRes, (cf, key, callback1) => {
					var chatPhotoUrl = cf.file;
					if(chatPhotoUrl != "" && fs.existsSync(`./public/chats/${chatPhotoUrl}`)) {
						var chatPhotoPath = fullUrl+"/chats/"+cf.file;
					} else {
						var chatPhotoPath = "";
                    }
                    var chatThumbnail = cf.thumbnail;
                    if(chatThumbnail != "" && fs.existsSync(`./public/chats/thumbnail/${chatThumbnail}`)) {
						var chatThumbnail = fullUrl+"/chats/thumbnail/"+cf.thumbnail;
					} else {
						var chatThumbnail = "";
                    }
                    if(chat_type == 2)
                    {
                        var fileList = {
                            'file_id': cf.id,
                            'file_name': chatPhotoUrl,
                            'chat_image': chatPhotoPath,
                            'chat_video':'',
                            'chat_file':'',
                        }
                    }else if(chat_type == 4){
                        var fileList = {
                            'file_id': cf.id,
                            'chat_image':'',
                            'file_name': chatPhotoUrl,
                            'thumbnail_img': chatThumbnail,
                            'chat_video': chatPhotoPath,
                            'chat_file':'',
                        }
                    }else{
                        var fileList = {
                            'file_id': cf.id,
                            'chat_image':'',
                            'chat_video':'',
                            'file_name': chatPhotoUrl,
                            'chat_file': chatPhotoPath,
                        }
                    }

					chat_files_arr.push(fileList);
					callback1();
				});                
                var last_msg_time1 = message.created_at.split(" ");  
                var last_msg_time = last_msg_time1[1];
				chatInfo.push({
					'id': message.id,
					'type': message.type,
					'sender_id': message.sender_id,
					'receiver_id': message.receiver_id,
					'message': message.message,
					'sent_by_me': (message.sender_id == sender_id) ? 1 : 0,
					'is_seen': message.is_seen,
					'files': chat_files_arr,
                    'deleted_by': message.deleted_by,
                    // 'deleted_by': (message.deleted_by == '1')? 'Mosque/College':(message.deleted_by == '2')? 'Public':'',
					// 'deleted_for_public': (message.deleted_by == '0')? false:true,
                    'msg_time': moment(last_msg_time, "hh:mm:ss").format('hh:mm a'),
					'created_at': moment(message.created_at, "DD-MM-YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a'),
				});
				callback();
			});
		}, err => {
            if(user_type == 2)
            {
			    var query_text = `SELECT * FROM chat_messages WHERE deleted_by !='2' AND  ((sender_id = '${sender_id}' AND receiver_id = '${receiver_id}' ) OR (sender_id = '${receiver_id}' AND receiver_id = '${sender_id}' )) ORDER BY id DESC`;
            }else{
                var query_text = `SELECT * FROM chat_messages WHERE deleted_by !='1' AND  ((sender_id = '${sender_id}' AND receiver_id = '${receiver_id}' ) OR (sender_id = '${receiver_id}' AND receiver_id = '${sender_id}' )) ORDER BY id DESC`;
            }
            console.log('gd',query_text);
			sql.query(query_text, [], function(err, res) {
				if(err) {
					console.log("error: ", err);
					result(err, null);
				}

				var total = res.length;
				if(last_id > total) {
					last_id = total;
				}

				var nextInfo = {
					'total': total,
					'next_id': last_id
				}
				next_arr.push(nextInfo);

				response_arr['success'] = 1;
				response_arr['msg']     = 'Chat list get successfully!';
				response_arr['data']    = chatInfo;
				response_arr['next']    = nextInfo;
				result(null, response_arr);
			});
		});

	});
};

Model.get_chat_countModel = async function get_chat_countModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;

    var user_id = (param.user_id) ? param.user_id : '';
    // var language = (param.language) ? param.language : '';

    var response_arr = [];
    var getUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${user_id}' `).catch(console.log);
    var user_type = (getUser[0].user_role == 4) ? 2:1;
    if(user_type == 2)
    {
        var query_text = `SELECT count(id) as msg_count FROM chat_messages WHERE deleted_by != '2' AND is_seen = '0' AND chat_messages.receiver_id = '${user_id}' `; 
    }else{
        var query_text = `SELECT count(id) as msg_count FROM chat_messages WHERE deleted_by != '1' AND is_seen = '0' AND chat_messages.receiver_id = '${user_id}' `; 
    }

    var q = sql.query(query_text, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        // console.log(res.affectedRows);
        if (res.length > 0) {
                response_arr['success'] = 1;
                response_arr['msg'] = 'Message count successfully.';
                response_arr['data'] = res;
                result(null, response_arr);
        } else {
            response_arr['msg'] = "Can't get Message count failed!";
            result(null, response_arr);
        }
    });
};

Model.deleteChatMessageModel = async function deleteChatMessageModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var user_id = (param.user_id) ? param.user_id : '';
    // var deleted_by = (param.deleted_by) ? param.deleted_by : '';
    var message_ids = (param.message_ids) ? param.message_ids : '';
    console.log('param',message_ids);
    var split_message_ids = message_ids.split(',');  
    // console.log('param length',split_journey_ids.length);
    var messageDelete = [];
    for(var i=0;i < split_message_ids.length; i++)
    {
        var getUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${user_id}' `).catch(console.log);
        var getMsg =  await helper.sql_query(sql, `SELECT id FROM chat_messages WHERE id = '${split_message_ids[i]}' AND sender_id = '${user_id}'  `).catch(console.log);
        var deleted_by = (getUser[0].user_role == 4) ? 2:1;
        if(!getMsg.length > 0)
        {
            var msgDelete1 =  await helper.sql_query(sql, `UPDATE chat_messages SET deleted_by = '${deleted_by}' WHERE id = '${split_message_ids[i]}' `).catch(console.log);
        }else{
            var id = getMsg[0].id;
            // var msgUser = getMsg[0].sender_id;
            var msgDelete =  await helper.sql_query(sql, `DELETE FROM chat_messages WHERE id = '${id}' `).catch(console.log);
            if(msgDelete.affectedRows){
                messageDelete.push(id);
            }
        }
    }

    if(messageDelete.length > 0 || msgDelete1.affectedRows > 0)
    {
        response_arr['success'] = 1;
        response_arr['msg'] = ` Message Deleted Successfully!`;
        // response_arr['data'] = response;
        result(null, response_arr);
    }else{
        response_arr['msg'] = `Some thing wan't wrong for Delete Messages .`;
        result(null, response_arr);
    }
};

Model.deleteUserChatModel = async function deleteUserChatModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var login_id = (param.login_id) ? param.login_id : '';
    var friend_id = (param.friend_id) ? param.friend_id : '';
    
        var getUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${login_id}' `).catch(console.log);
        var getMsg =  await helper.sql_query(sql, `SELECT id FROM chat_messages WHERE ((chat_messages.sender_id = '${login_id}' AND chat_messages.receiver_id = '${friend_id}') OR (chat_messages.sender_id = '${friend_id}' AND chat_messages.receiver_id = '${login_id}')) `).catch(console.log);
        
          //sender_id = '${user_id}' OR receiver_id = '${user_id}' 
        var deleted_by = (getUser[0].user_role == 4) ? 2:1;
        if(getMsg.length > 0)
        { 
            for(var i = 0 ; i < getMsg.length; i++)
            { console.log('getMsg',getMsg[i].id);
                var msgDelete1 =  await helper.sql_query(sql, `UPDATE chat_messages SET deleted_by = '${deleted_by}' WHERE id = '${getMsg[i].id}' `).catch(console.log);
            }
        }
        // else{
        //     var id = getMsg[0].id;
        //     // var msgUser = getMsg[0].sender_id;
        //     var msgDelete =  await helper.sql_query(sql, `DELETE FROM chat_messages WHERE id = '${id}' `).catch(console.log);
        //     if(msgDelete.affectedRows){
        //         messageDelete.push(id);
        //     }
        // }
    
    if(msgDelete1.affectedRows > 0)
    {
        response_arr['success'] = 1;
        response_arr['msg'] = ` Chat List Deleted Successfully!`;
        // response_arr['data'] = response;
        result(null, response_arr);
    }else{
        response_arr['msg'] = `Some thing wan't wrong for Delete Messages .`;
        result(null, response_arr);
    }
};

// -------------------- Comman API ---------------------------//
Model.cmsPageModel = function cmsPageModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var response_arr = [];

    var pagename = (param.pagename) ? param.pagename : '';
    console.log(`CMS Data : ${JSON.stringify(param)}`);
    query_text = `SELECT *,DATE_FORMAT(updated_at,'%Y-%m-%d %H:%i') as updated_at FROM cms where slug = 'about_us'`;
    // console.log(query_text);
    var q = sql.query(query_text, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        // console.log(res.length);
        if (res.length > 0) {
            response_arr['success'] = 1;
            response_arr['msg'] = 'CMS Page Data Show successfully.';
            response_arr['cms_data'] = res;
            result(null, response_arr);
        } else {
            response_arr['msg'] = "CMS Page Data Display failed!";
            result(null, response_arr);
        }
    });
};

Model.getLanguageModel = function getLanguageModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var response_arr = [];

    var user_id = (param.user_id) ? param.user_id : '';
    console.log(`Get Language : ${JSON.stringify(param)}`);
    if(user_id)
    {
        query_text = `SELECT languages.id,languages.language_code,languages.language_name,users.id as langauge_selection FROM users RIGHT JOIN languages ON languages.id = users.language_id AND users.id = '${user_id}' AND users.soft_delete = '0' `;
    }else{
        query_text = `SELECT id,language_code,language_name FROM languages `;
    }
    // console.log(query_text);
    var q = sql.query(query_text, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        for(i=0;i<res.length;i++)
        {
            // console.log(res[i].user_id);
            res[i].langauge_selection = res[i].langauge_selection ? true : false;
            if(res[i].langauge_selection == '' || res[i].langauge_selection == null )
            {
                // res[i].langauge_selection = '';
                res[i].langauge_selection = res[i].langauge_selection ? true : false;
            }
        }
        
        if (res.length > 0) {
            response_arr['success'] = 1;
            response_arr['msg'] = 'Language Get successfully.';
            response_arr['cms_data'] = res;
            result(null, response_arr);
        } else {
            response_arr['msg'] = "Can not found Language.";
            result(null, response_arr);
        }
    });
};

Model.signupModel = function signupModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var response_arr = [];

    var user_type = (param.user_type) ? param.user_type : '';   // 1 not allow 
    var mosque_name = (param.mosque_name) ? param.mosque_name : ''; 
    var first_name = (param.first_name) ? param.first_name : ''; 
    var last_name = (param.last_name) ? param.last_name : '';
    var email = (param.email) ? param.email : '';
    var password = (param.password) ? param.password : '';
    var country_code = (param.country_code) ? param.country_code : '';
    var mobile_no = (param.mobile_no) ? param.mobile_no : '';
    var address = (param.address) ? param.address : '';
    var address1 = (param.address1) ? param.address1 : '';
    var address2 = (param.address2) ? param.address2 : '';
    var post_code = (param.post_code) ? param.post_code : '';
    var longitude = (param.longitude) ? param.longitude : '';
    var latitude = (param.latitude) ? param.latitude : '';
    var language_id = (param.language_id) ? param.language_id : '1';
    
    var firebase_token = (param.firebase_token) ? param.firebase_token : '';
    var device = (param.device) ? param.device : 1;
    var device_token = (param.device_token) ? param.device_token : '';
    
    var getUserData = [];
    console.log(`Signup : ${JSON.stringify(param)}`);

    // var dir = './public/uploadsProfile';

    // if (!fs.existsSync(dir)) {
    //     fs.mkdirSync(dir);
    // }

    // // File Upload : Start
    // var pic = (req.files && req.files.photo) ? req.files.photo : []
    // // console.log('photo type',typeof pic, 'length :',pic.length);
    // if (files_param && typeof pic.length === "undefined") {
    //     console.log('single file');
    //     var fileName = 'profile_' + pic.md5 + path.extname(pic.name);
    //     var newpath = "./public/uploadsProfile/" + fileName;
    //     pic.mv(newpath, function (err) {
    //         if (err) { result("Error uploading file.", err); return; }
    //     });
    //     photo = fileName;
    // } else {
    //     photo = '';
    // }
    // // File Upload : End 

    if((user_type == '2' || user_type == '3') && mosque_name == '' )
    {
        response_arr['msg'] = "Please Add Mosque/College Name.";
        result(null, response_arr);
    }else{
    
    var query_text = `SELECT id FROM users WHERE email='${email}' ;SELECT id FROM users WHERE mobile_no = '${mobile_no}'  `;
    sql.query(query_text, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        console.log('dfv',res[0]);
        if (res[0].length > 0) {
            response_arr['msg'] = "Email already exist!";
            result(null, response_arr);
        } else if (res[1].length > 0) {
            response_arr['msg'] = "Mobile No. already exist!";
            result(null, response_arr);
        } else {

                var optLength = 6;
                var genrate_otp = Math.floor(Math.pow(10, optLength - 1) + Math.random() * (Math.pow(10, optLength) - Math.pow(10, optLength - 1) - 1));

                var query_text = `INSERT INTO users(user_role,mosque_name,first_name, last_name, email, country_code,mobile_no, address,address1, address2, post_code, longitude, latitude, password, language_id, m_password, created_at) VALUES ( "${user_type}","${mosque_name}","${first_name}","${last_name}", "${email}", "${country_code}","${mobile_no}", "${address}", "${address1}", "${address2}", "${post_code}", "${longitude}", "${latitude}", "${password}", "${language_id}", "${password}", "${today}")`;
                console.log(query_text);
                sql.query(query_text, function (err, resUser) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }
                    console.log(resUser.affectedRows);
                    if (resUser.affectedRows > 0) {
                        var notification = {
                            'user_id': resUser.insertId,
                            'prayer_time_reminder': '0',
                            'mosque_updates_notifications': '0',
                            'created_at': today,
                        };
                        var query_text = `INSERT INTO notification_setting SET ?;`;
                        sql.query(query_text, notification, function (err, res4) {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                            }
                        })

                        var query_text = "SELECT users.*,CASE WHEN users.cover_photo!='' THEN CONCAT('${fullUrl}/uploadsCoverPhoto/',users.cover_photo) ELSE '' END AS cover_photo,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,notification_setting.prayer_time_reminder,notification_setting.mosque_updates_notifications,languages.* FROM users , notification_setting , languages WHERE languages.id = users.language_id AND users.id=notification_setting.user_id AND users.id = ?";
                        console.log('select query : ', query_text);
                        console.log('user id :', resUser.insertId);
                        sql.query(query_text, [resUser.insertId], async function (err, res2) {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                            }
                            
                            console.log('mobile_no',res2);
                            if (res2[0].mobile_no == '') {
                                res2[0].mobile_no = '-';
                            }
                          
                            if (res2[0].user_role == 2) {
                                res2[0].user_type = 'Mosque';
                            } else if (res2[0].user_role == 3) {
                                res2[0].user_type = 'college/Univercity';
                            } else if (res2[0].user_role == 4) {
                                res2[0].user_type = 'Public';
                            }
                            
                            // var readHTMLFile = function (path, callback) {
                            //     fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                            //         if (err) {
                            //             throw err;
                            //             callback(err);
                            //         }
                            //         else {
                            //             callback(null, html);
                            //         }
                            //     });
                            // };
                            // var transporter = nodemailer.createTransport({
                            //     service: 'gmail',
                            //     port: 465,
                            //     auth: {
                            //         user: 'testing1.technobrigadeinfo@gmail.com',
                            //         pass: '!testing12345@'
                            //     },
                            //     secure: false,
                            //     // here it goes
                            //     tls: { rejectUnauthorized: false },
                            //     debug: true
                            // });
                            // // console.log('d', res2[0].otp_code);

                            //-------------------------------Mail---------------------------
                            // readHTMLFile(__dirname + '/otpSendMail.html', function (err, html) {
                            //     var template = handlebars.compile(html);
                            //     var replacements = {
                            //         username: `${res2[0].first_name} ${res2[0].last_name} `,
                            //         otpCode: res2[0].otp_code,
                            //         // logo: `${fullUrl}/KK_128.png`,
                            //     };
                            //     var htmlToSend = template(replacements);
                            //     var mailOptions = {
                            //         from: 'noreply@technobrigadeinfotech.com',
                            //         to: res2[0].email,
                            //         subject: 'VipMe App : Otp Send',
                            //         // text: `<b>Your old password is</b> : ${res2[0].password}`,
                            //         // html: ``,
                            //         // console.log("");
                            //         html: htmlToSend,
                            //         // cc: 'nehal.technobrigadeinfo@gmail.com'
                            //     }

                            //     // console.log("mailoptions",mailOptions);        
                            //     transporter.sendMail(mailOptions, function (error, info) {
                            //         if (error) {
                            //             console.log('error66', error);
                            //         } else {
                            //             console.log('Email sent: ' + info.response);
                            //         }
                            //     });
                            // });
                            //------------------------/..Mail---------------------------------

                            var token = {
                                'user_id': res2[0].id,
                                'token': firebase_token,
                                'user_type': user_type,
                                'device': device,
                                'deviceToken': device_token,
                                'created_at': today,
                            };
                            console.log('dvf', token);
                            var query_text = `SELECT token,device FROM tbl_login_token WHERE token = '${firebase_token}' AND device = '${device}' AND user_id = '${res[0].id}';`;
                            sql.query(query_text, token, function (err, res3) {
                                if (err) {
                                    console.log("error: ", err);
                                    result(err, null);
                                }
                                else {
                                    if (res3.length === 0) {
                                        var query_text = `INSERT INTO tbl_login_token SET ?;`;
                                        sql.query(query_text, token, function (err, res4) {
                                            if (err) {
                                                console.log("error: ", err);
                                                result(err, null);
                                            }
                                            // else {
                                            // console.log("RESPONSE3",res4);
                                            // }
                                        })
                                    }
                                    // else {
                                    //     console.log('Already exist');
                                    // }
                                }
                            });

                            var chk_subscription = await helper.sql_query(sql, `SELECT id,type,DATE_FORMAT(start_date,'%Y-%m-%d %H:%i') as start_date,DATE_FORMAT(end_date,'%Y-%m-%d %H:%i') as end_date FROM subscription WHERE mosque_id = '${res[0].id}' AND type = '0' `).catch(console.log);
                            console.log('h',chk_subscription);
                            if(chk_subscription.length)
                            {
                                if(chk_subscription[0].type == '1')
                                {
                                    var type = 'subscriber'
                                }else
                                {
                                    var type = 'trial';
                                }
                                var end_date = chk_subscription[0].end_date;
                                if(today >= end_date)
                                {
                                    var sub_flag = 1;
                                }else{
                                    var sub_flag = 2;
                                }

                            }else{
                                var type = 'new';
                                var end_date = '';
                                var sub_flag = 0;
                            }

                            if(res2[0].user_role == 4)
                            {
                                var chk_default_mosque = await helper.sql_query(sql, `SELECT uj.id,uj.user_id,uj.mosque_id,uj.is_default, DATE_FORMAT(uj.updated_at,'%Y-%m-%d %H:%i') as updated_at,mosque.user_role as mosque_role,mosque.mosque_name,mosque.first_name as mosque_first_name,mosque.last_name as mosque_last_name,mosque.address as mosque_address,CASE WHEN mosque.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',mosque.profile_photo) ELSE '' END AS mosque_profile_photo FROM user_journey as uj LEFT JOIN users as mosque ON mosque.id = uj.mosque_id WHERE uj.user_id = '${res[0].user_id}' AND uj.is_default = '1' limit 1 `).catch(console.log);
                                
                                getUserData.push({
                                    "id": res2[0].id,
                                    "user_role": res2[0].user_role,
                                    "user_type": res2[0].user_type,
                                    "name":res[0].mosque_name,
                                    "first_name": res2[0].first_name,
                                    "last_name": res2[0].last_name,
                                    "email": res2[0].email,
                                    "country_code": res2[0].country_code,
                                    "mobile_no": res2[0].mobile_no,
                                    "address": res2[0].address,
                                    "address1": res2[0].address1,
                                    "address2": res2[0].address2,
                                    "post_code": res2[0].post_code,
                                    "longitude": res2[0].longitude,
                                    "latitude": res2[0].latitude,
                                    "status": res2[0].status,
                                    "language_id": res2[0].language_id,
                                    "language_code": res2[0].language_code,
                                    "language_name": res2[0].language_name,
                                    "Password": res2[0].m_password,
                                    "cover_photo": res2[0].cover_photo,
                                    "profile_photo": res2[0].profile_photo,
                                    "prayer_time_reminder": res2[0].prayer_time_reminder,
                                    "mosque_updates_notifications": res2[0].mosque_updates_notifications,
                                    "is_default_mosque": (chk_default_mosque[0])?true : false,
                                    "default_mosque_id": (chk_default_mosque[0])?chk_default_mosque[0].mosque_id : 0,
                                    "default_mosque_role": (chk_default_mosque[0])?chk_default_mosque[0].mosque_role : 0,
                                    "default_mosque_name": (chk_default_mosque[0])?chk_default_mosque[0].mosque_name : '',
                                    "default_mosque_first_name": (chk_default_mosque[0])?chk_default_mosque[0].mosque_first_name : '',
                                    "default_mosque_last_name": (chk_default_mosque[0])?chk_default_mosque[0].mosque_last_name : '',
                                    "default_mosque_address": (chk_default_mosque[0])?chk_default_mosque[0].mosque_address : '',
                                    "default_mosque_profile_pic": (chk_default_mosque[0])?chk_default_mosque[0].mosque_profile_photo : '',
                                    
                                    "subscription_type": type,
                                    "subscription_end_date": end_date,
                                    "subscription_flag": sub_flag,
                                    // "cover_photo": res[0].cover_photo,
                                    // "profile_photo": res[0].profile_photo,
                                });
                            }else{

                                getUserData.push({
                                    "id": res2[0].id,
                                    "user_role": res2[0].user_role,
                                    "user_type": res2[0].user_type,
                                    "name":res2[0].mosque_name,
                                    "first_name": res2[0].first_name,
                                    "last_name": res2[0].last_name,
                                    "email": res2[0].email,
                                    "country_code": res2[0].country_code,
                                    "mobile_no": res2[0].mobile_no,
                                    "address": res2[0].address,
                                    "address1": res2[0].address1,
                                    "address2": res2[0].address2,
                                    "post_code": res2[0].post_code,
                                    "longitude": res2[0].longitude,
                                    "latitude": res2[0].latitude,
                                    "status": res2[0].status,
                                    "language_id": res2[0].language_id,
                                    "language_code": res2[0].language_code,
                                    "language_name": res2[0].language_name,
                                    "Password": res2[0].m_password,
                                    "cover_photo": res2[0].cover_photo,
                                    "profile_photo": res2[0].profile_photo,
                                    "prayer_time_reminder": res2[0].prayer_time_reminder,
                                    "mosque_updates_notifications": res2[0].mosque_updates_notifications,
                                    "subscription_type": type,
                                    "subscription_end_date": end_date,
                                    "subscription_flag": sub_flag,
                                });
                            }
                            

                            response_arr['success'] = 1;
                            response_arr['msg'] = 'Signup Successfully.';
                            response_arr['record'] = getUserData;

                            result(null, response_arr);
                        });

                    } else {
                        response_arr['msg'] = "User Signup failed!";
                        result(null, response_arr);
                    }
                });
        }
    });
    }
};

Model.loginModel = function loginModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;

    var otp = Math.floor(1000 + Math.random() * 9000);
    var response_arr = [];

    var useremail = (param.useremail) ? param.useremail : '';
    var userpassword = (param.userpassword) ? param.userpassword : '';
    // var user_type = (param.user_type) ? param.user_type : '';
    var login_type = (param.login_type) ? param.login_type : '';
    var firebase_token = (param.firebase_token) ? param.firebase_token : '';
    var device_token = (param.device_token) ? param.device_token : '';
    var device = (param.device) ? param.device : 1;
    var getProfile = [];
    var language_id =  (param.language_id) ? param.language_id : '';

    console.log(`Login : ${JSON.stringify(param)}`);
    
        var chk_email = `SELECT id FROM users WHERE email='${useremail}' AND soft_delete = '0';SELECT id FROM users WHERE email='${useremail}' and m_password='${userpassword}' AND soft_delete = '0' `;
        var q = sql.query(chk_email,async function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }

            console.log(res[1]);
            if (res[0] == '') {
                // var validation_Msg = 'Please check email';
                response_arr['msg'] = "Please check email";
                result(null, response_arr);
            } else if (res[1] == '') {
                // var validation_Msg = 'Please check Password, Password is wrong';
                response_arr['msg'] = "Please check Password, Password is wrong";
                result(null, response_arr);
            } else {
                if(language_id != '' && language_id != 0 )
                {
                    var changeLanguage = await helper.sql_query(sql, `UPDATE users SET language_id='${language_id}' WHERE soft_delete='0' and users.email='${useremail}' and users.m_password='${userpassword}' `).catch(console.log);
                    console.log('changeLanguage',changeLanguage);
                }
                //login_type:1  = College/University AND Mosque
                if(login_type == '1')
                {
                    
                    var query_text = `SELECT users.*,users.id as user_id,CASE WHEN users.cover_photo!='' THEN CONCAT('${fullUrl}/uploadsCoverPhoto/',users.cover_photo) ELSE '' END AS cover_photo,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,notification_setting.prayer_time_reminder,notification_setting.mosque_updates_notifications, languages.*,languages.id as language_id FROM users , notification_setting, languages WHERE languages.id = users.language_id AND notification_setting.user_id = users.id and users.soft_delete='0' and users.status='0' and users.email='${useremail}' and users.m_password='${userpassword}' and users.user_role != '4' `;
                    var q = sql.query(query_text, async function (err, res) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }

                        if (res.length > 0) {

                            var query_text = `SELECT token,device FROM tbl_login_token WHERE token = '${firebase_token}' AND device = '${device}' AND user_id = '${res[0].user_id}';DELETE FROM tbl_login_token WHERE user_id = '${res[0].user_id}';`;
                            sql.query(query_text, [], function (err, res3) {
                                if (err) {
                                    console.log("error: ", err);
                                    result(err, null);
                                }
                                else {
                                    var token_set = {
                                        'user_id': res[0].user_id,
                                        'token': firebase_token,
                                        'deviceToken': device_token,
                                        'user_type': res[0].user_role,
                                        'device': device,
                                        'created_at': today,
                                    };
                                    var query_text = `INSERT INTO tbl_login_token SET ?;`;
                                    sql.query(query_text, token_set, function (err, res4) {
                                        if (err) {
                                            console.log("error: ", err);
                                            result(err, null);
                                        }
                                    })
                                }
                            });
                            // console.log('gfhhb',res[0].mobile_no);
                            if (res[0].mobile_no == '') {
                                res[0].mobile_no = '-';
                            }

                            if (res[0].m_password == '') {
                                res[0].m_password = '-';
                            }

                            if (res[0].user_role == 2) {
                                res[0].user_type = 'Mosque';
                            } else if (res[0].user_role == 3) {
                                res[0].user_type = 'college/Univercity';
                            } else if (res[0].user_role == 4) {
                                res[0].user_type = 'Public';
                            }

                            var chk_subscription = await helper.sql_query(sql, `SELECT id,type,DATE_FORMAT(start_date,'%Y-%m-%d %H:%i') as start_date,DATE_FORMAT(end_date,'%Y-%m-%d %H:%i') as end_date FROM subscription WHERE mosque_id = '${res[0].user_id}' `).catch(console.log);
                            console.log('h',chk_subscription);
                            if(chk_subscription.length)
                            {
                                if(chk_subscription[0].type == '1')
                                {
                                    var type = 'subscriber'
                                }else
                                {
                                    var type = 'trial';
                                }
                                var end_date = chk_subscription[0].end_date;
                                if(today >= end_date)
                                {
                                    var sub_flag = 1;
                                }else{
                                    var sub_flag = 2;
                                }

                            }else{
                                var type = 'new';
                                var end_date = '';
                                var sub_flag = 0;
                            }
                            // console.log(' res[0].user_id,', res[0],);
                                getProfile.push({
                                    "id": res[0].user_id,
                                    "user_role": res[0].user_role,
                                    "user_type":res[0].user_type,
                                    "name":res[0].mosque_name,
                                    "first_name": res[0].first_name,
                                    "last_name": res[0].last_name,
                                    "email": res[0].email,
                                    "country_code": res[0].country_code,
                                    "mobile_no": res[0].mobile_no,
                                    "address": res[0].address,
                                    "address1": res[0].address1,
                                    "address2": res[0].address2,
                                    "post_code": res[0].post_code,
                                    "longitude": res[0].longitude,
                                    "latitude": res[0].latitude,
                                    "status": res[0].status,
                                    "language_id":res[0].language_id,
                                    "language_code":res[0].language_code,
                                    "language_name":res[0].language_name,
                                    "Password": res[0].m_password,
                                    "cover_photo": res[0].cover_photo,
                                    "profile_photo": res[0].profile_photo,
                                    "prayer_time_reminder": res[0].prayer_time_reminder,
                                    "mosque_updates_notifications": res[0].mosque_updates_notifications,
                                    "subscription_type": type,
                                    "subscription_end_date": end_date,
                                    "subscription_flag": sub_flag,
                                });
                                response_arr['success'] = 1;
                                response_arr['msg'] = `${res[0].first_name} ${res[0].last_name} loggined successfully.`;
                                response_arr['data'] = getProfile;
                                result(null, response_arr);
                        } else {
                            response_arr['msg'] = "Make sure you are logging with same account type (Public) as you signed up!";
                            result(null, response_arr);
                        }
                    });
                }else{
                    var query_text = `SELECT users.*,users.id as user_id,CASE WHEN users.cover_photo!='' THEN CONCAT('${fullUrl}/uploadsCoverPhoto/',users.cover_photo) ELSE '' END AS cover_photo,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,notification_setting.prayer_time_reminder,notification_setting.mosque_updates_notifications, languages.* FROM users , notification_setting , languages WHERE languages.id = users.language_id AND notification_setting.user_id = users.id and users.soft_delete='0' and users.status='0' and users.email='${useremail}' and users.m_password='${userpassword}' and users.user_role = '4'  `;
                    var q = sql.query(query_text,async function (err, res) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }
                        // console.log('email',res);

                        if (res.length > 0) {

                            var query_text = `SELECT token,device FROM tbl_login_token WHERE token = '${firebase_token}' AND device = '${device}' AND user_id = '${res[0].user_id}';DELETE FROM tbl_login_token WHERE user_id = '${res[0].user_id}';`;
                            sql.query(query_text, [], function (err, res3) {
                                if (err) {
                                    console.log("error: ", err);
                                    result(err, null);
                                }
                                else {
                                    var token_set = {
                                        'user_id': res[0].user_id,
                                        'token': firebase_token,
                                        'deviceToken': device_token,
                                        'user_type': res[0].user_role,
                                        'device': device,
                                        'created_at': today,
                                    };
                                    var query_text = `INSERT INTO tbl_login_token SET ?;`;
                                    sql.query(query_text, token_set, function (err, res4) {
                                        if (err) {
                                            console.log("error: ", err);
                                            result(err, null);
                                        }
                                    })
                                }
                            });

                            if (res[0].mobile_no == '') {
                                res[0].mobile_no = '-';
                            }

                            if (res[0].m_password == '') {
                                res[0].m_password = '-';
                            }

                            if (res[0].user_role == 2) {
                                res[0].user_type = 'Mosque';
                            } else if (res[0].user_role == 3) {
                                res[0].user_type = 'college/Univercity';
                            } else if (res[0].user_role == 4) {
                                res[0].user_type = 'Public';
                            }

                            var chk_subscription = await helper.sql_query(sql, `SELECT id,type,DATE_FORMAT(start_date,'%Y-%m-%d %H:%i') as start_date,DATE_FORMAT(end_date,'%Y-%m-%d %H:%i') as end_date FROM subscription WHERE mosque_id = '${res[0].user_id}' `).catch(console.log);
                            console.log('h',chk_subscription);
                            if(chk_subscription.length)
                            {
                                if(chk_subscription[0].type == '1')
                                {
                                    var type = 'subscriber'
                                }else
                                {
                                    var type = 'trial';
                                }
                                var end_date = chk_subscription[0].end_date;
                                if(today >= end_date)
                                {
                                    var sub_flag = 1;
                                }else{
                                    var sub_flag = 2;
                                }

                            }else{
                                var type = 'new';
                                var end_date = '';
                                var sub_flag = 0;
                            }
                            var chk_default_mosque = await helper.sql_query(sql, `SELECT uj.id,uj.user_id,uj.mosque_id,uj.is_default, DATE_FORMAT(uj.updated_at,'%Y-%m-%d %H:%i') as updated_at,mosque.user_role as mosque_role,mosque.mosque_name,mosque.first_name as mosque_first_name,mosque.last_name as mosque_last_name,mosque.address as mosque_address,CASE WHEN mosque.cover_photo!='' THEN CONCAT('${fullUrl}/uploadsCoverPhoto/',mosque.cover_photo) ELSE '' END AS mosque_cover_photo,CASE WHEN mosque.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',mosque.profile_photo) ELSE '' END AS mosque_profile_photo FROM user_journey as uj LEFT JOIN users as mosque ON mosque.id = uj.mosque_id WHERE uj.user_id = '${res[0].user_id}' AND uj.is_default = '1' limit 1 `).catch(console.log);
                            // console.log('chk_default_mosque',chk_default_mosque[0].mosque_id);
                            
                            // var getAutoDonation =  await helper.sql_query(sql, `SELECT count(id) as get_auto_donation FROM donations WHERE public_id ='${res[0].user_id}' AND mosque_id = '${chk_default_mosque[0].mosque_id}' AND auto_donation = '1' `).catch(console.log);
                            var getAutoDonation =  await helper.sql_query(sql, `SELECT * FROM donations WHERE public_id ='${res[0].user_id}' AND mosque_id = '${chk_default_mosque[0].mosque_id}' AND project_id = 0  order by id DESC limit 1`).catch(console.log);
                            if(getAutoDonation[0].length > 0)
                            {
                                if(getAutoDonation[0].auto_donation == 1){
                                    var donationData = 1;
                                }else{ 
                                    var donationData = 0;
                                } 
                            }else{
                                var donationData = 0;
                            } 

                            if (res[0].stripe_customer_id != '') {
                                const cards = await stripe.customers.listSources(
                                    res[0].stripe_customer_id,
                                    {object: 'card'}
                                );
                                console.log('cards2',cards.data);
                                if (cards.data != '') {
                                    var card = 'Avalable';
                                } else {
                                    var card = 'Not Available';
                                }
                            }else{
                                var card = 'Not Available';
                            }
                                getProfile.push({
                                    "id": res[0].user_id,
                                    "user_role": res[0].user_role,
                                    "user_type":res[0].user_type,
                                    "stripe_customer_id":res[0].stripe_customer_id,
                                    "card_available":card,
                                    "name":res[0].mosque_name,
                                    "first_name": res[0].first_name,
                                    "last_name": res[0].last_name,
                                    "email": res[0].email,
                                    "country_code": res[0].country_code,
                                    "mobile_no": res[0].mobile_no,
                                    "address": res[0].address,
                                    "address1": res[0].address1,
                                    "address2": res[0].address2,
                                    "post_code": res[0].post_code,
                                    "longitude": res[0].longitude,
                                    "latitude": res[0].latitude,
                                    "status": res[0].status,
                                    "language_id": res[0].language_id,
                                    "language_code": res[0].language_code,
                                    "language_name": res[0].language_name,
                                    "Password": res[0].m_password,
                                    "cover_photo": res[0].cover_photo,
                                    "profile_photo": res[0].profile_photo,
                                    "auto_dation": donationData,
                                    "prayer_time_reminder": res[0].prayer_time_reminder,
                                    "mosque_updates_notifications": res[0].mosque_updates_notifications,
                                    "is_default_mosque": (chk_default_mosque[0])?true : false,
                                    "default_mosque_id": (chk_default_mosque[0])?chk_default_mosque[0].mosque_id : 0,
                                    "default_mosque_role": (chk_default_mosque[0])?chk_default_mosque[0].mosque_role : 0,
                                    "default_mosque_name": (chk_default_mosque[0])?chk_default_mosque[0].mosque_name : '',
                                    "default_mosque_first_name": (chk_default_mosque[0])?chk_default_mosque[0].mosque_first_name : '',
                                    "default_mosque_last_name": (chk_default_mosque[0])?chk_default_mosque[0].mosque_last_name : '',
                                    "default_mosque_address": (chk_default_mosque[0])?chk_default_mosque[0].mosque_address : '',
                                    "default_mosque_cover_pic": (chk_default_mosque[0])?chk_default_mosque[0].mosque_cover_photo : '',
                                    "default_mosque_profile_pic": (chk_default_mosque[0])?chk_default_mosque[0].mosque_profile_photo : '',
                                    
                                    "subscription_type": type,
                                    "subscription_end_date": end_date,
                                    "subscription_flag": sub_flag,
                                });
                                response_arr['success'] = 1;
                                response_arr['msg'] = `${res[0].first_name} ${res[0].last_name} loggined successfully.`;
                                response_arr['data'] = getProfile;
                                result(null, response_arr);
                        } else {
                            response_arr['msg'] = "Make sure you are logging with same account type (Mosque/College) as you signed up!";
                            result(null, response_arr);
                        }
                    });
            }
        }
        });
    
};

Model.logoutModel = async function logoutModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;
    var user_id = param.user_id;
    var token = param.token;
    var response_arr = [];
    console.log(`Logout Data : ${JSON.stringify(param)}`);

    var get_query = await helper.sql_query(sql, `SELECT tbl_login_token.id FROM tbl_login_token WHERE tbl_login_token.user_id = '${user_id}' AND tbl_login_token.token = '${token}' ORDER BY tbl_login_token.id DESC LIMIT 1`).catch(console.log);
    console.log(get_query);
    if (get_query != '') {
        // var delete_query = await helper.sql_query(sql, `DELETE FROM tbl_login_token  WHERE id NOT IN (${get_query[0].id}) AND user_id = '${user_id}'`).catch(console.log);
        var delete_query = await helper.sql_query(sql, `DELETE FROM tbl_login_token  WHERE id = ${get_query[0].id}  AND user_id = '${user_id}'`).catch(console.log);
    }

    response_arr['success'] = 1;
    response_arr['msg'] = ` Logout successfully.`;
    result(null, response_arr);
};

Model.ForgotPasswordModel = function ForgotPasswordModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;

    var id = (param.id) ? param.id : '';
    var email = (param.email) ? param.email : '';
    var password = (param.password) ? param.password : '';

    var response_arr = [];

    if (!email) {
        response_arr['msg'] = 'Email field required!';
        result(null, response_arr);
    }

    var query_text = `SELECT id FROM users WHERE soft_delete = '0' AND email = ?;`;
    sql.query(query_text, [email], function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        if (res.length == 0) {
            response_arr['msg'] = 'User are not registered with this email id.';
            result(null, response_arr);
        }

        var query_text = "SELECT * FROM users WHERE soft_delete = '0' AND email = ? ;";
        sql.query(query_text, [email], function (err, res2) {
            console.log("email", res2[0].email);

            var response = [{
                "id": res2[0].id,
                "email": res2[0].email,
                "password": res2[0].password
            }];

            // console.log('getReponse ',response);
            var readHTMLFile = function (path, callback) {
                fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                    if (err) {
                        throw err;
                        callback(err);
                    }
                    else {
                        callback(null, html);
                    }
                });
            };

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 465,
                auth: {
                    user: 'testing1.technobrigadeinfo@gmail.com',
                    pass: '!Testing45678@'
                },
                secure: false,
                // here it goes
                tls: { rejectUnauthorized: false },
                debug: true
            });

            readHTMLFile(__dirname + '/mail.html', function (err, html) {
                console.log("__dirname", __dirname);
                var template = handlebars.compile(html);
                var replacements = {
                    username: `${res2[0].first_name}  ${res2[0].last_name}`,
                    password_txt: res2[0].password,
                    // logo: `${fullUrl}/KK_128.png`,
                };
                console.log(replacements);
                var htmlToSend = template(replacements);
                var mailOptions = {
                    from: 'noreply@technobrigadeinfotech.com',
                    to: res2[0].email,
                    subject: 'Mosque App : Forgot Password',
                    // text: `<b>Your old password is</b> : ${res2[0].password}`,
                    // html: ``,
                    // console.log("");
                    html: htmlToSend,
                    // cc: 'nehal.technobrigadeinfo@gmail.com'
                }

                // console.log("mailoptions",mailOptions);

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log('error66', error);
                        response_arr['msg'] = `Mail can't sent .`;
                        response_arr['record'] = error;
                        result(null, response_arr);
                    } else {
                        console.log('Email sent: ' + info.response);
                        response_arr['success'] = 1;
                        response_arr['msg'] = 'Mail sent successfully.';
                        // response_arr['record'] = response;
                        result(null, response_arr);
                    }
                });
            });


        });
    });
};

Model.changePasswordModel = function changePasswordModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;

    var otp = Math.floor(1000 + Math.random() * 9000);
    var response_arr = [];

    var user_id = (param.user_id) ? param.user_id : '';
    // var user_role = (param.user_role) ? param.user_id : '';
    var old_password = (param.old_password) ? param.old_password : '';
    var new_password = (param.new_password) ? param.new_password : '';

    console.log(`Change Password : ${JSON.stringify(param)}`);
    check_password = `SELECT * FROM users WHERE soft_delete='0' and id='${user_id}' and m_password='${old_password}' `;
    console.log(check_password);
    var q = sql.query(check_password, function (err, resCheckPassword) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        // console.log(resCheckPassword);
        if (resCheckPassword.length > 0) {
            query_text = `UPDATE users SET m_password='${new_password}' , password='${new_password}'  WHERE soft_delete='0' and id='${user_id}' `;
            console.log(query_text);
            var q = sql.query(query_text, function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }

                response_arr['success'] = 1;
                response_arr['msg'] = 'Password Change successfully.';
                // response_arr['updateProfile_data'] = res;
                result(null, response_arr);
            });

        } else {
            response_arr['msg'] = "Please Check old password!";
            result(null, response_arr);
        }
    });
};

Model.changeMobileNoModel = function changeMobileNoModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;

    var otp = Math.floor(1000 + Math.random() * 9000);
    var response_arr = [];

    var user_id = (param.user_id) ? param.user_id : '';
    var dial_code = (param.country_code) ? param.country_code : '';
    var new_mobile_no = (param.new_mobile_no) ? param.new_mobile_no : '';

    console.log(`Change Mobile Number : ${JSON.stringify(param)}`);

            // var OldData = `SELECT mobile_no,dial_code FROM users WHERE id='${user_id}'`;
            // var q = sql.query(OldData, function(err, res) {
            //     if (err) {
            //         console.log("error: ", err);
            //         result(err, null);
            //     }
            // });

            var query_text = `SELECT * FROM users WHERE mobile_no = '${new_mobile_no}' and id!='${user_id}' `;
            sql.query(query_text, function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                if (res.length > 0) {
                    response_arr['msg'] = 'Mobile Number already exist!';
                    result(null, response_arr);
                } else {
                    var optLength = 6;
                    var genrate_otp = Math.floor(Math.pow(10, optLength - 1) + Math.random() * (Math.pow(10, optLength) - Math.pow(10, optLength - 1) - 1));
                    query_text = `UPDATE users SET country_code='${dial_code}', mobile_no='${new_mobile_no}' WHERE soft_delete='0' and id='${user_id}';SELECT id,first_name,last_name,email,country_code,mobile_no,user_role FROM users WHERE id='${user_id}' and soft_delete='0' `;
                    console.log(query_text);
                    var q = sql.query(query_text, function (err, res) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }

                        var user_type = res[1][0].user_type;
                        if (res[0].affectedRows > 0) {
                            /*
                            var readHTMLFile = function (path, callback) {
                                fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                                    if (err) {
                                        throw err;
                                        callback(err);
                                    }
                                    else {
                                        callback(null, html);
                                    }
                                });
                            };

                            var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                port: 465,
                                auth: {
                                    user: 'testing1.technobrigadeinfo@gmail.com',
                                    pass: '!testing12345@'
                                },
                                secure: false,
                                // here it goes
                                tls: { rejectUnauthorized: false },
                                debug: true
                            });
                            console.log('d', res[1][0].otp_code);
                            readHTMLFile(__dirname + '/otpSendMail.html', function (err, html) {
                                var template = handlebars.compile(html);
                                var replacements = {
                                    username: `${res[1][0].name} `,
                                    otpCode: res[1][0].otp_code,
                                    // logo: `${fullUrl}/KK_128.png`,
                                };
                                var htmlToSend = template(replacements);
                                var mailOptions = {
                                    from: 'noreply@technobrigadeinfotech.com',
                                    to: res[1][0].email,
                                    subject: 'Mosque App : Otp Send',
                                    // text: `<b>Your old password is</b> : ${res2[0].password}`,
                                    // html: ``,
                                    // console.log("");
                                    html: htmlToSend,
                                    // cc: 'nehal.technobrigadeinfo@gmail.com'
                                }

                                // console.log("mailoptions",mailOptions);        
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log('error66', error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    }
                                });
                            });
                            */
                            response_arr['success'] = 1;
                            response_arr['msg'] = `Youe Mobile Number Changed successfully.`;
                            response_arr['changePassword'] = res[1][0];
                            result(null, response_arr);
                        } else {
                            response_arr['msg'] = 'Contact Number cant Change .';
                            result(null, response_arr);
                        }

                    });
                }
            });


};

Model.getProfileModel = function getProfileModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;

    var response_arr = [];

    var user_id = (param.user_id) ? param.user_id : '';

    var EditProfile = [];
    var getProfile = [];
    console.log(`get Profile : ${JSON.stringify(param)}`);

            query_text = `SELECT users.id as user_id,users.user_role,users.mosque_name,users.first_name,users.last_name,users.email,users.country_code,users.mobile_no,users.address,users.address1,users.address2, users.post_code, users.longitude, users.latitude, users.status, CASE WHEN users.cover_photo!='' THEN CONCAT('${fullUrl}/uploadsCoverPhoto/',users.cover_photo) ELSE '' END AS cover_photo,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,notification_setting.prayer_time_reminder,notification_setting.mosque_updates_notifications, languages.* FROM languages , users LEFT JOIN notification_setting ON users.id = notification_setting.user_id WHERE languages.id = users.language_id AND users.soft_delete='0' and users.status='0' and users.id='${user_id}' `;
            console.log(query_text);
            var q = sql.query(query_text,async function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }

                if (res.length > 0) {
                    // console.log('res[0].id',res);
                    if (res[0].mobile_no == '') {
                        res[0].mobile_no = '-';
                    }

                    if (res[0].m_password == '') {
                        res[0].m_password = '-';
                    }

                    if (res[0].user_role == 2) {
                        res[0].user_type = 'Mosque';
                    } else if (res[0].user_role == 3) {
                        res[0].user_type = 'college/Univercity';
                    } else if (res[0].user_role == 4) {
                        res[0].user_type = 'Public';
                    }

                    if (res[0].longitude == null) {
                        res[0].longitude = '-';
                    }

                    if (res[0].latitude == null) {
                        res[0].latitude = '-';
                    }

                    if (res[0].prayer_time_reminder == null) {
                        res[0].prayer_time_reminder = '-';
                    }

                    if (res[0].mosque_updates_notifications == null) {
                        res[0].mosque_updates_notifications = '-';
                    }

                    var chk_subscription = await helper.sql_query(sql, `SELECT id,type,DATE_FORMAT(start_date,'%Y-%m-%d %H:%i') as start_date,DATE_FORMAT(end_date,'%Y-%m-%d %H:%i') as end_date FROM subscription WHERE mosque_id = '${res[0].user_id}' `).catch(console.log);
                            console.log('h',chk_subscription);
                            if(chk_subscription.length)
                            {
                                if(chk_subscription[0].type == '1')
                                {
                                    var type = 'subscriber'
                                }else
                                {
                                    var type = 'trial';
                                }
                                var end_date = chk_subscription[0].end_date;
                                if(today >= end_date)
                                {
                                    var sub_flag = 1;
                                }else{
                                    var sub_flag = 2;
                                }

                            }else{
                                var type = 'new';
                                var end_date = '';
                                var sub_flag = 0;
                            }
                            
                    getProfile.push({
                        "id": res[0].user_id,
                        "user_role": res[0].user_role,
                        "user_type":res[0].user_type,
                        "name":res[0].mosque_name,
                        "first_name": res[0].first_name,
                        "last_name": res[0].last_name,
                        "email": res[0].email,
                        "country_code": res[0].country_code,
                        "mobile_no": res[0].mobile_no,
                        "address": res[0].address,
                        "address1": res[0].address1,
                        "address2": res[0].address2,
                        "post_code": res[0].post_code,
                        "longitude": res[0].longitude,
                        "latitude": res[0].latitude,
                        "status": res[0].status,
                        "language_id": res[0].language_id,
                        "language_code": res[0].language_code,
                        "language_name": res[0].language_name,
                        "Password": res[0].m_password,
                        "cover_photo": res[0].cover_photo,
                        "profile_photo": res[0].profile_photo,
                        "prayer_time_reminder": res[0].prayer_time_reminder,
                        "mosque_updates_notifications": res[0].mosque_updates_notifications,
                        "subscription_type": type,
                        "subscription_end_date": end_date,
                        "subscription_flag": sub_flag,
                    });
                    response_arr['success'] = 1;
                    response_arr['msg'] = 'Profile Detail get successfully.';
                    response_arr['getProfile'] = getProfile;
                    result(null, response_arr);
                    
                } else {
                    response_arr['msg'] = "Profile Detail display failed!";
                    result(null, response_arr);
                }
            });
};

Model.updateProfileModel = function updateProfileModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;
    files_param = req.files;

    var response_arr = [];

    var user_id = (param.user_id) ? param.user_id : '';
    var user_role = (param.user_role) ? param.user_role : '';
    var mosque = (param.mosque_name) ? param.mosque_name : '';
    var first_name = (param.first_name) ? param.first_name : '';
    var last_name = (param.last_name) ? param.last_name : '';
    var user_email = (param.user_email) ? param.user_email : '';
    var password = (param.password) ? param.password : '';
    var country_code = (param.country_code) ? param.country_code : '';
    var mobile_no = (param.mobile_no) ? param.mobile_no : '';
    var address = (param.address) ? param.address : '';
    var address1 = (param.address1) ? param.address1 : '';
    var address2 = (param.address2) ? param.address2 : '';
    var post_code = (param.post_code) ? param.post_code : '';
    var longitude = (param.longitude) ? param.longitude : '';
    var latitude = (param.latitude) ? param.latitude : '';

    var getProfile = [];
    console.log('param',param);

    var dir = './public/uploadsCoverPhoto';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    var dir = './public/uploadsProfilePhoto';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    console.log(`Update Profile : ${JSON.stringify(param)}`);
        
            var checkEmail = `SELECT * FROM users WHERE email = '${user_email}' and id != '${user_id}' `;
            console.log('hg',checkEmail);
            sql.query(checkEmail, function (err, resCheckMail) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                if (resCheckMail.length > 0) {
                    console.log(resCheckMail);
                    response_arr['msg'] = 'Email already exist!';
                    result(null, response_arr);
                } else {
                    var checkContact = `SELECT * FROM users WHERE mobile_no = '${mobile_no}' and id!='${user_id}' `;
                    sql.query(checkContact, async function(err, resContact) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }
                        if (resContact.length > 0) {
                            response_arr['msg'] = 'Mobile No. already exist!';
                            result(null, response_arr);
                        } else 
                        {
                            var query_text55 = `SELECT id,cover_photo,profile_photo FROM users WHERE id = '${user_id}'`;
                            var chk_old_image = await helper.sql_query(sql, query_text55).catch(console.log);
                            // File Upload : Start
                                var pic = (req.files && req.files.profile_photo) ? req.files.profile_photo : []
                                // console.log('photo type',typeof pic, 'length :',pic.length);
                                if (files_param && typeof pic.length === "undefined") {
                                    console.log('single file',pic.name);
                                    var fileName = 'profile_' + pic.md5 + path.extname(pic.name);
                                    var newpath = "./public/uploadsProfilePhoto/" + fileName;
                                    pic.mv(newpath, function (err) {
                                        var oldImage = chk_old_image[0].profile_photo;
                                        console.log(oldImage);
                                        if (oldImage != '') {
                                            var fs = require('fs');
                                            var filePath = './public/uploadsProfilePhoto/' + oldImage;
                                            try {
                                                if (fs.existsSync(filePath)) {
                                                    fs.unlinkSync(filePath);
                                                } else {
                                                    console.log("File does not exist.")
                                                }
                                            } catch (err) {
                                                console.error(err)
                                            }
                                        }
                                        if (err) { result("Error uploading file.", err); return; }
                                    });
                                    profile_photo = fileName;
                                    
                                    var query_profile = `UPDATE users SET profile_photo = '${profile_photo}'  WHERE soft_delete='0' and user_role='${user_role}' and status = '0' and id='${user_id}' `;
                                    var update_profile = await helper.sql_query(sql, query_profile).catch(console.log);
                                    // console.log('update_profile',update_profile);
                                } else {
                                    profile_photo = '';
                                }
                            // File Upload : End 

                            // Cover Photo Upload : Start
                            var cover_pic = (req.files && req.files.cover_photo) ? req.files.cover_photo : []
                            console.log('Cover Type',typeof pic, 'length :',pic.length);
                            if (files_param && typeof cover_pic.length === "undefined") {
                                console.log('single file',cover_pic.name);
                                var fileName1 = 'cover_' + cover_pic.md5 + path.extname(cover_pic.name);
                                var newpath1 = "./public/uploadsCoverPhoto/" + fileName1;
                                cover_pic.mv(newpath1, function (err) {
                                    var old_cover_Image = chk_old_image[0].cover_photo;
                                    console.log(old_cover_Image);
                                    if (old_cover_Image != '') {
                                        var fs = require('fs');
                                        var filePath = './public/uploadsCoverPhoto/' + old_cover_Image;
                                        try {
                                            if (fs.existsSync(filePath)) {
                                                fs.unlinkSync(filePath);
                                            } else {
                                                console.log("File does not exist.")
                                            }
                                        } catch (err) {
                                            console.error(err)
                                        }
                                    }
                                    if (err) { result("Error uploading file.", err); return; }
                                });
                                var cover_photo = fileName1;
                                query_cover = `UPDATE users SET cover_photo = '${cover_photo}'  WHERE soft_delete='0' and user_role='${user_role}' and status = '0' and id='${user_id}' `;
                                var update_cover = await helper.sql_query(sql, query_cover).catch(console.log);
                                // console.log('update_profile',update_cover);
                            } else {
                                var cover_photo = '';
                            }
                        // File Upload : End 

                            if(user_role == '4')
                            {
                                    profile_update = `UPDATE users SET first_name='${first_name}' ,last_name='${last_name}' , email='${user_email}' , country_code='${country_code}' ,mobile_no='${mobile_no}' , address='${address}' ,address1='${address1}' ,address2='${address2}' ,post_code='${post_code}' , longitude='${longitude}' ,latitude='${latitude}' , password = '${password}', m_password = '${password}', updated_at = '${today}' WHERE soft_delete='0' and user_role='${user_role}' and status = '0' and id='${user_id}' `;
                                
                                // console.log('profile_update',profile_update);
                            }else{;
                                    profile_update = `UPDATE users SET mosque_name='${mosque}' ,first_name='${first_name}' ,last_name='${last_name}' , email='${user_email}' , country_code='${country_code}' ,mobile_no='${mobile_no}' , address='${address}' ,  address1='${address1}' ,address2='${address2}' ,post_code='${post_code}' , longitude='${longitude}' ,latitude='${latitude}' , updated_at = '${today}' WHERE soft_delete='0' and user_role='${user_role}' and status = '0' and id='${user_id}' `;
                                
                            }
                            // console.log(profile_update12);
                            var q = sql.query(profile_update, function (err, resProfile) {
                                if (err) {
                                    console.log("error: ", err);
                                    result(err, null);
                                }
                                // console.log(resProfile);
                                if (resProfile.affectedRows > 0) {
                                    query_text = `SELECT users.*,CASE WHEN users.cover_photo!='' THEN CONCAT('${fullUrl}/uploadsCoverPhoto/',users.cover_photo) ELSE '' END AS cover_photo,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,notification_setting.prayer_time_reminder,notification_setting.mosque_updates_notifications, languages.* FROM  users LEFT JOIN languages ON languages.id=users.language_id LEFT JOIN notification_setting ON users.id = notification_setting.user_id WHERE users.soft_delete='0' and users.status='0' and users.id='${user_id}' `;
                                    console.log(query_text);
                                    var q = sql.query(query_text, function (err, res) {
                                        if (err) {
                                            console.log("error: ", err);
                                            result(err, null);
                                        }

                                        if (res.length > 0) {

                                            if (res[0].mobile_no == '') {
                                                res[0].mobile_no = '-';
                                            }

                                            if (res[0].m_password == '') {
                                                res[0].m_password = '-';
                                            }

                                            if (res[0].user_role == 2) {
                                                res[0].user_type = 'Mosque';
                                            } else if (res[0].user_role == 3) {
                                                res[0].user_type = 'college/Univercity';
                                            } else if (res[0].user_role == 4) {
                                                res[0].user_type = 'Public';
                                            }

                                            if (res[0].longitude == null) {
                                                res[0].longitude = '-';
                                            }

                                            if (res[0].latitude == null) {
                                                res[0].latitude = '-';
                                            }

                                            if (res[0].prayer_time_reminder == null) {
                                                res[0].prayer_time_reminder = '-';
                                            }

                                            if (res[0].mosque_updates_notifications == null) {
                                                res[0].mosque_updates_notifications = '-';
                                            }

                                            getProfile.push({
                                                "id": res[0].id,
                                                "user_role": res[0].user_role,
                                                "user_type":res[0].user_type,
                                                "name":res[0].mosque_name,
                                                "first_name": res[0].first_name,
                                                "last_name": res[0].last_name,
                                                "email": res[0].email,
                                                "country_code": res[0].country_code,
                                                "mobile_no": res[0].mobile_no,
                                                "address": res[0].address,
                                                "address1": res[0].address1,
                                                "address2": res[0].address2,
                                                "post_code": res[0].post_code,
                                                "longitude": res[0].longitude,
                                                "latitude": res[0].latitude,
                                                "status": res[0].status,
                                                "language_id": res[0].language_id,
                                                "language_code": res[0].language_code,
                                                "language_name": res[0].language_name,
                                                "Password": res[0].m_password,
                                                "cover_photo": res[0].cover_photo,
                                                "profile_photo": res[0].profile_photo,
                                                "prayer_time_reminder": res[0].prayer_time_reminder,
                                                "mosque_updates_notifications": res[0].mosque_updates_notifications,
                                            });
                                            response_arr['success'] = 1;
                                            response_arr['msg'] = 'Profile Detail Updated successfully.';
                                            response_arr['updateProfile_data'] = getProfile;
                                            result(null, response_arr);
                                            
                                        } else {
                                            response_arr['msg'] = "Profile Detail display failed!";
                                            result(null, response_arr);
                                        }
                                    });

                                } else {
                                    response_arr['msg'] = "Profile Detail update failed!";
                                    result(null, response_arr);
                                }
                            });
                        }
                    });
                }

            });
};

Model.getSubscriptionPlanModel = function getSubscriptionPlanModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;

    var response_arr = [];

    var getPlan = [];
    console.log(`get Subscription Plan : ${JSON.stringify(param)}`);

            query_text = `SELECT * FROM subscription_plan WHERE status='0' LIMIT 1 `;
            console.log(query_text);
            var q = sql.query(query_text, function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                
                if (res.length > 0) {
                    // console.log('f',res.length);
                    getPlan.push({
                        "id": res[0].id,
                        "title": res[0].title,
                        "description":res[0].description,
                        "amount":res[0].amount,
                        "sort_description": res[0].sort_description,
                    });
                    console.log('fdvgf',getPlan);
                    response_arr['success'] = 1;
                    response_arr['msg'] = 'Get Subscription Plan.';
                    response_arr['record'] = getPlan;
                    result(null, response_arr);
                    
                } else {
                    response_arr['msg'] = "Can not get subcription Plan";
                    result(null, response_arr);
                }
            });
};

Model.userSubscriptionModel = async function userSubscriptionModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;
    var moment = require('moment'); // require
    var response_arr = [];

    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var type = (param.type) ? param.type : '0';
    var subscription_plan_id = (param.subscription_plan_id) ? param.subscription_plan_id : '';
    // var amount = (param.amount) ? param.amount : '';
    var start_date = (param.start_date) ? param.start_date : '';

    console.log(`subscription Data : ${JSON.stringify(param)}`);
        if(type == '0')
        {
            var chk_subscription = await helper.sql_query(sql, `SELECT id,DATE_FORMAT(start_date,'%d-%m-%Y %H:%i') as start_date,DATE_FORMAT(end_date,'%d-%m-%Y %H:%i') as end_date FROM subscription WHERE mosque_id = '${mosque_id}' AND type = '0' `).catch(console.log);
            if (chk_subscription.length > 0) {

                response_arr['success'] = 1;
                response_arr['msg'] = `Your Free Trial Subscription is already start '${chk_subscription[0].start_date}' to '${chk_subscription[0].end_date}' .`;
                result(null, response_arr);
            }else{
                var amount = '0';
                // var end_date = moment(start_date).add(30, 'd').format('YYYY-MM-DD HH:mm');
                var end_date = moment(start_date).add(3, 'M').format('YYYY-MM-DD HH:mm');
                var subscription_insert = {
                    'mosque_id': mosque_id,
                    'type': type,
                    'subscription_plan_id': subscription_plan_id,
                    'amount': amount,
                    'start_date': start_date,
                    'end_date': end_date,
                    'created_at': today,
                };
                
                var query_text = `INSERT INTO subscription set ? `;
                sql.query(query_text, subscription_insert, function (err, res) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }

                    response_arr['success'] = 1;
                    response_arr['msg'] = 'Your Free Trial Subscription is Done .';
                    result(null, response_arr);
                });
            }
            
        }else{
            query_text = `SELECT * FROM subscription_plan WHERE id = '${subscription_plan_id}' `;
            console.log(query_text);
            var q = sql.query(query_text, function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                
                if (res.length > 0) {
                    var amount = res[0].amount;
                    var end_date = moment(start_date).add(res[0].duration, 'd').format('YYYY-MM-DD HH:mm');
                    var subscription_update = {
                        'mosque_id': mosque_id,
                        'type': type,
                        'subscription_plan_id': subscription_plan_id,
                        'amount': amount,
                        'start_date': start_date,
                        'end_date': end_date,
                    };
                    // await helper.sql_query(sql, `UPDATE subscription SET ? WHERE mosque_id = '${mosque_id}' `, [subscription_update]).catch(console.log);
                    var query_text = `UPDATE subscription set ? WHERE mosque_id = '${mosque_id}' `;
                    sql.query(query_text, subscription_update, function (err, res) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }

                        response_arr['success'] = 1;
                        response_arr['msg'] = 'Your Paid Subscription is Done .';
                        result(null, response_arr);
                    });
                    
                } else {
                    response_arr['msg'] = "Something wrong";
                    result(null, response_arr);
                }
            });
        }

};

Model.notification_On_OffModel = function notification_On_OffModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var user_id = (param.user_id) ? param.user_id : '';
    var prayer_time_reminder = (param.prayer_time_reminder) ? param.prayer_time_reminder : '';
    var mosque_updates_notifications = (param.mosque_updates_notifications) ? param.mosque_updates_notifications : '';
    
            var notification = {
                'prayer_time_reminder': prayer_time_reminder,
                'mosque_updates_notifications': mosque_updates_notifications
            }
            var query_text = `UPDATE notification_setting SET ? WHERE user_id= ?;
            SELECT users.*,CASE WHEN users.cover_photo!='' THEN CONCAT('${fullUrl}/uploadsCoverPhoto/',users.cover_photo) ELSE '' END AS cover_photo,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,notification_setting.prayer_time_reminder,notification_setting.mosque_updates_notifications FROM users , notification_setting WHERE notification_setting.user_id = users.id and users.soft_delete='0' and users.status='0' and users.id='${user_id}' `;
            sql.query(query_text, [notification, user_id, user_id], function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                if (res[0].affectedRows > 0) {
                    var response = [{
                        "id": res[1][0].id,
                        "user_role": res[1][0].user_role,
                        "user_type":res[1][0].user_type,
                        "name":res[1][0].mosque_name,
                        "first_name": res[1][0].first_name,
                        "last_name": res[1][0].last_name,
                        "email": res[1][0].email,
                        "country_code": res[1][0].country_code,
                        "mobile_no": res[1][0].mobile_no,
                        "address": res[1][0].address,
                        "longitude": res[1][0].longitude,
                        "latitude": res[1][0].latitude,
                        "status": res[1][0].status,
                        "Password": res[1][0].m_password,
                        "cover_photo": res[1][0].cover_photo,
                        "profile_photo": res[1][0].profile_photo,
                        "prayer_time_reminder": res[1][0].prayer_time_reminder,
                        "mosque_updates_notifications": res[1][0].mosque_updates_notifications,
                    }];
                    response_arr['success'] = 1;
                    response_arr['msg'] = "Notification Setting change successfully.";
                    response_arr['data'] = response;
                    result(null, response_arr);
                }
                else {
                    response_arr['msg'] = "Notification Setting Cant change";
                    result(null, response_arr);
                }
            });
};

// -------------------- Mosque & College API ---------------------------//
Model.descriptionAddModel = async function descriptionAddModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    // var param = req.body;
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var title = (param.title) ? param.title : '';
    var description = (param.description) ? param.description : '';
    
        if(!mosque_id)
        {
            response_arr['msg'] = "Mosque id is Required";
            result(null, response_arr);
        }
        if(!title)
        {
            response_arr['msg'] = "Title is Required";
            result(null, response_arr);
        }else{
            var insertData = {
                mosque_id:mosque_id,
                title:title,
                description:description,
                created_at:today,
            };

            var query_text = `INSERT INTO mosque_description SET ?;`;
            sql.query(query_text, [insertData], function (err, data) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                
                if(data.affectedRows > 0)
                {
                    var getData = `SELECT mosque_description.id, users.id as user_id,users.mosque_name,users.first_name,users.last_name,mosque_description.title,mosque_description.description,mosque_description.hide_status,DATE_FORMAT(mosque_description.updated_at,'%d-%m-%Y %H:%i') AS updated_at FROM mosque_description, users WHERE  mosque_description.id='${data.insertId}' AND mosque_description.hide_status='0' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_description.mosque_id  `;
                    sql.query(getData, function (err, getdata) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }
                        var response = [];
                        async.forEachOf(getdata, async (DescriptionList, key, callback) => {
                            
                            var DescriptionData = {
                                "sticky_note_id": DescriptionList.id,
                                "mosque_id": DescriptionList.user_id,
                                "mosque_name": DescriptionList.mosque_name,
                                "first_name": DescriptionList.first_name,
                                "last_name": DescriptionList.last_name,
                                "title": DescriptionList.title,
                                "description": DescriptionList.description,
                                "hide_status": DescriptionList.hide_status,
                                "updated_at": DescriptionList.updated_at,
                            };
                            response.push(DescriptionData);
                        }, err => {
                                if (err) console.error(err.message);
                            
                            response_arr['success'] = 1;
                            response_arr['msg'] = "Add mosque Description Data Successfully!";
                            response_arr['data'] = response;
                            result(null, response_arr);
                        });
                    });
                }else {
                    response_arr['msg'] = "Description Data can't add.";
                    result(null, response_arr);
                }

            });
        }
};

Model.getMosqueDescriptionModel = function getMosqueDescriptionModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var user_id = (param.user_id) ? param.user_id : '';
    
    var next_id = (param.next_id) ? param.next_id : 0;
	var last_id = parseInt(next_id) + 20;

    var next_arr = [];

    var filter = ``;
    if(user_id != '')
    {
        filter = `AND mosque_description.hide_status=0` ;
    }
        var getData = `SELECT mosque_description.id as sticky_note_id, users.id as mosque_id,users.mosque_name,users.first_name,users.last_name,mosque_description.title,mosque_description.description,mosque_description.hide_status,DATE_FORMAT(mosque_description.updated_at,'%d-%m-%Y %H:%i') AS updated_at FROM mosque_description LEFT JOIN users ON users.id=mosque_description.mosque_id AND users.soft_delete = '0' AND users.status = '0' WHERE mosque_description.mosque_id='${mosque_id}' ${filter} order by mosque_description.id DESC LIMIT 20 OFFSET ${parseInt(next_id)} `;
        sql.query(getData, function (err, data) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            if(data.length > 0)
            {
                query_text2 = `SELECT mosque_description.id as sticky_note_id, users.id as mosque_id,users.mosque_name,users.first_name,users.last_name,mosque_description.title,mosque_description.description,mosque_description.hide_status,DATE_FORMAT(mosque_description.updated_at,'%d-%m-%Y %H:%i') AS updated_at FROM mosque_description LEFT JOIN users ON users.id=mosque_description.mosque_id AND users.soft_delete = '0' AND users.status = '0' WHERE mosque_description.mosque_id='${mosque_id}' '${filter}' order by mosque_description.id DESC `;
                sql.query(query_text2, function(err, res) {
                    if(err) {
                        console.log("error: ", err);
                        result(err, null);
                    }

                    var total = res.length;
                    if(last_id > total) {
                        last_id = total;
                    }

                    var nextInfo = {
                        'total': total,
                        'next_id': last_id
                    }
                    next_arr.push(nextInfo);

                    response_arr['success'] = 1;
                    if(filter)
                    {
                        response_arr['msg'] = "User Get Mosque Description successfully.";
                    }else
                    {
                        response_arr['msg'] = "Mosque Get Description successfully.";
                    }
                    response_arr['data'] = data;
                    response_arr['next']    = nextInfo;
                    result(null, response_arr);
                });
                
            }else {
                response_arr['msg'] = "Can't get Description";
                result(null, response_arr);
            }

        });
};

Model.updateMosqueDescriptionModel = async function updateMosqueDescriptionModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var update_type = (param.update_type) ? param.update_type : 0;     // 1 for update data & 0 for update status
    var mosque_dec_id = (param.mosque_dec_id) ? param.mosque_dec_id : '';
    var mosque_title = (param.mosque_title) ? param.mosque_title : '';
    var mosque_description = (param.mosque_description) ? param.mosque_description : '';
    
    var getData = await helper.sql_query(sql, `SELECT id,hide_status FROM mosque_description WHERE mosque_id = '${mosque_id}' AND id='${mosque_dec_id}' `).catch(console.log);
    if(getData.length > 0)
    {
        if(update_type == 2)
        {
            var DeleteData = await helper.sql_query(sql, `DELETE FROM mosque_description WHERE mosque_id = '${mosque_id}' AND id='${mosque_dec_id}' `).catch(console.log);
            if(DeleteData)
            {
                response_arr['success'] = 1;
                response_arr['msg'] = "Mosque Description deleted successfully.";
                result(null, response_arr);
            }
        }else
        {
            if(update_type == 1)
            {
                var update_description = {
                    'title': mosque_title,
                    'description': mosque_description,
                }
                var query_text = `UPDATE mosque_description SET ? WHERE mosque_id='${mosque_id}' AND id='${mosque_dec_id}' `;
            }else{
                
                if(getData[0].hide_status == 1)
                {
                    var statusVal = 0;
                }else if(getData[0].hide_status == 0)
                {
                    var statusVal = 1;
                }
                var update_description = {
                    'hide_status': statusVal,
                }
                var query_text = `UPDATE mosque_description SET ? WHERE mosque_id='${mosque_id}' AND id='${mosque_dec_id}' `;
            }
            sql.query(query_text, [update_description], function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                if (res.affectedRows > 0) {
                    var getData = `SELECT mosque_description.id as sticky_note_id, users.id as mosque_id,users.mosque_name,users.first_name,users.last_name,mosque_description.title,mosque_description.description,mosque_description.hide_status,DATE_FORMAT(mosque_description.updated_at,'%d-%m-%Y %H:%i') AS updated_at FROM mosque_description LEFT JOIN users ON users.id=mosque_description.mosque_id AND users.soft_delete = '0' AND users.status = '0' WHERE mosque_description.mosque_id='${mosque_id}' AND mosque_description.id='${mosque_dec_id}' `;
                    sql.query(getData, function (err, data) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }
                        
                        response_arr['success'] = 1;
                        response_arr['msg'] = "Update Description successfully.";
                        response_arr['data'] = data;
                        result(null, response_arr);
                    });
                }
                else {
                    response_arr['msg'] = "Can't update Description";
                    result(null, response_arr);
                }
            });
        }
    }else{
        response_arr['msg'] = "Description data not found.";
        result(null, response_arr);
    }
};

Model.addPrayerModel123 = async function addPrayerModel123(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var prayer_type = (param.prayer_type) ? param.prayer_type : '';
    var prayer_date = (param.prayer_date) ? param.prayer_date : '';
    var prayer_time = (param.prayer_time) ? param.prayer_time : '';
    var jamat_time = (param.jamat_time) ? param.jamat_time : '';
        if(!mosque_id)
        {
            response_arr['msg'] = "Mosque_id is Required";
            result(null, response_arr);
        }
        if(!prayer_type)
        {
            response_arr['msg'] = "Prayer_type is Required";
            result(null, response_arr);
        }
        if(!prayer_date)
        {
            response_arr['msg'] = "prayer_date is Required";
            result(null, response_arr);
        }
        if(!prayer_time)
        {
            response_arr['msg'] = "prayer_time is Required";
            result(null, response_arr);
        }
        if(!jamat_time)
        {
            response_arr['msg'] = "jamat_time is Required";
            result(null, response_arr);
        }

        var insertData = {
            mosque_id:mosque_id,
            prayer_type:prayer_type,
            date:prayer_date,
            prayer_time:prayer_time,
            jamat_time:jamat_time,
            created_at:today,
        };
        var getData = await helper.sql_query(sql, `SELECT id FROM mosque_prayer_time WHERE date = '${prayer_date}' AND mosque_id = '${mosque_id}' AND prayer_type='${prayer_type}' `).catch(console.log);

        if(getData !='' )
        {
            response_arr['msg'] = "This data already added, you can update this data!";
            result(null, response_arr);
        }else{
        var query_text = `INSERT INTO mosque_prayer_time SET ?;`;
        sql.query(query_text, [insertData], function (err, data) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            if(data.affectedRows > 0)
            {
                var getData = `SELECT users.id,users.mosque_name,users.first_name,users.last_name,DATE_FORMAT(mosque_prayer_time.date,'%d-%m-%Y') AS date,mosque_prayer_time.prayer_type,mosque_prayer_time.prayer_time, mosque_prayer_time.jamat_time FROM mosque_prayer_time,users WHERE users.id='${mosque_id}' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_prayer_time.mosque_id AND mosque_prayer_time.id = '${data.insertId}' `;
                sql.query(getData, function (err, data) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }

                    response_arr['success'] = 1;
                    response_arr['msg'] = "Add Prayer Data Successfully!";
                    response_arr['data'] = data;
                    result(null, response_arr);
                });
            }else {
                response_arr['msg'] = "prayer Data can't add.";
                result(null, response_arr);
            }

        });
    }
};

Model.addPrayerModel = async function addPrayerModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var prayer_details = (param.prayer_details) ? param.prayer_details : '';
    var prayer_date = (param.prayer_date) ? param.prayer_date : '';

    var get_prayer_data = JSON.parse(prayer_details);
    // var get_prayer_data = prayer_details;

    // var prayer_time = (param.prayer_time) ? param.prayer_time : '';
    // var jamat_time = (param.jamat_time) ? param.jamat_time : '';
        if(!mosque_id)
        {
            response_arr['msg'] = "Mosque_id is Required";
            result(null, response_arr);
        }
        // console.log('Add Prayer',param);
        // console.log(`Add Task : ${JSON.stringify(param)}`);
        // console.log("prayer_PARAM: "+get_prayer_data);
        var prayer_values = [];
        
        for(var i=0; i < get_prayer_data.length; i++)
        {
            console.log('get_prayer_data[i].prayer_type',get_prayer_data[i]);
            var getData = await helper.sql_query(sql, `SELECT id,prayer_type FROM mosque_prayer_time WHERE prayer_type = '${get_prayer_data[i].prayer_type}' and mosque_id = '${mosque_id}' AND date(date) = '${prayer_date}'  `).catch(console.log);
            // console.log('get Data',getData[0]);
            if(getData[0] != undefined && getData[0] !='')
            {
                if( getData[0].prayer_type != get_prayer_data[i].prayer_type){
                    get_prayer_data[i].mosque_id = mosque_id;
                    get_prayer_data[i].prayer_date = prayer_date;
                    get_prayer_data[i].today = today;
                    prayer_values.push([get_prayer_data[i].mosque_id,get_prayer_data[i].prayer_name,get_prayer_data[i].prayer_type,get_prayer_data[i].prayer_date,get_prayer_data[i].prayer_time,get_prayer_data[i].jamat_time,get_prayer_data[i].today] );
                }else{
                    console.log('getData',getData[0].id);
                }
            }else{
                get_prayer_data[i].mosque_id = mosque_id;
                    get_prayer_data[i].prayer_date = prayer_date;
                    get_prayer_data[i].today = today;
                    prayer_values.push([get_prayer_data[i].mosque_id,get_prayer_data[i].prayer_name,get_prayer_data[i].prayer_type,get_prayer_data[i].prayer_date,get_prayer_data[i].prayer_time,get_prayer_data[i].jamat_time,get_prayer_data[i].today] );
            }
        }
        // console.log('prayer_values',prayer_values);
        if(prayer_values != '')
        {
            var q = sql.query('INSERT INTO mosque_prayer_time(mosque_id ,prayer_name, prayer_type, date, prayer_time, jamat_time, created_at ) VALUES ?', [prayer_values],async function(err,resPrayerData) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }      
                if (resPrayerData.affectedRows > 0) {
                    var getUser = await helper.sql_query(sql, `SELECT id as mosque_id,user_role,mosque_name,first_name,last_name FROM users WHERE id = '${mosque_id}' `).catch(console.log);
                    
                    var query_text = `SELECT id,prayer_name,prayer_type,prayer_time,jamat_time,status,created_at FROM mosque_prayer_time WHERE mosque_id = '${mosque_id}' AND date(date)='${prayer_date}' order by prayer_type ASC `;
                    sql.query(query_text, function(err, res3) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }
                        if(res3.length > 0)
                        {
                            var userdata = {
                                "mosque_id":parseInt(getUser[0].mosque_id),
                                "user_role":getUser[0].user_role,
                                "mosque_name":getUser[0].mosque_name,
                                "first_name":getUser[0].first_name,
                                "last_name":getUser[0].last_name,
                                "payer_date":prayer_date,
                                "prayers":res3,
                            };
                            response_arr['success'] = 1;
                            response_arr['msg'] = "Add Prayer Data Successfully!";
                            response_arr['data'] = userdata;
                            result(null, response_arr);
                        }
                    });
                }
            });
        }else{
            var getUser = await helper.sql_query(sql, `SELECT id as mosque_id,user_role,mosque_name,first_name,last_name FROM users WHERE id = '${mosque_id}' `).catch(console.log);

            console.log('getUser',getUser);
                var query_text = `SELECT id,prayer_name,prayer_type,prayer_time,jamat_time,status,created_at FROM mosque_prayer_time WHERE mosque_id = '${mosque_id}' AND date(date)='${prayer_date}' order by prayer_type ASC `;
                sql.query(query_text, function(err, res4) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }
                    if(res4.length > 0)
                    {
                        var userdata = {
                            "mosque_id":parseInt(getUser[0].mosque_id),
                            "user_role":getUser[0].user_role,
                            "mosque_name":getUser[0].mosque_name,
                            "first_name":getUser[0].first_name,
                            "last_name":getUser[0].last_name,
                            "payer_date":prayer_date,
                            "prayers":res4,
                        };

                        response_arr['success'] = 1;
                        response_arr['msg'] = "Prayer Data Already store added Successfully!";
                        response_arr['data'] = userdata;
                        result(null, response_arr);
                    }
                });
        }

};

Model.mosqueGetPrayerModel = async function mosqueGetPrayerModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var prayer_date = (param.prayer_date) ? param.prayer_date : '';
    
        if(!mosque_id)
        {
            response_arr['msg'] = "Mosque_id is Required";
            result(null, response_arr);
        }
        if(!prayer_date)
        {
            response_arr['msg'] = "prayer_date is Required";
            result(null, response_arr);
        }

        var getUser = await helper.sql_query(sql, `SELECT id as mosque_id,user_role,mosque_name,first_name,last_name FROM users WHERE id = '${mosque_id}'  `).catch(console.log);
        //AND ( user_role = 2 OR user_role = 3 )
        if(getUser != '')
        {
            var getData = `SELECT mosque_prayer_time.id,mosque_prayer_time.prayer_name,mosque_prayer_time.prayer_type,mosque_prayer_time.prayer_time, mosque_prayer_time.jamat_time, mosque_prayer_time.status, mosque_prayer_time.created_at FROM mosque_prayer_time,users WHERE users.id='${getUser[0].mosque_id}' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_prayer_time.mosque_id AND mosque_prayer_time.date = '${prayer_date}' `;
            sql.query(getData, function (err, data) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }

                var userdata = {
                    "mosque_id":parseInt(getUser[0].mosque_id),
                    "user_role":getUser[0].user_role,
                    "mosque_name":getUser[0].mosque_name,
                    "first_name":getUser[0].first_name,
                    "last_name":getUser[0].last_name,
                    "payer_date":prayer_date,
                    "prayers":data,
                };

                response_arr['success'] = 1;
                response_arr['msg'] = "Prayer Data Get Successfully!";
                response_arr['data'] = userdata;
                result(null, response_arr);
            });
        }else{
            response_arr['msg'] = "Please Check user role";
            result(null, response_arr);
        }
            
};

Model.mosqueUpdatePrayerModel123 = async function mosqueUpdatePrayerModel123(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var prayer_id = (param.prayer_id) ? param.prayer_id : '';
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var prayer_type = (param.prayer_type) ? param.prayer_type : '';
    var prayer_date = (param.prayer_date) ? param.prayer_date : '';
    var prayer_time = (param.prayer_time) ? param.prayer_time : '';
    var jamat_time = (param.jamat_time) ? param.jamat_time : '';
        if(!prayer_id)
        {
            response_arr['msg'] = "Prayer_id is Required";
            result(null, response_arr);
        }
        if(!mosque_id)
        {
            response_arr['msg'] = "Mosque_id is Required";
            result(null, response_arr);
        }
        if(!prayer_type)
        {
            response_arr['msg'] = "Prayer_type is Required";
            result(null, response_arr);
        }
        if(!prayer_date)
        {
            response_arr['msg'] = "Prayer_date is Required";
            result(null, response_arr);
        }
        if(!prayer_time)
        {
            response_arr['msg'] = "Prayer_time is Required";
            result(null, response_arr);
        }
        if(!jamat_time)
        {
            response_arr['msg'] = "Jamat_time is Required";
            result(null, response_arr);
        }

        var updateData = {
            // prayer_type:prayer_type,
            prayer_time:prayer_time,
            jamat_time:jamat_time,
            updated_at:today,
        };
        // var getData = await helper.sql_query(sql, `SELECT id FROM mosque_prayer_time WHERE date = '${prayer_date}' AND mosque_id = '${mosque_id}' AND prayer_type='${prayer_type}' `).catch(console.log);

        // if(getData !='' )
        // {
        //     response_arr['msg'] = "This data already added, you can update this data!";
        //     result(null, response_arr);
        // }else{
        var query_text = `UPDATE mosque_prayer_time SET ? WHERE id= '${prayer_id}' AND mosque_id = '${mosque_id}' AND date = '${prayer_date}' AND prayer_type='${prayer_type}' ;`;
        sql.query(query_text, [updateData], function (err, data) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            if(data.affectedRows > 0)
            {
                var getData = `SELECT users.id,users.mosque_name,users.first_name,users.last_name,DATE_FORMAT(mosque_prayer_time.date,'%d-%m-%Y') AS date,mosque_prayer_time.prayer_type,mosque_prayer_time.prayer_time, mosque_prayer_time.jamat_time FROM mosque_prayer_time,users WHERE users.id='${mosque_id}' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_prayer_time.mosque_id AND mosque_prayer_time.id = '${prayer_id}' `;
                sql.query(getData, function (err, data) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }

                    response_arr['success'] = 1;
                    response_arr['msg'] = "Update Prayer Data Successfully!";
                    response_arr['data'] = data;
                    result(null, response_arr);
                });
            }else {
                response_arr['msg'] = "prayer Data can't Update.";
                result(null, response_arr);
            }

        });
    // }
};

Model.mosqueUpdatePrayerModel = async function mosqueUpdatePrayerModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var prayer_details = (param.prayer_details) ? param.prayer_details : '';
    var prayer_date = (param.prayer_date) ? param.prayer_date : '';

    var get_prayer_data = JSON.parse(prayer_details);
    // var get_prayer_data = prayer_details;
    
        if(!mosque_id)
        {
            response_arr['msg'] = "Mosque_id is Required";
            result(null, response_arr);
        }
        // console.log(`Edit Prayer : ${JSON.stringify(param)}`);
        // console.log("prayer_PARAM: "+get_prayer_data);
        
        for(var i=0; i< get_prayer_data.length; i++)
        {
            if(!get_prayer_data[i].id)
            {
                response_arr['msg'] = "Prayer Id is Required";
                result(null, response_arr);
            }else{
                var PrayerUpdate = `UPDATE mosque_prayer_time SET prayer_name = "${get_prayer_data[i].prayer_name}" , prayer_type = "${get_prayer_data[i].prayer_type}", prayer_time = "${get_prayer_data[i].prayer_time}",jamat_time = "${get_prayer_data[i].jamat_time}" , status = "${get_prayer_data[i].status}", updated_at = "${today}"  WHERE mosque_id = "${mosque_id}" AND id = '${get_prayer_data[i].id}'  `;
                console.log(PrayerUpdate);
                sql.query(PrayerUpdate, function(err, res1) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }
                    if(!res1.affectedRows > 0)
                    {
                        response_arr['msg'] = "Can't Update Prayer, data can not be valid";
                        result(null, response_arr);
                    }
                });
            }
        }
       
        var getUser = await helper.sql_query(sql, `SELECT id as mosque_id,user_role,mosque_name,first_name,last_name FROM users WHERE id = '${mosque_id}' `).catch(console.log);
        
        var query_text = `SELECT id,prayer_name,prayer_type,prayer_time,jamat_time,status,created_at FROM mosque_prayer_time WHERE mosque_id = '${mosque_id}' AND date(date)='${prayer_date}' order by prayer_type ASC `;
        sql.query(query_text, function(err, res3) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            if(res3.length > 0)
            {
                var userdata = {
                    "mosque_id":parseInt(mosque_id),
                    "user_role":getUser[0].user_role,
                    "mosque_name":getUser[0].mosque_name,
                    "first_name":getUser[0].first_name,
                    "last_name":getUser[0].last_name,
                    "payer_date":prayer_date,
                    "prayers":res3,
                };
                response_arr['success'] = 1;
                response_arr['msg'] = "Update Prayers Data Successfully!";
                response_arr['data'] = userdata;
                result(null, response_arr);
            }
        });
};

Model.projectAddModel = async function projectAddModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    // var param = req.body;
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var project_name = (param.project_name) ? param.project_name : '';
    var target = (param.target) ? param.target : '';
    var project_description = (param.project_description) ? param.project_description : '';
        if(!mosque_id)
        {
            response_arr['msg'] = "Mosque_id is Required";
            result(null, response_arr);
        }
        if(!project_name)
        {
            response_arr['msg'] = "Project_name is Required";
            result(null, response_arr);
        }
        if(!project_description)
        {
            response_arr['msg'] = "Project_description is Required";
            result(null, response_arr);
        }

        var insertData = {
            mosque_id:mosque_id,
            project_title:project_name,
            target:target,
            description:project_description,
            created_at:today,
        };
    
        var dir = './public/projects';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        var query_text = `INSERT INTO mosque_projects SET ?;`;
        sql.query(query_text, [insertData], async function (err, data) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            if(data.affectedRows > 0)
            {
                // console.log('files',req.files.project_files);
                // File Upload : Start
                    var pic = (req.files && req.files.project_files) ? req.files.project_files : []

                    if (files_param && typeof pic.length === "undefined") {
                        console.log('single file',pic.name);
                        var fileName = 'project_' + pic.md5 + path.extname(pic.name);
                        var newpath = "./public/projects/" + fileName;
                        pic.mv(newpath, function (err) {
                            post_image_set = {
                                'type': 1,
                                'ref_id': data.insertId,
                                'file': 'project_'+ pic.md5 + path.extname(pic.name),
                            };    
                            var query_text = "INSERT INTO images SET ?";
                            sql.query(query_text, [post_image_set], function(err, resAttachments) {
                                if (err) {
                                    console.log("error: ", err);
                                    result(err, null);
                                }
                            });

                            if (err) { result("Error uploading file.", err); return; }
                        });
                        project_files = fileName;
                    } else {
                        console.log('multiple file');
                        for (let picone of pic) {
                            //console.log('wee',picone);
                            var fileName = 'project_'+ picone.md5 + path.extname(picone.name);
                            var newpath = "./public/projects/" + fileName;
                            picone.mv(newpath, function(err) {
                                if (err) { result("Error uploading file.", err); return; }
                                post_image_set = {
                                    'type': 1,
                                    'ref_id': data.insertId,
                                    'file': 'project_'+ picone.md5 + path.extname(picone.name),
                                    'created_at':today,
                                };    
                                try {
                                    var query_text = "INSERT INTO images SET ?";
                                    sql.query(query_text, [post_image_set], function(err, resAttachments) {
                                        if (err) {
                                            console.log("error: ", err);
                                            result(err, null);
                                        }
                                    });
                                } catch (error) {
                                    console.log('Image Uploding error',error);
                                }
                            });                        
                        }
                    }
                // File Upload : End 

                var getPublicData =  await helper.sql_query(sql, `SELECT user_id FROM user_journey WHERE mosque_id = '${mosque_id}' AND is_default = 1 `).catch(console.log);
                
                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                for(i = 0 ; i < getPublicData.length; i++ )
                {
                    user_id = getPublicData[i].user_id;
                    var getData =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}' `).catch(console.log);
                    var tparam = {
                        'user_ids': [user_id], // Registration Token For multiple users
                    };

                    var loginMosque =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${mosque_id}' `).catch(console.log);
                    var set_body = `" ${loginMosque[0].first_name} ${loginMosque[0].last_name}" Mosque send message : ${title}.`;
                    var notify_params = {
                        'user_id': getData[0].id,
                        'from_id': mosque_id,
                        "project_id": res.insertId,
                        "activity": 'AddProject',
                        'noti_type': 5,
                        'description': set_body,
                        'created_at': today,
                    }
                    console.log('notify_params',notify_params);
                    helper.save_notification(notify_params);    
                
                    // console.log('tparam',getPublicData[i].user_id);
                    helper.get_registration_token(tparam,async function (res) {
                        // console.log("res",res);
                        // if (res.length > 0) {
                            var regTokens = (res.length > 0) ? res.map(res => res.token) : [];
                            // Send Notification Message : Start

                            // var set_body = `${first_name} ${last_name} wants to hire you at ${work_start_date} ${work_timing}.`;
                        
                            var send_param = {
                                'registration_token': regTokens,
                                'title': appName,
                                'body': set_body,
                                'extra_data': {
                                    "activity": 'AddProject',
                                    "mosque_id": mosque_id,
                                    "user_id": getData[0].id,
                                    "project_id": res.insertId,
                                }
                            };
                            // console.log('send_param',getData[0].id);
                            helper.send_notification(send_param, function (send_res) {
                                // Save Notification Message in DB : Start
                                
                            });
                            // Send Notification Message : End      
                        // }
                    });
                }
                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::

                var getData = `SELECT mosque_projects.id, users.id as user_id,users.mosque_name,users.first_name,users.last_name,mosque_projects.project_title,mosque_projects.target,mosque_projects.description,DATE_FORMAT(mosque_projects.created_at,'%d-%m-%Y') AS created_at FROM mosque_projects, users WHERE  mosque_projects.id='${data.insertId}' AND mosque_projects.status='0' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_projects.mosque_id `;
                sql.query(getData,async function (err, getdata) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }
                    
                    
                    
                    // async.forEachOf(getdata, async (ProjectList, key, callback) => {
                        var ProjectList = getdata[0];
                        // console.log('ProjectList',ProjectList.id);
                        try {
                            var projectImages =  await helper.sql_query(sql, `SELECT id,ref_id,CASE WHEN file!='' THEN CONCAT('${fullUrl}/projects/',file) ELSE '' END AS file, status, created_at, updated_at FROM images WHERE type = '1' AND ref_id = '${ProjectList.id}' `).catch(console.log);
                        } catch (error) {
                            console.log('Get Image error',error);
                        }
                        // console.log('getImages',projectImages);/

                        var ProjectData = {
                            "id": ProjectList.id,
                            "mosque_id": ProjectList.user_id,
                            "mosque_name": ProjectList.mosque_name,
                            "first_name": ProjectList.first_name,
                            "last_name": ProjectList.last_name,
                            "project_title": ProjectList.project_title,
                            "target": parseFloat(ProjectList.target).toFixed(2),
                            "description": ProjectList.description,
                            "created_at": ProjectList.created_at,
                            "images": projectImages,
                        };
                        response.push(ProjectData);
                        // console.log('response',response); 
                    // }, err => {
                            // if (err) console.error(err.message);
                
                        response_arr['success'] = 1;
                        response_arr['msg'] = "Add Project Data Successfully!";
                        response_arr['data'] = response;
                        result(null, response_arr);
                    // });
                });

                
            }else {
                response_arr['msg'] = "Projects Data can't add.";
                result(null, response_arr);
            }

        });
};

Model.projectDeleteModel = async function projectDeleteModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    // var param = req.body;
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var project_ids = (param.project_ids) ? param.project_ids : '';
        if(!mosque_id)
        {
            response_arr['msg'] = "Mosque_id is Required";
            result(null, response_arr);
        }
        if(!project_ids)
        {
            response_arr['msg'] = "project_ids is Required";
            result(null, response_arr);
        }
        
        
        var split_project_ids = project_ids.split(',');  
        // console.log('param length',split_journey_ids.length);
        var prdDelete = [];
        for(var i=0;i < split_project_ids.length; i++)
        {
            var projectDelete =  await helper.sql_query(sql, `UPDATE mosque_projects set soft_delete = 1 WHERE id = '${split_project_ids[i]}' `).catch(console.log);
            if(projectDelete.affectedRows){
                prdDelete.push(split_project_ids[i]);
            }
        }
    
        if(prdDelete.length > 0)
        {
            response_arr['success'] = 1;
            response_arr['msg'] = `project Id : ${prdDelete} Deleted Successfully!`;
            // response_arr['data'] = response;
            result(null, response_arr);
        }else{
            response_arr['msg'] = `Some thing wan't wrong for Delete project list .`;
            result(null, response_arr);
        }
};

Model.mosqueProjectListModel = async function mosqueProjectListModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    // var param = req.body;
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var user_id = (param.user_id) ? param.user_id : '';
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';

    var next_id = (param.next_id) ? param.next_id : 0;
	var last_id = parseInt(next_id) + 20;

    var next_arr = [];
    
        if(!mosque_id)
        {
            response_arr['msg'] = "Mosque_id is Required";
            result(null, response_arr);
        }
        if(user_id == 0)
        {
            user_id = '';
        }

        if(user_id)
        {
            var filter = `AND mosque_projects.status='0'`;
        }else{
            var filter = ``;
        }

            var getData = `SELECT mosque_projects.id, users.id as user_id,users.mosque_name,users.first_name,users.last_name,mosque_projects.project_title,mosque_projects.target,mosque_projects.description,mosque_projects.status,mosque_projects.is_donation_receiving,DATE_FORMAT(mosque_projects.created_at,'%d-%m-%Y') AS created_at FROM mosque_projects, users WHERE users.id='${mosque_id}' ${filter} AND mosque_projects.soft_delete = '0' AND users.soft_delete = '0' AND mosque_projects.soft_delete = 0 AND users.status = '0' AND users.id=mosque_projects.mosque_id order by mosque_projects.id DESC LIMIT 20 OFFSET ${parseInt(next_id)};
            SELECT sum(amount) as total_mosque_donation FROM donations WHERE project_id = 0 AND mosque_id ='${mosque_id}';
            SELECT sum(amount) as total_mosque_project_donation FROM donations WHERE project_id != 0 AND mosque_id ='${mosque_id}' `;
            sql.query(getData, function (err, data) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                
                var response = [];
                var responseMsg = [];
                var get_donations = [];
                async.forEachOf(data[0], async (ProjectList, key, callback) => {
                    // console.log('ProjectList',ProjectList.id);
                    var projectImages =  await helper.sql_query(sql, `SELECT id,CASE WHEN file!='' THEN CONCAT('${fullUrl}/projects/',file) ELSE '' END AS file, status, created_at, updated_at FROM images WHERE type = '1' AND ref_id = '${ProjectList.id}'`).catch(console.log);
                    var projectDonation =  await helper.sql_query(sql, `SELECT sum(amount) as total_project_donation FROM donations WHERE project_id = '${ProjectList.id}' AND mosque_id ='${mosque_id}'`).catch(console.log);
                    var publicDonated =  await helper.sql_query(sql, `SELECT count(id) as count_public_donated FROM donations WHERE project_id = '${ProjectList.id}' AND mosque_id ='${mosque_id}' `).catch(console.log);
                    var getDonation  = await helper.sql_query(sql, `SELECT sum(amount) as total_mosque_donation FROM donations WHERE project_id = 0 AND mosque_id ='${mosque_id}';
                    SELECT sum(amount) as total_mosque_project_donation FROM donations WHERE project_id != 0 AND mosque_id ='${mosque_id}' `).catch(console.log);
                    // console.log('getDonation',getDonation);
                    // console.log('getImages',projectImages);
                    if(ProjectList.is_donation_receiving == null)
                    {
                        ProjectList.is_donation_receiving = '';
                    }

                    // if(data[1][0].total_mosque_donation == null)
                    // {
                    //     data[1][0].total_mosque_donation = 0;
                    // }
                    // if(data[2][0].total_mosque_project_donation == null)
                    // {
                    //     data[2][0].total_mosque_project_donation = 0;
                    // }

                    if(projectDonation[0].total_project_donation == null)
                    {
                        projectDonation[0].total_project_donation = 0;
                    }

                    // if(publicDonated[0].publicDonated == null)
                    // {
                    //     publicDonated[0].count_public_donated = 0;
                    // }
                    if(user_id)
                    {
                        var getAutoDonation =  await helper.sql_query(sql, `SELECT count(id) as get_auto_donation FROM donations WHERE project_id = '${ProjectList.id}' AND mosque_id ='${mosque_id}' AND public_id ='${user_id}' AND auto_donation = '1' `).catch(console.log);
                        var check_Donated =  await helper.sql_query(sql, `SELECT * FROM donations WHERE project_id = '${ProjectList.id}' AND mosque_id ='${mosque_id}' AND public_id ='${user_id}' `).catch(console.log);
                        // console.log('check_Donated',(check_Donated.length > 0) ? check_Donated[0]['id'] : '');
                        var ProjectData = {
                            "id": ProjectList.id,
                            "user_id": parseInt(user_id),
                            "mosque_id": ProjectList.user_id,
                            "mosque_name": ProjectList.mosque_name,
                            "first_name": ProjectList.first_name,
                            "last_name": ProjectList.last_name,
                            "project_title": ProjectList.project_title,
                            "target": parseFloat(ProjectList.target).toFixed(2),
                            "description": ProjectList.description,
                            "project_remove_status": ProjectList.status,
                            "donated": (check_Donated.length > 0) ? true : false,
                            "is_donation_receiving": parseInt(ProjectList.is_donation_receiving),
                            "count_public_donated":publicDonated[0].count_public_donated,
                            "auto_donation":(getAutoDonation[0].get_auto_donation > 0)? true : false,
                            "total_project_donation":parseFloat(projectDonation[0].total_project_donation).toFixed(2),
                            "created_at": ProjectList.created_at,
                            "images": projectImages,
                        };
                        var msg = 'Public Get Project List Data Successfully!';
                    }else{
                        var ProjectData = {
                            "id": ProjectList.id,
                            "mosque_id": ProjectList.user_id,
                            "mosque_name": ProjectList.mosque_name,
                            "first_name": ProjectList.first_name,
                            "last_name": ProjectList.last_name,
                            "project_title": ProjectList.project_title,
                            "target": parseFloat(ProjectList.target).toFixed(2),
                            "description": ProjectList.description,
                            "project_remove_status": ProjectList.status,
                            "is_donation_receiving": parseInt(ProjectList.is_donation_receiving),
                            "count_public_donated":publicDonated[0].count_public_donated,
                            "total_project_donation":parseFloat(projectDonation[0].total_project_donation).toFixed(2),
                            "created_at": ProjectList.created_at,
                            "images": projectImages,
                        };
                        var msg = 'Mosque Get Project List Data Successfully!';
                    }

                    response.push(ProjectData);
                    responseMsg.push(msg);
                    // console.log('response',response); 
                }, err => {
                    if (err) console.error(err.message);
                    
                    // if(data[1][0].total_mosque_donation == null)
                    // {
                    //     data[1][0].total_mosque_donation = 0;
                    // }
                    // if(data[2][0].total_mosque_project_donation == null)
                    // {
                    //     data[2][0].total_mosque_project_donation = 0;
                    // }
                    var setData = {
                        // "total_mosque_project_donation": data[2][0].total_mosque_project_donation ,
                        "get_donation": [{
                            'total_mosque_donation':parseFloat(parseFloat(data[1][0].total_mosque_donation) + parseFloat(data[2][0].total_mosque_project_donation)).toFixed(2),
                        },{
                            'total_mosque_donation':parseFloat(data[1][0].total_mosque_donation).toFixed(2),
                            'total_mosque_project_donation':parseFloat(data[2][0].total_mosque_project_donation).toFixed(2) 
                        }],
                        "project_list" :  response,
                    }; 
                // response_arr['success'] = 1;
                // response_arr['msg'] = responseMsg[0];
                // response_arr['data'] = setData;
                // result(null, response_arr);


                var query_text = `SELECT mosque_projects.id, users.id as user_id,users.mosque_name,users.first_name,users.last_name,mosque_projects.project_title,mosque_projects.target,mosque_projects.description,mosque_projects.status,mosque_projects.is_donation_receiving,DATE_FORMAT(mosque_projects.created_at,'%d-%m-%Y') AS created_at FROM mosque_projects, users WHERE users.id='${mosque_id}' ${filter} AND mosque_projects.soft_delete = '0' AND users.soft_delete = '0' AND mosque_projects.soft_delete = 0 AND users.status = '0' AND users.id=mosque_projects.mosque_id order by mosque_projects.id DESC;`;
                // console.log('gd',query_text);
                sql.query(query_text, [], function(err, res) {
                    if(err) {
                        console.log("error: ", err);
                        result(err, null);
                    }

                    var total = res.length;
                    if(last_id > total) {
                        last_id = total;
                    }

                    var nextInfo = {
                        'total': total,
                        'next_id': last_id
                    }
                    // console.log('nextInfo',nextInfo);
                    next_arr.push(nextInfo);

                    response_arr['success'] = 1;
                    response_arr['msg'] = responseMsg[0];
                    response_arr['data'] = setData;
                    response_arr['next']    = nextInfo;
                    result(null, response_arr);
                    
                });
            });
        });
};

Model.mosqueProjectDetailModel = function mosqueProjectDetailModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    // var param = req.body;
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var user_id = (param.user_id) ? param.user_id : '';
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var mosque_project_id = (param.mosque_project_id) ? param.mosque_project_id : '';
    
        if(!mosque_id)
        {
            response_arr['msg'] = "Mosque_id is Required";
            result(null, response_arr);
        }

        if(user_id == 0)
        {
            user_id = '';
        }

        if(user_id)
        {
            var filter = `AND mosque_projects.status='0'`;
        }else{
            var filter = ``;
        }

            var getData = `SELECT mosque_projects.id, users.id as user_id,users.mosque_name,users.first_name,users.last_name,mosque_projects.project_title,mosque_projects.target,mosque_projects.description,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,mosque_projects.status,mosque_projects.is_donation_receiving,DATE_FORMAT(mosque_projects.created_at,'%d-%m-%Y') AS created_at FROM mosque_projects, users WHERE users.id='${mosque_id}' AND mosque_projects.soft_delete = 0 AND mosque_projects.id = '${mosque_project_id}' ${filter} AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_projects.mosque_id ;
            SELECT sum(amount) as total_mosque_project_donation FROM donations WHERE project_id = '${mosque_project_id}'  AND mosque_id ='${mosque_id}'`;
            sql.query(getData, function (err, data) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                    if(data[1][0].total_mosque_project_donation == null)
                    {
                        data[1][0].total_mosque_project_donation = 0;
                    }
                var response = [];
                var response_msg = [];
                async.forEachOf(data[0], async (ProjectList, key, callback) => {
                    // console.log('ProjectList',ProjectList.id);
                    var projectImages =  await helper.sql_query(sql, `SELECT id,CASE WHEN file!='' THEN CONCAT('${fullUrl}/projects/',file) ELSE '' END AS file, status, created_at, updated_at FROM images WHERE type = '1' AND ref_id = '${ProjectList.id}'`).catch(console.log);
                    // console.log('getImages',projectImages);
                    if(ProjectList.is_donation_receiving == null)
                    {
                        ProjectList.is_donation_receiving = '';
                    }
                    if(user_id)
                    {
                        var getAutoDonation =  await helper.sql_query(sql, `SELECT count(id) as get_auto_donation FROM donations WHERE project_id = '${ProjectList.id}' AND mosque_id ='${mosque_id}' AND public_id ='${user_id}' AND auto_donation = '1' `).catch(console.log);
                        var publicDonated =  await helper.sql_query(sql, `SELECT *,amount FROM donations WHERE project_id = '${ProjectList.id}' AND mosque_id ='${mosque_id}' AND public_id ='${user_id}' order by id DESC`).catch(console.log);
                        for(var i = 0 ; i < publicDonated.length; i++)
                        {
                            publicDonated[i].amount = parseFloat(publicDonated[i].amount).toFixed(2);
                        }
                        var ProjectData = {
                            "id": ProjectList.id,
                            "user_id": parseInt(user_id),
                            "mosque_id": ProjectList.user_id,
                            "mosque_name": ProjectList.mosque_name,
                            "first_name": ProjectList.first_name,
                            "last_name": ProjectList.last_name,
                            "mosque_profile": ProjectList.profile_photo,
                            "project_title": ProjectList.project_title,
                            "target": parseFloat(ProjectList.target).toFixed(2),
                            "description": ProjectList.description,
                            "project_remove_status": ProjectList.status,
                            "is_donation_receiving": parseInt(ProjectList.is_donation_receiving),
                            "total_mosque_project_donation": parseFloat(data[1][0].total_mosque_project_donation).toFixed(2),
                            "my_donation":publicDonated,
                            "auto_donation":(getAutoDonation[0].get_auto_donation > 0)?true:false,
                            "created_at": ProjectList.created_at,
                            "images": projectImages,
                        };
                        var msg = 'Public Get Project Data Successfully!';

                    }else{
                        var ProjectData = {
                            "id": ProjectList.id,
                            "mosque_id": ProjectList.user_id,
                            "mosque_name": ProjectList.mosque_name,
                            "first_name": ProjectList.first_name,
                            "last_name": ProjectList.last_name,
                            "mosque_profile": ProjectList.profile_photo,
                            "project_title": ProjectList.project_title,
                            "target": parseFloat(ProjectList.target).toFixed(2),
                            "description": ProjectList.description,
                            "project_remove_status": ProjectList.status,
                            "is_donation_receiving": parseInt(ProjectList.is_donation_receiving),
                            "total_mosque_project_donation": parseFloat(data[1][0].total_mosque_project_donation).toFixed(2),
                            "created_at": ProjectList.created_at,
                            "images": projectImages,
                        };

                        var msg = 'Mosque Get Project Data Successfully!';
                    }
                    response.push(ProjectData);
                    response_msg.push(msg);
                }, err => {
                    if (err) console.error(err.message);
        
                response_arr['success'] = 1;
                response_arr['msg'] = response_msg[0];
                response_arr['data'] = response;
                result(null, response_arr);
            });
        });
};

Model.mosqueProject_Delete_StopDonationModel = async function mosqueProject_Delete_StopDonationModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    // var param = req.body;
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var mosque_project_id = (param.mosque_project_id) ? param.mosque_project_id : '';
    var status_type = (param.status_type) ? param.status_type : '';
    var status = (param.status) ? param.status : '';
        // if project status type 1 then perform project status
        if(!status)
        {
            response_arr['msg'] = "status Data is required.";
            result(null, response_arr);
        }
        if(status_type == '1' && status_type != '')
        {
            // var changeStatus = `UPDATE mosque_projects set status = "${project_status}",updated_at = "${today}" WHERE id='${mosque_project_id}' `;
            var changeStatus =  await helper.sql_query(sql, `UPDATE mosque_projects set status = "${status}",updated_at = "${today}" WHERE id='${mosque_project_id}' `).catch(console.log);
        }else if(status_type == '2' && status_type != ''){
            var changeStatus = await helper.sql_query(sql, `UPDATE mosque_projects set is_donation_receiving = "${status}",updated_at = "${today}" WHERE id='${mosque_project_id}' `).catch(console.log);
        }else{
            response_arr['msg'] = "status type Data is required.";
            result(null, response_arr);
        }

            var getData = `SELECT mosque_projects.id, users.id as user_id,users.mosque_name,users.first_name,users.last_name,mosque_projects.project_title,mosque_projects.target,mosque_projects.description,mosque_projects.status,mosque_projects.is_donation_receiving,DATE_FORMAT(mosque_projects.created_at,'%d-%m-%Y') AS created_at FROM mosque_projects, users WHERE mosque_projects.id = '${mosque_project_id}' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_projects.mosque_id `;
            sql.query(getData, function (err, data) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                // console.log('data',data);
                var response = [];
                async.forEachOf(data, async (ProjectList, key, callback) => {
                    // console.log('ProjectList',ProjectList.id);
                    var projectImages =  await helper.sql_query(sql, `SELECT *,CASE WHEN file!='' THEN CONCAT('${fullUrl}/projects/',file) ELSE '' END AS file FROM images WHERE type = '1' AND ref_id = '${ProjectList.id}'`).catch(console.log);
                    // console.log('getImages',projectImages);
                    if(ProjectList.is_donation_receiving == null)
                    {
                        ProjectList.is_donation_receiving = '';
                    }
                    var ProjectData = {
                        "id": ProjectList.id,
                        "mosque_id": ProjectList.user_id,
                        "mosque_name": ProjectList.mosque_name,
                        "first_name": ProjectList.first_name,
                        "last_name": ProjectList.last_name,
                        "project_title": ProjectList.project_title,
                        "target": parseFloat(ProjectList.target).toFixed(2),
                        "description": ProjectList.description,
                        "project_remove_status": ProjectList.status,
                        "is_donation_receiving": parseInt(ProjectList.is_donation_receiving),
                        "created_at": ProjectList.created_at,
                        "images": projectImages,
                    };
                    response.push(ProjectData);
                    // console.log('response',response); 
                }, err => {
                    if (err) console.error(err.message);
                    // console.log('response',response);
                response_arr['success'] = 1;
                response_arr['msg'] = "Change Project Status Successfully!";
                response_arr['data'] = response;
                result(null, response_arr);
            });
        });
};

Model.countDonationModel = function countDonationModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var response_arr = [];

    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    console.log(`Count Donation : ${JSON.stringify(param)}`);
        
        query_text = ` SELECT sum(amount) as total_mosque_donation FROM donations WHERE project_id = 0 AND mosque_id = '${mosque_id}';SELECT sum(amount) as total_mosque_project_donation FROM donations WHERE project_id != 0 AND mosque_id = '${mosque_id}' `;
        var q = sql.query(query_text, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            if(res[0][0].total_mosque_donation == null)
            {
                res[0][0].total_mosque_donation = 0;
            }

            if(res[1][0].total_mosque_project_donation == null)
            {
                res[1][0].total_mosque_project_donation = 0;
            }
            // var a =parseFloat(res[0][0].total_mosque_donation).toFixed(2);
            // var x = 2.00;
            //     x = Number(x.toFixed(2));
            // console.log(Number(x));

            var response ={
                "mosque_id":parseInt(mosque_id),
                "mosque_donation":parseFloat(res[0][0].total_mosque_donation).toFixed(2),
                "mosque_project_donation":parseFloat(res[1][0].total_mosque_project_donation).toFixed(2),
            };

            response_arr['success'] = 1;
            response_arr['msg'] = 'Count Donation Data successfully.';
            response_arr['data'] = response;
            result(null, response_arr);

        });
       
};

Model.donationHistoryModel = async function donationHistoryModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    // var param = req.body;
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var setResponse = [];
    var getResponse = [];
    var ProjectData = [];
    
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var donation_type = (param.donation_type) ? param.donation_type : '';

    var next_id = (param.next_id) ? param.next_id : 0;
	var last_id = parseInt(next_id) + 5;

    var next_arr = [];
    
    if(donation_type == '1')
    {
        var filter = `AND project_id='0'`;
    }else if(donation_type == '2')
    {
        var filter = `AND project_id!='0'`;
    }else if(donation_type == '3')
    {
        var filter = `AND auto_donation='1'`;
    }else{
        var filter = ``;
    }
        var date_history =  await helper.sql_query(sql, `SELECT DATE_FORMAT(donations.created_at,'%Y-%m-%d') AS created_at FROM donations WHERE mosque_id = '${mosque_id}' ${filter} group by date(created_at)  order by date(created_at) DESC LIMIT 5 OFFSET ${parseInt(next_id)} ` ).catch(console.log);
        async.forEachOf(date_history, (history_date, key, callback) => {
            var response = [];
            var getData = `SELECT donations.id as donation_id, users.id as public_id, users.first_name, users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,mosque.mosque_name,mosque.first_name as mosque_first_name,mosque.last_name as mosque_last_name, mosque_projects.id as project_id, mosque_projects.project_title, mosque_projects.target, mosque_projects.description, donations.amount, donations.auto_donation, DATE_FORMAT(donations.created_at,'%d-%m-%Y') AS created_at FROM donations LEFT JOIN mosque_projects ON mosque_projects.id = donations.project_id  LEFT JOIN users ON users.id = donations.public_id LEFT JOIN users as mosque ON mosque.id = donations.mosque_id WHERE donations.mosque_id='${mosque_id}' AND date(donations.created_at) = '${history_date.created_at}' ${filter}  `; 
            // console.log('getData',getData);
            sql.query(getData, function (err, data) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                // console.log('data',data);
                async.forEachOf(data,async (donationData, key, callback1) => {
                    // console.log('ProjectList',donationData);
                    
                    if(donationData.project_id == null)
                    {
                        donationData.project_id = 0;
                    }
                    if(donationData.project_title == null)
                    {
                        donationData.project_title = '';
                    }
                    if(donationData.target == null)
                    {
                        var target = 0;
                    }else{
                        var target = parseInt(donationData.target);
                    }
                    if(donationData.description == null)
                    {
                        donationData.description = '';
                    }
                    
                    var ProjectData1 = {
                        "donation_id": donationData.donation_id,
                        "public_id": donationData.public_id,
                        "first_name": donationData.first_name,
                        "last_name": donationData.last_name,
                        "user_profile_image": donationData.profile_photo,
                        "mosque_name": donationData.mosque_name,
                        "mosque_first_name": donationData.mosque_first_name,
                        "mosque_last_name": donationData.mosque_last_name,
                        "donation_type": (donationData.project_id && donationData.project_id > 0 )? 'Project Donation' :'Mosque Donation',  
                        "project_id": donationData.project_id,
                        "project_title": donationData.project_title,
                        "target": parseFloat(target).toFixed(2) ,
                        "description": donationData.description,
                        "amount": parseFloat(donationData.amount).toFixed(2),
                        "auto_donation": donationData.auto_donation,
                        "created_at": donationData.created_at,
                    };
                    response.push(ProjectData1);
                    // callback1();
                });
                getResponse.push({
                    'date':history_date.created_at,
                    'donation': response,
                });
                callback();
                // console.log('ds',getResponse);
            });

        }, err => {
            if (err) console.error(err.message);

            var query_text = `SELECT DATE_FORMAT(donations.created_at,'%Y-%m-%d') AS created_at FROM donations WHERE mosque_id = '${mosque_id}' ${filter} group by date(created_at)  order by date(created_at) DESC ;`;
            sql.query(query_text, [], function(err, res) {
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }

                var total = res.length;
                if(last_id > total) {
                    last_id = total;
                }

                var nextInfo = {
                    'total': total,
                    'next_id': last_id
                }
                next_arr.push(nextInfo);

                response_arr['success'] = 1;
                response_arr['msg'] = "Get Donation History Data Successfully!";
                response_arr['data'] = getResponse;
                response_arr['next']    = nextInfo;
                result(null, response_arr);
            });
            
        });
};

Model.productAddModel = async function productAddModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    // var param = req.body;
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var product_name = (param.product_name) ? param.product_name : '';
    var product_description = (param.product_description) ? param.product_description : '';
    var delivery_detail = (param.delivery_detail) ? param.delivery_detail : '';
    var product_price = (param.product_price) ? param.product_price : '';
    var allow_pick_and_collect = (param.allow_pick) ? param.allow_pick : '0';
    var address1 = (param.address1) ? param.address1 : '';
    var address2 = (param.address2) ? param.address2 : '';
    var post_code = (param.post_code) ? param.post_code : '';

        if(!mosque_id)
        {
            response_arr['msg'] = "Mosque id is Required";
            result(null, response_arr);
        }
        if(!product_name)
        {
            response_arr['msg'] = "Product name is Required";
            result(null, response_arr);
        }
        if(!product_description)
        {
            response_arr['msg'] = "Product description is Required";
            result(null, response_arr);
        }

        if(allow_pick_and_collect == '1')
        {
            //-------------------------if allow pick is on then use fllowing param --------------------------
            var pick_address = (param.pick_address) ? param.pick_address : '';
            if(!pick_address)
            {
                response_arr['msg'] = "Pick Address is Required";
                result(null, response_arr);
            }
        }else{
            //--------------------------if Allow Pick option is off then use this param--------------------- 
            // var delivery_time = (param.delivery_time) ? param.delivery_time : '';
            // var set_delivery_time = moment(delivery_time,'DD/MM/YYYY').format('YYYY-MM-DD');
            // if(!set_delivery_time)
            // {
            //     response_arr['msg'] = "Delivery Time is Required";
            //     result(null, response_arr);
            // }
            var cost_of_delivery = (param.cost_of_delivery) ? param.cost_of_delivery : '';
            if(!cost_of_delivery)
            {
                response_arr['msg'] = "Cost of Delivery is Required";
                result(null, response_arr);
            }
        }

        if(allow_pick_and_collect == 1)
        {
            var insertData = {
                mosque_id:mosque_id,
                product_name:product_name,
                product_description:product_description,
                product_price:product_price,
                pick_address:pick_address,
                address1:address1,
                address2:address2,
                post_code:post_code,
                allow_pick_and_collect_option:allow_pick_and_collect,
                delivery_detail:delivery_detail,
                created_at:today,
            };
        }else{
            var insertData = {
                mosque_id:mosque_id,
                product_name:product_name,
                product_description:product_description,
                product_price:product_price,
                allow_pick_and_collect_option:allow_pick_and_collect,
                address1:address1,
                address2:address2,
                post_code:post_code,
                delivery_detail:delivery_detail,
                cost_of_delivery:cost_of_delivery,
                created_at:today,
            };
        }
        // delivery_time:set_delivery_time,
        // console.log('insertData',insertData);
    
        var dir = './public/products';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        var query_text = `INSERT INTO mosque_products SET ?;`;
        sql.query(query_text, [insertData], function (err, data) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            if(data.affectedRows > 0)
            {

                // File Upload : Start
                    var pic = (req.files && req.files.product_files) ? req.files.product_files : []

                    if (files_param && typeof pic.length === "undefined") {
                        console.log('single file',pic.name);
                        var fileName = 'product_' + pic.md5 + path.extname(pic.name);
                        var newpath = "./public/products/" + fileName;
                        pic.mv(newpath, function (err) {
                            post_image_set = {
                                'type': 2,
                                'ref_id': data.insertId,
                                'file': 'product_'+ pic.md5 + path.extname(pic.name),
                            };    
                            var query_text = "INSERT INTO images SET ?";
                            sql.query(query_text, [post_image_set], function(err, resAttachments) {
                                if (err) {
                                    console.log("error: ", err);
                                    result(err, null);
                                }
                            });

                            if (err) { result("Error uploading file.", err); return; }
                        });
                        product_files = fileName;
                    } else {
                        console.log('multiple file');
                        for (let picone of pic) {
                            //console.log('wee',picone);
                            var fileName = 'product_'+ picone.md5 + path.extname(picone.name);
                            var newpath = "./public/products/" + fileName;
                            picone.mv(newpath, function(err) {
                                if (err) { result("Error uploading file.", err); return; }
                                post_image_set = {
                                    'type': 2,
                                    'ref_id': data.insertId,
                                    'file': 'product_'+ picone.md5 + path.extname(picone.name),
                                    'created_at':today,
                                };    
                                var query_text = "INSERT INTO images SET ?";
                                sql.query(query_text, [post_image_set], function(err, resAttachments) {
                                    if (err) {
                                        console.log("error: ", err);
                                        result(err, null);
                                    }
                                });
                            });                        
                        }
                    }
                // File Upload : End 
                var getData = `SELECT mosque_products.id, users.id as user_id,users.mosque_name,users.first_name,users.last_name,mosque_products.product_name,mosque_products.product_price,mosque_products.product_description,mosque_products.product_hide_status,mosque_products.pick_address,mosque_products.address1,mosque_products.address2,mosque_products.post_code,mosque_products.allow_pick_and_collect_option,delivery_detail,mosque_products.cost_of_delivery,DATE_FORMAT(mosque_products.created_at,'%d-%m-%Y') AS created_at FROM mosque_products, users WHERE  mosque_products.id='${data.insertId}' AND mosque_products.product_hide_status='0' AND mosque_products.soft_delete = '0' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_products.mosque_id  `;
                sql.query(getData, function (err, getdata) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }
                    
                    var response = [];
                    async.forEachOf(getdata, async (ProductList, key, callback) => {
                        // console.log('ProductList',ProductList.id);
                        var projectImages =  await helper.sql_query(sql, `SELECT *,CASE WHEN file!='' THEN CONCAT('${fullUrl}/products/',file) ELSE '' END AS file FROM images WHERE type = '2' AND ref_id = '${ProductList.id}'`).catch(console.log);
                        // console.log('getImages',projectImages);
                        if(ProductList.delivery_time == null)
                        {
                            ProductList.delivery_time = '';
                        }
                        var ProductData = {
                            "id": ProductList.id,
                            "user_id": ProductList.user_id,
                            "mosque_name": ProductList.mosque_name,
                            "first_name": ProductList.first_name,
                            "last_name": ProductList.last_name,
                            "product_name": ProductList.product_name,
                            "product_price": parseFloat(ProductList.product_price).toFixed(2),
                            "product_description": ProductList.product_description,
                            "product_hide_status": ProductList.product_hide_status,
                            "pick_address": ProductList.pick_address,
                            "address1": ProductList.address1,
                            "address2": ProductList.address2,
                            "post_code": ProductList.post_code,
                            "allow_pick_and_collect_option": ProductList.allow_pick_and_collect_option,
                            "delivery_detail": ProductList.delivery_detail,
                            "cost_of_delivery": parseFloat(ProductList.cost_of_delivery).toFixed(2),
                            "created_at": ProductList.created_at,
                            "images": projectImages,
                        };
                        response.push(ProductData);
                        console.log('response',response); 
                    }, err => {
                            if (err) console.error(err.message);
                
                        response_arr['success'] = 1;
                        response_arr['msg'] = "Add Product Data Successfully!";
                        response_arr['data'] = response;
                        result(null, response_arr);
                    });
                });
            }else {
                response_arr['msg'] = "Product Data can't add.";
                result(null, response_arr);
            }

        });
};

Model.mosqueProductListModel = async function mosqueProductListModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var user_id = (param.user_id) ? param.user_id : '';
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    
    var next_id = (param.next_id) ? param.next_id : 0;
	var last_id = parseInt(next_id) + 20;

    var next_arr = [];

        if(!mosque_id)
        {
            response_arr['msg'] = "Mosque_id is Required";
            result(null, response_arr);
        }
        if(user_id == 0)
        {
            user_id = '';
        }

        if(user_id)
        {
            var filter = `AND mosque_products.product_hide_status='0'`;
        }else{
            var filter = ``;
        }

            var getData = `SELECT mosque_products.id, users.id as user_id,users.mosque_name,users.first_name,users.last_name,mosque_products.product_name,mosque_products.product_price,mosque_products.product_description,mosque_products.product_hide_status,mosque_products.pick_address,mosque_products.address1,mosque_products.address2,mosque_products.post_code,mosque_products.allow_pick_and_collect_option,mosque_products.delivery_detail,mosque_products.cost_of_delivery,DATE_FORMAT(mosque_products.created_at,'%d-%m-%Y') AS created_at FROM mosque_products, users WHERE users.id='${mosque_id}' ${filter} AND mosque_products.soft_delete = '0' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_products.mosque_id order by mosque_products.id DESC LIMIT 20 OFFSET ${parseInt(next_id)};`;
            // console.log('log',getData);
            sql.query(getData,async function (err, data) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                var countCart =  await helper.sql_query(sql, `SELECT count(product_id) as countCart FROM cart LEFT JOIN mosque_products ON mosque_products.id = cart.product_id  WHERE  user_id = '${user_id}' AND mosque_products.product_hide_status='0' AND mosque_products.soft_delete = '0'`).catch(console.log);
                // console.log('log',data);
                var response = [];
                var responseMsg = [];
                async.forEachOf(data, async (ProductList, key, callback) => {
                    // console.log('ProductList',ProductList.id);
                    var projectImages =  await helper.sql_query(sql, `SELECT id,CASE WHEN file!='' THEN CONCAT('${fullUrl}/products/',file) ELSE '' END AS file, status, created_at, updated_at FROM images WHERE type = '2' AND ref_id = '${ProductList.id}'`).catch(console.log);

                    var cartProduct =  await helper.sql_query(sql, `SELECT id,product_id, quantity, updated_at FROM cart WHERE product_id = '${ProductList.id}' AND user_id = '${user_id}' `).catch(console.log);
                    // console.log('cartProduct',cartProduct);
                    

                    // console.log('getImages',projectImages);
                    if(ProductList.delivery_time == null)
                    {
                        ProductList.delivery_time = '';
                    }
                    if(user_id)
                    {
                        var ProjectData = {
                            "id": ProductList.id,
                            "user_id": parseInt(user_id),
                            "mosque_id": ProductList.user_id,
                            "mosque_name": ProductList.mosque_name,
                            "first_name": ProductList.first_name,
                            "last_name": ProductList.last_name,
                            "product_name": ProductList.product_name,
                            "product_price": parseFloat(ProductList.product_price).toFixed(2),
                            "product_description": ProductList.product_description,
                            "product_hide_status": ProductList.product_hide_status,
                            "pick_address": ProductList.pick_address,
                            "address1": ProductList.address1,
                            "address2": ProductList.address2,
                            "post_code": ProductList.post_code,
                            "allow_pick_and_collect_option":ProductList.allow_pick_and_collect_option,
                            "delivery_detail":ProductList.delivery_detail,
                            "cost_of_delivery":parseFloat(ProductList.cost_of_delivery).toFixed(2),
                            "created_at": ProductList.created_at,
                            "is_added_cart": (cartProduct != '') ? true:false,
                            "images": projectImages,
                        };
                        var msg = 'Public Get Product List Data Successfully!';
                    }else{
                        var ProjectData = {
                            "id": ProductList.id,
                            "mosque_id": ProductList.user_id,
                            "mosque_name": ProductList.mosque_name,
                            "first_name": ProductList.first_name,
                            "last_name": ProductList.last_name,
                            "product_name": ProductList.product_name,
                            "product_price": parseFloat(ProductList.product_price).toFixed(2),
                            "product_description": ProductList.product_description,
                            "product_hide_status": ProductList.product_hide_status,
                            "pick_address": ProductList.pick_address,
                            "address1": ProductList.address1,
                            "address2": ProductList.address2,
                            "post_code": ProductList.post_code,
                            "allow_pick_and_collect_option":ProductList.allow_pick_and_collect_option,
                            "delivery_detail":ProductList.delivery_detail,
                            "cost_of_delivery":parseFloat(ProductList.cost_of_delivery).toFixed(2),
                            "created_at": ProductList.created_at,
                            "images": projectImages,
                        };
                        var msg = 'Mosque Get Product List Data Successfully!';
                    }

                    response.push(ProjectData);
                    responseMsg.push(msg);
                    // console.log('response',response); 
                }, err => {
                    if (err) console.error(err.message);
                    // var setData = {
                    //     // "total_mosque_donation": data[1][0].total_mosque_donation ,
                    //     // "total_mosque_project_donation": data[2][0].total_mosque_project_donation ,
                    //     "project_list" :  response,
                    // }; 
                    // "cart_count": parseInt(countCart[0].countCart),
                


                var query_text = `SELECT mosque_products.id, users.id as user_id,users.mosque_name,users.first_name,users.last_name,mosque_products.product_name,mosque_products.product_price,mosque_products.product_description,mosque_products.product_hide_status,mosque_products.pick_address,mosque_products.allow_pick_and_collect_option,mosque_products.cost_of_delivery,DATE_FORMAT(mosque_products.created_at,'%d-%m-%Y') AS created_at FROM mosque_products, users WHERE users.id='${mosque_id}' ${filter} AND mosque_products.soft_delete = '0' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_products.mosque_id order by mosque_products.id DESC`;
                // console.log('gd',query_text);
                sql.query(query_text, [], function(err, res) {
                    if(err) {
                        console.log("error: ", err);
                        result(err, null);
                    }

                    var total = res.length;
                    if(last_id > total) {
                        last_id = total;
                    }

                    var nextInfo = {
                        'total': total,
                        'next_id': last_id
                    }
                    next_arr.push(nextInfo);

                    response_arr['success'] = 1;
                    response_arr['msg'] = responseMsg[0];
                    response_arr['data'] = response;
                    response_arr['cart_counter'] = countCart[0].countCart;
                    response_arr['next']    = nextInfo;
                    result(null, response_arr);
                });
            });
        });
};

Model.mosqueProductDetailModel = function mosqueProductDetailModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    // var param = req.body;
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var user_id = (param.user_id) ? param.user_id : '';
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var mosque_product_id = (param.mosque_product_id) ? param.mosque_product_id : '';
    
        // if(!mosque_id)
        // {
        //     response_arr['msg'] = "Mosque_id is Required";
        //     result(null, response_arr);
        // }

        if(user_id == 0)
        {
            user_id = '';
        }

        if(user_id)
        {
            var filter = `AND mosque_products.product_hide_status='0'`;
        }else{
            var filter = ``;
        }

            var getData = `SELECT mosque_products.id, users.id as user_id,users.mosque_name,users.first_name,users.last_name,mosque_products.product_name,mosque_products.product_price,mosque_products.product_description,mosque_products.product_hide_status,mosque_products.pick_address,mosque_products.address1,mosque_products.address2,mosque_products.post_code,mosque_products.allow_pick_and_collect_option,mosque_products.delivery_detail,mosque_products.cost_of_delivery,DATE_FORMAT(mosque_products.created_at,'%d-%m-%Y') AS created_at FROM mosque_products, users WHERE mosque_products.id = '${mosque_product_id}' ${filter} AND mosque_products.soft_delete='0' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_products.mosque_id ;`;
            sql.query(getData,async function (err, data) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                    // if(data[1][0].total_mosque_project_donation == null)
                    // {
                    //     data[1][0].total_mosque_project_donation = 0;
                    // }
                    var countCart =  await helper.sql_query(sql, `SELECT count(product_id) as countCart FROM cart LEFT JOIN mosque_products ON mosque_products.id = cart.product_id  WHERE  user_id = '${user_id}' AND mosque_products.product_hide_status='0' AND mosque_products.soft_delete = '0'`).catch(console.log);
                var response = [];
                var response_msg = [];
                async.forEachOf(data, async (ProductList, key, callback) => {
                    // console.log('ProductList',ProductList.id);
                    var projectImages =  await helper.sql_query(sql, `SELECT id,CASE WHEN file!='' THEN CONCAT('${fullUrl}/products/',file) ELSE '' END AS file, status, created_at, updated_at FROM images WHERE type = '2' AND ref_id = '${ProductList.id}'`).catch(console.log);
                    // console.log('getImages',projectImages);
                    // if(ProductList.delivery_time == null)
                    // {
                    //     ProductList.delivery_time = '';
                    // }
                    if(user_id)
                    {
                        var cartProduct =  await helper.sql_query(sql, `SELECT id,product_id, quantity, updated_at FROM cart WHERE product_id = '${ProductList.id}' AND user_id = '${user_id}' `).catch(console.log);

                        var ProductData = {
                            "id": ProductList.id,
                            "user_id": ProductList.user_id,
                            "mosque_name": ProductList.mosque_name,
                            "first_name": ProductList.first_name,
                            "last_name": ProductList.last_name,
                            "product_name": ProductList.product_name,
                            "product_price": parseFloat(ProductList.product_price).toFixed(2),
                            "product_description": ProductList.product_description,
                            "product_hide_status": ProductList.product_hide_status,
                            "pick_address": ProductList.pick_address,
                            "address1": ProductList.address1,
                            "address2": ProductList.address2,
                            "post_code": ProductList.post_code,
                            "allow_pick_and_collect_option": ProductList.allow_pick_and_collect_option,
                            "delivery_detail": ProductList.delivery_detail,
                            "cost_of_delivery": parseFloat(ProductList.cost_of_delivery).toFixed(2),
                            "created_at": ProductList.created_at,
                            "is_added_cart": (cartProduct != '') ? true:false,
                            "images": projectImages,
                        };
                        var msg = 'Public Get Product Data Successfully!';
                    }else{
                        var ProductData = {
                            "id": ProductList.id,
                            "user_id": ProductList.user_id,
                            "mosque_name": ProductList.mosque_name,
                            "first_name": ProductList.first_name,
                            "last_name": ProductList.last_name,
                            "product_name": ProductList.product_name,
                            "product_price": parseFloat(ProductList.product_price).toFixed(2),
                            "product_description": ProductList.product_description,
                            "product_hide_status": ProductList.product_hide_status,
                            "pick_address": ProductList.pick_address,
                            "address1": ProductList.address1,
                            "address2": ProductList.address2,
                            "post_code": ProductList.post_code,
                            "allow_pick_and_collect_option": ProductList.allow_pick_and_collect_option,
                            "delivery_detail": ProductList.delivery_detail,
                            "cost_of_delivery": parseFloat(ProductList.cost_of_delivery).toFixed(2),
                            "created_at": ProductList.created_at,
                            "images": projectImages,
                        };
                        var msg = 'Mosque Get Product Data Successfully!';
                    }
                    response.push(ProductData);
                    response_msg.push(msg);
                }, err => {
                    if (err) console.error(err.message);
        
                response_arr['success'] = 1;
                response_arr['msg'] = response_msg[0];
                response_arr['data'] = response;
                response_arr['cart_counter'] = countCart[0].countCart;
                result(null, response_arr);
            });
        });
};

Model.mosqueProductActionModel = async function mosqueProductActionModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    // var param = req.body;
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var mosque_product_id = (param.mosque_product_id) ? param.mosque_product_id : '';
    var action_type = (param.action_type) ? param.action_type : '';
    var action = (param.action) ? param.action : '';
   
        // if(!mosque_id)
        // {
        //     response_arr['msg'] = "Mosque_id is Required";
        //     result(null, response_arr);
        // }

        var product_status = '';

        if(action_type == 1)
        {
            product_status =  await helper.sql_query(sql, `UPDATE mosque_products set product_hide_status = '${action}' WHERE id='${mosque_product_id}' AND mosque_id = '${mosque_id}'`).catch(console.log);

            if(!product_status)
            {
                response_arr['msg'] = "Can't change product status";
                result(null, response_arr);
            }
        }else{
            // if(action == 1)
            // {
                product_delete =  await helper.sql_query(sql, `UPDATE mosque_products set soft_delete = '1' WHERE id='${mosque_product_id}' AND mosque_id = '${mosque_id}' `).catch(console.log);

                if(product_delete)
                {
                    response_arr['success'] = 1;
                    response_arr['msg'] = 'Product Data Deleted Successfully';
                    result(null, response_arr);
                }else{
                    response_arr['msg'] = "Can't delete product .";
                    result(null, response_arr);

                }
            // }
        }

        // if(!product_status)
        // {
        //     response_arr['msg'] = "Can't change product status";
        //     result(null, response_arr);
        // }
            var getData = `SELECT mosque_products.id, users.id as user_id,users.mosque_name,users.first_name,users.last_name,mosque_products.product_name,mosque_products.product_price,mosque_products.product_description,mosque_products.product_hide_status,mosque_products.pick_address,mosque_products.address1,mosque_products.address2,mosque_products.post_code,mosque_products.allow_pick_and_collect_option,mosque_products.delivery_detail,mosque_products.cost_of_delivery,DATE_FORMAT(mosque_products.created_at,'%d-%m-%Y') AS created_at FROM mosque_products, users WHERE users.id='${mosque_id}' AND mosque_products.id = '${mosque_product_id}' AND mosque_products.soft_delete='0' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_products.mosque_id ;`;
            sql.query(getData, function (err, data) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                   
                var response = [];
                var response_msg = [];
                async.forEachOf(data, async (ProductList, key, callback) => {
                    // console.log('ProductList',ProductList.id);
                    var projectImages =  await helper.sql_query(sql, `SELECT id,CASE WHEN file!='' THEN CONCAT('${fullUrl}/products/',file) ELSE '' END AS file, status, created_at, updated_at FROM images WHERE type = '2' AND ref_id = '${ProductList.id}'`).catch(console.log);
                    // console.log('getImages',projectImages);
                    if(ProductList.delivery_time == null)
                    {
                        ProductList.delivery_time = '';
                    }
                    
                    var ProductData = {
                        "id": ProductList.id,
                        "user_id": ProductList.user_id,
                        "mosque_name": ProductList.mosque_name,
                        "first_name": ProductList.first_name,
                        "last_name": ProductList.last_name,
                        "product_name": ProductList.product_name,
                        "product_price": parseFloat(ProductList.product_price).toFixed(2),
                        "product_description": ProductList.product_description,
                        "product_hide_status": ProductList.product_hide_status,
                        "pick_address": ProductList.pick_address,
                        "address1": ProductList.address1,
                        "address2": ProductList.address2,
                        "post_code": ProductList.post_code,
                        "allow_pick_and_collect_option": ProductList.allow_pick_and_collect_option,
                        "delivery_detail": ProductList.delivery_detail,
                        "cost_of_delivery": parseFloat(ProductList.cost_of_delivery).toFixed(2),
                        "created_at": ProductList.created_at,
                        "images": projectImages,
                    };
                    var msg = 'Mosque Get Product Data Successfully!';
                    response.push(ProductData);
                    response_msg.push(msg);
                }, err => {
                    if (err) console.error(err.message);
        
                response_arr['success'] = 1;
                response_arr['msg'] = response_msg[0];
                response_arr['data'] = response;
                result(null, response_arr);
            });
        });
        // result(null, response_arr);
};

Model.productEditModel = async function productEditModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    // var param = req.body;
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var product_id = (param.product_id) ? param.product_id : '';
    var product_name = (param.product_name) ? param.product_name : '';
    var product_description = (param.product_description) ? param.product_description : '';
    var product_price = (param.product_price) ? param.product_price : '';
    var delivery_detail = (param.delivery_detail) ? param.delivery_detail : '';
    var allow_pick_and_collect = (param.allow_pick) ? param.allow_pick : '0';
    var address1 = (param.address1) ? param.address1 : '';
    var address2 = (param.address2) ? param.address2 : '';
    var post_code = (param.post_code) ? param.post_code : '';

        if(!mosque_id)
        {
            response_arr['msg'] = "Mosque id is Required";
            result(null, response_arr);
        }

        if(!product_id)
        {
            response_arr['msg'] = "Product id is Required";
            result(null, response_arr);
        }
        if(!product_name)
        {
            response_arr['msg'] = "Product name is Required";
            result(null, response_arr);
        }
        if(!product_description)
        {
            response_arr['msg'] = "Product description is Required";
            result(null, response_arr);
        }

        if(allow_pick_and_collect == '1')
        {
            //-------------------------if allow pick is on then use fllowing param --------------------------
            var pick_address = (param.pick_address) ? param.pick_address : '';
            if(!pick_address)
            {
                response_arr['msg'] = "Pick Address is Required";
                result(null, response_arr);
            }
        }else{
            //--------------------------if Allow Pick option is off then use this param--------------------- 
            // var delivery_time = (param.delivery_time) ? param.delivery_time : '';
            // var set_delivery_time = moment(delivery_time,'DD/MM/YYYY').format('YYYY-MM-DD');
            var cost_of_delivery = (param.cost_of_delivery) ? param.cost_of_delivery : '';
            // if(!delivery_time)
            // {
            //     response_arr['msg'] = "Delivery Time is Required";
            //     result(null, response_arr);
            // }
            if(!cost_of_delivery)
            {
                response_arr['msg'] = "Cost of Delivery is Required";
                result(null, response_arr);
            }
        }

        if(allow_pick_and_collect == 1)
        {
            var updateData = {
                product_name:product_name,
                product_description:product_description,
                product_price:product_price,
                pick_address:pick_address,
                address1:address1,
                address2:address2,
                post_code:post_code,
                allow_pick_and_collect_option:allow_pick_and_collect,
                delivery_detail:delivery_detail,
                updated_at:today,
            };
        }else{
            var updateData = {
                product_name:product_name,
                product_description:product_description,
                product_price:product_price,
                allow_pick_and_collect_option:allow_pick_and_collect,
                delivery_detail:delivery_detail,
                cost_of_delivery:cost_of_delivery,
                updated_at:today,
            };
        }

    
        var dir = './public/products';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        var query_text = `UPDATE mosque_products SET ? WHERE id='${product_id}' AND mosque_id='${mosque_id}' ;`;
        sql.query(query_text, [updateData],async function (err, data) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            if(data.affectedRows > 0)
            {

                // File Upload : Start
                    var pic = (req.files && req.files.product_files) ? req.files.product_files : []
                    if(pic !=''){
                        // var deleteImages =  await helper.sql_query(sql, `DELETE FROM images WHERE type = '2' AND ref_id = '${product_id}'`).catch(console.log);
                        // console.log('deleteImages',deleteImages);
                        console.log('pic',pic);
                        if (files_param && typeof pic.length === "undefined") {
                            console.log('single file',pic.name);
                            var fileName = 'product_' + pic.md5 + path.extname(pic.name);
                            var newpath = "./public/products/" + fileName;
                            pic.mv(newpath, function (err) {
                                post_image_set = {
                                    'type': 2,
                                    'ref_id': product_id,
                                    'file': 'product_'+ pic.md5 + path.extname(pic.name),
                                    'created_at':today,
                                };    
                                var query_text = "INSERT INTO images SET ?";
                                sql.query(query_text, [post_image_set], function(err, resAttachments) {
                                    if (err) {
                                        console.log("error: ", err);
                                        result(err, null);
                                    }
                                    var getData = `SELECT mosque_products.id, users.id as user_id,users.mosque_name,users.first_name,users.last_name,mosque_products.product_name,mosque_products.product_price,mosque_products.product_description,mosque_products.product_hide_status,mosque_products.pick_address,mosque_products.address1,mosque_products.address2,mosque_products.post_code,mosque_products.allow_pick_and_collect_option,mosque_products.delivery_detail,mosque_products.cost_of_delivery,DATE_FORMAT(mosque_products.created_at,'%d-%m-%Y') AS created_at FROM mosque_products, users WHERE  mosque_products.id='${product_id}' AND mosque_products.product_hide_status='0' AND mosque_products.soft_delete = '0' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_products.mosque_id  `;
                                    // console.log('df',getData);
                                    sql.query(getData, function (err, getdata) {
                                        if (err) {
                                            console.log("error: ", err);
                                            result(err, null);
                                        }
                                        
                                        var response = [];
                                        async.forEachOf(getdata, async (ProductList, key, callback) => {
                                            // console.log('ProductList',ProductList.id);
                                            var projectImages =  await helper.sql_query(sql, `SELECT *,CASE WHEN file!='' THEN CONCAT('${fullUrl}/products/',file) ELSE '' END AS file FROM images WHERE type = '2' AND ref_id = '${ProductList.id}'`).catch(console.log);
                                            console.log('getImages',projectImages);
                                            // if(ProductList.delivery_time == null)
                                            // {
                                            //     ProductList.delivery_time = '';
                                            // }
                                            var ProductData = {
                                                "id": ProductList.id,
                                                "user_id": ProductList.user_id,
                                                "mosque_name": ProductList.mosque_name,
                                                "first_name": ProductList.first_name,
                                                "last_name": ProductList.last_name,
                                                "product_name": ProductList.product_name,
                                                "product_price": parseFloat(ProductList.product_price).toFixed(2),
                                                "product_description": ProductList.product_description,
                                                "product_hide_status": ProductList.product_hide_status,
                                                "pick_address": ProductList.pick_address,
                                                "address1": ProductList.address1,
                                                "address2": ProductList.address2,
                                                "post_code": ProductList.post_code,
                                                "allow_pick_and_collect_option": ProductList.allow_pick_and_collect_option,
                                                "delivery_detail": ProductList.delivery_detail,
                                                "cost_of_delivery": parseFloat(ProductList.cost_of_delivery).toFixed(2),
                                                "created_at": ProductList.created_at,
                                                "images": projectImages,
                                            };
                                            response.push(ProductData);
                                            // console.log('response',response); 
                                        }, err => {
                                                if (err) console.error(err.message);
                                    
                                            response_arr['success'] = 1;
                                            response_arr['msg'] = "Update Product Data Successfully!";
                                            response_arr['data'] = response;
                                            result(null, response_arr);
                                        });
                                    });
                                });
                            });
                            product_files = fileName;
                        } else {
                            console.log('multiple file');
                            for (let picone of pic) {
                                //console.log('wee',picone);
                                // var deleteImages1 =  await helper.sql_query(sql, `DELETE FROM images WHERE type = '2' AND ref_id = '${product_id}'`).catch(console.log);
                                // console.log('deleteImages1',deleteImages1);
                                var fileName = 'product_'+ picone.md5 + path.extname(picone.name);
                                var newpath = "./public/products/" + fileName;
                                picone.mv(newpath, function(err) {
                                    if (err) { result("Error uploading file.", err); return; }
                                    post_image_set = {
                                        'type': 2,
                                        'ref_id': product_id,
                                        'file': 'product_'+ picone.md5 + path.extname(picone.name),
                                        'created_at':today,
                                    };    

                                    var query_text = "INSERT INTO images SET ?";
                                    sql.query(query_text, [post_image_set], function(err, resAttachments) {
                                        if (err) {
                                            console.log("error: ", err);
                                            result(err, null);
                                        }else{
                                            var getData = `SELECT mosque_products.id, users.id as user_id,users.mosque_name,users.first_name,users.last_name,mosque_products.product_name,mosque_products.product_price,mosque_products.product_description,mosque_products.product_hide_status,mosque_products.pick_address,mosque_products.address1,mosque_products.address2,mosque_products.post_code,mosque_products.allow_pick_and_collect_option,mosque_products.delivery_detail,mosque_products.cost_of_delivery,DATE_FORMAT(mosque_products.created_at,'%d-%m-%Y') AS created_at FROM mosque_products, users WHERE  mosque_products.id='${product_id}' AND mosque_products.product_hide_status='0' AND mosque_products.soft_delete = '0' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_products.mosque_id  `;
                                            // console.log('df',getData);
                                            sql.query(getData, function (err, getdata) {
                                                if (err) {
                                                    console.log("error: ", err);
                                                    result(err, null);
                                                }
                                                
                                                var response = [];
                                                async.forEachOf(getdata, async (ProductList, key, callback) => {
                                                    // console.log('ProductList',ProductList.id);
                                                    var projectImages =  await helper.sql_query(sql, `SELECT *,CASE WHEN file!='' THEN CONCAT('${fullUrl}/products/',file) ELSE '' END AS file FROM images WHERE type = '2' AND ref_id = '${ProductList.id}'`).catch(console.log);
                                                    console.log('getImages',projectImages);
                                                    // if(ProductList.delivery_time == null)
                                                    // {
                                                    //     ProductList.delivery_time = '';
                                                    // }
                                                    var ProductData = {
                                                        "id": ProductList.id,
                                                        "user_id": ProductList.user_id,
                                                        "mosque_name": ProductList.mosque_name,
                                                        "first_name": ProductList.first_name,
                                                        "last_name": ProductList.last_name,
                                                        "product_name": ProductList.product_name,
                                                        "product_price": parseFloat(ProductList.product_price).toFixed(2),
                                                        "product_description": ProductList.product_description,
                                                        "product_hide_status": ProductList.product_hide_status,
                                                        "pick_address": ProductList.pick_address,
                                                        "address1": ProductList.address1,
                                                        "address2": ProductList.address2,
                                                        "post_code": ProductList.post_code,
                                                        "allow_pick_and_collect_option": ProductList.allow_pick_and_collect_option,
                                                        "delivery_detail": ProductList.delivery_detail,
                                                        "cost_of_delivery": parseFloat(ProductList.cost_of_delivery).toFixed(2),
                                                        "created_at": ProductList.created_at,
                                                        "images": projectImages,
                                                    };
                                                    response.push(ProductData);
                                                    // console.log('response',response); 
                                                }, err => {
                                                        if (err) console.error(err.message);
                                            
                                                    response_arr['success'] = 1;
                                                    response_arr['msg'] = "Update Product Data Successfully!";
                                                    response_arr['data'] = response;
                                                    result(null, response_arr);
                                                });
                                            });
                                        }

                                    });
                                });                        
                            }
                        }
                    }else{
                        var getData = `SELECT mosque_products.id, users.id as user_id,users.mosque_name,users.first_name,users.last_name,mosque_products.product_name,mosque_products.product_price,mosque_products.product_description,mosque_products.product_hide_status,mosque_products.pick_address,mosque_products.address1,mosque_products.address2,mosque_products.post_code,mosque_products.allow_pick_and_collect_option,mosque_products.delivery_detail,mosque_products.cost_of_delivery,DATE_FORMAT(mosque_products.created_at,'%d-%m-%Y') AS created_at FROM mosque_products, users WHERE  mosque_products.id='${product_id}' AND mosque_products.product_hide_status='0' AND mosque_products.soft_delete = '0' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_products.mosque_id  `;
                        // console.log('df',getData);
                        sql.query(getData, function (err, getdata) {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                            }
                            
                            var response = [];
                            async.forEachOf(getdata, async (ProductList, key, callback) => {
                                // console.log('ProductList',ProductList.id);
                                var projectImages =  await helper.sql_query(sql, `SELECT *,CASE WHEN file!='' THEN CONCAT('${fullUrl}/products/',file) ELSE '' END AS file FROM images WHERE type = '2' AND ref_id = '${ProductList.id}'`).catch(console.log);
                                console.log('getImages',projectImages);
                                var ProductData = {
                                    "id": ProductList.id,
                                    "user_id": ProductList.user_id,
                                    "mosque_name": ProductList.mosque_name,
                                    "first_name": ProductList.first_name,
                                    "last_name": ProductList.last_name,
                                    "product_name": ProductList.product_name,
                                    "product_price": parseFloat(ProductList.product_price).toFixed(2),
                                    "product_description": ProductList.product_description,
                                    "product_hide_status": ProductList.product_hide_status,
                                    "pick_address": ProductList.pick_address,
                                    "address1": ProductList.address1,
                                    "address2": ProductList.address2,
                                    "post_code": ProductList.post_code,
                                    "allow_pick_and_collect_option": ProductList.allow_pick_and_collect_option,
                                    "delivery_detail": ProductList.delivery_detail,
                                    "cost_of_delivery": parseFloat(ProductList.cost_of_delivery).toFixed(2),
                                    "created_at": ProductList.created_at,
                                    "images": projectImages,
                                };
                                response.push(ProductData);
                                // console.log('response',response); 
                            }, err => {
                                    if (err) console.error(err.message);
                        
                                response_arr['success'] = 1;
                                response_arr['msg'] = "Update Product Data Successfully!";
                                response_arr['data'] = response;
                                result(null, response_arr);
                            });
                        });
                    }
                // File Upload : End 
                
            }else {
                response_arr['msg'] = "Product Data can't update.";
                result(null, response_arr);
            }

        });
};

Model.deleteProductImageModel = async function deleteProductImageModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var product_id = (param.product_id) ? param.product_id : '';
    var images_id = (param.images_id) ? param.images_id : '';
    console.log('param',images_id);
    var split_images_ids = images_id.split(',');  
    // console.log('param length',split_journey_ids.length);
    var imagesDelete1 = [];
    for(var i=0;i < split_images_ids.length; i++)
    {
        var imagesDelete =  await helper.sql_query(sql, `DELETE FROM images WHERE id = '${split_images_ids[i]}' AND type = '2' AND ref_id = '${product_id}' `).catch(console.log);
        if(imagesDelete.affectedRows){
            imagesDelete1.push(split_images_ids[i]);
        }
    }

    if(imagesDelete1.length > 0)
    {
        response_arr['success'] = 1;
        response_arr['msg'] = `Product Image Id : ${imagesDelete1} Deleted Successfully!`;
        // response_arr['data'] = response;
        result(null, response_arr);
    }else{
        response_arr['msg'] = `Some thing wan't wrong for Delete Product Image .`;
        result(null, response_arr);
    }
};


Model.mosqueOrderModel = async function mosqueOrderModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];

    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var order_item_status = (param.order_item_status) ? param.order_item_status : '';  // 1 = Received , 2 = Completed
    
    var next_id = (param.next_id) ? param.next_id : 0;
	var last_id = parseInt(next_id) + 20;

    var next_arr = [];
    

    if(order_item_status == 2)
    {
        var chk_status = `final_order_item.product_delivery_status = '2'`;
    }else{
        var chk_status = `final_order_item.product_delivery_status != '2'`;
    }
    console.log('Order : ',param);
    if(!mosque_id)
    {
        response_arr['msg'] = "mosque id is Required";
        result(null, response_arr);
    }
        var orderItem =  await helper.sql_query(sql, `SELECT final_order_item.id as order_item_id,users.user_role,final_order.user_id,users.first_name,users.last_name,final_order.delivery_address,final_order.payment_mode,final_order_item.product_id,mosque_products.product_name,mosque_products.pick_address,mosque_products.allow_pick_and_collect_option,mosque_products.delivery_detail,mosque_products.cost_of_delivery,final_order_item.quantity,final_order_item.price,final_order_item.total_amount,final_order_item.product_delivery_status,final_order_item.created_at 
        FROM final_order_item 
        LEFT JOIN mosque_products ON mosque_products.id = final_order_item.product_id  
        LEFT JOIN final_order ON final_order.id = final_order_item.final_order_id  
        LEFT JOIN users ON final_order.user_id = users.id 
        WHERE final_order_item.mosque_id = '${mosque_id}' AND ${chk_status} order by final_order_item.id DESC LIMIT 20 OFFSET ${parseInt(next_id)} `).catch(console.log);
        for( var i=0; i < orderItem.length; i++)
        {
            orderItem[i].price=parseFloat(orderItem[i].price).toFixed(2);
            orderItem[i].total_amount=parseFloat(orderItem[i].total_amount).toFixed(2);
            orderItem[i].cost_of_delivery = parseFloat(orderItem[i].cost_of_delivery).toFixed(2);
            var projectImages =  await helper.sql_query(sql, `SELECT id,CASE WHEN file!='' THEN CONCAT('${fullUrl}/products/',file) ELSE '' END AS file, status, created_at, updated_at FROM images WHERE type = '2' AND ref_id = '${orderItem[i].product_id}'`).catch(console.log);
            
            orderItem[i].image = projectImages;
        }
        if(orderItem.length > 0)
        {
            var query_text = `SELECT final_order_item.id as order_item_id,final_order_item.product_id,final_order_item.quantity,final_order_item.price,final_order_item.total_amount,final_order_item.product_delivery_status,final_order_item.created_at 
            FROM final_order_item 
            WHERE final_order_item.mosque_id = '${mosque_id}' AND ${chk_status};`;
            sql.query(query_text, [], function(err, res) {
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }

                var total = res.length;
                if(last_id > total) {
                    last_id = total;
                }

                var nextInfo = {
                    'total': total,
                    'next_id': last_id
                }
                // console.log('nextInfo',nextInfo);
                next_arr.push(nextInfo);

                response_arr['success'] = 1;
                response_arr['msg'] = `Get Order Successfully!`;
                response_arr['data'] = orderItem;
                response_arr['next']    = nextInfo;
                result(null, response_arr);
            });
        }else{
            response_arr['msg'] = `Order can't place Successfully!`;
            result(null, response_arr);
        }
        

}

Model.mosqueOrderStatusModel = async function mosqueOrderStatusModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];

    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var order_item_id = (param.order_item_id) ? param.order_item_id : '';  
    var order_item_status = (param.item_status) ? param.item_status : 0;  
    
    // if(order_item_status == 1)
    // {
    //     var chk_status = `final_order_item.product_delivery_status = '2'`;
    // }else{
    //     var chk_status = `final_order_item.product_delivery_status != '2'`;
    // }
    console.log('OrderStatus : ',param);
    
    if(!order_item_id)
    {
        response_arr['msg'] = "order item id is Required";
        result(null, response_arr);
    }else{
        var chk_order_status =  await helper.sql_query(sql, `SELECT * FROM final_order_item WHERE id = '${order_item_id}'  `).catch(console.log);
        if(chk_order_status[0].product_delivery_status != order_item_status )
        {
            var orderItem =  await helper.sql_query(sql, `UPDATE final_order_item SET product_delivery_status = '${order_item_status}' WHERE id = '${order_item_id}'  `).catch(console.log);
            /*for( var i=0; i < orderItem.length; i++)
            {
                orderItem[i].price=parseInt(orderItem[i].price);
                orderItem[i].total_amount=parseInt(orderItem[i].total_amount);
            
                var projectImages =  await helper.sql_query(sql, `SELECT id,CASE WHEN file!='' THEN CONCAT('${fullUrl}/products/',file) ELSE '' END AS file, status, created_at, updated_at FROM images WHERE type = '2' AND ref_id = '${orderItem[i].product_id}'`).catch(console.log);
                
                orderItem[i].image = projectImages;
            }*/
            if(orderItem.affectedRows > 0)
            {
                var get_status =  await helper.sql_query(sql, `SELECT item.*,final_order.user_id FROM final_order_item as item LEFT JOIN final_order ON item.final_order_id = final_order.id WHERE item.id = '${order_item_id}'  `).catch(console.log);
                // console.log('get_status',get_status[0]);
                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                var tparam = {
                    'user_ids': [get_status[0].user_id], // Registration Token For multiple users
                };
                helper.get_registration_token(tparam,async function (res) {
                    // console.log("res",res);
                    // if (res.length > 0) {
                        var regTokens = (res.length > 0) ? res.map(res => res.token) : [];
                        // Send Notification Message : Start
                        if(order_item_status == '1')
                        {
                            var getStatus = 'Shipped';
                        }else{
                            var getStatus = 'Delivered';
                        }
                        // var set_body = `${first_name} ${last_name} wants to hire you at ${work_start_date} ${work_timing}.`;
                        var loginUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${get_status[0].mosque_id}' `).catch(console.log);
                        var set_body = `Dear User @${loginUser[0].first_name} ${loginUser[0].last_name} your order No:${order_item_id} will be '${getStatus}' , you can track your order using our App.`; 
                        var send_param = {
                            'registration_token': regTokens,
                            'title': appName,
                            'body': set_body,
                            'extra_data': {
                                "activity": 'orderStatus',
                                "user_id": get_status[0].user_id,
                                "mosque_id": get_status[0].mosque_id,
                                "order_id": order_item_id,
                            }
                        };
                        // console.log(send_param);
                        helper.send_notification(send_param, function (send_res) {
                            // Save Notification Message in DB : Start
                            var notify_params = {
                                'user_id': get_status[0].user_id,
                                'from_id': get_status[0].mosque_id,
                                // "order_id": order_item_id,
                                'activity': 'orderStatus',
                                'noti_type': 2,
                                'description': set_body,
                                'created_at': today,
                            }
                            helper.save_notification(notify_params);                                    
                        });
                        // Send Notification Message : End      
                    // }
                });
                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                response_arr['success'] = 1;
                response_arr['msg'] = `Status changes Successfully!`;
                // response_arr['data'] = orderItem;
                result(null, response_arr);
            }else{
                response_arr['msg'] = `Status can't change.`;
                result(null, response_arr);
            }
        }else{
            response_arr['success'] = 1;
            response_arr['msg'] = `Already Status changes !`;
            // response_arr['data'] = orderItem;
            result(null, response_arr);
        }
    }

}

Model.addMosqueFeedModel = async function addMosqueFeedModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];

    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var title = (param.title) ? param.title : '';  
    var description = (param.description) ? param.description : '';  
    
    console.log('Add Mosque Feed : ',param);
    if(!mosque_id)
    {
        response_arr['msg'] = "mosque id is Required";
        result(null, response_arr);
    }else{
        save_feed = {
            'mosque_id':mosque_id,
            'title': title,
            'description': description,
            'created_at':today,
        };    
        query_text = `INSERT INTO mosque_pro_feed SET ? `;
        var q = sql.query(query_text,[save_feed],async function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            if(res.insertId > 0)
            {
                var getPublicData =  await helper.sql_query(sql, `SELECT user_id FROM user_journey WHERE mosque_id = '${mosque_id}' AND is_default = 1 `).catch(console.log);
                
                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                for(i = 0 ; i < getPublicData.length; i++ )
                {
                    user_id = getPublicData[i].user_id;
                    var getData =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}' `).catch(console.log);
                    var tparam = {
                        'user_ids': [user_id], // Registration Token For multiple users
                    };

                    var loginMosque =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${mosque_id}' `).catch(console.log);
                    var set_body = `" ${loginMosque[0].first_name} ${loginMosque[0].last_name}" Mosque send message : ${title}.`;
                    var notify_params = {
                        'user_id': getData[0].id,
                        'from_id': mosque_id,
                        "feed_id": res.insertId,
                        "activity": 'feed',
                        'noti_type': 5,
                        'description': set_body,
                        'created_at': today,
                    }
                    console.log('notify_params',notify_params);
                    helper.save_notification(notify_params);    
                
                    // console.log('tparam',getPublicData[i].user_id);
                    helper.get_registration_token(tparam,async function (res) {
                        // console.log("res",res);
                        // if (res.length > 0) {
                            var regTokens = (res.length > 0) ? res.map(res => res.token) : [];
                            // Send Notification Message : Start

                            // var set_body = `${first_name} ${last_name} wants to hire you at ${work_start_date} ${work_timing}.`;
                        
                            var send_param = {
                                'registration_token': regTokens,
                                'title': appName,
                                'body': set_body,
                                'extra_data': {
                                    "activity": 'feed',
                                    "mosque_id": mosque_id,
                                    "user_id": '',
                                    "post_id": res.insertId,
                                }
                            };
                            // console.log('send_param',getData[0].id);
                            helper.send_notification(send_param, function (send_res) {
                                // Save Notification Message in DB : Start
                                
                            });
                            // Send Notification Message : End      
                        // }
                    });
                }
                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                response_arr['success'] = 1;
                response_arr['msg'] = `Send feed Notification Successfully!`;
                // response_arr['data'] = orderItem;
                result(null, response_arr);
            }else{
                response_arr['msg'] = `can't send notification data!`;
                result(null, response_arr);
            }   
        });
    }
}

Model.getPosterModel = async function getPosterModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];

    var poster_type = (param.poster_type) ? param.poster_type : '';
    if(!poster_type)
    {
        response_arr['msg'] = "Poster Type is Required";
        result(null, response_arr);
    }else{
    
        if(poster_type == 1)
        {
            var getFolder = 'horizontal';
        }else if(poster_type == 2)
        {
            var getFolder = 'square';
        }else{
            var getFolder = 'vertical';
        }

        console.log('Get Poster : ',param);
    
        query_text = `SELECT id,type,CASE WHEN poster_name!='' THEN CONCAT('${fullUrl}/poster/${getFolder}/',poster_name) ELSE '' END AS poster_name FROM poster WHERE type = '${poster_type}' order by blank DESC`;
        var q = sql.query(query_text, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            // console.log('res',res);
            if(res.length > 0)
            {            
                response_arr['success'] = 1;
                response_arr['msg'] = `Get poster data Successfully!`;
                response_arr['data'] = res;
                result(null, response_arr);
            }else{
                response_arr['msg'] = `can't get poster data!`;
                result(null, response_arr);
            }
        });
    }   
}

Model.getThemesModel = async function getThemesModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];

    var theme_type = (param.theme_type) ? param.theme_type : '';
    console.log('Get Theme : ',param);
    if(!theme_type)
    {
        query_text = `SELECT id,type,theme_name FROM themes WHERE order by type ASC`;
    }else{
        query_text = `SELECT id,type,theme_name FROM themes WHERE type = '${theme_type}' order by id DESC`;
    }
        var q = sql.query(query_text, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            if(res.length > 0)
            {            
                async.forEachOf(res, async (theme, key, callback) => {
                    var themeData = {
                        "theme_id": theme.id,
                        "type": theme.type,
                        "theme_name": (theme.type == 1)? `${fullUrl}/themes/horizontal/${theme.theme_name}`:(theme.type == 2)? `${fullUrl}/themes/square/${theme.theme_name}`:(theme.type == 3)? `${fullUrl}/themes/vertical/${theme.theme_name}`:``,
                    };
                    response.push(themeData);
                }, err => {
                    if (err) console.error(err.message);
                    response_arr['success'] = 1;
                    response_arr['msg'] = `Get theme data Successfully!`;
                    response_arr['data'] = response;
                    result(null, response_arr);
                })
            }else{
                response_arr['msg'] = `can't get theme data!`;
                result(null, response_arr);
            }
        });
}

Model.addAnnouncementModel = async function addAnnouncementModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];

    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var an_type = (param.an_type) ? param.an_type : 1;  // 1 = Normal Announcement, 2 = Poll Announcement
    var post_in = (param.post_in) ? param.post_in : 1;  // 2 = Simple Post, 2 = Poster Post , 3 = UploadIMage Post
    var an_desc = (param.an_desc) ? param.an_desc : '';  
    var poll_length = (param.poll_length) ? param.poll_length : 0;  
    
    var poll_keys = (param.poll_keys) ? param.poll_keys : '';
    if(an_type == 2 )
    {
        var get_poll_key = JSON.parse(poll_keys);
    }

    console.log('Add Announcement : ',param);
    console.log(param.poll_length);
    if(!mosque_id)
    {
        response_arr['msg'] = "mosque id is Required";
        result(null, response_arr);
    }else{
        if(an_type == 2)
        {
            console.log('poll_length',poll_length);
            console.log('poll_length',poll_length != 0);
            if(poll_length != 0)
            {
                console.log('fd');
                var a = poll_length.split('"');
                console.log('poll_length',poll_length);
                var poll_length1 = a[1];
                var currnDateTime = dt.format('Y-m-d H:M');
                var set_post_poll_length = poll_length1.split(':');  
                var add_Day = moment(currnDateTime).add(set_post_poll_length[0], 'd').format('YYYY-MM-DD HH:mm');
                var add_Hours = moment(add_Day).add(set_post_poll_length[1], 'h').format('YYYY-MM-DD HH:mm');
                var add_Minute = moment(add_Hours).add(set_post_poll_length[2], 'm').format('YYYY-MM-DD HH:mm');
                var get_post_poll_length = add_Minute;
                console.log('get_post_poll_length',get_post_poll_length);
            }else{
                var currnDateTime = dt.format('Y-m-d H:M');
                var add_Day = moment(currnDateTime).add(1, 'd').format('YYYY-MM-DD HH:mm');
                var get_post_poll_length = add_Day;
                console.log('test',get_post_poll_length);
            }
        }else{
            var get_post_poll_length = '0000-00-00 00:00';//moment(poll_dateLength).add(set_post_poll_length[0], 'd').format('YYYY-MM-DD HH:mm');
        }
        save_ann = {
            'mosque_id':mosque_id,
            'type': an_type,
            'post_in': post_in,
            'description': an_desc,
            'poll_length':get_post_poll_length,
            'created_at':today,
        };    
        query_text = `INSERT INTO mosque_announcements SET ? `;
        var q = sql.query(query_text,[save_ann],async function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            if(res.affectedRows > 0)
            {
                if(an_type == 2)
                {
                    for(var i=0; i < get_poll_key.length; i++)
                    {
                        // console.log('get_poll_key',get_poll_key[i].poll_length);
                        // var set_poll_length = get_poll_key[i].poll_length.split(':');  
                        // console.log('set_poll_length_Day',set_poll_length[0]);
                        // console.log('set_poll_length_hour',set_poll_length[1]);
                        // console.log('set_poll_length_minute',set_poll_length[2]);
                        // var dateLength = dt.format('Y-m-d ')+set_poll_length[1]+':'+set_poll_length[2];
                        // console.log('dateLenght',dateLength);
                        // var get_poll_length = moment(dateLength).add(set_poll_length[0], 'd').format('YYYY-MM-DD HH:mm');
                        // console.log('get_poll',get_poll_length);
                        poll_data = {
                            'announcement_id': res.insertId,
                            'poll_keys': get_poll_key[i].key,
                            'poll_answer': get_poll_key[i].answer,
                            // 'poll_length': get_poll_length,
                            'created_at':today,
                        };
                        var query_text = "INSERT INTO mosque_announcement_polls SET ?";
                        sql.query(query_text, [poll_data], function(err, resAttachments) {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                            }
                        });
                    }

                }else{
                    var postID = res.insertId;

                    var postFileData = {
                        'announcement_id': postID,
                        'created_at':today,
                    }
                    // console.log('files',req.files.project_files);
                    // File Upload : Start
                        var post_file = (req.files && req.files.posts) ? req.files.posts : [];
                        if (files_param && (typeof post_file.length === "undefined" ||  post_file.length > 0)) {
                            if(typeof post_file.length === "undefined") {
                                var fileLength = 1;
                            } else if(post_file.length > 0) {
                                var fileLength = post_file.length;
                            }
                            if(fileLength > 1) {
                                for(var i = 0; i < fileLength; i++) {
                                
                                    let {fileName,video_thumbnail} = await uploadMedia('posts',post_file[i]);

                                    postFileData.file = fileName;
                                    postFileData.video_thumbnail = video_thumbnail;
                                    
                                    var insertPostFileData = "INSERT INTO mosque_announcement_images SET ?";
                                    sql.query(insertPostFileData, postFileData, function(err, result) {
                                        if(err) {
                                            console.log("error: ", err);
                                            result(err, null);
                                        }
                                    });
                                }
                            } else {
                                const {fileName,video_thumbnail} = await uploadMedia('posts',post_file);
                                    
                                postFileData.file = fileName;
                                postFileData.video_thumbnail = video_thumbnail;

                                var insertPostFileData = "INSERT INTO mosque_announcement_images SET ?";
                                sql.query(insertPostFileData, postFileData, function(err, result) {
                                    if(err) {
                                        console.log("error: ", err);
                                        result(err, null);
                                    }
                                });
                            }
                        }
                }

                response_arr['success'] = 1;
                response_arr['msg'] = `Save Announcement data Successfully!`;
                response_arr['data'] = res.insertId;
                result(null, response_arr);
            }else{
                response_arr['msg'] = `can't save announcement data!`;
                result(null, response_arr);
            }   
        });
    }
}

function getTime (){
	let date= new Date();
	return date.getTime();
}

async function uploadMedia(module,file){
	console.log(module, file);
    var number = Math.random() // 0.9394456857981651
    number.toString(36); // '0.xtis06h6'
    var randamName = number.toString(36).substr(2, 9); // 'xtis06h6'


	var fileName = 'post_' + file.md5 + randamName + path.extname(file.name);//getTime() + path.extname(file.name);
	var newpath = "./public/" + module + "/" + fileName;
	let video_thumbnail = '';
	let isVideo = (file && file.mimetype.indexOf('video') > -1);
	if(isVideo){
		// let filename = file.name.split('.').slice(0, -1).join('.')
		let filename = fileName;
		video_thumbnail = 'thumbFile_' + file.md5 + randamName + '.png';
	}
	file.mv(newpath, function (err) {
		if (err) { result("Error uploading file.", err); return; }
		if(isVideo){
            
			ffmpeg(newpath)
			.screenshots({
			    timestamps: [1],
			    filename: video_thumbnail,
			    folder: "./public/" + module + "/",
			    size: '320x240'
			  });
		}
	});
	return {fileName,video_thumbnail}
}

Model.addAnnouncementModel123 = async function addAnnouncementModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];

    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var an_type = (param.an_type) ? param.an_type : 1;  // 1 = Normal Announcement, 2 = Poll Announcement
    var post_in = (param.post_in) ? param.post_in : 1;  // 2 = Simple Post, 2 = Poster Post , 3 = UploadIMage Post
    var an_desc = (param.an_desc) ? param.an_desc : '';  
    var poll_length = (param.poll_length) ? param.poll_length : "00:00:00";  
    
    var poll_keys = (param.poll_keys) ? param.poll_keys : '';
    if(an_type == 2 )
    {
        var get_poll_key = JSON.parse(poll_keys);
    }

    console.log('Add Announcement : ',param);
    if(!mosque_id)
    {
        response_arr['msg'] = "mosque id is Required";
        result(null, response_arr);
    }else{
        if(an_type == 2)
        {
            if(poll_length != "00:00:00")
            {
                var a = poll_length.split('"');
                console.log('poll_length',poll_length);
                var poll_length1 = a[1];
                var currnDateTime = dt.format('Y-m-d H:M');
                var set_post_poll_length = poll_length1.split(':');  
                var add_Day = moment(currnDateTime).add(set_post_poll_length[0], 'd').format('YYYY-MM-DD HH:mm');
                var add_Hours = moment(add_Day).add(set_post_poll_length[1], 'h').format('YYYY-MM-DD HH:mm');
                var add_Minute = moment(add_Hours).add(set_post_poll_length[2], 'm').format('YYYY-MM-DD HH:mm');
                var get_post_poll_length = add_Minute;
                console.log('get_post_poll_length',get_post_poll_length);
            }else{
                var currnDateTime = dt.format('Y-m-d H:M');
                var add_Day = moment(currnDateTime).add(1, 'd').format('YYYY-MM-DD HH:mm');
                var get_post_poll_length = add_Day;
            }
        }else{
            var get_post_poll_length = '0000-00-00 00:00';//moment(poll_dateLength).add(set_post_poll_length[0], 'd').format('YYYY-MM-DD HH:mm');
        }
        save_ann = {
            'mosque_id':mosque_id,
            'type': an_type,
            'post_in': post_in,
            'description': an_desc,
            'poll_length':get_post_poll_length,
            'created_at':today,
        };    
        query_text = `INSERT INTO mosque_announcements SET ? `;
        var q = sql.query(query_text,[save_ann], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            if(res.affectedRows > 0)
            {
                if(an_type == 2)
                {
                    for(var i=0; i < get_poll_key.length; i++)
                    {
                        // console.log('get_poll_key',get_poll_key[i].poll_length);
                        // var set_poll_length = get_poll_key[i].poll_length.split(':');  
                        // console.log('set_poll_length_Day',set_poll_length[0]);
                        // console.log('set_poll_length_hour',set_poll_length[1]);
                        // console.log('set_poll_length_minute',set_poll_length[2]);
                        // var dateLength = dt.format('Y-m-d ')+set_poll_length[1]+':'+set_poll_length[2];
                        // console.log('dateLenght',dateLength);
                        // var get_poll_length = moment(dateLength).add(set_poll_length[0], 'd').format('YYYY-MM-DD HH:mm');
                        // console.log('get_poll',get_poll_length);
                        poll_data = {
                            'announcement_id': res.insertId,
                            'poll_keys': get_poll_key[i].key,
                            'poll_answer': get_poll_key[i].answer,
                            // 'poll_length': get_poll_length,
                            'created_at':today,
                        };
                        var query_text = "INSERT INTO mosque_announcement_polls SET ?";
                        sql.query(query_text, [poll_data], function(err, resAttachments) {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                            }
                        });
                    }

                }else{

                    // console.log('files',req.files.project_files);
                    // File Upload : Start
                    var pic = (req.files && req.files.posts) ? req.files.posts : [];

                    var number = Math.random() // 0.9394456857981651
                    number.toString(36); // '0.xtis06h6'
                    var randamName = number.toString(36).substr(2, 9); // 'xtis06h6'

                    if (files_param && typeof pic.length === "undefined") {
                        var dir = './public/posts';
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir);
                        }
                        console.log('single file',pic.name);
                        var fileName = 'post_' + pic.md5 + randamName + path.extname(pic.name);
                        var newpath = "./public/posts/" + fileName;
                        pic.mv(newpath, function (err) {
                            post_image_set = {
                                'announcement_id': res.insertId,
                                'file': 'post_' + pic.md5 + randamName + path.extname(pic.name),
                                'created_at':today,
                            };    
                            var query_text = "INSERT INTO mosque_announcement_images SET ?";
                            sql.query(query_text, [post_image_set], function(err, resAttachments) {
                                if (err) {
                                    console.log("error: ", err);
                                    result(err, null);
                                }
                            });

                            if (err) { result("Error uploading file.", err); return; }
                        });
                        project_files = fileName;
                    } else {
                        var dir = './public/posts';
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir);
                        }
                        console.log('multiple file');
                        
                        for (let picone of pic) {
                            var fileName = 'post_' + picone.md5 + randamName + path.extname(picone.name);
                            var newpath = "./public/posts/" + fileName;
                            picone.mv(newpath, function(err) {
                                if (err) { result("Error uploading file.", err); return; }
                                post_image_set = {
                                    'announcement_id': res.insertId,
                                    'file': 'post_' + picone.md5 + randamName + path.extname(picone.name),
                                    'created_at':today,
                                };    
                                try {
                                    var query_text = "INSERT INTO mosque_announcement_images SET ?";
                                    sql.query(query_text, [post_image_set], function(err, resAttachments) {
                                        if (err) {
                                            console.log("error: ", err);
                                            result(err, null);
                                        }
                                    });
                                } catch (error) {
                                    console.log('Image Uploding error',error);
                                }
                            });                        
                        }
                    }
                    // File Upload : End 
                }

                response_arr['success'] = 1;
                response_arr['msg'] = `Save Announcement data Successfully!`;
                response_arr['data'] = res.insertId;
                result(null, response_arr);
            }else{
                response_arr['msg'] = `can't save announcement data!`;
                result(null, response_arr);
            }   
        });
    }
}

Model.updateAnnouncementModel = async function updateAnnouncementModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];

    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var announcement_id = (param.announcement_id) ? param.announcement_id : '';
    var an_type = (param.an_type) ? param.an_type : 1;  // 1 = Normal Announcement, 2 = Poll Announcement
    var post_in = (param.post_in) ? param.post_in : 1;  // 1 = Simplet Post, 2 = Poster Post , 3 = UploadImage Post
    var an_desc = (param.an_desc) ? param.an_desc : '';  
    var poll_length = (param.poll_length) ? param.poll_length : '00:00:00';  
    
    var poll_keys = (param.poll_keys) ? param.poll_keys : '';
    if(an_type == 2 )
    {
        var get_poll_key = JSON.parse(poll_keys);
    }

    console.log('Update Announcement : ',param);
    if(!mosque_id)
    {
        response_arr['msg'] = "mosque id is Required";
        result(null, response_arr);
    }else if(!announcement_id)
    {
        response_arr['msg'] = "Announcement id is Required";
        result(null, response_arr);
    }else{
        // var saveAnnouncement =  await helper.sql_query(sql, `INSERT INTO mosque_announcements SET ?`).catch(console.log);
        
        if(an_type == 2)
        {
            if(poll_length != "00:00:00")
            {
                var a = poll_length.split('"');
                var poll_length1 = a[1];
                // var set_post_poll_length = poll_length1.split(':');  
                // var poll_dateLength = dt.format('Y-m-d ')+set_post_poll_length[1]+':'+set_post_poll_length[2];
                // var get_post_poll_length = moment(poll_dateLength).add(set_post_poll_length[0], 'd').format('YYYY-MM-DD HH:mm');

                var currnDateTime = dt.format('Y-m-d H:M');
                var set_post_poll_length = poll_length1.split(':');  
                var add_Day = moment(currnDateTime).add(set_post_poll_length[0], 'd').format('YYYY-MM-DD HH:mm');
                var add_Hours = moment(add_Day).add(set_post_poll_length[1], 'h').format('YYYY-MM-DD HH:mm');
                var add_Minute = moment(add_Hours).add(set_post_poll_length[2], 'm').format('YYYY-MM-DD HH:mm');
                var get_post_poll_length = add_Minute;
                console.log('get_post_poll_length',get_post_poll_length);
            }else{
                var currnDateTime = dt.format('Y-m-d H:M');
                var add_Day = moment(currnDateTime).add(1, 'd').format('YYYY-MM-DD HH:mm');
                var get_post_poll_length = add_Day;
            }
        }else{
            var get_post_poll_length = '0000-00-00 00:00';//moment(poll_dateLength).add(set_post_poll_length[0], 'd').format('YYYY-MM-DD HH:mm');
        }
        var update_ann = {
            'description': an_desc,
            'poll_length':get_post_poll_length,
            'updated_at':today,
        };    
        query_text = `UPDATE mosque_announcements SET ? WHERE id='${announcement_id}' AND post_in = '${post_in}' AND mosque_id = '${mosque_id}' `;
        var q = sql.query(query_text,[update_ann],async function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            if(res.affectedRows > 0)
            {
                if(an_type == 2)
                {
                    var poll_count = 0;
                    for(var i=0; i < get_poll_key.length; i++)
                    {
                        // console.log('get_poll_key',get_poll_key[i].poll_length);
                        // var set_poll_length = get_poll_key[i].poll_length.split(':');  
                        // console.log('set_poll_length_Day',set_poll_length[0]);
                        // console.log('set_poll_length_hour',set_poll_length[1]);
                        // console.log('set_poll_length_minute',set_poll_length[2]);
                        // var dateLength = dt.format('Y-m-d ')+set_poll_length[1]+':'+set_poll_length[2];
                        // console.log('dateLenght',dateLength);
                        // var get_poll_length = moment(dateLength).add(set_poll_length[0], 'd').format('YYYY-MM-DD HH:mm');
                        console.log('get_poll',get_poll_key[i]);
                        if(get_poll_key[i].poll_id != 0 )
                        {
                            poll_data = {
                                'poll_keys': get_poll_key[i].key,
                                'poll_answer': get_poll_key[i].answer,
                                'created_at':today,
                            };
                            var query_text = `UPDATE mosque_announcement_polls SET ? WHERE id = '${get_poll_key[i].poll_id}' AND announcement_id = '${announcement_id}' `;
                            sql.query(query_text, [poll_data], function(err, resAttachments) {
                                if (err) {
                                    console.log("error: ", err);
                                    result(err, null);
                                }
                            });
                            poll_count = poll_count + 1;
                        }else{
                            console.log('df');
                            poll_data1 = {
                                'announcement_id':announcement_id,
                                'poll_keys': get_poll_key[i].key,
                                'poll_answer': get_poll_key[i].answer,
                                'created_at':today,
                            };
                            var query_text = "INSERT INTO mosque_announcement_polls SET ?";
                            sql.query(query_text, [poll_data1], function(err, resAttachments) {
                                if (err) {
                                    console.log("error: ", err);
                                    result(err, null);
                                }
                            });
                            poll_count = poll_count + 1;
                        }
                    }
                    if(poll_count == get_poll_key.length)
                    {
                        var user_id = mosque_id;
                        query_text = `SELECT post.id as post_id,post.type as post_type,post.description,post.status,DATE_FORMAT(post.created_at,'%d %m %Y,%H:%i:%s') AS created_at,users.id as mosque_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,DATE_FORMAT(post.poll_length,'%d-%m-%Y %H:%i') AS poll_length,post_like.id as post_like_id,post_comment.id as post_comment_id FROM mosque_announcements as post LEFT JOIN users ON post.mosque_id = users.id LEFT JOIN mosque_announcement_likes as post_like ON post.id = post_like.post_id AND post_like.user_id = '${user_id}' LEFT JOIN mosque_announcement_comments as post_comment ON post.id = post_comment.post_id AND post_comment.user_id = '${user_id}' WHERE mosque_id = '${mosque_id}' AND post.id = '${announcement_id}' group by post_id order by post_id DESC `;
                        var q = sql.query(query_text,async function (err, announcement) {
                            console.log('announcementList',announcement[0]);
                            if(announcement.length > 0)
                            {
                                var postFiles =  await helper.sql_query(sql, `SELECT post_file.id,CASE WHEN post_file.file!='' THEN CONCAT('${fullUrl}/posts/',post_file.file) ELSE '' END AS file,CASE WHEN video_thumbnail!='' THEN CONCAT('${fullUrl}/posts/',video_thumbnail) ELSE '' END AS video_thumbnail, DATE_FORMAT(post_file.created_at,'%d %m %Y,%H:%i:%s') AS created_at, post_file_like.id as post_file_like_id, post_file_comment.id as post_file_comment_id FROM mosque_announcement_images as post_file LEFT JOIN mosque_announcement_file_likes as post_file_like ON post_file.id = post_file_like.post_file_id AND post_file_like.user_id = '${user_id}' LEFT JOIN mosque_announcement_file_comments as post_file_comment ON post_file.id = post_file_comment.post_file_id AND post_file_comment.user_id = '${user_id}' WHERE post_file.announcement_id = '${announcement[0].post_id}' order by post_file.id ASC `).catch(console.log);
                                async.forEachOf(postFiles, async (file, key, callback) => {
                                    var file_likes =  await helper.sql_query(sql, `SELECT count(id) as total_like FROM mosque_announcement_file_likes WHERE post_id = '${announcement[0].post_id}' and post_file_id = '${file.id}' `).catch(console.log);
                                    var file_comments =  await helper.sql_query(sql, `SELECT count(id) as total_comment FROM mosque_announcement_file_comments WHERE post_id = '${announcement[0].post_id}' and post_file_id = '${file.id}' `).catch(console.log);
                                    var getPostFile = {
                                        'id': file.id,
                                        'file': file.file,
                                        'video_thumbnail': file.video_thumbnail,
                                        'is_file_likes': (file.post_file_like_id)?true:false,
                                        'total_file_like': file_likes[0].total_like,
                                        'is_file_comments': (file.post_file_comment_id)?true:false,
                                        "total_file_comments": file_comments[0].total_comment,
                                        'created_at': moment(file.created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a'),
                                    }
                                    response.push(getPostFile);
                                });
                                var likes =  await helper.sql_query(sql, `SELECT count(id) as total_like FROM mosque_announcement_likes WHERE post_id = '${announcement[0].post_id}'`).catch(console.log);
                                
                                var comments =  await helper.sql_query(sql, `SELECT count(id) as total_comment FROM mosque_announcement_comments WHERE post_id = '${announcement[0].post_id}'`).catch(console.log);
                                
                                var postPollKey =  await helper.sql_query(sql, `SELECT polls.id, polls.poll_keys,polls.poll_answer, DATE_FORMAT(polls.created_at,'%d-%m-%Y,%H:%i:%s') AS created_at,IF(poll_visitor.poll_click_id = polls.id, "true", "false") as poll_click_flag FROM mosque_announcement_polls as polls LEFT JOIN mosque_announcement_poll_visitor as poll_visitor ON polls.id  = poll_visitor.poll_click_id AND poll_visitor.user_id = '${user_id}' WHERE polls.announcement_id = '${announcement[0].post_id}' order by polls.id ASC `).catch(console.log);

                                var setPostDate = moment(announcement[0].created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a');
                                var postData = [{
                                    "post_id": announcement[0].post_id,
                                    "mosque_id": announcement[0].mosque_id,
                                    "mosque_name": announcement[0].mosque_name,
                                    "first_name": announcement[0].first_name,
                                    "last_name": announcement[0].last_name,
                                    "profile_photo": announcement[0].profile_photo,
                                    "post_type": announcement[0].post_type,
                                    "description": announcement[0].description,
                                    "status": announcement[0].status,
                                    "is_likes": (announcement[0].post_like_id)?true:false,
                                    "total_like": likes[0].total_like,
                                    "is_comments": (announcement[0].post_comment_id)?true:false,
                                    "total_comments": comments[0].total_comment,
                                    "files": response,
                                    "PollKey": postPollKey,
                                    "Poll_length":(announcement[0].post_type == 2)? announcement[0].poll_length:'',
                                    // "post_date_time": announcement.created_at,
                                    "post_date_time": setPostDate,
                                }];
                                // response.push(postData);

                                response_arr['success'] = 1;
                                response_arr['msg'] = `Update Announcement data Successfully!`;
                                response_arr['data'] = postData;
                                result(null, response_arr);
                                
                            }else{
                                response_arr['msg'] = `Announcement data not found.`;
                                result(null, response_arr);
                            }      
                        });
                    }

                }else{
                    var postID = announcement_id;
                    var postFileData = {
                        'announcement_id': postID,
                        'created_at':today,
                    }

                    var user_id = mosque_id;
                    // console.log('files',req.files.project_files);
                    // File Upload : Start
                        var post_file = (req.files && req.files.posts) ? req.files.posts : [];
                        if (files_param && (typeof post_file.length === "undefined" ||  post_file.length > 0)) {
                            if(typeof post_file.length === "undefined") {
                                var fileLength = 1;
                            } else if(post_file.length > 0) {
                                var fileLength = post_file.length;
                            }
                            if(fileLength > 1) {
                                var file_count = 0
                                for(var i = 0; i < fileLength; i++) {
                                    
                                    let {fileName,video_thumbnail} = await uploadMedia('posts',post_file[i]);

                                    postFileData.file = fileName;
                                    postFileData.video_thumbnail = video_thumbnail;
                                    
                                    var insertPostFileData = "INSERT INTO mosque_announcement_images SET ?";
                                    sql.query(insertPostFileData, postFileData, function(err, result) {
                                        if(err) {
                                            console.log("error: ", err);
                                            result(err, null);
                                        }
                                    });
                                    file_count = file_count + 1; 
                                }
                                
                            } else {
                                const {fileName,video_thumbnail} = await uploadMedia('posts',post_file);
                                    
                                postFileData.file = fileName;
                                postFileData.video_thumbnail = video_thumbnail;

                                var insertPostFileData = "INSERT INTO mosque_announcement_images SET ?";
                                sql.query(insertPostFileData, postFileData, function(err, result) {
                                    if(err) {
                                        console.log("error: ", err);
                                        result(err, null);
                                    }
                                });
                                file_count = 1;
                            }
                            if(file_count == fileLength)
                            {
                                query_text = `SELECT post.id as post_id,post.type as post_type,post.description,post.status,DATE_FORMAT(post.created_at,'%d %m %Y,%H:%i:%s') AS created_at,users.id as mosque_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,DATE_FORMAT(post.poll_length,'%d-%m-%Y %H:%i') AS poll_length,post_like.id as post_like_id,post_comment.id as post_comment_id FROM mosque_announcements as post LEFT JOIN users ON post.mosque_id = users.id LEFT JOIN mosque_announcement_likes as post_like ON post.id = post_like.post_id AND post_like.user_id = '${user_id}' LEFT JOIN mosque_announcement_comments as post_comment ON post.id = post_comment.post_id AND post_comment.user_id = '${user_id}' WHERE mosque_id = '${mosque_id}' AND post.id = '${announcement_id}' group by post_id order by post_id DESC `;
                                var q = sql.query(query_text,async function (err, announcement) {
                                    console.log('announcementList',announcement[0]);
                                    if(announcement.length > 0)
                                    {
                                        var postFiles =  await helper.sql_query(sql, `SELECT post_file.id,CASE WHEN post_file.file!='' THEN CONCAT('${fullUrl}/posts/',post_file.file) ELSE '' END AS file,CASE WHEN video_thumbnail!='' THEN CONCAT('${fullUrl}/posts/',video_thumbnail) ELSE '' END AS video_thumbnail, DATE_FORMAT(post_file.created_at,'%d %m %Y,%H:%i:%s') AS created_at, post_file_like.id as post_file_like_id, post_file_comment.id as post_file_comment_id FROM mosque_announcement_images as post_file LEFT JOIN mosque_announcement_file_likes as post_file_like ON post_file.id = post_file_like.post_file_id AND post_file_like.user_id = '${user_id}' LEFT JOIN mosque_announcement_file_comments as post_file_comment ON post_file.id = post_file_comment.post_file_id AND post_file_comment.user_id = '${user_id}' WHERE post_file.announcement_id = '${announcement[0].post_id}' order by post_file.id ASC `).catch(console.log);
                                        async.forEachOf(postFiles, async (file, key, callback) => {
                                            var file_likes =  await helper.sql_query(sql, `SELECT count(id) as total_like FROM mosque_announcement_file_likes WHERE post_id = '${announcement[0].post_id}' and post_file_id = '${file.id}' `).catch(console.log);
                                            var file_comments =  await helper.sql_query(sql, `SELECT count(id) as total_comment FROM mosque_announcement_file_comments WHERE post_id = '${announcement[0].post_id}' and post_file_id = '${file.id}' `).catch(console.log);
                                            var getPostFile = {
                                                'id': file.id,
                                                'file': file.file,
                                                'video_thumbnail': file.video_thumbnail,
                                                'is_file_likes': (file.post_file_like_id)?true:false,
                                                'total_file_like': file_likes[0].total_like,
                                                'is_file_comments': (file.post_file_comment_id)?true:false,
                                                "total_file_comments": file_comments[0].total_comment,
                                                'created_at': moment(file.created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a'),
                                            }
                                            response.push(getPostFile);
                                        });
                                        var likes =  await helper.sql_query(sql, `SELECT count(id) as total_like FROM mosque_announcement_likes WHERE post_id = '${announcement[0].post_id}'`).catch(console.log);
                                        
                                        var comments =  await helper.sql_query(sql, `SELECT count(id) as total_comment FROM mosque_announcement_comments WHERE post_id = '${announcement[0].post_id}'`).catch(console.log);
                                        
                                        var postPollKey =  await helper.sql_query(sql, `SELECT polls.id, polls.poll_keys,polls.poll_answer, DATE_FORMAT(polls.created_at,'%d-%m-%Y,%H:%i:%s') AS created_at,IF(poll_visitor.poll_click_id = polls.id, "true", "false") as poll_click_flag FROM mosque_announcement_polls as polls LEFT JOIN mosque_announcement_poll_visitor as poll_visitor ON polls.id  = poll_visitor.poll_click_id AND poll_visitor.user_id = '${user_id}' WHERE polls.announcement_id = '${announcement[0].post_id}' order by polls.id ASC `).catch(console.log);

                                        var setPostDate = moment(announcement[0].created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a');
                                        var postData = [{
                                            "post_id": announcement[0].post_id,
                                            "mosque_id": announcement[0].mosque_id,
                                            "mosque_name": announcement[0].mosque_name,
                                            "first_name": announcement[0].first_name,
                                            "last_name": announcement[0].last_name,
                                            "profile_photo": announcement[0].profile_photo,
                                            "post_type": announcement[0].post_type,
                                            "description": announcement[0].description,
                                            "status": announcement[0].status,
                                            "is_likes": (announcement[0].post_like_id)?true:false,
                                            "total_like": likes[0].total_like,
                                            "is_comments": (announcement[0].post_comment_id)?true:false,
                                            "total_comments": comments[0].total_comment,
                                            "files": response,
                                            "PollKey": postPollKey,
                                            "Poll_length":(announcement[0].post_type == 2)? announcement[0].poll_length:'',
                                            // "post_date_time": announcement.created_at,
                                            "post_date_time": setPostDate,
                                        }];
                                        // response.push(postData);

                                        response_arr['success'] = 1;
                                        response_arr['msg'] = `Update Announcement data Successfully!`;
                                        response_arr['data'] = postData;
                                        result(null, response_arr);
                                        
                                    }else{
                                        response_arr['msg'] = `Announcement data not found.`;
                                        result(null, response_arr);
                                    }      
                                });
                            }
                        }else{
                            query_text = `SELECT post.id as post_id,post.type as post_type,post.description,post.status,DATE_FORMAT(post.created_at,'%d %m %Y,%H:%i:%s') AS created_at,users.id as mosque_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,DATE_FORMAT(post.poll_length,'%d-%m-%Y %H:%i') AS poll_length,post_like.id as post_like_id,post_comment.id as post_comment_id FROM mosque_announcements as post LEFT JOIN users ON post.mosque_id = users.id LEFT JOIN mosque_announcement_likes as post_like ON post.id = post_like.post_id AND post_like.user_id = '${user_id}' LEFT JOIN mosque_announcement_comments as post_comment ON post.id = post_comment.post_id AND post_comment.user_id = '${user_id}' WHERE mosque_id = '${mosque_id}' AND post.id = '${announcement_id}' group by post_id order by post_id DESC `;
                            var q = sql.query(query_text,async function (err, announcement) {
                                console.log('announcementList',announcement[0]);
                                if(announcement.length > 0)
                                {
                                    var postFiles =  await helper.sql_query(sql, `SELECT post_file.id,CASE WHEN post_file.file!='' THEN CONCAT('${fullUrl}/posts/',post_file.file) ELSE '' END AS file,CASE WHEN video_thumbnail!='' THEN CONCAT('${fullUrl}/posts/',video_thumbnail) ELSE '' END AS video_thumbnail, DATE_FORMAT(post_file.created_at,'%d %m %Y,%H:%i:%s') AS created_at, post_file_like.id as post_file_like_id, post_file_comment.id as post_file_comment_id FROM mosque_announcement_images as post_file LEFT JOIN mosque_announcement_file_likes as post_file_like ON post_file.id = post_file_like.post_file_id AND post_file_like.user_id = '${user_id}' LEFT JOIN mosque_announcement_file_comments as post_file_comment ON post_file.id = post_file_comment.post_file_id AND post_file_comment.user_id = '${user_id}' WHERE post_file.announcement_id = '${announcement[0].post_id}' order by post_file.id ASC `).catch(console.log);
                                    async.forEachOf(postFiles, async (file, key, callback) => {
                                        var file_likes =  await helper.sql_query(sql, `SELECT count(id) as total_like FROM mosque_announcement_file_likes WHERE post_id = '${announcement[0].post_id}' and post_file_id = '${file.id}' `).catch(console.log);
                                        var file_comments =  await helper.sql_query(sql, `SELECT count(id) as total_comment FROM mosque_announcement_file_comments WHERE post_id = '${announcement[0].post_id}' and post_file_id = '${file.id}' `).catch(console.log);
                                        var getPostFile = {
                                            'id': file.id,
                                            'file': file.file,
                                            'video_thumbnail': file.video_thumbnail,
                                            'is_file_likes': (file.post_file_like_id)?true:false,
                                            'total_file_like': file_likes[0].total_like,
                                            'is_file_comments': (file.post_file_comment_id)?true:false,
                                            "total_file_comments": file_comments[0].total_comment,
                                            'created_at': moment(file.created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a'),
                                        }
                                        response.push(getPostFile);
                                    });
                                    var likes =  await helper.sql_query(sql, `SELECT count(id) as total_like FROM mosque_announcement_likes WHERE post_id = '${announcement[0].post_id}'`).catch(console.log);
                                    
                                    var comments =  await helper.sql_query(sql, `SELECT count(id) as total_comment FROM mosque_announcement_comments WHERE post_id = '${announcement[0].post_id}'`).catch(console.log);
                                    
                                    var postPollKey =  await helper.sql_query(sql, `SELECT polls.id, polls.poll_keys,polls.poll_answer, DATE_FORMAT(polls.created_at,'%d-%m-%Y,%H:%i:%s') AS created_at,IF(poll_visitor.poll_click_id = polls.id, "true", "false") as poll_click_flag FROM mosque_announcement_polls as polls LEFT JOIN mosque_announcement_poll_visitor as poll_visitor ON polls.id  = poll_visitor.poll_click_id AND poll_visitor.user_id = '${user_id}' WHERE polls.announcement_id = '${announcement[0].post_id}' order by polls.id ASC `).catch(console.log);

                                    var setPostDate = moment(announcement[0].created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a');
                                    var postData = [{
                                        "post_id": announcement[0].post_id,
                                        "mosque_id": announcement[0].mosque_id,
                                        "mosque_name": announcement[0].mosque_name,
                                        "first_name": announcement[0].first_name,
                                        "last_name": announcement[0].last_name,
                                        "profile_photo": announcement[0].profile_photo,
                                        "post_type": announcement[0].post_type,
                                        "description": announcement[0].description,
                                        "status": announcement[0].status,
                                        "is_likes": (announcement[0].post_like_id)?true:false,
                                        "total_like": likes[0].total_like,
                                        "is_comments": (announcement[0].post_comment_id)?true:false,
                                        "total_comments": comments[0].total_comment,
                                        "files": response,
                                        "PollKey": postPollKey,
                                        "Poll_length":(announcement[0].post_type == 2)? announcement[0].poll_length:'',
                                        // "post_date_time": announcement.created_at,
                                        "post_date_time": setPostDate,
                                    }];
                                    // response.push(postData);

                                    response_arr['success'] = 1;
                                    response_arr['msg'] = `Update Announcement data Successfully!`;
                                    response_arr['data'] = postData;
                                    result(null, response_arr);
                                    
                                }else{
                                    response_arr['msg'] = `Announcement data not found.`;
                                    result(null, response_arr);
                                }      
                            });
                        }
                }

                // response_arr['success'] = 1;
                // response_arr['msg'] = `Update Announcement data Successfully!`;
                // // response_arr['data'] = orderItem;
                // result(null, response_arr);
            }else{
                response_arr['msg'] = `can't save announcement data!`;
                result(null, response_arr);
            }   
        });
    }
}

Model.updateAnnouncementModel12 = async function updateAnnouncementModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];

    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var announcement_id = (param.announcement_id) ? param.announcement_id : '';
    var an_type = (param.an_type) ? param.an_type : 1;  // 1 = Normal Announcement, 2 = Poll Announcement
    var post_in = (param.post_in) ? param.post_in : 1;  // 1 = Simplet Post, 2 = Poster Post , 3 = UploadImage Post
    var an_desc = (param.an_desc) ? param.an_desc : '';  
    var poll_length = (param.poll_length) ? param.poll_length : '00:00:00';  
    
    var poll_keys = (param.poll_keys) ? param.poll_keys : '';
    if(an_type == 2 )
    {
        var get_poll_key = JSON.parse(poll_keys);
    }

    console.log('Update Announcement : ',param);
    if(!mosque_id)
    {
        response_arr['msg'] = "mosque id is Required";
        result(null, response_arr);
    }else if(!announcement_id)
    {
        response_arr['msg'] = "Announcement id is Required";
        result(null, response_arr);
    }else{
        // var saveAnnouncement =  await helper.sql_query(sql, `INSERT INTO mosque_announcements SET ?`).catch(console.log);
        
        if(an_type == 2)
        {
            if(poll_length != "00:00:00")
            {
                var a = poll_length.split('"');
                var poll_length1 = a[1];
                // var set_post_poll_length = poll_length1.split(':');  
                // var poll_dateLength = dt.format('Y-m-d ')+set_post_poll_length[1]+':'+set_post_poll_length[2];
                // var get_post_poll_length = moment(poll_dateLength).add(set_post_poll_length[0], 'd').format('YYYY-MM-DD HH:mm');

                var currnDateTime = dt.format('Y-m-d H:M');
                var set_post_poll_length = poll_length1.split(':');  
                var add_Day = moment(currnDateTime).add(set_post_poll_length[0], 'd').format('YYYY-MM-DD HH:mm');
                var add_Hours = moment(add_Day).add(set_post_poll_length[1], 'h').format('YYYY-MM-DD HH:mm');
                var add_Minute = moment(add_Hours).add(set_post_poll_length[2], 'm').format('YYYY-MM-DD HH:mm');
                var get_post_poll_length = add_Minute;
                console.log('get_post_poll_length',get_post_poll_length);
            }else{
                var currnDateTime = dt.format('Y-m-d H:M');
                var add_Day = moment(currnDateTime).add(1, 'd').format('YYYY-MM-DD HH:mm');
                var get_post_poll_length = add_Day;
            }
        }else{
            var get_post_poll_length = '0000-00-00 00:00';//moment(poll_dateLength).add(set_post_poll_length[0], 'd').format('YYYY-MM-DD HH:mm');
        }
        update_ann = {
            'description': an_desc,
            'poll_length':get_post_poll_length,
            'updated_at':today,
        };    
        query_text = `UPDATE mosque_announcements SET ? WHERE id='${announcement_id}' AND post_in = '${post_in}' AND mosque_id = '${mosque_id}' `;
        var q = sql.query(query_text,[update_ann], function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            if(res.affectedRows > 0)
            {
                if(an_type == 2)
                {
                    for(var i=0; i < get_poll_key.length; i++)
                    {
                        // console.log('get_poll_key',get_poll_key[i].poll_length);
                        // var set_poll_length = get_poll_key[i].poll_length.split(':');  
                        // console.log('set_poll_length_Day',set_poll_length[0]);
                        // console.log('set_poll_length_hour',set_poll_length[1]);
                        // console.log('set_poll_length_minute',set_poll_length[2]);
                        // var dateLength = dt.format('Y-m-d ')+set_poll_length[1]+':'+set_poll_length[2];
                        // console.log('dateLenght',dateLength);
                        // var get_poll_length = moment(dateLength).add(set_poll_length[0], 'd').format('YYYY-MM-DD HH:mm');
                        // console.log('get_poll',get_poll_length);
                        poll_data = {
                            // 'announcement_id': announcement_id,
                            // 'id': get_poll_key[i].poll_id,
                            'poll_keys': get_poll_key[i].key,
                            'poll_answer': get_poll_key[i].answer,
                            // 'poll_length': get_poll_length,
                            'created_at':today,
                        };
                        var query_text = `UPDATE mosque_announcement_polls SET ? WHERE id = '${get_poll_key[i].poll_id}' AND announcement_id = '${announcement_id}' `;
                        sql.query(query_text, [poll_data], function(err, resAttachments) {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                            }
                        });
                    }

                }else{

                    // console.log('files',req.files.posts);
                    // File Upload : Start
                    var pic = (req.files && req.files.posts) ? req.files.posts : []

                    var number = Math.random() // 0.9394456857981651
                    number.toString(36); // '0.xtis06h6'
                    var randamName = number.toString(36).substr(2, 9); // 'xtis06h6'

                    if (files_param && typeof pic.length === "undefined") {
                        var dir = './public/posts';
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir);
                        }
                        console.log('single file',pic.name);
                        var fileName = 'post_' + pic.md5 + randamName + path.extname(pic.name);
                        var newpath = "./public/posts/" + fileName;
                        pic.mv(newpath, function (err) {
                            post_image_set = {
                                'announcement_id': announcement_id,
                                'file': 'post_' + pic.md5 + randamName + path.extname(pic.name),
                                'created_at':today,
                            };    
                            var query_text = "INSERT INTO mosque_announcement_images SET ?";
                            sql.query(query_text, [post_image_set], function(err, resAttachments) {
                                if (err) {
                                    console.log("error: ", err);
                                    result(err, null);
                                }
                            });

                            if (err) { result("Error uploading file.", err); return; }
                        });
                        project_files = fileName;
                    } else {
                        var dir = './public/posts';
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir);
                        }
                        console.log('multiple file');
                        
                        for (let picone of pic) {
                            var fileName = 'post_' + picone.md5 + randamName + path.extname(picone.name);
                            var newpath = "./public/posts/" + fileName;
                            picone.mv(newpath, function(err) {
                                if (err) { result("Error uploading file.", err); return; }
                                post_image_set = {
                                    'announcement_id': announcement_id,
                                    'file': 'post_' + picone.md5 + randamName + path.extname(picone.name),
                                    'created_at':today,
                                };    
                                try {
                                    var query_text = "INSERT INTO mosque_announcement_images SET ?";
                                    sql.query(query_text, [post_image_set], function(err, resAttachments) {
                                        if (err) {
                                            console.log("error: ", err);
                                            result(err, null);
                                        }
                                    });
                                } catch (error) {
                                    console.log('Image Uploding error',error);
                                }
                            });                        
                        }
                    }
                    // File Upload : End 
                }

                response_arr['success'] = 1;
                response_arr['msg'] = `Update Announcement data Successfully!`;
                // response_arr['data'] = orderItem;
                result(null, response_arr);
            }else{
                response_arr['msg'] = `can't save announcement data!`;
                result(null, response_arr);
            }   
        });
    }
}

Model.deleteAnnouncementFileModel123 = async function deleteAnnouncementFileModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var announcement_id = (param.announcement_id) ? param.announcement_id : '';
    var file_id = (param.file_id) ? param.file_id : '';
    console.log('param',file_id);
    
        var getFiles =  await helper.sql_query(sql, `SELECT * FROM mosque_announcement_images WHERE id = '${file_id}' AND announcement_id = '${announcement_id}' `).catch(console.log);
        if(getFiles.length > 0)
        {
            var postFiles = getFiles[0].file;
            if (postFiles != '') {
                var fs = require('fs');
                var filePath = './public/posts/' + postFiles;
                try {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    } else {
                        console.log("File does not exist.")
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        
            var imagesDelete =  await helper.sql_query(sql, `DELETE FROM mosque_announcement_images WHERE id = '${file_id}' AND announcement_id = '${announcement_id}' `).catch(console.log);
            if(imagesDelete.affectedRows){

                await helper.sql_query(sql, `DELETE FROM mosque_announcement_file_comments WHERE post_file_id = '${file_id}' AND post_id = '${announcement_id}' `).catch(console.log);
                await helper.sql_query(sql, `DELETE FROM mosque_announcement_file_comment_replys WHERE post_file_id = '${file_id}' AND post_id = '${announcement_id}' `).catch(console.log);
                await helper.sql_query(sql, `DELETE FROM mosque_announcement_file_likes WHERE post_file_id = '${file_id}' AND post_id = '${announcement_id}' `).catch(console.log);
                
                response_arr['success'] = 1;
                response_arr['msg'] = `Product Image Id : ${file_id} Deleted Successfully!`;
                // response_arr['data'] = response;
                result(null, response_arr);
            }else{
                response_arr['msg'] = `Some thing wan't wrong for Delete Product Image .`;
                result(null, response_arr);
            }
        }
};

Model.deleteAnnouncementFileModel = async function deleteAnnouncementFileModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var announcement_id = (param.announcement_id) ? param.announcement_id : '';
    var file_ids = (param.file_id) ? param.file_id : '';
    console.log('param',file_id);
    
    // var chk_images_id = JSON.parse(file_ids);
    // console.log('chk_json',chk_images_id);
    var split_images_ids = file_ids.split(',');  
    var imagesDelete1 = [];
    for(var i=0;i < split_images_ids.length; i++)
    {
        // var imagesDelete =  await helper.sql_query(sql, `DELETE FROM images WHERE id = '${split_images_ids[i]}' AND type = '2' AND ref_id = '${product_id}' `).catch(console.log);
        // if(imagesDelete.affectedRows){
            var file_id = split_images_ids[i];
            var getFiles =  await helper.sql_query(sql, `SELECT * FROM mosque_announcement_images WHERE id = '${file_id}' AND announcement_id = '${announcement_id}' `).catch(console.log);
            if(getFiles.length > 0)
            {
                var postFiles = getFiles[0].file;
                if (postFiles != '') {
                    var fs = require('fs');
                    var filePath = './public/posts/' + postFiles;
                    try {
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        } else {
                            console.log("File does not exist.")
                        }
                    } catch (err) {
                        console.error(err)
                    }
                }
            
                var imagesDelete =  await helper.sql_query(sql, `DELETE FROM mosque_announcement_images WHERE id = '${file_id}' AND announcement_id = '${announcement_id}' `).catch(console.log);
                if(imagesDelete.affectedRows){

                    await helper.sql_query(sql, `DELETE FROM mosque_announcement_file_comments WHERE post_file_id = '${file_id}' AND post_id = '${announcement_id}' `).catch(console.log);
                    await helper.sql_query(sql, `DELETE FROM mosque_announcement_file_comment_replys WHERE post_file_id = '${file_id}' AND post_id = '${announcement_id}' `).catch(console.log);
                    await helper.sql_query(sql, `DELETE FROM mosque_announcement_file_likes WHERE post_file_id = '${file_id}' AND post_id = '${announcement_id}' `).catch(console.log);
                    
                    imagesDelete1.push(split_images_ids[i]);

                    // response_arr['success'] = 1;
                    // response_arr['msg'] = `Product Image Id : ${file_id} Deleted Successfully!`;
                    // // response_arr['data'] = response;
                    // result(null, response_arr);
                }
                // else{
                //     response_arr['msg'] = `Some thing wan't wrong for Delete Product Image .`;
                //     result(null, response_arr);
                // }
                
            }
            
        // }
    }

    if(imagesDelete1.length > 0)
    {
        response_arr['success'] = 1;
        response_arr['msg'] = `Announcement Image Id : ${imagesDelete1} Deleted Successfully!`;
        // response_arr['data'] = response;
        result(null, response_arr);
    }else{
        response_arr['msg'] = `Some thing wan't wrong for Delete Announcement Image .`;
        result(null, response_arr);
    }
    
        
};

Model.deletePollModel = async function deletePollModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var announcement_id = (param.announcement_id) ? param.announcement_id : '';
    var poll_id = (param.poll_id) ? param.poll_id : '';
    console.log('param',poll_id);
    
    var split_poll_id = poll_id.split(',');  
    var imagesDelete1 = [];
    for(var i=0;i < split_poll_id.length; i++)
    {
            var poll = split_poll_id[i];

            var PollDelete =  await helper.sql_query(sql, `DELETE FROM mosque_announcement_polls WHERE id = '${poll}' AND announcement_id = '${announcement_id}' `).catch(console.log);
            if(PollDelete.affectedRows){
                var poll_visitor =  await helper.sql_query(sql, `DELETE FROM mosque_announcement_poll_visitor WHERE poll_click_id = '${poll}' AND post_id = '${announcement_id}' `).catch(console.log);
                
                imagesDelete1.push(split_poll_id[i]);
            }
    }

    if(imagesDelete1.length > 0)
    {
        response_arr['success'] = 1;
        response_arr['msg'] = `Announcement Poll Id : ${imagesDelete1} Deleted Successfully!`;
        result(null, response_arr);
    }else{
        response_arr['msg'] = `Some thing wan't wrong for Delete Announcement Poll .`;
        result(null, response_arr);
    }
};

Model.getAnnouncementModel = async function getAnnouncementModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];

    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var user_id = (param.user_id) ? param.user_id : mosque_id;  
    
    var next_id = (param.next_id) ? param.next_id : 0;
	var last_id = parseInt(next_id) + 20;

    var next_arr = [];

    console.log('Get Announcement : ',param);
    if(!mosque_id)
    {
        response_arr['msg'] = "mosque id is Required";
        result(null, response_arr);
    }else{
        query_text = `SELECT post.id as post_id,post.type as post_type,post.post_in,post.description,post.status,DATE_FORMAT(post.created_at,'%d %m %Y,%H:%i:%s') AS created_at,DATE_FORMAT(post.poll_length,'%d-%m-%Y %H:%i') AS poll_length,users.id as mosque_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,post_like.id as post_like_id,post_comment.id as post_comment_id FROM mosque_announcements as post LEFT JOIN users ON post.mosque_id = users.id LEFT JOIN mosque_announcement_likes as post_like ON post.id = post_like.post_id AND post_like.user_id = '${user_id}' LEFT JOIN mosque_announcement_comments as post_comment ON post.id = post_comment.post_id AND post_comment.user_id = '${user_id}' WHERE mosque_id = '${mosque_id}' group by post_id order by post_id DESC LIMIT 20 OFFSET ${parseInt(next_id)}`;
        var q = sql.query(query_text, function (err, announcementList) {
            async.forEachOf(announcementList, async (announcement, key, callback) => {
                
                var postFiles =  await helper.sql_query(sql, `SELECT id,CASE WHEN file!='' THEN CONCAT('${fullUrl}/posts/',file) ELSE '' END AS file,CASE WHEN video_thumbnail!='' THEN CONCAT('${fullUrl}/posts/',video_thumbnail) ELSE '' END AS video_thumbnail, created_at FROM mosque_announcement_images WHERE announcement_id = '${announcement.post_id}'`).catch(console.log);
                var likes =  await helper.sql_query(sql, `SELECT count(id) as total_like FROM mosque_announcement_likes WHERE post_id = '${announcement.post_id}'`).catch(console.log);
                var comments =  await helper.sql_query(sql, `SELECT count(id) as total_comment FROM mosque_announcement_comments WHERE post_id = '${announcement.post_id}'`).catch(console.log);
                var postPollKey =  await helper.sql_query(sql, `SELECT polls.id, polls.poll_keys,polls.poll_answer,DATE_FORMAT(polls.poll_length,'%Y-%m-%d %H:%i') AS poll_length, DATE_FORMAT(polls.created_at,'%d-%m-%Y,%H:%i:%s') AS created_at,IF(poll_visitor.poll_click_id = polls.id, "true", "false") as poll_click_flag FROM mosque_announcement_polls as polls LEFT JOIN mosque_announcement_poll_visitor as poll_visitor ON polls.id  = poll_visitor.poll_click_id AND poll_visitor.user_id = '${user_id}' WHERE polls.announcement_id = '${announcement.post_id}' order by polls.id ASC `).catch(console.log);
                let result = false;

                // for(var i = 0 ; i < postPollKey.length ; i++)
                // {   
                //     // if(postPollKey[i].poll_click_flag == "true" && postPollKey[i].poll_answer == "0" )
                //     // {
                //         // if (postPollKey[i].poll_click_flag == "true" ) {
                //         //     result = true;
                //         //     // if(postPollKey[i].poll_answer == '1' )
                //         //     // {
                //         //     //     // console.log('poll_key',postPollKey[i].poll_key);
                //         //     //     postPollKey[i].poll_click_flag =  "true";
                //         //     // }
                //         //     break;
                //         // }

                //         if(postPollKey[i].poll_answer == '1' )
                //         {
                //             // console.log('poll_key',postPollKey[i].poll_key);
                //             postPollKey[i].poll_click_flag = "true";
                //         }
                //     // }
                //     // if(result == true)
                //     // {
                //     //     if(postPollKey[i].poll_answer == '1' )
                //     //     {
                //     //         // console.log('poll_key',postPollKey[i].poll_key);
                //     //         postPollKey[i].poll_click_flag =  "true";
                //     //     }
                //     // }
                // }
                
                // console.log('fsfdfddf',result);
                var setPostDate = moment(announcement.created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a');
                
                //-------------------Poll Length Logic-------------------------//
                // moment(postPollKey[0].poll_length, "DD-MM-YYYY hh:mm").format('DD MMM YYYY hh:mm')
                // var currDate = moment().format('YYYY-MM-DD hh:mm')
                // if(announcement.post_type == 2 && currDate <= postPollKey[0].poll_length)
                // {
                //     console.log('a');
                // }else{
                //     console.log('b');
                //     //Set Code Here
                // }
                // console.log('currDate',currDate );
                // console.log('postPollKey[0].poll_length ',postPollKey[0].poll_length );
                //-------------------Poll Length Logic Over-------------------------//
                
                var curr_time = moment().format('YYYY-MM-DD HH:mm');
                
                if(curr_time <= moment(announcement.poll_length,'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm'))
                {
                    var poll_len = moment(announcement.poll_length,'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');

                    console.log('---------------------------------------');
                    var a = moment(curr_time);//now
                    var b = moment(poll_len);
                    console.log('id ',announcement.post_id) // 44700
                    var days = b.diff(a, 'days');
                    var hours = b.diff(a, 'hours');
                    var min = b.diff(a, 'minutes');
                    
                    // console.log(a.diff(b, 'weeks')) // 4
                    var set_value = days+':'+hours+':'+min;
                    console.log('set_value',set_value);
                    console.log('-------------*********------------------');

                var postData = {
                    "post_id": announcement.post_id,
                    "mosque_id": announcement.mosque_id,
                    "mosque_name": announcement.mosque_name,
                    "first_name": announcement.first_name,
                    "last_name": announcement.last_name,
                    "profile_photo": announcement.profile_photo,
                    "post_type": announcement.post_type,
                    "post_in": announcement.post_in,
                    "description": announcement.description,
                    "status": announcement.status,
                    "is_likes": (announcement.post_like_id)?true:false,
                    "total_like": likes[0].total_like,
                    "is_comments": (announcement.post_comment_id)?true:false,
                    "total_comments": comments[0].total_comment,
                    "files": postFiles,
                    "PollKey": postPollKey,
                    "Poll_length":(announcement.post_type == 2)? announcement.poll_length:'',
                    // "post_date_time": announcement.created_at,
                    "post_date_time": setPostDate,
                };
                response.push(postData);
                }
            }, err => {
                if (err) console.error(err.message);

                var query_text = `SELECT post.id as post_id,post.type as post_type,post.description,post.status,DATE_FORMAT(post.created_at,'%d %m %Y,%H:%i:%s') AS created_at,users.id as mosque_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,post_like.id as post_like_id,post_comment.id as post_comment_id FROM mosque_announcements as post LEFT JOIN users ON post.mosque_id = users.id LEFT JOIN mosque_announcement_likes as post_like ON post.id = post_like.post_id AND post_like.user_id = '${user_id}' LEFT JOIN mosque_announcement_comments as post_comment ON post.id = post_comment.post_id AND post_comment.user_id = '${user_id}' WHERE mosque_id = '${mosque_id}' group by post_id order by post_id DESC;`;
                // console.log('gd',query_text);
                sql.query(query_text, [], function(err, res) {
                    if(err) {
                        console.log("error: ", err);
                        result(err, null);
                    }

                    var total = res.length;
                    if(last_id > total) {
                        last_id = total;
                    }

                    var nextInfo = {
                        'total': total,
                        'next_id': last_id
                    }
                    // console.log('nextInfo',nextInfo);
                    next_arr.push(nextInfo);
                    
                    response_arr['success'] = 1;
                    response_arr['msg'] = `Get Announcement data Successfully!`;
                    response_arr['data'] = shuffle(response);
                    response_arr['next']    = nextInfo;
                    result(null, response_arr);
                    
                });

               
            });
            
           
        });
    }
}

Model.getPollAnswerModel = async function getPollAnswerModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];

    var post_id = (param.post_id) ? param.post_id : '';
    console.log('Get Poll Answer : ',param);
    if(!post_id)
    {
        response_arr['msg'] = `Post Id is require!`;
        result(null, response_arr);        
    }else{
        
        var chk_PostId =  await helper.sql_query(sql, `SELECT id FROM mosque_announcements WHERE type = '2' AND id = '${post_id}'`).catch(console.log);
        if(chk_PostId)
        {
            query_text = `SELECT * FROM mosque_announcement_polls WHERE announcement_id = '${post_id}' order by id ASC`;
            var q = sql.query(query_text, function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                if(res.length > 0)
                {            
                    async.forEachOf(res, async (poll, key, callback) => {
                        var pollData = {
                            "poll_id": poll.id,
                            "poll_keys": poll.poll_keys,
                            "poll_answer": poll.poll_answer,
                            // "poll_answer": (poll.poll_answer == 1)?true:false,
                            "created_at": poll.created_at,
                        };
                        response.push(pollData);
                    }, err => {
                        if (err) console.error(err.message);
                        response_arr['success'] = 1;
                        response_arr['msg'] = `Get Poll data Successfully!`;
                        response_arr['data'] = response;
                        result(null, response_arr);
                    })
                }else{
                    response_arr['msg'] = `can't get theme data!`;
                    result(null, response_arr);
                }
            });
        }else{
            response_arr['msg'] = `Post is not a Poll!`;
            result(null, response_arr);
        }
    }
}

Model.getAnnouncementDetailModel = async function getAnnouncementDetailModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var query_param = req.query;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];

    // var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    // var user_id = (param.user_id) ? param.user_id : mosque_id;  
    // var post_id = (param.post_id) ? param.post_id : ''; 

    var mosque_id = (query_param.mosque_id) ? query_param.mosque_id : '';
    var user_id = (query_param.user_id) ? query_param.user_id : mosque_id;  
    var post_id = (query_param.post_id) ? query_param.post_id : ''; 
	var file_id = (query_param.file_id) ? query_param.file_id : ''; 
    

    console.log('Get Announcement Detail : ',query_param);
    if(!mosque_id)
    {
        response_arr['msg'] = "mosque id is Required";
        result(null, response_arr);
    }else{
        query_text = `SELECT post.id as post_id,post.type as post_type,post.post_in,post.description,post.status,DATE_FORMAT(post.created_at,'%d %m %Y,%H:%i:%s') AS created_at,users.id as mosque_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,post_like.id as post_like_id,post_comment.id as post_comment_id FROM mosque_announcements as post LEFT JOIN users ON post.mosque_id = users.id LEFT JOIN mosque_announcement_likes as post_like ON post.id = post_like.post_id AND post_like.user_id = '${user_id}' LEFT JOIN mosque_announcement_comments as post_comment ON post.id = post_comment.post_id AND post_comment.user_id = '${user_id}' WHERE mosque_id = '${mosque_id}' AND post.id = '${post_id}' group by post_id order by post_id DESC `;
        var q = sql.query(query_text,async function (err, announcement) {
            console.log('announcementList',announcement[0]);
            if(announcement.length > 0)
            {
                // var getPostFile = '';
                if(file_id)
                {
                    var postFiles =  await helper.sql_query(sql, `SELECT post_file.id,CASE WHEN post_file.file!='' THEN CONCAT('${fullUrl}/posts/',post_file.file) ELSE '' END AS file,CASE WHEN video_thumbnail!='' THEN CONCAT('${fullUrl}/posts/',video_thumbnail) ELSE '' END AS video_thumbnail, DATE_FORMAT(post_file.created_at,'%d %m %Y,%H:%i:%s') AS created_at, post_file_like.id as post_file_like_id, post_file_comment.id as post_file_comment_id FROM mosque_announcement_images as post_file LEFT JOIN mosque_announcement_file_likes as post_file_like ON post_file.id = post_file_like.post_file_id AND post_file_like.user_id = '${user_id}' LEFT JOIN mosque_announcement_file_comments as post_file_comment ON post_file.id = post_file_comment.post_file_id AND post_file_comment.user_id = '${user_id}' WHERE post_file.announcement_id = '${announcement[0].post_id}' AND post_file.id='${file_id}' order by post_file.id ASC `).catch(console.log);
                }else{
                    var postFiles =  await helper.sql_query(sql, `SELECT post_file.id,CASE WHEN post_file.file!='' THEN CONCAT('${fullUrl}/posts/',post_file.file) ELSE '' END AS file,CASE WHEN video_thumbnail!='' THEN CONCAT('${fullUrl}/posts/',video_thumbnail) ELSE '' END AS video_thumbnail, DATE_FORMAT(post_file.created_at,'%d %m %Y,%H:%i:%s') AS created_at, post_file_like.id as post_file_like_id, post_file_comment.id as post_file_comment_id FROM mosque_announcement_images as post_file LEFT JOIN mosque_announcement_file_likes as post_file_like ON post_file.id = post_file_like.post_file_id AND post_file_like.user_id = '${user_id}' LEFT JOIN mosque_announcement_file_comments as post_file_comment ON post_file.id = post_file_comment.post_file_id AND post_file_comment.user_id = '${user_id}' WHERE post_file.announcement_id = '${announcement[0].post_id}' order by post_file.id ASC `).catch(console.log);
                }
                async.forEachOf(postFiles, async (file, key, callback) => {
                    var file_likes =  await helper.sql_query(sql, `SELECT count(id) as total_like FROM mosque_announcement_file_likes WHERE post_id = '${announcement[0].post_id}' and post_file_id = '${file.id}' `).catch(console.log);
                    var file_comments =  await helper.sql_query(sql, `SELECT count(id) as total_comment FROM mosque_announcement_file_comments WHERE post_id = '${announcement[0].post_id}' and post_file_id = '${file.id}' `).catch(console.log);
                    var getPostFile = {
                        'id': file.id,
                        'file': file.file,
                        'video_thumbnail': file.video_thumbnail,
                        'is_file_likes': (file.post_file_like_id)?true:false,
                        'total_file_like': file_likes[0].total_like,
                        'is_file_comments': (file.post_file_comment_id)?true:false,
                        "total_file_comments": file_comments[0].total_comment,
                        'created_at': moment(file.created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a'),
                    }
                     response.push(getPostFile);
                });
                var likes =  await helper.sql_query(sql, `SELECT count(id) as total_like FROM mosque_announcement_likes WHERE post_id = '${announcement[0].post_id}'`).catch(console.log);
                
                var comments =  await helper.sql_query(sql, `SELECT count(id) as total_comment FROM mosque_announcement_comments WHERE post_id = '${announcement[0].post_id}'`).catch(console.log);
                
                var postPollKey =  await helper.sql_query(sql, `SELECT polls.id, polls.poll_keys,polls.poll_answer, DATE_FORMAT(polls.created_at,'%d-%m-%Y,%H:%i:%s') AS created_at,IF(poll_visitor.poll_click_id = polls.id, "true", "false") as poll_click_flag FROM mosque_announcement_polls as polls LEFT JOIN mosque_announcement_poll_visitor as poll_visitor ON polls.id  = poll_visitor.poll_click_id AND poll_visitor.user_id = '${user_id}' WHERE polls.announcement_id = '${announcement[0].post_id}' order by polls.id ASC `).catch(console.log);

                var setPostDate = moment(announcement[0].created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a');
                var postData = [{
                    "post_id": announcement[0].post_id,
                    "mosque_id": announcement[0].mosque_id,
                    "mosque_name": announcement[0].mosque_name,
                    "first_name": announcement[0].first_name,
                    "last_name": announcement[0].last_name,
                    "profile_photo": announcement[0].profile_photo,
                    "post_type": announcement[0].post_type,
                    "post_in": announcement[0].post_in,
                    "description": announcement[0].description,
                    "status": announcement[0].status,
                    "is_likes": (announcement[0].post_like_id)?true:false,
                    "total_like": likes[0].total_like,
                    "is_comments": (announcement[0].post_comment_id)?true:false,
                    "total_comments": comments[0].total_comment,
                    "files": response,
                    "PollKey": postPollKey,
                    // "post_date_time": announcement.created_at,
                    "post_date_time": setPostDate,
                }];
                // response.push(postData);

                response_arr['success'] = 1;
                response_arr['msg'] = `Get Announcement data Successfully!`;
                response_arr['data'] = postData;
                result(null, response_arr);
                
            }else{
                response_arr['msg'] = `Announcement data not found.`;
                result(null, response_arr);
            }      
        });
    }
}

Model.getAnnouncementImageModel = async function getAnnouncementImageModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var query_param = req.query;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];

    var mosque_id = (query_param.mosque_id) ? query_param.mosque_id : '';
    var user_id = (query_param.user_id) ? query_param.user_id : mosque_id;  

    var post_id = (query_param.post_id) ? query_param.post_id : ''; 
    var file_id = (query_param.file_id) ? query_param.file_id : ''; 
    

    console.log('Get Announcement File : ',query_param);
    if(!mosque_id)
    {
        response_arr['msg'] = "mosque id is Required";
        result(null, response_arr);
    }else{
            var postFiles =  await helper.sql_query(sql, `SELECT post_file.id,CASE WHEN post_file.file!='' THEN CONCAT('${fullUrl}/posts/',post_file.file) ELSE '' END AS file,CASE WHEN video_thumbnail!='' THEN CONCAT('${fullUrl}/posts/',video_thumbnail) ELSE '' END AS video_thumbnail, DATE_FORMAT(post_file.created_at,'%d %m %Y,%H:%i:%s') AS created_at, post_file_like.id as post_file_like_id, post_file_comment.id as post_file_comment_id FROM mosque_announcement_images as post_file LEFT JOIN mosque_announcement_file_likes as post_file_like ON post_file.id = post_file_like.post_file_id AND post_file_like.user_id = '${user_id}' LEFT JOIN mosque_announcement_file_comments as post_file_comment ON post_file.id = post_file_comment.post_file_id AND post_file_comment.user_id = '${user_id}' WHERE post_file.announcement_id = '${post_id}' AND post_file.id = '${file_id}' order by post_file.id ASC `).catch(console.log);
            
                if(postFiles.length > 0)
                {
                    console.log('postFiles',postFiles);
                    var file_likes =  await helper.sql_query(sql, `SELECT count(id) as total_like FROM mosque_announcement_file_likes WHERE post_id = '${post_id}' and post_file_id = '${file_id}' `).catch(console.log);
                    var file_comments =  await helper.sql_query(sql, `SELECT count(id) as total_comment FROM mosque_announcement_file_comments WHERE post_id = '${post_id}' and post_file_id = '${file_id}' `).catch(console.log);
                    var getPostFile = {
                        'id': postFiles[0].id,
                        'post_id': parseInt(post_id),
                        'file': postFiles[0].file,
                        'video_thumbnail': postFiles[0].video_thumbnail,
                        'is_file_likes': (postFiles[0].post_file_like_id)?true:false,
                        'total_file_like': file_likes[0].total_like,
                        'is_file_comments': (postFiles[0].post_file_comment_id)?true:false,
                        "total_file_comments": file_comments[0].total_comment,
                        'created_at': moment(postFiles[0].created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a'),
                    }
                     response.push(getPostFile);
                
                    // console.log('response',response);
                response_arr['success'] = 1;
                response_arr['msg'] = `Get Announcement File data Successfully!`;
                response_arr['data'] = response;
                result(null, response_arr);
                }
                
    }
}

Model.deleteAnnouncementModel = async function deleteAnnouncementModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];
    var delete_type = (param.delete_type) ? param.delete_type : 1;     // 1 = Post Delete , 2 = Post File Delete.     
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var post_id = (param.post_id) ? param.post_id : '';
    var postFile_id = (param.postFile_id) ? param.postFile_id : '';
    
    console.log('Delete Announcement : ',param);
    if(!mosque_id)
    {
        response_arr['msg'] = "mosque id is Required";
        result(null, response_arr);
    }else{
        if(delete_type == 1)
        {
            query_text = `DELETE FROM mosque_announcements WHERE id='${post_id}' AND mosque_id = '${mosque_id}' `;
            var q = sql.query(query_text,async function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                console.log('res',res);
                if(res.affectedRows > 0)
                {            
                    await helper.sql_query(sql, `DELETE FROM mosque_announcement_likes WHERE post_id = '${post_id}'`).catch(console.log);
                    await helper.sql_query(sql, `DELETE FROM mosque_announcement_comments WHERE post_id = '${post_id}'`).catch(console.log);
                    await helper.sql_query(sql, `DELETE FROM mosque_announcement_comment_replys WHERE post_id = '${post_id}'`).catch(console.log);
    
                    var getFiles =  await helper.sql_query(sql, `SELECT * FROM mosque_announcement_images WHERE announcement_id = '${post_id}'`).catch(console.log);  
                    for(var i=0; i < getFiles.length ; i++)
                    {
                        var postFiles = getFiles[i].file;
                        var postFiles_id = getFiles[i].id;
                        
                            if (postFiles != '') {
                                var fs = require('fs');
                                var filePath = './public/posts/' + postFiles;
                                try {
                                    if (fs.existsSync(filePath)) {
                                        fs.unlinkSync(filePath);
                                    } else {
                                        console.log("File does not exist.")
                                    }
                                } catch (err) {
                                    console.error(err)
                                }
                            }
                        
                        var postFiles =  await helper.sql_query(sql, `DELETE FROM mosque_announcement_images WHERE id = '${postFiles_id}'`).catch(console.log);
                        await helper.sql_query(sql, `DELETE FROM mosque_announcement_file_likes WHERE post_id = '${post_id}'`).catch(console.log);
                        
                    }
    
                    response_arr['success'] = 1;
                    response_arr['msg'] = `Delete Announcement data Successfully!`;
                    result(null, response_arr);
                }else{
                    response_arr['msg'] = `can't Delete announcement data!`;
                    result(null, response_arr);
                }
            });
        }else{ 
            var getFiles =  await helper.sql_query(sql, `SELECT * FROM mosque_announcement_images WHERE announcement_id = '${post_id}' AND id='${postFile_id}' `).catch(console.log);
            console.log('getFiles',getFiles);
                if(getFiles.length > 0)
                {
                    var postFiles = getFiles[0].file;
                    var postFiles_id = getFiles[0].id;
                    
                        if (postFiles != '') {
                            var fs = require('fs');
                            var filePath = './public/posts/' + postFiles;
                            try {
                                if (fs.existsSync(filePath)) {
                                    fs.unlinkSync(filePath);
                                } else {
                                    console.log("File does not exist.")
                                }
                            } catch (err) {
                                console.error(err)
                            }
                        }
                    
                    var postFiles =  await helper.sql_query(sql, `DELETE FROM mosque_announcement_images WHERE id = '${postFiles_id}'`).catch(console.log);
                    await helper.sql_query(sql, `DELETE FROM mosque_announcement_file_likes WHERE post_id = '${post_id}'`).catch(console.log);
                }else{
                    response_arr['msg'] = `Data not found!`;
                    result(null, response_arr);
                }
            }

            response_arr['success'] = 1;
            response_arr['msg'] = `Delete data Successfully!`;
            result(null, response_arr);
        }

    // }
}

Model.getNotificationsModel = async function getNotificationsModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;

    var response_arr = [];
    var mosque_id = (param.mosque_id) ? param.mosque_id : 0;
    var noti_type = (param.noti_type) ? param.noti_type : 0;

    var next_id = (param.next_id) ? param.next_id : 0;
	var last_id = parseInt(next_id) + 20;

    var next_arr = [];

    // var get_notification = await helper.sql_query(sql, `SELECT * FROM notifications WHERE user_id = '${user_id}'`).catch(console.log);
    // async.forEachOf(get_notification,async (notification, key, callback) => {    
    //     console.log('get_notification',notification.activity);
    var query_text = `SELECT notifications.*,Cast(notifications.from_id as int) as from_id 
    ,DATE_FORMAT(notifications.created_at,'%Y-%m-%d %H:%i:%s') as created_at,users.first_name,users.last_name,CASE WHEN profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',profile_photo) ELSE '' END AS profile_photo,notifications.post_id as post_id , post.type as post_type, post.description as post_description ,notifications.feed_id, feed.title as feed_title ,feed.description as feed_description FROM notifications 
    LEFT JOIN users ON users.id = notifications.from_id LEFT JOIN mosque_announcements as post ON notifications.post_id = post.id 
    LEFT JOIN mosque_pro_feed as feed ON notifications.feed_id = feed.id AND notifications.from_id = feed.mosque_id
    WHERE notifications.user_id = '${mosque_id}' AND noti_type = '${noti_type}' ORDER BY notifications.created_at DESC LIMIT 20 OFFSET ${parseInt(next_id)};`;

    // Update as Read Notification
    await helper.sql_query(sql, `UPDATE notifications SET is_read = 1 WHERE noti_type = '${noti_type}' AND notifications.user_id = '${mosque_id}'`).catch(console.log);

    var q = sql.query(query_text, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        var response = [];
        async.forEachOf(res,async (noti, key, callback) => {
            if(noti.post_type == null)
            {
                noti.post_type = 0;
            }
            if(noti.post_description == null)
            {
                noti.post_description = '';
            }
            
            if(noti.feed_title == null)
            {
                noti.feed_title = '';
            }
            if(noti.feed_description == null)
            {
                noti.feed_description = '';
            }

            var get_time_ago = moment(noti.created_at).fromNow(true);
            // Replace ago word
            time_ago_arr = get_time_ago.split(" ");

            var numeric_val = (time_ago_arr && time_ago_arr[0]) ? time_ago_arr[0] : '';
            var time_string = (time_ago_arr && time_ago_arr[1]) ? time_ago_arr[1] : '';

            var new_time_string = '';

            console.log('time_string',time_string);
            if (get_time_ago == 'a few seconds') {
                new_time_string = 'now';
            }
            else if (get_time_ago == 'a minute') {
                new_time_string = '1 min';
            }
            else if (get_time_ago == 'an hour') {
                new_time_string = '1 hr';
            }
            else if (get_time_ago == 'a day') {
                new_time_string = '1 d';
            }
            else if (get_time_ago == 'a month') {
                new_time_string = '1 m';
            }
            else if (get_time_ago == 'a year') {
                new_time_string = '1 y';
            }
            else if (get_time_ago == 'a week') {
                new_time_string = '1 w';
            }
            else {
                switch (time_string) {

                    case "years":
                        new_time_string = `${numeric_val} y`;
                        break;
                    case "months":
                        new_time_string = `${numeric_val} m`;
                        break;
                    case "weeks":
                        new_time_string = `${numeric_val} w`;
                        break;
                    case "days":
                        new_time_string = `${numeric_val} d`;
                        break;
                    case "hours":
                        new_time_string = `${numeric_val} hr`;
                        break;
                    case "minutes":
                        new_time_string = `${numeric_val} min`;
                        break;
                    case "seconds":
                        new_time_string = `${numeric_val} s`;
                        break;
                    default:
                        new_time_string = get_time_ago;
                }
            }
            noti.time_ago = new_time_string;
            // if(noti.post_type !='')
            // {
                // var postFiles =  await helper.sql_query(sql, `SELECT id,CASE WHEN file!='' THEN CONCAT('${fullUrl}/posts/',file) ELSE '' END AS file, created_at FROM mosque_announcement_images WHERE announcement_id = '${noti.post_id}'`).catch(console.log);
            // }else{
            //     var postFiles = [];
            // }
            // console.log('postFiles',postFiles);

            // noti.post_file = postFiles;
            
            response.push(noti)
        }, err => {
            if (err) console.error(err.message);

            var query_text3 = `SELECT notifications.*,Cast(notifications.from_id as int) as from_id 
            ,DATE_FORMAT(notifications.created_at,'%Y-%m-%d %H:%i:%s') as created_at,users.first_name,users.last_name,CASE WHEN profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',profile_photo) ELSE '' END AS profile_photo,notifications.post_id as post_id , post.type as post_type, post.description as post_description ,notifications.feed_id, feed.title as feed_title ,feed.description as feed_description FROM notifications 
            LEFT JOIN users ON users.id = notifications.from_id LEFT JOIN mosque_announcements as post ON notifications.post_id = post.id 
            LEFT JOIN mosque_pro_feed as feed ON notifications.feed_id = feed.id AND notifications.from_id = feed.mosque_id
            WHERE notifications.user_id = '${mosque_id}' AND noti_type = '${noti_type}' ORDER BY notifications.created_at DESC `;
            sql.query(query_text3, function(err, res) {
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }

                var total = res.length;
                if(last_id > total) {
                    last_id = total;
                }

                var nextInfo = {
                    'total': total,
                    'next_id': last_id
                }
                next_arr.push(nextInfo);

                response_arr['success'] = 1;
                response_arr['msg'] = 'Notification get successfully.';
                response_arr['record'] = response;
                response_arr['next']    = nextInfo;
                result(null, response_arr);
            });
        });
    });
    // });
};

Model.notificationCounterModel = async function notificationCounterModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var user_id = (param.mosque_id) ? param.mosque_id : '';

    var chk_user =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}' AND users.soft_delete = '0'`).catch(console.log);

        if(chk_user == '')
        {
            response_arr['msg'] = "User not found.";
            result(null, response_arr);
        }

    var DonationNotificationCount =  await helper.sql_query(sql, `SELECT count(id) as counter FROM notifications WHERE  user_id = '${user_id}' AND is_read ='0' AND noti_type = '1' `).catch(console.log);
    var OrderNotificationCount =  await helper.sql_query(sql, `SELECT count(id) as counter FROM notifications WHERE  user_id = '${user_id}' AND is_read ='0' AND noti_type = '2' `).catch(console.log);
    var PostNotificationCount =  await helper.sql_query(sql, `SELECT count(id) as counter FROM notifications WHERE  user_id = '${user_id}' AND is_read ='0' AND noti_type = '3' `).catch(console.log);
    var VotingPollNotificationCount =  await helper.sql_query(sql, `SELECT count(id) as counter FROM notifications WHERE  user_id = '${user_id}' AND is_read ='0' AND noti_type = '4' `).catch(console.log);
    // var VotingPollNotificationCount =  await helper.sql_query(sql, `SELECT count(id) as counter FROM notifications WHERE  user_id = '${user_id}' AND is_read ='0' `).catch(console.log);
    var counter = {
        "DonationNotificationCount":DonationNotificationCount[0].counter,
        "OrderNotificationCount":OrderNotificationCount[0].counter,
        "PostNotificationCount":PostNotificationCount[0].counter,
        "VotingPollNotificationCount":VotingPollNotificationCount[0].counter,
    };
    response_arr['success'] = 1;
    response_arr['msg'] = `Mosque Get Counter Successfully!`;
    response_arr['data'] = counter;
    result(null, response_arr);

};

// -------------------- Public API ---------------------------//
Model.setDefaultMosqueModel = async function setDefaultMosqueModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var user_id = (param.user_id) ? param.user_id : '';
    
    var getdefaultMosqueData =  await helper.sql_query(sql, `SELECT id,user_id,mosque_id,is_default, created_at, updated_at FROM user_journey WHERE user_id = '${user_id}' AND mosque_id = '${mosque_id}'  `).catch(console.log);
        if(getdefaultMosqueData == '')
        {
            // var unsetDefault =  await helper.sql_query(sql, `UPDATE user_journey SET is_default = '0'  WHERE user_id = '${user_id}' AND mosque_id != '${mosque_id}' `).catch(console.log);
            var unsetDefault =  await helper.sql_query(sql, `DELETE FROM user_journey WHERE is_default = '1' AND user_id = '${user_id}' AND mosque_id != '${mosque_id}' `).catch(console.log);
            
            var getdefaultMosqueData =  await helper.sql_query(sql, `INSERT INTO user_journey(user_id,mosque_id,is_default,created_at) VALUES('${user_id}','${mosque_id}','1','${today}') `).catch(console.log);

            response_arr['success'] = 1;
            response_arr['msg'] = "Set new Mosque Default ";
            // response_arr['data'] = response;
            result(null, response_arr);
        }else{
            var chk_defaultData =  await helper.sql_query(sql, `SELECT * FROM user_journey WHERE user_id = '${user_id}' AND mosque_id = '${mosque_id}' AND is_default = '1' `).catch(console.log);

            if(chk_defaultData == '')
            {
                // var unsetDefault =  await helper.sql_query(sql, `UPDATE user_journey SET is_default = '0'  WHERE user_id = '${user_id}' AND mosque_id != '${mosque_id}' `).catch(console.log);
                var unsetDefault =  await helper.sql_query(sql, `DELETE FROM user_journey WHERE is_default = '1' AND user_id = '${user_id}' AND mosque_id != '${mosque_id}' `).catch(console.log);
                // console.log('unsetDefault',unsetDefault);
                var setdefaultMosque =  await helper.sql_query(sql, `UPDATE user_journey SET is_default = '1' ,updated_at = '${today}' WHERE user_id = '${user_id}' AND mosque_id = '${mosque_id}' `).catch(console.log);
                // console.log('setdefaultMosque',setdefaultMosque);
                
                response_arr['success'] = 1;
                response_arr['msg'] = "default mosque Data Updated";
                // response_arr['data'] = response;
                result(null, response_arr);
            }else{
                response_arr['success'] = 1;
                response_arr['msg'] = "Already Data Updated ";
                // response_arr['data'] = response;
                result(null, response_arr);
            }
        }
};

Model.mosqueListModel = function mosqueListModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var response_arr = [];

    var user_id = (param.user_id) ? param.user_id : '';
    var keyword = (param.keyword) ? param.keyword : '';

    var longitude = (param.longitude) ? param.longitude : '';
    var latitude = (param.latitude) ? param.latitude : '';
    var distance_in_km = (param.distance_in_km) ? param.distance_in_km : 50;

    var address1 = (param.address1) ? param.address1 : '';
    var address2 = (param.address2) ? param.address2 : '';
    var post_code = (param.post_code) ? param.post_code : '';

    var next_id = (param.next_id) ? param.next_id : 0;
	var last_id = parseInt(next_id) + 20;

    var next_arr = [];

    console.log(`Mosque List : ${JSON.stringify(param)}`);

        var dataArray = [];
        var having_text = (distance_in_km) ? ` HAVING distance_in_km <= ${distance_in_km}` : '';
        if(keyword == '')
        {
            if(longitude == '' || latitude == '')
            {
                // users.longitude, users.latitude,
                checkContact = `SELECT users.id, users.user_role, users.mosque_name, users.first_name, users.last_name, users.address, CASE WHEN users.cover_photo!='' THEN CONCAT('${fullUrl}/uploadsCoverPhoto/',users.cover_photo) ELSE '' END AS cover_photo, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,uj.is_default FROM users LEFT JOIN user_journey as uj ON uj.mosque_id = users.id AND uj.is_default = '1' AND uj.user_id = '${user_id}' WHERE users.soft_delete = 0 AND users.status = 0 AND (users.user_role = 2 OR users.user_role = 3 ) order by users.mosque_name ASC LIMIT 20 OFFSET ${parseInt(next_id)};`;
            }else{
                checkContact = `SELECT users.id, users.user_role, users.mosque_name, users.first_name, users.last_name, users.address, users.longitude, users.latitude,CASE WHEN users.cover_photo!='' THEN CONCAT('${fullUrl}/uploadsCoverPhoto/',users.cover_photo) ELSE '' END AS cover_photo, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,uj.is_default, 111.045 * DEGREES(ACOS(COS(RADIANS((${latitude}))) * COS(RADIANS(users.latitude)) * COS(RADIANS(users.longitude) - RADIANS((${longitude}))) + SIN(RADIANS((${latitude}))) * SIN(RADIANS(users.latitude)))) AS distance_in_km FROM users LEFT JOIN user_journey as uj ON uj.mosque_id = users.id AND uj.is_default = '1' AND uj.user_id = '${user_id}' WHERE users.soft_delete = 0 AND users.status = 0 AND (users.user_role = 2 OR users.user_role = 3 ) ${having_text} order by users.mosque_name ASC LIMIT 20 OFFSET ${parseInt(next_id)};`;
            }
        }else{
            if(longitude == '' || latitude == '')
            {
                //, users.longitude, users.latitude
                checkContact = `SELECT users.id, users.user_role, users.mosque_name, users.first_name, users.last_name, users.address,CASE WHEN users.cover_photo!='' THEN CONCAT('${fullUrl}/uploadsCoverPhoto/',users.cover_photo) ELSE '' END AS cover_photo, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,uj.is_default FROM users LEFT JOIN user_journey as uj ON uj.mosque_id = users.id AND uj.is_default = '1' AND uj.user_id = '${user_id}' WHERE users.soft_delete = 0 AND users.status = 0 AND (users.user_role = 2 OR users.user_role = 3 )  and ( users.mosque_name LIKE '%${keyword}%' OR users.first_name LIKE '%${keyword}%' OR users.last_name LIKE '%${keyword}%' ) order by users.mosque_name ASC LIMIT 20 OFFSET ${parseInt(next_id)};`;
            }else{
                checkContact = `SELECT users.id, users.user_role, users.mosque_name, users.first_name, users.last_name, users.address, users.longitude, users.latitude,CASE WHEN users.cover_photo!='' THEN CONCAT('${fullUrl}/uploadsCoverPhoto/',users.cover_photo) ELSE '' END AS cover_photo, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,uj.is_default, 111.045 * DEGREES(ACOS(COS(RADIANS((${latitude}))) * COS(RADIANS(users.latitude)) * COS(RADIANS(users.longitude) - RADIANS((${longitude}))) + SIN(RADIANS((${latitude}))) * SIN(RADIANS(users.latitude)))) AS distance_in_km FROM users LEFT JOIN user_journey as uj ON uj.mosque_id = users.id AND uj.is_default = '1' AND uj.user_id = '${user_id}' WHERE users.soft_delete = 0 AND users.status = 0 AND (users.user_role = 2 OR users.user_role = 3 )  and ( users.mosque_name LIKE '%${keyword}%' OR users.first_name LIKE '%${keyword}%' OR users.last_name LIKE '%${keyword}%' ) ${having_text} order by users.mosque_name ASC LIMIT 20 OFFSET ${parseInt(next_id)};`;
            }
        }
        //SELECT users.id, users.user_role, users.mosque_name, users.first_name, users.last_name, users.email, users.country_code, users.mobile_no, users.address, users.longitude, users.latitude, CASE WHEN users.cover_photo!='' THEN CONCAT('${fullUrl}/uploadsCoverPhoto/',users.cover_photo) ELSE '' END AS cover_photo, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo, users.description,journey.is_default FROM users LEFT JOIN user_journey as journey ON journey.user_id = '${user_id}' AND journey.mosque_id = users.id WHERE users.soft_delete = 0 AND users.status = 0 AND users.id = '${mosque_id}'  order by users.mosque_name ASC
        // console.log('query:', checkContact);
        sql.query(checkContact, function (err, resData) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            if (resData) {
                // console.log(resData);
                for(var i = 0; i < resData.length; ++i){
                    if(resData[i].is_default != null && resData[i].is_default == 1)
                    {
                        resData[i].is_default = true;
                    }else{
                        resData[i].is_default = false;
                    }
                    // console.log('log',resData[i].longitude == null);
                    if(resData[i].longitude == null )
                    {
                        resData[i].longitude = '';
                    }
                    if(resData[i].latitude == null)
                    {
                        resData[i].latitude = '';
                    }
                    if(resData[i].longitude == '' && resData[i].latitude == '')
                    {
                        resData[i].distance_in_km = 0;
                    }
                }
                

                if(keyword == '')
                {
                    if(longitude == '' || latitude == '')
                    {
                        query_text = `SELECT users.id, users.user_role, users.mosque_name, users.first_name, users.last_name, users.address, users.longitude, users.latitude, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,uj.is_default FROM users LEFT JOIN user_journey as uj ON uj.mosque_id = users.id AND uj.is_default = '1' AND uj.user_id = '${user_id}' WHERE users.soft_delete = 0 AND users.status = 0 AND (users.user_role = 2 OR users.user_role = 3 ) order by users.mosque_name ASC`;
                    }else{
                        query_text = `SELECT users.id, users.user_role, users.mosque_name, users.first_name, users.last_name, users.address, users.longitude, users.latitude, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,uj.is_default, 111.045 * DEGREES(ACOS(COS(RADIANS((${latitude}))) * COS(RADIANS(users.latitude)) * COS(RADIANS(users.longitude) - RADIANS((${longitude}))) + SIN(RADIANS((${latitude}))) * SIN(RADIANS(users.latitude)))) AS distance_in_km FROM users LEFT JOIN user_journey as uj ON uj.mosque_id = users.id AND uj.is_default = '1' AND uj.user_id = '${user_id}' WHERE users.soft_delete = 0 AND users.status = 0 AND (users.user_role = 2 OR users.user_role = 3 ) ${having_text} order by users.mosque_name ASC;`;
                    }
                }else{
                    if(longitude == '' || latitude == '')
                    {
                        query_text = `SELECT users.id, users.user_role, users.mosque_name, users.first_name, users.last_name, users.address, users.longitude, users.latitude, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,uj.is_default FROM users LEFT JOIN user_journey as uj ON uj.mosque_id = users.id AND uj.is_default = '1' AND uj.user_id = '${user_id}' WHERE users.soft_delete = 0 AND users.status = 0 AND (users.user_role = 2 OR users.user_role = 3 )  and ( users.mosque_name LIKE '%${keyword}%' OR users.first_name LIKE '%${keyword}%' OR users.last_name LIKE '%${keyword}%' ) order by users.mosque_name ASC `;
                    }else{
                        query_text = `SELECT users.id, users.user_role, users.mosque_name, users.first_name, users.last_name, users.address, users.longitude, users.latitude, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,uj.is_default, 111.045 * DEGREES(ACOS(COS(RADIANS((${latitude}))) * COS(RADIANS(users.latitude)) * COS(RADIANS(users.longitude) - RADIANS((${longitude}))) + SIN(RADIANS((${latitude}))) * SIN(RADIANS(users.latitude)))) AS distance_in_km FROM users LEFT JOIN user_journey as uj ON uj.mosque_id = users.id AND uj.is_default = '1' AND uj.user_id = '${user_id}' WHERE users.soft_delete = 0 AND users.status = 0 AND (users.user_role = 2 OR users.user_role = 3 )  and ( users.mosque_name LIKE '%${keyword}%' OR users.first_name LIKE '%${keyword}%' OR users.last_name LIKE '%${keyword}%' ) ${having_text} order by users.mosque_name ASC;`;
                    }
                }
                // console.log('gd',query_text);
                sql.query(query_text, [], function(err, res) {
                    if(err) {
                        console.log("error: ", err);
                        result(err, null);
                    }

                    var total = res.length;
                    if(last_id > total) {
                        last_id = total;
                    }

                    var nextInfo = {
                        'total': total,
                        'next_id': last_id
                    }
                    next_arr.push(nextInfo);

                    response_arr['success'] = 1;
                    response_arr['msg'] = "Get Mosque List successfully.";
                    response_arr['data'] = resData;
                    response_arr['next']    = nextInfo;
                    result(null, response_arr);
                });
            } else {
                response_arr['msg'] = 'user can not get Mosque list .';
                result(null, response_arr);
            }

        });

};

Model.mosqueDetailModel = function mosqueDetailModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var response_arr = [];

    var user_id = (param.user_id) ? param.user_id : '';

    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var user_role = (param.user_role) ? param.user_role : '';

    console.log(`Mosque List : ${JSON.stringify(param)}`);

        var dataArray = [];
        var checkContact = `SELECT users.id, users.user_role, users.mosque_name, users.first_name, users.last_name, users.email, users.country_code, users.mobile_no, users.address, users.longitude, users.latitude, CASE WHEN users.cover_photo!='' THEN CONCAT('${fullUrl}/uploadsCoverPhoto/',users.cover_photo) ELSE '' END AS cover_photo, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo, users.description,journey.is_default FROM users LEFT JOIN user_journey as journey ON journey.user_id = '${user_id}' AND journey.mosque_id = users.id WHERE users.soft_delete = 0 AND users.status = 0 AND users.id = '${mosque_id}'  order by users.mosque_name ASC `;
        // var checkContact = `SELECT id, user_role, mosque_name, first_name, last_name, email, country_code, mobile_no, address, longitude, latitude, CASE WHEN users.cover_photo!='' THEN CONCAT('${fullUrl}/uploadsCoverPhoto/',users.cover_photo) ELSE '' END AS cover_photo, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo, description FROM users WHERE soft_delete = 0 AND status = 0 AND user_role = '${user_role}' AND id = '${mosque_id}'  order by mosque_name ASC `;
        sql.query(checkContact, function (err, resData) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            if (resData) {
                // console.log(resData);
                if(resData[0].is_default != null && resData[0].is_default == 1 )
                {
                    resData[0].is_default = true;
                }else{
                    resData[0].is_default = false;
                }
                response_arr['success'] = 1;
                response_arr['msg'] = "Get Mosque Detail successfully.";
                response_arr['data'] = resData;
                result(null, response_arr);
            } else {
                response_arr['msg'] = 'user can not get Mosque Detail .';
                result(null, response_arr);
            }

        });
};

Model.publicGetPrayerModel = async function publicGetPrayerModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var prayer_date = (param.prayer_date) ? param.prayer_date : '';
    
        if(!mosque_id)
        {
            response_arr['msg'] = "Mosque_id is Required";
            result(null, response_arr);
        }
        if(!prayer_date)
        {
            response_arr['msg'] = "prayer_date is Required";
            result(null, response_arr);
        }

        var getData = `SELECT mosque_prayer_time.id,users.id as user_id,users.mosque_name,users.first_name,users.last_name,DATE_FORMAT(mosque_prayer_time.date,'%d-%m-%Y') AS date,mosque_prayer_time.prayer_type,mosque_prayer_time.prayer_time, mosque_prayer_time.jamat_time FROM mosque_prayer_time,users WHERE users.id='${mosque_id}' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_prayer_time.mosque_id AND mosque_prayer_time.date = '${prayer_date}' `;
        sql.query(getData, function (err, data) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            response_arr['success'] = 1;
            response_arr['msg'] = "Prayer Data Get Successfully!";
            response_arr['data'] = data;
            result(null, response_arr);
        });
};

Model.searchMosqueModel = function searchMosqueModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var response_arr = [];

    var keyword = (param.keywork) ? param.keywork : '';
    console.log(`Searching : ${JSON.stringify(param)}`);
        if(keyword == '')
        {
            query_text = `SELECT id, user_role, mosque_name, first_name, last_name, address, longitude, latitude, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo FROM users WHERE soft_delete = 0 AND status = 0 AND (user_role = 2 OR user_role = 3 ) order by mosque_name ASC`;
        }else{
            query_text = `SELECT id, user_role, mosque_name, first_name, last_name, address, longitude, latitude, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo FROM users WHERE soft_delete = 0 AND status = 0 AND (user_role = 2 OR user_role = 3 )  and ( mosque_name LIKE '%${keyword}%' OR first_name LIKE '%${keyword}%' OR last_name LIKE '%${keyword}%' ) `;
        }
        // query_text = `SELECT id, user_role, mosque_name, first_name, last_name, address, longitude, latitude, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo FROM users WHERE soft_delete = 0 AND status = 0 AND (user_role = 2 OR user_role = 3 )  and ( mosque_name LIKE '%${keyword}%' OR first_name LIKE '%${keyword}%' OR last_name LIKE '%${keyword}%' ) `;
        var q = sql.query(query_text, function (err, res) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }

            response_arr['success'] = 1;
            response_arr['msg'] = 'Searching Mosque Data Show successfully.';
            response_arr['data'] = res;
            result(null, response_arr);

        });
       
};

Model.addUserJourneyModel = async function addUserJourneyModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var response_arr = [];

    var user_id = (param.user_id) ? param.user_id : '';
    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    console.log(`addUserJourney : ${JSON.stringify(param)}`);
    if(!user_id)
    {
        response_arr['msg'] = "User id is Required";
        result(null, response_arr);
    }

    var chk_user =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}' AND users.soft_delete = '0' AND user_role = '4' `).catch(console.log);

    if(chk_user == '')
    {
        response_arr['msg'] = "User not found.";
        result(null, response_arr);
    }

    if(!mosque_id)
    {
        response_arr['msg'] = "Mosque id is Required";
        result(null, response_arr);
    }

    var chk_mosque =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${mosque_id}' AND users.soft_delete = '0' AND ( user_role = '2' OR user_role = '3' ) `).catch(console.log);

    if(chk_mosque == '')
    {
        response_arr['msg'] = "Mosque not found.";
        result(null, response_arr);
    }else{
        var chk_journey =  await helper.sql_query(sql, `SELECT id FROM user_journey WHERE user_id = '${user_id}' AND mosque_id = '${mosque_id}' `).catch(console.log);
        if(chk_journey == '')
        {
            query_text = `INSERT INTO user_journey(user_id,mosque_id,created_at) VALUES('${user_id}','${mosque_id}','${today}') `;
            var q = sql.query(query_text, function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                query_text1 = `SELECT uj.id as journey_id,uj.user_id,uj.mosque_id,users.mosque_name,users.first_name,users.last_name, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,CASE WHEN users.cover_photo!='' THEN CONCAT('${fullUrl}/uploadsCoverPhoto/',users.cover_photo) ELSE '' END AS cover_photo,users.address, CASE WHEN users.longitude!='' THEN users.longitude ELSE '' END AS longitude, CASE WHEN users.latitude!='' THEN users.latitude ELSE '' END AS latitude,uj.is_default,DATE_FORMAT(uj.created_at,'%d-%m-%Y %H:%i') AS created_at FROM user_journey as uj LEFT JOIN users ON users.id = mosque_id WHERE user_id = '${user_id}' order by uj.id DESC  `;
                var q = sql.query(query_text1, function (err, res1) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }
                    for(var i = 0; i < res1.length; ++i){
                        if(res1[i].is_default == 0)
                        {
                            res1[i].is_default = false;
                        }else{
                            res1[i].is_default = true;
                        }
                    }
                    response_arr['success'] = 1;
                    response_arr['msg'] = 'Data added successfully.';
                    response_arr['data'] = res1;
                    result(null, response_arr);
                });
            });
        }else{
            query_text1 = `SELECT uj.id as journey_id,uj.user_id,uj.mosque_id,users.mosque_name,users.first_name,users.last_name, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,CASE WHEN users.cover_photo!='' THEN CONCAT('${fullUrl}/uploadsCoverPhoto/',users.cover_photo) ELSE '' END AS cover_photo,users.address, CASE WHEN users.longitude!='' THEN users.longitude ELSE '' END AS longitude, CASE WHEN users.latitude!='' THEN users.latitude ELSE '' END AS latitude,uj.is_default,DATE_FORMAT(uj.created_at,'%d-%m-%Y %H:%i') AS created_at FROM user_journey as uj LEFT JOIN users ON users.id = mosque_id WHERE user_id = '${user_id}' order by uj.id DESC  `;
            var q = sql.query(query_text1, function (err, res2) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                for(var i = 0; i < res2.length; ++i){
                    if(res2[i].is_default == 0)
                    {
                        res2[i].is_default = false;
                    }else{
                        res2[i].is_default = true;
                    }
                }
                response_arr['success'] = 1;
                response_arr['msg'] = 'already Data added.';
                response_arr['data'] = res2;
                result(null, response_arr);
            });
        }
    }
       
};

Model.getUserJourneyModel = async function getUserJourneyModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var response_arr = [];

    var next_id = (param.next_id) ? param.next_id : 0;
	var last_id = parseInt(next_id) + 20;

    var next_arr = [];
    
    var user_id = (param.user_id) ? param.user_id : '';
    console.log(`getUserJourney : ${JSON.stringify(param)}`);
    if(!user_id)
    {
        response_arr['msg'] = "User id is Required";
        result(null, response_arr);
    }

    var chk_user =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}' AND users.soft_delete = '0' AND user_role = '4' `).catch(console.log);

    if(chk_user == '')
    {
        response_arr['msg'] = "User not found.";
        result(null, response_arr);
    }else{
        var chk_journey =  await helper.sql_query(sql, `SELECT id FROM user_journey WHERE user_id = '${user_id}' `).catch(console.log);
        if(chk_journey == '')
        {
            // response_arr['success'] = 1;
            response_arr['msg'] = `Journey data Can't get.`;
            // response_arr['data'] = res1;
            result(null, response_arr);
        }else{
            query_text1 = `SELECT uj.id as journey_id,uj.user_id,uj.mosque_id,users.mosque_name,users.first_name,users.last_name, CASE WHEN users.cover_photo!='' THEN CONCAT('${fullUrl}/uploadsCoverPhoto/',users.cover_photo) ELSE '' END AS cover_photo, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,users.address, CASE WHEN users.longitude!='' THEN users.longitude ELSE '' END AS longitude, CASE WHEN users.latitude!='' THEN users.latitude ELSE '' END AS latitude,uj.is_default,DATE_FORMAT(uj.created_at,'%d-%m-%Y %H:%i') AS created_at FROM user_journey as uj LEFT JOIN users ON users.id = mosque_id WHERE user_id = '${user_id}' order by uj.is_default DESC LIMIT 20 OFFSET ${parseInt(next_id)}`;
            var q = sql.query(query_text1, function (err, res2) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                for(var i = 0; i < res2.length; ++i){
                    if(res2[i].is_default == 0)
                    {
                        res2[i].is_default = false;
                    }else{
                        res2[i].is_default = true;
                    }
                }

                query_text2 = `SELECT uj.id as journey_id,uj.user_id,uj.mosque_id,users.mosque_name,users.first_name,users.last_name, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,users.address, CASE WHEN users.longitude!='' THEN users.longitude ELSE '' END AS longitude, CASE WHEN users.latitude!='' THEN users.latitude ELSE '' END AS latitude,uj.is_default,DATE_FORMAT(uj.created_at,'%d-%m-%Y %H:%i') AS created_at FROM user_journey as uj LEFT JOIN users ON users.id = mosque_id WHERE user_id = '${user_id}' order by uj.is_default DESC `;
                sql.query(query_text2, function(err, res) {
                    if(err) {
                        console.log("error: ", err);
                        result(err, null);
                    }

                    var total = res.length;
                    if(last_id > total) {
                        last_id = total;
                    }

                    var nextInfo = {
                        'total': total,
                        'next_id': last_id
                    }
                    next_arr.push(nextInfo);

                    response_arr['success'] = 1;
                    response_arr['msg'] = 'Get journey Data.';
                    response_arr['data'] = res2;
                    response_arr['next']    = nextInfo;
                    result(null, response_arr);
                });
                
            });
        }
    }
       
};

Model.deleteUserJourneyModel = async function deleteUserJourneyModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var user_id = (param.user_id) ? param.user_id : '';
    var journey_ids = (param.journey_id) ? param.journey_id : '';
    console.log('param',journey_ids);
    var split_journey_ids = journey_ids.split(',');  
    // console.log('param length',split_journey_ids.length);
    var journeyDelete1 = [];
    for(var i=0;i < split_journey_ids.length; i++)
    {
        var journeyDelete =  await helper.sql_query(sql, `DELETE FROM user_journey WHERE id = '${split_journey_ids[i]}' AND user_id = '${user_id}' AND is_default != '1' `).catch(console.log);
        if(journeyDelete.affectedRows){
            journeyDelete1.push(split_journey_ids[i]);
        }
    }

    if(journeyDelete1.length > 0)
    {
        response_arr['success'] = 1;
        response_arr['msg'] = ` Public Journey Id : ${journeyDelete1} Deleted Successfully!`;
        // response_arr['data'] = response;
        result(null, response_arr);
    }else{
        response_arr['msg'] = `Some thing wan't wrong for Delete journey .`;
        result(null, response_arr);
    }
};


//public_ProjectList    -- This function already define mosque side .

//public_ProjectDetail  -- This function already define mosque side .

Model.mosqueDonationModel = async function mosqueDonationModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var response_arr = [];

    var mosque_id = (param.mosque_id) ? param.mosque_id : '';
    var public_id = (param.public_id) ? param.public_id : '';
    var project_id = (param.project_id) ? param.project_id : '0';
    var amount = (param.amount) ? param.amount : '';
    var auto_donation = (param.auto_donation) ? param.auto_donation : '0';
    var payment_mode = (param.payment_mode) ? param.payment_mode : '';
    var card_id = (param.card_id) ? param.card_id : ''; 
    console.log(`Donation : ${JSON.stringify(param)}`);

    var insertData = {
        project_id:project_id,
        mosque_id:mosque_id,
        public_id:public_id,
        amount:amount,
        auto_donation:auto_donation,
        created_at:today,
    };
    if(payment_mode == 'STRIPE') 
    {
        var amt = Math.round(amount * 100);
        var getUserInfo =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${public_id}' `).catch(console.log);
        console.log(getUserInfo);
        if(getUserInfo[0].stripe_customer_id != '')
            {
                const cardRetrieve = await stripe.customers.retrieveSource(
                    getUserInfo[0].stripe_customer_id,
                    card_id
                );
                if(cardRetrieve)
                {
                    const charge = await stripe.charges.create({
                        amount: amt,     // Charing Rs 25 , particular Order wise
                        description: 'Donation',
                        currency: 'USD',
                        customer: getUserInfo[0].stripe_customer_id,
                        source: card_id,//'card_1ItyLmAxiqx6YNN6JNojOOPF'
                    });
                    if(charge)
                    {
                        insertData.transaction_id = charge.id;
                        var payment = 'Success'; 
                    }
                }else{
                    response_arr['msg'] = "register user card not valid OR user not valid.";
                    result(null, response_arr);
                }
            }else{
                response_arr['msg'] = "register user on stripe payment gatway.";
                result(null, response_arr);
            }
    }else{
        response_arr['msg'] = "Please check payment mode.";
        result(null, response_arr);
    }
    console.log('payment',payment);
    if(payment =='Success' )
    {
        var chk_mosque_id =  await helper.sql_query(sql, `SELECT id as mosque_id FROM users WHERE id = '${mosque_id}' `).catch(console.log);
        var chk_user_id =  await helper.sql_query(sql, `SELECT id as user_id FROM users WHERE id = '${public_id}'`).catch(console.log);
        // console.log('chk_mosque_id',chk_mosque_id.length);
        if(chk_mosque_id.length > 0 && chk_user_id.length > 0)
        {
            var query_text = `INSERT INTO donations SET ?;`;
            sql.query(query_text, [insertData],async function (err, data) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                if(data.affectedRows > 0)
                {

                    if(auto_donation == 1)
                    {
                        var chk_auto_donation =  await helper.sql_query(sql, `SELECT id,amount,status FROM auto_donations WHERE project_id = '${project_id}' AND mosque_id = '${mosque_id}' AND public_id = '${public_id}' AND status = '0' `).catch(console.log);
                        console.log('chk_auto_donation',chk_auto_donation);
                        if(chk_auto_donation.length > 0)
                        {
                            var autoDon = {
                                donation_transaction_id:data.insertId,
                                project_id:project_id,
                                mosque_id:mosque_id,
                                public_id:public_id,
                                amount:amount,
                                status:'0',
                                created_at:today,
                            };
                            var query_text = `UPDATE auto_donations SET ? WHERE id = '${chk_auto_donation[0].id}' ;`;
                            sql.query(query_text, [autoDon],async function (err, getAuto) {
                                if (err) {
                                    console.log("error: ", err);
                                    result(err, null);
                                }
                                if(getAuto.affectedRows > 0)
                                {
                                    console.log('autoDonation Update');
                                }
                            });
                        }else{
                            var autoDon = {
                                donation_transaction_id:data.insertId,
                                project_id:project_id,
                                mosque_id:mosque_id,
                                public_id:public_id,
                                amount:amount,
                                status:'0',
                                created_at:today,
                            };
                            var query_text = `INSERT INTO auto_donations SET ?;`;
                            sql.query(query_text, [autoDon],async function (err, getAuto) {
                                if (err) {
                                    console.log("error: ", err);
                                    result(err, null);
                                }
                                if(getAuto.affectedRows > 0)
                                {
                                    console.log('autoDonation On :',getAuto.insertId);
                                }
                            });
                        }
                        
                    }
                    // query_text = `SELECT id, user_role, mosque_name, first_name, last_name, address, longitude, latitude, CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo FROM users WHERE soft_delete = 0 AND status = 0 AND (user_role = 2 OR user_role = 3 ) AND  `;
                    // var q = sql.query(query_text, function (err, res) {
                    //     if (err) {
                    //         console.log("error: ", err);
                    //         result(err, null);
                    //     }


                        response_arr['success'] = 1;
                        var msgContent = '';
                        var activity = '';
                        if(project_id != 0)
                        {
                            response_arr['msg'] = 'Project Donation Complete successfully.';
                            msgContent = 'Project';
                            activity = 'ProjectDonation';
                        }else{
                            response_arr['msg'] = 'Mosque Donation Complete successfully.';
                            msgContent = 'Mosque';
                            activity = 'MosqueDonation';
                        }

                        if(chk_mosque_id.length > 0)
                            {
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                                var tparam = {
                                    'user_ids': [chk_mosque_id[0].mosque_id], // Registration Token For multiple users
                                };
                                console.log('user_ids',tparam);
                                helper.get_registration_token(tparam,async function (res) {
                                    // if (res.length > 0) {
                                        var regTokens = (res.length > 0) ? res.map(res => res.token) : [];
                                        // Send Notification Message : Start

                                        // var set_body = `${first_name} ${last_name} wants to hire you at ${work_start_date} ${work_timing}.`;
                                        var loginUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${public_id}' `).catch(console.log);
                                        var set_body = `User @${loginUser[0].first_name} ${loginUser[0].last_name} Donate your ${msgContent} ${amount} Amount.`;
                                        var send_param = {
                                            'registration_token': regTokens,
                                            'title': appName,
                                            'body': set_body,
                                            'extra_data': {
                                                "activity": activity,
                                                "user_id": public_id,
                                                "mosque_id": chk_mosque_id[0].mosque_id,
                                            }
                                        };
                                        // console.log(send_param);
                                        helper.send_notification(send_param, function (send_res) {
                                            // Save Notification Message in DB : Start
                                            var notify_params = {
                                                'user_id': chk_mosque_id[0].mosque_id,
                                                'from_id': public_id,
                                                // "post_id": chk_post_id[0].id,
                                                "activity": activity,
                                                'noti_type': 1,
                                                'description': set_body,
                                                'created_at': today,
                                            }
                                            helper.save_notification(notify_params);                                    
                                            
                                        });
                                        // Send Notification Message : End      
                                    // }
                                });
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                            }
        
                        // response_arr['data'] = res;
                        result(null, response_arr);
                    // });
                }
            });
        }else{
            response_arr['msg'] = "Please Check user Id Or Mosque Id wrong.";
            result(null, response_arr);
        }

    }else{
        response_arr['msg']     = 'Payment Method not choose proper.';
        // response_arr['data'] = chatInfo,
        result(null, response_arr);
    }
       
};

//public_ProductList    -- This function already define mosque side .

//public_ProductDetail  -- This function already define mosque side .

Model.publicProductAddTocartModel = async function publicProductAddTocartModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    // var param = req.body;
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var user_id = (param.user_id) ? param.user_id : '';
    var product_id = (param.product_id) ? param.product_id : '';
    var quantity = (param.quantity) ? param.quantity : '';
    
        if(!user_id)
        {
            response_arr['msg'] = "User id is Required";
            result(null, response_arr);
        }

        var chk_user =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}' AND users.soft_delete = '0'`).catch(console.log);

        if(chk_user == '')
        {
            response_arr['msg'] = "User not found.";
            result(null, response_arr);
        }

        if(!quantity)
        {
            response_arr['msg'] = "Quantity is Required";
            result(null, response_arr);
        }


       
        if(!product_id)
        {
            response_arr['msg'] = "Product Id is Required";
            result(null, response_arr);
        }
        
        var chkCart =  await helper.sql_query(sql, `SELECT * FROM cart WHERE user_id = '${user_id}' AND product_id = '${product_id}' `).catch(console.log);

        // if(quantity <= 0)
        // {
        //     response_arr['msg'] = "Quantity is Required";
        //     result(null, response_arr);
        // }
        
        if(chkCart != '')
        {
            console.log('chkCart',chkCart[0].id);
            var insertData = {
                product_id:product_id,
                user_id:user_id,
                quantity: parseInt(quantity),
                created_at:today,
            };

            var query_text = `UPDATE cart SET ? WHERE id = '${chkCart[0].id}' ;`;
            sql.query(query_text, [insertData], function (err, data) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                if(data.affectedRows > 0)
                {
                    var getData = `SELECT mosque_products.id, users.id as user_id,users.mosque_name,users.first_name,users.last_name,mosque_products.product_name,mosque_products.product_price,mosque_products.product_description,mosque_products.product_hide_status,mosque_products.pick_address,mosque_products.allow_pick_and_collect_option,mosque_products.delivery_detail,mosque_products.cost_of_delivery,DATE_FORMAT(mosque_products.created_at,'%d-%m-%Y') AS created_at, cart.quantity, DATE_FORMAT(cart.updated_at,'%d-%m-%Y') AS cart_updated_at FROM mosque_products, users, cart WHERE cart.product_id = mosque_products.id AND cart.user_id = '${user_id}' AND mosque_products.id='${product_id}' AND mosque_products.product_hide_status='0' AND mosque_products.soft_delete = '0' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_products.mosque_id  `;
                    sql.query(getData,async function (err, getdata) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }

                        var sum_of_cart_amt =  await helper.sql_query(sql, `SELECT SUM((cart.quantity * mosque_products.product_price)) as total FROM cart LEFT JOIN mosque_products ON mosque_products.id = cart.product_id  WHERE  user_id = '${user_id}' AND mosque_products.product_hide_status='0' AND mosque_products.soft_delete = '0'`).catch(console.log);
                        
                        var response = [];
                        async.forEachOf(getdata, async (ProductList, key, callback) => {
                            // console.log('ProductList',ProductList.id);
                            var projectImages =  await helper.sql_query(sql, `SELECT *,CASE WHEN file!='' THEN CONCAT('${fullUrl}/products/',file) ELSE '' END AS file FROM images WHERE type = '2' AND ref_id = '${ProductList.id}'`).catch(console.log);
                            // console.log('getImages',projectImages);
                            
                            if(ProductList.delivery_time == null)
                            {
                                ProductList.delivery_time = '';
                            }
                            var ProductData = {
                                "mosque_id": ProductList.user_id,
                                "mosque_name": ProductList.mosque_name,
                                "first_name": ProductList.first_name,
                                "last_name": ProductList.last_name,
                                "product_id": ProductList.id,
                                "product_name": ProductList.product_name,
                                "product_price": parseFloat(ProductList.product_price).toFixed(2),
                                "product_description": ProductList.product_description,
                                "product_hide_status": ProductList.product_hide_status,
                                "pick_address": ProductList.pick_address,
                                "allow_pick_and_collect_option": ProductList.allow_pick_and_collect_option,
                                "delivery_detail": ProductList.delivery_detail,
                                "cost_of_delivery": parseFloat(ProductList.cost_of_delivery).toFixed(2),
                                "cart_product_quantity": ProductList.quantity,
                                "cart_updated_at": ProductList.cart_updated_at,
                                "images": projectImages,
                            };
                            response.push(ProductData);
                            // console.log('response',response); 
                        }, err => {
                                if (err) console.error(err.message);
                    
                            response_arr['success'] = 1;
                            response_arr['msg'] = "Update Card Data Successfully!";
                            response_arr['data'] = response;
                            response_arr['final_total'] = parseFloat(sum_of_cart_amt[0].total).toFixed(2);
                            result(null, response_arr);
                        });
                    });
                }else {
                    response_arr['msg'] = "Cart Data can't Updated.";
                    result(null, response_arr);
                }
            });
        }else{
            var insertData = {
                product_id:product_id,
                user_id:user_id,
                quantity:parseInt(quantity),
                created_at:today,
            };
            var query_text = `INSERT INTO cart SET ?;`;
            sql.query(query_text, [insertData], function (err, data) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                if(data.affectedRows > 0)
                {
                    var getData = `SELECT mosque_products.id, users.id as user_id,users.mosque_name,users.first_name,users.last_name,mosque_products.product_name,mosque_products.product_price,mosque_products.product_description,mosque_products.product_hide_status,mosque_products.pick_address,mosque_products.allow_pick_and_collect_option,mosque_products.delivery_detail,mosque_products.cost_of_delivery,DATE_FORMAT(mosque_products.created_at,'%d-%m-%Y') AS created_at, cart.quantity, DATE_FORMAT(cart.updated_at,'%d-%m-%Y') AS cart_updated_at FROM mosque_products, users, cart WHERE cart.product_id = mosque_products.id AND cart.user_id = '${user_id}' AND mosque_products.id='${product_id}' AND mosque_products.product_hide_status='0' AND mosque_products.soft_delete = '0' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_products.mosque_id  `;
                    sql.query(getData,async function (err, getdata) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }
                        var countCart =  await helper.sql_query(sql, `SELECT count(product_id) as countCart FROM cart LEFT JOIN mosque_products ON mosque_products.id = cart.product_id  WHERE  user_id = '${user_id}' AND mosque_products.product_hide_status='0' AND mosque_products.soft_delete = '0'`).catch(console.log);

                        var sum_of_cart_amt =  await helper.sql_query(sql, `SELECT SUM((cart.quantity * mosque_products.product_price)) as total FROM cart LEFT JOIN mosque_products ON mosque_products.id = cart.product_id  WHERE  user_id = '${user_id}' AND mosque_products.product_hide_status='0' AND mosque_products.soft_delete = '0'`).catch(console.log);

                        var response = [];
                        async.forEachOf(getdata, async (ProductList, key, callback) => {
                            // console.log('ProductList',ProductList.id);
                            var projectImages =  await helper.sql_query(sql, `SELECT *,CASE WHEN file!='' THEN CONCAT('${fullUrl}/products/',file) ELSE '' END AS file FROM images WHERE type = '2' AND ref_id = '${ProductList.id}'`).catch(console.log);
                            // console.log('getImages',projectImages);
                            // if(ProductList.delivery_time == null)
                            // {
                            //     ProductList.delivery_time = '';
                            // }
                            var ProductData = {
                                "mosque_id": ProductList.user_id,
                                "mosque_name": ProductList.mosque_name,
                                "first_name": ProductList.first_name,
                                "last_name": ProductList.last_name,
                                "product_id": ProductList.id,
                                "product_name": ProductList.product_name,
                                "product_price": parseFloat(ProductList.product_price).toFixed(2),
                                "product_description": ProductList.product_description,
                                "product_hide_status": ProductList.product_hide_status,
                                "pick_address": ProductList.pick_address,
                                "allow_pick_and_collect_option": ProductList.allow_pick_and_collect_option,
                                "delivery_detail": ProductList.delivery_detail,
                                "cost_of_delivery": parseFloat(ProductList.cost_of_delivery).toFixed(2),
                                "cart_product_quantity": ProductList.quantity,
                                "cart_updated_at": ProductList.cart_updated_at,
                                "images": projectImages,
                            };
                            response.push(ProductData);
                            // console.log('response',response); 
                        }, err => {
                                if (err) console.error(err.message);
                    
                            response_arr['success'] = 1;
                            response_arr['msg'] = "Add To Cart Data Successfully!";
                            response_arr['data'] = response;
                            response_arr['cart_counter'] = countCart[0].countCart;
                            response_arr['final_total'] = parseFloat(sum_of_cart_amt[0].total).toFixed(2);
                            result(null, response_arr);
                        });
                    });
                }else {
                    response_arr['msg'] = "Cart Data can't add.";
                    result(null, response_arr);
                }
            });
        }

};

Model.publicProductShowCartModel = async function publicProductShowCartModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var user_id = (param.user_id) ? param.user_id : '';

            var getData = `SELECT mosque_products.id, users.id as mosque_id,users.mosque_name,users.first_name,users.last_name,mosque_products.product_name,mosque_products.product_price,mosque_products.product_description,mosque_products.product_hide_status,mosque_products.pick_address,mosque_products.allow_pick_and_collect_option,mosque_products.delivery_detail,mosque_products.cost_of_delivery,DATE_FORMAT(mosque_products.created_at,'%d-%m-%Y') AS created_at FROM mosque_products, users,cart WHERE cart.user_id = '${user_id}' AND cart.product_id=mosque_products.id AND cart.quantity > '0' AND users.id=mosque_products.mosque_id AND mosque_products.product_hide_status='0' AND mosque_products.soft_delete = '0' AND users.soft_delete = '0' AND users.status = '0' AND users.id=mosque_products.mosque_id order by cart.updated_at DESC`;
            console.log('log',getData);
            sql.query(getData,async function (err, data) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                var countCart =  await helper.sql_query(sql, `SELECT count(product_id) as countCart FROM cart LEFT JOIN mosque_products ON mosque_products.id = cart.product_id  WHERE  user_id = '${user_id}' AND mosque_products.product_hide_status='0' AND mosque_products.soft_delete = '0'`).catch(console.log);
                var response = [];
                var responseMsg = [];
                async.forEachOf(data, async (ProductList, key, callback) => {
                    // console.log('ProductList',ProductList.id);
                    var projectImages =  await helper.sql_query(sql, `SELECT id,CASE WHEN file!='' THEN CONCAT('${fullUrl}/products/',file) ELSE '' END AS file, status, created_at, updated_at FROM images WHERE type = '2' AND ref_id = '${ProductList.id}'`).catch(console.log);

                    var cartProduct =  await helper.sql_query(sql, `SELECT id,product_id, quantity, updated_at FROM cart WHERE product_id = '${ProductList.id}' AND user_id = '${user_id}' `).catch(console.log);

                    var getDeliveryAddress =  await helper.sql_query(sql, `SELECT id,address,latitude,longitude FROM users WHERE id = '${user_id}' `).catch(console.log);
                    // console.log('cartProduct',getDeliveryAddress);
                     
                    // console.log('getImages',projectImages);
                    // if(ProductList.delivery_time == null)
                    // {
                    //     ProductList.delivery_time = '';
                    // }
                    var total_amount = parseFloat(cartProduct[0].quantity) * parseFloat(ProductList.product_price); 
                    
                    var ProjectData = {
                        "id": ProductList.id,
                        "user_id": parseInt(user_id),
                        "user_address": getDeliveryAddress[0].address,
                        "user_longitude": getDeliveryAddress[0].longitude,
                        "user_latitude": getDeliveryAddress[0].latitude,
                        "mosque_id": ProductList.mosque_id,
                        "mosque_name": ProductList.mosque_name,
                        "first_name": ProductList.first_name,
                        "last_name": ProductList.last_name,
                        "product_name": ProductList.product_name,
                        "product_price": parseFloat(ProductList.product_price).toFixed(2),
                        "product_description": ProductList.product_description,
                        "product_hide_status": ProductList.product_hide_status,
                        "pick_address": ProductList.pick_address,
                        "allow_pick_and_collect_option":ProductList.allow_pick_and_collect_option,
                        "delivery_detail":ProductList.delivery_detail,
                        "cost_of_delivery":parseFloat(ProductList.cost_of_delivery).toFixed(2),
                        "created_at": ProductList.created_at,
                        "is_added_cart": (cartProduct != '') ? true:false,
                        "cart_product_quantity": cartProduct[0].quantity,
                        "total_amount": parseFloat(total_amount).toFixed(2),
                        "cart_updated_at": ProductList.cart_updated_at,
                        "images": projectImages,
                    };
                    response.push(ProjectData);
                   
                }, err => {
                    if (err) console.error(err.message);

                    var count = 0.00;
                    for(var i = 0; i < response.length; ++i){
                            count = parseFloat(count) + parseFloat(response[i].total_amount);
                    }
                    // console.log('count',count);
                    // response.push({'final_total': count});
                response_arr['success'] = 1;
                response_arr['msg'] = `Public Get Cart Data Successfully!`;
                response_arr['data'] = response;
                response_arr['cart_counter'] = countCart[0].countCart;
                response_arr['final_total'] = parseFloat(count).toFixed(2);
                result(null, response_arr);
            });
        });
};

Model.publicProductDeleteCartModel = async function publicProductDeleteCartModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var user_id = (param.user_id) ? param.user_id : '';
    var product_id = (param.product_id) ? param.product_id : '';
    
    var cartDelete =  await helper.sql_query(sql, `DELETE FROM cart WHERE product_id = '${product_id}' AND user_id = '${user_id}' `).catch(console.log);
    console.log('cartDelete',cartDelete);
    if(cartDelete.affectedRows)
    {
        response_arr['success'] = 1;
        response_arr['msg'] = `Public Delete Cart Data Successfully!`;
        // response_arr['data'] = response;
        result(null, response_arr);
    }else{
        response_arr['msg'] = `Some thing wan't wrong for Delete Cart .`;
        result(null, response_arr);
    }
};

Model.publicProductCountCartModel = async function publicProductCountCartModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var user_id = (param.user_id) ? param.user_id : '';

    var chk_user =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}' AND users.soft_delete = '0'`).catch(console.log);

        if(chk_user == '')
        {
            response_arr['msg'] = "User not found.";
            result(null, response_arr);
        }

    var countCart =  await helper.sql_query(sql, `SELECT count(product_id) as countCart FROM cart LEFT JOIN mosque_products ON mosque_products.id = cart.product_id  WHERE  user_id = '${user_id}' AND mosque_products.product_hide_status='0' AND mosque_products.soft_delete = '0'`).catch(console.log);
    var counter = {
        "cart_counter":countCart[0].countCart,
    };
    response_arr['success'] = 1;
    response_arr['msg'] = `Public Get Cart Counter Successfully!`;
    response_arr['data'] = counter;
    result(null, response_arr);

};

Model.publicGetOrderAddressModel = async function publicGetOrderAddressModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var user_id = (param.user_id) ? param.user_id : '';
    var response = [];
    if(!user_id)
    {
        response_arr['msg'] = "User id is Required";
        result(null, response_arr);
    }
    var chk_defaul_address = await helper.sql_query(sql, `SELECT id,first_name,last_name,address,address1,address2,post_code,longitude,latitude,created_at,updated_at FROM users WHERE id = '${user_id}' `).catch(console.log);
    
    var test = await helper.sql_query(sql, `SELECT Count(is_selected) as chk_flag FROM user_order_address WHERE is_selected = '1' AND user_id = '${user_id}' `).catch(console.log);
    // console.log('test',test[0].chk_flag);
    var getAddress1 = {
        "id":0,
        "first_name":chk_defaul_address[0].first_name,
        "last_name":chk_defaul_address[0].last_name,
        "landmark":'',
        "address":chk_defaul_address[0].address,
        "address1":chk_defaul_address[0].address1,
        "address2":chk_defaul_address[0].address2,
        "post_code":chk_defaul_address[0].post_code,
        "longitude":chk_defaul_address[0].longitude,
        "latitude":chk_defaul_address[0].latitude,
        "is_selected": (test[0].chk_flag > 0) ? false : true,
        // "is_selected":  false ,
        "created_at":chk_defaul_address[0].created_at,
        "updated_at":chk_defaul_address[0].updated_at,
    };
    response.push(getAddress1);

    var query_text = `SELECT * FROM user_order_address WHERE user_id = '${user_id}' `;
    sql.query(query_text,async function (err, data) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }   
        async.forEachOf(data, async (addressList, key, callback) => {  
            var getAddress = {
                "id":addressList.id,
                "first_name":addressList.first_name,
                "last_name":addressList.last_name,
                "landmark":addressList.landmark,
                "address":addressList.address,
                "longitude":addressList.longitude,
                "latitude":addressList.latitude,
                "address1":addressList.address1,
                "address2":addressList.address2,
                "post_code":addressList.post_code,
                "is_selected":(addressList.is_selected == 1 ) ? true : false ,
                "created_at":addressList.created_at,
                "updated_at":addressList.updated_at,
            };
            response.push(getAddress);
        }, err => {
            if (err) console.error(err.message);

            response_arr['success'] = 1;
            response_arr['msg'] = "Get User Order Address Detail!";
            response_arr['data'] = response;
            result(null, response_arr);
        });
    });

};

Model.publicSetOrderAddressModel = async function publicSetOrderAddressModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];

    var user_id = (param.user_id) ? param.user_id : '';
    var address_id = (param.address_id) ? param.address_id : '';

    if(!user_id)
    {
        response_arr['msg'] = "User id is Required";
        result(null, response_arr);
    }
    console.log('param',param);
    var chk_user =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}' AND users.soft_delete = '0'`).catch(console.log);

    if(chk_user == '')
    {
        response_arr['msg'] = "User not found.";
        result(null, response_arr);
    }else{
        var chk_user_order_add =  await helper.sql_query(sql, `SELECT count(id) as count_data FROM user_order_address WHERE user_id = '${user_id}' `).catch(console.log);
        if(chk_user_order_add[0].count_data > 0)
        {
            if(address_id == 0)
            {
                var query_text = `UPDATE user_order_address SET is_selected = '0' WHERE user_id = '${user_id}' ;`;
            }else{
                var query_text = `UPDATE user_order_address SET is_selected = '1' WHERE user_id = '${user_id}' AND id = '${address_id}' ;`;
            }
            // var query_text = `UPDATE user_order_address SET is_selected = '1' WHERE user_id = '${user_id}' AND id = '${address_id}' ;`;
            // console.log('query_text',query_text);
            sql.query(query_text,async function (err, data1) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                if(data1.affectedRows > 0)
                {
                    // console.log('fvdg');
                    var changeFlag =  await helper.sql_query(sql, `UPDATE user_order_address SET is_selected = '0' WHERE user_id = '${user_id}' AND id != '${address_id}' ;`).catch(console.log);

                    var chk_address = await helper.sql_query(sql, `SELECT id,first_name,last_name,address,longitude,latitude, address1, address2, post_code, created_at,updated_at FROM users WHERE id = '${user_id}' `).catch(console.log);
                    var test = await helper.sql_query(sql, `SELECT Count(is_selected) as chk_flag FROM user_order_address WHERE is_selected = '1' AND user_id = '${user_id}' `).catch(console.log);
                    var getAddress2 = {
                        "id":0,
                        "first_name":chk_address[0].first_name,
                        "last_name":chk_address[0].last_name,
                        "landmark":'',
                        "address":chk_address[0].address,
                        "longitude":chk_address[0].longitude,
                        "latitude":chk_address[0].latitude,
                        "address1":chk_address[0].address1,
                        "address2":chk_address[0].address2,
                        "post_code":chk_address[0].post_code,
                        "is_selected": (test[0].chk_flag > 0) ? false : true,
                        "created_at":chk_address[0].created_at,
                        "updated_at":chk_address[0].updated_at,
                    };
                    response.push(getAddress2);

                    var query_text = `SELECT * FROM user_order_address WHERE user_id = '${user_id}' AND id != '${data1.insertId}'   `;
                    sql.query(query_text,async function (err, data) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }   
                        async.forEachOf(data, async (addressList, key, callback) => {  
                            // var chk_selected_address = await helper.sql_query(sql, `SELECT MAX(id) FROM user_order_address WHERE id = '${user_id}' AND id='${data1.insertId}' `).catch(console.log);
                            // console.log('chk_selected_address',chk_selected_address);
                            var getAddress = {
                                "id":addressList.id,
                                "first_name":addressList.first_name,
                                "last_name":addressList.last_name,
                                "landmark":addressList.landmark,
                                "address":addressList.address,
                                "longitude":addressList.longitude,
                                "latitude":addressList.latitude,
                                "address1":addressList.address1,
                                "address2":addressList.address2,
                                "post_code":addressList.post_code,
                                "is_selected":(addressList.is_selected == 1 ) ? true : false ,
                                "created_at":addressList.created_at,
                                "updated_at":addressList.updated_at,
                            };
                            response.push(getAddress);
                        }, err => {
                            if (err) console.error(err.message);

                        });
                        response_arr['success'] = 1;
                        response_arr['msg'] = `Public Set Order Address Successfully!`;
                        response_arr['data'] = response;
                        result(null, response_arr);
                    });
                }
                else{
                    // response_success = 0;
                    response_arr['msg'] = `Public can not Set Address .`;
                    result(null, response_arr);
                }    
            });
        }else{
            var chk_defaul_address = await helper.sql_query(sql, `SELECT id,first_name,last_name,address,address1,address2,post_code,longitude,latitude,created_at,updated_at FROM users WHERE id = '${user_id}' `).catch(console.log);
    
            var test = await helper.sql_query(sql, `SELECT Count(is_selected) as chk_flag FROM user_order_address WHERE is_selected = '1' AND user_id = '${user_id}' `).catch(console.log);
            // console.log('test',test[0].chk_flag);
            var getAddress1 = {
                "id":0,
                "first_name":chk_defaul_address[0].first_name,
                "last_name":chk_defaul_address[0].last_name,
                "landmark":'',
                "address":chk_defaul_address[0].address,
                "address1":chk_defaul_address[0].address1,
                "address2":chk_defaul_address[0].address2,
                "post_code":chk_defaul_address[0].post_code,
                "longitude":chk_defaul_address[0].longitude,
                "latitude":chk_defaul_address[0].latitude,
                "is_selected": (test[0].chk_flag > 0) ? false : true,
                // "is_selected":  false ,
                "created_at":chk_defaul_address[0].created_at,
                "updated_at":chk_defaul_address[0].updated_at,
            };
            response.push(getAddress1);
            response_arr['success'] = 1;
            response_arr['msg'] = `Public Set Order Address Successfully!`;
            response_arr['data'] = response;
            result(null, response_arr);
        }
    }
};

Model.publicAddOrderAddressModel = async function publicAddOrderAddressModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];

    var user_id = (param.user_id) ? param.user_id : '';
    var first_name = (param.first_name) ? param.first_name : '';
    var last_name = (param.last_name) ? param.last_name : '';
    var landmark = (param.landmark) ? param.landmark : '';
    var address = (param.address) ? param.address : '';
    var address1 = (param.address1) ? param.address1 : '';
    var address2 = (param.address2) ? param.address2 : '';
    var post_code = (param.post_code) ? param.post_code : '';
    var longitude = (param.longitude) ? param.longitude : '';
    var latitude = (param.latitude) ? param.latitude : '';

    console.log('Add Order Address',param);
    if(!user_id)
    {
        response_arr['msg'] = "User id is Required";
        result(null, response_arr);
    }

    var chk_user =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}' AND users.soft_delete = '0'`).catch(console.log);

    if(chk_user == '')
    {
        response_arr['msg'] = "User not found.";
        result(null, response_arr);
    }else{

    var insertData = {
        user_id:user_id,
        first_name:first_name,
        last_name:last_name,
        landmark:landmark,
        address:address,
        longitude:longitude,
        latitude:latitude,
        address1:address1,
        address2:address2,
        post_code:post_code,
        is_selected:1,
        created_at:today,
    };
    var query_text = `INSERT INTO user_order_address SET ?;`;
    sql.query(query_text, [insertData],async function (err, data1) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        if(data1.affectedRows > 0)
        {
            response_success = 1;
            response_msg = `Public Add Order Address Cart Data Successfully!`;
        }else{
            response_success = 0;
            response_msg = `Public can not Add Order Address .`;
        }

        var updateFlag = await helper.sql_query(sql, `UPDATE user_order_address SET is_selected = '0' WHERE user_id = '${user_id}' AND id != '${data1.insertId}' `).catch(console.log);
        
        var chk_defaul_address = await helper.sql_query(sql, `SELECT id,first_name,last_name,address,longitude,latitude, address1, address2, post_code, created_at,updated_at FROM users WHERE id = '${user_id}' `).catch(console.log);
        
        var test = await helper.sql_query(sql, `SELECT Count(is_selected) as chk_flag FROM user_order_address WHERE is_selected = '1' AND user_id = '${user_id}' `).catch(console.log);
        var getAddress1 = {
            "id":chk_defaul_address[0].id,
            "first_name":chk_defaul_address[0].first_name,
            "last_name":chk_defaul_address[0].last_name,
            "landmark":chk_defaul_address[0].landmark,
            "address":chk_defaul_address[0].address,
            "longitude":chk_defaul_address[0].longitude,
            "latitude":chk_defaul_address[0].latitude,
            "address1":chk_defaul_address[0].address1,
            "address2":chk_defaul_address[0].address2,
            "post_code":chk_defaul_address[0].post_code,
            "is_selected": (test[0].chk_flag > 0) ? false : true,
            "created_at":chk_defaul_address[0].created_at,
            "updated_at":chk_defaul_address[0].updated_at,
        };
        response.push(getAddress1);

        var chk_address = await helper.sql_query(sql, `SELECT id,first_name,last_name,address,longitude,latitude, address1, address2, post_code, created_at,updated_at FROM users WHERE id = '${user_id}' `).catch(console.log);

        var query_text = `SELECT * FROM user_order_address WHERE user_id = '${user_id}'  Order by id ASC  `;
        sql.query(query_text,async function (err, data) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }   
            async.forEachOf(data, async (addressList, key, callback) => {  
               
                var getAddress = {
                    "id":addressList.id,
                    "first_name":addressList.first_name,
                    "last_name":addressList.last_name,
                    "landmark":addressList.landmark,
                    "address":addressList.address,
                    "longitude":addressList.longitude,
                    "latitude":addressList.latitude,
                    "address1":addressList.address1,
                    "address2":addressList.address2,
                    "post_code":addressList.post_code,
                    "is_selected":(addressList.is_selected == 1) ? true : false,
                    "created_at":addressList.created_at,
                    "updated_at":addressList.updated_at,
                };
                response.push(getAddress);
            }, err => {
                if (err) console.error(err.message);

                
            });

            response_arr['success'] = response_success;
            response_arr['msg'] = response_msg;
            response_arr['data'] = response;
            result(null, response_arr);
        });
    });

    }
};

Model.publicDeleteOrderAddressModel = async function publicDeleteOrderAddressModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];

    var user_id = (param.user_id) ? param.user_id : '';
    var address_id = (param.address_id) ? param.address_id : '';

    if(!user_id)
    {
        response_arr['msg'] = "User id is Required";
        result(null, response_arr);
    }

    var chk_user =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}' AND users.soft_delete = '0'`).catch(console.log);

    if(chk_user == '')
    {
        response_arr['msg'] = "User not found.";
        result(null, response_arr);
    }else{

    var query_text = `DELETE FROM user_order_address WHERE user_id = '${user_id}' AND id = '${address_id}' ;`;
    sql.query(query_text,async function (err, data1) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        if(data1.affectedRows > 0)
        {
            response_success = 1;
            response_msg = `Public Delete Order Address Cart Data Successfully!`;
        }else{
            response_success = 0;
            response_msg = `Public can not Delete Order Address .`;
        }

        var chk_address = await helper.sql_query(sql, `SELECT id,first_name,last_name,address,longitude,latitude, address1, address2, post_code,created_at,updated_at FROM users WHERE id = '${user_id}' `).catch(console.log);
        var test = await helper.sql_query(sql, `SELECT Count(is_selected) as chk_flag FROM user_order_address WHERE is_selected = '1' AND user_id = '${user_id}' `).catch(console.log);
        var getAddress2 = {
            "id":0,
            "first_name":chk_address[0].first_name,
            "last_name":chk_address[0].last_name,
            "landmark":'',
            "address":chk_address[0].address,
            "longitude":chk_address[0].longitude,
            "latitude":chk_address[0].latitude,
            "address1":chk_address[0].address1,
            "address2":chk_address[0].address2,
            "post_code":chk_address[0].post_code,
            "is_selected": (test[0].chk_flag > 0) ? false : true,
            "created_at":chk_address[0].created_at,
            "updated_at":chk_address[0].updated_at,
        };
        response.push(getAddress2);

        var query_text = `SELECT * FROM user_order_address WHERE user_id = '${user_id}' AND id != '${data1.insertId}'   `;
        sql.query(query_text,async function (err, data) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }   
            async.forEachOf(data, async (addressList, key, callback) => {  
                // var chk_selected_address = await helper.sql_query(sql, `SELECT MAX(id) FROM user_order_address WHERE id = '${user_id}' AND id='${data1.insertId}' `).catch(console.log);
                // console.log('chk_selected_address',chk_selected_address);
                var getAddress = {
                    "id":addressList.id,
                    "first_name":addressList.first_name,
                    "last_name":addressList.last_name,
                    "landmark":addressList.landmark,
                    "address":addressList.address,
                    "longitude":addressList.longitude,
                    "latitude":addressList.latitude,
                    "address1":addressList.address1,
                    "address2":addressList.address2,
                    "post_code":addressList.post_code,
                    "is_selected":(addressList.is_selected == 1 ) ? true : false ,
                    "created_at":addressList.created_at,
                    "updated_at":addressList.updated_at,
                };
                response.push(getAddress);
            }, err => {
                if (err) console.error(err.message);

            });

            response_arr['success'] = response_success;
            response_arr['msg'] = response_msg;
            response_arr['data'] = response;
            result(null, response_arr);
        });
    });

    }
};

Model.addCardModel = function addCardModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var response_arr = [];
    var user_id = (param.user_id) ? param.user_id : '';
    var stripeToken = (param.stripeToken) ? param.stripeToken : '';

    console.log(`Add Card : ${JSON.stringify(param)}`);

    var checkContact = "SELECT * FROM `users` WHERE id = ?";
    sql.query(checkContact, [user_id],async function (err, resData) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        if (resData.length > 0) {
            console.log(stripeToken);
                console.log('checkContact',resData);
                if(resData[0].stripe_customer_id == '')
                {
                    // new customer create and add Card
                    const customer = await stripe.customers.create({
                        name: resData[0].first_name+' '+resData[0].last_name,
                        email: resData[0].email,
                        phone: resData[0].contact_no,
                        source: stripeToken,
                    });
                    if(customer)
                    {
                        var add_register_id = await helper.sql_query(sql, `UPDATE users SET stripe_customer_id = '${customer.id}' WHERE id='${user_id}' `).catch(console.log);
                        response_arr['success'] = 1;
                        response_arr['msg'] = 'New Customer Create And Add Card Also.';
                        response_arr['data'] = customer;
                        result(null, response_arr);
                    }else{
                        response_arr['success'] = 1;
                        response_arr['msg'] = 'Customer Create time some error.';
                        result(null, response_arr);
                    }
                }else{
                    // Customer Already Add now Add only Card
                    customer_id = resData[0].stripe_customer_id;
                    console.log('customer_id',customer_id);
                    const card = await stripe.customers.createSource(customer_id,
                        {source: stripeToken}
                    );
                    console.log('card',card);
                    const customer = await stripe.customers.update(
                        resData[0].stripe_customer_id,
                        {source: card.id}
                    );
                    if(card)
                    {
                        response_arr['success'] = 1;
                        response_arr['msg'] = 'Your Paymnet card Added Successfully';
                        response_arr['data'] = card;
                        result(null, response_arr);
                    }else{
                        response_arr['success'] = 1;
                        response_arr['msg'] = 'Your Paymnet card not Added';
                        result(null, response_arr);
                    }
                }
        } else {
            response_arr['msg'] = 'Card not add .';
            result(null, response_arr);
        }
    });
};

Model.cardshowModel = function cardshowModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var response_arr = [];
    var user_id = (param.user_id) ? param.user_id : '';
    console.log(`Show Card param : ${JSON.stringify(param)}`);
    var checkContact = "SELECT * FROM `users` WHERE id = ?";
    sql.query(checkContact, [user_id],async function (err, resData) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        if (resData[0].stripe_customer_id != '') {
                const cards = await stripe.customers.listSources(
                    resData[0].stripe_customer_id,
                    {object: 'card', limit: 5}
                );
                if (cards.data != '') {
                    var creditCards = { 'creditCards':cards.data }
                    response_arr['success'] = 1;
                    response_arr['msg'] = 'User Payment card get Successfully.';
                    response_arr['showCard'] = creditCards;
                    result(null, response_arr);
                } else {
                    response_arr['msg'] = 'User Payment card not Availabel.';
                    result(null, response_arr);
                }
        } else {
            response_arr['msg'] = 'User can not register in payment module ! .';
            result(null, response_arr);
        }
    });
};

Model.cardDeleteModel = async function cardDeleteModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var response_arr = [];

    var user_id = (param.user_id) ? param.user_id : '';
    var card_id = (param.card_id) ? param.card_id : '';

    console.log(`Delete Card : ${JSON.stringify(param)}`);

    var checkContact = "SELECT * FROM `users` WHERE id = ?";
    sql.query(checkContact, [user_id],async function(err, resData) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        if (resData.length > 0) {
            const deletedCard = await stripe.customers.deleteSource(
                resData[0].stripe_customer_id,
                card_id
            );
            console.log('deletedCard',deletedCard);
            if(deletedCard.deleted == true)
            {
                response_arr['success'] = 1;
                response_arr['msg'] = 'Delete Card Successfully.';
                // response_arr['token'] = resPaymentMethod;
                result(null, response_arr);
            }else{
                response_arr['msg'] = 'Card can not Deleted ';
                // response_arr['token'] = resPaymentMethod;
                result(null, response_arr);
            }
        }else{
            response_arr['msg'] = 'data not found';
            // response_arr['token'] = resPaymentMethod;
            result(null, response_arr);
        }
    });

};

Model.publicCheckoutBuyModel = async function publicCheckoutBuyModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];

    var user_id = (param.user_id) ? param.user_id : '';
    var amount1 = (param.amount) ? param.amount : '';
    var delivery_address = (param.delivery_address) ? param.delivery_address : '';
    var payment_mode = (param.payment_mode) ? param.payment_mode : '';
    var order_detail = (param.order_detail) ? param.order_detail : '';
    var cart_data = (param.cart_data) ? param.cart_data : '';
    var card_id = (param.card_id) ? param.card_id : ''; 
    var amount = Math.round(amount1 * 100);
     //console.log('Buy Now: ',param);
     if(!user_id)
     {
         response_arr['msg'] = "User id is Required";
         result(null, response_arr);
     }else{
        var insert_order_data = {
            "user_id": user_id,
            "amount": amount,
            "delivery_address": delivery_address,
            "payment_mode": payment_mode,
            "order_status": '',
            "created_at": today,
        }
        if(payment_mode == 'COD')
        {
            var payment = 'Success';
        }else if(payment_mode == 'STRIPE') {
            var getUserInfo =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${user_id}' `).catch(console.log);
            console.log(getUserInfo);
            if(getUserInfo[0].stripe_customer_id != '')
                {
                    const cardRetrieve = await stripe.customers.retrieveSource(
                        getUserInfo[0].stripe_customer_id,
                        card_id
                    );
                    if(cardRetrieve)
                    {
                        const charge = await stripe.charges.create({
                            amount: amount,     // Charing Rs 25 , particular Order wise
                            description: 'Product Buy',
                            currency: 'USD',
                            customer: getUserInfo[0].stripe_customer_id,
                            source: card_id,//'card_1ItyLmAxiqx6YNN6JNojOOPF'
                        });
                        if(charge)
                        {
                            insert_order_data.stripe_customer_id = charge.id;
                            var payment = 'Success'; 
                        }
                    }else{
                        response_arr['msg'] = "register user card not valid OR user not valid.";
                        result(null, response_arr);
                    }
                }else{
                    response_arr['msg'] = "register user on stripe payment gatway.";
                    result(null, response_arr);
                }
        }else{

        }
        console.log('payment',payment);
        if(payment =='Success' )
        {
            var query_text = `INSERT INTO final_order SET ?;`;
            sql.query(query_text, [insert_order_data], function (err, add_order) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }      
                if (add_order.affectedRows > 0) {
                
                    var get_order_data = JSON.parse(order_detail);
                    // var get_order_data = order_detail;
                    var order_values = [];
                    for(var i=0; i< get_order_data.length; i++)
                    {
                        // if(!get_order_data[i].id)
                        // {
                            
                        // }
                        get_order_data[i].final_order_id = add_order.insertId;
                        get_order_data[i].created_at = today;
                        get_order_data[i].product_delivery_status = '';
                        order_values.push([get_order_data[i].final_order_id,get_order_data[i].mosque_id,get_order_data[i].product_id,get_order_data[i].quantity,get_order_data[i].price,get_order_data[i].total_amount,get_order_data[i].product_delivery_status,get_order_data[i].created_at] );
                    }

                    var q = sql.query('INSERT INTO final_order_item(final_order_id ,mosque_id, product_id, quantity, price, total_amount,product_delivery_status, created_at ) VALUES ?', [order_values],async function(err,resOrder) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }      
                        if (resOrder.affectedRows > 0) {

                            if(cart_data == 1)
                            {
                                var deleteCart =  await helper.sql_query(sql, `DELETE FROM cart WHERE user_id = '${user_id}' `).catch(console.log);
                            }

                            var query_text = "SELECT final_order.id,users.user_role,final_order.user_id,users.first_name,users.last_name,final_order.amount,final_order.delivery_address,final_order.payment_mode, final_order.order_status,final_order.created_at FROM final_order LEFT JOIN users ON users.id = final_order.user_id WHERE final_order.id = ?";
                            sql.query(query_text, [add_order.insertId], function(err, getFinalOrderDetail) {
                                if (err) {
                                    console.log("error: ", err);
                                    result(err, null);
                                }
                                var getOrderList = [];
                                if(getFinalOrderDetail.length > 0)
                                {
                                    var query_text = "SELECT final_order_item.id,users.user_role,final_order_item.mosque_id,users.mosque_name,users.first_name,users.last_name,final_order_item.product_id,mosque_products.product_name,final_order_item.quantity,final_order_item.price,mosque_products.pick_address,mosque_products.allow_pick_and_collect_option,mosque_products.delivery_detail,mosque_products.cost_of_delivery,final_order_item.total_amount,final_order_item.product_delivery_status,final_order_item.created_at FROM final_order_item LEFT JOIN users ON users.id = final_order_item.mosque_id LEFT JOIN mosque_products ON mosque_products.id = final_order_item.product_id WHERE final_order_item.final_order_id = ?";
                                    sql.query(query_text, [getFinalOrderDetail[0].id], function(err, getOrderItem) {
                                        if (err) {
                                            console.log("error: ", err);
                                            result(err, null);
                                        }
                                        async.forEachOf(getOrderItem, async (orderItemList, key, callback) => {
                                            // console.log('orderItemList',orderItemList);
                                            var orderItem = {
                                                "order_item_id":orderItemList.id,
                                                "user_role":orderItemList.user_role,
                                                "mosque_id":orderItemList.mosque_id,
                                                "mosque_name":orderItemList.mosque_name,
                                                "first_name":orderItemList.first_name,
                                                "last_name":orderItemList.last_name,
                                                "product_id":orderItemList.product_id,
                                                "product_name":orderItemList.product_name,
                                                "pick_address":orderItemList.pick_address,
                                                "allow_pick_and_collect_option":orderItemList.allow_pick_and_collect_option,
                                                "delivery_detail":orderItemList.delivery_detail,
                                                "cost_of_delivery":parseFloat(orderItemList.cost_of_delivery).toFixed(2),
                                                "quantity":orderItemList.quantity,
                                                "price":parseFloat(orderItemList.price).toFixed(2),
                                                "total_amount":parseFloat(orderItemList.total_amount).toFixed(2),
                                                "product_delivery_status":orderItemList.product_delivery_status,
                                                "created_at":orderItemList.created_at,
                                            };

                                            // console.log('orderItemList.mosque_id',orderItemList.mosque_id);
                                        //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                                        var tparam = {
                                            'user_ids': [orderItemList.mosque_id], // Registration Token For multiple users
                                        };
                                        helper.get_registration_token(tparam,async function (res) {
                                            // console.log("res",res);
                                            // if (res.length > 0) {
                                                var regTokens = (res.length > 0) ? res.map(res => res.token) : [];
                                                // Send Notification Message : Start

                                                // var set_body = `${first_name} ${last_name} wants to hire you at ${work_start_date} ${work_timing}.`;
                                                var loginUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${user_id}' `).catch(console.log);
                                                var set_body = `User @${loginUser[0].first_name} ${loginUser[0].last_name} place order on your store.`; 
                                                var send_param = {
                                                    'registration_token': regTokens,
                                                    'title': appName,
                                                    'body': set_body,
                                                    'extra_data': {
                                                        "activity": 'placeOrder',
                                                        "user_id": user_id,
                                                        "mosque_id": orderItemList.mosque_id,
                                                        "order_id": orderItemList.id,
                                                    }
                                                };
                                                // console.log(send_param);
                                                helper.send_notification(send_param, function (send_res) {
                                                    // Save Notification Message in DB : Start
                                                    var notify_params = {
                                                        'user_id': orderItemList.mosque_id,
                                                        'from_id': user_id,
                                                        // "order_id": resOrder.insertId,
                                                        "activity": 'placeOrder',
                                                        'noti_type': 2,
                                                        'description': set_body,
                                                        'created_at': today,
                                                    }
                                                    helper.save_notification(notify_params);                                    
                                                });
                                                // Send Notification Message : End      
                                            // }
                                        });
                                        //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::

                                        getOrderList.push(orderItem);
                                        }, err => {
                                            if (err) console.error(err.message);
                                        
                                            var final_order = {
                                                "order_id":getFinalOrderDetail[0].id,
                                                "user_role":getFinalOrderDetail[0].user_role,
                                                "user_id":getFinalOrderDetail[0].user_id,
                                                "first_name":getFinalOrderDetail[0].first_name,
                                                "last_name":getFinalOrderDetail[0].last_name,
                                                "user_id":getFinalOrderDetail[0].user_id,
                                                "amount":parseFloat(getFinalOrderDetail[0].amount).toFixed(2),
                                                "delivery_address":getFinalOrderDetail[0].delivery_address,
                                                "payment_mode":getFinalOrderDetail[0].payment_mode,
                                                "order_status":getFinalOrderDetail[0].order_status,
                                                "created_at":getFinalOrderDetail[0].created_at,
                                                "order_item":getOrderList,
                                            };
                                            response_arr['success'] = 1;
                                            response_arr['msg'] = `Add Order Successfully!`;
                                            response_arr['data'] = final_order;
                                            result(null, response_arr);
                                        });
                                    });
                                    
                                }
                            });
                            
                            
                            // var getOrderDetail =  await helper.sql_query(sql, `SELECT * FROM final_order_item WHERE id = '${resOrder.insertId}' `).catch(console.log);
                            // if(getOrderDetail)
                            // {
                            //     console.log('getOrderDetail',get_order_data);
                                
                                
                                
                                
                            // }
                        }else{
                            response_arr['msg'] = "Order added failed!";
                            result(null, response_arr);    
                        }
                    });
                }
            });
        }else{
            response_arr['msg']     = 'Payment Method not choose proper.';
            // response_arr['data'] = chatInfo,
            result(null, response_arr);
        }
    }
}

Model.publicCheckoutBuyModel_24_05_2021 = async function publicCheckoutBuyModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];

    var user_id = (param.user_id) ? param.user_id : '';
    var amount1 = (param.amount) ? param.amount : '';
    var delivery_address = (param.delivery_address) ? param.delivery_address : '';
    var payment_mode = (param.payment_mode) ? param.payment_mode : '';
    var order_detail = (param.order_detail) ? param.order_detail : '';
    var cart_data = (param.cart_data) ? param.cart_data : '';
    // var cart_data = (param.stripeToken) ? param.stripeToken : '';
    
     //console.log('Buy Now: ',param);
    if(!user_id)
    {
        response_arr['msg'] = "User id is Required";
        result(null, response_arr);
    }
    var getUserInfo =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${user_id}' `).catch(console.log);
	console.log(getUserInfo);
    console.log('amount'.amount);
    var amount = Math.round(amount1 * 100);
    stripe.customers.create({
        email: getUserInfo[0].email,//req.body.stripeEmail, // customer email
        source: param.stripeToken,//'tok_1IlpI5GAYWqSYyB4NDXAt68K',//req.body.stripeToken, // token for the card 
        name: getUserInfo[0].first_name+' '+getUserInfo[0].last_name,
        phone: getUserInfo[0].mobile_no,
        address: {
            line1: delivery_address,
            postal_code: getUserInfo[0].post_code,
            // city: 'Indore',
            // state: 'Madhya Pradesh',
            // country: 'India',
        }
    })
    .then((customer) => {
        // stripe_customer_id = customer.id;
        return stripe.charges.create({
            amount: amount,     // Charing Rs 25 , particular Order wise
            description: 'Product Buy',
            currency: 'USD',
            customer: customer.id,
        });
    })
    .then((charge) => {
        // result.send("Success")  // If no error occurs
        
        // console.log('stripe_customer_id',stripe_customer_id);
        // console.log('charge',charge);
        
        var insert_order_data = {
            "user_id": user_id,
            "amount": amount,
            "delivery_address": delivery_address,
            "payment_mode": payment_mode,
            "order_status": '',
            // "stripe_customer_id":stripe_customer_id,
            "created_at": today,
        }
        var query_text = `INSERT INTO final_order SET ?;`;
        sql.query(query_text, [insert_order_data], function (err, add_order) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }      
            if (add_order.affectedRows > 0) {
            
                var get_order_data = JSON.parse(order_detail);
                // var get_order_data = order_detail;
                var order_values = [];
                for(var i=0; i< get_order_data.length; i++)
                {
                    // if(!get_order_data[i].id)
                    // {
                        
                    // }
                    get_order_data[i].final_order_id = add_order.insertId;
                    get_order_data[i].created_at = today;
                    get_order_data[i].product_delivery_status = '';
                    order_values.push([get_order_data[i].final_order_id,get_order_data[i].mosque_id,get_order_data[i].product_id,get_order_data[i].quantity,get_order_data[i].price,get_order_data[i].total_amount,get_order_data[i].product_delivery_status,get_order_data[i].created_at] );
                }

                var q = sql.query('INSERT INTO final_order_item(final_order_id ,mosque_id, product_id, quantity, price, total_amount,product_delivery_status, created_at ) VALUES ?', [order_values],async function(err,resOrder) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }      
                    if (resOrder.affectedRows > 0) {

                        if(cart_data == 1)
                        {
                            var deleteCart =  await helper.sql_query(sql, `DELETE FROM cart WHERE user_id = '${user_id}' `).catch(console.log);
                        }

                        var query_text = "SELECT final_order.id,users.user_role,final_order.user_id,users.first_name,users.last_name,final_order.amount,final_order.delivery_address,final_order.payment_mode, final_order.order_status,final_order.created_at FROM final_order LEFT JOIN users ON users.id = final_order.user_id WHERE final_order.id = ?";
                        sql.query(query_text, [add_order.insertId], function(err, getFinalOrderDetail) {
                            if (err) {
                                console.log("error: ", err);
                                result(err, null);
                            }
                            var getOrderList = [];
                            if(getFinalOrderDetail.length > 0)
                            {
                                var query_text = "SELECT final_order_item.id,users.user_role,final_order_item.mosque_id,users.mosque_name,users.first_name,users.last_name,final_order_item.product_id,mosque_products.product_name,final_order_item.quantity,final_order_item.price,mosque_products.pick_address,mosque_products.allow_pick_and_collect_option,mosque_products.delivery_detail,mosque_products.cost_of_delivery,final_order_item.total_amount,final_order_item.product_delivery_status,final_order_item.created_at FROM final_order_item LEFT JOIN users ON users.id = final_order_item.mosque_id LEFT JOIN mosque_products ON mosque_products.id = final_order_item.product_id WHERE final_order_item.final_order_id = ?";
                                sql.query(query_text, [getFinalOrderDetail[0].id], function(err, getOrderItem) {
                                    if (err) {
                                        console.log("error: ", err);
                                        result(err, null);
                                    }
                                    async.forEachOf(getOrderItem, async (orderItemList, key, callback) => {
                                        // console.log('orderItemList',orderItemList);
                                        var orderItem = {
                                            "order_item_id":orderItemList.id,
                                            "user_role":orderItemList.user_role,
                                            "mosque_id":orderItemList.mosque_id,
                                            "mosque_name":orderItemList.mosque_name,
                                            "first_name":orderItemList.first_name,
                                            "last_name":orderItemList.last_name,
                                            "product_id":orderItemList.product_id,
                                            "product_name":orderItemList.product_name,
                                            "pick_address":orderItemList.pick_address,
                                            "allow_pick_and_collect_option":orderItemList.allow_pick_and_collect_option,
                                            "delivery_detail":orderItemList.delivery_detail,
                                            "cost_of_delivery":parseFloat(orderItemList.cost_of_delivery).toFixed(2),
                                            "quantity":orderItemList.quantity,
                                            "price":parseFloat(orderItemList.price).toFixed(2),
                                            "total_amount":parseFloat(orderItemList.total_amount).toFixed(2),
                                            "product_delivery_status":orderItemList.product_delivery_status,
                                            "created_at":orderItemList.created_at,
                                        };

                                        // console.log('orderItemList.mosque_id',orderItemList.mosque_id);
                                    //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                                    var tparam = {
                                        'user_ids': [orderItemList.mosque_id], // Registration Token For multiple users
                                    };
                                    helper.get_registration_token(tparam,async function (res) {
                                        // console.log("res",res);
                                        // if (res.length > 0) {
                                            var regTokens = (res.length > 0) ? res.map(res => res.token) : [];
                                            // Send Notification Message : Start

                                            // var set_body = `${first_name} ${last_name} wants to hire you at ${work_start_date} ${work_timing}.`;
                                            var loginUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${user_id}' `).catch(console.log);
                                            var set_body = `User @${loginUser[0].first_name} ${loginUser[0].last_name} place order on your store.`; 
                                            var send_param = {
                                                'registration_token': regTokens,
                                                'title': appName,
                                                'body': set_body,
                                                'extra_data': {
                                                    "activity": 'placeOrder',
                                                    "user_id": user_id,
                                                    "mosque_id": orderItemList.mosque_id,
                                                    "order_id": orderItemList.id,
                                                }
                                            };
                                            // console.log(send_param);
                                            helper.send_notification(send_param, function (send_res) {
                                                // Save Notification Message in DB : Start
                                                var notify_params = {
                                                    'user_id': orderItemList.mosque_id,
                                                    'from_id': user_id,
                                                    // "order_id": resOrder.insertId,
                                                    "activity": 'placeOrder',
                                                    'noti_type': 2,
                                                    'description': set_body,
                                                    'created_at': today,
                                                }
                                                helper.save_notification(notify_params);                                    
                                            });
                                            // Send Notification Message : End      
                                        // }
                                    });
                                    //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::

                                    getOrderList.push(orderItem);
                                    }, err => {
                                        if (err) console.error(err.message);
                                    
                                        var final_order = {
                                            "order_id":getFinalOrderDetail[0].id,
                                            "user_role":getFinalOrderDetail[0].user_role,
                                            "user_id":getFinalOrderDetail[0].user_id,
                                            "first_name":getFinalOrderDetail[0].first_name,
                                            "last_name":getFinalOrderDetail[0].last_name,
                                            "user_id":getFinalOrderDetail[0].user_id,
                                            "amount":parseFloat(getFinalOrderDetail[0].amount).toFixed(2),
                                            "delivery_address":getFinalOrderDetail[0].delivery_address,
                                            "payment_mode":getFinalOrderDetail[0].payment_mode,
                                            "order_status":getFinalOrderDetail[0].order_status,
                                            "created_at":getFinalOrderDetail[0].created_at,
                                            "order_item":getOrderList,
                                        };
                                        response_arr['success'] = 1;
                                        response_arr['msg'] = `Add Order Successfully!`;
                                        response_arr['data'] = final_order;
                                        result(null, response_arr);
                                    });
                                });
                                
                            }
                        });
                        
                        
                        // var getOrderDetail =  await helper.sql_query(sql, `SELECT * FROM final_order_item WHERE id = '${resOrder.insertId}' `).catch(console.log);
                        // if(getOrderDetail)
                        // {
                        //     console.log('getOrderDetail',get_order_data);
                            
                            
                            
                            
                        // }
                    }else{
                        response_arr['msg'] = "Order added failed!";
                        result(null, response_arr);    
                    }
                });
            }
        });
    })
    .catch((err) => {
        // result.send(err)       // If some error occurs
        // response_arr['success'] = 1;
        console.log('err',err);
        response_arr['msg']     = err;
        // response_arr['data'] = chatInfo,
        result(null, response_arr);
    });
    
}

Model.publicOrderItemModel = async function publicOrderItemModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];

    var user_id = (param.user_id) ? param.user_id : '';
    
    var next_id = (param.next_id) ? param.next_id : 0;
	var last_id = parseInt(next_id) + 20;

    var next_arr = [];

    console.log('My Order : ',param);
    if(!user_id)
    {
        response_arr['msg'] = "User id is Required";
        result(null, response_arr);
    }

        var query_text = `SELECT final_order_item.id as order_item_id,users.user_role,final_order_item.mosque_id,users.mosque_name,users.first_name,users.last_name,final_order.delivery_address,final_order.payment_mode,final_order_item.product_id,mosque_products.product_name,mosque_products.pick_address,mosque_products.allow_pick_and_collect_option,mosque_products.delivery_detail,mosque_products.cost_of_delivery,final_order_item.quantity,final_order_item.price,final_order_item.total_amount,final_order_item.product_delivery_status,final_order_item.created_at FROM final_order_item LEFT JOIN users ON users.id = final_order_item.mosque_id LEFT JOIN mosque_products ON mosque_products.id = final_order_item.product_id LEFT JOIN final_order ON final_order.id = final_order_item.final_order_id WHERE final_order.user_id = '${user_id}' order by final_order_item.id DESC LIMIT 20 OFFSET ${parseInt(next_id)}`;
        sql.query(query_text, function(err, getFinalOrderDetail) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            var getOrderList = [];
            var final_response = [];
            if(getFinalOrderDetail.length > 0)
            {
                async.forEachOf(getFinalOrderDetail, async (orderItem, key, callback) => {
                    
                        orderItem.price=parseFloat(orderItem.price).toFixed(2);
                        orderItem.total_amount=parseFloat(orderItem.total_amount).toFixed(2);
                        orderItem.cost_of_delivery=parseFloat(orderItem.cost_of_delivery).toFixed(2);
                    
                        var projectImages =  await helper.sql_query(sql, `SELECT id,CASE WHEN file!='' THEN CONCAT('${fullUrl}/products/',file) ELSE '' END AS file, status, created_at, updated_at FROM images WHERE type = '2' AND ref_id = '${orderItem.product_id}'`).catch(console.log);
                        
                        orderItem.image = projectImages;
                    
                    // var final_order = {
                    //     "order_id":getFinalOrderList.id,
                    //     "user_role":getFinalOrderList.user_role,
                    //     "user_id":getFinalOrderList.user_id,
                    //     "first_name":getFinalOrderList.first_name,
                    //     "last_name":getFinalOrderList.last_name,
                    //     "user_profile":getFinalOrderList.profile_photo,
                    //     "amount":getFinalOrderList.amount,//parseInt(getFinalOrderList.amount)
                    //     "delivery_address":getFinalOrderList.delivery_address,
                    //     "payment_mode":getFinalOrderList.payment_mode,
                    //     "order_status":getFinalOrderList.order_status,
                    //     "created_at":getFinalOrderList.created_at,
                    //     "order_item":orderItem,
                    // };

                    final_response.push(orderItem);
                    // console.log('final_response',final_response);
                }, err => {
                    if (err) console.error(err.message);

                        var query_text1 = `SELECT final_order_item.id as order_item_id,users.user_role,final_order_item.mosque_id,users.mosque_name,users.first_name,users.last_name,final_order_item.product_id,mosque_products.product_name,mosque_products.pick_address,mosque_products.allow_pick_and_collect_option,mosque_products.delivery_detail,mosque_products.cost_of_delivery,final_order_item.quantity,final_order_item.price,final_order_item.total_amount,final_order_item.product_delivery_status,final_order_item.created_at FROM final_order_item LEFT JOIN users ON users.id = final_order_item.mosque_id LEFT JOIN mosque_products ON mosque_products.id = final_order_item.product_id LEFT JOIN final_order ON final_order.id = final_order_item.final_order_id WHERE final_order.user_id = '${user_id}' order by final_order_item.id DESC ;`;
                        sql.query(query_text1, function(err, res1) {
                            if(err) {
                                console.log("error: ", err);
                                result(err, null);
                            }
        
                            var total = res1.length;
                            if(last_id > total) {
                                last_id = total;
                            }
        
                            var nextInfo = {
                                'total': total,
                                'next_id': last_id
                            }
                            // console.log('nextInfo',nextInfo);
                            next_arr.push(nextInfo);
        
                            response_arr['success'] = 1;
                            response_arr['msg'] = `Get My Order Successfully!`;
                            response_arr['data'] = final_response;
                            response_arr['next']    = nextInfo;
                            result(null, response_arr);
                            
                        });
                    
                });
            }else{
                response_arr['msg'] = `Can't Get Order Data `;
                result(null, response_arr);
            }
        });    
}

Model.publicMyOrderModel = async function publicMyOrderModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];

    var user_id = (param.user_id) ? param.user_id : '';
    
    var next_id = (param.next_id) ? param.next_id : 0;
	var last_id = parseInt(next_id) + 20;

    var next_arr = [];

    console.log('My Order : ',param);
    if(!user_id)
    {
        response_arr['msg'] = "User id is Required";
        result(null, response_arr);
    }

        var query_text = `SELECT final_order.id,users.user_role,final_order.user_id,users.first_name,users.last_name,case when users.profile_photo != '' then CONCAT('${fullUrl}/uploadsProfile/', users.profile_photo) else '' end as profile_photo ,final_order.amount,final_order.delivery_address,final_order.payment_mode, final_order.order_status,final_order.created_at FROM final_order LEFT JOIN users ON users.id = final_order.user_id WHERE final_order.user_id = '${user_id}' order by final_order.id DESC LIMIT 20 OFFSET ${parseInt(next_id)}`;
        sql.query(query_text, function(err, getFinalOrderDetail) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            var getOrderList = [];
            var final_response = [];
            if(getFinalOrderDetail.length > 0)
            {
                async.forEachOf(getFinalOrderDetail, async (getFinalOrderList, key, callback) => {
                    // console.log('getFinalOrderDetail',getFinalOrderList);
                    // var orderItem = [];
                    /*var query_text = "SELECT final_order_item.id,users.user_role,final_order_item.mosque_id,users.mosque_name,users.first_name,users.last_name,final_order_item.product_id,mosque_products.product_name,final_order_item.quantity,final_order_item.price,final_order_item.total_amount,final_order_item.created_at FROM final_order_item LEFT JOIN users ON users.id = final_order_item.mosque_id LEFT JOIN mosque_products ON mosque_products.id = final_order_item.product_id WHERE final_order_item.final_order_id = ?";
                    sql.query(query_text, [getFinalOrderList.id], function(err, getOrderItem) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }
                        async.forEachOf(getOrderItem, async (orderItemList, key, callback) => {
                            // console.log('orderItemList',orderItemList);
                             orderItem = {
                                "order_item_id":orderItemList.id,
                                "user_role":orderItemList.user_role,
                                "mosque_id":orderItemList.mosque_id,
                                "mosque_name":orderItemList.mosque_name,
                                "first_name":orderItemList.first_name,
                                "last_name":orderItemList.last_name,
                                "product_id":orderItemList.product_id,
                                "product_name":orderItemList.product_name,
                                "quantity":orderItemList.quantity,
                                "price":parseInt(orderItemList.price),
                                "total_amount":parseInt(orderItemList.total_amount),
                                "created_at":orderItemList.created_at,
                            };

                            getOrderList.push(orderItem);
                            console.log('getOrderList',getOrderList);
                        });
                    });*/
                    
                    var orderItem =  await helper.sql_query(sql, `SELECT final_order_item.id as order_item_id,users.user_role,final_order_item.mosque_id,users.mosque_name,users.first_name,users.last_name,final_order_item.product_id,mosque_products.product_name,mosque_products.pick_address,mosque_products.allow_pick_and_collect_option,mosque_products.delivery_detail,mosque_products.cost_of_delivery,final_order_item.quantity,final_order_item.price,final_order_item.total_amount,final_order_item.product_delivery_status,final_order_item.created_at FROM final_order_item LEFT JOIN users ON users.id = final_order_item.mosque_id LEFT JOIN mosque_products ON mosque_products.id = final_order_item.product_id WHERE final_order_item.final_order_id = '${getFinalOrderList.id}' order by final_order_item.id DESC `).catch(console.log);
                    for( var i=0; i < orderItem.length; i++)
                    {
                        orderItem[i].price=parseInt(orderItem[i].price);
                        orderItem[i].total_amount=parseInt(orderItem[i].total_amount);
                    
                        var projectImages =  await helper.sql_query(sql, `SELECT id,CASE WHEN file!='' THEN CONCAT('${fullUrl}/products/',file) ELSE '' END AS file, status, created_at, updated_at FROM images WHERE type = '2' AND ref_id = '${orderItem[i].product_id}'`).catch(console.log);
                        
                        orderItem[i].image = projectImages;
                    }

                    var final_order = {
                        "order_id":getFinalOrderList.id,
                        "user_role":getFinalOrderList.user_role,
                        "user_id":getFinalOrderList.user_id,
                        "first_name":getFinalOrderList.first_name,
                        "last_name":getFinalOrderList.last_name,
                        "user_profile":getFinalOrderList.profile_photo,
                        "amount":getFinalOrderList.amount,//parseInt(getFinalOrderList.amount)
                        "delivery_address":getFinalOrderList.delivery_address,
                        "payment_mode":getFinalOrderList.payment_mode,
                        "order_status":getFinalOrderList.order_status,
                        "created_at":getFinalOrderList.created_at,
                        "order_item":orderItem,
                    };

                    final_response.push(final_order);
                    // console.log('final_response',final_response);
                }, err => {
                    if (err) console.error(err.message);

                    var query_text = `SELECT final_order.id,users.user_role,final_order.user_id,users.first_name,users.last_name,case when users.profile_photo != '' then CONCAT('${fullUrl}/uploadsProfile/', users.profile_photo) else '' end as profile_photo ,final_order.amount,final_order.delivery_address,final_order.payment_mode, final_order.order_status,final_order.created_at FROM final_order LEFT JOIN users ON users.id = final_order.user_id WHERE final_order.user_id = '${user_id}' order by final_order.id DESC;`;
                    sql.query(query_text, [], function(err, res) {
                        if(err) {
                            console.log("error: ", err);
                            result(err, null);
                        }
    
                        var total = res.length;
                        if(last_id > total) {
                            last_id = total;
                        }
    
                        var nextInfo = {
                            'total': total,
                            'next_id': last_id
                        }
                        // console.log('nextInfo',nextInfo);
                        next_arr.push(nextInfo);
    
                        response_arr['success'] = 1;
                        response_arr['msg'] = `Get My Order Successfully!`;
                        response_arr['data'] = final_response;
                        response_arr['next']    = nextInfo;
                        result(null, response_arr);
                        
                    });
                    
                });
            }else{
                response_arr['msg'] = `Can't Get Order Data `;
                result(null, response_arr);
            }
        });
               
        
    
    
}

Model.publicOrderDetailModel = async function publicOrderDetailModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];

    var user_id = (param.user_id) ? param.user_id : '';
    var order_id = (param.order_id) ? param.order_id : '';
    
    console.log('Order Detail: ',param);
    // if(!user_id)
    // {
    //     response_arr['msg'] = "User id is Required";
    //     result(null, response_arr);
    // }
            var query_text = "SELECT final_order.id,users.user_role,final_order.user_id,users.first_name,users.last_name,final_order.amount,final_order.delivery_address,final_order.payment_mode, final_order.order_status,final_order.created_at FROM final_order LEFT JOIN users ON users.id = final_order.user_id WHERE final_order.id = ?";
            sql.query(query_text, [order_id], function(err, getFinalOrderDetail) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                var getOrderList = [];
                if(getFinalOrderDetail.length > 0)
                {
                    var query_text = "SELECT final_order_item.id,users.user_role,final_order_item.mosque_id,users.mosque_name,users.first_name,users.last_name,final_order_item.product_id,mosque_products.product_name,mosque_products.pick_address,mosque_products.allow_pick_and_collect_option,mosque_products.delivery_detail,mosque_products.cost_of_delivery,final_order_item.quantity,final_order_item.price,final_order_item.total_amount,final_order_item.product_delivery_status,final_order_item.created_at FROM final_order_item LEFT JOIN users ON users.id = final_order_item.mosque_id LEFT JOIN mosque_products ON mosque_products.id = final_order_item.product_id WHERE final_order_item.final_order_id = ?";
                    sql.query(query_text, [getFinalOrderDetail[0].id], function(err, getOrderItem) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }
                        async.forEachOf(getOrderItem, async (orderItemList, key, callback) => {
                            var projectImages =  await helper.sql_query(sql, `SELECT id,CASE WHEN file!='' THEN CONCAT('${fullUrl}/products/',file) ELSE '' END AS file, status, created_at, updated_at FROM images WHERE type = '2' AND ref_id = '${orderItemList.product_id}'`).catch(console.log);
                        
                            // orderItemList[i].image = projectImages;
                            
                            console.log('orderItemList',orderItemList);
                            var orderItem = {
                                "order_item_id":orderItemList.id,
                                "user_role":orderItemList.user_role,
                                "mosque_id":orderItemList.mosque_id,
                                "mosque_name":orderItemList.mosque_name,
                                "first_name":orderItemList.first_name,
                                "last_name":orderItemList.last_name,
                                "product_id":orderItemList.product_id,
                                "product_name":orderItemList.product_name,
                                "pick_address":orderItemList.pick_address,
                                "allow_pick_and_collect_option":orderItemList.allow_pick_and_collect_option,
                                "delivery_detail":orderItemList.delivery_detail,
                                "cost_of_delivery":orderItemList.cost_of_delivery,
                                "quantity":orderItemList.quantity,
                                "price":parseInt(orderItemList.price),
                                "total_amount":parseInt(orderItemList.total_amount),
                                "product_delivery_status":orderItemList.product_delivery_status,
                                "product_image":projectImages,
                                "created_at":orderItemList.created_at,
                            };

                        getOrderList.push(orderItem);
                        }, err => {
                            if (err) console.error(err.message);
                            
                            var final_order = {
                                "order_id":getFinalOrderDetail[0].id,
                                "user_role":getFinalOrderDetail[0].user_role,
                                "user_id":getFinalOrderDetail[0].user_id,
                                "first_name":getFinalOrderDetail[0].first_name,
                                "last_name":getFinalOrderDetail[0].last_name,
                                "user_id":getFinalOrderDetail[0].user_id,
                                "amount":parseInt(getFinalOrderDetail[0].amount),
                                "delivery_address":getFinalOrderDetail[0].delivery_address,
                                "payment_mode":getFinalOrderDetail[0].payment_mode,
                                "order_status":getFinalOrderDetail[0].order_status,
                                "created_at":getFinalOrderDetail[0].created_at,
                                "order_item":getOrderList,
                            };
                            response_arr['success'] = 1;
                            response_arr['msg'] = `Get Order Detail Successfully!`;
                            response_arr['data'] = final_order;
                            result(null, response_arr);
                        });
                    });
                    
                }else{
                    response_arr['msg'] = `Can't get Order Detail`;
                    result(null, response_arr);
                }
            });
              
  
}

Model.publicMyDonationsModel = async function publicMyDonationsModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];

    var user_id = (param.user_id) ? param.user_id : '';
    
    var next_id = (param.next_id) ? param.next_id : 0;
	var last_id = parseInt(next_id) + 20;

    var next_arr = [];
    
    console.log('My Donations : ',param);
    if(!user_id)
    {
        response_arr['msg'] = "User id is Required";
        result(null, response_arr);
    }

        var query_text = `SELECT donations.id as donation_id,donations.project_id,mosque_projects.project_title,donations.public_id,donations.mosque_id,users.mosque_name,users.first_name,users.last_name, case when users.profile_photo != '' then CONCAT('${fullUrl}/uploadsProfilePhoto/', users.profile_photo) else '' end as profile_photo ,donations.amount,donations.auto_donation,DATE_FORMAT(donations.created_at,'%d-%m-%Y') as created_at FROM donations LEFT JOIN users ON users.id = donations.mosque_id LEFT JOIN mosque_projects ON mosque_projects.id = donations.project_id WHERE donations.public_id = '${user_id}' order by donation_id DESC LIMIT 20 OFFSET ${parseInt(next_id)}`;
        sql.query(query_text, function(err, getDonation) {
            if (err) {
                console.log("error: ", err);
                result(err, null);
            }
            var getOrderList = [];
            var final_response = [];
            if(getDonation.length > 0)
            {
                async.forEachOf(getDonation, async (getDonationList, key, callback) => {
                    // console.log('chk_id',getDonationList);
                    if(getDonationList.project_title)
                    {
                    var projectImages =  await helper.sql_query(sql, `SELECT id,ref_id,CASE WHEN file!='' THEN CONCAT('${fullUrl}/projects/',file) ELSE '' END AS file, status, created_at, updated_at FROM images WHERE type = '1' AND ref_id = '${getDonationList.project_id}' `).catch(console.log);
                    console.log('projectImages',projectImages);
                    }
                    var myDonation = {
                        "donation_id":getDonationList.donation_id,
                        "donation_type": (getDonationList.project_id) ? 'Project Donation' : 'Mosque Donation' ,
                        "project_id":getDonationList.project_id,
                        "project_title": (getDonationList.project_title) ? getDonationList.project_title : '',
                        "project_image": (getDonationList.project_title) ? projectImages : [],
                        "mosque_id":getDonationList.mosque_id,
                        "mosque_name":getDonationList.mosque_name,
                        "mosque_photo":getDonationList.profile_photo,
                        "first_name":getDonationList.first_name,
                        "last_name":getDonationList.last_name,
                        "amount":parseFloat(getDonationList.amount).toFixed(2),
                        "auto_donation":(getDonationList.auto_donation == '1') ? true : false,
                        "created_at":getDonationList.created_at,
                    };

                    final_response.push(myDonation);
                    // console.log('final_response',final_response);
                }, err => {
                    if (err) console.error(err.message);

                    var query_text = `SELECT donations.id as donation_id,donations.project_id,mosque_projects.project_title,donations.public_id,donations.mosque_id,users.mosque_name,users.first_name,users.last_name, case when users.profile_photo != '' then CONCAT('${fullUrl}/uploadsProfile/', users.profile_photo) else '' end as profile_photo ,donations.amount,donations.auto_donation,DATE_FORMAT(donations.created_at,'%d-%m-%Y') as created_at FROM donations LEFT JOIN users ON users.id = donations.mosque_id LEFT JOIN mosque_projects ON mosque_projects.id = donations.project_id WHERE donations.public_id = '${user_id}' order by donations.id DESC;`;
                    sql.query(query_text, [], function(err, res) {
                        if(err) {
                            console.log("error: ", err);
                            result(err, null);
                        }

                        var total = res.length;
                        if(last_id > total) {
                            last_id = total;
                        }

                        var nextInfo = {
                            'total': total,
                            'next_id': last_id
                        }
                        // console.log('nextInfo',nextInfo);
                        next_arr.push(nextInfo);

                        
                        response_arr['success'] = 1;
                        response_arr['msg'] = `Get My Donations Successfully!`;
                        response_arr['data'] = final_response;
                        response_arr['next']    = nextInfo;
                        result(null, response_arr);
                    });
                    
                    
                });
            }else{
                response_arr['msg'] = `Can't Get Donations `;
                result(null, response_arr);
            }
        });
               
}

Model.getPollDataModel123 = async function getPollDataModel123(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];
    var responseReply = [];

    var post_id = (param.post_id) ? param.post_id : '';
    var poll_click_answer = (param.poll_click_answer) ? param.poll_click_answer : '';
    var user_id = (param.user_id) ? param.user_id : '';  
    // var post_comment = [];
    console.log('Check Announcement Poll: ',param);
    if(!post_id)
    {
        response_arr['msg'] = "post id is Required";
        result(null, response_arr);
    }else if(!user_id)
    {
        response_arr['msg'] = "user id is Required";
        result(null, response_arr);
    }else{

        var chk_post_id =  await helper.sql_query(sql, `SELECT id,mosque_id FROM mosque_announcements WHERE id = '${post_id}' `).catch(console.log);
        var chk_user_id =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}'`).catch(console.log);
     
        if(chk_post_id.length > 0 && chk_user_id.length )
        {
            var get_poll =  await helper.sql_query(sql, `SELECT id FROM mosque_announcement_poll_visitor WHERE post_id = '${post_id}' AND user_id = '${user_id}' `).catch(console.log);
            console.log('get_poll',get_poll);
            if(get_poll.length > 0)
            {
                response_arr['msg'] = `Already Answer Selected`;
                result(null, response_arr);   
            }else
            {
                var chk_poll = {
                    post_id:post_id,
                    user_id:user_id,
                    poll_click_id:poll_click_answer,
                    created_at:today,
                }
                query_text1 = `INSERT INTO mosque_announcement_poll_visitor SET ?`;
                var q = sql.query(query_text1,[chk_poll],async function (err, result1) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }
                    var get_poll_answer_per =  await helper.sql_query(sql, `SELECT id,poll_answer FROM mosque_announcement_polls WHERE announcement_id = '${post_id}' AND id = '${poll_click_answer}' `).catch(console.log);
                    console.log('get_poll_answer_per',get_poll_answer_per[0].poll_answer);
                    if(get_poll_answer_per[0].poll_answer == 1)
                    {
                        if(user_id != chk_post_id[0].mosque_id)
                            {
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                                var tparam = {
                                    'user_ids': [chk_post_id[0].mosque_id], // Registration Token For multiple users
                                };
                                helper.get_registration_token(tparam,async function (res) {
                                    // console.log("res",res);
                                    // if (res.length > 0) {
                                        var regTokens = (res.length > 0) ? res.map(res => res.token) : [];
                                        // Send Notification Message : Start

                                        // var set_body = `${first_name} ${last_name} wants to hire you at ${work_start_date} ${work_timing}.`;
                                        var loginUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${user_id}' `).catch(console.log);
                                        var set_body = `User @${loginUser[0].first_name} ${loginUser[0].last_name} give the right answer of poll .`;
                                        var send_param = {
                                            'registration_token': regTokens,
                                            'title': appName,
                                            'body': set_body,
                                            'extra_data': {
                                                "activity": 'votting_poll',
                                                "user_id": user_id,
                                                "post_id": chk_post_id[0].id,
                                            }
                                        };
                                        // console.log(send_param);
                                        helper.send_notification(send_param, function (send_res) {
                                            // Save Notification Message in DB : Start
                                            var notify_params = {
                                                'user_id': chk_post_id[0].mosque_id,
                                                'from_id': user_id,
                                                "post_id": chk_post_id[0].id,
                                                "activity": 'votting_poll',
                                                'noti_type': 4,
                                                'description': set_body,
                                                'created_at': today,
                                            }
                                            helper.save_notification(notify_params);                                    
                                            
                                        });
                                        // Send Notification Message : End      
                                    // }
                                });
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                            }
                    }
                    response_arr['success'] = 1;
                    response_arr['msg'] = `Answer Click successfully.`;
                    result(null, response_arr); 
                });
            }
        }else{
            response_arr['msg'] = `Please check Post Id & User Id.`;
            result(null, response_arr);
        }
    }
    
}

Model.getPollDataModel = async function getPollDataModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];
    var responseReply = [];

    var post_id = (param.post_id) ? param.post_id : '';
    var poll_click_answer = (param.poll_click_answer) ? param.poll_click_answer : '';
    var user_id = (param.user_id) ? param.user_id : '';  
    // var post_comment = [];
    console.log('Check Announcement Poll: ',param);
    if(!post_id)
    {
        response_arr['msg'] = "post id is Required";
        result(null, response_arr);
    }else if(!user_id)
    {
        response_arr['msg'] = "user id is Required";
        result(null, response_arr);
    }else{

        var chk_post_id =  await helper.sql_query(sql, `SELECT id,mosque_id FROM mosque_announcements WHERE id = '${post_id}' `).catch(console.log);
        var chk_user_id =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}'`).catch(console.log);
     
        if(chk_post_id.length > 0 && chk_user_id.length )
        {
            var get_poll =  await helper.sql_query(sql, `SELECT id FROM mosque_announcement_poll_visitor WHERE post_id = '${post_id}' AND user_id = '${user_id}' `).catch(console.log);
            
            if(get_poll.length > 0)
            {
                console.log('get_poll',get_poll);
                response_arr['msg'] = `Already Answer Selected`;
                result(null, response_arr);   
            }else
            {
                var chk_poll = {
                    post_id:post_id,
                    user_id:user_id,
                    poll_click_id:poll_click_answer,
                    created_at:today,
                }
                query_text1 = `INSERT INTO mosque_announcement_poll_visitor SET ?`;
                var q = sql.query(query_text1,[chk_poll],async function (err, result1) {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                    }

                    var get_poll_answer_per =  await helper.sql_query(sql, `SELECT id,poll_answer FROM mosque_announcement_polls WHERE announcement_id = '${post_id}' AND id = '${poll_click_answer}' `).catch(console.log);
                    console.log('get_poll_answer_per',get_poll_answer_per[0].poll_answer);
                    if(get_poll_answer_per[0].poll_answer == 1)
                    {
                        if(user_id != chk_post_id[0].mosque_id)
                            {
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                                var tparam = {
                                    'user_ids': [chk_post_id[0].mosque_id], // Registration Token For multiple users
                                };
                                helper.get_registration_token(tparam,async function (res) {
                                    // console.log("res",res);
                                    // if (res.length > 0) {
                                        var regTokens = (res.length > 0) ? res.map(res => res.token) : [];
                                        // Send Notification Message : Start

                                        // var set_body = `${first_name} ${last_name} wants to hire you at ${work_start_date} ${work_timing}.`;
                                        var loginUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${user_id}' `).catch(console.log);
                                        var set_body = `User @${loginUser[0].first_name} ${loginUser[0].last_name} give the right answer of poll .`;
                                        var send_param = {
                                            'registration_token': regTokens,
                                            'title': appName,
                                            'body': set_body,
                                            'extra_data': {
                                                "activity": 'votting_poll',
                                                "user_id": user_id,
                                                "post_id": chk_post_id[0].id,
                                            }
                                        };
                                        // console.log(send_param);
                                        helper.send_notification(send_param, function (send_res) {
                                            // Save Notification Message in DB : Start
                                            var notify_params = {
                                                'user_id': chk_post_id[0].mosque_id,
                                                'from_id': user_id,
                                                "post_id": chk_post_id[0].id,
                                                "activity": 'votting_poll',
                                                'noti_type': 4,
                                                'description': set_body,
                                                'created_at': today,
                                            }
                                            helper.save_notification(notify_params);                                    
                                            
                                        });
                                        // Send Notification Message : End      
                                    // }
                                });
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                            }
                    }

                    var get_mosque_id =  await helper.sql_query(sql, `SELECT id,mosque_id FROM mosque_announcements WHERE id = '${post_id}' `).catch(console.log);

                    var mosque_id = get_mosque_id[0].mosque_id;
                    var query_text = `SELECT post.id as post_id,post.type as post_type,post.post_in,post.description,post.status,DATE_FORMAT(post.created_at,'%d %m %Y,%H:%i:%s') AS created_at,DATE_FORMAT(post.poll_length,'%d-%m-%Y %H:%i') AS poll_length,users.id as mosque_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,post_like.id as post_like_id,post_comment.id as post_comment_id FROM mosque_announcements as post LEFT JOIN users ON post.mosque_id = users.id LEFT JOIN mosque_announcement_likes as post_like ON post.id = post_like.post_id AND post_like.user_id = '${user_id}' LEFT JOIN mosque_announcement_comments as post_comment ON post.id = post_comment.post_id AND post_comment.user_id = '${user_id}' WHERE mosque_id = '${mosque_id}' AND post.id = '${post_id}' group by post_id order by post_id DESC `;
                    // console.log('query_text',query_text);
                    var q = sql.query(query_text, function (err, announcementList) {
                        async.forEachOf(announcementList, async (announcement, key, callback) => {
                            console.log('announcement',announcement);
                            var postFiles =  await helper.sql_query(sql, `SELECT id,CASE WHEN file!='' THEN CONCAT('${fullUrl}/posts/',file) ELSE '' END AS file,CASE WHEN video_thumbnail!='' THEN CONCAT('${fullUrl}/posts/',video_thumbnail) ELSE '' END AS video_thumbnail, created_at FROM mosque_announcement_images WHERE announcement_id = '${announcement.post_id}'`).catch(console.log);
                            var likes =  await helper.sql_query(sql, `SELECT count(id) as total_like FROM mosque_announcement_likes WHERE post_id = '${announcement.post_id}'`).catch(console.log);
                            var comments =  await helper.sql_query(sql, `SELECT count(id) as total_comment FROM mosque_announcement_comments WHERE post_id = '${announcement.post_id}'`).catch(console.log);
                            var postPollKey =  await helper.sql_query(sql, `SELECT polls.id, polls.poll_keys,polls.poll_answer,DATE_FORMAT(polls.poll_length,'%Y-%m-%d %H:%i') AS poll_length, DATE_FORMAT(polls.created_at,'%d-%m-%Y,%H:%i:%s') AS created_at,IF(poll_visitor.poll_click_id = polls.id, "true", "false") as poll_click_flag FROM mosque_announcement_polls as polls LEFT JOIN mosque_announcement_poll_visitor as poll_visitor ON polls.id  = poll_visitor.poll_click_id AND poll_visitor.user_id = '${user_id}' WHERE polls.announcement_id = '${announcement.post_id}' order by polls.id ASC `).catch(console.log);
                            let result = false;

                            
                            var setPostDate = moment(announcement.created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a');
                            
                            var curr_time = moment().format('YYYY-MM-DD HH:mm');
                            
                            if(curr_time <= moment(announcement.poll_length,'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm'))
                            {
                                var poll_len = moment(announcement.poll_length,'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');

                                // console.log('---------------------------------------');
                                var a = moment(curr_time);//now
                                var b = moment(poll_len);
                                // console.log('id ',announcement.post_id) // 44700
                                var days = b.diff(a, 'days');
                                var hours = b.diff(a, 'hours');
                                var min = b.diff(a, 'minutes');
                                
                                // console.log(a.diff(b, 'weeks')) // 4
                                var set_value = days+':'+hours+':'+min;
                                // console.log('set_value',set_value);
                                // console.log('-------------*********------------------');

                            var postData = {
                                "post_id": announcement.post_id,
                                "mosque_id": announcement.mosque_id,
                                "mosque_name": announcement.mosque_name,
                                "first_name": announcement.first_name,
                                "last_name": announcement.last_name,
                                "profile_photo": announcement.profile_photo,
                                "post_type": announcement.post_type,
                                "post_in": announcement.post_in,
                                "description": announcement.description,
                                "status": announcement.status,
                                "is_likes": (announcement.post_like_id)?true:false,
                                "total_like": likes[0].total_like,
                                "is_comments": (announcement.post_comment_id)?true:false,
                                "total_comments": comments[0].total_comment,
                                "files": postFiles,
                                "PollKey": postPollKey,
                                "Poll_length":(announcement.post_type == 2)? announcement.poll_length:'',
                                // "post_date_time": announcement.created_at,
                                "post_date_time": setPostDate,
                            };
                            console.log('postData',postData);
                            response.push(postData);
                            }
                        }, err => {
                            if (err) console.error(err.message);

                            response_arr['success'] = 1;
                            response_arr['msg'] = `Answer Click successfully.`;
                            response_arr['data'] = response;
                            result(null, response_arr);
                        
                        });
                        
                    
                    });
                    
                    
                    // response_arr['success'] = 1;
                    // response_arr['msg'] = `Answer Click successfully.`;
                    // result(null, response_arr); 
                });
            }
        }else{
            response_arr['msg'] = `Please check Post Id & User Id.`;
            result(null, response_arr);
        }
    }
    
}

Model.deactivateAccountModel = async function deactivateAccountModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];
    var responseReply = [];

    var public_user_id = (param.public_user_id) ? param.public_user_id : '';
    
    console.log('Deactivate Account: ',param);
    if(!public_user_id)
    {
        response_arr['msg'] = "user id is Required";
        result(null, response_arr);
    }else{
        var chk_user_id =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${public_user_id}' and user_role = '4'`).catch(console.log);
        if(chk_user_id.length > 0 )
        {
            query_text1 = `UPDATE users SET soft_delete = 1 WHERE id = '${public_user_id}' and user_role = '4' `;
            var q = sql.query(query_text1,async function (err, result1) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                if(result1.affectedRows > 0)
                {

                var del_cmt =  await helper.sql_query(sql, `Delete FROM mosque_announcement_comments WHERE user_id = '${public_user_id}'`).catch(console.log);
                var del_cmt_reply =  await helper.sql_query(sql, `Delete FROM mosque_announcement_comment_replys WHERE user_id = '${public_user_id}'`).catch(console.log);
                var del_like =  await helper.sql_query(sql, `Delete FROM mosque_announcement_likes WHERE user_id = '${public_user_id}'`).catch(console.log);

                var del_file_cmt =  await helper.sql_query(sql, `Delete FROM mosque_announcement_file_comments WHERE user_id = '${public_user_id}'`).catch(console.log);
                var del_file_cmt_reply =  await helper.sql_query(sql, `Delete FROM mosque_announcement_file_comment_replys WHERE user_id = '${public_user_id}'`).catch(console.log);
                var del_file_like =  await helper.sql_query(sql, `Delete FROM mosque_announcement_file_likes WHERE user_id = '${public_user_id}'`).catch(console.log);

                var del_poll_visitor =  await helper.sql_query(sql, `Delete FROM mosque_announcement_poll_visitor WHERE user_id = '${public_user_id}'`).catch(console.log);

                var del_notification =  await helper.sql_query(sql, `Delete FROM notifications WHERE user_id = '${public_user_id}'`).catch(console.log);
                var del_notification_setting =  await helper.sql_query(sql, `Delete FROM notification_setting WHERE user_id = '${public_user_id}'`).catch(console.log);

                var del_login_token =  await helper.sql_query(sql, `Delete FROM tbl_login_token WHERE user_id = '${public_user_id}'`).catch(console.log);

                var del_user_journey =  await helper.sql_query(sql, `Delete FROM user_journey WHERE user_id = '${public_user_id}'`).catch(console.log);

                var del_user_order_address =  await helper.sql_query(sql, `Delete FROM user_order_address WHERE user_id = '${public_user_id}'`).catch(console.log);

                response_arr['success'] = 1;
                response_arr['msg'] = `Your Account Deleted successfully.`;
                result(null, response_arr); 
                }
            });
        }else{
            response_arr['msg'] = `Please check User Id.`;
            result(null, response_arr);
        }
    }
}

//------------------------------ Post -------------------------------------//
Model.announcementLikeUnlikeModel = async function announcementLikeUnlikeModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];

    var post_id = (param.post_id) ? param.post_id : '';
    var user_id = (param.user_id) ? param.user_id : '';  
    var is_like = (param.is_like) ? param.is_like : 1;  
    
    console.log('Like Announcement : ',param);
    if(!post_id)
    {
        response_arr['msg'] = "post id is Required";
        result(null, response_arr);
    }else if(!user_id)
    {
        response_arr['msg'] = "user id is Required";
        result(null, response_arr);
    }else{

        var chk_post_id =  await helper.sql_query(sql, `SELECT id,mosque_id FROM mosque_announcements WHERE id = '${post_id}' `).catch(console.log);
        var chk_user_id =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}'`).catch(console.log);
        // console.log('chk_post_id',chk_post_id[0].mosque_id);
        if(chk_post_id.length > 0 && chk_user_id.length > 0)
        {
            if(is_like == 1)
            {
                var chk_post =  await helper.sql_query(sql, `SELECT id FROM mosque_announcement_likes WHERE post_id = '${post_id}' AND user_id = '${user_id}'`).catch(console.log);
                if(chk_post.length > 0)
                {
                    // response_arr['success'] = 1;
                    response_arr['msg'] = `Already post like data Successfully!`;
                    result(null, response_arr);
                }else{
                    save_ann_like = {
                        'post_id':post_id,
                        'user_id':user_id,
                        'created_at':today,
                    };    
                    query_text = `INSERT INTO mosque_announcement_likes SET ? `;
                    var q = sql.query(query_text,[save_ann_like], function (err, res) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }
                        if(res.affectedRows > 0)
                        {
                            if(user_id != chk_post_id[0].mosque_id)
                            {
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                                var tparam = {
                                    'user_ids': [chk_post_id[0].mosque_id], // Registration Token For multiple users
                                };
                                helper.get_registration_token(tparam,async function (res) {
                                    // console.log("res",res);
                                    // if (res.length > 0) {
                                        var regTokens = (res.length > 0) ? res.map(res => res.token) : [];
                                        // Send Notification Message : Start

                                        // var set_body = `${first_name} ${last_name} wants to hire you at ${work_start_date} ${work_timing}.`;
                                        var loginUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${user_id}' `).catch(console.log);
                                        var set_body = `User @${loginUser[0].first_name} ${loginUser[0].last_name} liked your post.`;
                                        var send_param = {
                                            'registration_token': regTokens,
                                            'title': appName,
                                            'body': set_body,
                                            'extra_data': {
                                                "activity": 'likes',
                                                "user_id": user_id,
                                                "post_id": chk_post_id[0].id,
                                            }
                                        };
                                        // console.log(send_param);
                                        helper.send_notification(send_param, function (send_res) {
                                            // Save Notification Message in DB : Start
                                            var notify_params = {
                                                'user_id': chk_post_id[0].mosque_id,
                                                'from_id': user_id,
                                                "post_id": chk_post_id[0].id,
                                                "activity": 'likes',
                                                'noti_type': 3,
                                                'description': set_body,
                                                'created_at': today,
                                            }
                                            helper.save_notification(notify_params);                                    
                                            
                                        });
                                        // Send Notification Message : End      
                                    // }
                                });
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                            }
                            response_arr['success'] = 1;
                            response_arr['msg'] = `Post Like Successfully!`;
                            // response_arr['data'] = orderItem;
                            result(null, response_arr);
                        }else{
                            response_arr['msg'] = `can't save Like announcement data!`;
                            result(null, response_arr);
                        }   
                    });
                }    
            }else{
                var chk_post =  await helper.sql_query(sql, `SELECT id FROM mosque_announcement_likes WHERE post_id = '${post_id}' AND user_id = '${user_id}'`).catch(console.log);
                if(chk_post.length > 0)
                {
                    var Unlike_post =  await helper.sql_query(sql, `DELETE FROM mosque_announcement_likes WHERE post_id = '${post_id}' AND user_id = '${user_id}'`).catch(console.log);
                    if(Unlike_post.affectedRows > 0)
                    {
                        response_arr['success'] = 1;
                        response_arr['msg'] = `Post Unlike Successfully!`;
                        result(null, response_arr);
                    }else{
                        response_arr['msg'] = `some thing wrong please check like , unlike module`;
                        result(null, response_arr);
                    }
                    
                }else{
                    response_arr['success'] = 1;
                    response_arr['msg'] = `Post data not found!`;
                    result(null, response_arr);
                }
            }
            
        }else{
            response_arr['msg'] = `Please check Post Id & User Id.`;
            result(null, response_arr);
        }
    }
    
}

Model.announcementCommentModel = async function announcementCommentModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];

    var post_id = (param.post_id) ? param.post_id : '';
    var user_id = (param.user_id) ? param.user_id : '';  
    var comment = (param.comment) ? param.comment : '';  
    
    console.log('Announcement Comment: ',param);
    if(!post_id)
    {
        response_arr['msg'] = "post id is Required";
        result(null, response_arr);
    }else if(!user_id)
    {
        response_arr['msg'] = "user id is Required";
        result(null, response_arr);
    }else{

        var chk_post_id =  await helper.sql_query(sql, `SELECT id,mosque_id FROM mosque_announcements WHERE id = '${post_id}' `).catch(console.log);
        var chk_user_id =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}'`).catch(console.log);

        if(chk_post_id.length > 0 && chk_user_id.length > 0)
        {
            save_ann_like = {
                'post_id':post_id,
                'user_id':user_id,
                'comment':comment,
                'created_at':today,
            };    
            query_text = `INSERT INTO mosque_announcement_comments SET ? `;
            var q = sql.query(query_text,[save_ann_like], function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                if(res.affectedRows > 0)
                {
                    query_text1 = `SELECT comment.id as comment_id,comment.post_id,comment.user_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,comment.comment,DATE_FORMAT(comment.created_at,'%d %m %Y,%H:%i:%s') AS created_at FROM mosque_announcement_comments as comment LEFT JOIN users ON comment.user_id = users.id WHERE comment.post_id = '${post_id}' AND comment.user_id='${user_id}' order by comment.id DESC`;
                    var q = sql.query(query_text1, function (err, result1) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }
                        async.forEachOf(result1, async (post_comment, key, callback) => {
                            var query_reply =  await helper.sql_query(sql, `SELECT reply.reply_id as reply_id,reply.comment_id,reply.post_id,reply.user_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,reply.reply,reply.created_at,reply.created_at as time_ago FROM mosque_announcement_comment_replys as reply LEFT JOIN users ON reply.user_id = users.id WHERE reply.post_id = '${post_id}' AND reply.comment_id = '${post_comment.comment_id}' order by reply.reply_id DESC `).catch(console.log);

                            for(var i=0; i < query_reply.length; i++)
                            {
                                query_reply[i].time_ago = moment(query_reply[i].time_ago).fromNow(true);
                            }
                            
                            var setPostCmtDate = moment(post_comment.created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a');
                            console.log('result',post_comment);
                            var postComments = {
                                "comment_id": post_comment.comment_id,
                                "post_id": post_comment.post_id,
                                "user_id": post_comment.user_id,
                                "mosque_name": post_comment.mosque_name,
                                "first_name": post_comment.first_name,
                                "last_name": post_comment.last_name,
                                "profile_photo": post_comment.profile_photo,
                                "comment": post_comment.comment,
                                "time_ago": moment(setPostCmtDate).fromNow(true),
                                "reply": query_reply,
                            };
                            response.push(postComments);
            
                        }, err => {
                            if (err) console.error(err.message);
            
                            if(user_id != chk_post_id[0].mosque_id)
                            {
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                                var tparam = {
                                    'user_ids': [chk_post_id[0].mosque_id], // Registration Token For multiple users
                                };
                                helper.get_registration_token(tparam,async function (res) {
                                    // console.log("res",res);
                                    // if (res.length > 0) {
                                        var regTokens = (res.length > 0) ? res.map(res => res.token) : [];
                                        // Send Notification Message : Start

                                        // var set_body = `${first_name} ${last_name} wants to hire you at ${work_start_date} ${work_timing}.`;
                                        var loginUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${user_id}' `).catch(console.log);
                                        var set_body = `User @${loginUser[0].first_name} ${loginUser[0].last_name} commented your post.`;
                                        var send_param = {
                                            'registration_token': regTokens,
                                            'title': appName,
                                            'body': set_body,
                                            'extra_data': {
                                                "activity": 'comments',
                                                "user_id": user_id,
                                                "post_id": chk_post_id[0].id,
                                            }
                                        };
                                        // console.log(send_param);
                                        helper.send_notification(send_param, function (send_res) {
                                            // Save Notification Message in DB : Start
                                            var notify_params = {
                                                'user_id': chk_post_id[0].mosque_id,
                                                'from_id': user_id,
                                                "post_id": chk_post_id[0].id,
                                                "activity": 'comments',
                                                'noti_type': 3,
                                                'description': set_body,
                                                'created_at': today,
                                            }
                                            helper.save_notification(notify_params);                                    
                                            
                                        });
                                        // Send Notification Message : End      
                                    // }
                                });
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                            }
                            response_arr['success'] = 1;
                            response_arr['msg'] = `Post comment add Successfully!`;
                            response_arr['data'] = response;
                            result(null, response_arr);
                        });
                        
                        // response_arr['success'] = 1;
                        // response_arr['msg'] = `Post comment add Successfully!`;
                        // // response_arr['data'] = orderItem;
                        // result(null, response_arr);
                        
                    });
                }else{
                    response_arr['msg'] = `can't save comment announcement data!`;
                    result(null, response_arr);
                }   
            });
        }else{
            response_arr['msg'] = `Please check Post Id & User Id.`;
            result(null, response_arr);
        }
    }
    
}

Model.announcementCommentReplyModel = async function announcementCommentReplyModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];
    var responseReply = [];

    var post_id = (param.post_id) ? param.post_id : '';
    var comment_id = (param.comment_id) ? param.comment_id : '';  
    var user_id = (param.user_id) ? param.user_id : '';  
    var reply = (param.reply) ? param.reply : '';  
    
    console.log('Announcement Comment Reply : ',param);
    if(!post_id)
    {
        response_arr['msg'] = "post id is Required";
        result(null, response_arr);
    }else if(!comment_id)
    {
        response_arr['msg'] = "Comment id is Required";
        result(null, response_arr);
    }else if(!user_id)
    {
        response_arr['msg'] = "user id is Required";
        result(null, response_arr);
    }else{

        var chk_post_id =  await helper.sql_query(sql, `SELECT id FROM mosque_announcements WHERE id = '${post_id}' `).catch(console.log);
        var chk_user_id =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}'`).catch(console.log);
        var chk_comment_id =  await helper.sql_query(sql, `SELECT id,user_id FROM mosque_announcement_comments WHERE id = '${comment_id}' AND post_id = '${post_id}' `).catch(console.log);

        if(chk_post_id.length > 0 && chk_user_id.length > 0 && chk_comment_id.length > 0)
        {
            save_ann_cmt_reply = {
                'post_id':post_id,
                'comment_id':comment_id,
                'user_id':user_id,
                'reply':reply,
                'created_at':today,
            };    
            query_text = `INSERT INTO mosque_announcement_comment_replys SET ? `;
            var q = sql.query(query_text,[save_ann_cmt_reply], function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                if(res.affectedRows > 0)
                {
                    query_text1 = `SELECT comment.id as comment_id,comment.post_id,comment.user_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,comment.comment,DATE_FORMAT(comment.created_at,'%d %m %Y,%H:%i:%s') AS created_at FROM mosque_announcement_comments as comment LEFT JOIN users ON comment.user_id = users.id WHERE comment.post_id = '${post_id}' AND comment.id = '${comment_id}' order by comment.id DESC`;
                    var q = sql.query(query_text1, function (err, result1) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }
                        async.forEachOf(result1, async (post_comment, key, callback) => {
                            var query_reply =  await helper.sql_query(sql, `SELECT reply.reply_id as reply_id,reply.comment_id,reply.post_id,reply.user_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,reply.reply,reply.created_at ,reply.created_at as time_go FROM mosque_announcement_comment_replys as reply LEFT JOIN users ON reply.user_id = users.id WHERE reply.post_id = '${post_id}' AND reply.user_id='${user_id}' AND reply.comment_id = '${post_comment.comment_id}' order by reply.reply_id DESC `).catch(console.log);

                                for(var i=0; i < query_reply.length; i++)
                                {
                                    query_reply[i].time_ago = moment(query_reply[i].time_ago).fromNow(true);
                                }

                            var setPostCmtDate = moment(post_comment.created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a');
                            console.log('result',post_comment);
                            var postComments = {
                                "comment_id": post_comment.comment_id,
                                "post_id": post_comment.post_id,
                                "user_id": post_comment.user_id,
                                "mosque_name": post_comment.mosque_name,
                                "first_name": post_comment.first_name,
                                "last_name": post_comment.last_name,
                                "profile_photo": post_comment.profile_photo,
                                "comment": post_comment.comment,
                                "time_ago": moment(setPostCmtDate).fromNow(true),
                                "reply": query_reply,
                            };
                            response.push(postComments);
            
                        }, err => {
                            if (err) console.error(err.message);
                            
                            if(user_id != chk_comment_id[0].user_id)
                            {
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                                var tparam = {
                                    'user_ids': [chk_comment_id[0].user_id], // Registration Token For multiple users
                                };
                                helper.get_registration_token(tparam,async function (res) {
                                    // console.log("res",res);
                                    // if (res.length > 0) {
                                        var regTokens = (res.length > 0) ? res.map(res => res.token) : [];
                                        // Send Notification Message : Start

                                        // var set_body = `${first_name} ${last_name} wants to hire you at ${work_start_date} ${work_timing}.`;
                                        var loginUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${user_id}' `).catch(console.log);
                                        var set_body = `User @${loginUser[0].first_name} ${loginUser[0].last_name} Reply your comment.`;
                                        var send_param = {
                                            'registration_token': regTokens,
                                            'title': appName,
                                            'body': set_body,
                                            'extra_data': {
                                                "activity": 'replys',
                                                "user_id": user_id,
                                                "post_id": chk_post_id[0].id,
                                            }
                                        };
                                        // console.log(send_param);
                                        helper.send_notification(send_param, function (send_res) {
                                            // Save Notification Message in DB : Start
                                            var notify_params = {
                                                'user_id': chk_comment_id[0].user_id,
                                                'from_id': user_id,
                                                "post_id": chk_post_id[0].id,
                                                "activity": 'replys',
                                                'noti_type': 3,
                                                'description': set_body,
                                                'created_at': today,
                                            }
                                            helper.save_notification(notify_params);                                    
                                            
                                        });
                                        // Send Notification Message : End      
                                    // }
                                });
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                            }

                            response_arr['success'] = 1;
                            response_arr['msg'] = `Post comment add Successfully!`;
                            response_arr['data'] = response;
                            result(null, response_arr);
                        });
                    });

                    
                }else{
                    response_arr['msg'] = `can't save comment announcement data!`;
                    result(null, response_arr);
                }   
            });
        }else{
            response_arr['msg'] = `Please check Post Id, Comment Id & User Id.`;
            result(null, response_arr);
        }
    }
    
}

Model.getAnnouncementCommentModel = async function getAnnouncementCommentModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];
    var responseReply = [];

    var post_id = (param.post_id) ? param.post_id : '';
    var user_id = (param.user_id) ? param.user_id : ''; 
    
    var next_id = (param.next_id) ? param.next_id : 0;
	var last_id = parseInt(next_id) + 10;

    var next_arr = [];

    // var post_comment = [];
    console.log('Get Announcement Comment: ',param);
    if(!post_id)
    {
        response_arr['msg'] = "post id is Required";
        result(null, response_arr);
    }else if(!user_id)
    {
        response_arr['msg'] = "user id is Required";
        result(null, response_arr);
    }else{

        var chk_post_id =  await helper.sql_query(sql, `SELECT id FROM mosque_announcements WHERE id = '${post_id}' `).catch(console.log);
        var chk_user_id =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}'`).catch(console.log);
     
        if(chk_post_id.length > 0 && chk_user_id.length )
        {
            query_text1 = `SELECT comment.id as comment_id,comment.post_id,comment.user_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,comment.comment,DATE_FORMAT(comment.created_at,'%d %m %Y,%H:%i:%s') AS created_at FROM mosque_announcement_comments as comment LEFT JOIN users ON comment.user_id = users.id WHERE comment.post_id = '${post_id}'  order by comment.id DESC LIMIT 10 OFFSET ${parseInt(next_id)}`;
            var q = sql.query(query_text1, function (err, result1) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                async.forEachOf(result1, async (post_comment, key, callback) => {
                        var query_reply =  await helper.sql_query(sql, `SELECT reply.reply_id as reply_id,reply.comment_id,reply.post_id,reply.user_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,reply.reply,reply.created_at ,reply.created_at as time_ago FROM mosque_announcement_comment_replys as reply LEFT JOIN users ON reply.user_id = users.id WHERE reply.post_id = '${post_comment.post_id}' AND reply.comment_id = '${post_comment.comment_id}' order by reply.reply_id DESC `).catch(console.log);
                        // var query_reply =  await helper.sql_query(sql, `SELECT reply_id FROM mosque_announcement_comment_replys WHERE post_id = '${post_id}' AND user_id='${user_id}' AND comment_id = '${post_comment.comment_id}' order by reply.reply_id DESC `).catch(console.log);
                        // async.forEachOf(query_reply, (comment_reply, key, callback) => {
                        //     console.log('comment_reply',comment_reply);
                        //     var setPostCmtReplyDate = moment(comment_reply.created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a');
                        //     var postCommentReply = {
                        //         "reply_id": comment_reply.reply_id,
                        //         "comment_id": comment_reply.comment_id,
                        //         "post_id": comment_reply.post_id,
                        //         "user_id": comment_reply.user_id,
                        //         "mosque_name": comment_reply.mosque_name,
                        //         "first_name": comment_reply.first_name,
                        //         "last_name": comment_reply.last_name,
                        //         "profile_photo": comment_reply.profile_photo,
                        //         "reply": comment_reply.reply, 
                        //         "time_ago": moment(setPostCmtReplyDate).fromNow(true),
                        //     };
                        //     responseReply.push(postCommentReply);
                        //     callback();
                        // });
                        // console.log('responseReply',responseReply);
                        for(var i=0; i < query_reply.length; i++)
                        {
                            query_reply[i].time_ago = moment(query_reply[i].time_ago).fromNow(true);
                        }

                        var setPostCmtDate = moment(post_comment.created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a');
                        var postComments = {
                            "comment_id": post_comment.comment_id,
                            "post_id": post_comment.post_id,
                            "user_id": post_comment.user_id,
                            "mosque_name": post_comment.mosque_name,
                            "first_name": post_comment.first_name,
                            "last_name": post_comment.last_name,
                            "profile_photo": post_comment.profile_photo,
                            "comment": post_comment.comment,
                            "time_ago": moment(setPostCmtDate).fromNow(true),
                            // "reply_count": count(query_reply),
                            "reply": query_reply,
                        };
                        response.push(postComments);
                        // callback();
                }, err => {
                    if (err) console.error(err.message);

                    var query_text = `SELECT comment.id as comment_id,comment.post_id,comment.user_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,comment.comment,DATE_FORMAT(comment.created_at,'%d %m %Y,%H:%i:%s') AS created_at FROM mosque_announcement_comments as comment LEFT JOIN users ON comment.user_id = users.id WHERE comment.post_id = '${post_id}'  order by comment.id DESC;`;
                    sql.query(query_text, [], function(err, res) {
                        if(err) {
                            console.log("error: ", err);
                            result(err, null);
                        }

                        var total = res.length;
                        if(last_id > total) {
                            last_id = total;
                        }

                        var nextInfo = {
                            'total': total,
                            'next_id': last_id
                        }
                        // console.log('nextInfo',nextInfo);
                        next_arr.push(nextInfo);

                        response_arr['success'] = 1;
                        response_arr['msg'] = `Post comment add Successfully!`;
                        response_arr['data'] = response;
                        response_arr['next']    = nextInfo;
                        result(null, response_arr);
                        
                    });
                   
                });
            });

        }else{
            response_arr['msg'] = `Please check Post Id & User Id.`;
            result(null, response_arr);
        }
    }
    
}

Model.deleteCommentReplyModel = async function deleteCommentReplyModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];
    var responseReply = [];

    // var post_id = (param.post_id) ? param.post_id : '';
    var user_id = (param.user_id) ? param.user_id : '';
    var comment_id = (param.comment_id) ? param.comment_id : '';
    var reply_id = (param.reply_id) ? param.reply_id : '';  
    var delete_type = (param.delete_type) ? param.delete_type : 1;  
    // var post_comment = [];
    console.log('Delete Announcement Comment & reply : ',param);
    
    if(!user_id)
    {
        response_arr['msg'] = "user id is Required";
        result(null, response_arr);
    }else{

        // var chk_post_id =  await helper.sql_query(sql, `SELECT id FROM mosque_announcements WHERE id = '${post_id}' `).catch(console.log);
        var chk_user_id =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}'`).catch(console.log);
        var chk_cmt_id =  await helper.sql_query(sql, `SELECT id FROM mosque_announcement_comments WHERE id = '${comment_id}'`).catch(console.log);
     
        if( chk_user_id.length > 0 && chk_cmt_id.length > 0 )
        {
            if(delete_type == 1)
            {
                del_cmt =  await helper.sql_query(sql, `DELETE FROM mosque_announcement_comments WHERE id = '${comment_id}' AND user_id = '${user_id}' `).catch(console.log);
                if(del_cmt){
                    del_reply =  await helper.sql_query(sql, `DELETE FROM mosque_announcement_comment_replys WHERE comment_id = '${comment_id}' `).catch(console.log);
                }
                if(del_reply && del_cmt)
                {
                    response_arr['success'] = 1;
                    response_arr['msg'] = `Your Comment Data Deleted Successfully!`;
                    // response_arr['data'] = response;
                    result(null, response_arr);
                }else{
                    response_arr['msg'] = `Comment data can't Delete !`;
                    result(null, response_arr);
                }
            }else{
                del_reply =  await helper.sql_query(sql, `DELETE FROM mosque_announcement_comment_replys WHERE reply_id = '${reply_id}' AND user_id = '${user_id}' `).catch(console.log);
                if(del_reply)
                {
                    response_arr['success'] = 1;
                    response_arr['msg'] = `Your Reply data Deleted Successfully!`;
                    // response_arr['data'] = response;
                    result(null, response_arr);
                }else{
                    response_arr['msg'] = `Reply data can't Delete !`;
                    result(null, response_arr);
                }
            }
            
        }else{
            response_arr['msg'] = `Please check Post Id, Comment Id & User Id.`;
            result(null, response_arr);
        }
    }
    
}

//------------------------------Sub Post -------------------------------------//
Model.subPostLikeUnlikeModel = async function subPostLikeUnlikeModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];

    var post_file_id = (param.post_file_id) ? param.post_file_id : '';
    var user_id = (param.user_id) ? param.user_id : '';  
    var is_like = (param.is_like) ? param.is_like : 1;  
    
    console.log('Like SubPost : ',param);
    if(!post_file_id)
    {
        response_arr['msg'] = "Post File id is Required";
        result(null, response_arr);
    }else if(!user_id)
    {
        response_arr['msg'] = "user id is Required";
        result(null, response_arr);
    }else{

        var chk_post_file_id =  await helper.sql_query(sql, `SELECT files.id,files.announcement_id as post_id,posts.mosque_id FROM mosque_announcements as posts LEFT JOIN mosque_announcement_images as files ON posts.id = files.announcement_id WHERE files.id= '${post_file_id}' `).catch(console.log);
        var chk_user_id =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}'`).catch(console.log);
        // console.log('chk_post_id',chk_post_id[0].mosque_id);
        if(chk_post_file_id.length > 0 && chk_user_id.length > 0)
        {
            if(is_like == 1)
            {
                var chk_post_file =  await helper.sql_query(sql, `SELECT id FROM mosque_announcement_file_likes WHERE post_file_id = '${post_file_id}' AND user_id = '${user_id}'`).catch(console.log);
                if(chk_post_file.length > 0)
                {
                    // response_arr['success'] = 1;
                    response_arr['msg'] = `Already post like data Successfully!`;
                    result(null, response_arr);
                }else{
                    save_ann_like = {
                        'post_id':chk_post_file_id[0].post_id,
                        'post_file_id':post_file_id,
                        'user_id':user_id,
                        'created_at':today,
                    };    
                    query_text = `INSERT INTO mosque_announcement_file_likes SET ? `;
                    var q = sql.query(query_text,[save_ann_like], function (err, res) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }
                        if(res.affectedRows > 0)
                        {
                            if(user_id != chk_post_file_id[0].mosque_id)
                            {
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                                var tparam = {
                                    'user_ids': [chk_post_file_id[0].mosque_id], // Registration Token For multiple users
                                };
                                helper.get_registration_token(tparam,async function (res) {
                                    // console.log("res",res);
                                    // if (res.length > 0) {
                                        var regTokens = (res.length > 0) ? res.map(res => res.token) : [];
                                        // Send Notification Message : Start

                                        // var set_body = `${first_name} ${last_name} wants to hire you at ${work_start_date} ${work_timing}.`;
                                        var loginUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${user_id}' `).catch(console.log);
                                        var set_body = `User @${loginUser[0].first_name} ${loginUser[0].last_name} liked your post.`;
                                        var send_param = {
                                            'registration_token': regTokens,
                                            'title': appName,
                                            'body': set_body,
                                            'extra_data': {
                                                "activity": 'file_likes',
                                                "user_id": user_id,
                                                // "post_id": chk_post_file_id[0].id,
                                            }
                                        };
                                        // console.log(send_param);
                                        helper.send_notification(send_param, function (send_res) {
                                            // Save Notification Message in DB : Start
                                            var notify_params = {
                                                'user_id': chk_post_file_id[0].mosque_id,
                                                'from_id': user_id,
                                                // "post_id": chk_post_file_id[0].id,
                                                "activity": 'file_likes',
                                                'noti_type': 3,
                                                'description': set_body,
                                                'created_at': today,
                                            }
                                            helper.save_notification(notify_params);                                    
                                            
                                        });
                                        // Send Notification Message : End      
                                    // }
                                });
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                            }
                            response_arr['success'] = 1;
                            response_arr['msg'] = `Post File Like Successfully!`;
                            // response_arr['data'] = orderItem;
                            result(null, response_arr);
                        }else{
                            response_arr['msg'] = `can't save Like file data!`;
                            result(null, response_arr);
                        }   
                    });
                }    
            }else{
                var chk_post_file =  await helper.sql_query(sql, `SELECT id FROM mosque_announcement_file_likes WHERE post_file_id = '${post_file_id}' AND user_id = '${user_id}'`).catch(console.log);
                if(chk_post_file.length > 0)
                {
                    var Unlike_post =  await helper.sql_query(sql, `DELETE FROM mosque_announcement_file_likes WHERE post_file_id = '${post_file_id}' AND user_id = '${user_id}'`).catch(console.log);
                    if(Unlike_post.affectedRows > 0)
                    {
                        response_arr['success'] = 1;
                        response_arr['msg'] = `Post Unlike Successfully!`;
                        result(null, response_arr);
                    }else{
                        response_arr['msg'] = `some thing wrong please check like , unlike module`;
                        result(null, response_arr);
                    }
                    
                }else{
                    response_arr['success'] = 1;
                    response_arr['msg'] = `Post File data not found!`;
                    result(null, response_arr);
                }
            }
            
        }else{
            response_arr['msg'] = `Please check Post File Id & User Id.`;
            result(null, response_arr);
        }
    }
    
}

Model.announcementFileCommentModel = async function announcementFileCommentModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];

    var post_file_id = (param.post_file_id) ? param.post_file_id : '';
    var user_id = (param.user_id) ? param.user_id : '';  
    var comment = (param.comment) ? param.comment : '';  
    
    console.log('Announcement File Comment: ',param);
    if(!post_file_id)
    {
        response_arr['msg'] = "post file id is Required";
        result(null, response_arr);
    }else if(!user_id)
    {
        response_arr['msg'] = "user id is Required";
        result(null, response_arr);
    }else{

        var chk_post_file_id =  await helper.sql_query(sql, `SELECT files.id,files.announcement_id as post_id,posts.mosque_id FROM mosque_announcements as posts LEFT JOIN mosque_announcement_images as files ON posts.id = files.announcement_id WHERE files.id= '${post_file_id}' `).catch(console.log);
        var chk_user_id =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}'`).catch(console.log);
        console.log('chk_post_file_id',chk_post_file_id);
        if(chk_post_file_id.length > 0 && chk_user_id.length > 0)
        {
            save_ann_like = {
                'post_id':chk_post_file_id[0].post_id,
                'post_file_id':post_file_id,
                'user_id':user_id,
                'comment':comment,
                'created_at':today,
            };    
            query_text = `INSERT INTO mosque_announcement_file_comments SET ? `;
            var q = sql.query(query_text,[save_ann_like], function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                if(res.affectedRows > 0)
                {
                    query_text1 = `SELECT comment.id as comment_id,comment.post_id,comment.post_file_id,comment.user_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,comment.comment,DATE_FORMAT(comment.created_at,'%d %m %Y,%H:%i:%s') AS created_at FROM mosque_announcement_file_comments as comment LEFT JOIN users ON comment.user_id = users.id WHERE comment.post_id = '${chk_post_file_id[0].post_id}' AND comment.post_file_id = '${post_file_id}' AND comment.user_id='${user_id}' order by comment.id DESC`;
                    var q = sql.query(query_text1, function (err, result1) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }
                        async.forEachOf(result1, async (post_comment, key, callback) => {
                            var query_reply =  await helper.sql_query(sql, `SELECT reply.file_reply_id as reply_id,reply.file_comment_id,reply.post_id,reply.post_file_id,reply.user_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,reply.reply,reply.created_at,reply.created_at as time_ago FROM mosque_announcement_file_comment_replys as reply LEFT JOIN users ON reply.user_id = users.id WHERE reply.post_id = '${post_comment.post_id}' AND reply.post_file_id = '${post_file_id}' AND reply.file_comment_id = '${post_comment.comment_id}' order by reply.file_reply_id DESC `).catch(console.log);

                            for(var i=0; i < query_reply.length; i++)
                            {
                                query_reply[i].time_ago = moment(query_reply[i].time_ago).fromNow(true);
                            }
                            
                            var setPostCmtDate = moment(post_comment.created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a');
                            console.log('result',post_comment);
                            var postComments = {
                                "comment_id": post_comment.comment_id,
                                "post_id": post_comment.post_id,
                                "post_file_id": post_comment.post_file_id,
                                "user_id": post_comment.user_id,
                                "mosque_name": post_comment.mosque_name,
                                "first_name": post_comment.first_name,
                                "last_name": post_comment.last_name,
                                "profile_photo": post_comment.profile_photo,
                                "comment": post_comment.comment,
                                "time_ago": moment(setPostCmtDate).fromNow(true),
                                "reply": query_reply,
                            };
                            response.push(postComments);
            
                        }, err => {
                            if (err) console.error(err.message);
            
                            if(user_id != chk_post_file_id[0].mosque_id)
                            {
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                                var tparam = {
                                    'user_ids': [chk_post_file_id[0].mosque_id], // Registration Token For multiple users
                                };
                                helper.get_registration_token(tparam,async function (res) {
                                    // console.log("res",res);
                                    // if (res.length > 0) {
                                        var regTokens = (res.length > 0) ? res.map(res => res.token) : [];
                                        // Send Notification Message : Start

                                        // var set_body = `${first_name} ${last_name} wants to hire you at ${work_start_date} ${work_timing}.`;
                                        var loginUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${user_id}' `).catch(console.log);
                                        var set_body = `User @${loginUser[0].first_name} ${loginUser[0].last_name} commented your sub post.`;
                                        var send_param = {
                                            'registration_token': regTokens,
                                            'title': appName,
                                            'body': set_body,
                                            'extra_data': {
                                                "activity": 'file_comments',
                                                "user_id": user_id,
                                                // "post_id": chk_post_file_id[0].id,
                                            }
                                        };
                                        // console.log(send_param);
                                        helper.send_notification(send_param, function (send_res) {
                                            // Save Notification Message in DB : Start
                                            var notify_params = {
                                                'user_id': chk_post_file_id[0].mosque_id,
                                                'from_id': user_id,
                                                // "post_id": chk_post_file_id[0].id,
                                                "activity": 'file_comments',
                                                'noti_type': 3,
                                                'description': set_body,
                                                'created_at': today,
                                            }
                                            helper.save_notification(notify_params);                                    
                                            
                                        });
                                        // Send Notification Message : End      
                                    // }
                                });
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                            }
                            response_arr['success'] = 1;
                            response_arr['msg'] = `Post File comment add Successfully!`;
                            response_arr['data'] = response;
                            result(null, response_arr);
                        });
                        
                        // response_arr['success'] = 1;
                        // response_arr['msg'] = `Post comment add Successfully!`;
                        // // response_arr['data'] = orderItem;
                        // result(null, response_arr);
                        
                    });

                            
                        
                }else{
                    response_arr['msg'] = `can't save comment announcement file data!`;
                    result(null, response_arr);
                }   
            });
        }else{
            response_arr['msg'] = `Please check Post Id & User Id.`;
            result(null, response_arr);
        }
    }
    
}

Model.announcementFileCommentReplyModel = async function announcementFileCommentReplyModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];
    var responseReply = [];

    var post_file_id = (param.post_file_id) ? param.post_file_id : '';
    var file_comment_id = (param.file_comment_id) ? param.file_comment_id : '';  
    var user_id = (param.user_id) ? param.user_id : '';  
    var reply = (param.reply) ? param.reply : '';  
    
    console.log('Announcement Comment Reply : ',param);
    if(!post_file_id)
    {
        response_arr['msg'] = "post File id is Required";
        result(null, response_arr);
    }else if(!file_comment_id)
    {
        response_arr['msg'] = "Comment id is Required";
        result(null, response_arr);
    }else if(!user_id)
    {
        response_arr['msg'] = "user id is Required";
        result(null, response_arr);
    }else{

        var chk_post_file_id =  await helper.sql_query(sql, `SELECT files.id,files.announcement_id as post_id,posts.mosque_id FROM mosque_announcements as posts LEFT JOIN mosque_announcement_images as files ON posts.id = files.announcement_id WHERE files.id= '${post_file_id}' `).catch(console.log);
        var chk_user_id =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}'`).catch(console.log);
        var chk_file_comment_id =  await helper.sql_query(sql, `SELECT id,user_id FROM mosque_announcement_file_comments WHERE id = '${file_comment_id}' AND post_file_id = '${post_file_id}' `).catch(console.log);

        if(chk_post_file_id.length > 0 && chk_user_id.length > 0 && chk_file_comment_id.length > 0)
        {
            save_ann_cmt_reply = {
                'post_id':chk_post_file_id[0].post_id,
                'post_file_id':post_file_id,
                'file_comment_id':file_comment_id,
                'user_id':user_id,
                'reply':reply,
                'created_at':today,
            };    
            query_text = `INSERT INTO mosque_announcement_file_comment_replys SET ? `;
            var q = sql.query(query_text,[save_ann_cmt_reply], function (err, res) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                if(res.affectedRows > 0)
                {   
                    query_text1 = `SELECT comment.id as comment_id,comment.post_id,comment.post_file_id,comment.user_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,comment.comment,DATE_FORMAT(comment.created_at,'%d %m %Y,%H:%i:%s') AS created_at FROM mosque_announcement_file_comments as comment LEFT JOIN users ON comment.user_id = users.id WHERE comment.post_id = '${chk_post_file_id[0].post_id}' AND comment.post_file_id = '${post_file_id}' AND comment.id = '${file_comment_id}' order by comment.id DESC`;
                    var q = sql.query(query_text1, function (err, result1) {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                        }
                        async.forEachOf(result1, async (post_comment, key, callback) => {
                            var query_reply =  await helper.sql_query(sql, `SELECT reply.file_reply_id as reply_id,reply.file_comment_id,reply.post_id,reply.post_file_id,reply.user_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,reply.reply,reply.created_at,reply.created_at as time_ago FROM mosque_announcement_file_comment_replys as reply LEFT JOIN users ON reply.user_id = users.id WHERE reply.post_id = '${chk_post_file_id[0].post_id}' AND reply.post_file_id = '${post_file_id}' AND reply.user_id='${user_id}' AND reply.file_comment_id = '${file_comment_id}' AND reply.file_comment_id = '${post_comment.comment_id}' order by reply.file_reply_id DESC `).catch(console.log);

                            for(var i=0; i < query_reply.length; i++)
                            {
                                query_reply[i].time_ago = moment(query_reply[i].time_ago).fromNow(true);
                            }
                            
                            var setPostCmtDate = moment(post_comment.created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a');
                            console.log('result',post_comment);
                            var postComments = {
                                "comment_id": post_comment.comment_id,
                                "post_id": post_comment.post_id,
                                "post_file_id": post_comment.post_file_id,
                                "user_id": post_comment.user_id,
                                "mosque_name": post_comment.mosque_name,
                                "first_name": post_comment.first_name,
                                "last_name": post_comment.last_name,
                                "profile_photo": post_comment.profile_photo,
                                "comment": post_comment.comment,
                                "time_ago": moment(setPostCmtDate).fromNow(true),
                                "reply": query_reply,
                            };
                            console.log(postComments);
                            response.push(postComments);
            
                        }, err => {
                            if (err) console.error(err.message);
            
                            // console.log('chk_file_comment_id',chk_file_comment_id);

                            if(user_id != chk_file_comment_id[0].user_id)
                            {
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                                var tparam = {
                                    'user_ids': [chk_file_comment_id[0].user_id], // Registration Token For multiple users
                                };
                                helper.get_registration_token(tparam,async function (res) {
                                    // console.log("res",res);
                                    // if (res.length > 0) {
                                        var regTokens = (res.length > 0) ? res.map(res => res.token) : [];
                                        // Send Notification Message : Start

                                        // var set_body = `${first_name} ${last_name} wants to hire you at ${work_start_date} ${work_timing}.`;
                                        var loginUser =  await helper.sql_query(sql, `SELECT * FROM users WHERE id = '${user_id}' `).catch(console.log);
                                        var set_body = `User @${loginUser[0].first_name} ${loginUser[0].last_name} Reply your comment.`;
                                        var send_param = {
                                            'registration_token': regTokens,
                                            'title': appName,
                                            'body': set_body,
                                            'extra_data': {
                                                "activity": 'file_replys',
                                                "user_id": user_id,
                                                // "post_id": chk_post_file_id[0].id,
                                            }
                                        };
                                        // console.log(send_param);
                                        helper.send_notification(send_param, function (send_res) {
                                            // Save Notification Message in DB : Start
                                            var notify_params = {
                                                'user_id': chk_file_comment_id[0].user_id,
                                                'from_id': user_id,
                                                "post_id": chk_post_file_id[0].post_id,
                                                "activity": 'file_replys',
                                                'noti_type': 3,
                                                'description': set_body,
                                                'created_at': today,
                                            }
                                            helper.save_notification(notify_params);                                    
                                            
                                        });
                                        // Send Notification Message : End      
                                    // }
                                });
                                //::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
                            }
                            response_arr['success'] = 1;
                            response_arr['msg'] = `Sub post reply add Successfully!`;
                            response_arr['data'] = response;
                            result(null, response_arr);

                        });
                        
                        // response_arr['success'] = 1;
                        // response_arr['msg'] = `Post comment add Successfully!`;
                        // // response_arr['data'] = orderItem;
                        // result(null, response_arr);
                    });
                }else{
                    response_arr['msg'] = `can't save reply sub post data!`;
                    result(null, response_arr);
                }   
            });
        }else{
            response_arr['msg'] = `Please check Post File Id, File Comment Id & User Id.`;
            result(null, response_arr);
        }
    }
    
}

Model.getAnnouncementFileCommentModel = async function getAnnouncementFileCommentModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];
    var responseReply = [];

    var post_file_id = (param.post_file_id) ? param.post_file_id : '';
    var user_id = (param.user_id) ? param.user_id : ''; 
    
    var next_id = (param.next_id) ? param.next_id : 0;
	var last_id = parseInt(next_id) + 10;

    var next_arr = [];

    // var post_comment = [];
    console.log('Get Announcement File Comment: ',param);
    if(!post_file_id)
    {
        response_arr['msg'] = "post File id is Required";
        result(null, response_arr);
    }else if(!user_id)
    {
        response_arr['msg'] = "user id is Required";
        result(null, response_arr);
    }else{

        var chk_post_file_id =  await helper.sql_query(sql, `SELECT id FROM mosque_announcement_images WHERE id = '${post_file_id}' `).catch(console.log);
        var chk_user_id =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}'`).catch(console.log);
     
        if(chk_post_file_id.length > 0 && chk_user_id.length )
        {
            query_text1 = `SELECT comment.id as comment_id,comment.post_id,comment.post_file_id,comment.user_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,comment.comment,DATE_FORMAT(comment.created_at,'%d %m %Y,%H:%i:%s') AS created_at FROM mosque_announcement_file_comments as comment LEFT JOIN users ON comment.user_id = users.id WHERE comment.post_file_id = '${post_file_id}'  order by comment.id DESC LIMIT 10 OFFSET ${parseInt(next_id)}`;
            var q = sql.query(query_text1, function (err, result1) {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                async.forEachOf(result1, async (post_comment, key, callback) => {
                        var query_reply =  await helper.sql_query(sql, `SELECT reply.file_reply_id as reply_id,reply.file_comment_id,reply.post_id,reply.post_file_id,reply.user_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,reply.reply,reply.created_at ,reply.created_at as time_ago FROM mosque_announcement_file_comment_replys as reply LEFT JOIN users ON reply.user_id = users.id WHERE reply.post_file_id = '${post_comment.post_file_id}' AND reply.file_comment_id = '${post_comment.comment_id}' order by reply.file_reply_id DESC `).catch(console.log);
                        // var query_reply =  await helper.sql_query(sql, `SELECT reply_id FROM mosque_announcement_comment_replys WHERE post_id = '${post_id}' AND user_id='${user_id}' AND comment_id = '${post_comment.comment_id}' order by reply.reply_id DESC `).catch(console.log);
                        // async.forEachOf(query_reply, (comment_reply, key, callback) => {
                        //     console.log('comment_reply',comment_reply);
                        //     var setPostCmtReplyDate = moment(comment_reply.created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a');
                        //     var postCommentReply = {
                        //         "reply_id": comment_reply.reply_id,
                        //         "comment_id": comment_reply.comment_id,
                        //         "post_id": comment_reply.post_id,
                        //         "user_id": comment_reply.user_id,
                        //         "mosque_name": comment_reply.mosque_name,
                        //         "first_name": comment_reply.first_name,
                        //         "last_name": comment_reply.last_name,
                        //         "profile_photo": comment_reply.profile_photo,
                        //         "reply": comment_reply.reply, 
                        //         "time_ago": moment(setPostCmtReplyDate).fromNow(true),
                        //     };
                        //     responseReply.push(postCommentReply);
                        //     callback();
                        // });
                        // console.log('responseReply',responseReply);
                        for(var i=0; i < query_reply.length; i++)
                        {
                            query_reply[i].time_ago = moment(query_reply[i].time_ago).fromNow(true);
                        }

                        var setPostCmtDate = moment(post_comment.created_at, "DD MM YYYY hh:mm:ss").format('DD MMM YYYY, hh:mm a');
                        var postComments = {
                            "comment_id": post_comment.comment_id,
                            "post_id": post_comment.post_id,
                            "user_id": post_comment.user_id,
                            "mosque_name": post_comment.mosque_name,
                            "first_name": post_comment.first_name,
                            "last_name": post_comment.last_name,
                            "profile_photo": post_comment.profile_photo,
                            "comment": post_comment.comment,
                            "time_ago": moment(setPostCmtDate).fromNow(true),
                            // "reply_count": count(query_reply),
                            "reply": query_reply,
                        };
                        response.push(postComments);
                        // callback();
                }, err => {
                    if (err) console.error(err.message);

                    var query_text = `SELECT comment.id as comment_id,comment.post_id,comment.post_file_id,comment.user_id,users.mosque_name,users.first_name,users.last_name,CASE WHEN users.profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',users.profile_photo) ELSE '' END AS profile_photo,comment.comment,DATE_FORMAT(comment.created_at,'%d %m %Y,%H:%i:%s') AS created_at FROM mosque_announcement_file_comments as comment LEFT JOIN users ON comment.user_id = users.id WHERE comment.post_file_id = '${post_file_id}'  order by comment.id DESC;`;
                    sql.query(query_text, [], function(err, res) {
                        if(err) {
                            console.log("error: ", err);
                            result(err, null);
                        }

                        var total = res.length;
                        if(last_id > total) {
                            last_id = total;
                        }

                        var nextInfo = {
                            'total': total,
                            'next_id': last_id
                        }
                        // console.log('nextInfo',nextInfo);
                        next_arr.push(nextInfo);

                        response_arr['success'] = 1;
                        response_arr['msg'] = `Post comment add Successfully!`;
                        response_arr['data'] = response;
                        response_arr['next']    = nextInfo;
                        result(null, response_arr);
                        
                    });
                   
                });
            });

        }else{
            response_arr['msg'] = `Please check Post Id & User Id.`;
            result(null, response_arr);
        }
    }
    
}

Model.deleteFileCommentReplyModel = async function deleteFileCommentReplyModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var response = [];
    var responseReply = [];

    // var post_id = (param.post_id) ? param.post_id : '';
    var user_id = (param.user_id) ? param.user_id : '';
    var file_comment_id = (param.file_comment_id) ? param.file_comment_id : '';
    var file_reply_id = (param.file_reply_id) ? param.file_reply_id : '';  
    var delete_type = (param.delete_type) ? param.delete_type : 1;          // 1 = delete comment , 2 = delete Reply
    // var post_comment = [];
    console.log('Delete Announcement File Comment &  Reply : ',param);
    
    if(!user_id)
    {
        response_arr['msg'] = "user id is Required";
        result(null, response_arr);
    }else{

        // var chk_post_id =  await helper.sql_query(sql, `SELECT id FROM mosque_announcements WHERE id = '${post_id}' `).catch(console.log);
        var chk_user_id =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}'`).catch(console.log);
        var chk_cmt_id =  await helper.sql_query(sql, `SELECT id FROM mosque_announcement_file_comments WHERE id = '${file_comment_id}'`).catch(console.log);
     
        if( chk_user_id.length > 0 && chk_cmt_id.length > 0 )
        {
            if(delete_type == 1)
            {
                del_cmt =  await helper.sql_query(sql, `DELETE FROM mosque_announcement_file_comments WHERE id = '${file_comment_id}' AND user_id = '${user_id}' `).catch(console.log);
                if(del_cmt)
                {
                    del_reply =  await helper.sql_query(sql, `DELETE FROM mosque_announcement_file_comment_replys WHERE file_comment_id = '${file_comment_id}'  `).catch(console.log);
                }
                if(del_reply && del_cmt)
                {
                    response_arr['success'] = 1;
                    response_arr['msg'] = `Your Sub Post Comment Data Deleted Successfully!`;
                    // response_arr['data'] = response;
                    result(null, response_arr);
                }else{
                    response_arr['msg'] = `Comment data can't Delete !`;
                    result(null, response_arr);
                }
            }else{
                del_reply =  await helper.sql_query(sql, `DELETE FROM mosque_announcement_file_comment_replys WHERE file_reply_id = '${file_reply_id}' AND user_id = '${user_id}' `).catch(console.log);
                if(del_reply)
                {
                    response_arr['success'] = 1;
                    response_arr['msg'] = `Your Sub Post Reply data Deleted Successfully!`;
                    // response_arr['data'] = response;
                    result(null, response_arr);
                }else{
                    response_arr['msg'] = `Reply data can't Delete !`;
                    result(null, response_arr);
                }
            }
            
        }else{
            response_arr['msg'] = `Please check Post file Id, Comment Id & User Id.`;
            result(null, response_arr);
        }
    }
    
}

Model.publicGetNotificationsModel = async function publicGetNotificationsModel(req, result) {
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;

    var response_arr = [];
    var user_id = (param.user_id) ? param.user_id : 0;
    var noti_type = (param.noti_type) ? param.noti_type : 0;

    var next_id = (param.next_id) ? param.next_id : 0;
	var last_id = parseInt(next_id) + 20;

    var next_arr = [];

    if(noti_type == 0)
    {
       var filter = `AND (noti_type != 5 AND noti_type != 6) `;
    }else{
        var filter = `AND noti_type = '${noti_type}'`;
    }
    // var get_notification = await helper.sql_query(sql, `SELECT * FROM notifications WHERE user_id = '${user_id}'`).catch(console.log);
    // async.forEachOf(get_notification,async (notification, key, callback) => {    
    //     console.log('get_notification',notification.activity);
    var query_text = `SELECT notifications.*,Cast(notifications.from_id as int) as from_id 
    ,DATE_FORMAT(notifications.created_at,'%Y-%m-%d %H:%i:%s') as created_at,users.first_name,users.last_name,CASE WHEN profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',profile_photo) ELSE '' END AS profile_photo,notifications.post_id as post_id , post.type as post_type, post.description as post_description ,notifications.feed_id, feed.title as feed_title ,feed.description as feed_description FROM notifications 
    LEFT JOIN users ON users.id = notifications.from_id LEFT JOIN mosque_announcements as post ON notifications.post_id = post.id 
    LEFT JOIN mosque_pro_feed as feed ON notifications.feed_id = feed.id AND notifications.from_id = feed.mosque_id
    WHERE notifications.user_id = '${user_id}' ${filter} ORDER BY notifications.created_at DESC LIMIT 20 OFFSET ${parseInt(next_id)};`;
    console.log(query_text);
    // Update as Read Notification
    await helper.sql_query(sql, `UPDATE notifications SET is_read = 1 WHERE notifications.user_id = '${user_id}' ${filter}`).catch(console.log);

    var q = sql.query(query_text, function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        }
        var response = [];
        async.forEachOf(res,async (noti, key, callback) => {
            if(noti.post_type == null)
            {
                noti.post_type = 0;
            }
            if(noti.post_description == null)
            {
                noti.post_description = '';
            }
            
            if(noti.feed_title == null)
            {
                noti.feed_title = '';
            }
            if(noti.feed_description == null)
            {
                noti.feed_description = '';
            }

            var get_time_ago = moment(noti.created_at).fromNow(true);
            // Replace ago word
            time_ago_arr = get_time_ago.split(" ");

            var numeric_val = (time_ago_arr && time_ago_arr[0]) ? time_ago_arr[0] : '';
            var time_string = (time_ago_arr && time_ago_arr[1]) ? time_ago_arr[1] : '';

            var new_time_string = '';

            console.log('time_string',time_string);
            if (get_time_ago == 'a few seconds') {
                new_time_string = 'now';
            }
            else if (get_time_ago == 'a minute') {
                new_time_string = '1 min';
            }
            else if (get_time_ago == 'an hour') {
                new_time_string = '1 hr';
            }
            else if (get_time_ago == 'a day') {
                new_time_string = '1 d';
            }
            else if (get_time_ago == 'a month') {
                new_time_string = '1 m';
            }
            else if (get_time_ago == 'a year') {
                new_time_string = '1 y';
            }
            else if (get_time_ago == 'a week') {
                new_time_string = '1 w';
            }
            else {
                switch (time_string) {

                    case "years":
                        new_time_string = `${numeric_val} y`;
                        break;
                    case "months":
                        new_time_string = `${numeric_val} m`;
                        break;
                    case "weeks":
                        new_time_string = `${numeric_val} w`;
                        break;
                    case "days":
                        new_time_string = `${numeric_val} d`;
                        break;
                    case "hours":
                        new_time_string = `${numeric_val} hr`;
                        break;
                    case "minutes":
                        new_time_string = `${numeric_val} min`;
                        break;
                    case "seconds":
                        new_time_string = `${numeric_val} s`;
                        break;
                    default:
                        new_time_string = get_time_ago;
                }
            }
            noti.time_ago = new_time_string;
            // if(noti.post_type !='')
            // {
                // var postFiles =  await helper.sql_query(sql, `SELECT id,CASE WHEN file!='' THEN CONCAT('${fullUrl}/posts/',file) ELSE '' END AS file, created_at FROM mosque_announcement_images WHERE announcement_id = '${noti.post_id}'`).catch(console.log);
            // }else{
            //     var postFiles = [];
            // }
            // console.log('postFiles',postFiles);

            // noti.post_file = postFiles;
            
            response.push(noti)
        }, err => {
            if (err) console.error(err.message);

            var query_text3 = `SELECT notifications.*,Cast(notifications.from_id as int) as from_id 
            ,DATE_FORMAT(notifications.created_at,'%Y-%m-%d %H:%i:%s') as created_at,users.first_name,users.last_name,CASE WHEN profile_photo!='' THEN CONCAT('${fullUrl}/uploadsProfilePhoto/',profile_photo) ELSE '' END AS profile_photo,notifications.post_id as post_id , post.type as post_type, post.description as post_description ,notifications.feed_id, feed.title as feed_title ,feed.description as feed_description FROM notifications 
            LEFT JOIN users ON users.id = notifications.from_id LEFT JOIN mosque_announcements as post ON notifications.post_id = post.id 
            LEFT JOIN mosque_pro_feed as feed ON notifications.feed_id = feed.id AND notifications.from_id = feed.mosque_id
            WHERE notifications.user_id = '${user_id}' ${filter} ORDER BY notifications.created_at DESC `;
            sql.query(query_text3, function(err, res) {
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }

                var total = res.length;
                if(last_id > total) {
                    last_id = total;
                }

                var nextInfo = {
                    'total': total,
                    'next_id': last_id
                }
                next_arr.push(nextInfo);

                response_arr['success'] = 1;
                response_arr['msg'] = 'Notification get successfully.';
                response_arr['record'] = response;
                response_arr['next']    = nextInfo;
                result(null, response_arr);
            });
            
        });

    });
    // });
};

Model.publicNotificationCounterModel = async function publicNotificationCounterModel(req, result) {
    var fullUrl = req.protocol + '://' + req.get('host');
    files_param = req.files;
    var param = req.body;
    var dt = dateTime.create();
    var today = dt.format('Y-m-d H:M:S');
    var response_arr = [];
    var user_id = (param.user_id) ? param.user_id : '';

    var chk_user =  await helper.sql_query(sql, `SELECT id FROM users WHERE id = '${user_id}' AND users.soft_delete = '0'`).catch(console.log);

        if(chk_user == '')
        {
            response_arr['msg'] = "User not found.";
            result(null, response_arr);
        }

    var otherAllNotificationCount =  await helper.sql_query(sql, `SELECT count(id) as counter FROM notifications WHERE  user_id = '${user_id}' AND is_read ='0' AND (noti_type != 5 AND noti_type != 6) `).catch(console.log);
    var MosqueFeedNotificationCount =  await helper.sql_query(sql, `SELECT count(id) as counter FROM notifications WHERE  user_id = '${user_id}' AND is_read ='0' AND noti_type = '5' `).catch(console.log);
    var PrayerNotificationCount =  await helper.sql_query(sql, `SELECT count(id) as counter FROM notifications WHERE  user_id = '${user_id}' AND is_read ='0' AND noti_type = '6' `).catch(console.log);
    var counter = {
        "NotificationCount":otherAllNotificationCount[0].counter,
        "MosqueFeedNotificationCount":MosqueFeedNotificationCount[0].counter,
        "PrayerNotificationCount":PrayerNotificationCount[0].counter,
    };
    response_arr['success'] = 1;
    response_arr['msg'] = `User Get Counter Successfully!`;
    response_arr['data'] = counter;
    result(null, response_arr);

};

//******************************************************************************************* */


// Model.VerifyOTPModel = function VerifyOTPModel(req, result) {
//     var dt = dateTime.create();
//     var today = dt.format('Y-m-d H:M:S');
//     var fullUrl = req.protocol + '://' + req.get('host');
//     var param = req.body;

//     var response_arr = [];

//     var user_id = (param.user_id) ? param.user_id : '';
//     var otp_code = (param.otp_code) ? param.otp_code : '';
//     var verify_for = (param.verify_for) ? param.verify_for : '';

//     var firebase_token = (param.firebase_token) ? param.firebase_token : '';
//     var device = (param.device) ? param.device : 1;
//     var device_token = (param.device_token) ? param.device_token : '';

//     var EditProfile = [];
//     console.log(`VerifyOTP : ${JSON.stringify(param)}`);

//     check_logged_in_user_status(param).then((login_res) => {
//         console.log('login_res:', login_res.length, login_res);
//         if (login_res.length == 0) {
//             response_arr['msg'] = 'logout';
//             result(null, response_arr);
//             return;
//         }
//         else {
//             query_text = `SELECT id,registration_id,name,photo,email,gender,dial_code,contact_no,pricing,dob,password,m_password,status,user_type,notification_flag FROM users WHERE id='${user_id}' and otp_code='${otp_code}' `;

//             var q = sql.query(query_text, function (err, res) {
//                 if (err) {
//                     console.log("error: ", err);
//                     result(err, null);
//                 }

//                 if (res.length > 0) {

//                     console.log('ef', res[0].id);
//                     var user_type = res[0].user_type;
//                     if (res[0].contact_no == '') {
//                         res[0].contact_no = '-';
//                     }

//                     if (res[0].user_type == 2) {
//                         res[0].user_type = 'User';
//                     } else if (res[0].user_type == 2) {
//                         res[0].user_type = 'Consultant';
//                     }

//                     if (res[0].password == null) {
//                         res[0].password = '-';
//                     }

//                     if (res[0].pricing == "") {
//                         res[0].pricing = '-';
//                     }


//                     var res_photo = (res[0].photo) ? res[0].photo : '';
//                     if (res_photo && res_photo.indexOf("http://") == 0 || res_photo.indexOf("https://") == 0) {
//                         res[0].photo = res[0].photo;
//                     } else {
//                         res[0].photo = (res_photo) ? fullUrl + "/uploadsProfile/" + res[0].photo : '';
//                     }

//                     if (verify_for == '2') {
//                         response_arr['success'] = 1;
//                         response_arr['msg'] = ' Change Mobile No. OTP code verified in successfully.';
//                         response_arr['data'] = res;
//                         result(null, response_arr);
//                     } else {
//                         var token = {
//                             'user_id': res[0].id,
//                             'token': firebase_token,
//                             'user_type': user_type,
//                             'device': device,
//                             'deviceToken': device_token,
//                             'created_at': today,
//                         };
//                         console.log('dvf', token);
//                         var query_text = `SELECT token,device FROM tbl_login_token WHERE token = '${firebase_token}' AND device = '${device}' AND user_id = '${res[0].id}';`;
//                         sql.query(query_text, token, function (err, res3) {
//                             if (err) {
//                                 console.log("error: ", err);
//                                 result(err, null);
//                             }
//                             else {
//                                 if (res3.length === 0) {
//                                     var query_text = `INSERT INTO tbl_login_token SET ?;`;
//                                     sql.query(query_text, token, function (err, res4) {
//                                         if (err) {
//                                             console.log("error: ", err);
//                                             result(err, null);
//                                         }
//                                         // else {
//                                         // console.log("RESPONSE3",res4);
//                                         // }
//                                     })
//                                 }
//                                 // else {
//                                 //     console.log('Already exist');
//                                 // }
//                             }
//                         });
//                         console.log('check Query', res[0].status);
//                         if (res[0].status == '2') {
//                             gateway.customer.create(
//                                 {
//                                     firstName: res[0].name,
//                                     lastName: "",
//                                     company: "VipMe",
//                                     email: res[0].email,
//                                     phone: res[0].contact_no,
//                                     fax: "614.555.5678",
//                                     website: "www.example.com"
//                                 }, function (err, resRegisterData) {
//                                     resRegisterData.success;
//                                     // true

//                                     var braintree_customer_id = resRegisterData.customer.id;
//                                     console.log(braintree_customer_id);
//                                     // gateway.customer.find(res2[0].registration_id, function(err, customer) {
//                                     //     console.log('fg',customer);
//                                     // });
//                                     var VerifyUser = `UPDATE users SET status='1', registration_id='${braintree_customer_id}' WHERE id='${res[0].id}' `;
//                                     var q = sql.query(VerifyUser, function (err, res1) {
//                                         if (err) {
//                                             console.log("error: ", err);
//                                             result(err, null);
//                                         }
//                                         if (res1.affectedRows > 0) {
//                                             var query_text = "SELECT id,registration_id,name,photo,email,dial_code,contact_no,password,otp_code,user_type,notification_flag,status,dob,case when photo != '' then CONCAT('" + fullUrl + "/uploadsProfile/', photo) else '' end as photo FROM users WHERE id = ?";
//                                             sql.query(query_text, [res[0].id], function (err, res2) {
//                                                 if (err) {
//                                                     console.log("error: ", err);
//                                                     result(err, null);
//                                                 }
//                                                 if (res2[0].contact_no == null) {
//                                                     res2[0].contact_no = '-';
//                                                 }
//                                                 if (res2[0].password == null) {
//                                                     res2[0].password = '-';
//                                                 }

//                                                 if (res2[0].user_type == 2) {
//                                                     res2[0].user_type = 'User';
//                                                 } else if (res2[0].user_type == 2) {
//                                                     res2[0].user_type = 'Consultant';
//                                                 }
//                                                 // console.log('result',res2);

//                                                 if (res2[0].registration_id != '') {
//                                                     gateway.customer.find(res2[0].registration_id, function (err, customer) {
//                                                         console.log('sc', customer.paymentMethods);
//                                                         if (customer.paymentMethods != '') {
//                                                             var card = 'Avalable';
//                                                         } else {
//                                                             var card = 'Not Available';
//                                                         }
//                                                         EditProfile.push({
//                                                             "id": res2[0].id,
//                                                             "name": res2[0].name,
//                                                             "photo": res2[0].photo,
//                                                             "email": res2[0].email,
//                                                             "gender": res2[0].gender,
//                                                             "dob": res2[0].dob,
//                                                             "dial_code": res2[0].dial_code,
//                                                             "contact_no": res2[0].contact_no,
//                                                             // "otp_code":otp_code,
//                                                             "status": res2[0].status,
//                                                             "user_type": res2[0].user_type,
//                                                             "notification_flag": res2[0].notification_flag,
//                                                             "registration_id": res2[0].registration_id,
//                                                             "Payment_Card": card,
//                                                             "Password": res2[0].m_password,
//                                                         });

//                                                         response_arr['success'] = 1;
//                                                         response_arr['msg'] = 'User Signup verification Successfully.';
//                                                         response_arr['data'] = EditProfile;
//                                                         result(null, response_arr);
//                                                     });
//                                                 } else {
//                                                     EditProfile.push({
//                                                         "id": res2[0].id,
//                                                         "name": res2[0].name,
//                                                         "photo": res2[0].photo,
//                                                         "email": res2[0].email,
//                                                         "gender": res2[0].gender,
//                                                         "dob": res2[0].dob,
//                                                         "dial_code": res2[0].dial_code,
//                                                         "contact_no": res2[0].contact_no,
//                                                         // "otp_code":otp_code,
//                                                         "status": res2[0].status,
//                                                         "user_type": res2[0].user_type,
//                                                         "notification_flag": res2[0].notification_flag,
//                                                         "registration_id": '',
//                                                         "Payment_Card": 'Not Availabel',
//                                                         "Password": res2[0].m_password,
//                                                     });
//                                                     response_arr['success'] = 1;
//                                                     response_arr['msg'] = 'Profile Detail get successfully.';
//                                                     response_arr['data'] = EditProfile;
//                                                     result(null, response_arr);
//                                                 }

//                                                 // response_arr['success'] = 1;
//                                                 // response_arr['msg'] = 'User Signup verification Successfully.';
//                                                 // response_arr['data'] = EditProfile;
//                                                 // result(null, response_arr);
//                                             });
//                                         }
//                                     });
//                                 });
//                         } else {

//                             if (res[0].registration_id != '') {
//                                 gateway.customer.find(res[0].registration_id, function (err, customer) {
//                                     console.log(customer.paymentMethods[0] != '');
//                                     if (customer.paymentMethods != '') {
//                                         var card = 'Avalable';
//                                     } else {
//                                         var card = 'Not Available';
//                                     }
//                                     EditProfile.push({
//                                         "id": res[0].id,
//                                         "name": res[0].name,
//                                         "photo": res[0].photo,
//                                         "email": res[0].email,
//                                         "gender": res[0].gender,
//                                         "dob": res[0].dob,
//                                         "dial_code": res[0].dial_code,
//                                         "contact_no": res[0].contact_no,
//                                         // "otp_code":otp_code,
//                                         "status": res[0].status,
//                                         "user_type": res[0].user_type,
//                                         "notification_flag": res[0].notification_flag,
//                                         "registration_id": res[0].registration_id,
//                                         "Payment_Card": card,
//                                         "Password": res[0].m_password,
//                                     });

//                                     response_arr['success'] = 1;
//                                     response_arr['msg'] = 'User Signup already verification Successfully.';
//                                     response_arr['data'] = EditProfile;
//                                     result(null, response_arr);
//                                 });
//                             } else {
//                                 EditProfile.push({
//                                     "id": res[0].id,
//                                     "name": res[0].name,
//                                     "photo": res[0].photo,
//                                     "email": res[0].email,
//                                     "gender": res[0].gender,
//                                     "dob": res[0].dob,
//                                     "dial_code": res[0].dial_code,
//                                     "contact_no": res[0].contact_no,
//                                     // "otp_code":otp_code,
//                                     "status": res[0].status,
//                                     "user_type": res[0].user_type,
//                                     "notification_flag": res[0].notification_flag,
//                                     "registration_id": 'User not Register',
//                                     "Payment_Card": 'Not Avalable',
//                                     "Password": res[0].m_password,
//                                 });
//                                 response_arr['success'] = 1;
//                                 response_arr['msg'] = 'User Signup already verification Successfully.';
//                                 response_arr['data'] = EditProfile;
//                                 result(null, response_arr);
//                             }

//                         }

//                     }
//                     // result(null, response_arr);

//                 } else {
//                     response_arr['msg'] = "OTP code verification failed!";
//                     result(null, response_arr);
//                 }
//             });
//         }
//     });


// };

// // -------------------- Consultant API ---------------------------//


// async function check_logged_in_user_status(param) {
//     console.log("Demo::", param);
//     var loggined_user_id = (param.loggined_user_id) ? param.loggined_user_id : '';
//     var device_token = (param.device_token) ? param.device_token : '';
//     console.log('check_logged_in_user_status:', loggined_user_id, device_token);
//     var check_existing_user = await helper.sql_query(sql, `SELECT * FROM tbl_login_token WHERE user_id = '${loggined_user_id}' AND token = '${device_token}'`, []);
//     return check_existing_user;
// }

module.exports = Model;
'user strict';
var FCM            = require('fcm-node');
var sql            = require('./db.js');
var request        = require("request");

const oldfirebase_key = 'AIzaSyAtWlEagZM3I1nJKwMBJ3sdk7omgyOWoo8';
// const firebase_key = "AAAANtr-WRg:APA91bE8-IIIYKl_JH5Z6EUex67dpoXtfqSA706mR41pjidTXkYg7SegwHuxKLkD3RO_adaE-kNDCkQHlcN0k1HYok9oCgf2uIfmsYa2HqL8b2LmepfWJQ4zssJSTBtDkEYi7nxpQyo2";
const firebase_key = "AAAAyiHns_4:APA91bFS-t85_4b-3JYKmMJ9xszhNHvMd9SFlx1z0dvVCLWHVEYz7EeHHbkCAqp3gISL96F5LEnRG2XUqXdgQlSIFlbGnXl-DZbLnzqCkW4Ghfe2KRmEPMReSNNYfk2XWedbp4PUjC7x";

const sms_auth_key = '';

module.exports = {
    sum: function(a,b) {
        return a+b
    },
    send_notification: function (params, callback) {
        var fcm = new FCM(firebase_key);
        console.log('sd',params);
        var notification = params.notification_flag;
        
        var sound = (params.notification_sound) ? params.notification_sound  : 'customNotificationTone.wav';
        var content_available = (params.content_available) ? params.content_available  : false;
		// if(notification == '1')
		// {

        /*
        // Android
        if(params.device && params.device == 1){
        */
            var message = { 
                // to: params.registration_token, 
                registration_ids:params.registration_token,
                collapse_key: '',            
                notification: {
                    title: params.title, 
                    body: params.body,
                },                       
                data: params.extra_data
            };
            fcm.send(message, function(err, response){
                if (err) {
                    console.log("Something has gone wrong!",err);
                    callback(false);
                } else {
                    console.log("Successfully sent with response: ", response);
                    callback(true);
                }
            });
        /*
        }
        //IOS
        else if(params.device && params.device == 2) {
            var message = { 
                // to: params.registration_token, 
                registration_ids:params.registration_token,
                collapse_key: '',
                "priority" : "high",   
                "content_available" : content_available,               
                notification: {
                    "title": params.title, 
                    "body": params.body,
                    "sound":sound,
                    // "badge" : 5,
                    // "content-available":content_available,
					"click_action": 'NotificationViewController',
                },
                data: params.extra_data
            };
            fcm.send(message, function(err, response){
                if (err) {
                    console.log("Something has gone wrong!",err);
                    callback(false);
                } else {
                    console.log("Successfully sent with response: ", response);
                    callback(true);
                }
            });
        }*/
        		
    },
    send_mail: function(params) {
        return true;
    },
    save_notification: function(notify_params) {   
        // console.log('notify_params',notify_params);
        var query_text = "INSERT INTO notifications SET ?";
		sql.query(query_text, notify_params, function (err, res) {
			if (err) {
				console.log("Notification Save Error: ", err);
				return false;
            }
            console.log('Notification Saved.'); 
            if(res.insertId)
                return true 
            else 
                return false;
		});
    },
    get_registration_token: function(params, callback) {
        var user_ids = (params.user_ids && params.user_ids.length > 0) ? params.user_ids.join() : 0;
        console.log('user_ids',user_ids);
        // console.log('params',params);
        var response_arr = [];
        var query_text = "SELECT token FROM `tbl_login_token` WHERE user_id IN (?)";
		sql.query(query_text, [user_ids], function (err, res) {
			if (err) {
				console.log("Get Registration Token: ", err);
				return false;
            }
            // console.log('ressddagvdg',res);
            if(res.length > 0){
                callback(res);
            }
            else{
                callback(response_arr);
            }
		});
    },

    get_user_registration_token: function(params, callback) {
        var user_id = (params.user_id) ? params.user_id : 0;
        // console.log(user_ids);
        var response_arr = [];
        var query_text = "SELECT token,device,deviceToken FROM `tbl_login_token` WHERE user_id IN (?) ORDER BY id DESC LIMIT 1";
		sql.query(query_text, [user_id], function (err, res) {
			if (err) {
				console.log("Get Registration Token: ", err);
				return false;
            }
            if(res.length > 0){
                callback(res);
            }
            else{
                callback(response_arr);
            }
		});
    },

    send_otp: function(params) {
        var otp         = params.otp;
        var mobile_no   = params.mobile_no;
        var options = { method: 'GET',
          url: 'http://msg.icloudsms.com/rest/services/sendSMS/sendGroupSms',
          qs: 
           { AUTH_KEY: sms_auth_key,
             message: 'Dear User,\nYour Login OTP is '+ otp +'.\nNever share this OTP with anyone. \nTeam .\nT&C Apply.',
             senderId: '',
             routeId: '8',
             mobileNos: mobile_no,
             smsContentType: 'english' },
          headers: 
           { 'Cache-Control': 'no-cache' } };

        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          console.log(body);
        });
    },
    verify_jwt: function (params, callback) {
       var query_text = "SELECT id FROM tbl_users WHERE  id = ? AND username = ? AND _token = ?";
		sql.query(query_text, [params.id, params.username,params.bearerToken], function (err, res) {
			if (err) {
				console.log("Token Verify Error: ", err);
				return false;
            }
            if(res.length > 0)
                callback(true);
            else 
                callback(false);
		});
    },
    sql_query: async (conn, q, params) => new Promise((resolve, reject) => {
        const handler = (error, result) => {
            if (error) {
            reject(error);
            return;
            }
            resolve(result);
        }
        conn.query(q, params, handler);
    }),
};

//::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
/*var tparam = {
	'user_ids': [5], // Registration Token For multiple users
};
helper.get_registration_token(tparam, function (res) {
	if(res.length > 0){
		var regTokens = res.map(res => res.token);
		// Send Notification Message : Start
		var send_param =  {
			'registration_token' : regTokens,
			'title' : "Demo",
			'body' : "This is Body Section",
			'extra_data' : {  
                "title":'Title1',
                "body":'Body Section1',
                "type":"follower",
                "from_id": 1,
                "post_id": 1
            }
		};
		helper.send_notification(send_param, function (res2) {
			if(res2){
				// Save Notification Message in DB : Start
				var notify_params = {
					'type' : 'follower',
					'user_id' : 5,
					'from_id' : 3,
					'post_id' : 0,
					'comment_id' : 0,
					'status' : 0,
					'created_at' : '',
					'updated_at' : '',
				}
				helper.save_notification(notify_params);
				// Save Notification Message in DB : End
			}
		});
		// Send Notification Message : End		
	}	
});*/
//::::::::::::::::::::::::: Notification Module:::::::::::::::::::::
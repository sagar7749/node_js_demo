'use strict';

var Model = require('./appModel');
var fs = require('fs');
var sql = require('./db.js');
const { REFUSED } = require('dns');

exports.demo = function(req, res) {
    Model.demoModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg });               
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

// Chat Module
exports.chatSendMsg = function(req, res) {
	Model.chatSendMsgModel(req, function(err, data) {
		if(err) { res.send(err); return; }
		if(data && data.success) {
			res.status(200).send({ success:true, message: data.msg, data: data.data });
		} else {
			res.status(200).send({ success:false, message: data.msg });
		}
	});
};

exports.chatUsers = function(req, res) {
	Model.chatUsersModel(req, function(err, data) {
		if(err) { res.send(err); return; }
		if(data && data.success) {
			res.status(200).send({ success:true, message: data.msg, data:data.data, next: data.next });
		} else {
			res.status(200).send({ success:false, message: data.msg });
		}
	});
};

exports.chatMsgList = function(req, res) {
	Model.chatMsgListModel(req, function(err, data) {
		if(err) { res.send(err); return; }
		if(data && data.success) {
			res.status(200).send({ success:true, message: data.msg, data:data.data, next: data.next });
		} else {
			res.status(200).send({ success:false, message: data.msg });
		}
	});
};

exports.get_chat_count = function(req, res) {
	Model.get_chat_countModel(req, function(err, data) {
		if(err) { res.send(err); return; }
		if(data && data.success) {
			res.status(200).send({ success:true, message: data.msg , data: data.data });
		} else {
			res.status(200).send({ success:false, message: data.msg });
		}
	});
};

exports.deleteChatMessage = function(req, res) {
	Model.deleteChatMessageModel(req, function(err, data) {
		if(err) { res.send(err); return; }
		if(data && data.success) {
			res.status(200).send({ success:true, message: data.msg , data: data.data });
		} else {
			res.status(200).send({ success:false, message: data.msg });
		}
	});
};

exports.deleteUserChat = function(req, res) {
	Model.deleteUserChatModel(req, function(err, data) {
		if(err) { res.send(err); return; }
		if(data && data.success) {
			res.status(200).send({ success:true, message: data.msg , data: data.data });
		} else {
			res.status(200).send({ success:false, message: data.msg });
		}
	});
};

// -------------------- Comman API ---------------------------//
exports.cmsPage = function(req, res) {
    Model.cmsPageModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.cms_data });               
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.getLanguage = function(req, res) {
    Model.getLanguageModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.cms_data });               
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.signup = function(req, res) {
    Model.signupModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.record, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.login = function(req, res) {
    Model.loginModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
            // res.status(200).send({ success: true, message: data.msg, data: data.data, token: data.jwttoken });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.logout = function(req, res) {
    Model.logoutModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
            // res.status(200).send({ success: true, message: data.msg, data: data.data, token: data.jwttoken });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.ForgotPassword = function(req, res) {
    Model.ForgotPasswordModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
            // res.status(200).send({ success: true, message: data.msg, data: data.data, token: data.jwttoken });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.changePassword = function(req, res) {
    Model.changePasswordModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.changePassword, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.changeMobileNo = function(req, res) {
    Model.changeMobileNoModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.changePassword, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.getProfile = function(req, res) {
    Model.getProfileModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.getProfile, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.updateProfile = function(req, res) {
    Model.updateProfileModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.updateProfile_data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.getSubscriptionPlan = function(req, res) {
    Model.getSubscriptionPlanModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.record, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.userSubscription = function(req, res) {
    Model.userSubscriptionModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.record, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.notification_On_Off = function(req, res) {
    Model.notification_On_OffModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

// -------------------- Mosque & College API ---------------------------//
exports.descriptionAdd = function(req, res) {
    Model.descriptionAddModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.getMosqueDescription = function(req, res) {
    Model.getMosqueDescriptionModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, next:data.next, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.updateMosqueDescription = function(req, res) {
    Model.updateMosqueDescriptionModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.addPrayer = function(req, res) {
    Model.addPrayerModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.mosqueGetPrayer = function(req, res) {
    Model.mosqueGetPrayerModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.mosqueUpdatePrayer = function(req, res) {
    Model.mosqueUpdatePrayerModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.projectAdd = function(req, res) {
    Model.projectAddModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.projectDelete = function(req, res) {
    Model.projectDeleteModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.mosqueProjectList = function(req, res) {
    Model.mosqueProjectListModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data,next:data.next });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.mosqueProjectDetail = function(req, res) {
    Model.mosqueProjectDetailModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.mosqueProject_Delete_StopDonation = function(req, res) {
    Model.mosqueProject_Delete_StopDonationModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.countDonation = function(req, res) {
    Model.countDonationModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.donationHistory = function(req, res) {
    Model.donationHistoryModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data,next:data.next });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.productAdd = function(req, res) {
    Model.productAddModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.mosqueProductList = function(req, res) {
    Model.mosqueProductListModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, cart_counter: data.cart_counter,next: data.next });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.mosqueProductDetail = function(req, res) {
    Model.mosqueProductDetailModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, cart_counter: data.cart_counter, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.mosqueProductAction = function(req, res) {
    Model.mosqueProductActionModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.productEdit = function(req, res) {
    Model.productEditModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.deleteProductImage = function(req, res) {
    Model.deleteProductImageModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.mosqueOrder = function(req, res) {
    Model.mosqueOrderModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data,next:data.next });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.mosqueOrderStatus = function(req, res) {
    Model.mosqueOrderStatusModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.addMosqueFeed = function(req, res) {
    Model.addMosqueFeedModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.getPoster = function(req, res) {
    Model.getPosterModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.getThemes = function(req, res) {
    Model.getThemesModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.addAnnouncement = function(req, res) {
    Model.addAnnouncementModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.updateAnnouncement = function(req, res) {
    Model.updateAnnouncementModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.deleteAnnouncementFile = function(req, res) {
    Model.deleteAnnouncementFileModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.deletePoll = function(req, res) {
    Model.deletePollModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.getAnnouncement = function(req, res) {
    Model.getAnnouncementModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data,next:data.next });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.getPollAnswer = function(req, res) {
    Model.getPollAnswerModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data,next:data.next });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.getAnnouncementDetail = function(req, res) {
    Model.getAnnouncementDetailModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.getAnnouncementImage = function(req, res) {
    Model.getAnnouncementImageModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data,next:data.next });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.deleteAnnouncement = function(req, res) {
    Model.deleteAnnouncementModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.getNotifications = function(req, res) {
    Model.getNotificationsModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.record, next: data.next, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.notificationCounter = function(req, res) {
    Model.notificationCounterModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

// ------------------------ Public API ------------------------------//
exports.setDefaultMosque = function(req, res) {
    Model.setDefaultMosqueModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.mosqueList = function(req, res) {
    Model.mosqueListModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data,next:data.next });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.mosqueDetail = function(req, res) {
    Model.mosqueDetailModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.searchMosque = function(req, res) {
    Model.searchMosqueModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.addUserJourney = function(req, res) {
    Model.addUserJourneyModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.getUserJourney = function(req, res) {
    Model.getUserJourneyModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, next: data.next, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.deleteUserJourney = function(req, res) {
    Model.deleteUserJourneyModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.publicGetPrayer = function(req, res) {
    Model.publicGetPrayerModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.mosqueDonation = function(req, res) {
    Model.mosqueDonationModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.publicProductAddTocart = function(req, res) {
    Model.publicProductAddTocartModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, cart_counter: data.cart_counter , final_total: data.final_total });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.publicProductShowCart = function(req, res) {
    Model.publicProductShowCartModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, cart_counter: data.cart_counter, final_total: data.final_total  });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.publicProductDeleteCart = function(req, res) {
    Model.publicProductDeleteCartModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.publicProductCountCart = function(req, res) {
    Model.publicProductCountCartModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.publicGetOrderAddress = function(req, res) {
    Model.publicGetOrderAddressModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.publicSetOrderAddress = function(req, res) {
    Model.publicSetOrderAddressModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.publicAddOrderAddress = function(req, res) {
    Model.publicAddOrderAddressModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg, data: data.data });
        }
    });
};

exports.publicDeleteOrderAddress = function(req, res) {
    Model.publicDeleteOrderAddressModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg, data: data.data });
        }
    });
};

exports.addCard = function(req, res) {
    Model.addCardModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.cardshow = function(req, res) {
    Model.cardshowModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.showCard, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.cardDelete = function(req, res) {
    Model.cardDeleteModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.publicCheckoutBuy = function(req, res) {
    Model.publicCheckoutBuyModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.publicOrderItem = function(req, res) {
    Model.publicOrderItemModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data,next: data.next, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.publicMyOrder = function(req, res) {
    Model.publicMyOrderModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data,next: data.next, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.publicOrderDetail = function(req, res) {
    Model.publicOrderDetailModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.publicMyDonations = function(req, res) {
    Model.publicMyDonationsModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data,next:data.next });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.getPollData = function(req, res) {
    Model.getPollDataModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.deactivateAccount = function(req, res) {
    Model.deactivateAccountModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.announcementLikeUnlike = function(req, res) {
    Model.announcementLikeUnlikeModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.announcementComment = function(req, res) {
    Model.announcementCommentModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.announcementCommentReply = function(req, res) {
    Model.announcementCommentReplyModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.getAnnouncementComment = function(req, res) {
    Model.getAnnouncementCommentModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data,next:data.next });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.deleteCommentReply = function(req, res) {
    Model.deleteCommentReplyModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.subPostLikeUnlike = function(req, res) {
    Model.subPostLikeUnlikeModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.announcementFileComment = function(req, res) {
    Model.announcementFileCommentModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.announcementFileCommentReply = function(req, res) {
    Model.announcementFileCommentReplyModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.getAnnouncementFileComment = function(req, res) {
    Model.getAnnouncementFileCommentModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data,next:data.next });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.deleteFileCommentReply = function(req, res) {
    Model.deleteFileCommentReplyModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.publicGetNotifications = function(req, res) {
    Model.publicGetNotificationsModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.record, next: data.next, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

exports.publicNotificationCounter = function(req, res) {
    Model.publicNotificationCounterModel(req, function(err, data) {
        if (err) { res.send(err); return; }
        if (data && data.success) {
            res.status(200).send({ success: true, message: data.msg, data: data.data, });
        } else {
            res.status(200).send({ success: false, message: data.msg });
        }
    });
};

/****************************************************************************************** */

// exports.VerifyOTP = function(req, res) {
//     Model.VerifyOTPModel(req, function(err, data) {
//         if (err) { res.send(err); return; }
//         if (data && data.success) {
//             res.status(200).send({ success: true, message: data.msg, data: data.data, });
//             // res.status(200).send({ success: true, message: data.msg, data: data.data, token: data.jwttoken });
//         } else {
//             res.status(200).send({ success: false, message: data.msg });
//         }
//     });
// };


exports.getPrivacyPage = (req, res) => {
    var param = req.body;
    var files_param = req.files;
    var fullUrl = req.protocol + '://' + req.get('host');
    var response_arr = [];
    var id = req.query.id
    console.log('dfds',id);
    var pagename = (param.pagename) ? param.pagename : '';
    var query_text = `SELECT *,DATE_FORMAT(updated_at,'%Y-%m-%d %H:%i') as updated_at FROM cms where slug = '${pagename}'`;
    // console.log(query_text);
    var q = sql.query(query_text, function (err, res) {
        if (err) {
            console.log("error: ", err);
            res(err, null);
        }
        // console.log(res.length);
        if (res.length > 0) {
            // response_arr['success'] = 1;
            // response_arr['msg'] = 'CMS Page Data Show successfully.';
            // response_arr['cms_data'] = res;
            // res(null, response_arr);
            res.send({ success: true, message: "Post get successfully!", data: res });
        } else {
            res.send({ success: false, message: 'fgdsgdsg' });
        }
    });
    // res.render('privacy_policies'); 
};

exports.getHelpPage = (req, res) => {

    var param = req.body;
    var files_param = req.files;
    var fullUrl = req.protocol + '://' + req.get('host');
  
    var response_arr = [];  
    console.log('Get Help:',param);  
    res.render('help');
};

exports.getAboutPage = (req, res) => {

    var param = req.body;
    var files_param = req.files;
    var fullUrl = req.protocol + '://' + req.get('host');
  
    var response_arr = [];  
    console.log('Get About:',param);  
    res.render('about_us');
};

exports.getTermPage = (req, res) => {

    var param = req.body;
    var files_param = req.files;
    var fullUrl = req.protocol + '://' + req.get('host');
  
    var response_arr = [];  
    console.log('Get Terms:',param);  
    res.render('terms');
};

exports.getFaqPage = (req, res) => {

    var param = req.body;
    var files_param = req.files;
    var fullUrl = req.protocol + '://' + req.get('host');
  
    var response_arr = [];  
    console.log('Get Faq:',param);  
    res.render('faq');
};

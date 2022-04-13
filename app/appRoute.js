'use strict';
module.exports = function(app) {
    var Controller = require('./appController');
    // var AdminController = require('./adminController');
    const jwt = require('jsonwebtoken');
    var helper = require('./helpers.js');
    

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    // Routes

    app.all('/api/demo', Controller.demo);

    //Chat Module
    app.post('/api/chat_send_message', Controller.chatSendMsg);
    app.post('/api/get_chat_users', Controller.chatUsers);
    app.post('/api/get_chat_message', Controller.chatMsgList);
    app.post('/api/get_chat_count', Controller.get_chat_count);
    app.post('/api/delete_chat_message', Controller.deleteChatMessage);
    app.post('/api/delete_user_chat', Controller.deleteUserChat);
    
// -------------------- Comman API ---------------------------//
    app.all('/api/cms', Controller.cmsPage);    

    app.all('/api/getLanguage', Controller.getLanguage);    

    app.all('/api/signup', Controller.signup);
    
    app.all('/api/login', Controller.login);

    app.all('/api/logout', Controller.logout);

    app.all('/api/forgotPassword', Controller.ForgotPassword);

    app.all('/api/changePassword', Controller.changePassword);

    app.all('/api/changeMobileNo', Controller.changeMobileNo);

    app.all('/api/getProfile', Controller.getProfile);

    app.all('/api/updateProfile', Controller.updateProfile);
    
    app.all('/api/get_subscription_plan', Controller.getSubscriptionPlan);

    app.all('/api/user_subscription', Controller.userSubscription);

    app.all('/api/notification_settings', Controller.notification_On_Off);
    
// -------------------- Mosque & College API ---------------------------//
    app.all('/api/mosque/mosque_DescriptionAdd', Controller.descriptionAdd);

    app.all('/api/mosque/get_mosque_description', Controller.getMosqueDescription);
    
    app.all('/api/mosque/update_mosque_description', Controller.updateMosqueDescription);

    app.all('/api/mosque/add_prayer', Controller.addPrayer);

    app.all('/api/mosque/mosque_GetPrayer', Controller.mosqueGetPrayer);

    app.all('/api/mosque/mosque_UpdatePrayer', Controller.mosqueUpdatePrayer);

    app.all('/api/mosque/mosque_ProjectAdd', Controller.projectAdd);
    
    app.all('/api/mosque/mosque_ProjectDelete', Controller.projectDelete);

    app.all('/api/ProjectList', Controller.mosqueProjectList);

    app.all('/api/ProjectDetail', Controller.mosqueProjectDetail);

    app.all('/api/mosque/mosque_Project_Delete_StopDonation', Controller.mosqueProject_Delete_StopDonation);

    app.all('/api/mosque/count_donation', Controller.countDonation);

    app.all('/api/mosque/donation_history', Controller.donationHistory);

    app.all('/api/mosque/mosque_ProductAdd', Controller.productAdd);

    app.all('/api/ProductList', Controller.mosqueProductList);

    app.all('/api/ProductDetail', Controller.mosqueProductDetail);

    app.all('/api/mosque/ProductAction', Controller.mosqueProductAction);

    app.all('/api/mosque/ProductUpdate', Controller.productEdit);

    app.all('/api/mosque/deleteProductImage', Controller.deleteProductImage);

    app.all('/api/mosque/mosqueOrder', Controller.mosqueOrder);

    app.all('/api/mosque/mosqueOrderStatus', Controller.mosqueOrderStatus);

    app.all('/api/mosque/add_mosque_feed', Controller.addMosqueFeed);

    app.all('/api/mosque/getPosters', Controller.getPoster);

    app.all('/api/mosque/getThemes', Controller.getThemes);

    //------------------------------ Post Module  -------------------------------------//
    app.all('/api/mosque/addAnnouncement', Controller.addAnnouncement);

    app.all('/api/mosque/updateAnnouncement', Controller.updateAnnouncement);

    app.all('/api/mosque/deleteAnnouncementFile', Controller.deleteAnnouncementFile);

    app.all('/api/mosque/deletePoll', Controller.deletePoll);
    
    app.all('/api/mosque/getAnnouncement', Controller.getAnnouncement);

    app.all('/api/mosque/getPollAnswer', Controller.getPollAnswer);

    app.all('/api/mosque/getAnnouncementDetail', Controller.getAnnouncementDetail);
    
    app.all('/api/mosque/getAnnouncementImage', Controller.getAnnouncementImage);

    app.all('/api/mosque/deleteAnnouncement', Controller.deleteAnnouncement);

    app.all('/api/mosque/get_notifications', Controller.getNotifications);

    app.all('/api/mosque/notificationCounter', Controller.notificationCounter);

// -------------------- Public API ---------------------------//
    app.all('/api/public/set_default_mosque', Controller.setDefaultMosque);

    app.all('/api/public/mosque_list', Controller.mosqueList);

    app.all('/api/public/mosque_detail', Controller.mosqueDetail);

    app.all('/api/public/search_mosque', Controller.searchMosque);

    app.all('/api/public/add_user_journey', Controller.addUserJourney);

    app.all('/api/public/get_user_journey', Controller.getUserJourney);

    app.all('/api/public/delete_user_journey', Controller.deleteUserJourney);

    // app.all('/api/ProjectList', Controller.mosqueProjectList);  -- Use Mosque Project List API 

    // app.all('/api/ProjectDetail', Controller.mosqueProjectDetail);    --  Use Mosque Project Detail API 

    app.all('/api/public/mosque_donation', Controller.mosqueDonation);

    // app.all('/api/ProductList', Controller.mosqueProductList);  -- Use Mosque Product List API 

    // app.all('/api/ProductDetail', Controller.mosqueProductDetail);    --  Use Mosque Product Detail API 

    app.all('/api/public/productAddToCart', Controller.publicProductAddTocart);

    app.all('/api/public/productShowCart', Controller.publicProductShowCart);

    app.all('/api/public/productDeleteCart', Controller.publicProductDeleteCart);

    app.all('/api/public/productCountCart', Controller.publicProductCountCart);

    app.all('/api/public/getOrderAddress', Controller.publicGetOrderAddress);

    app.all('/api/public/setOrderAddress', Controller.publicSetOrderAddress);

    app.all('/api/public/addOrderAddress', Controller.publicAddOrderAddress);

    app.all('/api/public/deleteOrderAddress', Controller.publicDeleteOrderAddress);

    app.all('/api/public/addCard', Controller.addCard);

    app.all('/api/public/cardshow', Controller.cardshow);

    app.all('/api/public/cardDelete', Controller.cardDelete);

    app.all('/api/public/buyNowOrder', Controller.publicCheckoutBuy);

    app.all('/api/public/orderItem', Controller.publicOrderItem);

    app.all('/api/public/myOrderList', Controller.publicMyOrder);

    app.all('/api/public/myOrderDetail', Controller.publicOrderDetail);

    app.all('/api/public/myDonations', Controller.publicMyDonations);

    app.all('/api/public/give_poll_answer', Controller.getPollData);

    app.all('/api/public/deactivateAccount', Controller.deactivateAccount);

    //------------------------------ Post -------------------------------------//
    app.all('/api/public/announcementLikeUnlike', Controller.announcementLikeUnlike);

    app.all('/api/public/announcementComment', Controller.announcementComment);

    app.all('/api/public/announcementCommentReply', Controller.announcementCommentReply);

    app.all('/api/public/getAnnouncementComment', Controller.getAnnouncementComment);

    app.all('/api/public/deleteComment_Reply', Controller.deleteCommentReply);

    //------------------------------Sub Post -------------------------------------//
    app.all('/api/public/subPostLikeUnlike', Controller.subPostLikeUnlike);

    app.all('/api/public/announcementFileComment', Controller.announcementFileComment);

    app.all('/api/public/announcementFileCommentReply', Controller.announcementFileCommentReply);

    app.all('/api/public/getAnnouncementFileComment', Controller.getAnnouncementFileComment);

    app.all('/api/public/deleteFileComment_Reply', Controller.deleteFileCommentReply);

    app.all('/api/public/get_notifications', Controller.publicGetNotifications);

    app.all('/api/public/notificationCounter', Controller.publicNotificationCounter);

//-------------------------------------------//

    // app.all('/api/user/VerifyOTP', Controller.VerifyOTP);

    // app.all('/api/VerifyOTP', Controller.VerifyOTP);

// -------------------- Consultant API ---------------------------//

    // app.all('/postDetail',[],Controller.getPrivacyPage);
    app.get('/help',[],Controller.getHelpPage);
    app.get('/about-us',[],Controller.getAboutPage);
    app.get('/terms-conditions',[],Controller.getTermPage);
    app.get('/faq',[],Controller.getFaqPage);
    
    // Verify Token
    function verifyToken(req, res, next) {
        // Get auth header value
        const bearerHeader = req.headers['authorization'];
        // console.log('bearerHeader', bearerHeader);
        // Check if bearer is undefined
        if (typeof bearerHeader !== 'undefined') {
            // Split at the space
            const bearer = bearerHeader.split(' ');
            // Get token from array
            const bearerToken = bearer[1];
            // Verify token
            jwt.verify(bearerToken, 'blufff123', (err, authData) => {
                if (err) {
                    res.status(403).json({ 'status': 403, 'message': 'Forbidden' });
                } else {
                    var params = {
                        "id": authData.jwt_user.id,
                        "username": authData.jwt_user.username,
                        "bearerToken": bearerToken,
                    }
                    helper.verify_jwt(params, function(response) {
                        if (response) {
                            // Next middleware
                            next();
                        } else {
                            // Forbidden
                            res.status(403).json({ 'status': 403, 'message': 'Forbidden' });
                        }
                    });
                }
            });
        } else {
            // Forbidden
            res.status(403).json({ 'status': 403, 'message': 'Forbidden' });
        }

    }





};
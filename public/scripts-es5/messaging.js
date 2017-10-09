/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}

window.friendlyPix = window.friendlyPix || {};

/**
                                                * Handles notifications.
                                                */
friendlyPix.Messaging = function () {

  /**
                                      * Inititializes the notifications utility.
                                      * @constructor
                                      */
  function _class() {var _this = this;_classCallCheck(this, _class);
    // Firebase SDK
    this.database = firebase.database();
    this.auth = firebase.auth();
    this.storage = firebase.storage();
    this.messaging = firebase.messaging();

    $(document).ready(function () {
      // DOM Elements
      _this.enableNotificationsContainer = $('.fp-notifications');
      _this.enableNotificationsCheckbox = $('#notifications');
      _this.enableNotificationsLabel = $('.mdl-switch__label', _this.enableNotificationsContainer);

      _this.toast = $('.mdl-js-snackbar');

      // Event bindings
      _this.enableNotificationsCheckbox.change(function () {return _this.onEnableNotificationsChange();});
      _this.auth.onAuthStateChanged(function () {return _this.trackNotificationsEnabledStatus();});
      _this.messaging.onTokenRefresh(function () {return _this.saveToken();});
      _this.messaging.onMessage(function (payload) {return _this.onMessage(payload);});
    });
  }

  /**
     * Saves the token to the database if available. If not request permissions.
     */_createClass(_class, [{ key: 'saveToken', value: function saveToken()
    {var _this2 = this;
      this.messaging.getToken().then(function (currentToken) {
        if (currentToken) {
          friendlyPix.firebase.saveNotificationToken(currentToken).then(function () {
            console.log('Notification Token saved to database');
          });
        } else {
          _this2.requestPermission();
        }
      }).catch(function (err) {
        console.error('Unable to get messaging token.', err);
      });
    }

    /**
       * Requests permission to send notifications on this browser.
       */ }, { key: 'requestPermission', value: function requestPermission()
    {var _this3 = this;
      console.log('Requesting permission...');
      this.messaging.requestPermission().then(function () {
        console.log('Notification permission granted.');
        _this3.saveToken();
      }).catch(function (err) {
        console.error('Unable to get permission to notify.', err);
      });
    }

    /**
       * Called when the app is in focus.
       */ }, { key: 'onMessage', value: function onMessage(
    payload) {
      console.log('Notifications received.', payload);

      // If we get a notification while focus on the app
      if (payload.notification) {
        var userId = payload.notification.click_action.split('/user/')[1];

        var data = {
          message: payload.notification.body,
          actionHandler: function actionHandler() {return page('/user/' + userId);},
          actionText: 'Profile',
          timeout: 10000 };

        this.toast[0].MaterialSnackbar.showSnackbar(data);
      }
    }

    /**
       * Triggered when the user changes the "Notifications Enabled" checkbox.
       */ }, { key: 'onEnableNotificationsChange', value: function onEnableNotificationsChange()
    {
      var checked = this.enableNotificationsCheckbox.prop('checked');
      this.enableNotificationsCheckbox.prop('disabled', true);

      return friendlyPix.firebase.toggleNotificationEnabled(checked);
    }

    /**
       * Starts tracking the "Notifications Enabled" checkbox status.
       */ }, { key: 'trackNotificationsEnabledStatus', value: function trackNotificationsEnabledStatus()
    {var _this4 = this;
      if (this.auth.currentUser) {
        friendlyPix.firebase.registerToNotificationEnabledStatusUpdate(function (data) {
          _this4.enableNotificationsCheckbox.prop('checked', data.val() !== null);
          _this4.enableNotificationsCheckbox.prop('disabled', false);
          _this4.enableNotificationsLabel.text(data.val() ? 'Notifications Enabled' : 'Enable Notifications');
          friendlyPix.MaterialUtils.refreshSwitchState(_this4.enableNotificationsContainer);

          if (data.val()) {
            _this4.saveToken();
          }
        });
      }
    } }]);return _class;}();


friendlyPix.messaging = new friendlyPix.Messaging();
//# sourceMappingURL=messaging.js.map
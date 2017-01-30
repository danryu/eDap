/**
 * Copyright 2013 Google Inc. All Rights Reserved.
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

// Namespace initialization.
var dmp = dmp || {};

/** If sandbox should be used. */
dmp.useSandbox = false;

/** The IDs of the Files opened in the playlist. */
dmp.fileIds = [];

/** The ID of the file currently playing. */
dmp.playingFileId = undefined;

/** The ID of the folder which was opened from the Drive UI. */
dmp.folderId = undefined;

/** The Label of the folder which was opened from the Drive UI. */
dmp.folderLabel = undefined;

/** If test user. */
dmp.testUser = false;

// Called once Google APIs library has loaded.
function init() {
  if (dmp.useSandbox) {
    gapi.config.update('googleapis.config/root', 'https://content-googleapis-test.sandbox.google.com');
  }
  gapi.load('picker', {'callback': dmp.init});
}

/**
 * First initiates authorization and then starts the audio player.
 */
dmp.init = function() {
  dmp.addJqueryPlugins();

  // First make sure we are authorized to access the Drive API.
  dmp.auth.initAuth(function () {
    dmp.drive.aboutGet(function (user, error) {
      if (error) {
        console.log("about error: " + error);
        dmp.testUser = false;
      } else {
        dmp.testUser = user.emailAddress.indexOf("@google.com") != -1;
        console.log("isTestUser: " + dmp.testUser);
      }
      // Extracting all the file IDs to play.
      var fileIds = dmp.url.getFileIdsFromStateParam();
      for (var index = 0; index < fileIds.length; index++) {
        dmp.playlist.audioList.push({id: fileIds[index]});
      }
      // Makes a pretty URL from the current playlist.
      dmp.url.makePrettyUrl();
      // Hide/show the empty playlist message depending songs are selected.
      dmp.ui.toggleEmptyPlaylist();
      // Builds a picker object.
      dmp.ui.buildPicker();
      // Create an entry for each songs.
      dmp.ui.createSongEntries();
      // Now we can initialize the Player and play some audio files.
      dmp.player.initPlayer();
    });
  });
};

// Adds plugins to jquery.
dmp.addJqueryPlugins = function() {
  // JQuery plugin to compares if 2 jquery elements contains the same elements.
  $.fn.equals = function(compareTo) {
    if (!compareTo || this.length != compareTo.length) {
      return false;
    }
    for (var i = 0; i < this.length; ++i) {
      if (this[i] !== compareTo[i]) {
        return false;
      }
    }
    return true;
  };
};

// Polyfills

if (!window.console) {
  console = {log: function() {}};
}

navigator.browserInfo = (function(){
    var ua= navigator.userAgent, tem,
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return { browser: M[0], version: M[1] };
})();

// String#trim() polyfill
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

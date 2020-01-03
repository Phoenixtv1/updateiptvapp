!--
Copyright 2014 Google Inc. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 -->
<!--
This sample demonstrates how to build your own Receiver for use with Google
Cast.
A receiver is typically an HTML5 application with a html, css, and JavaScript
components.
In this HTML5 page, we include our style sheet, the Receiver SDK, and our player
JavaScript code.
We Then define two layers within the player:
1. The media layers
2. The Overlay layers
The overlay layer holds:
   a. Logo for startup page
   b. Media Artwork and information during loading
   c. controls for Pause / Seek
 -->
<!DOCTYPE html>
<html>
<head>
    <title>TyphoonCaster</title>
    <link rel="stylesheet" href="player.css"/>
    <script type="text/javascript"
            src="//www.gstatic.com/cast/sdk/libs/receiver/2.0.0/cast_receiver.js">
    </script>
    <script type="text/javascript"
            src="//www.gstatic.com/cast/sdk/libs/mediaplayer/1.0.0/media_player.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script type="text/javascript" src="player.js"></script>
    <script type="text/javascript" src="tomodo.korz.js"></script>
    <script>
    </script>
</head>
<body style="margin: 0">
<div id="player" class="player">
    <div class="media">
        <video></video>
    </div>
    <div class="logo"></div>
    <div class="spinner"></div>
    <div class="watermark"></div>
    <div class="gradient"></div>
    <div class="overlay">
        <div class="media-info">
            <div class="media-artwork"></div>
            <div class="media-text">
                <div class="media-title"></div>
                <div class="media-subtitle"></div>
            </div>
        </div>
        <div class="controls">
            <span class="controls-play-pause"></span>
            <span class="controls-cur-time"></span>
            <span class="controls-total-time"></span>
            <div class="controls-progress">
                <div class="controls-progress-inner progressBar"></div>
                <div class="controls-progress-thumb"></div>
            </div>
        </div>
    </div>
</div>
<script>
    var playerDiv = document.getElementById('player');
    var castPlayer = new sampleplayer.CastPlayer(playerDiv);
    /**
     * Use the messageBus to listen for incoming messages on a virtual channel using a namespace string.
     * Also use messageBus to send messages back to a sender or broadcast a message to all senders.
     * You can check the cast.receiver.CastMessageBus.MessageType that a message bus processes though a call
     * to getMessageType. As well, you get the namespace of a message bus by calling getNamespace()
     */
    console.log(castPlayer);
    window.messageBus = castPlayer.receiverManager_.getCastMessageBus('urn:x-cast:com.instantbits.cast.webvideo.channel');
    /**
     * The namespace urn:x-cast:com.google.devrel.custom is used to identify the protocol of showing/hiding
     * the heads up display messages (The messages defined at the beginning of the html).
     *
     * The protocol consists of one string message: show
     * In the case of the message value not being show - the assumed value is hide.
     **/
    window.messageBus.onMessage = function (event) {
        console.log("### Message Bus - Media Message: " + JSON.stringify(event));
        console.log("### CUSTOM MESSAGE: " + JSON.stringify(event));
        // show/hide messages
        console.log(event['data']);
        var json = JSON.parse(event['data']);
        if (json.corsServer) {
            korz.router = json.corsServer;
        }
        if (json.on){
            korz.ON();
        }else{
            korz.OFF();
        }
    }
    /*castPlayer.mediaElement_.addEventListener('error', function (obj) {
        console.log("error");
        if (window.XMLHttpRequest != korz.SuperHttpRequest && castPlayer.lastEvent != null) {
            korz.ON();
        } else {
            korz.OFF();
        }
    }, true);*/
    korz.OFF();
    castPlayer.start();
</script>
<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-48650902-2', 'rackcdn.com');
    ga('send', 'pageview');
</script>
</body>
</html>


	  

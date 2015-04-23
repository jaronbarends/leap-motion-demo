;(function($) {

	var $obj = $('#obj'),
		$logwin = $('#logwin'),
		$logHands = $('#log-hands'),
		lastHandCount,
		$logLeft = $('#log-left'),
		$logRight = $('#log-right'),
		handLogs = {
			left: $logLeft,
			right: $logRight
		};

	/**
	* 
	* @param {leap motion gesture object} g Description
	* @param {leap motion hand object} h Description
	* @returns {undefined}
	*/
	var moveObject = function(g, h, toLeftOrRight) {

		if (h.type === 'right' && toLeftOrRight === 'toLeft') {
			$obj.removeClass('to-right').addClass('to-left');
		} else if (h.type === 'left' && toLeftOrRight === 'toRight') {
			$obj.removeClass('to-left').addClass('to-right');
		}
	};


	/**
	* 
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var circleHandler = function(g, h) {
		//console.log(g);
		if (g.state === 'stop'){
			/*
			var dir = g.direction;
			//console.log(dir, g, h);


			var toLeftOrRight = (dir[0] > 0) ? 'toRight' : 'toLeft';
			//console.log(toLeftOrRight);

			moveObject(g, h, toLeftOrRight);
			*/
		}

	};
	
	

	/**
	* 
	* @param {leap motion gesture object} g Description
	* @param {leap motion hand object} h Description
	* @returns {undefined}
	*/
	var swipeHandler = function(g, h) {
		if (g.state === 'stop'){
			var dir = g.direction;
			//console.log(dir, g, h);

			var toLeftOrRight = (dir[0] > 0) ? 'toRight' : 'toLeft';
			//console.log(toLeftOrRight);

			moveObject(g, h, toLeftOrRight);
		}
	};
	

	/**
	* 
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var addGestureListeners = function() {
	
		var controller = Leap.loop({enableGestures: true}, function(frame){
			if (frame.valid) {
				//if (frame.hands.length) {
					var handCount = frame.hands.length;
					// if (handCount !== lastHandCount) {
					// 	logHands(frame.hands);
					// 	lastHandCount = handCount;
					// }

					if (handCount) {
						logHands(frame.hands);
					}
				//}
			}
		  if(frame.valid && frame.gestures.length > 0){
          	var hand = frame.hands[0];
		    frame.gestures.forEach(function(gesture){
		        switch (gesture.type){
		          case "circle":
		              console.log("Circle Gesture");
		              circleHandler(gesture, hand);
		              break;
		          case "keyTap":
		              console.log("Key Tap Gesture");
		              break;
		          case "screenTap":
		              console.log("Screen Tap Gesture");
		              break;
		          case "swipe":
		              swipeHandler(gesture, hand);
		              break;
		        }
		    });
		  }
		});
		
	};


	/**
	* log a hand's data
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var logHand = function(hand) {
		var which = hand.type;
		var $log = handLogs[which];

		//$log.
		var pos = hand.palmPosition;
		$log.find('.x').text(Math.floor(pos[0]));
		$log.find('.y').text(Math.floor(pos[1]));
		$log.find('.z').text(Math.floor(pos[2]));
	};
	


	/**
	* 
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var logHands = function(hands) {
		var msg,
			detected = {
				right: false,
				left: false
			};

		for (var i=0; i<hands.length; i++) {
			var h = hands[i];
			logHand(h);
			detected[h.type] = true;
		}

		if (detected.right) {
			$logRight.removeClass('absent');
		} else {
			$logRight.addClass('absent');
		}

		if (detected.left) {
			$logLeft.removeClass('absent');
		} else {
			$logLeft.addClass('absent');
		}

		//log(msg, $logHands);
	};
	


	/**
	* 
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var log = function(msg, $elm) {
		$elm.html(msg);
	};
	


	/**
	* 
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var init = function() {
		addGestureListeners();
	};



	$(document).ready(init);

})(jQuery);
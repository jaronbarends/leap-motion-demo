;(function($) {

	var $obj = $('#obj'),
		$logwin = $('#logwin'),
		$logHands = $('#log-hands'),
		lastHandCount,
		$logLeft = $('#log-left'),
		$logRight = $('#log-right'),
		$handLeftSimple = $('#hand--left--simple'),
		$handRightSimple = $('#hand--right--simple'),
		handLogs = {
			left: $logLeft,
			right: $logRight
		},
		handSimpleObjs = {
			left: $handLeftSimple,
			right: $handRightSimple
		};

	var $handLeft = $('#hand--left--points'),
		$handRight = $('#hand--right--points'),
		fingerNamesMap = ['thumb', 'indexFinger', 'middleFinger', 'ringFinger', 'pinky'],//finger names mapped to finger type integers
		hands = {
			left: {
				obj: $handLeft,
				palm: $handLeft.find('.palm'),
				thumb: $handLeft.find('.thumb'),
				indexFinger: $handLeft.find('.indexFinger'),
				middleFinger: $handLeft.find('.middleFinger'),
				ringFinger: $handLeft.find('.ringFinger'),
				pinky: $handLeft.find('.pinky')
			},
			right: {
				obj: $handRight,
				palm: $handRight.find('.palm'),
				thumb: $handRight.find('.thumb'),
				indexFinger: $handRight.find('.indexFinger'),
				middleFinger: $handRight.find('.middleFinger'),
				ringFinger: $handRight.find('.ringFinger'),
				pinky: $handRight.find('.pinky')
			}
		};


	/**
	* 
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var initMainLoop = function() {
	
		var controller = Leap.loop({enableGestures: true}, function(frame){
			if (frame.valid) {
				var handCount = frame.hands.length;

				if (handCount) {
					updateHands(frame.hands);
					logHands(frame.hands);
				} else {
					$handLeftSimple.removeClass('js-detected');
					$handRightSimple.removeClass('js-detected');
				}
			}
		});
		
	};


	/**
	* updates each finger's position
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var updateFinger = function(finger, leftOrRight, palmPos) {
		//console.log(fingerNamesMap[finger.type]);
		var fingerName = fingerNamesMap[finger.type],
			$finger = hands[leftOrRight][fingerName],
			pos = finger.tipPosition,
			x = Math.floor(pos[0])-palmPos[0],
			z = Math.floor(pos[1])-palmPos[1],
			y = Math.floor(pos[2])-palmPos[2];

			$finger.css({'transform': 'translate('+x+'px, '+y+'px)'});
	};
	


	/**
	* 
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var updateHand = function(hand) {
		var leftOrRight = hand.type,
			$hs = handSimpleObjs[leftOrRight],
			palmPos = hand.palmPosition,
			palmX = Math.floor(palmPos[0]),
			palmZ = Math.floor(palmPos[1]),
			palmY = Math.floor(palmPos[2]);

		$hs.addClass('js-detected')
			.css({'transform': 'translate('+palmX+'px, '+palmY+'px)'});

		var $hp = hands[hand.type].obj,
			$palm = hands[hand.type].palm,
			fingers = hand.fingers;

		$hp.addClass('js-detected')
			.css({'transform': 'translate('+palmX+'px, '+palmY+'px)'});

		//$palm.css({'transform': 'translate('+x+', '+y+')'});

		for (var i=0; i<fingers.length; i++) {
			var finger = fingers[i];
			updateFinger(finger, leftOrRight, [palmX,palmZ,palmY]);
		}

	};
	


	/**
	* 
	* @param {leap hands object} hands Description
	* @returns {undefined}
	*/
	var updateHands = function(hnds) {
		var detected = {
			right: false,
			left: false
		};

		for (var i=0; i<hnds.length; i++) {
			var h = hnds[i];
			updateHand(h);
			detected[h.type] = true;
		}

		if (!detected.right) {
			$handRightSimple.removeClass('js-detected');
		}

		if (!detected.left) {
			$handLeftSimple.removeClass('detected');
		}
		
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
	var logHands = function(hnds) {
		var msg,
			detected = {
				right: false,
				left: false
			};

		for (var i=0; i<hnds.length; i++) {
			var h = hnds[i];
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
		initMainLoop();
	};



	$(document).ready(init);

})(jQuery);
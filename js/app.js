app = {
	led: '',
	pitch: ['rising fastball','RH 4 seam fastball','RH 2 seam fastball','RH screwball','LH slider','LH curveball','sinker','RH curveball','RH slider','LH screwball','LH 2 seam fastball','LH 4 seam fastball','knuckleball'],
	ready: false,
	name: 'spinball',
	onMessage: {
		saveTimeSlot: function(messageObj) {
		},
		getPSCList: function(messageObj) {
		},
		buildPSCList: function(messageObj) {
		}
	},
	UpdatePSCList : function() {
		return true;
	},
    DrawMap : function(latlng) {
	},
	createDisplay : function () {
		var display = new SegmentDisplay("display");
		display.segmentCount	= 14
		display.pattern         = "######";
		display.cornerType      = 0;
		display.displayAngle    = 0,00;
		display.digitHeight     = 20,00;
		display.digitWidth      = 15,00;
		display.digitDistance   = 3,20;
		display.segmentWidth    = 2,00;
		display.segmentDistance = 0,10;
		display.colorOn         = "#ff2c0f";
		display.colorOff        = "#631605";
		display.draw();
		display.setValue('   MPH');
		app.led = display;
	},
	setSwitches: function() {
		/*
		var flow = window.localStorage.getItem('geodemo-traffic-flow');
		var incidents = window.localStorage.getItem('geodemo-traffic-incidents');
		var construction = window.localStorage.getItem('geodemo-traffic-construction');
		$('#traffic-flow').val(flow).flipswitch("refresh");
		$('#traffic-incidents').val(incidents).flipswitch('refresh');
		$('#traffic-construction').val(construction).flipswitch('refresh');
		*/
	},
	detectDevice: function() {
        var version = "unknown";
		if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) version = 'iphone';
		if (navigator.platform.indexOf("iPad") != -1 && window.devicePixelRatio == 1) {
			var version = "ipad";
			if (event.acceleration) version = "iPad2";
			else version="iPad Mini";
		}
		console.log('divice: '+version);
		return version
	}
};

var deviceReady = $.Deferred();
var jqueryReady = $.Deferred();
var mobileReady = $.Deferred();

document.addEventListener('deviceready', function () {
	app.id = device.uuid;
	alert(app.id);
	document.addEventListener("resume", function () {
		var foo;
	}, false);
	 document.addEventListener("pause", function () {
		var foo;
	 }, false);
	deviceReady.resolve();
	console.log('device: ready');
});

$(document).ready(function() {
	var device = app.detectDevice();
	app.createDisplay();
	if (device == 'iphone') {
		$("#pitch-speed").attr("data-width","140");
		$("#pitch-type").attr("data-width","140");
		$("#pitch-spin").attr("data-width","140");
		$("#pitch-speed").attr("data-height","140");
		$("#pitch-type").attr("data-height","140");
		$("#pitch-spin").attr("data-height","140");
	};
	if (device == 'ipad') {
		$("#pitch-speed").attr("data-width","250");
		$("#pitch-type").attr("data-width","250");
		$("#pitch-spin").attr("data-width","250");
		$("#pitch-speed").attr("data-height","250");
		$("#pitch-type").attr("data-height","250");
		$("#pitch-spin").attr("data-height","250");
	};
	if (device == 'unknown') {
		$("#pitch-speed").attr("data-width","250");
		$("#pitch-type").attr("data-width","250");
		$("#pitch-spin").attr("data-width","250");
		$("#pitch-speed").attr("data-height","250");
		$("#pitch-type").attr("data-height","250");
		$("#pitch-spin").attr("data-height","250");
		$("#pitch-speed").css({"font-size":"25px !important"})
	};
	
	$( "body>[data-role='panel']" ).panel({
		beforeopen: function( event, ui ) {
			app.setSwitches();
		},
		close: function( event, ui ) {
			/*
			$.jStorage.set('geodemo-traffic-flow', $('#traffic-flow').val());
			$.jStorage.set('geodemo-traffic-incidents', $('#traffic-incidents').val());
			$.jStorage.set('geodemo-traffic-construction', $('#traffic-construction').val());
			*/
		}
	});
	$( "#machine-settings > [data-role='flipswitch']" ).flipswitch({create: function( event, ui ) {} });
	$( "[data-role='navbar']" ).navbar();
	$( "[data-role='header'], [data-role='footer']" ).toolbar();
	app.setSwitches();
	$("#pitchTypeSelect").bind( "change", function(event, ui) {
		$('#pitch-type').val($(this).val()).trigger('change');
	});
	
	$( "#btnConnect" ).click(function( event ) {
		console.log('btnConnect-clicked');
		$.mobile.navigate( "#control", {
			info: "info about the #bar hash"
		});
	});
	
	jqueryReady.resolve();
	console.log('jquery resolve');
});

$( document ).on( "mobileinit", function() {
	mobileReady.resolve();
	console.log('mobile: ready');
});

$( document ).on( "pagecreate", "#control", function() {
	console.log('pagecreate: control');
});
$( document ).on( "pagecreate", "#connect", function() {
	console.log('pagecreate: connect');
});

$.when(deviceReady, jqueryReady, mobileReady).done(function () {
	$( "#app-container>[data-role='panel']" ).panel({
		beforeopen: function( event, ui ) {
			app.setTrafficSwitches();
		},
		close: function( event, ui ) {
			/*
			window.localStorage.setItem('geodemo-traffic-flow', $('#traffic-flow').val());
			window.localStorage.setItem('geodemo-traffic-incidents', $('#traffic-incidents').val());
			window.localStorage.setItem('geodemo-traffic-construction', $('#traffic-construction').val());
			*/
		}
	});
	$( "#traffic-settings > [data-role='flipswitch']" ).flipswitch({create: function( event, ui ) {} });
	$( "[data-role='navbar']" ).navbar();
	$( "[data-role='header'], [data-role='footer']" ).toolbar();
	
	$("#reserveSave").click(function(){
		$(".reserve-error").hide().trigger( "updatelayout" );
		var psc = $(".reserve-header").text(),
			lname = $("#LastName").val(),
			fname = $("#FirstName").val(),
			tslot = $('input[name=times]:checked').val(),
			error = "";
		if ( lname == "" ) error = "Last Name,";
		if ( fname == "" ) error += "First Name,";
		if ( tslot == "" ) error += "Time Slot,";
		if ( error !== "" ) {
			navigator.notification.alert(error, null, "Fields Required", "Ok");
			return false;
		}
		$.mobile.loading( "show", {
            text: "Reserving Time Slot...",
            textVisible: true,
    	});
		var date = new Date().toUTCString();
		var url = "http://cypos.com:8080/json/geodemo/webServiceReserveTimeSlot?id="+app.id+"&psc="+psc+"&lastname="+lname+"&firstname="+fname+"&timeslot="+tslot+"&date="+date;
		var jqxhr = $.getJSON( url, function(obj) {
			$.mobile.loading( "hide" );
			$(':mobile-pagecontainer').pagecontainer('change', '#List', {
				changeHash: true,
				reverse: true,
				showLoadMsg: true
			});
		});
	});
	
	$( document ).on( "pagecontainerchange", function() {
		var page = $( ".ui-page-active" ).attr('id');
		console.log('pagecontainerchange: '+page);
		$( "[data-role='navbar'] a.ui-btn-active" ).removeClass( "ui-btn-active" );
		$( "[data-role='navbar'] a" ).each(function() {
			if ( $( this ).text() === $( ".ui-page-active" ).attr('id') ) {
				$( this ).addClass( "ui-btn-active" );
			}
		});
		if ( page == "connect") {
		}
		if ( page == "control") {
		}
	});
	
	$("#pitch-type").knob({
		'format' : function (v) {
			if ( $("#pitch-spin").val() === "0%" ) {
				v = 12;
			}
			console.log(v + " - " + app.pitch[v]);
			return app.pitch[v];
		},
		change : function (value) {
			console.log("type-change : " + value);
		},
		release : function (value) {
			console.log("type-release : " + value);
			if ( $("#pitch-spin").val() == "0%" ) {value=12;}
			//$("#pitchTypeSelect").val(value).selectmenu('refresh');
		},
		cancel : function () {
			console.log("type-cancel : ", this);
		},
		draw : function () {
		}
	});
	$("#pitch-spin").knob({
		change : function (value) {
			console.log("spin-change : " + value);
		},
		release : function (value) {
			console.log("spin-release : " + value);
		},
		cancel : function () {
			console.log("spin-cancel : ", this);
		},
		format : function (value) {
			if (value == 0) {
				$("#pitchTypeSelect").val(12).change();
			}
			return value + '%';
		},
		draw : function () {
		}
	});
	$("#pitch-speed").knob({
		change : function (value) {
			console.log("speed-change : " + value);
			var color = 'green';
			if (value>65) {color = 'orange';}
			if (value>85) {color = 'red';}
			$("#pitch-speed").trigger(
				'configure',
				{"fgColor":color}
			);
			$("#pitch-speed").css({"color":color})
		},
		release : function (value) {
			console.log("speed-release : " + value);
		},
		cancel : function () {
			console.log("speed-cancel : ", this);
		},
		format : function (value) {
			var dsp = $('#speed-display').is(":checked") ? $('#speed-display').attr('data-on-text') : $("#speed-display").attr('data-off-text');
			if (value == 39) {
				value = "--";
				$("#pitch-speed").css({"color":'black'})
			};
			var led = value;
			if (led == "--") {led = "   ";}
			if (value != 100 && value != "--"){led = " "+led;}
			app.led.setValue(led+dsp)
			return value + dsp;
		},
		draw : function () {
		}
	});
	$("#pitch-type").prop("disabled",true);
	$("#pitch-spin").prop("disabled",true);
	$("#pitch-speed").prop("disabled",true);
	
	$(".load-screen").hide();
	$("#app-container").show();
	$(':mobile-pagecontainer').pagecontainer('change', '#connect', {
		changeHash: false,
		reverse: false,
		showLoadMsg: true
	});
	console.log('spinball app ready!');
});

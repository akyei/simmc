BB = new Mongo.Collection("BBGames");
FB = new Mongo.Collection("FBGames");
if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  //Template.hello.helpers({
   // counter: function () {
    //  return Session.get('counter');
   // }
  //});

  //Template.hello.events({
    //'click button': function () {
      // increment the counter when button is clicked
      //Session.set('counter', Session.get('counter') + 1);
    //}
 // });
	Template.body.helpers({
		bbgames: function () {
			if (Session.get("qdate") == null) {
				var now = new Date().getTime();
			} else {
				var now = Session.get("qdate");
			}
			var startDate = moment(now).startOf("day").toDate();
			var endDate = moment(now).endOf("day").toDate();
			return BB.find({date: {$gte:startDate,
						   $lt:endDate}
			});
			},
		fbgames: function () {
			return FB.find({});
		},
		checkingDate: function() {
			if (Session.get("qdate") == null) {
				return "";
			} else {
				return ", you should move your car on " + Session.get("qdate").toString();
			}
		},
		noGames: function(fbList, bbList) {
			if (fbList.count() != 0 || bbList.count() != 0) {
				//console.log(bbList);
				return true; 
			} else {
				console.log("False");
				return false;
			}
		}
	});
	Template.nogame.helpers({
		checkingDate: function() {
			if (Session.get("qdate") == null) {
				return "";
			} else {
				return "There isn't a Football or Basketball Game scheduled for " + moment(Session.get("qdate")).format('LL');//'dddd MMM DD, YYYY');//Session.get("qdate").toLocaleDateString();

			}
			

		}

	});
	Template.bbgame.helpers({
		bbgames: function () {
			if (Session.get("qdate") == null) {
				var now = new Date().getTime();
			} else {
				var now = Session.get("qdate");
			}
			var startDate = moment(now).startOf("day").toDate();
			var endDate = moment(now).endOf("day").toDate();
			return BB.find({date: {$gte:startDate,
						   $lt:endDate}
			});
			},
		checkingDate: function() {
			if (Session.get("qdate") == null) {
				return "";
			} else {
				return "You should move your car on " + moment(Session.get("qdate")).format('LL');//'dddd MMM DD, YYYY');//Session.get("qdate").toLocaleDateString();

			}
		},
		
		conference: function(bblist) {
			return bblist.fetch()[0].conf_game;

		},
		confGame: function(bblist) {
			//console.log(bblist);
			var myResults = bblist.fetch();
			var currGame = myResults[0];
			console.log(myResults[0]);
			var firstChar = parseInt(currGame.tip_off.charAt(0));
			if (currGame.conf_game){
				firstChar = (firstChar-3) % 12;
				if (firstChar == 0) firstChar = 12;
				else if (firstChar < 0){
					firstChar += 12;
					return firstChar.toString() + currGame.tip_off.substr(1, currGame.tip_off.length-6) + "AM ET";
				}
				return firstChar.toString() + currGame.tip_off.substr(1); 
			} else { 
				firstChar = (firstChar-4) % 12;
				if (firstChar == 0) firstChar = 12;
				return firstChar.toString() + currGame.tip_off.substr(1); 
			}		
		},
		opponent: function() {
			
		},
		tipoff: function() {

		}
	});
	Template.bbgame.events({
		"click #reminderButton": function(event, template){
			Meteor.call("sendSMS");
		//	var client = new Twilio({
		//		from: Meteor.settings.TWILIO.FROM,
		//		sid: Meteor.settings.TWILIO.SID,
		//		token: Meteor.settings.TWILIO.TOKEN
		//	});
		//	client.sendSMS({
		//		to: '+12409380140',
		//		body: "I am testing your might!"
		//	});	
		},
	});
	Template.checkDate.events({
		'submit form': function(event){
			event.preventDefault();
			var qDate = event.target.qDate.value;
			Session.set("qdate", qDate);
			console.log(typeof qDate);
		}
	});
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

	Meteor.methods({
		sendSMS: function(){
			var twilio = new Twilio({
				from: Meteor.settings.TWILIO.FROM,
				sid: Meteor.settings.TWILIO.SID,
				token: Meteor.settings.TWILIO.TOKEN
			});
			twilio.sendSMS({
				to: '+12409380140',
				body: "I am testing your might!"
			});
		}
	});
}

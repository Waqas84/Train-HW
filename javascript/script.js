// Initialize Firebase
var config = {
    apiKey: "AIzaSyD4eWj--LcCRzEozE85VjlRi8GDaSOXbek",
    authDomain: "train-schedule-bdf3c.firebaseapp.com",
    databaseURL: "https://train-schedule-bdf3c.firebaseio.com",
    projectId: "train-schedule-bdf3c",
    storageBucket: "train-schedule-bdf3c.appspot.com",
    messagingSenderId: "694287197360"
};
firebase.initializeApp(config);
$("#add-train").on("click", function() {
    // Declare variables to store admin input
    trainName = $("#train-name").val().trim();
    trainDest = $("#train-destination").val().trim();
    firstTrainTime = moment($("#train-time").val().trim(), "HH:mm").format("HH:mm a");
    frequency = $("#frequency").val().trim();
    tickets = $("#tickets").val().trim();

    // Push train data to the firebase
    firebase.database().ref().push({
        name: trainName,
        destination: trainDest,
        arrival: firstTrainTime,
        frequency: frequency,
        tickets: tickets,
        date: firebase.database.ServerValue.TIMESTAMP
    });

    // remove all inputs
    $("#train-name").val("");
    $("#train-destination").val("");
    $("#train-time").val("");
    $("#frequency").val("");

    return false;

});

// call the childSnapshot values and store them into variables
firebase.database().ref().on("child_added", function(childSnapshot) {
    trainName = childSnapshot.val().name;
    trainDest = childSnapshot.val().destination;
    firstTrainTime = childSnapshot.val().arrival;
    frequency = childSnapshot.val().frequency;
    tickets = childSnapshot.val().tickets;
    trainKey = childSnapshot.key;

    // calculate the difference between the current time and first train time
    var timeDifference = moment().diff(moment(firstTrainTime, "HH:mm"), "minutes");
    console.log(timeDifference);

    // calculate the time left
    var timeLeft = timeDifference % frequency;

    // calculate how many mins to the next train
    var minAway = frequency - timeLeft;

    // calculate the next arrival time
    var nextArrival = moment().add(minAway, "minutes").format("HH:mm");

    var buyTicket = $("<button/>", {
      text: "Buy a Ticket",
      id: "buy-ticket",
      class: "btn btn-info",
      // click: function() {
      //   // tickets -= 1;
      //   console.log('button click, this is...', this);
      //   var row = $(this).parent().parent().parent();
      //   console.log(row.attr("data-train"))
      //   var tickets = row.find('td:nth-child(6)').html();

      //   // get the train key
      //   var currentTrainKey = row.attr("data-train");
      //   var trainObj = "train-schedule-bdf3c/" + currentTrainKey + "/tickets";
      //   var updates = {};
      //   updates[trainObj] = (tickets -= 1)
      //   var trainRef = firebase.database().ref().update(updates);
        

      // }
    });

    $("#train-info>tbody").append("<tr data-train='" + trainKey + "'><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minAway + "</td><td>" + tickets + "</td></tr>");
    $("#train-info tr:last").append('<tr><td></td></tr>').find("td:last").append(buyTicket);
    
})

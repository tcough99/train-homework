$(document).ready(function(){
   
    firebase.initializeApp(config);
    var database = firebase.database();
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#add-train").on("click", function() {
        event.preventDefault();
        
        // train info storage for firebase

     name = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#first-train").val().trim();
    frequency = $("#frequency").val().trim();

        // Pushing to db
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });

    database.ref().on("child_added", function(childSnapshot) {
        var nextArr;
        var minutesAway;

        //using moment for time
        
        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        
        var remainder = diffTime % childSnapshot.val().frequency;
        var minutesAway = childSnapshot.val().frequency - remainder;
        var nextTrain = moment().add(minutesAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#add-row").append("<tr><td>" + childSnapshot.val().name +
              "</td><td>" + childSnapshot.val().destination +
              "</td><td>" + childSnapshot.val().frequency +
              "</td><td>" + nextTrain + 
              "</td><td>" + minutesAway + "</td></tr>");

        });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
       
        // Print to page

             $("#name-display").html(snapshot.val().name);
              $("#email-display").html(snapshot.val().email);
             $("#age-display").html(snapshot.val().age);
             $("#comment-display").html(snapshot.val().comment);
    });
});
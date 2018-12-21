$.getJSON("/notes/data", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        let display = `<p data-id='${data[i]._id}'>${data[i].title}<br />${data[i].link}`;

        for (var j = 0; j < data[i].notes.length; j++) {
            display += `<br /><p class="noteDelete" data-id='${data[i].notes[j]._id}'>Note Title: ${data[i].notes[j].title}`
            display += `<br />Note body: ${data[i].notes[j].body}</p>`
        }

        display += `</p>`
        $("#articles").append(display);
    }
});


// Whenever someone clicks a p tag
$(document).on("click", ".noteDelete", function () {
    var thisId = $(this).attr("data-id");
    $(this).empty();
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "delete",
        url: "/note/" + thisId
    })
        .then(function (data) {
        });
});

$.getJSON("/notes/data", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      $("#notes").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].body + "</p>");
    }
  });
  
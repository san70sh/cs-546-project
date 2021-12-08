$(document).ready(function () {
  $(".delete").click(function () {
    $.ajax({
      url: "posts/test",
      //   success: function (result) {
      //     $(".title").html(result);
      //   },
    });
  });
});

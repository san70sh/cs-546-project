function deleteResume(id) {
  if (confirm("Are you sure you want to delete it?")) {
    delReq = {
      method: "delete",
      url: `./resume/${id}`,
    };
    $.ajax(delReq).then((res) => {
      alert(res.message);
      location.reload(true);
    });
  }
}

function deleteResume(id) {
  if (confirm("Are you sure you want to delete it?")) {
    delReq = {
      method: "delete",
      url: `profile/resume/${id}`,
    };
    $.ajax(delReq).then((res) => {
      alert(res.message);
      location.reload(true);
    });
  }
}

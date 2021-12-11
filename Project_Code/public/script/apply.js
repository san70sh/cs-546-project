function apply(fileId, jobId) {
  if (confirm("Are you sure to select this resume to apply?")) {
    applyReq = {
      method: "post",
      url: `/users/apply/${jobId}`,
      data: { fileId },
    };
    $.ajax(applyReq).then((res) => {
      console.log(res.message);
      alert(res.message.message);
    });
  }
}

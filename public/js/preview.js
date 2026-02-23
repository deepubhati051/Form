// data get from localStorage
let data = JSON.parse(localStorage.getItem("studentPreview"));

if(!data){
    document.getElementById("previewData").innerHTML = "<p>No data found</p>";
}else{

    let html = `
        <p><b>Name:</b> ${data.name}</p>
        <p><b>ISD:</b> ${data.isd}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Address:</b> ${data.address}</p>
        <p><b>Pincode:</b> ${data.pincode}</p>
        <p><b>City:</b> ${data.city}</p>
        <p><b>State:</b> ${data.state}</p>
        <p><b>Country:</b> ${data.country}</p>
        <p><b>DOB:</b> ${data.dob}</p>
        <p><b>Username:</b> ${data.username}</p>
    `;

    document.getElementById("previewData").innerHTML = html;
}

// buttons
document.getElementById("editBtn").addEventListener("click", function(){
    window.location.href = "index.html";
});

document.getElementById("confirmBtn").addEventListener("click", function(){
    window.location.href = "success.html";
});

/* eslint-disable no-undef */
$(document).ready(() => {
    $("#logOutButton").click(()=>{
        window.location.replace("/api/sessions/logout")
    });
})
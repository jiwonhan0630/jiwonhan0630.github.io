document.addEventListener("DOMContentLoaded", function() {
    
    var myHeader = document.querySelector("#headroom");
    if(myHeader) {
        var headroom = new Headroom(myHeader, {
            "offset": 0,
            "tolerance": 5,     // 민감도
            "classes": {
                "initial": "headroom",
                "notTop": "headroom--not-top",
                "pinned": "headroom--pinned",
                "unpinned": "headroom--unpinned"
            }
        });
        headroom.init();
        console.log("Headroom.js finish");
    } else {
        console.error("#headroom not found");
    }

});
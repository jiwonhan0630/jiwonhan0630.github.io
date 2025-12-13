document.addEventListener("DOMContentLoaded", function() {
    
    var myHeader = document.querySelector("#headroom");
    if(myHeader) {
        var headroom = new Headroom(myHeader, {
            "offset": 100,      // 100px 스크롤하면 반응
            "tolerance": 5,     // 민감도
            "classes": {
                "initial": "animated",
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
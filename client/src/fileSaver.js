function getFilename(dname) {
    return prompt("Please enter filename", dname);
}


$(function () {
    $("#saveJson").on("click", function () {
        console.log(generalNetworkData);
        fname = getFilename(generalNetworkData.graph.name + ".json");
        if (fname) {

            $(this).attr("href", "data:text/json;charset=utf8, " + encodeURIComponent(JSON.stringify(generalNetworkData, null, 4))).attr("download", fname);
        }
    });
});

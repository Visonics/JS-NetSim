function getFilename(dname) {
    return prompt("Please enter filename", dname);
}


$(document).ready(function () {

    updateBlockade();

    $("#saveJson").on("click", function () {
        fname = getFilename(generalNetworkData.graph.name + ".json");
        if (fname) {
            $(this).attr("href", "data:text/json;charset=utf8, " + 
              encodeURIComponent(JSON.stringify(generalNetworkData, null, 4))).attr("download", fname);
        }
    });

    $("#savePNG").on("click", function () {
        fname = getFilename(generalNetworkData.graph.name + ".png");
        if (fname) {
            //d3.select('#graph').style("background-color", '#fff');
            container = $("#graph");            
            html2canvas(container, {
                onrendered: function(canvas) {
                    canvas.toBlob(function (blob) { 
                      saveAs(blob, fname);      
                    });
                 
                },
                width: generalNetworkData.graph.width + 20,
                height: generalNetworkData.graph.height + 20
            });    
        }
    });

    // $("#savePDF").on("click", function () {
        // fname = getFilename(generalNetworkData.graph.name + ".pdf");
        // if (fname) {
            // container = $("#network");
            // var pdf = new jsPDF();            
            // p = svgElementToPdf("network", pdf, {});
            // console.log(p);
        // }
    // });
   
    $("#saveSVG").on("click", function () {
        // console.log("svg:", svg[0][0]);
        fname = getFilename(generalNetworkData.graph.name + ".svg");
        if (fname) {

            net_svg = document.getElementById("network");
            net_svg = svg[0][0];

            //get svg source.
            var serializer = new XMLSerializer();
            var source = serializer.serializeToString(net_svg);

            //add name spaces.
            if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
                source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
                source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
            }

            //add xml declaration
            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

            //convert svg source to URI data scheme.
            var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
            $(this).attr("href", url).attr("download", fname);
        }
    });

});
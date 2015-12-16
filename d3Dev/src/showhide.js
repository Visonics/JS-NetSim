
function hideDiv()
{
  if (document.getElementById) { // DOM3 = IE5, NS6
    document.getElementById('hideshow').style.visibility = 'hidden';
    document.getElementById('hideshow').style.display = 'none';
  }
  else {
    if (document.layers) { // Netscape 4
      document.hideshow.visibility = 'hidden';
      document.hideshow.display = 'none';
    }
    else { // IE 4
      document.all.hideshow.style.visibility = 'hidden';
      document.all.hideshow.style.display = 'none';
    }
  }
}

function showDiv()
{
  if (document.getElementById) { // DOM3 = IE5, NS6
    document.getElementById('hideshow').style.visibility = 'visible';
    document.getElementById('hideshow').style.display = '';
  }
  else {
    if (document.layers) { // Netscape 4
       document.hideshow.visibility = 'visible';
       document.hideshow.display = 'none';
    }
    else { // IE 4
       document.all.hideshow.style.visibility = 'visible';
       document.all.hideshow.style.display = 'none';
    }
  }
}

function showhide(id)
{
  if (document.getElementById)
  {
     obj = document.getElementById(id);
     if (obj.style.display == "none")
     {
       obj.style.display = "";
     }
     else
     {
       obj.style.display = "none";
     }
  }
}

function showhide2(id1,id2)
{
  showhide(id1);
  showhide(id2)
}

function toggle2(showHideDiv, switchImgTag) {
        var ele = document.getElementById(showHideDiv);
        var imageEle = document.getElementById(switchImgTag);
        if(ele.style.display == "block") {
                ele.style.display = "none";
		imageEle.innerHTML = '<img src="Media/Images/plusicon.jpg" border=0>';
        }
        else {
                ele.style.display = "block";
                imageEle.innerHTML = '<img src="Media/Images/minusicon.gif" border=0>';
        }
}

function toggle(showHideDiv, switchImgTag) {
        var ele = document.getElementById(showHideDiv);
        var imageEle = document.getElementById(switchImgTag);
        if(ele.style.display == "block") {
                ele.style.display = "none";
		imageEle.innerHTML = '&#9660';
        }
        else {
                ele.style.display = "block";
                imageEle.innerHTML = '&#9658';
        }
}
var lastId;

function closeMyPopup(id) {
 document.getElementById(id).style.display = "none";
}

function fireMyPopup(id) {
 document.getElementById(id).style.display = "block";
 lastId = id;
 setTimeout('closePopup()', 10000);
}

function closePopup()
{
 document.getElementById(lastId).style.display = "none";
}

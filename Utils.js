function redirectToOutputFile()
{
  var win = window.open("output.txt", '_blank');
 win.focus();
}
function generateFile()
{
  document.getElementById("generateFileAdjListButton").value=document.getElementById("AdjList").innerHTML;
  document.getElementById("generateFileJSONListButton").value=document.getElementById("JSONList").innerHTML;
}

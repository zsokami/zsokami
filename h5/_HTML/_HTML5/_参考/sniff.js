var urlStrs = "";
var length = 0;

function searchAiframe(aDocument) { 
var videoTags = aDocument.getElementsByTagName("video");
for(var i=0;i<videoTags.length;i++) {
       try {
               If(videoTags[i].src.length !=0)
            {
                 urlStrs = urlStrs + videoTags[i].src + "\n";//获取所有video
                 length++;
            } catch(err) {}
}
var iframes = aDocument.getElementsByTagName("iframe");
for(var i=0;i<iframes.length;i++) {
try {
   searchAiframe(iframes[i].contentDocument);
} catch(err) {}
}}}
searchAiframe(document);
alert(urlStrs);
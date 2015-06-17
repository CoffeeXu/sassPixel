function $(id){
    return document.getElementById(id);
}

var preCanvas = $('preview');
var viewer = $('viewer');
var ZOOMSTEP = 4;
var PIXELSIZE = 10;

viewer.addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();

    viewer.style.border='5px dashed #555';
    return false;
})

viewer.addEventListener('dragleave', function(e) {
    e.stopPropagation();
    e.preventDefault();

    viewer.style.border='4px dashed #ccc';
    return false;
});

viewer.addEventListener('drop',function(e){
    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    viewer.style.border='4px dashed #ccc';

    //获取文件数组
    var files = dt.files;
    handleFiles(files);
},false);

/*FileReader预览图片*/
function handleFiles(file){
    if (file[0].type.indexOf('image') == 0) {
      if(file[0].size < 512000){
        var reader = new FileReader();
        reader.onload = function(e){
            handleImgData(e.target.result);
        }
        reader.readAsDataURL(file[0]);
      }
    }
}

function handleImgData(dataURL){
    var cxt = preCanvas.getContext('2d');
    var img = new Image();

    img.onload = function(){
        var w = img.width, h = img.height;
        preCanvas.width = w;
        preCanvas.height = h;
        viewer.style.width = w+'px';
        viewer.style.height = h+'px';
        $('droparea-text').style.display = 'none';

        cxt.drawImage(img, 0, 0);

        var boxshadow = [];
        for(j=1; j<=h; j+=ZOOMSTEP) {
          for(i=1; i<=w; i+=ZOOMSTEP){
            var data = cxt.getImageData(i-1, j-1, i, j).data;
            if(data[3] === 0) continue;
            boxshadow.push(parseInt(i/ZOOMSTEP)*PIXELSIZE + 'px ' + parseInt(j/ZOOMSTEP)*PIXELSIZE + 'px rgba('+data[0]+','+data[1]+','+data[2]+','+data[3]+')');
          }
        }
        $('pixelimg').style.boxShadow = boxshadow;
    }
    img.src = dataURL;
}

var dropZone = document;
function getDropFileCallBack (dropFiles) {
  console.log(dropFiles, dropFiles.length);
}

dropZone.addEventListener("dragenter", function (e) {
  e.preventDefault();
  e.stopPropagation();
}, false);

dropZone.addEventListener("dragover", function (e) {
  e.dataTransfer.dropEffect = 'copy'; // 兼容某些三方应用，如圈点
  e.preventDefault();
  e.stopPropagation();
}, false);

dropZone.addEventListener("dragleave", function (e) {
  e.preventDefault();
  e.stopPropagation();
}, false);

dropZone.addEventListener("drop", function (e) {
  e.preventDefault();
  e.stopPropagation();

  var df = e.dataTransfer;
  var dropFiles = []; // 拖拽的文件，会放到这里
  var dealFileCnt = 0; // 读取文件是个异步的过程，需要记录处理了多少个文件了
  var allFileLen = df.files.length; // 所有的文件的数量，给非Chrome浏览器使用的变量

  // 检测是否已经把所有的文件都遍历过了
  function checkDropFinish () {
    if ( dealFileCnt === allFileLen-1 ) {
      getDropFileCallBack(dropFiles);
    }
    dealFileCnt++;
  }

  if(df.items !== undefined){
    // Chrome拖拽文件逻辑
    for(var i = 0; i < df.items.length; i++) {
      var item = df.items[i];
      if(item.kind === "file" && item.webkitGetAsEntry().isFile) {
        var file = item.getAsFile();
        dropFiles.push(file);
        ReadScore(file);
      }
    }
  } else {
    // 非Chrome拖拽文件逻辑
    for(var i = 0; i < allFileLen; i++) {
      var dropFile = df.files[i];
      if ( dropFile.type ) {
        dropFiles.push(dropFile);
        checkDropFinish();
      } else {
        try {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(dropFile.slice(0, 3));

          fileReader.addEventListener('load', function (e) {
            console.log(e, 'load');
            dropFiles.push(dropFile);
            checkDropFinish();
          }, false);

          fileReader.addEventListener('error', function (e) {
            console.log(e, 'error，不可以上传文件夹');
            checkDropFinish();
          }, false);

        } catch (e) {
          console.log(e, 'catch error，不可以上传文件夹');
          checkDropFinish();
        }
      }
    }
  }
}, false);

function ReadScore(file) {
	var reader = new FileReader();//new一个FileReader实例
	var ext = file.name.substring(file.name.lastIndexOf(".")); 
	if (ext=='.json') {
	    reader.onload = function() {
	    	var obj = JSON.parse(this.result);
	    	console.log(obj.image_url);
	    	document.querySelector(".score-name").innerHTML=obj.name;
	    	document.querySelector(".score-img").setAttribute('src',obj.image_url);
	    	document.querySelector(".score-meta").innerHTML = "《"+obj.anime[0]+"》 <a href=\""+obj.provider_url+"\">"
	    	+obj.provider+"</a> 发布于 " + obj.created;
	    	document.querySelector(".score-text").innerHTML = '<pre style="white-space: pre-wrap;word-wrap: break-word;">'+obj.score_text.replaceAll("#","<sup>#</sup>")+"</pre>";
			document.querySelector(".score-foot").innerHTML = '整理：<a href="'+obj.carrier_url+'">'+obj.carrier+'</a>';
	    	
	    }
	    reader.readAsText(file);
	}else{
		alert('wrong type: '+ ext);
	}
}
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
function doPrint() {   
    bdhtml=window.document.body.innerHTML;   
    sprnstr="<!--startprint-->";   
    eprnstr="<!--endprint-->";   
    prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+17);   
    prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));   
    window.document.body.innerHTML=prnhtml;  
    window.print();   
}  
var uploadZdf = (function(){
	//获取下一个兄弟结点，用于定位file节点回插入文档的位置
	function getNextSibling(n){
		var x=n.nextSibling;

		while (x !== null && x.nodeType!==1)
		{
		x=x.nextSibling;
		}
		return x;
	};
	//合并对象属性
	function extend(source,target){
		for(item in target){
			source[item] = target[item]
		}
		return source;
	};
	//预览图片
	function display(url){
		var img = document.createElement("img");
		img.src = url;
		img.onload = function(){
			var imgContainer = document.createElement("div");
			imgContainer.id = "imgContainer";
			imgContainer.style.position = "absolute";
			imgContainer.style.border = "1px solid blue";
			imgContainer.style.top = parseInt(window.outerHeight - img.height)/2 +"px";
			imgContainer.style.left = parseInt(window.outerWidth - img.width)/2 +"px";
			imgContainer.appendChild(img);
			document.body.appendChild(imgContainer);
			var btn = document.createElement("button");
			btn.style.display = "block";
			btn.style.position = "absolute";
			btn.innerText = "X";
			btn.style.top = "0px";
			btn.style.right = "0px";
			console.dir(btn);
			imgContainer.appendChild(btn);
			btn.onclick = function(){
				document.body.removeChild(imgContainer);
				imgContainer = null;
			}
		}
	}
	//文件上传函数，参数从左至右分别为: 页面中的file元素、上传提交的url、是否要预览、自定义回调函数
	return function(fileElement,url,ifdisplay,callback){
		//默认回调函数
		var defaultCallback = {
			success : function(data){alert("上传成功!  文件路径:"+data["Message"]+"; 文件大小:"+data["Size"]+"k; 文件类型:"+data["Type"]+".")},
			error : function(data){alert("上传失败! 返回信息:"+data["Message"])},
			repeat : function(data){alert(data["Message"]+"已存在! ")}
		};
		//用自定义回调函数覆盖默认回调函数
		if(!callback && typeof callback === "object"){
			defaultCallback = extend(defaultCallback,callback);
		}
		//创建form元素
		var upForm = document.createElement("form");
		//将form标签插入页面
		document.body.appendChild(upForm);
		//查找传入的file元素的下一个兄弟节点
		var nextElement = getNextSibling(fileElement);
		//查找传入的file元素的父节点
		var parentElement = fileElement.parentNode;
		//创建iframe标签
		var upIframe = document.createElement("iframe");
		//将生成的form元素的action属性指向传入的url
		upForm.action = url;
		upForm.method = "post";
		upForm.enctype = "multipart/form-data";
		upForm.style.display = "none";

		//将form元素提交到生成的iframe中，实现无刷新提交
		upForm.target = "ajaxIframe";

		upIframe.name = "ajaxIframe";
		//在iframe加载完毕时触发回调函数，获取文件上传后服务器返回的信息
		upIframe.onload = function(){
			var returnMessage = this.contentDocument.documentElement.innerText;
			if(returnMessage!==''){
				//将服务器返回的json字符串转换成json对象
				var json = eval("("+returnMessage+")");
				//根据json对象的Result属性，执行不同的回调函数
				switch(json["Result"]){
				case "Success":
					defaultCallback["success"](json);
					if(ifdisplay)display(json["Message"]);
					break;
				case "Repeat":
					defaultCallback["repeat"](json);
					break;
				case "Error":
					defaultCallback["error"](json);
					break;
				}
				//上传完毕，移除生成的标签
				document.body.removeChild(upForm);
			}
		};

		//将传入的file元素插入生成的form里，以便上传用户选择的文件
		upForm.appendChild(fileElement);
		//将iframe插入到form中
		upForm.appendChild(upIframe);
		//提交form
		upForm.submit();

		//如果file元素的下一个兄弟节点存在，把file元素回插到该节点前，否则直接回插到父节点中
		if(nextElement){
			parentElement.insertBefore(fileElement,nextElement)
		}else{
			parentElement.appendChild(fileElement);
		};

	}

})()
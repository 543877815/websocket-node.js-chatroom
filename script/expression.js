(function(){

	var imgs = [];

	for(var i = 0;i < 120 ; i++){
		imgs[i]= 'https://lifengjun.xin/note/javascript/more/img-preload/qqexpression/' + (i+1) + ".gif";
		console.log(imgs[i]);
	}

	var len = imgs.length;

	var panel = document.getElementsByClassName("panel")[0];
	document.getElementById("face-btn").addEventListener("click", 	function(e){
		e.stopPropagation();

		var	loading = panel.getElementsByClassName("loading")[0];
		panel.style.display = "block";
		if(panel.getElementsByTagName("img").length==0){
			var count = 0 ;
			var list = document.createElement("ul");
			list.className ="list";
			panel.appendChild(list);
			for(var i = 0; i < len ; i++){
				var img = document.createElement("img");
				img.src = imgs[i];
				img.name = "[emoji:" + (i+1) +"]";
				list.appendChild(img);
				img.addEventListener("load", function(){
					loading.style.display = "block";	
					count++
					if(count >= len-1){
						loading.style.display = 'none';
						list.style.display = "block";
					}
				}, false);
				/**
				 * 用户点击图片后为文本添加相应的字符                                                                               [description]
				 */
				img.addEventListener("click", function(){
					var inputarea = document.querySelector(".input-container").querySelector(".input");
					inputarea.value += this.name;
					inputarea.focus();
				}, false);
			}	
		}
		
		panel.getElementsByClassName("loading")[0].style.display = "none";	
	}, false);



	window.addEventListener("click", function(){
		panel.style.display = "none";
	}, false);
})();
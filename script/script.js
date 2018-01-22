 (function(){
    /**
     * 监视取名重置按钮的点击
     */
     document.getElementById("name-reset").onclick = function(){
      document.getElementById("name-input").value = "";
      document.getElementById("name-input").focus();
    };
    /**
     *监视名字输入框回车的点击
     */
     document.getElementById("name-input").addEventListener("keyup",function(event){
      if(event.keyCode == 13){
        document.getElementById("name-submit").click();
      }
    },false);
    /**
     * 监视取名按钮的点击
     */
     document.getElementById("name-submit").onclick = function name_submit() {
      var name = document.getElementById("name-input").value;
      if((name == "")|| (name == null)||(name == undefined)){
        alert("The name is empty!!");
      }else {
        var json = {
          message:name,
          type:"username",
        }
        ws.send(JSON.stringify(json));
        document.getElementsByClassName("output-container")[0].style.visibility = "visible";
        document.getElementsByClassName("online-usercount")[0].style.display = "inline";
        document.getElementById("cover-panel").style.display = "none";
        document.querySelector("div.input-container").querySelector(".input").focus();
      }
    }

  /**
   * 监视发送按钮的点击
   */
   document.getElementById("submit").onclick=function(){
     var message = document.getElementsByClassName("input")[0];
     if(message.value==""){
      message.focus();
      message.placeholder="输入信息不能为空！";
    }else{
      var json = {
        message:message.value,
        type:"info"
      }
      ws.send(JSON.stringify(json));  
      document.querySelector("div.input-container").querySelector(".input").value = null;
      message.placeholder="最大字符为400";
    }
  };
  /**
   * 清空输入框
   */
   document.getElementById("input-reset").addEventListener("click", function(){
    document.getElementsByClassName("output-container")[0].innerHTML="";
  }, false)

  /**
   * 点击消息提示自动滚到最下面
   */
   document.querySelector("div.info-tips").addEventListener("click",function(){
    document.querySelector("div.output-container").scrollTo(0,outputLists[outputLists.length-1].offsetTop);
  },false);

  /**
   * 监视enter为提交，ctrl + enter 为换行
   */
   document.querySelector("div.input-container").querySelector(".input").addEventListener("keydown", function(event){
    if(event.ctrlKey&&event.keyCode==13){
      document.querySelector("div.input-container").querySelector(".input").value+='\n';
    }
    else if(event.keyCode==13){
      document.querySelector("#submit").click();
      event.preventDefault();
    }
  }, false)
  /**
   * 监视滚动事件和新消息提示
   */
   var outputLists = document.querySelectorAll("div.output");
   var info_count = 0;
   function newInfo (){
    var output_container_scrollHeight = document.querySelector("div.output-container").scrollTop;
    var output_container_height = document.querySelector("div.output-container").clientHeight;
    for(var i = 0; i<outputLists.length; i++){
      if(outputLists[i].offsetTop>=output_container_height+output_container_scrollHeight){
        if(outputLists[i].readBefore == undefined)  {
          outputLists[i].readBefore = false;
          info_count++;
          document.querySelector("div.info-tips").style.display = "block";
        } 
      }else{
        if(outputLists[i].readBefore == false){
          info_count--;
          outputLists[i].readBefore = true;
        }else if (outputLists[i].readBefore== undefined) {
          outputLists[i].readBefore = true;
        }
      }
    }
    if(info_count != 0){
      document.querySelector("span.info-number").innerText = info_count;
    }else{
      document.querySelector("div.info-tips").style.display = 'none';
    }
  }
  document.querySelector("div.output-container").addEventListener("scroll", newInfo, false);
  /**
   * 页面加载时也触发滚动时间
   */
   window.onload = function(){
    newInfo ();
  }




/**
 * wss部分
 */
 var yourname = null;
 var ws = new WebSocket("wss://lifengjun.xin:8181");
 ws.onopen = function (e) {
  document.getElementsByClassName("status-present")[0].innerHTML="Connection to server opened";
};
ws.onmessage = function(evt) {  
  var data = evt.data;
  var message = JSON.parse(data);
  switch (message.type) {
    case "usercount":
    document.getElementsByClassName("usercount")[0].innerHTML = message.message;
    document.getElementsByClassName("online-usercount")[0].innerHTML = "("+message.message+")";
    break;
    case "info":
    var output_container = document.getElementsByClassName("output-container")[0];
    var output = document.createElement("div");
    output.className = "output";
    output_container.appendChild(output);
    var h3 = document.createElement("h3");
    output.appendChild(h3);
    h3.appendChild(document.createTextNode(message.username));
    var Timespan = document.createElement("span");
    var Wordspan = document.createElement("span");
    var time = new Date();
    Timespan.appendChild(document.createTextNode("("+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds()+"):"));
    output = message.message.replace(/\[emoji:(\d+)\]/g, '<img src="https://lifengjun.xin/note/javascript/more/img-preload/qqexpression/$1.gif" class="qqexpression">');
    output = output.replace(/[\r\n]/g,"<br />");
    Wordspan.innerHTML = output;
    h3.appendChild(Timespan);
    h3.appendChild(Wordspan);
    outputLists = document.querySelectorAll("div.output");
    if(message.username != yourname){
     newInfo ();
   }else{
    output_container.scrollTo(0,outputLists[outputLists.length-1].offsetTop);
  }
  break;
  case "online-usercount":
  document.getElementsByClassName("online-usercount")[0].innerHTML = "("+message.message+")";
  break;
  case "user-enter":
  var div = document.createElement("div");
  div.className = "adv";
  var output_container = document.getElementsByClassName("output-container")[0];
  output_container.appendChild(div);
  var span = document.createElement("span");
  span.appendChild(document.createTextNode(message.username+"加入了聊天室"));
  div.appendChild(span);
  break;
  case "user-leave":
  var div = document.createElement("div");
  div.className = "adv";
  var output_container = document.getElementsByClassName("output-container")[0];
  output_container.appendChild(div);
  var span = document.createElement("span");
  span.appendChild(document.createTextNode(message.username+"离开了聊天室"));
  div.appendChild(span);
  break;
  case "repeat-alert":
  document.getElementById("cover-panel").style.display = "block";
  document.getElementById("name-repeat").style.display = 'block';
  document.querySelector("#name-input").focus();
  break;
  case "yourname":
  yourname = message.username;
  document.getElementsByClassName("yourname")[0].innerHTML = "-" + message.username;
  break;

}
};  
ws.onerror = function(evt){
  alert("Websocket异常!");
}

})();     
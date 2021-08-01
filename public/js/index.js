window.onload = function(){
    var random = Math.PI.toString().substr(0, Math.round(Math.random() * 10 + 3));
    var name = prompt('edit your name:') || random;
    name = name.substr(0, 10);
    var socket = io();

    socket.emit('join', name);

    document.title = name + ` 's chat`;

    //加入群聊
    socket.on('join', function(name){
        var joinInfo = `<div class="single_msg"><span class="user_name">${name}</span> joined the chat</div>`;
        addMessage(joinInfo);
    });

    var inp = document.querySelector('.value');
    inp.addEventListener('keyup', function(e){
        if (e.keyCode == 13) {
            sendMsg(e.target);
        };
    }, false);
    document.querySelector('.btn').addEventListener('click', function(){
        sendMsg(inp);
    }, false);

    //接收消息
    socket.on('message', function(obj){
        var isCurrentUser = (name == obj.name ? 'current_user' : '');
        var speak =`<div class="every_message ${isCurrentUser}"><span class="each_name">${obj.name}</span> <span class="each_words">${obj.msg}</span></div>`;
        addMessage(speak);
    });

    function sendMsg(tar){
        if (tar.value == '') {return};
        var obj = {
            msg: tar.value,
            name: name
        };
        socket.emit('message', obj);
        tar.value = '';
    }

    function addMessage(msg){
        let li = document.createElement('li');
        li.innerHTML = msg;
        document.querySelector('.messages').appendChild(li);
        li.scrollIntoView({behavior: 'smooth'});
    };
}
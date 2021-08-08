;(function() {
    window.onload = async function(){
        var name = utils.getStorage('data');

        var isLogin = false;
        if(name && name.userName && name.userKey) {
            console.log('name', name);
            try {
                isLogin = await loginAuth(name);
            } catch (error) {
                isLogin = false;
            }
        }else{
            name = prompt('edit your name:');
        };
        if(name && !isLogin) {
            var data = {
                'userName': name,
                'userKey': utils.randomKey()
            };
            login(data);
            utils.setStorage('data', data);
        }
        var socket = io();
    
        socket.emit('join', name);
    
        document.title = name.userName + ` 's chat`;
    
        //加入群聊
        socket.on('join', function(name){
            console.log('name-----------', name);
            var joinInfo = `
                <div class="single_msg">
                    <span class="user_name">${name.userName}</span>
                     joined the chat
                </div>`;
            addMessage(joinInfo);
        });
        
        // 发送消息
        var inp = document.querySelector('.value');
        inp.addEventListener('keyup', function(e){
            if (e.keyCode == 13) {
                sendMsg(e.target);
            };
        }, false);

        document.querySelector('.btn').addEventListener('click', function(){
            sendMsg(inp);
        }, false);
    
        // 接收消息
        socket.on('message', function(obj){
            var isCurrentUser = (name == obj.name ? 'current_user' : '');
            var speak =`
                <div class="every_message ${isCurrentUser}">
                    <span class="each_name">${obj.name}</span> 
                    <span class="each_words">${obj.msg}</span>
                </div>`;
            addMessage(speak);
        });

        // 是否存在
        async function loginAuth(params) {
            return utils.postData('/chat/isLogin', null, params);
        };

        // login
        function login(params) {
            utils.postData('/chat/login', null, params).then(res => {
                console.log('res', res);
            }).catch(err => {
                console.log('err', err);
            })
        };
        
        // 发送消息函数
        function sendMsg(tar){
            if (tar.value == '') {return};
            var obj = {
                msg: tar.value,
                name: name
            };
            socket.emit('message', obj);
            tar.value = '';
        };

        // 添加消息函数
        function addMessage(msg){
            let li = document.createElement('li');
            li.innerHTML = msg;
            document.querySelector('.messages').appendChild(li);
            li.scrollIntoView({behavior: 'smooth'});
        };
    };
})(window);
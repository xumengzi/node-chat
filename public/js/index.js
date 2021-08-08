;(function() {
    window.onload = async function(){
        var socket = io();
        
        var userObj = utils.getStorage('data');

        socket.emit('join', userObj);
    
        document.title = userObj.userName + ` 's chat`;
        
        // 展示历史消息
        renderMessage(userObj);

        //加入群聊
        socket.on('join', function(name){
            if(judgeID(name)) {
                return;
            };
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
            var isCurrentUser = (judgeID(obj) ? 'current_user' : '');
            var speak =`
                <div class="every_message ${isCurrentUser}">
                    <span class="each_name">${obj.userName}</span> 
                    <span class="each_words">${obj.message}</span>
                </div>`;
            addMessage(speak, obj);
        });
        
        // 发送消息函数
        function sendMsg(tar){
            if (tar.value == '') {return};
            var obj = {
                message: tar.value,
                userName: userObj.userName,
            };
            socket.emit('message', obj);
            tar.value = '';
        };

        function judgeID(target) {
            return userObj.userName === target.userName;
        };

        // 获取消息记录，渲染出来
        function renderMessage(params) {
            utils.postData('/chat/getMessage', null, params).then(res => {
                const { success, data } = res;
                if(success && data && data.length) {
                    cal(data);
                }
            }).catch(err => {
                console.log('err', err);
            });
        };

        // 生产消息记录
        function cal(data) {
            var divs = '';
            data.forEach(item => {
                const { message, userName } = item;
                var isCurrentUser = (judgeID({userName}) ? 'current_user' : '');
                divs += `
                    <li>
                        <div class="every_message ${isCurrentUser}">
                            <span class="each_name">${userName}</span> 
                            <span class="each_words">${message}</span>
                        </div>
                    </li>
                `;
                document.querySelector('.messages').innerHTML = divs;
            });
        };

        function saveMessage(params) {
            utils.postData('/chat/setMessage', null, params).then(res => {
                const { success, data } = res;
                if(success && data && data.length) {
                    console.log('save success');
                };
            }).catch(err => {
                console.log('err', err);
            });
        };

        // 添加消息函数
        function addMessage(msg, obj){
            let li = document.createElement('li');
            li.innerHTML = msg;
            document.querySelector('.messages').appendChild(li);
            li.scrollIntoView({behavior: 'smooth'});

            if(obj && obj.message) {
                var messageObj = {
                    ...userObj,
                    userMessage: {
                        timeStep: +new Date(),
                        userName: userObj.userName,
                        message: obj.message
                    },
                };
                saveMessage(messageObj);
            };
        };
    };
})(window);
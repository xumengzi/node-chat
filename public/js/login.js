;(function() {
    window.onload = async function(){
        var name = utils.getStorage('data');

        var isLogin = false;
        if(name && name.userName && name.userKey) {
            console.log('name', name);
            try {
                isLogin = await loginAuth(name);
                const { success, code, userName } = isLogin;
                if(success ) {
                    if(code === 200) {
                        location.href = '/chat';
                    }else if(code === 201) {
                        setName(userName);
                    }
                }
            } catch (error) {
                isLogin = false;
            }
        }else{
            name = prompt('edit your name:');
        };
        if(name && !isLogin) {
            setName(name, login);
        }    
        
        // 是否存在
        async function loginAuth(params) {
            return utils.postData('/chat/isLogin', null, params);
        };

        function setName(name, cb) {
            var data = {
                'userName': name,
                'userKey': utils.randomKey()
            };
            console.log('--data--', data);
            cb && cb(data);
            utils.setStorage('data', data);
        }

        // login
        function login(params) {
            utils.postData('/chat/login', null, params).then(res => {
                console.log('res', res);
                location.href = '/chat';
            }).catch(err => {
                console.log('err', err);
            })
        };
        
    };
})(window);
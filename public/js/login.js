;(function() {
    window.onload = async function(){
        var name = utils.getStorage('data');

        var isLogin = false;
        if(name && name.userName && name.userKey) {
            console.log('name', name);
            try {
                isLogin = await loginAuth(name);
                const { success, code } = isLogin;
                if(success && code === 200) {
                    location.href = '/chat';
                }
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
        
    };
})(window);
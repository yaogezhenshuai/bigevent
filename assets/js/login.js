$(function () {
    let $login = $('.login .link');
    $login.on('click', function () {
        $('.register').show();
        $('.login').hide();
    })

    let $register = $('.register .link');
    $register.on('click', function () {
        $('.register').hide();
        $('.login').show();
    })



    //表单校验
    let form = layui.form;
    form.verify({
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        // 校验密码框
        pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验确认密码框
        repass: function (value, item) {
            //value：表单的值、item：表单的DOM对象
            let pwd = $('.register input[name=password]').val().trim();
            if (value !== pwd) {
                return '两次密码不一致';
            }
        }
    });

    let layer = layui.layer;
    // 获取注册表单数据并发送请求
    $('.register form').on('submit', function (e) {
        e.preventDefault();
        // 根据表单各项的name属性获取值，表单里必须带有name属性
        let data = $(this).serialize();
        // console.log(data);
        $.ajax({
            url: 'http://ajax.frontend.itheima.net/api/reguser',
            type: 'POST',
            data,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('注册失败,' + res.message);
                }
                layer.msg('注册成功');

                $register.click();
            }
        })
    })

    // 获取注册表单数据并发送请求
    $('.login form').on('submit', function (e) {
        e.preventDefault();
        let data = $(this).serialize();

        $.ajax({
            url: 'http://ajax.frontend.itheima.net/api/login',
            type: 'POST',
            data,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功')

                // 将token字符串储存在本地浏览器
                localStorage.setItem('token', res.token);

                // 跳转页面
                location.href = 'index.html';
            }
        })
    })





})
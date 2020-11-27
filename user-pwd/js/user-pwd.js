$(function () {
    let form = layui.form;
    form.verify({
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        diff: function (value) {
            let oldPwd = $('#oldPwd').val();
            if (value === oldPwd) {
                return '新密码不能与原密码相同'
            }
        },
        same: function (value) {
            let newPwd = $('#newPwd').val();
            if (value !== newPwd) {
                return '两次密码不一致'
            }
        }
    });

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        let data = $('.layui-form').serialize()
        $.ajax({
            type: 'POST',
            url: 'http://ajax.frontend.itheima.net/my/updatepwd',
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            data,
            success: function (res) {
                // console.log(res);
                if (res.status === 0) {
                    // 若成功，清空表单信息
                    $('#reSet').click();
                }
            }
        })
    })
})

$(function () {
    // 退出功能退到登录界面
    // 实现思路：
    // 有弹框提醒
    // - 删除token
    // - 跳转页面到 /login.html
    let layer = layui.layer;
    $('#logout').on('click', function () {
        layer.confirm('确定退出登录吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            localStorage.removeItem('token');
            location.href = 'login.html';
            layer.close(index);

        });
    })
    getUserInfo();
});
function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: 'http://ajax.frontend.itheima.net/my/userinfo',
        headers: {
            Authorization: localStorage.getItem('token')
        },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！')
            }
            // 渲染页面
            // 1. 欢迎你 用户名（优先使用nickname、没有的话，使用username）
            let name = res.data.nickname || res.data.username;
            $('.welcome').html('欢迎&nbsp;&nbsp;' + name);
            // 2. 头像（优先使用图片、没有图片使用name）
            if (res.data.user_pic) {
                $('.layui-nav-img').attr('src', res.data.user_pic).show();
                $('.text-avater').hide();
            } else {
                let w = name[0].toUpperCase();
                $('.layui-nav-img').hide();
                $('.text-avatar').text(w);

            }
        },
        complete: function (xhr) {
            // console.log(xhr);
            if (xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {
                localStorage.removeItem('token');
                location.href = 'login.html';
            }
        }

    })
}


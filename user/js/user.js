$(function () {
    let form = layui.form;
    function getInfo() {

        $.ajax({
            type: 'GET',
            url: 'http://ajax.frontend.itheima.net/my/userinfo',
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            success: function (res) {
                // console.log(res);
                // 设置表单的四项值（id/username/nickname/email）
                // $('input[name="id"]').val(res.data.id);
                // $('input[name="nickname"]').val(res.data.nickname);
                // $('input[name="username"]').val(res.data.username);
                // $('input[name="email"]').val(res.data.email);

                form.val('user', res.data);
            }
        })
    }
    getInfo();
    // 重置表单
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        getInfo();
    })
    // 提交表单
    let layer = layui.layer;
    $('form').on('submit', function (e) {
        e.preventDefault();
        let data = $('form').serialize();
        $.ajax({
            type: 'POST',
            url: 'http://ajax.frontend.itheima.net/my/userinfo',
            data,
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            success: function (res) {
                console.log(res);
                if (res.status === 0) {
                    //修改成功给出提示，重新渲染index.html页面
                    layer.msg(res.message);
                    window.parent.getUserInfo();
                }
            }
        })
    })

    //重置表单

})
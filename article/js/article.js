$(function () {
    let layer = layui.layer;
    let form = layui.form;
    function getList() {

        $.ajax({
            url: "http://ajax.frontend.itheima.net/my/article/cates",
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            success: function (res) {
                // console.log(res);
                let htmlStr = template('info', res);
                // console.log(htmlStr);
                $('tbody').html(htmlStr);
            }
        })
    }
    getList();

    let index;
    $('#addBtn').on('click', function () {

        index = layer.open({
            // 层类型
            type: 1,//页面层
            // 定义宽度
            area: '500px',
            // 标题
            title: '添加文章分类',
            content: $('#add').html()
        });
    })

    $('body').on('submit', '#form', function (e) {
        e.preventDefault();
        let data = $('#form').serialize();
        $.ajax({
            url: 'http://ajax.frontend.itheima.net/my/article/addcates',
            type: 'POST',
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            data,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败')
                }
                layer.msg(res.message);

                // 弹出层关闭
                layer.close(index);

                getList();

            }
        })
    })
    let editIndex;
    $('tbody').on('click', '#editBtn', function () {
        // 获取当前编辑按钮的存储的data-id自定义属性的值
        let id = $(this).attr('data-id');
        // console.log(id);
        editIndex = layer.open({
            type: 1,//页面层
            // 定义宽度
            area: '500px',
            // 标题
            title: '修改文章分类',
            content: $('#edit').html()
        })
        // 发送请求，获取到form里面的数据
        $.ajax({
            url: 'http://ajax.frontend.itheima.net/my/article/cates/' + id,
            headers: {
                Authorization: localStorage.getItem('token')
            },
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('editForm', res.data);
            }
        })
    })

    // 编辑的form表单的确认修改功能
    $('body').on('submit', '#editForm', function (e) {
        e.preventDefault();
        let data = $('#editForm').serialize();
        $.ajax({
            type: 'POST',
            url: 'http://ajax.frontend.itheima.net/my/article/updatecate',
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            data,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(message);
                }
                layer.close(editIndex);

                getList();
            }
        })
    })

    // 删除列表
    $('tbody').on('click', '#del', function () {
        let index;
        let id = $(this).attr('data-id');
        $.ajax({
            url: 'http://ajax.frontend.itheima.net/my/article/deletecate/' + id,
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
                    //do something

                    layer.close(index);
                    getList();

                });
            }
        })
    })

})
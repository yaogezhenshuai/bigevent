$(function () {
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;


    let query = {
        pagenum: 1,//页码值,默认加载第一页
        pagesize: 2,//每页显示多少条数据
        cate_id: "",//文章分类 Id
        state: "",//文章的状态,可选值有:已发布 草稿
    }
    function getList() {

        $.ajax({
            url: 'http://ajax.frontend.itheima.net/my/article/list',
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            data: query,
            success: function (res) {
                let htmlStr = template('list', res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                $('tbody').html(htmlStr);

                // 渲染分页功能
                renderPage(res.total);
            }
        })
    }
    getList();

    //定义分页渲染函数
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: query.pagesize,
            limits: [1, 2, 3, 5, 10],
            curr: query.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                // jump触发执行的时机
                // 1.分页初始渲染会触发执行一次，此时first参数为true
                // 2.点击分页的时候，jump也会触发执行，此时first参数为undefined

                // 步骤：
                // 点击分页，需要修改query对象的pagenum的值，修改为obj.curr
                // 重新发送ajax请求

                query.pagenum = obj.curr;
                query.pagesize = obj.limit;
                // 坑：如果以下代码直接这样写，会让ajax不停的发
                // getList();
                // 解决方案：初始渲染分页效果的时候，jump函数会执行，但是不要执行getList函数

                if (!first) {
                    // 点击的时候会让if成立
                    // console.log('点击了');
                    getList();
                }
            }
        });

    }

    // 补零函数
    const paddZero = (n) => (n < 10 ? "0" + n : n);

    // 往模板中导入过滤器函数
    template.defaults.imports.formatTime = function (time) {
        //time ==> 需要处理的数据
        //return 处理好的数据

        let d = new Date(time);
        let y = d.getFullYear();
        let m = paddZero(d.getMonth() + 1);
        let day = paddZero(d.getDate());
        let h = paddZero(d.getHours());
        let min = paddZero(d.getMinutes());
        let s = paddZero(d.getSeconds());

        return `${y}-${m}-${day} ${h}:${min}:${s}`;
    };

    // 获取分类类别的数据
    $.ajax({
        url: 'http://ajax.frontend.itheima.net/my/article/cates',
        headers: {
            Authorization: localStorage.getItem('token'),
        },
        success: function (res) {
            // 使用ES6的反引号把数据渲染到下拉框中
            let htmlStr = '';
            let data = res.data;

            data.forEach((item) => {
                htmlStr += `<option value="${item.Id}">${item.name}</option>`;
            });

            // 将创建的option添加到下拉框中
            $("[name=cate_id]").append(htmlStr);
            form.render();
        }
    })


    // 处理筛选功能
    // 思路:
    // 1.点击筛选按钮会触发form的submit事件
    // 2.需要修改query对象的文章分类的id和文章的state状态
    // 3.发送ajax请求获取到对应到的数据

    $('#Sform').on('submit', function (e) {
        e.preventDefault();
        query.cate_id = $('[name=cate_id]').val();
        query.state = $('[name=state]').val();

        getList();
    })

    // 删除功能：
    $('tbody').on('click', '#del', function () {
        let id = $(this).attr('data-id');

        // 以下代码解决删除功能的bug
        // 需要做个判断，判断tbody中的删除按钮个数是否为1，如果为1，那就请求成功，该页面就没有了数据，需要将pagenum - 1(展示上一页数据)
        // 注意：pagenum最小值为1

        if ($('#del').length === 1) {
            // 如果为1，意味着请求发送成功，该页面中就没有了数据，需要将pagenum - 1(展示上一页的内容)
            if (query.pagenum === 1) {
                query.pagenum = 1;
            } else {
                query.pagenum = query.pagenum - 1;
            }
        }
        $.ajax({
            url: 'http://ajax.frontend.itheima.net/my/article/delete/' + id,
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                getList();
            }

        })
    })

    // 编辑功能

})

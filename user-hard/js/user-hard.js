$(function () {

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')

    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#upLoad').on('click', function () {
        $('#file').click();
    })

    // 监听文件域的选择文件的变化
    $('#file').on('change', function () {
        // console.log('haha');
        // 当选择的文件改变，该事件就会触发

        // files属性是文件域的DOM对象的属性
        let file = this.files[0];
        // 把选择的文件得到它对应的地址
        let newImgURL = URL.createObjectURL(file);
        // console.log(newImgURL)

        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 更换头像

    $('#sure').on('click', function () {
        let layer = layui.layer;

        // 剪裁得到一张图片（canvas图片）
        let i = $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        });
        // 把图片转成base64格式
        let str = i.toDataURL(); // 把canvas图片转成base64格式
        // console.log(str); // base64格式的字符串
        $.ajax({
            type: 'POST',
            url: 'http://ajax.frontend.itheima.net/my/update/avatar',
            headers: {
                Authorization: localStorage.getItem('token'),
            },
            data: {
                avatar: str,
            },
            success: function (res) {
                // console.log(res);
                if (res.status === 0) {
                    layer.msg(res.message);
                    window.parent.getUserInfo();
                }
            }
        })
    })
})
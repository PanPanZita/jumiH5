define(["vue", "weixin"], function(vue, weixin) {
    new vue({
        el: "body",
        components: {
            "summer-act": {
                template: "#summerActTemplate",
                data: function() {
                    return {
                        shareTitle:
                            "夏日清凉派对，酷爽来袭。参与众筹即有好礼！",
                        shareContent:
                            "夏季活动火热进行中，家电及京东E卡等多重惊喜来袭，让你清凉一夏！",
                        sharePic:
                            "https://jumifinancetest.oss-cn-hangzhou.aliyuncs.com/jumifinancetest/uploadFile/images/activity/20180607001761821160.jpg",
                        shareUrl:
                            location.origin +
                            "/h5/views/activity/summerActivity.html"
                    };
                },
                methods: {
                    preventDefaultz: function(e) {
                        e.preventDefault();
                        return false;
                    },
                    goZz: function() {
                        location.href =
                            location.origin +
                            "/h5/views/main/list.html?type=0&status=0&itemName=";
                    }
                }
            } //summer-act的结束
        }, //components的结束
        ready: function() {
            $("#myloading").remove();
            var that = this;
            if (localStorage.fromapp == "ios") {
                var o = {
                    title: that.$children[0].shareTitle,
                    desc: that.$children[0].shareContent,
                    img: that.$children[0].sharePic,
                    url: that.$children[0].shareUrl
                };
                window.webkit.messageHandlers.share.postMessage(o);
            } else if (localStorage.fromapp == "android") {
                var o = {
                    title: that.$children[0].shareTitle,
                    desc: that.$children[0].shareContent,
                    img: that.$children[0].sharePic,
                    url: that.$children[0].shareUrl
                };
                window.Android.callAndroidAction("0", JSON.stringify(o));
            }
            weixin
                .setTitle(that.$children[0].shareTitle)
                .setDesc(that.$children[0].shareContent)
                .setImg(that.$children[0].sharePic)
                .setUrl(that.$children[0].shareUrl)
                .share();
        }
    }); //new Vue的结束
});

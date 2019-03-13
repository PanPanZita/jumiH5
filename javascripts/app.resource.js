requirejs.config({
  baseUrl: "/h5/javascripts",
  urlArgs: "v=4.6.0",
  waitSeconds: 0,
  paths: {
    jquery: "jquery/jquery-1.8.3.min",
    vue: "vue/vue.min",
    vueResource: "vue/vue-resource.min",
    vueTouch: "vue/vue-touch", //扩展了hammerjs的vue专用touch
    Swiper: "swiper/swiper-4.3.3.min",
    swiperanimate: "swiper/swiper.animate1.0.3.min",
    F2: "f2/f2.min", //f2
    qrcode: "qrcode/jquery.qrcode.min", //qrcode
    hammerjs: "vue/hammer.min", //touch手势
    touch: "touch", //touch手势

    regexp: "app/regexp", //表单验证
    isLogin: "app/isLogin", //判断是否登录
    isLoginwx: "app/isLoginwx", //微信登陆
    screenControl: "app/screenControl", //防止横屏操作
    autoHeight: "app/autoHeight", //自适应高度
    getPara: "app/getPara", //获取URL传递的参数
    JURL: "app/JURL",
    asyncload: "app/asyncload", //异步加载图片
    bigwheel: "app/bigwheel", //大转盘
    city: "app/city",
    dpreview: "app/dpreview", //自适应屏幕
    formsubmit: "app/formsubmit",
    jumi: "app/jumi",
    limit: "app/limit",
    nav: "app/nav",
    numberboard: "app/numberboard",
    onoff: "app/onoff",
    scrolltotop: "app/scrolltotop",
    slidefocus: "app/slidefocus",
    tab: "app/tab",
    weixin: "app/weixin",
    appSpread: "app/appspread", //app推广
    load: "app/load", //加载更多（上滑，下滑，左滑，右滑，...）

    md5: "app/md5",
    DateFormat: "app/DateFormat", //时间插件
    Ddate: "app/Ddate", //日期插件
    wxBackbtn: "app/wxBackbtn", //监听微信浏览器中总的返回键

    dialog: "dialog/dialog.min",

    echarts: "chart/echarts.common.min",

    selectlinkage: "selectlinkage/selectlinkage",
    validate: "validate/validate",
    validate_metadata: "validate/metadata",
    validate_methods: "validate/methods",
    validate_messages: "validate/messages",
    validate_singlealert: "validate/singlealert",

    wx: "https://res.wx.qq.com/open/js/jweixin-1.0.0",
    newWxApi: "https://res.wx.qq.com/open/js/jweixin-1.2.0",

    api: "https://captcha.luosimao.com/static/dist/captcha", ////captcha.luosimao.com/static/dist/api

    prism: "//g.alicdn.com/de/prismplayer/1.5.4/prism-h5-min", ////视频插件

    jcrop: "/h5/javascripts/jcrop/jquery.Jcrop.min",
    fileAPI: "/h5/javascripts/fileapi/FileAPI.min",

    account: "views/account", //我的（个人中心）
    activity: "views/activity",
    seventhMoon: "views/activity/seventhMoon",
    auction: "views/auction",
    bbs: "views/bbs",
    common: "views/common", //公共页面

    outline: "views/outline",
    play: "views/play",
    recruit: "views/recruit",
    seckill: "views/seckill",

    training: "views/training", //新手训练营

    payment: "views/payment", //付款（包括项目订单和商城订单）

    main: "views/main", //首页（项目）
    notice: "views/notice", //首页-公告
    invest: "views/invest", //首页-项目
    investDetail: "views/investDetail", //首页-详情预览--后台新加使用

    discover: "views/discover", //发现
    topic: "views/topic", //发现-专题
    wheel: "views/wheel", //发现-天天转盘
    exchange: "views/exchange", //发现-兑换活动
    lottery: "views/lottery", //发现-抽奖活动
    transfer: "views/transfer" //发现-捡漏（转让）
  },
  map: {
    "*": {
      regexp: "dist/app/regexp", //表单验证
      isLogin: "dist/app/isLogin", //判断是否登录
      isLoginwx: "dist/app/isLoginwx", //微信登陆
      screenControl: "dist/app/screenControl", //防止横屏操作
      autoHeight: "dist/app/autoHeight", //自适应高度
      getPara: "dist/app/getPara", //获取URL传递的参数
      asyncload: "dist/app/asyncload", //异步加载图片
      bigwheel: "dist/app/bigwheel", //大转盘
      city: "dist/app/city",
      dpreview: "dist/app/dpreview", //自适应屏幕
      formsubmit: "dist/app/formsubmit",
      jumi: "dist/app/jumi",
      limit: "dist/app/limit",
      nav: "dist/app/nav",
      onoff: "dist/app/onoff",
      scrolltotop: "dist/app/scrolltotop",
      slidefocus: "dist/app/slidefocus",
      tab: "dist/app/tab",
      weixin: "dist/app/weixin",
      appSpread: "dist/app/appspread", //app推广
      load: "dist/app/load", //加载更多（上滑，下滑，左滑，右滑，...）

      md5: "dist/app/md5",
      DateFormat: "dist/app/DateFormat", //时间插件
      Ddate: "dist/app/Ddate", //日期插件
      wxBackbtn: "dist/app/wxBackbtn", //监听微信浏览器中总的返回键

      account: "dist/views/account", //我的（个人中心）
      activity: "dist/views/activity",
      auction: "dist/views/auction",
      bbs: "dist/views/bbs",
      common: "dist/views/common", //公共页面

      outline: "dist/views/outline",
      play: "dist/views/play",
      recruit: "dist/views/recruit",
      seckill: "dist/views/seckill",

      training: "dist/views/training", //新手训练营

      payment: "dist/views/payment", //付款（包括项目订单和商城订单）

      main: "dist/views/main", //首页（项目）
      notice: "dist/views/notice", //首页-公告
      invest: "dist/views/invest", //首页-项目
      investDetail: "dist/views/investDetail", //首页-详情预览--后台新加使用

      discover: "dist/views/discover", //发现
      topic: "dist/views/topic", //发现-专题
      wheel: "dist/views/wheel", //发现-天天转盘
      exchange: "dist/views/exchange", //发现-兑换活动
      lottery: "dist/views/lottery", //发现-抽奖活动
      transfer: "dist/views/transfer" //发现-捡漏（转让）
    }
  },
  shim: {
    jumi: ["jquery", "dialog"],
    asyncload: ["jquery"],
    bigwheel: ["jquery", "jumi"],
    city: ["jquery"],
    dpreview: ["jquery"],
    formsubmit: ["jquery"],
    jumi: ["jquery"],
    limit: ["jquery"],
    loadData: ["jquery", "asyncload"],
    nav: ["jquery"],
    onoff: ["jquery"],
    scrolltotop: ["jquery"],
    slidefocus: ["jquery"],
    tab: ["jquery"],
    weixin: ["jquery", "wx"],

    wx: ["jquery"],

    vueTouch: ["hammerjs"],
    Ddate: ["jquery"],

    // 生成二维码
    qrcode: ["jquery"],

    //对话框
    dialog: {
      deps: ["jquery"],
      exports: "dialog",
      init: function() {}
    },

    //表单验证
    validate: {
      deps: ["jquery"],
      exports: "validate"
    },
    validate_metadata: {
      desp: ["jquery"],
      exports: "validate_metadata"
    },
    validate_messages: {
      deps: ["jquery", "validate"],
      exports: "validate_messages",
      init: function() {}
    },
    validate_methods: {
      deps: ["jquery", "validate"],
      exports: "validate_methods",
      init: function() {}
    },
    validate_singlealert: {
      deps: ["jquery", "jumi", "validate"],
      exports: "validate_singlealert",
      init: function() {}
    }
  }
});

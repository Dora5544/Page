/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * 导航栏构造函数
 * @returns {undefined}
 */
var Nav = function () {

    /**
     * 
     * @returns {undefined}
     */
    function logout() {
        //清除用户名
        window.localStorage.removeItem("renju-game-user");
        //转至主页
        window.location.href = "index.html";
    }
    ;

    /**
     * 初始化导航栏
     * @param {type} user
     * @returns {undefined}
     */
    function initNav(user) {
        //get body
        var body = document.body;
        //create nav
        //最外层
        var navbar = document.createElement("nav");
        navbar.setAttribute("class", "navbar navbar-default");
        //布局
        var container = document.createElement("div");
        container.setAttribute("class", "container-fluid");

        //导航头
        var nav_head = document.createElement("div");
        nav_head.setAttribute("class", "navbar-header");
        //响应式移动设备
        var head_button = document.createElement("button");
        head_button.setAttribute("type", "button");
        head_button.setAttribute("class", "navbar-toggle");
        head_button.setAttribute("data-toggle", "collapse");
        head_button.setAttribute("data-target", "#navbar-collapse");
        var head_span = document.createElement("span");
        head_span.setAttribute("class", "sr-only");
        head_span.innerHTML = "切换导航";
        var head_span_2 = document.createElement("span");
        head_span_2.setAttribute("class", "icon-bar");
        var head_span_3 = document.createElement("span");
        head_span_3.setAttribute("class", "icon-bar");
        var head_span_4 = document.createElement("span");
        head_span_4.setAttribute("class", "icon-bar");
        head_button.appendChild(head_span);
        head_button.appendChild(head_span_2);
        head_button.appendChild(head_span_3);
        head_button.appendChild(head_span_4);

        //主页文字
        var logo = document.createElement("a");
        logo.setAttribute("class", "navbar-brand");
        logo.setAttribute("href", "index.html");
        logo.innerHTML = "RenjuAI";
        //添加头
        nav_head.appendChild(head_button);
        nav_head.appendChild(logo);
        //菜单栏
        var nav_column = document.createElement("div");
        nav_column.setAttribute("class", "collapse navbar-collapse");
        nav_column.setAttribute("id", "navbar-collapse");
        //栏布局
        var nav_ul = document.createElement("ul");
        nav_ul.setAttribute("class", "nav navbar-nav navbar-right");
        //登录组件
        var nav_login = document.createElement("li");
        nav_login.setAttribute("class", "active");
        //登录链接
        var nav_login_a = document.createElement("a");
        nav_login_a.setAttribute("href", "#");
        nav_login_a.setAttribute("id", "user-nav");
        nav_login_a.onclick = function () {
            $("#login-panel").modal("show");
        };
        if (user === null) {
            nav_login_a.innerHTML = "登录";
        } else {
            nav_login_a.innerHTML = user;
        }
        //链接加入组件
        nav_login.appendChild(nav_login_a);
        //退出组件
        var nav_logout = document.createElement("li");
        //退出链接
        var nav_logout_a = document.createElement("a");
        nav_logout_a.setAttribute("href", "#");
        nav_logout_a.setAttribute("id", "logout-nav");
        nav_logout_a.onclick = function () {
            logout();
        };
        nav_logout_a.innerHTML = "退出";
        //链接加入组件
        nav_logout.appendChild(nav_logout_a);
        //加入栏布局
        nav_ul.appendChild(nav_login);
        nav_ul.appendChild(nav_logout);
        //加入菜单栏
        nav_column.appendChild(nav_ul);
        //加入布局
        container.appendChild(nav_head);
        container.appendChild(nav_column);
        //导航栏
        navbar.appendChild(container);
        body.appendChild(navbar);

    }
    ;

    /**
     * 立即执行函数,检查用户是否登录，是，则继续，否，则回到起始页
     * @returns {undefined}
     */
    (function () {
        // //获取用户名
        var user = window.localStorage.getItem("renju-game-user");
        //如果用户名存在，则进入游戏，否则返回设置用户名
        if (user === null) {
            //如果当前不是主页，转至主页
            if (window.location.href.indexOf("index.html") < 0) {
                window.location.href = "index.html";
            }
        }
        //初始化导航栏
        initNav(user);
    })();

};
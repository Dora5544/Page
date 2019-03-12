/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//
//var url = "http://180.174.81.173:3389";
//var url = "http://localhost:3389";
var url = "";
var play_api = "/renju/play";
var rank_api = "/renju/rank";

//玩家颜色，black或white，先走的为black
var player_black = "black";
var player_white = "white";

/**
 * 
 * @param {type} method
 * @param {type} url_api
 * @param {type} message
 * @param {type} receive
 * @returns {undefined}
 */
function sendJson(method, url_api, message, receive) {
    //创建http对象
    var xmlhttp = new XMLHttpRequest();
    //接受响应回调
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            //接受并解析
            receive(xmlhttp.responseText);
        }
    };
    //建立连接
    xmlhttp.open(method, url_api, true);
    //设置json
    xmlhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    if (message !== null) {
        //发送
        xmlhttp.send(message);
    }else{
        xmlhttp.send();
    }
}


/**
 * 更新排行榜
 * @returns {undefined}
 */
function updateRank() {
    //get table rank
    var rank_table = document.getElementById("user-rank");
    //send json
    sendJson("GET", url + rank_api,null, function (response) {
        //receive
        response = JSON.parse(response);
        //rank list
        var rank_list = response;
        //for each
        var rank=0;
        for (var i in rank_list) {
            //get user
            var user = rank_list[i];
            //rank
            rank=Number(rank)+Number(1);
            //create line
            var line = document.createElement("tr");
            //rank col
            var rank_col = document.createElement("td");
            rank_col.innerHTML = rank;
            //name col
            var name_col = document.createElement("td");
            name_col.innerHTML = user.name;
            //score col
            var score_col = document.createElement("td");
            score_col.innerHTML = user.score;
            //add child widge
            line.appendChild(rank_col);
            line.appendChild(name_col);
            line.appendChild(score_col);
            //rank table
            rank_table.appendChild(line);
        }
    }); 
}
/**
 * 
 * @param {type} user_name
 * @param {type} game_level
 * @returns {undefined}
 */
var Game = function (user_name, game_level) {

    //用户名
    var user = user_name;
    //难度
    var level=Number(game_level);

    /**
     * 初始化棋盘
     * @returns {Array}
     */
    function initBoard() {
        var board = new Array();
        for (var i = 0; i < 15; i++) {
            board[i] = new Array();
            for (var j = 0; j < 15; j++) {
                board[i][j] = true;
            }
        }
        return board;
    }
    ;

    //15*15棋盘，true代表能走，false代表不能走
    var board_enable = initBoard();
    //计入当前玩家是否可以走，当玩家已走且AI未走时，玩家不能走两次
    var player_enable = false;

    //玩家，默认黑棋
    var player = player_black;
    //ai，默认白棋
    var ai = player_white;

    //通知区组件
    var info_panel = document.getElementById("info-panel");
    //通知图组件
    var info_img = document.getElementById("info-img");
    
    /**
     * 响应式开发，对于不同屏幕的设备返回不同的棋盘
     * @returns {Number|screen.availWidth}
     */
    function initCanvas(){
        var screen_width=screen.availWidth;
        //宽度大于600的屏幕
        if(screen_width>600){
            return 600;
            //宽度小于600的屏幕
        }else{
            return screen_width;
        }
    }
    
    /**
     * 响应式开发，根据屏幕大小返回不同类型的背景图片
     * @returns {Number|screen.availWidth}
     */
    function initCanvasBackground(){
        var screen_width=screen.availWidth;
        var img_dir="./drawable/";
        if(screen_width>1600){
            return img_dir+"background_xl.png";
        }
        //宽度大于600的屏幕
        else if(screen_width>800 && screen_width<=1600){
            return img_dir+"background_l.png";
            //宽度小于600的屏幕
        }else if(screen_width>400 && screen_width<=800){
            return img_dir+"background_m.png";
        }else{
            return img_dir+"background_s.png";
        }
    }
    //背景图
    var board_background=initCanvasBackground();
    //定义宽度与高度
    var board_width = initCanvas();
    //格子宽度
    var grid_width = board_width / 16;
    //棋子宽度
    var chess_width = grid_width * 0.45;
    //获取画布
    var canvas = document.getElementById("board");
    //定义画布大小
    canvas.width = board_width;
    canvas.height = board_width;
    //获取画布内容
    var context = canvas.getContext("2d");
    //session id
    var session_id = 0;

    //画棋
    function paintChess(row, col, player) {
        //输入行与列，转换成坐标
        var x = col * grid_width + grid_width;
        var y = row * grid_width + grid_width;
        //画棋子
        context.beginPath();
        context.arc(x, y, chess_width, 0, 2 * Math.PI);
        context.closePath();
        //增加渐变效果
        var gradient = context.createRadialGradient(x, y, chess_width, x, y, chess_width * 0.45);
        //渲染黑棋
        if (player === player_black) {
            gradient.addColorStop(0, "#0a0a0a");
            gradient.addColorStop(1, "#636766");
        } else {
            //渲染白棋
            gradient.addColorStop(0, "#D1D1D1");
            gradient.addColorStop(1, "#F9F9F9");
        }
        //填充
        context.fillStyle = gradient;
        context.fill();
    }
    ;
    /*
     * 第一步，发送开始游戏请求
     * msg={
     *  id:0
     *  code:1
     *  name:dora
     *  row=0
     *  col=0
     *  }
     * 
     * @returns {undefined}
     */
    function startGame() {
        //封装发送请求
        var msg = {
            id: 0, //code=1时，id无效
            //code=1, 请求启动游戏
            code: 1,
            level:level, //游戏难度目前支持1-5 @since 2019.2.27
            name: user,
            row: 0, //code=1时，row无效
            col: 0 //code=1时，col无效
        };
        //发送json
        sendJson("POST", url + play_api, JSON.stringify(msg), function (body) {
            //转对象
            var response_msg = JSON.parse(body);
            //获取session
            session_id = response_msg.id;
            //获取谁先走
            //code=2,玩家先走
            //先走拿黑色
            if (response_msg.code === 2) {
                player = player_black;
                ai = player_white;
                alert("玩家先走");
                //图标
                info_img.src = "./drawable/ai_white.png";
                //通知面板
                info_panel.innerHTML = "玩家走棋.";
            }
            //code=3，ai先走
            else if (response_msg.code === 3) {
                player = player_white;
                ai = player_black;
                //图标
                info_img.src = "./drawable/ai_black.png";
                alert("AI先走");
                //通知面板
                info_panel.innerHTML = "AI走棋.";
                //获取机器第一步走的位置
                var row = response_msg.row;
                var col = response_msg.col;
                //机器落子
                paintChess(row, col, ai);
                //记录棋盘
                board_enable[row][col] = false;
                info_panel.innerHTML = "玩家走棋.";
            } else {
                alert("ai坏了，游戏结束。");
            }
            player_enable = true;
        });
    }
    ;

    //初始化立即执行   
    (function () {
        //创建背景图像实例
        var img = new Image();
        //加载图像
        img.src = board_background;
        //图像加载完后，将图像绘制在画布上
        img.onload = function () {
            //把背景画在画布上
            context.drawImage(img, 0, 0, board_width, board_width);
            //设置线宽
            context.lineWidth = 3;
            //画边界框
            context.moveTo(grid_width, grid_width);
            context.lineTo(board_width - grid_width, grid_width);
            context.stroke();
            context.moveTo(grid_width, grid_width);
            context.lineTo(grid_width, board_width - grid_width);
            context.stroke();
            context.moveTo(grid_width, board_width - grid_width);
            context.lineTo(board_width - grid_width, board_width - grid_width);
            context.stroke();
            context.moveTo(board_width - grid_width, grid_width);
            context.lineTo(board_width - grid_width, board_width - grid_width);
            context.stroke();
            //画格子
            context.lineWidth = 2;
            //初始宽度
            var current = 2 * grid_width;
            for (var i = 0; i < 13; i++) {
                //通过循环画网格             
                //水平线
                context.moveTo(grid_width, current);
                context.lineTo(board_width - grid_width, current);
                context.stroke();
                //垂直线
                context.moveTo(current, grid_width);
                context.lineTo(current, board_width - grid_width);
                context.stroke();
                //下一条
                current = current + grid_width;
            }
            info_panel.innerHTML = "加载完成，等待连接远程AI..."
            //启动游戏
            startGame();
        };
        //添加按键事件
        canvas.onclick = function (e) {
            if (player_enable === true) {
                //玩家走完一步，只有等ai走完后才能走第二步
                player_enable = false;
                //当鼠标按下棋盘，获取按下位置坐标
                //矫正坐标
                var x = (e.offsetX - grid_width) / grid_width;
                var y = (e.offsetY - grid_width) / grid_width;
                //计算行列
                var col = Math.round(x);
                var row = Math.round(y);
                //只有没走过的地方才能走
                if (board_enable[row][col] === true) {
                    //如果玩家是白棋，调用绘制白棋
                    //如果玩家是黑棋，调用绘制黑棋
                    paintChess(row, col, player);
                    board_enable[row][col] = false;
                    //通知面板
                    info_panel.innerHTML = "AI走棋，正在思考...";
                    //封装玩家落子
                    var msg = {
                        id: session_id,
                        //code=8，玩家走棋完成
                        code: 8,
                        name: user,
                        level:level,
                        row: row,
                        col: col
                    };
                    //发送
                    sendJson("POST", url + play_api, JSON.stringify(msg), function (response) {
                        //接收ai落子
                        var response_msg = JSON.parse(response);
                        if(response_msg.code===-1){
                            alert("游戏已结束，可能是你已经胜利或者失败，也有可能你长时间未走棋.");
                        }
                        //判断玩家有没有赢
                        //code=15,玩家赢
                        if (response_msg.code === 15) {
                            alert("你赢了");
                            info_panel.innerHTML = "游戏结束，你赢了";
                            //更新排名
                            updateRank();
                            //set visible
                            var rank_panel = document.getElementById("rank-panel");
                            rank_panel.style = "display:block";
                            return;
                        }
                        //获取机器第一步走的位置
                        var ai_row = response_msg.row;
                        var ai_col = response_msg.col;
                        //绘制ai走棋
                        paintChess(ai_row, ai_col, ai);
                        board_enable[ai_row][ai_col] = false;
                        //ai走完，玩家继续走
                        player_enable = true;
                        //通知面板
                        info_panel.innerHTML = "玩家走棋.";
                        //判断AI有没有赢
                        //code=16,AI赢
                        if (response_msg.code === 16) {
                            alert("你输了");
                            info_panel.innerHTML = "游戏结束，你输了";
                            updateRank();
                             //set visible
                            var rank_panel = document.getElementById("rank-panel");
                            rank_panel.style = "display:block";
                        }
                    });
                } else {
                    alert("非法走棋，不能走在重复的位置上");
                    player_enable = true;
                }
            } else {
                alert("等待AI走棋");
            }
        };
    })();
};


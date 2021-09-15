/*
 * 框架实现
 */
enchant();


/*
 * 常量
 */
// 参数
var SCREEN_WIDTH    = 320;  // 屏幕的宽度
var SCREEN_HEIGHT   = 320;  // 屏幕的高度
// 玩家
var PLAYER_WIDTH    = 32;   // 玩家的宽度
var PLAYER_HEIGHT   = 32;   // 玩家的高度
var PLAYER_SPEED    = 8;    // 玩家的速度
// 子弹
var BULLET_WIDTH    = 8;    // 子弹的宽度
var BULLET_HEIGHT   = 16;   // 子弹的高度
var BULLET_SPEED    = 12;   // 子弹的速度
// 敌机
var ENEMY_WIDTH     = 32;   // 敌机的宽度
var ENEMY_HEIGHT    = 32;   // 敌机的高度
var ENEMY_SPEED     = 4;    // 敌机的速度
var ENEMY_CREATE_INTERVAL = 15; // 生成敌机的时间间隔
var ENEMY_TYPE_RED  = 0;
var ENEMY_TYPE_GREEN= 1;
var ENEMY_TYPE_BLUE = 2;
// 爆炸
var CRASH_WIDTH     = 32;   // 爆炸的宽度
var CRASH_HEIGHT    = 32;   // 爆炸的高度
// 背景
var BACKGROUND_WIDTH    = 320;  // 背景的宽度
var BACKGROUND_HEIGHT   = 2384; // 背景的高度
var SCROLL_SPEED        = 4;    // 背景往上卷的速度
// 图片
var PLAYER_IMAGE        = "http://www.shoeisha.co.jp/book/shuchu/enchantsample/chapter04/player.png";
var ENEMY_RED_IMAGE     = "http://www.shoeisha.co.jp/book/shuchu/enchantsample/chapter04/enemy_red.png";
var ENEMY_GREEN_IMAGE   = "http://www.shoeisha.co.jp/book/shuchu/enchantsample/chapter04/enemy_green.png";
var ENEMY_BLUE_IMAGE    = "http://www.shoeisha.co.jp/book/shuchu/enchantsample/chapter04/enemy_blue.png";
var BULLET_IMAGE        = "http://www.shoeisha.co.jp/book/shuchu/enchantsample/chapter04/bullet.png";
var CRASH_IMAGE         = "http://www.shoeisha.co.jp/book/shuchu/enchantsample/chapter04/crash.png";
var BACKGROUND_IMAGE    = "http://www.shoeisha.co.jp/book/shuchu/enchantsample/chapter04/background.png";
// 声音
var MAIN_BGM            = "http://www.shoeisha.co.jp/book/shuchu/enchantsample/chapter04/main_bgm.wav";
var CRASH_SE            = "http://www.shoeisha.co.jp/book/shuchu/enchantsample/chapter04/crash.wav";
// 资源
var ASSETS = [
    PLAYER_IMAGE, BULLET_IMAGE, ENEMY_RED_IMAGE, ENEMY_GREEN_IMAGE, ENEMY_BLUE_IMAGE, CRASH_IMAGE, BACKGROUND_IMAGE,
    MAIN_BGM, CRASH_SE,
];


/*
 * 全局变量
 */
var game        = null;
var player      = null;
var bulletList  = null;
var enemyList   = null;
var scoreLabel  = null;


/*
 * 通用处理
 */
// Array对列功能扩充
Array.prototype.erase = function(elm) {
    var index = this.indexOf(elm);
    this.splice(index, 1);
    return this;
};
// 生成随机值
var randfloat = function(min, max) {
    return Math.random()*(max-min)+min;
};


/*
 * 主函数处理
 */
window.onload = function() {
    // 生成游戏物体
    game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);
    // 读取图片
    game.preload(ASSETS);
    
    // 游戏开始时的处理
    game.onload = function() {
        var scene = game.rootScene;
        scene.backgroundColor = "#8cc"; // 指定背景色为蓝色
        
        // 生成，显示纵向很长的图片背景
        var background = new Sprite(BACKGROUND_WIDTH, BACKGROUND_HEIGHT);
        background.image = game.assets[BACKGROUND_IMAGE];
        background.moveTo(0, -background.height + game.height);
        background.onenterframe = function() {
            // 图片背景往上卷的速度
            this.y += SCROLL_SPEED;
            // 如果卷到头则返回末尾重新开始卷
            if (this.y >= 0) {
                background.moveTo(0, -background.height + game.height);
            }
        };
        scene.addChild(background);
        
        // 场景切换时的处理
        scene.onenter = function() {
            // 将游戏帧数初始化为0
            game.frame = 0;
            
            // 虚拟摇杆的生成，显示（后面的代码中也规定可用方向键来控制）
            var pad = new Pad();
            pad.moveTo(10, SCREEN_HEIGHT-100);
            pad._element.style.zIndex = 100;
            scene.addChild(pad);
            
            // 生成，显示玩家
            player = new Player();
            player.moveTo(SCREEN_WIDTH/2-PLAYER_WIDTH/2, SCREEN_HEIGHT-PLAYER_HEIGHT);
            scene.addChild(player);
            
            // 子弹列表
            bulletList = [];
            // 敌机列表
            enemyList = [];
            
            // 积分标签的生成，显示
            scoreLabel = new ScoreLabel(10, 10);
            scoreLabel.score = 0;
            scoreLabel._element.style.zIndex = 100;
            scene.addChild(scoreLabel);
        };
        
        // 场景每帧更新时的处理
        scene.onenterframe = function() {
            // 生成，显示子弹
            if (game.frame%30 < 20 && game.frame % 5 == 0) {
                var bullet = new Bullet();
                bullet.moveTo(player.x+PLAYER_WIDTH/2-BULLET_WIDTH/2, player.y-20);
                bulletList.push(bullet);
                scene.addChild(bullet);
            }
            // 生成，显示敌机
            if (game.frame % ENEMY_CREATE_INTERVAL == 0) {
                // レベルを取得
                var level = game.frame/300|0;
                level = Math.min(level, 3);
                var enemy = null;
                
                // 根据等级不同，生成的敌机种类会有所变更
                if (level == 0) {
                    enemy = new Enemy(ENEMY_TYPE_RED); //0级时敌机只会傻傻地往下落，红色机体
                }
                else if (level == 1) {
                    enemy = new Enemy(ENEMY_TYPE_GREEN); //1级时敌机会等一段时间再落，绿色机体
                }
                else if (level == 2) {
                    enemy = new Enemy(ENEMY_TYPE_BLUE); //2级时敌机会左右晃悠，蓝色机体
                }
                else { //3级开始各种机体都有
                    var r = randfloat(0, 3)|0;
                    enemy = new Enemy(r);
                }
                var x = randfloat(0, SCREEN_WIDTH-ENEMY_WIDTH);
                var y = -20;
                enemy.moveTo(x, y)
                enemyList.push(enemy);
                scene.addChild(enemy);
            }
            
            // 玩家和敌机碰撞时
            for (var i=0,len=enemyList.length; i<len; ++i) {
                var enemy = enemyList[i];
                if (enemy.intersect(player)) {
                    // 积分固定，出现游戏结束画面
                    var score = scoreLabel.score;
                    var msg   = scoreLabel.score + "point 獲得しました!";
                    game.end(score, msg);
                }
            }
            
            // 子弹和敌机碰撞时
            for (var i=0,len=enemyList.length; i<len; ++i) {
                var enemy = enemyList[i];
                
                if (enemy.destroy === true) continue ; //这行代码是双保险，但可写可不写
                
                for (var j=0,len2=bulletList.length; j<len2; ++j) {
                    var bullet = bulletList[j];
                    // 检测敌机和子弹的冲突判定
                    if (bullet.intersect(enemy) == true) {
                        enemy.destroy = true;
                        bullet.destroy = true;
                        
                        // 生成爆炸特效
                        var crash = new Crash();
                        crash.moveTo(enemy.x, enemy.y);
                        scene.addChild(crash);
                        
                        // SE（效果音）播放，可同时播放
                        game.assets[CRASH_SE].clone().play();
                        
                        // 积分加算（提升时候是动态提升，不是一下子增加100，而是一点点加到100）
                        scoreLabel.score += 100;
                        break;
                    }
                }
            }
            
            // BGM（背景音乐）播放，循环播放
            game.assets[MAIN_BGM].play();
        };
    };
    
    game.start();
};


/*
 * 玩家类
 */
var Player = Class.create(Sprite, {
    initialize: function() {
        Sprite.call(this, PLAYER_WIDTH, PLAYER_HEIGHT);
        this.image = game.assets[PLAYER_IMAGE];
        this.frame = 0;
    },
    onenterframe: function() {
        var input = game.input; //允许玩家按左右上下方向键控制机体移动
        var vx = 0, vy = 0;
        
        // 计算左右位移值
        if (input.left == true) {
            vx = -PLAYER_SPEED;
            this.frame = 1;
        }
        else if (input.right == true) {
            vx =  PLAYER_SPEED;
            this.frame = 2;
        }
        else {
            this.frame = 0;
        }
        
        // 计算上下位移值
        if      (input.up    === true) vy = -PLAYER_SPEED;
        else if (input.down  === true) vy =  PLAYER_SPEED;
        
        // 斜方向移动修正
        if (vx !== 0 && vy !== 0) {
            var length = Math.sqrt(vx*vx + vy*vy);  // 计算出长度
            vx /= length; vy /= length;             // 使其长度化为1，和左右上下方向位移距离相同
            vx *= PLAYER_SPEED; vy *= PLAYER_SPEED; // 乘上速度，以此来调整最终长度
        }
        
        // 决定移动到哪里
        this.moveBy(vx, vy);
        
        // 控制机体不出画面边界
        var left    = 0;
        var right   = SCREEN_WIDTH-this.width;
        var top     = 0;
        var bottom  = SCREEN_HEIGHT-this.height;
        
        if      (this.x < left)     this.x = left;
        else if (this.x > right)    this.x = right;
        if      (this.y < top)      this.y = top;
        else if (this.y > bottom)   this.y = bottom;
    }
});


/*
 * Bullet（子弹）类
 */
var Bullet = Class.create(Sprite, {
    // 初始化处理
    initialize: function() {
        Sprite.call(this, BULLET_WIDTH, BULLET_HEIGHT);
        this.image = game.assets[BULLET_IMAGE];
        this.destroy = false;
    },
    // 更新处理
    onenterframe: function() {
        this.y -= BULLET_SPEED;
        // 删除处理
        if (this.y < -20 || this.destroy === true) {
            this.parentNode.removeChild(this);
            bulletList.erase(this);
        }
    },
});


/*
 * Enemy（敌机）类
 */
var Enemy = Class.create(Sprite, {
    // 初始化处理
    initialize: function(type) {
        Sprite.call(this, ENEMY_WIDTH, ENEMY_HEIGHT);
        
        // 根据敌机类型不同，显示的图像和动作也会进行变动
        switch (type) {
            case ENEMY_TYPE_RED:
                this.image = game.assets[ENEMY_RED_IMAGE];
                this.tl.moveBy(0, 120, 30).loop();
                break;
            case ENEMY_TYPE_GREEN:
                this.image = game.assets[ENEMY_GREEN_IMAGE];
                this.tl.moveBy(0, 120, 30, enchant.Easing.QUAD_EASEINOUT).wait(30).loop();
                break;
            case ENEMY_TYPE_BLUE:
                this.image = game.assets[ENEMY_BLUE_IMAGE];
                this.tl.moveBy(30, 120, 30, enchant.Easing.QUAD_EASEINOUT).moveBy(-30, 120, 30, enchant.Easing.QUAD_EASEINOUT).loop();
                break;
            default : //默认是第一种
                this.image = game.assets[ENEMY_RED_IMAGE];
                this.tl.moveBy(0, 120, 30).loop();
                break;
        }
        
        this.destroy = false;
    },
    // 更新处理
    onenterframe: function() {
        // this.y += ENEMY_SPEED;
        
        // 删除处理
        if (this.y > SCREEN_HEIGHT || this.destroy === true) {
            this.parentNode.removeChild(this);
            enemyList.erase(this);
        }
    },
});


/*
 * 爆炸类
 */
var Crash = Class.create(Sprite, {
    // 初始化处理
    initialize: function() {
        Sprite.call(this, CRASH_WIDTH, CRASH_WIDTH);
        this.image = game.assets[CRASH_IMAGE];
        this.frame = 0;
        this.scale(2);
    },
    // 更新处理
    onenterframe: function() {
        this.frame += 1;
        
        // 删除处理
        if (this.frame > 64) {
            this.parentNode.removeChild(this);
        }
    },
});

/*
小王制造
*/
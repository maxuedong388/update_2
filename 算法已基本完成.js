//创建一个棋盘的构造函数
function Mine(tr, td, mineNum, count) {
    this.tr = tr;//棋盘行数
    this.td = td;//棋盘列数
    this.mineNum = mineNum;//雷的数量
    this.squares = [];//用于存储每个方块的信息
    this.tds = [];//存储每一个td的dom对象；
    this.setMine = mineNum;
    this.surplusMine = this.setMine;//存储剩余雷的数量；
    this.allRight = false;//雷是否被全部找出来
    this.parent = document.getElementById("box");//棋盘容器
    this.count = count;//存储玩家允许踩雷的次数；
    this.num = this.count;//计算玩家允许踩雷的次数；
}
//获取随机数，随机定义雷的位置
Mine.prototype.randomNum = function () {
    //生成this.tr*this.td为长度的数组
    var square = new Array(this.tr * this.td);
    var len = square.length;
    for (var i = 0; i < len; i++) {
        square[i] = i
    }
    //随机打乱数组
    square.sort(function () {
        return .5 - Math.random()
    })

    return square.splice(0, this.setMine);


}
//在Mine原型上绑定创建棋盘的方格的方法
Mine.prototype.createDom = function () {
    var This = this;

    var table = document.createElement('table');
    table.oncontextmenu = function () {
        return false
    }
    for (var i = 0; i < this.tr; i++) {
        var domTr = document.createElement('tr');
        this.tds[i] = []
        for (var j = 0; j < this.td; j++) {
            var domTd = document.createElement('td');
            domTd.pos = [i, j];
            domTd.onmousedown = function () {
                This.play(event, this)//This指的是实例对象，this指的是被点击的domtd，传入到paly方法中
            }
            //判断该domtd是否是雷
            //  if(this.squares[i][j].type == 'mine'){
            //      domTd.setAttribute('name','mine')
            //   }else{
            //     domTd.setAttribute('name','num')   
            //   }
            this.tds[i][j] = domTd;

            domTr.appendChild(domTd)
        }
        table.appendChild(domTr)
    }
    this.parent.appendChild(table);
}
//找出雷周围的格子，格子的value+1
Mine.prototype.getAround = function (square) {
    var x = square.x;
    var y = square.y;
    var result = [];
    for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
            if (
                //对格子超出边界的限制，不能等与自身，不能超出棋盘，不能type == ’mine‘
                (i == 0 && j == 0) ||
                i < 0 ||
                j < 0 ||
                i > this.td - 1 ||
                j > this.tr - 1 ||
                this.squares[j][i].type == 'mine'
            ) {
                continue
            }
            result.push([j, i])
        }
    }
    return result
}
//对雷周围的方格中的数字进行更新
Mine.prototype.updataNum = function () {
    for (var i = 0; i < this.tr; i++) {
        for (var j = 0; j < this.td; j++) {
            if (this.squares[i][j].type == 'number') {
                continue;
            }
            var num = this.getAround(this.squares[i][j]);
            for (var k = 0; k < num.length; k++) {
                this.squares[num[k][0]][num[k][1]].value += 1


            }
        }
    }

}
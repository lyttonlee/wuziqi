'use static'
class Drawer {

  /**
   * Creates an instance of Drawer.
   * @param {number} width
   * @param {string} className
   * @memberof Drawer
   */
  constructor (width, className) {
    // 创建一个canvas
    this.canvas = document.createElement('canvas')
    this.width = width
    this.span = null
    this.lines = null
    // 初始化设置
    this.init(width, className)
    // 创建canvas上下文
    this.ctx = this.canvas.getContext('2d')
    // this.myTurn 是否该用户下棋
    this.myTurn = undefined
    // 下棋步数
    this.steps = []
    // 计算赢法总数
    this.winCounts = null
    // wins 赢法数组
    this.wins = []
  }

  /**
   * 统计有多少种赢法
   *  
   *
   *  */ 
  getAllWinsCount () {
    // 赢法数组
    // [[[]], [[]], .....]
    // let wins = []
    let count = 0
    for (let i = 0; i < this.lines; i++) {
      this.wins[i] = []
      for (let j = 0; j < this.lines; j++) {
        this.wins[i][j] = []
      }
    }
    // 横线wins
    for (let i = 0; i < this.lines; i++) {
      for (let j = 0; j < this.lines - 4; j++) {
        for (let k = 0; k < 5; k++) {
          this.wins[i][j + k][count] = true
        }
        count++
      }
    }
    // 竖线wins
    for (let i = 0; i < this.lines; i++) {
      for (let j = 0; j < this.lines - 4; j++) {
        for (let k = 0; k < 5; k++) {
          this.wins[j + k][i][count] = true
        }
        count++
      }
    }
    // 正斜线wins
    for (let i = 0; i < this.lines - 4; i++) {
      for (let j = 0; j < this.lines - 4; j++) {
        for (let k = 0; k < 5; k++) {
          this.wins[i + k][j + k][count] = true
        }
        count++
      }
    }
    // 反斜线wins
    for (let i = 0; i < this.lines - 4; i++) {
      for (let j = this.lines - 1; j > 3; j--) {
        for (let k = 0; k < 5; k++) {
          this.wins[i + k][j - k][count] = true
        }
        count++
      }
    }
    return count
  }

  /**
   *
   * 创建一个棋盘
   * @param {number} lines
   * @memberof Drawer
   */
  createQiPan (lines) {
    // 画线条
    // 计算间距
    this.lines = lines
    this.span = this.width / (lines + 1)
    for (let index = 0; index < lines; index++) {
      // 画横线
      this.ctx.moveTo(this.span, (1 + index) * this.span)
      this.ctx.lineTo(this.width - this.span, (1 + index) * this.span)
      this.ctx.stroke()
      // 画竖线
      this.ctx.moveTo((1 + index) * this.span, this.span)
      this.ctx.lineTo((1 + index) * this.span, this.width - this.span)
      this.ctx.stroke()
    }
    this.winCounts = this.getAllWinsCount()
    // console.log(this.winCounts)
  }

  // 获取当前下棋者
  getOnStepUser () {
    return this.myTurn ? 'User' : 'AI'
  }

  /**
   *
   *  初始化
   * @param {number} width
   * @param {string} className
   * @memberof Drawer
   */
  init (width, className) {
    // 设置宽高类名
    this.canvas.width = width
    this.canvas.height = width
    if (className) {
      this.canvas.className = className
    }
    this.myTurn = true
  }
  listeningClick () {
    this.canvas.addEventListener('click', (ev) => {
      // console.log(ev)
      // 获取点击的坐标
      const coords = {
        x: ev.offsetX,
        y: ev.offsetY
      }
      // console.log(coords)
      // 判断点击坐标是否在棋盘内
      // 在棋盘线条之外的点击一律视为无效点击
      if (coords.x / this.span < 1 || coords.x / this.span > this.lines || coords.y / this.span < 1 || coords.y / this.span > this.lines) return
      // 获取正确的落棋点坐标
      // 棋盘内的点击以其最接近的交叉点为落子坐标
      const baseX = Math.floor(coords.x / this.span)
      const isAddOneX = (coords.x % this.span) > (this.span / 2) ? 1 : 0
      const baseY = Math.floor(coords.y / this.span)
      const isAddOneY = (coords.y % this.span) > (this.span / 2) ? 1 : 0
      const trueCoords = {
        x: (baseX + isAddOneX) * this.span,
        y: (baseY + isAddOneY) * this.span
      }
      // console.log(trueCoords)
      // 判断这个落棋点是否是已经占位
      const hasStep = this.steps.find((step) => {
        return step.coords.x === trueCoords.x && step.coords.y === trueCoords.y
      })
      // console.log(hasStep)
      if (!!!hasStep) {
        // 绘制棋子
        // console.log('draw')
        this.createQiZi(trueCoords, this.getOnStepUser())
        // 加入步数
        let step = {
          coords: trueCoords,
          user: this.getOnStepUser()
        }
        this.steps.push(step)
        // 转换下棋者
        this.myTurn = !this.myTurn
        // AI计算应该怎么落子才能赢过玩家
        // AI计算落子坐标
      } else {
        console.log('这个地方已经落过子了......')
      }
    })
  }
  /**
   *
   *  挂载画布到指定的id
   * @param {string} id
   * @memberof Drawer
   */
  mount (id) {
    // 挂载画布到DOM
    document.getElementById(id).appendChild(this.canvas)
    // 监听下棋事件（click）
    this.listeningClick()
  }
  // 在画布上画一个棋子
  createQiZi (coords, user) {
    const {x, y} = coords
    // 棋子的路径
    this.ctx.beginPath()
    this.ctx.arc(x, y, this.span / 2, 0, 2 * Math.PI)
    this.ctx.closePath()
    // this.ctx.stroke()
    // 绘制一个圆渐变
    const circleGradient = this.ctx.createRadialGradient(x, y, this.span / 2, x-2, y+2, 0)
    // 根据user设置棋子渐变颜色
    const StartColor = user === 'AI' ? '#0a0a0a' : '#d1d1d1'
    const EndColor = user === 'AI' ? '#636766' : '#f9f9f9'
    circleGradient.addColorStop(0, StartColor)
    circleGradient.addColorStop(1, EndColor)
    // 填充颜色
    this.ctx.fillStyle = circleGradient
    this.ctx.fill()
  }
  /**
   *
   * 销毁这个画布的dom元素
   * @memberof Drawer
   */
  destroy () {
    this.canvas.remove()
  }
}
module.exports = Drawer
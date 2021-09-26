import { IDanmaMessage } from './interface/IDanmaMessage'

export class DanmakuPool {
  private mPoolSize: number = 20
  private mMessagePool: Array<IDanmaMessage | null> = new Array(this.mPoolSize)
  private isEnd: boolean = false
  private danmakuLen: number | undefined
  constructor(size?: number) {
    if (size) {
      this.mPoolSize = size
      this.mMessagePool = new Array(this.mPoolSize)
    }
  }
  addMessage(msg: IDanmaMessage) {
    this.addMessages([msg])
  }
  getMessage(): IDanmaMessage | null {
    let result = null
    for (let i = 0; i < this.mMessagePool.length; i++) {
      if (this.mMessagePool[i] && (this.mMessagePool[i] as IDanmaMessage).created) {
        result = this.mMessagePool[i]
        if (i === this.danmakuLen) {
          this.isEnd = true
        }
        this.mMessagePool[i] = null
        break
      }
    }
    return result
  }
  /**
   * 用来获取弹幕是不是全部发送完了
   * @param danmakuLen 弹幕条数
   * @returns
   */
  getEnd(danmakuLen: number): boolean {
    this.danmakuLen = danmakuLen
    console.log('this.isEnd ', this.isEnd)
    return this.isEnd
  }
  /**
   * 用来重置发送完了的状态
   */
  resetEnd(): void {
    this.isEnd = false
  }
  addMessages(msgs: Array<IDanmaMessage> = []) {
    for (let i = 0; i < msgs.length; i++) {
      for (let j = 0; j < this.mMessagePool.length; j++) {
        if (!this.mMessagePool[j]) {
          this.mMessagePool[j] = msgs[i]
          if (this.mMessagePool[j]) (this.mMessagePool[j] as IDanmaMessage).onBaseCreate()
          break
        }
      }
    }
  }
  removeMessage(msg: IDanmaMessage) {
    let index = this.mMessagePool.findIndex(item => item === msg)
    this.removeMessageByIndex(index)
  }
  removeMessageByIndex(index: number) {
    if (Number.isInteger(index) && index > 0) {
      this.mMessagePool[index] = null
    }
  }
}

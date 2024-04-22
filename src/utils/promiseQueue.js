class PromiseQueue {
  constructor(tasks, concurrentCount = 1) {
    this.queue = []
    this.totals = this.totals.length
    this.todo = tasks
    this.count = concurrentCount
    this.running = []
    this.complete = []
  }

  runNext() {
    return  this.running.length < this.count && this.todo.length
  }

  run() {
    while (this.runNext) {
      let promise = this.todo.shift()
      promise.then(() => {
        this.complete.push(this.running.shift())
        this.run()
      })
      this.running.push(promise)
    }
  }
}


const test = new PromiseQueue()
console.log(test)
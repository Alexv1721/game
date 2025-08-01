  const can = document.getElementById("canva")
    const draw = can.getContext("2d")
    const timerDisplay = document.getElementById("timer")
    const caughtSound = document.getElementById("caughtSound")
    const startBtn = document.getElementById("startBtn")
    const resetBtn = document.getElementById("resetBtn")
    const wel = document.getElementById("wel")
    const msg = document.getElementById("msg")

    let x = 0, y = 0, unit = 20, Width = 500
    let xvel = 20, yvel = 0
    let lxvel = 20, lyvel = 0

    let rarr = [], larr = []
    let gameRunning = false
    let startTime, timerInterval
    let currentRound = 1
    let times = []
    let runnerName = ""
    let chaserName = ""

    const runnerImg = new Image()
    const chaserImg = new Image()
    runnerImg.src = "OIP (1).webp"
    chaserImg.src = "OIP.webp"

    function clear() {
      draw.fillStyle = "black"
      draw.fillRect(0, 0, 500, 500)
    }

    function righ_player() {
      draw.drawImage(runnerImg, rarr[0].x, rarr[0].y, unit, unit)
    }

    function let_player() {
      draw.drawImage(chaserImg, larr[0].x, larr[0].y, unit, unit)
    }

    function move() {
      let rNext = { x: rarr[0].x - xvel, y: rarr[0].y + yvel }
      let lNext = { x: larr[0].x + lxvel, y: larr[0].y + lyvel }

      // Wraparound
      rNext.x = (rNext.x + Width) % Width
      rNext.y = (rNext.y + Width) % Width
      lNext.x = (lNext.x + Width) % Width
      lNext.y = (lNext.y + Width) % Width

      rarr.unshift(rNext)
      larr.unshift(lNext)
      rarr.pop()
      larr.pop()
    }

    function checkCollision() {
      return rarr[0].x === larr[0].x && rarr[0].y === larr[0].y
    }

    function updateTimer() {
      timerInterval = setInterval(() => {
        const now = new Date()
        timerDisplay.innerText = `Time: ${((now - startTime) / 1000).toFixed(2)}s`
      }, 100)
    }

    function run() {
      if (!gameRunning) return
      setTimeout(() => {
        clear()
        move()
        righ_player()
        let_player()
        if (checkCollision()) {
          gameRunning = false
          clearInterval(timerInterval)
          caughtSound.play()
          let timeTaken = ((new Date() - startTime) / 1000).toFixed(2)
          msg.innerHTML = ` Catch! Time: ${timeTaken} seconds`
          times.push(+timeTaken)

          if (currentRound === 2) {
            setTimeout(showWinner, 2000)
          } else {
            [runnerName, chaserName] = [chaserName, runnerName]
            setTimeout(() => {
              currentRound = 2
              startRound()
            }, 2000)
          }
          return
        }
        run()
      }, 150)
    }

    function resetGame() {
      xvel = 20; yvel = 0
      lxvel = 20; lyvel = 0
      rarr = [{ x: 480, y: Width / 2 }]
      larr = [{ x: 0, y: Width / 2 }]
      clear()
      righ_player()
      let_player()
      timerDisplay.innerText = "Time: 0.00s"
      msg.innerHTML = `<span class="val">Score</span> 0`
    }

    function startRound() {
      resetGame()
      startTime = new Date()
      gameRunning = true
      updateTimer()
      wel.innerText = `${runnerName} is Running | ${chaserName} is Chasing (Round ${currentRound})`
      run()
    }

    function showWinner() {
      const [time1, time2] = times
      let winner = time1 < time2 ? originalChaser : originalRunner
      wel.innerText = ` ${originalRunner}: ${time1}s | ${originalChaser}: ${time2}s ➜ Winner: ${winner}!`
      msg.innerHTML = " Game Over"
    }

    let originalRunner = "", originalChaser = ""

    startBtn.addEventListener("click", () => {
      const rName = document.getElementById("runner").value.trim()
      const cName = document.getElementById("chaser").value.trim()
      if (!rName || !cName) {
        alert("Please enter both names!")
        return
      }
      runnerName = rName
      chaserName = cName
      originalRunner = rName
      originalChaser = cName
      currentRound = 1
      times = []
      startRound()
    })

    resetBtn.addEventListener("click", () => {
      gameRunning = false
      clearInterval(timerInterval)
      wel.innerText = "Welcome to Chase Game"
      msg.innerHTML = `<span class="val">Score</span> 0`
      timerDisplay.innerText = "Time: 0.00s"
      rarr = []
      larr = []
    })

    window.addEventListener("keydown", operation)

    function operation(e) {
      let a = e.keyCode
      const left = 37, up = 38, down = 40, righ = 39
      const A = 65, D = 68, W = 87, X = 88

      switch (a) {
        case righ: yvel = 0; xvel = -unit; break
        case left: yvel = 0; xvel = unit; break
        case up: yvel = -unit; xvel = 0; break
        case down: yvel = unit; xvel = 0; break
        case D: lyvel = 0; lxvel = -unit; break
        case A: lyvel = 0; lxvel = unit; break
        case W: lyvel = -unit; lxvel = 0; break
        case X: lyvel = unit; lxvel = 0; break
      }
    }

    resetGame()
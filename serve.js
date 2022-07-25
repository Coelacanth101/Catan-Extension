const { Console } = require("console");
const { emit } = require("process");

//サーバー用変数
const app  = require("express")();
const http = require("http").createServer(app);
const io   = require("socket.io")(http);
const DOCUMENT_ROOT = __dirname + "/static";
const SECRET_TOKEN = "abcdefghijklmn12345";
app.get("/", (req, res)=>{
  res.sendFile(DOCUMENT_ROOT + "/Catan-Extension.html");
});

app.get("/:file", (req, res)=>{
  res.sendFile(DOCUMENT_ROOT + "/" + req.params.file);
});

/**
 * 3000番でサーバを起動する
 */
 http.listen(process.env.PORT || 3000, ()=>{
  console.log("listening on *:3000");
});


/*------------------------------------------
------------------------------------------*/
const maxPlayer = 6
let playersName = []
let m = 1
while(m <= maxPlayer){
  playersName.push('')
  m += 1
}
const numbers = [2,2,3,3,3,4,4,4,5,5,5,6,6,6,8,8,8,9,9,9,10,10,10,11,11,11,12,12]
const buildResource = {house:{ore:0,grain:1,wool:1,lumber:1,brick:1}, city:{ore:3,grain:2,wool:0,lumber:0,brick:0}, card:{ore:1,grain:1,wool:1,lumber:0,brick:0}, road:{ore:0,grain:0,wool:0,lumber:1,brick:1}}
const progress = {knight:20, road:3, harvest:3, monopoly:3, point:5}
const resourceType = ['tetsu','mugi','hitsuji','ki','renga']


class Player{
  constructor(name, number, socketID){
    this.name = name;
    this.number = number;
    this.socketID = socketID
    this.resource = {ore:0,grain:0,wool:0,lumber:0,brick:0}
    this.token = {house:5, city:4, road:15}
    this.house = []
    this.city = []
    this.road = []
    this.progress = {knight:0, road:0, harvest:0, monopoly:0, point:0}
    this.usedProgress = {knight:0, road:0, harvest:0, monopoly:0, point:0}
    this.thisTurnProgress = 0
    this.largestArmy = 0
    this.longestRoad = 0
    this.point = this.house.length + this.city.length*2 + this.progress.point + this.largestArmy + this.longestRoad
  };
  build(item){

  };
  draw(){
    while(this.toDraw > 0){
      if(game.deck.length > 0){
        let randomNumber = Math.floor(Math.random()*game.deck.length);
        let card = game.deck[randomNumber]
        this.hand.push(card);
        game.deck.splice(randomNumber,1);
        this.toDraw -= 1
      }else{
        break
      }
    }
  };
  turnEnd(){
    this.playingCard = ''
    this.targetBox = ''
    display.boxDelete()
    this.draw()
    this.toDraw = 0
    game.turnEnd()
  };
  resetMythis(){
    this.hand = [];
    toDraw = 0;
    this.playingCard = ''
    this.targetBox = ''
  };
  refresh(){
    this.hand = [];
    this.toDraw = 0;
    this.playingCard = ''
    this.targetBox = ''
  };
}

const game = {maxPlayer:maxPlayer, players:[], turnPlayer:'', phase:'nameinputting', progressDeck:[],
  playerMake(){
    let i = 1
    this.players = []
    while(i <= playersName.length){
        let name = playersName[i-1].name
        let number = i-1
        let socketID = playersName[i-1].socketID
        const player = new Player(name, number, socketID)
        this.players.push(player)
        i += 1
    }
  },
  refresh(){
    for(let p of this.players){
        p.refresh();
    }
    for(let b of this.boxes){
      b.refresh();
    }
    this.turnPlayer = ''
    this.phase = 'playing'
  },
  gameStart(){
    this.phase = 'playing'
    this.playerMake();
    let i = 1
    while(i <= maxPlayer){
      playersName[i-1] = ''
      i += 1
    }
    this.turnPlayer = this.players[0]
    this.deckMake();
    this.deal()
    display.playerSort();
    display.name();
    display.allHands();
    display.field()
    display.hideItems();
    display.turnPlayer();
  },
  arrayHasID(array, ID){
    for(let item of array){
      if(item.socketID === ID){
        return true;
      }
    }
    return false
  },
  progressDeckMake(){
    this.progressDeck = [];
    let arr =[]
    let i = 1;
    while(i <= progress.knight){
      this.progressDeck.push('knight')
      i += 1
    }
    i = 1;
    while(i <= progress.road){
      this.progressDeck.push('road')
      i += 1
    }
    i = 1;
    while(i <= progress.harvest){
      this.progressDeck.push('harvest')
      i += 1
    }
    i = 1;
    while(i <= progress.monopoly){
      this.progressDeck.push('monopoly')
      i += 1
    }
    i = 1;
    while(i <= progress.point){
      this.progressDeck.push('point')
      i += 1
    }
    i = 1
    let n = this.progressDeck.length
    while(i <= n){
      let randomNumber = Math.floor(Math.random()*this.progressDeck.length);
      let card = this.progressDeck[randomNumber]
      arr.push(card);
      this.progressDeck.splice(randomNumber,1);
      i += 1;
    }
    this.progressDeck = arr
  },
  deal(){
    let n;
    switch(this.players.length){
        case 1:
            n = 8;
            break;
        case 2:
            n = 7;
            break;
        case 3:
            n = 6;
            break;
        case 4:
            n = 6;
            break;
        case 5:
            n = 6;
            break;
    }
    for(let p of this.players){
        let i = 1;
        while(i <= n){
            let randomNumber = Math.floor(Math.random()*this.deck.length);
            let card = this.deck[randomNumber]
            p.hand.push(card);
            this.deck.splice(randomNumber,1);
            i += 1;
        }
    }
  },
  turnEnd(){
    while(true){
      let now = this.turnPlayer
      if(this.players.indexOf(this.turnPlayer) === this.players.length-1){
        this.turnPlayer = this.players[0];
      } else {
          this.turnPlayer = this.players[this.players.indexOf(this.turnPlayer)+1];
      }
      if(this.turnPlayer.hand.length !== 0){
        break
      }else if(this.turnPlayer === now && now.hand.length === 0){
        return
      }
    }
    this.turn += 1
    display.turnPlayer()
    display.allHands()
    display.field()
  },
  takeOver(player){
    this.players[player.number].socketID = player.socketID
  },
  initialize(){
    this.players.length = 0;
    this.refresh()
    this.phase = 'nameinputting'
  },
}



















const display = {
  hideItems(){
    io.emit('hideItems', game);
  },
  hideMyItems(socketID){
    let nop = game.players.length
    io.to(socketID).emit('hidemyitems', nop)
  },
  name(){
    io.emit('name', game);
  },
  allHands(){
    io.emit('allHands', game);
  },
  myHand(player){
    io.emit('myHand', player)
  },
  field(){
      io.emit('field', game)
  },
  nextButtonHIde(){
      let a = ''
      io.emit('nextButtonHide', a)
  },
  matchResult(){
      let data = {championname:game.champion.name, players:game.copyOfPlayers()}
      io.emit('matchResult', data)
  },
  hideResult(){
    let a = ''
    io.emit('hideResult', a)
  },
  backgroundAllDelete(){
    let a = ''
    io.emit('backgroundAllDelete', a)
  },
  backgroundDelete(card){
    io.emit('backgroundDelete', card)
  },
  handRed(player){
    io.emit('handRed', player)
  },
  handClear(){
    let player = game.turnPlayer
    io.emit('handClear', player)
  },
  boxRed(boxNumber){
    io.emit('boxRed', boxNumber)
  },
  boxDelete(){
    let e = ''
    io.emit('boxDelete', e);
  },
  initialize(){
    let maxPlayer = game.maxPlayer
    io.emit('yesbuttonclick',maxPlayer)
  },
  turnPlayer(){
    let tn = game.turnPlayer.number
    io.emit('turnplayer', tn)
  },
  turnPlayerDelete(){
    let e = ''
    io.emit('tunplayerdelete', e)
  },
  takeOver(player){
    io.emit('takeoverbuttonclick', player)
  },
  toggleTakeOver(){
    let e = ''
    io.emit('toggletakeoverbutton',e)
  },
  showStart(n){
    io.emit('showstart', n)
  },
  playerSort(){
    let players = game.players
    io.emit('playersort', players)
  },
  log(a){
    io.emit('log', a)
  },
}
function discard(item,list){
  if(list.includes(item)){
      let i = list.indexOf(item);
      list.splice(i, 1);
  }
}

io.on("connection", (socket)=>{

  //画面の表示
  if(game.phase === 'nameinputting'){
    io.to(socket.id).emit("nameDisplay", (playersName));
  }else{
    display.name();
    display.allHands();
    display.hideItems();
    display.field()
    display.turnPlayer();
  }
  
  //名前の入力
  socket.on("nameInput", (namedata)=>{
    if(!game.arrayHasID(playersName, socket.id)){
      playersName[namedata.number] = {name:namedata.name, socketID:namedata.socketID};
      io.emit("nameInput", namedata);     
    }
  });

  //スタートボタンクリック
  socket.on('start', (e)=>{
    let i = 1
    while(i <= maxPlayer){
        discard('', playersName);
        i += 1;
    };
    if(playersName.length >= 1){
      game.gameStart()
    };
  });

  //手札を選択
  socket.on('handclick', (data)=>{
    if(data.socketID === game.turnPlayer.socketID){
      game.turnPlayer.playingCard = data.cardNumber
      let player = game.turnPlayer
      display.handRed(player)
      player.play()
    }
  });

  //箱を選択
  socket.on('boxclick', (data)=>{
    if(data.socketID === game.turnPlayer.socketID){
      let boxNumber = data.boxNumber
      game.turnPlayer.targetBox = game.boxes[boxNumber - 1]
      display.boxRed(boxNumber)
      game.turnPlayer.play()
    }
  })


  //開始に同意する
  socket.on('startbuttonclick', (data)=>{
    let n = data.number
    let p = game.players[n]
    p.startOK();
    io.emit('startbuttonclick', n)
  })

  //カードを場に出す
  socket.on('playbuttonclick', (player)=>{
    let n = player.number
    let p = game.players[n]
    p.playCards();
  })
  
  //もう一度遊ぶ
  socket.on('newgamebuttonclick', (e)=>{
    game.newGame();
  })

  //初期化
  
  socket.on('yesbuttonclick', (e)=>{
    display.initialize()
    game.initialize()
  })

  //継承
  socket.on('takeoverbuttonclick', (player)=>{
    game.takeOver(player)
    display.takeOver(player)
    display.playerSort()
    display.name();
    display.allHands();
    display.hideItems();
    display.field()
    display.turnPlayer();
  })

  //ターン終了
  socket.on('endbuttonclick', (player)=>{
    let n = player.number
    let p = game.players[n]
    if(p === game.turnPlayer){
      if(game.deck.length !== 0){
        if(p.toDraw >= 2 || p.hand.length === 0){
          p.turnEnd()
        }
      }else{
        if(p.toDraw >= 1 || p.hand.length === 0){
          p.turnEnd()
        }
      }
    }
  })





  //コンソールに表示
  socket.on('console',(e)=>{
    socket.emit('console', game)
  })
})
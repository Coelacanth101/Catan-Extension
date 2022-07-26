//サーバー用変数
const app  = require("express")();
const http = require("http").createServer(app);
const io   = require("socket.io")(http);
const DOCUMENT_ROOT = __dirname + "/static";
app.get("/", (req, res)=>{
  res.sendFile(DOCUMENT_ROOT + "/Catan.html");
});

app.get("/search_games", (req, res)=>{
  returnAllgames(res)
});

app.get("/statistics", (req, res)=>{
  returnStatictics(res)
});

app.get("/:file", (req, res)=>{
  res.sendFile(DOCUMENT_ROOT + "/" + req.params.file);
});
app.get("/img/:file", (req, res)=>{
  res.sendFile(DOCUMENT_ROOT + "/img/" + req.params.file);
});
app.get("/sound/:file", (req, res)=>{
  res.sendFile(DOCUMENT_ROOT + "/sound/" + req.params.file);
});

/**
 * 3000番でサーバを起動する
 */
http.listen(process.env.PORT || 3000, ()=>{
  console.log("listening on *:3000");
});



require('dotenv').config();
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
client.connect()
/*------------------------------------------
------------------------------------------*/

const maxPlayer = 6
const properPlayer = 6
let playersName = []
const buildResource = {house:{ore:0,grain:1,wool:1,lumber:1,brick:1}, city:{ore:3,grain:2,wool:0,lumber:0,brick:0}, progress:{ore:1,grain:1,wool:1,lumber:0,brick:0}, road:{ore:0,grain:0,wool:0,lumber:1,brick:1}}
let progress = {knight:20, roadbuild:3, harvest:3, monopoly:3, point:5}
let gameRecord = []
let trashRecord = []
const victoryPoint = 10
const longestRoad = 5
const largestArmy = 3
const burst = 8


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
    this.progress = {knight:0, roadbuild:0, harvest:0, monopoly:0, point:0}
    this.thisTurnDraw = {knight:0, roadbuild:0, harvest:0, monopoly:0, point:0}
    this.used = {knight:0, roadbuild:0, harvest:0, monopoly:0, point:0}
    this.largestArmy = 0
    this.longestRoad = 0
    this.longestLength = 0
    this.point = 0
    this.progressUse = 0
    this.dice = 1
    this.toTrash = 0
    this.tradeRate = {ore:4,grain:4,wool:4,lumber:4,brick:4}
    this.renounce = false
    this.trashpool = {ore:0,grain:0,wool:0,lumber:0,brick:0}
    this.replay = false
    this.produce = {ore:0,grain:0,wool:0,lumber:0,brick:0}
    this.robbed = {ore:0,grain:0,wool:0,lumber:0,brick:0}
    this.totalTrash = {ore:0,grain:0,wool:0,lumber:0,brick:0}
    this.totalUse = {ore:0,grain:0,wool:0,lumber:0,brick:0}
    this.lastPoint = ''
    this.initial_productivity = {ore:0,grain:0,wool:0,lumber:0,brick:0}
    this.negotiate = 0
    this.seven = 0
    this.harvestArray = []
    this.log = {resource:{ore:0,grain:0,wool:0,lumber:0,brick:0},
    token:{house:5, city:4, road:15},
    house:[],
    city:[],
    road:[],
    progress:{knight:0, roadbuild:0, harvest:0, monopoly:0, point:0},
    used:{knight:0, roadbuild:0, harvest:0, monopoly:0, point:0},
    largestArmy:0,
    longestRoad:0,
    longestLength:0,
    point:0,
    progressUse:0,
    dice:1,
    toTrash:0,
    tradeRate:{ore:4,grain:4,wool:4,lumber:4,brick:4},
    renounce:false,
    trashpool:{ore:0,grain:0,wool:0,lumber:0,brick:0},
    totalTrash:{ore:0,grain:0,wool:0,lumber:0,brick:0},
    totalUse:{ore:0,grain:0,wool:0,lumber:0,brick:0},
    lastPoint:'',
    harvestArray:[]}
    const q = "select * from player where name = '" + this.name + "'";
    client
      .query(q)
      .then((res) => {
        if(res.rows[0]){
          this.rating = res.rows[0].rating
        }else{
          const newPlayer = "insert into player (name, win3, lose3, win4, lose4, win5, lose5, win6, lose6, rating, activestreakwins, beststreakwins, bestrating) values('" + this.name + "', 0, 0, 0, 0, 0, 0, 0, 0, 1500, 0, 0, 1500)";
          client.query(newPlayer)
          .then((res) => {
          })
          .catch((e) => {
          });
          this.rating = 1500
        }
        /*let data = {rating:this.rating, number:this.number, name:this.name}
        io.emit('rating', data)*/
      })
      .catch((e) => {
      });
  };
  reset(){
    this.resource = {ore:0,grain:0,wool:0,lumber:0,brick:0}
    this.token = {house:5, city:4, road:15}
    this.house = []
    this.city = []
    this.road = []
    this.progress = {knight:0, roadbuild:0, harvest:0, monopoly:0, point:0}
    this.thisTurnDraw = {knight:0, roadbuild:0, harvest:0, monopoly:0, point:0}
    this.used = {knight:0, roadbuild:0, harvest:0, monopoly:0, point:0}
    this.largestArmy = 0
    this.longestRoad = 0
    this.longestLength = 0
    this.point = 0
    this.progressUse = 0
    this.dice = 1
    this.toTrash = 0
    this.tradeRate = {ore:4,grain:4,wool:4,lumber:4,brick:4}
    this.renounce = false
    this.trashpool = {ore:0,grain:0,wool:0,lumber:0,brick:0}
    this.replay = false
    this.produce = {ore:0,grain:0,wool:0,lumber:0,brick:0}
    this.robbed = {ore:0,grain:0,wool:0,lumber:0,brick:0}
    this.totalTrash = {ore:0,grain:0,wool:0,lumber:0,brick:0}
    this.totalUse = {ore:0,grain:0,wool:0,lumber:0,brick:0}
    this.lastPoint = ''
    this.initial_productivity = {ore:0,grain:0,wool:0,lumber:0,brick:0}
    this.negotiate = 0
    this.seven = 0
    this.harvestArray = []
    this.log = {resource:{ore:0,grain:0,wool:0,lumber:0,brick:0},
    token:{house:5, city:4, road:15},
    house:[],
    city:[],
    road:[],
    progress:{knight:0, roadbuild:0, harvest:0, monopoly:0, point:0},
    used:{knight:0, roadbuild:0, harvest:0, monopoly:0, point:0},
    largestArmy:0,
    longestRoad:0,
    longestLength:0,
    point:0,
    progressUse:0,
    dice:1,
    toTrash:0,
    tradeRate:{ore:4,grain:4,wool:4,lumber:4,brick:4},
    renounce:false,
    trashpool:{ore:0,grain:0,wool:0,lumber:0,brick:0},
    totalTrash:{ore:0,grain:0,wool:0,lumber:0,brick:0},
    totalUse:{ore:0,grain:0,wool:0,lumber:0,brick:0},
    lastPoint:'',
    harvestArray:[]}
    const q = "select * from player where name = '" + this.name + "'";
    client
      .query(q)
      .then((res) => {
        if(res.rows[0]){
          this.rating = res.rows[0].rating
        }else{
          const newPlayer = "insert into player (name, win3, lose3, win4, lose4, win5, lose5, win6, lose6, rating, activestreakwins, beststreakwins) values('" + this.name + "', 0, 0, 0, 0, 0, 0, 0, 0, 1500, 0, 0)";
          client.query(newPlayer)
          .then((res) => {
          })
          .catch((e) => {
          });
          this.rating = 1500
        }
        /*let data = {rating:this.rating, number:this.number, name:this.name}
        io.emit('rating', data)*/
      })
      .catch((e) => {
      });
  };
  recordLog(){
    for(let resource in this.resource){
      this.log.resource[resource] = this.resource[resource]
      this.log.tradeRate[resource] = this.tradeRate[resource]
      this.log.trashpool[resource] = this.trashpool[resource]
      this.log.totalTrash[resource] = this.totalTrash[resource]
      this.log.totalUse[resource] = this.totalUse[resource]
    }
    for(let token in this.token){
      this.log.token[token] = this.token[token]
    }
    this.log.house = []
    for(let house of this.house){
      this.log.house.push(house)
    }
    this.log.city = []
    for(let city of this.city){
      this.log.city.push(city)
    }
    this.log.road = []
    for(let road of this.road){
      this.log.road.push(road)
    }
    for(let card in this.progress){
      this.log.progress[card] = this.progress[card]
      this.log.used[card] = this.used[card]
    }
    this.harvestArray = []
    for(let resource of this.harvestArray){
      this.log.harvestArray.push(resource)
    }
    this.log.largestArmy = this.largestArmy
    this.log.longestRoad = this.longestRoad
    this.log.longestLength = this.longestLength
    this.log.point = this.point
    this.log.progressUse = this.progressUse
    this.log.dice = this.dice
    this.log.toTrash = this.toTrash
    this.log.renounce = this.renounce
    this.log.lastPoint = this.lastPoint
  };
  unDo(){
    for(let resource in this.log.resource){
      this.resource[resource] = this.log.resource[resource]
      this.tradeRate[resource] = this.log.tradeRate[resource]
      this.trashpool[resource] = this.log.trashpool[resource]
      this.totalTrash[resource] = this.log.totalTrash[resource]
      this.totalUse[resource] = this.log.totalUse[resource]
    }
    for(let token in this.log.token){
      this.token[token] = this.log.token[token]
    }
    this.house = []
    for(let house of this.log.house){
      this.house.push(house)
    }
    this.city = []
    for(let city of this.log.city){
      this.city.push(city)
    }
    this.road = []
    for(let road of this.log.road){
      this.road.push(road)
    }
    for(let card in this.log.progress){
      this.progress[card] = this.log.progress[card]
      this.used[card] = this.log.used[card]
    }
    this.harvestArray = []
    for(let resource of this.log.harvestArray){
      this.harvestArray.push(resource)
    }
    this.largestArmy = this.log.largestArmy
    this.longestRoad = this.log.longestRoad
    this.longestLength = this.log.longestLength
    this.point = this.log.point
    this.progressUse = this.log.progressUse
    this.dice = this.log.dice
    this.toTrash = this.log.toTrash
    this.renounce = this.log.renounce
    this.lastPoint = this.log.lastPoint
    display.reloadRate(this.socketID)
  }
  build(item, position){
    if(item === 'house'){
      //初期配置
      if(game.phase === 'setup' && this.house.length === this.road.length){
        //既に家がないか,周りに家がないか確認
        if(board.nodeCondition(position) !== 'blank'){
          display.hideReceivingArea()
        }//問題なければ建設
        else{
          display.addHouse({nodeNumber: board.nodePositionToNumber(position), ownerNumber:this.number})
          recordLog()
          game.lastActionPlayer = this
          this.token.house -= 1
          this.house.push({position:position, nodeNumber: board.nodePositionToNumber(position)})
          this.lastPoint = 'house'
          board.house.push({type:'house', position:position, nodeNumber: board.nodePositionToNumber(position), owner:this})
          let tiles = board.tilesAroundNode(position)
          for(let tileposition of tiles){
            let tile = board.island[tileposition[0]][tileposition[1]]
            tile.houseOwner.push(this)
          }
          //二軒目なら資源獲得
          if(this.house.length === 2){
            let tiles = board.tilesAroundNode(position)
            for(let tileposition of tiles){
              let tile = board.island[tileposition[0]][tileposition[1]]
              if(tile.produce){
                this.resource[tile.type] += 1
                game.allResource[tile.type] -= 1
              }
            }
          }
          this.constructPort(position)
          board.longestCheck()
          game.pointReload()
          display.tokenOf(this)
          display.resourceOf(this)
          const logdata = {action:'build', playername:game.turnPlayer.name, playernumber:game.turnPlayer.number, builditem:'house', turnPlayerID:game.turnPlayer.socketID}
          display.message(logdata)
          display.playLog(logdata)
          takeRecord(logdata)
        }
      }else if(game.phase === 'afterdice'|| game.phase === 'building'){
        //既に家がないか確認
        if(board.nodeCheck(position) !== 'blank'){
          display.hideReceivingArea()
        }
        //資源の確認
        else if(!this.resourceCheck(item)){
          display.hideReceivingArea()
        }
        //周りに家がないか確認
        else if(board.aroundNodesCheck(position) !== 'blank'){
          display.hideReceivingArea()
        }
        //道がつながっているか確認
        else if(!this.IhaveRoadAroundNode(position)){
          display.hideReceivingArea()
        }
        //手元に家があるか確認
        else if(this.token[item] === 0){
          display.hideReceivingArea()
        }
        //問題なければ建設
        else{
          display.addHouse({nodeNumber: board.nodePositionToNumber(position), ownerNumber:this.number})
          recordLog()
          game.lastActionPlayer = this
          this.token.house -= 1
          this.house.push({position:position, nodeNumber: board.nodePositionToNumber(position)})
          this.lastPoint = 'house'
          board.house.push({type:'house', position:position, nodeNumber: board.nodePositionToNumber(position), owner:this})
          let tiles = board.tilesAroundNode(position)
          this.useResource(item)
          for(let tileposition of tiles){
            let tile = board.island[tileposition[0]][tileposition[1]]
            tile.houseOwner.push(this)
          }
          this.constructPort(position)
          board.longestCheck()
          game.pointReload()
          display.tokenOf(this)
          const logdata = {action:'build', playername:game.turnPlayer.name, playernumber:game.turnPlayer.number, builditem:'house', turnPlayerID:game.turnPlayer.socketID}
          display.message(logdata)
          display.playLog(logdata)
          takeRecord(logdata)
        }
      }else{
        display.hideReceivingArea()
      }
    }else if(item === 'city'){
      if(game.phase === 'afterdice'|| game.phase === 'building'){
        //自分の家があるか確認
        if(board.nodeCondition(position).type !== 'house' || board.nodeCondition(position).owner !== this){
          display.hideReceivingArea()
        }
        //資源の確認
        else if(!this.resourceCheck(item)){
          display.hideReceivingArea()
        }
        //手元に都市があるか確認
        else if(this.token[item] === 0){
          display.hideReceivingArea()
        }
        //問題なければ建設
        else{
          display.addCity({nodeNumber: board.nodePositionToNumber(position), ownerNumber:this.number})
          recordLog()
          game.lastActionPlayer = this
          this.token.city -= 1
          this.token.house += 1
          this.city.push({position:position, nodeNumber: board.nodePositionToNumber(position)})
          this.lastPoint = 'city'
          board.city.push({type:'city', position:position, nodeNumber: board.nodePositionToNumber(position), owner:this})
          let tiles = board.tilesAroundNode(position)
          this.useResource(item)
          for(let tileposition of tiles){
            let tile = board.island[tileposition[0]][tileposition[1]]
            tile.cityOwner.push(this)
            discard(this, tile.houseOwner)
          }
          let house = positionToObject(position, this.house)
          discard(house, this.house)
          house = positionToObject(position, board.house)
          discard(house, board.house)
          board.longestCheck()
          game.pointReload()
          display.tokenOf(this)
          const logdata = {action:'build', playername:game.turnPlayer.name, playernumber:game.turnPlayer.number, builditem:'city', turnPlayerID:game.turnPlayer.socketID}
          display.message(logdata)
          display.playLog(logdata)
          takeRecord(logdata)
        }
      }else{
        display.hideReceivingArea()
      }
    }else if(item === 'road'){
      if(game.phase === 'setup' && this.house.length === this.road.length+1){
        //既に道がないか確認
        if(board.roadCheck(position) !== 'blank'){
          display.hideReceivingArea()
        }//どちらかの端に今建てた家があるか確認
        else if(!this.justNowHouse(position)){
          display.hideReceivingArea()
        }
        //問題なければ建設
        else{
          display.addRoad({roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position), ownerNumber:this.number})
          recordLog()
          game.lastActionPlayer = this
          this.token.road -= 1
          this.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position)})
          board.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position), owner:this})
          board.longestCheck()
          game.pointReload()
          display.tokenOf(this)
          const logdata = {action:'build', playername:game.turnPlayer.name, playernumber:game.turnPlayer.number, builditem:'road', turnPlayerID:game.turnPlayer.socketID}
          display.message(logdata)
          display.playLog(logdata)
          takeRecord(logdata)
          game.turnEndSetup()
          display.relativeNodes()
        }
      }else if(game.phase === 'afterdice'|| game.phase === 'building'){
        //既に道がないか確認
        if(board.roadCheck(position) !== 'blank'){
          display.hideReceivingArea()
        }
        //周りに自分の道があるか確認
        else if(!this.IhaveRoadAroundRoad(position)){
          display.hideReceivingArea()
        }
        //資源の確認
        else if(!this.resourceCheck(item)){
          display.hideReceivingArea()
        }//手元に道があるか確認
        else if(this.token[item] === 0){
          display.hideReceivingArea()
        }
        //問題なければ建設
        else{
          display.addRoad({roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position), ownerNumber:this.number})
          recordLog()
          game.lastActionPlayer = this
          this.token.road -= 1
          this.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position)})
          board.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position), owner:this})
          this.useResource(item)
          board.longestCheck()
          game.pointReload()
          display.tokenOf(this)
          const logdata = {action:'build', playername:game.turnPlayer.name, playernumber:game.turnPlayer.number, builditem:'road', turnPlayerID:game.turnPlayer.socketID}
          display.message(logdata)
          display.playLog(logdata)
          takeRecord(logdata)
        }
      }else if(game.phase === 'roadbuild1'){
        //既に道がないか確認
        if(board.roadCheck(position) !== 'blank'){
          display.hideReceivingArea()
        }
        //周りに自分の道があるか確認
        else if(!this.IhaveRoadAroundRoad(position)){
          display.hideReceivingArea()
        }
        //手元に道があるか確認
        else if(this.token[item] === 0){
          display.hideReceivingArea()
        }
        //問題なければ建設
        else{
          display.addRoad({roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position), ownerNumber:this.number})
          recordLog()
          game.lastActionPlayer = this
          this.token.road -= 1
          this.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position)})
          board.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position), owner:this})
          board.longestCheck()
          game.pointReload()
          display.tokenOf(this)
          const logdata = {action:'build', playername:game.turnPlayer.name, playernumber:game.turnPlayer.number, builditem:'road', turnPlayerID:game.turnPlayer.socketID}
          display.message(logdata)
          display.playLog(logdata)
          takeRecord(logdata)
          if(this.token.road >= 1){
            game.phase = 'roadbuild2'
          }else{
            game.phase = 'afterdice'
          }
          display.toggleMyButtons(game.turnPlayer.socketID)
        }
      }else if(game.phase === 'roadbuild2'){
        //既に道がないか確認
        if(board.roadCheck(position) !== 'blank'){
          display.hideReceivingArea()
        }
        //周りに自分の道があるか確認
        else if(!this.IhaveRoadAroundRoad(position)){
          display.hideReceivingArea()
        }
        //手元に道があるか確認
        else if(this.token[item] === 0){
          display.hideReceivingArea()
        }
        //問題なければ建設
        else{
          display.addRoad({roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position), ownerNumber:this.number})
          recordLog()
          game.lastActionPlayer = this
          this.token.road -= 1
          this.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position)})
          board.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position), owner:this})
          board.longestCheck()
          game.pointReload()
          display.tokenOf(this)
          game.phase = 'afterdice'
          display.toggleMyButtons(game.turnPlayer.socketID)
          const logdata = {action:'build', playername:game.turnPlayer.name, playernumber:game.turnPlayer.number, builditem:'road', turnPlayerID:game.turnPlayer.socketID}
          display.message(logdata)
          display.playLog(logdata)
          takeRecord(logdata)
        }
      }else{
        display.hideReceivingArea()
      }
    }else{
      display.hideReceivingArea()
    }
  };
  draw(){
    if(game.phase === 'afterdice'|| game.phase === 'building'){
      if(game.progressDeck.length === 0){
        display.hideReceivingArea()
      }else if(!this.resourceCheck('progress')){
        display.hideReceivingArea()
      }else{
        this.useResource('progress')
        this.progress[game.progressDeck[0]] += 1
        let card = game.progressDeck[0]
        if(game.progressDeck[0] === 'point'){
          this.lastPoint = 'point'
        }
        this.thisTurnDraw[game.progressDeck[0]] += 1
        game.progressDeck.splice(0, 1)
        display.deck()
        game.pointReload()
        display.progressOf(this)
        recordLog()
        game.lastActionPlayer = this
        const logdata = {action:'draw', playername:game.turnPlayer.name, turnPlayerID:game.turnPlayer.socketID, progress:''}
        display.message(logdata)
        display.playLog(logdata)
        logdata.progress = card
        takeRecordUndeletable(logdata)
      }
    }else{
      display.hideReceivingArea()
    }
  };
  knightuse(){
    if(game.phase !== 'beforedice' && game.phase !== 'afterdice'){
      display.hideReceivingArea()
    }else if(this.progress.knight - this.thisTurnDraw.knight <= 0){
      display.hideReceivingArea()
    }else if(this.progressUse >= 1){
      display.hideReceivingArea()
    }else{
      recordLog()
      game.lastActionPlayer = this
      game.phase = 'thiefmove'
      this.progressUse += 1
      this.progress.knight -= 1
      this.used.knight += 1
      this.largestArmyCheck()
      game.pointReload()
      display.progressOf(this)
      display.addUsed('knight')
      display.toggleMyButtons(game.turnPlayer.socketID)
      display.thiefRed()
      const logdata = {action:'progress', playername:game.turnPlayer.name, progress:'knight', turnPlayerID:game.turnPlayer.socketID}
      display.message(logdata)
      display.playLog(logdata)
    }
  };
  thiefmove(position){
    if(game.phase !== 'thiefmove'){
      display.hideReceivingArea()
    }else if(arrayComparison(position, board.thief.position)){
      display.hideReceivingArea()
    }else{
      recordLog()
      game.lastActionPlayer = this
      board.thief = board.island[position[0]][position[1]]
      let targetplayer =[]
      for(let owner of board.thief.houseOwner){
        if(owner !== this){
          if(owner.totalResource() !== 0){
            targetplayer.push(owner)
          }
        }
      }
      for(let owner of board.thief.cityOwner){
        if(owner !== this){
          if(owner.totalResource() !== 0){
            targetplayer.push(owner)
          }
        }
      }
      if(targetplayer.length !== 0){
        game.phase = 'robresource'
      }else if(this.dice === 1){
        game.phase = 'beforedice'
        display.diceBlack()
        display.toggleMyButtons(this.socketID)
      }else{
        game.phase = 'afterdice'
        display.diceBlack()
        display.toggleMyButtons(this.socketID)
      }
      display.deleteThief()
      display.thief()
      const logdata = {action:'thiefmove', playername:game.turnPlayer.name, turnPlayerID:game.turnPlayer.socketID}
      display.message(logdata)
      display.playLog(logdata)
      takeRecord(logdata)
    }
  };
  robResource(position){
    let target = board.nodeCondition(position).owner
    if(target === this){
      display.hideReceivingArea()
    }else if(target.totalResource() === 0){
      display.hideReceivingArea()
    }else{
      let random = Math.floor(Math.random()*target.totalResource())
      let arr =[]
      for(let key in target.resource){
        let i = 1
        while(i <= target.resource[key]){
          arr.push(key)
          i += 1
        }
      }
      let rob = arr[random]
      this.resource[rob] += 1
      target.resource[rob] -= 1
      target.robbed[rob] += 1
      display.resourceOf(this)
      display.resourceOf(target)
      if(this.dice === 1){
        game.phase = 'beforedice'
      }else{
        game.phase = 'afterdice'
      }
      display.diceBlack()
      display.toggleMyButtons(game.turnPlayer.socketID)
      recordLog()
      game.lastActionPlayer = this
      const logdata = {action:'robresource', playername:game.turnPlayer.name, robbed:target.name, turnPlayerID:game.turnPlayer.socketID, resource:''}
      display.message(logdata)
      display.playLog(logdata)
      logdata.resource = rob
      takeRecordUndeletable(logdata)
    }
    
  };
  monopoly(resource){
    if(game.phase !== 'monopoly'){
      display.hideReceivingArea()
    }else if(this.progress.monopoly - this.thisTurnDraw.monopoly <= 0){
      display.hideReceivingArea()
    }else if(this.progressUse >= 1){
      display.hideReceivingArea()
    }else{
      this.progressUse += 1
      this.progress.monopoly -= 1
      this.used.monopoly += 1
      let amount = 0
      for(let player of game.players){
        if(player !== this){
          this.resource[resource] += player.resource[resource]
          amount += player.resource[resource]
          player.resource[resource] = 0
        }
      }
      game.phase = 'afterdice'
      recordLog()
      game.lastActionPlayer = this
      display.hideMyMonopolyArea(this.socketID)
      for(let player of game.players){
        display.resourceOf(player)
      }
      display.progressOf(this)
      display.addUsed('monopoly')
      const logdata = {action:'monopoly', playername:game.turnPlayer.name, resource:resource, turnPlayerID:game.turnPlayer.socketID, amount:amount}
      display.message(logdata)
      display.playLog(logdata)
      takeRecordUndeletable(logdata)
    }
  };
  harvest(resource){
    if(game.phase !== 'harvest1' && game.phase !== 'harvest2'){
      display.hideReceivingArea()
    }else if(game.phase === 'harvest1'){
      if(this.progress.harvest - this.thisTurnDraw.harvest <= 0){
        display.hideReceivingArea()
      }else if(this.progressUse >= 1){
        display.hideReceivingArea()
      }else if(game.allResource[resource] <= 0){
        display.hideReceivingArea()
      }else{
        recordLog()
        game.lastActionPlayer = this
        this.progressUse += 1
        this.progress.harvest -= 1
        this.used.harvest += 1
        this.resource[resource] += 1
        game.allResource[resource] -= 1
        this.harvestArray.push(resource)
        game.phase = 'harvest2'
        display.resourceOf(this)
        display.progressOf(this)
        display.addUsed('harvest')
      }
    }else if(game.phase === 'harvest2'){
      if(game.allResource[resource] <= 0){
        display.hideReceivingArea()
      }else{
        this.resource[resource] += 1
        game.allResource[resource] -= 1
        this.harvestArray.push(resource)
        game.phase = 'afterdice'
        display.hideMyHarvestArea(this.socketID)
        display.resourceOf(this)
        const logdata = {action:'harvest', playername:game.turnPlayer.name, resource:this.harvestArray, turnPlayerID:game.turnPlayer.socketID}
        display.message(logdata)
        display.playLog(logdata)
        takeRecord(logdata)
      }
    }else{
      display.hideReceivingArea()
    }
  }
  roadBuild(){
    if(game.phase !== 'afterdice'){
      display.hideReceivingArea()
    }else if(this.progress.roadbuild - this.thisTurnDraw.roadbuild <= 0){
      display.hideReceivingArea()
    }else if(this.progressUse >= 1){
      display.hideReceivingArea()
    }else{
      recordLog()
      game.lastActionPlayer = this
      this.progressUse += 1
      this.progress.roadbuild -= 1
      this.used.roadbuild += 1
      if(this.token.road >= 1){
        game.phase = 'roadbuild1'
      }
      display.progressOf(this)
      display.addUsed('roadbuild')
      display.toggleMyButtons(game.turnPlayer.socketID)
      const logdata = {action:'progress', playername:game.turnPlayer.name, progress:'roadbuild', turnPlayerID:game.turnPlayer.socketID}
      display.message(logdata)
      display.playLog(logdata)
    }
  }
  turnEnd(){
    recordLog()
    game.lastActionPlayer = this
    this.progressUse = 0
    this.dice = 1
    this.thisTurnDraw = {knight:0, roadbuild:0, harvest:0, monopoly:0, point:0}
    game.turnEnd()
  }
  keep(keepresource){
    display.resetKeepResourceTo(this.socketID)
    if(!game.burstPlayer.includes(this)){
      display.hideReceivingArea()
    }else if(total(keepresource) === total(this.resource) - this.toTrash){
      let check = true
      for(let resource in keepresource){
        if(this.resource[resource] < keepresource[resource]){
          check = false
        }
      }
      if(check){
        let trashresource = {ore:0,grain:0,wool:0,lumber:0,brick:0}
        for(let resource in keepresource){
          trashresource[resource] = this.resource[resource] - keepresource[resource]
          game.allResource[resource] += trashresource[resource]
          this.totalTrash[resource] += trashresource[resource]
        }
        this.resource = keepresource
        this.toTrash = 0
        discard(this, game.burstPlayer)
        let trashData = {name:this.name, socketID:this.socketID, trashresource:trashresource}
        for(let data of trashRecord){
          if(data.socketID === this.socketID){
            discard(data, trashRecord)
          }
        }
        trashRecord.push(trashData)
        if(game.burstPlayer.length === 0){
          game.phase = 'thiefmove'
          const logdata = {action:'trash', trashRecord:trashRecord}
          display.message(logdata)
          display.playLog(logdata)
          takeRecordUndeletable(logdata)
          trashRecord = []
          recordLog()
          display.hideBurstArea()
          display.thiefRed()
        }else{
          display.showBurstArea()
        }
      }else{
        let keepremained = total(this.resource) - this.toTrash
        io.to(this.socketID).emit('keepremained',(keepremained))
      }
    }else{
      let keepremained = total(this.resource) - this.toTrash
      io.to(this.socketID).emit('keepremained',(keepremained))
    }
    display.resourceOf(this)
  }
  myLongest(){
    //道に接した点を一つ選択
    let longest = 0
    for(let startRoad of this.road){
      let nodes = board.sidesOfRoad(startRoad.position)
      for(let startNode of nodes){
        let count = 0
        let countedRoad = []
        let returnedRoad = []
        let currentNode = board.otherSideOfRoad(startNode, startRoad.position)
        countedRoad.push(startRoad)
        count += 1
        let lastRoad = startRoad
        while(true){
          let adjacentRoad = []
          if(board.nodeCondition(currentNode) !== 'blank' && board.nodeCondition(currentNode) !== 'adjacent' && board.nodeCondition(currentNode).owner !== this){
            adjacentRoad.push(lastRoad)
          }else{
            adjacentRoad = this.myRoadsAroundNode(currentNode)
          }
          let unpassedRoad = copyOfArray(adjacentRoad)
          for(let road of countedRoad){
            discard(road, unpassedRoad)
          }
          let unreturnedRoad = copyOfArray(adjacentRoad)
          for(let road of returnedRoad){
            discard(road, unreturnedRoad)
          }
          for(let road of unreturnedRoad){
            if(!countedRoad.includes(road)){
              discard(road, unreturnedRoad)
            }
          }
          if(unpassedRoad.length !== 0){
            currentNode = board.otherSideOfRoad(currentNode, unpassedRoad[0].position)
            countedRoad.push(unpassedRoad[0])
            count += 1
            lastRoad = unpassedRoad[0]
            continue
          }else if(unreturnedRoad.length !== 0){
            if(count > longest){
              longest = count
            }
            currentNode = board.otherSideOfRoad(currentNode, unreturnedRoad[0].position)
            returnedRoad.push(unreturnedRoad[0])
            count -= 1
            continue
          }else{
            break
          }
        }
      }
    }
    return longest
  };


  //道の端に自分の建物があるか確認
  roadSidesCheck(roadposition){
    let nodes = board.sidesOfRoad(roadposition)
    for(let node of nodes){
      if(IhaveTokenThere(node, this.house)){
        return true
      }else if(IhaveTokenThere(node, this.city)){
        return true
      }
    }
    return false
  };
  //どちらかの端に今建てた家があるか確認(初期配置用)
  justNowHouse(position){
    let nodes = board.sidesOfRoad(position)
    for(let node of nodes){
      if(arrayComparison(node,this.house[this.house.length-1].position)){
        return true
      }
    }
    return false
  };
  //nodeの周りの自分の道
  myRoadsAroundNode(nodeposition){
    let myRoads =[]
    let roadpositions = board.roadsArounNode(nodeposition)
    for(let roadposition of roadpositions){
      for(let road of this.road){
        if(arrayComparison(roadposition, road.position)){
          myRoads.push(road)
        }
      }
    }
    return myRoads
  }
  //nodeの周りに自分の道が存在するか確認
  IhaveRoadAroundNode(nodeposition){
    let roadpositions = board.roadsArounNode(nodeposition)
    for(let roadposition of roadpositions){
      if(IhaveTokenThere(roadposition, this.road)){
        return true
      }
    }
    return false
  };
  //道の周りにつながった自分の道があるか確認
  IhaveRoadAroundRoad(roadposition){
    let roads = board.roadsAroundRoad(roadposition)
    let connect = []
    for(let road of roads){
      let node = board.nodeBetweenRoads(roadposition, road)
      if(board.nodeCondition(node) === 'blank' || board.nodeCondition(node) === 'adjacent'){
        connect.push(road)
      }else if(board.nodeCondition(node).owner === this){
        connect.push(road)
      }
    }
    for(let r of connect){
      if(positionToObject(r, this.road)){
        return true
      }
    }
    return false
  }
  //資源が足りるか確認
  resourceCheck(item){
    for(let resource in buildResource[item]){
      if(this.resource[resource] < buildResource[item][resource]){
        return false
      }
    }
    return true
  };
  //資源を使う
  useResource(item){
    for(let resource in buildResource[item]){
      this.resource[resource] -= buildResource[item][resource]
      this.totalUse[resource] += buildResource[item][resource]
      game.allResource[resource] += buildResource[item][resource]
    }
    display.resourceOf(this)
  };
  //最大騎士力チェック
  largestArmyCheck(){
    if(this.used.knight >= largestArmy){
      if(game.largestArmyPlayer === ''){
        game.largestArmyPlayer = this
        this.largestArmy = 2
        this.lastPoint = 'knight'
        display.titleOf(this)
      }else if(this.used.knight > game.largestArmyPlayer.used.knight){
        if(this.largestArmy === 0){
          this.lastPoint = 'knight'
        }
        game.largestArmyPlayer.largestArmy = 0
        display.titleOf(game.largestArmyPlayer)
        this.largestArmy = 2
        game.largestArmyPlayer = this
        display.titleOf(this)
      }
    }
  };
  trade(data){
    let ex = 0
    let im = 0
    for(let resource in data.exportresource){
      if(this.resource[resource] < data.exportresource[resource]){
        display.hideReceivingArea()
        return
      }else if(data.exportresource[resource] % this.tradeRate[resource] !== 0){
        display.hideReceivingArea()
        return
      }else if(data.importresource[resource] > game.allResource[resource]){
        display.hideReceivingArea()
        return
      }else{
        ex += data.exportresource[resource] / this.tradeRate[resource]
        im += data.importresource[resource]
      }
    }
    if(ex !== im || im === 0){
      display.hideReceivingArea()
    }else{
      recordLog()
      for(let resource in data.exportresource){
        this.resource[resource] -= data.exportresource[resource]
        game.allResource[resource] += data.exportresource[resource]
        this.resource[resource] += data.importresource[resource]
        game.allResource[resource] -= data.importresource[resource]
      }
      game.phase = 'afterdice'
      display.hideMyTradeArea(data.socketID)
      display.resourceOf(this)
      display.hideReceivingArea()
      const logdata = {action:'trade', playername:game.turnPlayer.name, exportresource:data.exportresource, importresource:data.importresource, turnPlayerID:game.turnPlayer.socketID}
      display.message(logdata)
      display.playLog(logdata)
      takeRecord(logdata)
    }
  }
  accepted(){
    let data = game.proposedata
    for(let resource in data.giveresource){
      if(data.proposer.resource[resource] < data.giveresource[resource]){
        display.hideReceivingArea()
        return
      }else if(data.proposee.resource[resource] < data.takeresource[resource]){
        display.hideReceivingArea()
        return
      }
    }
    game.phase = 'afterdice'
    for(let resource in data.giveresource){
      data.proposer.resource[resource] -= data.giveresource[resource]
      data.proposee.resource[resource] += data.giveresource[resource]
      data.proposee.resource[resource] -= data.takeresource[resource]
      data.proposer.resource[resource] += data.takeresource[resource]
    }
    const logdata = {action:'accept', playername:data.proposee.name, turnPlayerID:game.turnPlayer.socketID, proposername:data.proposer.name, giveresource:data.giveresource, takeresource:data.takeresource}
    display.message(logdata)
    display.playLog(logdata)
    takeRecordUndeletable(logdata)
    display.resourceOf(this)
    display.resourceOf(game.proposedata.proposee)
    data.proposer.negotiate += 1
    data.proposee.negotiate += 1
    game.proposedata = {proposer:'', proposee:'', giveresource:'', takeresource:''}
    display.hideProposeArea()
    display.toggleMyButtons(game.turnPlayer.socketID)
    recordLog()
    game.lastActionPlayer = this
  };
  denied(){
    game.phase = 'afterdice'
    const logdata = {action:'deny', playername:game.proposedata.proposee.name, turnPlayerID:game.turnPlayer.socketID}
    display.message(logdata)
    display.playLog(logdata)
    game.proposedata = {proposer:'', proposee:'', giveresource:'', takeresource:''}
    display.hideProposeArea()
    display.toggleMyButtons(game.turnPlayer.socketID)
  }
  totalResource(){
    return this.resource.ore + this.resource.wool + this.resource.grain + this.resource.lumber + this.resource.brick
  };
  constructPort(nodeposition){
    for(let key in board.ports){
      for(let port of board.ports[key]){
        if(arrayComparison(nodeposition, port)){
          if(key === 'oreport'){
            this.tradeRate.ore = 2
          }
          if(key === 'grainport'){
            this.tradeRate.grain = 2
          }
          if(key === 'woolport'){
            this.tradeRate.wool = 2
          }
          if(key === 'lumberport'){
            this.tradeRate.lumber = 2
          }
          if(key === 'brickport'){
            this.tradeRate.brick = 2
          }
          if(key === 'genericport'){
            for(let resource in this.tradeRate){
              if(this.tradeRate[resource] === 4){
                this.tradeRate[resource] = 3
              }
            }
          }
          display.reloadRate(this.socketID)
        }
      }
    }
  };
  renounceBuilding(){
    if(this.renounce === true){
      this.renounce = false
      discard(this,game.renounce)
    }else{
      this.renounce = true
      game.renounce.push(this)
    }
    display.renounce()
  };
  calculateMyProductivity(){
    for(let house of this.house){
      for(let resource in this.initial_productivity){
        this.initial_productivity[resource] += board.nodeAbsouluteProductivityEachResource(house.nodeNumber)[resource]
      }
    }
  }
}

const board = {size:'', island:[],numbers:[],thief:'', house:[], city:[], road:[], nodeLine:[],roadLine:[], dice:[],landLine:[],ports:{oreport:[], grainport:[], woolport:[], lumberport:[], brickport:[],genericport:[]},log:{island:[],thief:'',house:[], city:[], road:[]},islandData:'', diceCount:{2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,total:0},
  resizeBoard(size){
    if(size === 'large'){
      this.size = size
      this.island = [[],[],[],[],[],[],[],[],[]]
      this.numbers = [[],[],[],[],[],[],[],[],[]]
      this.nodeLine = [7,16,27,40,53,64,73,80]
      this.roadLine = [6,10,18,23,33,39,51,58,70,76,86,91,99,103,109]
      this.landLine = [3,7,12,18,23,27,30]
      this.log.island = [[],[],[],[],[],[],[],[],[]]
      game.allResource = {ore:25,grain:25,wool:25,lumber:25,brick:25}
    }else if(size === 'regular'){
      this.size = size
      this.island = [[],[],[],[],[],[],[]]
      this.numbers = [[],[],[],[],[],[],[]]
      this.nodeLine = [7,16,27,38,47,54]
      this.roadLine = [6,10,18,23,33,39,49,54,62,66,72]
      this.landLine = [3,7,12,16,19]
      this.log.island = [[],[],[],[],[],[],[]]
      game.allResource = {ore:19,grain:19,wool:19,lumber:19,brick:19}
    }
  },
  reset(){
    if(this.size === 'large'){
      this.island = [[],[],[],[],[],[],[],[],[]]
      this.numbers = [[],[],[],[],[],[],[],[],[]]
      this.log = {island:[[],[],[],[],[],[],[],[],[]],thief:'',house:[], city:[], road:[]}
    }else if(this.size === 'regular'){
      this.island = [[],[],[],[],[],[],[]]
      this.numbers = [[],[],[],[],[],[],[]]
      this.log = {island:[[],[],[],[],[],[],[]],thief:'',house:[], city:[], road:[]}
    }
    this.thief = ''
    this.house = []
    this.city = []
    this.road = []
    this.dice = []
    this.ports = {oreport:[], grainport:[], woolport:[], lumberport:[], brickport:[],genericport:[]}
    this.diceCount = {2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,total:0}
  },
  recordLog(){
    for(let line of this.island){
      for(let tile of line){
        let logTile = this.log.island[tile.position[0]][tile.position[1]]
        logTile.houseOwner = []
        for(let player of tile.houseOwner){
          logTile.houseOwner.push(player)
        }
        logTile.cityOwner = []
        for(let player of tile.cityOwner){
          logTile.cityOwner.push(player)
        }
      }
    }
    this.log.thief = this.thief
    this.log.house = []
    for(let house of this.house){
      this.log.house.push(house)
    }
    this.log.road = []
    for(let road of this.road){
      this.log.road.push(road)
    }
    this.log.city = []
    for(let city of this.city){
      this.log.city.push(city)
    }
  },
  unDo(){
    for(let line of this.island){
      for(let tile of line){
        for(let key in this.log.island[tile.position[0]][tile.position[1]]){
          tile[key] = this.log.island[tile.position[0]][tile.position[1]][key]
        }
      }
    }
    this.thief = this.log.thief
    this.house = []
    for(let house of this.log.house){
      this.house.push(house)
    }
    this.road = []
    for(let road of this.log.road){
      this.road.push(road)
    }
    this.city = []
    for(let city of this.log.city){
      this.city.push(city)
    }
  },
  makeIsland(data){
    let lands = []
    for(let resource in data.tileamounts){
      let i = 1
      while(i <= data.tileamounts[resource]){
        lands.push(resource)
        i += 1
      }
    }
    let i = 1
    let l = lands.length
    while(i <= this.landLine[this.landLine.length-1] - l){
      lands.push('desert')
      i += 1
    }
    let oceans
    let numberChips
    let row
    if(this.size === 'large'){
      oceans = ['woolport','woolport','oreport','brickport','lumberport','grainport','genericport','genericport','genericport','genericport','genericport','ocean','ocean','ocean','ocean','ocean','ocean','ocean','ocean','ocean','ocean','ocean']
      numberChips = [2,2,3,3,3,4,4,4,5,5,5,6,6,6,8,8,8,9,9,9,10,10,10,11,11,11,12,12]
      row = [0,5,6,7,8,7,6,5,0]
    }else if(this.size === 'regular'){
      oceans = ['woolport','oreport','brickport','lumberport','grainport','genericport','genericport','genericport','genericport','ocean','ocean','ocean','ocean','ocean','ocean','ocean','ocean','ocean']
      numberChips = [2,3,3,4,4,5,5,6,6,8,8,9,9,10,10,11,11,12]
      row = [0,5,6,7,6,5,0]
    }
    lands = shuffle(lands)
    oceans = shuffle(oceans)
    let x = 1
    while(x <= this.island.length){
      let  y = 1
      if(x === 1|| x === this.island.length){
        let i = 1
        while(i <= 4){
          let tile = {type:oceans[0],position:[x-1,y-1],houseOwner:[], cityOwner:[],produce:false, direction:0}
          let logtile = {houseOwner:[], cityOwner:[]}
          board.island[x-1].push(tile)
          board.log.island[x-1].push(logtile)
          oceans.splice(0,1)
          i += 1
          y += 1
        }
      }else{
        while(y <= row[x-1]){
          if(y === 1||y === row[x-1]){
            let tile = {type:oceans[0],position:[x-1,y-1],houseOwner:[], cityOwner:[],produce:false, direction:0}
            let logtile = {houseOwner:[], cityOwner:[]}
            board.island[x-1].push(tile)
            board.log.island[x-1].push(logtile)
            oceans.splice(0,1)            
          }else{
            if(lands[0] !== 'desert'){
              let tile = {type:lands[0],position:[x-1,y-1],houseOwner:[], cityOwner:[],produce:true, direction:0, thiefBlock:0, thiefStay:0}
              let logtile = {houseOwner:[], cityOwner:[]}
              board.island[x-1].push(tile)
              board.log.island[x-1].push(logtile)
            }else{
              let tile = {type:lands[0],position:[x-1,y-1],houseOwner:[], cityOwner:[],produce:false, direction:0}
              let logtile = {houseOwner:[], cityOwner:[]}
              board.island[x-1].push(tile)
              board.log.island[x-1].push(logtile)
              this.thief = tile
            }
            lands.splice(0,1)
          }
          y += 1
        }
      }
      x += 1
    }
    while(true){
      numberChips = shuffle(numberChips)
      let n = 1
      for(let line of this.island){
        for(let tile of line){
          if(tile.type === 'ore'|| tile.type === 'grain'|| tile.type === 'brick'|| tile.type === 'lumber'|| tile.type === 'wool'){
            tile.number = numberChips[n-1]
            n += 1
          }else{
            tile.number = 0
          }
        }
      }
      let productivityCheck = true
      let i = 1
      while(i <= this.nodeLine[this.nodeLine.length - 1]){
        if(this.nodeAbsouluteProductivity(i) > data.maxproductivity){
          productivityCheck = false
          break
        }
        i += 1
      }
      if(productivityCheck === true){
        break
      }
    }
    for(let line of this.island){
      for(let ocean of line){
        if(ocean.type === 'woolport' || ocean.type === 'oreport' || ocean.type === 'grainport' || ocean.type === 'brickport' || ocean.type === 'lumberport' || ocean.type === 'genericport'){
          let directionChoices = this.ableDirectionOfOcean(ocean)
          let portsChoices = this.portsNodeCombiOnOcean(ocean)
          let number = Math.floor(Math.random()*2)
          let direction  = directionChoices[number]
          let ports = portsChoices[number]
          ocean.direction = direction
          for(let port of ports){
            board.ports[ocean.type].push(port)
          }
        }
      }
    }
    makeNewTurnRecord()
    const logdata = {action:''}
    takeRecordUndeletable(logdata)
  },
  //node番号を座標に変換
  nodeNumberToPosition(number){
    let nodex = 1
    let nodey
    while(true){
      if(number <= this.nodeLine[nodex-1]){
        if(nodex === 1){
          nodey = number
        }else{
          nodey = number - this.nodeLine[nodex-2]
        }
        return [nodex, nodey]
      }else{
        nodex += 1
      }
    }
  },
  //座標をnode番号に変換
  nodePositionToNumber(position){
    if(position[0] === 1){
      return position[1]
    }else{
      return this.nodeLine[position[0]-2]+position[1]
    }
  },
  //nodeに何があるか判定
  nodeCheck(nodePosition){
    if(IhaveTokenThere(nodePosition, board.city)){
      return 'city'
    }else if(IhaveTokenThere(nodePosition, board.house)){
      return 'house'
    }else{
      return 'blank'
    }
  },
  //road番号を座標に変換
  roadNumberToPosition(number){
    let roadx = 1
    let roady
    while(true){
      if(number <= this.roadLine[roadx-1]){
        if(roadx === 1){
          roady = number
        }else{
          roady = number - this.roadLine[roadx-2]
        }
        return [roadx, roady]
      }else{
        roadx += 1
      }
    }
  },
  //座標をroad番号に変換
  roadPositionToNumber(position){
    if(position[0] === 1){
      return position[1]
    }else{
      return this.roadLine[position[0]-2]+position[1]
    }
  },
  //roadに何があるか判定
  roadCheck(roadPosition){
    if(IhaveTokenThere(roadPosition, board.road)){
      return 'road'
    }else{
      return 'blank'
    }
  },
  //道の角度
  roadDegree(position){
    if(position[0] % 2 === 0){
      return 'horizon'
    }else if(position[0] <= this.landLine.length){
      if((position[0]+position[1]) % 2 === 0){
        return 'right_up'
      }else{
        return 'right_down'
      }
    }else{
      if((position[0]+position[1]) % 2 === 0){
        return 'right_down'
      }else{
        return 'right_up'
      }
    }
  },
  //nodeの周りのnode
  nodesAroundNode(nodeposition){
    let nodex = nodeposition[0]
    let nodey = nodeposition[1]
    let up = [nodex, nodey - 1]
    let down = [nodex, nodey + 1]
    let side
    if(nodex <= this.nodeLine.length/2-1){
      if(nodey % 2 === 0){
        side = [nodex - 1, nodey - 1]
      }else{
        side = [nodex + 1, nodey + 1]
      }
    }else if(nodex === this.nodeLine.length/2){
      if(nodey % 2 === 0){
        side = [nodex - 1, nodey - 1]
      }else{
        side = [nodex + 1, nodey]
      }
    }else if(nodex === this.nodeLine.length/2 +1){
      if(nodey % 2 === 0){
        side = [nodex + 1, nodey - 1]
      }else{
        side = [nodex - 1, nodey]
      }
    }else{
      if(nodey % 2 === 0){
        side = [nodex + 1, nodey - 1]
      }else{
        side = [nodex - 1, nodey + 1]
      }
    }
    return [up, down, side]
  },
  //nodeの周りに建物がないかチェック
  aroundNodesCheck(nodeposition){
    let nodes = this.nodesAroundNode(nodeposition)
    let result = 'blank'
    for(let node of nodes){
      if(this.nodeCheck(node) !== 'blank'){
        result = 'notblank'
      }
    }
    return result
  },
  //roadの両端のnode
  sidesOfRoad(roadposition){
    let roadx = roadposition[0]
    let roady = roadposition[1]
    if(roadx % 2 === 1){
      return [[(roadx+1)/2, roady], [(roadx+1)/2, roady+1]]
    }else{
      if(roadx <= this.landLine.length -1){
        return [[roadx/2,roady*2-1], [roadx/2+1, roady*2]]
      }else if(roadx === this.landLine.length +1){
        return [[roadx/2,roady*2-1], [roadx/2+1, roady*2-1]]
      }else if(roadx >= this.landLine.length +3){
        return [[roadx/2, roady*2], [roadx/2+1, roady*2-1]]
      }
    }
  },
  //nodeの周りのタイル
  tilesAroundNode(nodeposition){
    let x = nodeposition[0]
    let y = nodeposition[1]
    if(x <= this.nodeLine.length /2){
      if(y % 2 === 1){
        return [[x-1,(y-1)/2],[x,(y-1)/2],[x,(y+1)/2]]
      }else{
        return [[x-1,y/2-1],[x-1,y/2],[x,y/2]]
      }
    }else{
      if(y % 2 === 1){
        return [[x-1,(y-1)/2],[x-1,(y+1)/2],[x,(y-1)/2]]
      }else{
        return [[x-1,y/2],[x,y/2-1],[x,y/2]]
      }
    }
  },
  //ダイス
  rollDice(){
    if(this.diceCount.total === 0){
      for(let player of game.players){
        player.calculateMyProductivity()
      }
    }
    let dice1 = Math.ceil(Math.random()*6);
    let dice2 = Math.ceil(Math.random()*6);
    this.dice = [dice1,dice2];
    const logdata = {action:'dice', playername:game.turnPlayer.name, turnPlayerID:game.turnPlayer.socketID,dice:this.dice}
    display.message(logdata)
    display.playLog(logdata)
    board.thief.thiefStay += 1
    game.turnPlayer.dice = 0
    if(dice1 + dice2 === 7){
      game.burstPlayerCheck()
      display.dice()
      game.turnPlayer.seven += 1
    }else{
      display.dice()
      this.produce(dice1+dice2)
      game.phase = 'afterdice'
      display.toggleMyButtons(game.turnPlayer.socketID)
      takeRecord(logdata)
    }
    this.diceCount[dice1+dice2] += 1
    this.diceCount.total += 1
    recordLog()
    game.lastActionPlayer = game.turnPlayer
  },
  //資源産出
  produce(add){
    let produceAmount = {ore:{amount:0, owner:[]}, grain:{amount:0, owner:[]}, wool:{amount:0, owner:[]}, lumber:{amount:0, owner:[]}, brick:{amount:0, owner:[]}}
    let i = 1
    let exhaust = []
    for(let line of this.island){
      for(let tile of line){
        if(tile.number === add && tile !== this.thief){
          for(let owner of tile.houseOwner){
            produceAmount[tile.type].amount += 1
            if(!produceAmount[tile.type].owner.includes(owner)){
              produceAmount[tile.type].owner.push(owner)
            }
          }
          for(let owner of tile.cityOwner){
            produceAmount[tile.type].amount += 2
            if(!produceAmount[tile.type].owner.includes(owner)){
              produceAmount[tile.type].owner.push(owner)
            }
          }
        }else if(tile.number === add && tile === this.thief){
          tile.thiefBlock += 1
        }
      }
    }
    for(let line of this.island){
      for(let tile of line){
        if(tile.number === add && tile !== this.thief){
          if(produceAmount[tile.type].amount <= game.allResource[tile.type]){
            for(let owner of tile.houseOwner){
              owner.resource[tile.type] += 1
              owner.produce[tile.type] += 1
              game.allResource[tile.type] -= 1
              produceAmount[tile.type].amount -= 1
            }
            for(let owner of tile.cityOwner){
              owner.resource[tile.type] += 2
              owner.produce[tile.type] += 2
              game.allResource[tile.type] -= 2
              produceAmount[tile.type].amount -= 2
            }
          }else if(produceAmount[tile.type].owner.length === 1){
            if(!exhaust.includes(tile.type)){
              exhaust.push(tile.type)
            }
            produceAmount[tile.type].owner[0].resource[tile.type] += game.allResource[tile.type]
            produceAmount[tile.type].owner[0].produce[tile.type] += game.allResource[tile.type]
            game.allResource[tile.type] = 0
          }else{
            if(!exhaust.includes(tile.type)){
              exhaust.push(tile.type)
            }
          }
        }
      }
    }
    for(let player of game.players){
      display.resourceOf(player)
    }
    if(exhaust.length !== 0){
      display.showExhaust(exhaust)
      const logdata = {action:'exhaust', exhaust:exhaust, turnPlayerID:game.turnPlayer.socketID}
      display.message(logdata)
      display.playLog(logdata)
    }
    display.hideReceivingArea()
  },
  //nodeの周りのroad座標
  roadsArounNode(nodeposition){
    let x = nodeposition[0]
    let y = nodeposition[1]
    if(x <= this.nodeLine.length /2){
      if(y % 2 === 0){
        return [[(x-1)*2, y/2],[x*2-1, y-1],[x*2-1, y]]
      }else{
        return [[x*2-1, y-1],[x*2-1, y],[x*2, (y+1)/2]]
      }
    }else{
      if(y % 2 === 0){
        return [[x*2-1, y-1],[x*2-1, y],[x*2, y/2]]
      }else{
        return [[(x-1)*2, (y+1)/2],[x*2-1, y-1],[x*2-1, y]]
      }
    }
  },
  //roadの周りのroad
  roadsAroundRoad(roadposition){
    let nodes = this.sidesOfRoad(roadposition);
    let arr = [];
    for(let node of nodes){
      let roads = this.roadsArounNode(node);
      for(let road of roads){
        if(!arrayComparison(road, roadposition)){
          arr.push(road);
        };
      };
    };
    return arr;
  },
  //roadの間のnode
  nodeBetweenRoads(road1, road2){
    let nodes1 = this.sidesOfRoad(road1);
    let nodes2 = this.sidesOfRoad(road2);
    for(let r1 of nodes1){
      for(let r2 of nodes2){
        if(arrayComparison(r1,r2)){
          return r1
        }
      }
    }
    return false
  },
  //nodeの状態
  nodeCondition(node){
    if(this.nodeCheck(node) === 'city'){
      return positionToObject(node, this.city)
    }else if(this.nodeCheck(node) === 'house'){
      return positionToObject(node, this.house)
    }else if(this.aroundNodesCheck(node) === 'notblank'){
      return 'adjacent'
    }else{
      return 'blank'
    }
  },
  //roadの状態
  roadCondition(roadposition){
    if(roadCheck(roadposition) === 'blank'){
      return 'blank'
    }else{
      return positionToObject(roadposition, this.road)
    }
  },
  //タイルボタン番号を座標に変換
  tileButtonNumberToPosition(tilebuttonnumber){
    let x = 1
    let y
    while(true){
      if(tilebuttonnumber <= this.landLine[x-1]){
        if(x === 1){
          y = tilebuttonnumber
        }else{
          y = tilebuttonnumber - this.landLine[x-2]
        }
        return [x, y]
      }else{
        x += 1
      }
    }
  },
  //タイルボタン座標を番号に変換
  tileButtonPositionToNumber(position){
    if(position[0] === 1){
      return position[1]
    }else{
      return this.landLine[position[0]-2]+position[1]
    }
  },
  otherSideOfRoad(node,roadposition){
    let nodes = this.sidesOfRoad(roadposition)
    if(arrayComparison(node, nodes[0])){
      return nodes[1]
    }else if(arrayComparison(node, nodes[1])){
      return nodes[0]
    }
    else false
  },
  longestCheck(){
    let currentLongestPlayer = game.longestRoadPlayer
    let longestPlayer = []
    for(let player of game.players){
      player.longestLength = player.myLongest()
      if(player.longestLength >= longestRoad){
        if(longestPlayer.length === 0){
          longestPlayer.push(player)
        }else if(player.longestLength > longestPlayer[0].longestLength){
          longestPlayer = [player]
        }else if(player.longestLength === longestPlayer[0].longestLength){
          longestPlayer.push(player)
        }
      }
    }
    if(longestPlayer.length === 1){
      game.longestRoadPlayer = longestPlayer[0]
    }else if(longestPlayer.includes(game.longestRoadPlayer)){
    }else{
      game.longestRoadPlayer = ''
    }
    if(game.longestRoadPlayer.longestRoad === 0){
      game.longestRoadPlayer.lastPoint = 'road'
    }
    for(let player of game.players){
      player.longestRoad = 0
    }
    game.longestRoadPlayer.longestRoad = 2
    if(game.longestRoadPlayer !== currentLongestPlayer){
      display.titleOf(currentLongestPlayer)
    }
    if(game.longestRoadPlayer){
      display.titleOf(game.longestRoadPlayer)
    }

  },
  ableDirectionOfOcean(oceanobject){
    let x = oceanobject.position[0]
    let y = oceanobject.position[1]
    if(x === 0){
      if(y === 0){
        return [5,5]
      }else if(y === this.landLine[0]){
        return [4,4]
      }else{
        return [4,5]
      }
    }else if(x >= 1 && x <= (this.landLine.length-1)/2){
      if(y === 0){
        return [0,5]
      }else{
        return [3,4]
      }
    }else if(x === (this.landLine.length+1)/2){
      if(y === 0){
        return [0,0]
      }else{
        return [3,3]
      }
    }else if(x >= (this.landLine.length+3)/2 && x <=this.landLine.length){
      if(y === 0){
        return [0,1]
      }else{
        return [2,3]
      }
    }else if(x === this.landLine.length+1){
      if(y === 0){
        return [1,1]
      }else if(y === this.landLine[0]){
        return [2,2]
      }else{
        return [1,2]
      }
    }
  },
  portsNodeCombiOnOcean(oceanobject){
    let x = oceanobject.position[0]
    let y = oceanobject.position[1]
    if(x === 0){
      if(y === 0){
        return [[[1,1],[1,2]],[[1,1],[1,2]]]
      }else if(y === this.landLine[0]){
        return [[[1,6],[1,7]],[[1,6],[1,7]]]
      }else{
        return [[[1,y*2],[1,y*2+1]],[[1,y*2+1],[1,y*2+2]]]
      }
    }else if(x >= 1 && x <= (this.landLine.length-1)/2){
      if(y === 0){
        return [[[x,1],[x+1,2]],[[x+1,1],[x+1,2]]]
      }else{
        return [[[x,y*2-1],[x+1,y*2]],[[x+1,y*2],[x+1,y*2+1]]]
      }
    }else if(x === (this.landLine.length+1)/2){
      if(y === 0){
        return [[[x,1],[x+1,1]],[[x,1],[x+1,1]]]
      }else{
        return [[[x,y*2-1],[x+1,y*2-1]],[[x,y*2-1],[x+1,y*2-1]]]
      }
    }else if(x > (this.landLine.length+1)/2 && x <= this.landLine.length){
      if(y === 0){
        return [[[x,2],[x+1,1]],[[x,1],[x,2]]]
      }else{
        return [[[x,y*2],[x,y*2+1]],[[x,y*2],[x+1,y*2-1]]]
      }
    }else if(x === this.landLine.length+1){
      if(y === 0){
        return [[[x,1],[x,2]],[[x,1],[x,2]]]
      }else if(y === this.landLine[0]){
        return [[[x,y*2],[x,y*2+1]],[[x,y*2],[x,y*2+1]]]
      }else{
        return [[[x,y*2+1],[x,y*2+2]],[[x,y*2],[x,y*2+1]]]
      }
    }
  },
  //タイルの絶対生産力
  productivity(tileobj){
    if(tileobj.number <= 6 && tileobj.number >= 2){
      return tileobj.number - 1
    }else if(tileobj.number >= 8 && tileobj.number <= 12){
      return 13 - tileobj.number
    }else{
      return 0
    }
  },
  //指定した資源の合計絶対生産力
  totalProductivityOf(resource){
    let totalProductivity = 0
    for(let line of this.island){
      for(let tile of line){
        if(tile.type === resource){
          totalProductivity += this.productivity(tile)
        }
      }
    }
    return totalProductivity
  },
  //タイルの相対生産力
  relativeProductivity(tileobj){
    if(tileobj.produce !== true){
      return 0
    }
    return this.productivity(tileobj) / this.totalProductivityOf(tileobj.type) **(1/2)
  },
  //ノードの周りのタイルの合計相対生産力
  nodeRelativeProductivity(nodeNumber){
    let productivity = {ore:0,grain:0,wool:0,lumber:0,brick:0}
    const nodePosition = this.nodeNumberToPosition(nodeNumber)
    const tilepositions = this.tilesAroundNode(nodePosition)
    for(let tileposition of tilepositions){
      let tile = this.island[tileposition[0]][tileposition[1]]
      if(tile.produce !== true){
        continue
      }
      productivity[tile.type] += Math.log(this.productivity(tile) * 2)
    }
    let totalRelativeProductivity = 0
    for(let resource in productivity){
      if(this.totalProductivityOf(resource)){
        totalRelativeProductivity += productivity[resource] / Math.log(this.totalProductivityOf(resource))
      }
    }
    return totalRelativeProductivity
  },
  //全ノードの合計相対生産力
  allNodesRelativeProductivity(){
    let i = 1
    let productivity =[]
    while(i <= this.nodeLine[this.nodeLine.length - 1]){
      if(this.nodeCondition(this.nodeNumberToPosition(i)) === 'blank'){
        productivity.push(this.nodeRelativeProductivity(i))
      }else{
        productivity.push(0)
      }
      i += 1
    }
    return productivity
  },
  //ノードの合計生産力
  nodeAbsouluteProductivity(nodeNumber){
    const nodePosition = this.nodeNumberToPosition(nodeNumber)
    const tilepositions = this.tilesAroundNode(nodePosition)
    let totalProductivity = 0
    for(let tileposition of tilepositions){
      let tile = this.island[tileposition[0]][tileposition[1]]
      totalProductivity += this.productivity(tile)
    }
    return totalProductivity
  },
  //ノードの資源別生産力
  nodeAbsouluteProductivityEachResource(nodeNumber){
    const nodePosition = this.nodeNumberToPosition(nodeNumber)
    const tilepositions = this.tilesAroundNode(nodePosition)
    let productivity = {ore:0,grain:0,wool:0,lumber:0,brick:0}
    for(let tileposition of tilepositions){
      let tile = this.island[tileposition[0]][tileposition[1]]
      productivity[tile.type] += this.productivity(tile)
    }
    return productivity
  },
  initialize(){
    if(this.size === 'large'){
      this.island = [[],[],[],[],[],[],[],[],[]]
      this.numbers = [[],[],[],[],[],[],[],[],[]]
      this.log = {island:[[],[],[],[],[],[],[],[],[]],thief:'',house:[], city:[], road:[]}
    }else if(this.size === 'regular'){
      this.island = [[],[],[],[],[],[],[]]
      this.numbers = [[],[],[],[],[],[],[]]
      this.log = {island:[[],[],[],[],[],[],[]],thief:'',house:[], city:[], road:[]}
    }
    this.thief = ''
    this.house = []
    this.city = []
    this.road = []
    this.dice = []
    this.ports = {oreport:[], grainport:[], woolport:[], lumberport:[], brickport:[],genericport:[]}
    this.islandData = ''
    this.log = {island:[[],[],[],[],[],[],[],[],[]],thief:'',house:[], city:[], road:[]}
    this.size = ''
    this.diceCount = {2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,total:0}
  }
}

const game = {maxPlayer:maxPlayer, players:[], turnPlayer:'', basePlayer:'', phase:'nameinputting', progressDeck:[],board:board,largestArmyPlayer:'',longestRoadPlayer:'',burstPlayer:[],proposedata:{proposer:'', proposee:'', giveresource:'', takeresource:''},renounce:[],startTime:'', gameID:'',
log:{turnPlayer:'', phase:'nameinputting', progressDeck:[],largestArmyPlayer:'',longestRoadPlayer:'',burstPlayer:[],proposedata:{proposer:'', proposee:'', giveresource:{ore:0,grain:0,wool:0,lumber:0,brick:0}, takeresource:{ore:0,grain:0,wool:0,lumber:0,brick:0}},renounce:[],allResource:{ore:0,grain:0,wool:0,lumber:0,brick:0}},
lastActionPlayer:'',allResource:{ore:0,grain:0,wool:0,lumber:0,brick:0},
  newGame(){
    for(let player of this.players){
      player.reset()
    }
    board.reset()
    this.reset()
    const now = new Date()
    this.startTime = now
    this.gameID = randomString()
    this.players = shuffle(this.players)
    let i = 1;
    for(let player of this.players){
      player.number = i - 1
      i += 1
    }
    this.turnPlayer = this.players[0]
    this.progressDeckMake();
    board.makeIsland(board.islandData)
    display.allMighty()
    display.resetRate()
    display.hideAllButtons()
    display.deletePlayLog()
  },
  reset(){
    this.turnPlayer = '';
    this.basePlayer = '';
    this.phase = 'setup';
    this.progressDeck = [];
    this.largestArmyPlayer = '';
    this.longestRoadPlayer = '';
    this.burstPlayer = [];
    this.proposedata = {proposer:'', proposee:'', giveresource:'', takeresource:''};
    this.renounce = [];
    this.startTime = '';
    this.gameID = '';
    this.log = {turnPlayer:'', phase:'setup', progressDeck:[],largestArmyPlayer:'',longestRoadPlayer:'',burstPlayer:[],proposedata:{proposer:'', proposee:'', giveresource:{ore:0,grain:0,wool:0,lumber:0,brick:0}, takeresource:{ore:0,grain:0,wool:0,lumber:0,brick:0}},renounce:[],allResource:{ore:0,grain:0,wool:0,lumber:0,brick:0}}
    this.lastActionPlayer = ''
    if(board.size === 'large'){
      this.allResource = {ore:25,grain:25,wool:25,lumber:25,brick:25}
    }else if(board.size === 'regular'){
      this.allResource = {ore:19,grain:19,wool:19,lumber:19,brick:19}
    }
    gameRecord = []
  },
  recordLog(){
    this.log.turnPlayer = this.turnPlayer
    this.log.basePlayer = this.basePlayer
    this.log.phase = this.phase
    this.log.largestArmyPlayer = this.largestArmyPlayer
    this.log.longestRoadPlayer = this.longestRoadPlayer
    this.log.progressDeck = []
    for(let card of this.progressDeck){
      this.log.progressDeck.push(card)
    }
    this.log.burstPlayer = []
    for(let player of this.burstPlayer){
      this.log.burstPlayer.push(player)
    }
    this.log.proposedata.proposer = this.proposedata.proposer
    this.log.proposedata.proposee = this.proposedata.proposee
    for(let key in this.proposedata.giveresource){
      this.log.proposedata.giveresource[key] = this.proposedata.giveresource[key]
      this.log.proposedata.takeresource[key] = this.proposedata.takeresource[key]
    }
    this.log.renounce = []
    for(let player of this.renounce){
      this.log.renounce.push(player)
    }
    for(let resource in this.allResource){
      this.log.allResource[resource] = this.allResource[resource]
    }
  },
  unDo(){
    this.turnPlayer = this.log.turnPlayer
    this.basePlayer = this.log.basePlayer
    this.phase = this.log.phase
    this.largestArmyPlayer = this.log.largestArmyPlayer
    this.longestRoadPlayer = this.log.longestRoadPlayer
    this.progressDeck = []
    for(let card of this.log.progressDeck){
      this.progressDeck.push(card)
    }
    this.burstPlayer = []
    for(let player of this.log.burstPlayer){
      this.burstPlayer.push(player)
    }
    this.proposedata.proposer = this.log.proposedata.proposer
    this.proposedata.proposee = this.log.proposedata.proposee
    for(let key in this.log.proposedata.giveresource){
      this.proposedata.giveresource[key] = this.log.proposedata.giveresource[key]
      this.proposedata.takeresource[key] = this.log.proposedata.takeresource[key]
    }
    this.renounce = []
    for(let player of this.log.renounce){
      this.renounce.push(player)
    }
    for(let resource in this.allResource){
      this.allResource[resource] = this.log.allResource[resource]
    }
  },
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
    this.turnPlayer = this.players[0]
  },
  gameStart(){
    this.phase = 'setup'
    this.playerMake();
    playersName = []
    this.turnPlayer = this.players[0]
    display.playerSort();
    display.hideItems();
    display.turnPlayer();
    display.hideAllButtons()
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
    if(board.size === 'large'){
      progress = {knight:20, roadbuild:3, harvest:3, monopoly:3, point:5}
    }else if(board.size === 'regular'){
      progress = {knight:14, roadbuild:2, harvest:2, monopoly:2, point:5}
    }
    this.progressDeck = [];
    let arr =[]
    let i = 1;
    while(i <= progress.knight){
      this.progressDeck.push('knight')
      i += 1
    }
    i = 1;
    while(i <= progress.roadbuild){
      this.progressDeck.push('roadbuild')
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
  turnEnd(){
    if(this.phase === 'afterdice'){
      if(this.turnPlayer.point >= victoryPoint){
        io.emit('fanfare','')
        makeNewTurnRecord()
        const logdata = {action:'win', playername:this.turnPlayer.name}
        takeRecord(logdata)
        updateDatabase(this.turnPlayer)
        this.gameEnd()
        return
      }else if(board.size === 'large'){
        this.phase = 'building'
        display.thisTurnBlack()
        display.hideExhaust()
      }else if(board.size === 'regular'){
        makeNewTurnRecord()
        this.basePlayer = this.turnPlayer
        const playername = this.turnPlayer.name
        if(this.turnPlayer.number === this.players.length-1){
          this.turnPlayer = this.players[0];
        } else {
            this.turnPlayer = this.players[this.turnPlayer.number+1];
        }
        io.to(this.turnPlayer.socketID).emit('turnsound','')
        const logdata = {action:'turnend', playername:playername, turnPlayerID:this.turnPlayer.socketID}
        display.message(logdata)
        display.playLog(logdata)
        this.phase = 'beforedice'
        display.thisTurnBlack()
        display.turnPlayer()
        display.toggleMyButtons(this.basePlayer.socketID)
        display.toggleMyButtons(this.turnPlayer.socketID)
        display.hideExhaust()
        return
      }
    }
    if(this.basePlayer === ''){
      this.basePlayer = this.turnPlayer
    }else if(this.basePlayer === this.turnPlayer){
      makeNewTurnRecord()
      this.phase = 'beforedice'
      this.basePlayer = ''
    }
    let previousPlayer = this.turnPlayer
    if(this.turnPlayer.number === this.players.length-1){
      this.turnPlayer = this.players[0];
    } else {
        this.turnPlayer = this.players[this.turnPlayer.number+1];
    }
    if(this.phase !== 'building' || this.turnPlayer.renounce !== true){
      io.to(this.turnPlayer.socketID).emit('turnsound','')
    }
    display.turnPlayer()
    display.toggleMyButtons(previousPlayer.socketID)
    display.toggleMyButtons(this.turnPlayer.socketID)
    if(this.phase === 'building' && this.turnPlayer.renounce === true){
      this.turnPlayer.turnEnd()
    }
  },
  turnEndSetup(){
    if(this.turnPlayer.house.length === 2){
      if(this.turnPlayer === this.players[0]){
        makeNewTurnRecord()
        this.phase = 'beforedice'
      }else{
        this.turnPlayer = this.players[this.players.indexOf(this.turnPlayer)-1];
      }
    }else{
      if(this.turnPlayer.number === this.players.length-1){
        this.turnPlayer === this.turnPlayer
      }else{
        this.turnPlayer = this.players[this.players.indexOf(this.turnPlayer)+1];
      }
    }
    display.toggleMyButtons(this.turnPlayer.socketID)
    display.turnPlayer()
  },
  pointReload(){
    for(let player of this.players){
      player.point = player.house.length + player.city.length*2 + player.progress.point + player.largestArmy + player.longestRoad
    }
  },
  gameEnd(){
    this.phase = 'end'
    recordLog()
    display.gameResult()
    display.gameRecord()
  },
  burstPlayerCheck(){
    this.burstPlayer = []
    for(let player of this.players){
      if(player.totalResource() >= burst){
        this.burstPlayer.push(player)
        player.toTrash = Math.floor(player.totalResource()/2)
      }
    }
    if(this.burstPlayer.length !== 0){
      this.phase = 'burst'
      recordLog()
      for(let player of this.players){
        player.recordLog()
      }
      display.showBurstArea()
      for(let player of this.burstPlayer){
        io.to(player.socketID).emit('burstsound','')
      }
      const logdata = {action:'burst', players:this.burstPlayer, turnPlayerID:game.turnPlayer.socketID}
      display.playLog(logdata)
    }else{
      this.phase = 'thiefmove'
      display.thiefRed()
      display.toggleMyButtons(game.turnPlayer.socketID)
    }
    display.hideReceivingArea()
  },
  IDToPlayer(ID){
    for(let player of this.players){
      if(ID === player.socketID){
        return player
      }
    }
    return false
  },
  







  takeOver(player){
    let oldID = this.players[player.number].socketID
    this.players[player.number].socketID = player.socketID
    display.allMightyTo(player.socketID)
    display.allMightyTo(oldID)
  },
  initialize(){
    this.players.length = 0;
    this.turnPlayer = '';
    this.phase = 'nameinputting';
    this.progressDeck = [];
    this.largestArmyPlayer = '';
    this.longestRoadPlayer = '';
    this.burstPlayer = [];
    this.proposedata = {proposer:'', proposee:'', giveresource:'', takeresource:''};
    this.renounce = []
    this.lastActionPlayer = ''
    this.allResource = {ore:0,grain:0,wool:0,lumber:0,brick:0}
    gameRecord = []
  },
}

const display = {
  hideItems(){
    let data = {maxPlayer:game.maxPlayer, players:game.players}
    io.emit('hideItems', data);
  },
  island(){
    const island = board.island
    io.emit('island', island)
  },
  islandTo(socketID){
    const island = board.island
    io.to(socketID).emit('island', island)
  },
  hideMyItems(socketID){
    let data = {maxPlayer:game.maxPlayer, players:game.players}
    io.to(socketID).emit('hideItems', data)
  },
  allResource(){
    let data = {players:game.players}
    io.emit('allResource', data);
  },
  allResourceTo(socketID){
    let data = {players:game.players}
    io.to(socketID).emit('allResource', data);
  },
  allToken(){
    let data = {players:game.players}
    io.emit('allToken', data)
  },
  allTokenTo(socketID){
    let data = {players:game.players}
    io.to(socketID).emit('allToken', data)
  },
  allTitle(){
    let data = {players:game.players}
    io.emit('allTitle', data)
  },
  allTitleTo(socketID){
    let data = {players:game.players}
    io.to(socketID).emit('allTitle', data)
  },
  allProgress(){
    let data = {players:game.players}
    io.emit('allProgress', data)
  },
  allProgressTo(socketID){
    let data = {players:game.players}
    io.to(socketID).emit('allProgress', data)
  },
  allUsed(){
    let data = {players:game.players}
    io.emit('allUsed', data)
  },
  allUsedTo(socketID){
    let data = {players:game.players}
    io.to(socketID).emit('allUsed', data)
  },
  resourceOf(player){
    let resource = player.resource
    let data = {number:player.number, resource:resource, socketID:player.socketID}
    io.emit('resourceof', data)
  },
  tokenOf(player){
    let token = player.token
    let data = {number:player.number, token:token}
    io.emit('tokenof', data)
  },
  titleOf(player){
    let data = {number:player.number, largestArmy:player.largestArmy,longestRoad:player.longestRoad}
    io.emit('titleof', data)
  },
  progressOf(player){
    let progress = player.progress
    let data = {number:player.number, progress:progress, socketID:player.socketID}
    io.emit('progressof', data)
  },
  usedOf(player){
    let used = player.used
    let data = {number:player.number, used:used}
    io.emit('usedof', data)
  },
  addUsed(progresscard){
    let data = {number:game.turnPlayer.number, progress:progresscard}
    io.emit('addused', data)
  },
  allPlayerInformation(){
    this.allResource()
    this.allToken()
    this.allTitle()
    this.allProgress()
    this.allUsed()
  },
  allPlayerInformationTo(socketID){
    this.allResourceTo(socketID)
    this.allTokenTo(socketID)
    this.allTitleTo(socketID)
    this.allProgressTo(socketID)
    this.allUsedTo(socketID)
  },
  buildings(){
    let buildings = {house:game.board.house,city:game.board.city,road:game.board.road}
    io.emit('buildings',buildings)
  },
  buildingsTo(socketID){
    let buildings = {house:game.board.house,city:game.board.city,road:game.board.road}
    io.to(socketID).emit('buildings',buildings)
  },
  addHouse(houseobj){
    io.emit('addhouse',houseobj)
  },
  addCity(cityobj){
    io.emit('addcity',cityobj)
  },
  addRoad(roadobj){
    io.emit('addroad',roadobj)
  },
  thief(){
    let buttonnumber = board.tileButtonPositionToNumber(board.thief.position)
    io.emit('thief', buttonnumber)
    if(game.phase === 'thiefmove'){
      this.thiefRed()
    }else{
      this.thiefBlack()
    }
  },
  thiefRed(){
    io.emit('thiefred','')
  },
  thiefRedTo(socketID){
    io.to(socketID).emit('thiefred','')
  },
  thiefBlack(){
    io.emit('thiefblack','')
  },
  thiefTo(socketID){
    let buttonnumber = board.tileButtonPositionToNumber(board.thief.position)
    io.to(socketID).emit('thief', buttonnumber)
    if(game.phase === 'thiefmove'){
      this.thiefRedTo(socketID)
    }
  },
  deleteThief(){
    io.emit('deletethief', '')
  },
  deleteMyThief(socketID){
    io.to(socketID).emit('deletethief', '')
  },
  hideMonopolyArea(){
    let e
    io.emit('hidemonopoly',e)
  },
  hideHarvestArea(){
    let e
    io.emit('hideharvest',e)
  },
  hideBurstArea(){
    let e
    io.emit('hideburst',e)
  },
  showBurstArea(){
    let burstPlayer = game.burstPlayer
    io.emit('showburst', burstPlayer)
    this.hideButtonArea()
    this.hideMessageArea()
  },
  hideTradeArea(){
    let e
    io.emit('hidetrade',e)
  },
  hideNegotiateArea(){
    let e
    io.emit('hidenegotiate',e)
  },
  hideMyProposeArea(socketID){
    io.to(socketID).emit('hideproposearea', '')
    this.toggleMyButtons(socketID)
  },
  showMyProposeArea(socketID){
    let data  = game.proposedata
    io.to(socketID).emit('showproposearea', data)
    this.hideMyButtonArea(socketID)
  },
  hideMyMonopolyArea(socketID){
    let e
    io.to(socketID).emit('hidemonopoly',e)
    this.toggleMyButtons(socketID)
  },
  showMyMonopolyArea(socketID){
    let e
    io.to(socketID).emit('showmonopoly',e)
    this.hideMyButtonArea(socketID)
  },
  hideMyHarvestArea(socketID){
    let e
    io.to(socketID).emit('hideharvest',e)
    this.toggleMyButtons(socketID)
  },
  showMyHarvestArea(socketID){
    let e
    io.to(socketID).emit('showharvest',e)
    this.hideMyButtonArea(socketID)
  },
  hideMyBurstArea(socketID){
    let e
    io.to(socketID).emit('hideburst',e)
    this.toggleMyButtons(socketID)
  },
  showMyBurstArea(socketID){
    let burstPlayer = game.burstPlayer
    io.to(socketID).emit('showburst',burstPlayer)
    this.hideMyButtonArea(socketID)
  },
  hideMyTradeArea(socketID){
    let e
    io.to(socketID).emit('hidetrade',e)
    this.toggleMyButtons(socketID)
  },
  showMyTradeArea(socketID){
    let data = {resource:game.turnPlayer.resource}
    io.to(socketID).emit('showtrade',data)
    this.hideMyButtonArea(socketID)
  },
  hideMyNegotiateArea(socketID){
    let e
    io.to(socketID).emit('hidenegotiate',e)
    this.toggleMyButtons(socketID)
  },
  showMyNegotiateArea(socketID){
    let data = {resource:game.turnPlayer.resource}
    io.to(socketID).emit('shownegotiate',data)
    this.hideMyButtonArea(socketID)
  },
  hideField(){
    let e
    io.emit('hideField', e)
  },
  hideMyField(socketID){
    io.to(socketID).emit('hideField','')
  },
  showField(){
    let e
    io.emit('showField', e)
  },
  showMyField(socketID){
    let e
    io.to(socketID).emit('showField', e)
  },
  gameResult(){
    let thiefBlock = {2:{1:'',2:''},3:{1:'',2:'',3:''},4:{1:'',2:'',3:''},5:{1:'',2:'',3:''},6:{1:'',2:'',3:''},8:{1:'',2:'',3:''},9:{1:'',2:'',3:''},10:{1:'',2:'',3:''},11:{1:'',2:'',3:''},12:{1:'',2:''}}
    let thiefStay = {2:{1:'',2:''},3:{1:'',2:'',3:''},4:{1:'',2:'',3:''},5:{1:'',2:'',3:''},6:{1:'',2:'',3:''},8:{1:'',2:'',3:''},9:{1:'',2:'',3:''},10:{1:'',2:'',3:''},11:{1:'',2:'',3:''},12:{1:'',2:''}}
    let resource = {2:{1:'',2:''},3:{1:'',2:'',3:''},4:{1:'',2:'',3:''},5:{1:'',2:'',3:''},6:{1:'',2:'',3:''},8:{1:'',2:'',3:''},9:{1:'',2:'',3:''},10:{1:'',2:'',3:''},11:{1:'',2:'',3:''},12:{1:'',2:''}}
    for(let line of board.island){
      for(let tile of line){
        if(tile.number >= 2){
          if(thiefBlock[tile.number][1] === ''){
            thiefBlock[tile.number][1] = tile.thiefBlock
            thiefStay[tile.number][1] = tile.thiefStay
            resource[tile.number][1] = tile.type
          }else if(thiefBlock[tile.number][2] === ''){
            thiefBlock[tile.number][2] = tile.thiefBlock
            thiefStay[tile.number][2] = tile.thiefStay
            resource[tile.number][2] = tile.type
          }else if(thiefBlock[tile.number][3] === ''){
            thiefBlock[tile.number][3] = tile.thiefBlock
            thiefStay[tile.number][3] = tile.thiefStay
            resource[tile.number][3] = tile.type
          }
        }
      }
    }
    let diceData = {diceCount:board.diceCount, thiefBlock:thiefBlock, thiefStay:thiefStay, resource:resource}
    let data = {players:game.players, turnPlayer:game.turnPlayer, diceData:diceData}
    io.emit('gameresult', data)
    this.showGameEndArea()
  },
  gameResultTo(socketID){
    let thiefBlock = {2:{1:'',2:''},3:{1:'',2:'',3:''},4:{1:'',2:'',3:''},5:{1:'',2:'',3:''},6:{1:'',2:'',3:''},8:{1:'',2:'',3:''},9:{1:'',2:'',3:''},10:{1:'',2:'',3:''},11:{1:'',2:'',3:''},12:{1:'',2:''}}
    let thiefStay = {2:{1:'',2:''},3:{1:'',2:'',3:''},4:{1:'',2:'',3:''},5:{1:'',2:'',3:''},6:{1:'',2:'',3:''},8:{1:'',2:'',3:''},9:{1:'',2:'',3:''},10:{1:'',2:'',3:''},11:{1:'',2:'',3:''},12:{1:'',2:''}}
    let resource = {2:{1:'',2:''},3:{1:'',2:'',3:''},4:{1:'',2:'',3:''},5:{1:'',2:'',3:''},6:{1:'',2:'',3:''},8:{1:'',2:'',3:''},9:{1:'',2:'',3:''},10:{1:'',2:'',3:''},11:{1:'',2:'',3:''},12:{1:'',2:''}}
    for(let line of board.island){
      for(let tile of line){
        if(tile.number >= 2){
          if(thiefBlock[tile.number][1] === ''){
            thiefBlock[tile.number][1] = tile.thiefBlock
            thiefStay[tile.number][1] = tile.thiefStay
            resource[tile.number][1] = tile.type
          }else if(thiefBlock[tile.number][2] === ''){
            thiefBlock[tile.number][2] = tile.thiefBlock
            thiefStay[tile.number][2] = tile.thiefStay
            resource[tile.number][2] = tile.type
          }else if(thiefBlock[tile.number][3] === ''){
            thiefBlock[tile.number][3] = tile.thiefBlock
            thiefStay[tile.number][3] = tile.thiefStay
            resource[tile.number][3] = tile.type
          }
        }
      }
    }
    let diceData = {diceCount:board.diceCount, thiefBlock:thiefBlock, thiefStay:thiefStay, resource:resource}
    let data = {players:game.players, turnPlayer:game.turnPlayer, diceData:diceData}
    io.to(socketID).emit('gameresult', data)
    this.showMyGameEndArea(socketID)
  },
  showGameEndArea(){
    io.emit('showgameendarea', '')
    this.hideButtonArea()
    this.hideMessageArea()
  },
  hideGameEndArea(){
    io.emit('hidegameendarea', '')
  },
  showMyGameEndArea(socketID){
    io.to(socketID).emit('showgameendarea', '')
    this.hideMyButtonArea(socketID)
  },
  hideMyGameEndArea(socketID){
    io.to(socketID).emit('hidegameendarea', '')
    this.toggleMyButtons(socketID)
  },
  showProposeArea(){
    let data = game.proposedata
    io.emit('showproposearea', data)
    display.hideButtonArea()
    this.hideMessageArea()
  },
  hideProposeArea(){
    let e
    io.emit('hideproposearea', e)
  },
  hideMessageArea(){
    io.emit('hidemessagearea', '')
  },
  hideMyMessageArea(socketID){
    io.to(socketID).emit('hidemessagearea', '')
  },
  initialize(){
    let maxPlayer = game.maxPlayer
    io.emit('yesbuttonclick',maxPlayer)
  },
  turnPlayer(){
    let tn = game.turnPlayer.number
    let bn = game.basePlayer.number
    let ID = game.turnPlayer.socketID
    let phase = game.phase
    let data = {tn:tn, bn:bn, ID:ID, phase:phase}
    io.emit('turnplayer', data)
  },
  turnPlayerTo(socketID){
    let tn = game.turnPlayer.number
    let bn = game.basePlayer.number
    let phase = game.phase
    let data = {tn:tn, bn:bn, phase:phase}
    io.to(socketID).emit('turnplayer', data)
  },
  playerSort(){
    let players = game.players
    io.emit('playersort', players)
  },
  myPlayerSort(socketID){
    let players = game.players
    io.to(socketID).emit('playersort', players)
  },
  hideMyButtonArea(socketID){
    let e
    io.to(socketID).emit('hidebuttonarea', e)
  },
  showMyButtonArea(socketID){
    let e
    io.to(socketID).emit('showbuttonarea', e)
    display.hideMyMessageArea(socketID)
  },
  hideButtonArea(){
    let e
    io.emit('hidebuttonarea', e)
  },
  showButtonArea(){
    io.emit('showbuttonarea', '')
    display.hideMessageArea()
  },
  log(a){
    io.emit('log', a)
  },
  showNameInputArea(playersName){
    io.emit('shownameinputarea', (playersName));
  },
  showMyNameInputArea(socketID, playersName){
    io.to(socketID).emit('shownameinputarea', (playersName));
  },
  hideYesOrNoButton(){
    io.emit('hideyesornobutton', '');
  },
  cleanUpBoard(){
    io.emit('cleanupboard', '');
  },
  cleanUpMyBoard(socketID){
    io.to(socketID).emit('cleanupboard', '');
  },
  dice(){
    let dice = board.dice
    if(dice.length){
      io.emit('dice', dice);
    }
    if(game.phase !== 'thiefmove' && game.phase !== 'burst' && game.phase !== 'robresource'){
      display.diceBlack()
    }
  },
  diceTo(socketID){
    let dice = board.dice
    if(dice.length){
      io.to(socketID).emit('dice', dice);
    }
    if(game.phase !== 'thiefmove' && game.phase !== 'burst' && game.phase !== 'robresource'){
      display.diceBlack()
    }
  },
  diceBlack(){
    io.emit('diceblack','')
  },
  hideendmessageArea(){
    io.emit('hideendmessagearea', );
  },
  showMyButton(socketID,string){
    io.to(socketID).emit('showbutton',string)
  },
  hideMyButton(socketID,string){
    io.to(socketID).emit('hidebutton',string)
  },
  hideButton(string){
    io.emit('hidebutton',string)
  },
  hideAllButtons(){
    display.hideButton('dice')
    for(let card in progress){
      display.hideButton(card)
    }
    display.hideButton('negotiate')
    display.hideButton('trade')
    display.hideButton('end')
  },
  reloadRate(socketID){
    if(game.IDToPlayer(socketID)){
      io.to(socketID).emit('reloadrate', game.IDToPlayer(socketID).tradeRate)
    }
  },
  resetRate(){
    io.emit('resetrate', '')
  },
  toggleMyButtons(socketID){
    display.showMyButtonArea(socketID)
    let myself = game.IDToPlayer(socketID)
    display.hideMyButton(socketID,'dice')
    for(let card in progress){
      display.hideMyButton(socketID, card)
    }
    display.hideMyButton(socketID,'negotiate')
    display.hideMyButton(socketID,'trade')
    display.hideMyButton(socketID,'end')
    if(!myself){
      return
    }
    if(game.turnPlayer.socketID === socketID && game.phase !== 'setup'){
      if(game.phase === 'beforedice'){
        display.showMyButton(socketID,'dice')
      }
      if(myself.progress.knight - myself.thisTurnDraw.knight !== 0 && myself.progressUse === 0 && (game.phase === 'beforedice' || game.phase === 'afterdice')){
        display.showMyButton(socketID,'knight')
      }
      for(let card in progress){
        if(myself.progress[card] - myself.thisTurnDraw[card] !== 0 && myself.progressUse === 0 && game.phase === 'afterdice'){
          display.showMyButton(socketID,card)
        }
      }
      if(game.phase === 'building' || game.phase === 'afterdice'){
        display.showMyButton(socketID,'end')
      }
      if(game.phase === 'afterdice'){
        display.showMyButton(socketID,'negotiate')
        display.showMyButton(socketID,'trade')
      }
    }
  },
  allMightyTo(socketID){
    if(game.phase === 'nameinputting'){
      display.showMyNameInputArea(socketID,playersName);
      display.hideMyField(socketID);
      display.hideMyMonopolyArea(socketID);
      display.hideMyHarvestArea(socketID);
      display.hideMyBurstArea(socketID);
      display.hideMyTradeArea(socketID);
      display.hideMyNegotiateArea(socketID);
      display.hideMyProposeArea(socketID);
      display.hideMyMessageArea(socketID);
      display.hideMyGameEndArea(socketID);
      display.hideDicePercentageTo(socketID)
      display.hideExhaustTo(socketID)
      display.cleanUpMyBoard(socketID);
      display.deleteMyThief(socketID);
    }else{
      display.showMyField(socketID);
      display.islandTo(socketID)
      display.relativeNodesTo(socketID)
      display.toggleMyButtons(socketID);
      display.hideMyMonopolyArea(socketID);
      display.hideMyHarvestArea(socketID);
      display.hideMyBurstArea(socketID);
      display.hideMyTradeArea(socketID);
      display.hideMyNegotiateArea(socketID);
      display.hideMyProposeArea(socketID);
      display.hideMyMessageArea(socketID);
      display.hideMyGameEndArea(socketID);
      display.hideDicePercentageTo(socketID)
      display.hideExhaustTo(socketID)
      display.myPlayerSort(socketID);
      display.hideMyItems(socketID);
      display.turnPlayerTo(socketID);
      display.cleanUpMyBoard(socketID);
      display.diceTo(socketID);
      display.deckTo(socketID)
      display.deleteMyThief(socketID);
      display.thiefTo(socketID);
      display.allPlayerInformationTo(socketID);
      display.renounceTo(socketID);
      display.reloadRate(socketID);
      display.toggleMyButtons(socketID);
      if(socketID === game.turnPlayer.socketID && game.phase === 'monopoly'){
        display.showMyMonopolyArea(socketID)
      }
      if(socketID === game.turnPlayer.socketID && (game.phase === 'harvest1' || game.phase === 'harvest2')){
        display.showMyHarvestArea(socketID)
      }
      if(game.phase === 'burst'){
        display.showMyBurstArea(socketID)
      }
      if(socketID === game.turnPlayer.socketID && game.phase === 'trade'){
        display.showMyTradeArea(socketID)
      }
      if(socketID === game.turnPlayer.socketID && game.phase === 'negotiate'){
        display.showMyNegotiateArea(socketID)
      }
      if(game.phase === 'propose'){
        display.showMyProposeArea(socketID)
      }
      if(game.phase === 'end'){
        display.gameResultTo(socketID)
        display.gameRecord()
      }
      display.buildingsTo(socketID);
    }
  },
  allMighty(){
    if(game.phase === 'nameinputting'){
      display.showNameInputArea(playersName)
      display.hideField()
      display.hideMonopolyArea()
      display.hideHarvestArea()
      display.hideBurstArea()
      display.hideTradeArea()
      display.hideNegotiateArea()
      display.hideProposeArea()
      display.hideMessageArea()
      display.hideGameEndArea()
      display.hideDicePercentage()
      display.hideExhaust()
      display.cleanUpBoard()
      display.resetRate()
      display.deleteThief()
    }else{
      display.showField()
      display.island()
      display.relativeNodes()
      display.hideAllButtons()
      display.toggleMyButtons(game.turnPlayer.socketID)
      display.hideMonopolyArea()
      display.hideHarvestArea()
      display.hideBurstArea()
      display.hideTradeArea()
      display.hideNegotiateArea()
      display.hideProposeArea()
      display.hideMessageArea()
      display.hideGameEndArea()
      display.hideDicePercentage()
      display.hideExhaust()
      display.playerSort();
      display.hideItems();
      display.turnPlayer();
      display.cleanUpBoard()
      display.dice()
      display.deck()
      display.deleteThief()
      display.thief()
      display.allPlayerInformation()
      display.renounce()
      display.showButtonArea()
      if(game.phase === 'monopoly'){
        display.showMyMonopolyArea(game.turnPlayer.socketID)
      }
      if(game.phase === 'harvest1' || game.phase === 'harvest2'){
        display.showMyHarvestArea(game.turnPlayer.socketID)
      }
      if(game.phase === 'burst'){
        display.showBurstArea()
      }
      if(game.phase === 'trade'){
        display.showMyTradeArea(game.turnPlayer.socketID)
      }
      if(game.phase === 'negotiate'){
        display.showMyNegotiateArea(game.turnPlayer.socketID)
      }
      if(game.phase === 'propose'){
        display.showProposeArea()
      }
      if(game.phase === 'end'){
        display.gameResult()
      }
    }
    display.buildings()
  },
  initialize(){
    this.showNameInputArea(playersName)
    this.hideYesOrNoButton()
    this.hideField()
    this.hideMonopolyArea()
    this.hideHarvestArea()
    this.hideBurstArea()
    this.hideTradeArea()
    this.hideNegotiateArea()
    this.hideProposeArea()
    this.hideMessageArea()
    this.hideGameEndArea()
    this.cleanUpBoard()
    this.hideDicePercentage()
    this.hideExhaust()
    this.deletePlayLog()
  },
  renounce(){
    let renounce = game.renounce
    io.emit('renounce', renounce)
  },
  renounceTo(socketID){
    let renounce = game.renounce
    io.to(socketID).emit('renounce', renounce)
  },
  hideReceivingArea(){
    io.emit('hidereceivingarea', '')
  },
  hideReceivingAreaTo(socketID){
    io.to(socketID).emit('hidereceivingarea', '')
  },
  hideDicePercentage(){
    io.emit('hidedicepercentage','')
  },
  hideDicePercentageTo(socketID){
    io.to(socketID).emit('hidedicepercentage','')
  },
  thisTurnBlack(){
    io.emit('thisturnblack', '')
  },
  deck(){
      let all
      if(board.size === 'large'){
          all = 34
      }else if(board.size === 'regular'){
          all = 25
      }
      let height = game.progressDeck.length / all * 100
      let number = game.progressDeck.length
      let data = {height:height, number:number}
      io.emit('deck', data)
  },
  deckTo(socketID){
      let all
      if(board.size === 'large'){
          all = 34
      }else if(board.size === 'regular'){
          all = 25
      }
      let height = game.progressDeck.length / all * 100
      let number = game.progressDeck.length
      let data = {height:height, number:number}
      io.to(socketID).emit('deck', data)
  },
  showExhaust(exhaust){
    let data = {exhaust:exhaust}
    io.emit('showexhaust',data)
  },
  hideExhaust(){
    io.emit('hideexhaust','')
  },
  hideExhaustTo(socketID){
    io.to(socketID).emit('hideexhaust','')
  },
  relativeNodes(){
    let nodes = highestIndex(board.allNodesRelativeProductivity())
    let data = {nodes:nodes}
    if(game.phase === 'setup'){
      io.emit('relativenodes',data)
    }else{
      io.emit('deleterelativenodes','')
    }
  },
  relativeNodesTo(socketID){
    let nodes = highestIndex(board.allNodesRelativeProductivity())
    let data = {nodes:nodes}
    if(game.phase === 'setup'){
      io.to(socketID).emit('relativenodes',data)
    }
  },
  playLog(logdata){
    io.emit('playlog',logdata)
  },
  deletePlayLog(){
    io.emit('deleteplaylog','')
  },
  message(logdata){
    io.emit('message',logdata)
  },
  gameRecord(){
    let data = {gameRecord:gameRecord}
    io.emit('gamerecord', data)
  },
  resetKeepResourceTo(socketID){
    io.to(socketID).emit('resetkeepresource','')
  },
}

const rating ={K:32,
  Wab(Ra,Rb){
    return 1/(10**((Rb - Ra)/400)+1)
  },
  winnersNewRating(w, loserslist){
    if(loserslist.length === 0){
      return w.rating
    }
    let currentRating = w.rating
    for(let loser of loserslist){
      currentRating += this.K*(1-this.Wab(w.rating, loser.rating))
    }
    return currentRating
  },
  losersNewRating(loser, winner){
    return loser.rating + this.K*(0-this.Wab(loser.rating, winner.rating))
  },
}

function discard(item,array){
  if(array.includes(item)){
      let i = array.indexOf(item);
      array.splice(i, 1);
  }
};
function shuffle(array){
  let newArray = []
  let n = array.length
  let i = 1
  while(i <= n){
    let randomNumber = Math.floor(Math.random()*array.length);
    let item = array[randomNumber]
    newArray.push(item);
    array.splice(randomNumber,1);
    i += 1;
  }
  array = newArray
  return array
};
function IhaveTokenThere(position, tokenlist){
  for(let obj of tokenlist){
    let array = obj.position
    let i = 1
    if(position.length !== array.length){
      break
    }
    while(i <= position.length){
      if(position[i-1] !== array[i-1]){
        break
      }
      if(i === position.length){
        return true
      }
      i += 1
    }
  }
  return false
};
function arrayComparison(array1, array2){
  if(array1.length !== array2.length){
    return false
  }else{
    let i = 1
    while(i <= array1.length){
      if(array1[i-1] !== array2[i-1]){
        return false
      }
      i += 1
    }
  }
  return true
};
function positionToObject(position, array){
  for(let object of array){
    if(arrayComparison(position, object.position)){
      return object
    }
  }
  return false
};
function copyOfArray(array){
  let arr =[]
  for(let item of array){
    arr.push(item)
  }
  return arr
}
function initialize(){
  game.initialize();
  board.initialize();
  playersName = []
  display.initialize()
}
function recordLog(){
  for(let player of game.players){
    player.recordLog()
  }
  board.recordLog()
  game.recordLog()
  lastActionUndeletable()
}
function unDo(){
  deleteLastAction()
  for(let player of game.players){
    player.unDo()
  }
  board.unDo()
  game.unDo()
}
function highestIndex(array){
  let highestIndex = [0]
  for(let item of array){
    if(item > array[highestIndex[0]]){
      highestIndex = [array.indexOf(item)]
    }else if(item === array[highestIndex[0]]){
      highestIndex.push(array.indexOf(item))
    }
  }
  return highestIndex
}
function takeRecord(action){
  let record = {players:[],thief:'',dice:[], progress:0, action:action, undo:true}
  for(let player of game.players){
    let playerRecord = {
      resource:{ore:0,grain:0,wool:0,lumber:0,brick:0},
      token:{house:5, city:4, road:15},
      house:[],
      city:[],
      road:[],
      progress:{knight:0, roadbuild:0, harvest:0, monopoly:0, point:0},
      used:{knight:0, roadbuild:0, harvest:0, monopoly:0, point:0},
      largestArmy:0,
      longestRoad:0
    }
    for(let r in player.resource){
      playerRecord.resource[r] = player.resource[r]
    }
    for(let t in player.token){
      playerRecord.token[t] = player.token[t]
    }
    for(let h of player.house){
      playerRecord.house.push(h.nodeNumber)
    }
    for(let c of player.city){
      playerRecord.city.push(c.nodeNumber)
    }
    for(let r of player.road){
      let road = {roadNumber:r.roadNumber, roadDegree:r.roadDegree}
      playerRecord.road.push(road)
    }
    for(let p in player.progress){
      playerRecord.progress[p] = player.progress[p]
    }
    for(let u in player.used){
      playerRecord.used[u] = player.used[u]
    }
    playerRecord.largestArmy = player.largestArmy
    playerRecord.longestRoad = player.longestRoad
    record.players.push(playerRecord)
  }
  record.thief = board.tileButtonPositionToNumber(board.thief.position)
  record.dice[0] = board.dice[0]
  record.dice[1] = board.dice[1]
  record.progress = game.progressDeck.length
  let lastTurn = gameRecord[gameRecord.length-1]
  if(lastTurn.length > 0){
    let lastAction = lastTurn[lastTurn.length-1]
    lastAction.undo = false
  }else if(gameRecord.length >= 2){
    let previousTurn = gameRecord[gameRecord.length-2]
    let lastAction = previousTurn[previousTurn.length-1]
    lastAction.undo = false
  }
  gameRecord[gameRecord.length-1].push(record)
}
function takeRecordUndeletable(action){
  let record = {players:[],thief:'',dice:[], progress:0, action:action, undo:false}
  for(let player of game.players){
    let playerRecord = {
      resource:{ore:0,grain:0,wool:0,lumber:0,brick:0},
      token:{house:5, city:4, road:15},
      house:[],
      city:[],
      road:[],
      progress:{knight:0, roadbuild:0, harvest:0, monopoly:0, point:0},
      used:{knight:0, roadbuild:0, harvest:0, monopoly:0, point:0},
      largestArmy:0,
      longestRoad:0
    }
    for(let r in player.resource){
      playerRecord.resource[r] = player.resource[r]
    }
    for(let t in player.token){
      playerRecord.token[t] = player.token[t]
    }
    for(let h of player.house){
      playerRecord.house.push(h.nodeNumber)
    }
    for(let c of player.city){
      playerRecord.city.push(c.nodeNumber)
    }
    for(let r of player.road){
      let road = {roadNumber:r.roadNumber, roadDegree:r.roadDegree}
      playerRecord.road.push(road)
    }
    for(let p in player.progress){
      playerRecord.progress[p] = player.progress[p]
    }
    for(let u in player.used){
      playerRecord.used[u] = player.used[u]
    }
    playerRecord.largestArmy = player.largestArmy
    playerRecord.longestRoad = player.longestRoad
    record.players.push(playerRecord)
  }
  record.thief = board.tileButtonPositionToNumber(board.thief.position)
  record.dice[0] = board.dice[0]
  record.dice[1] = board.dice[1]
  record.progress = game.progressDeck.length
  let lastTurn = gameRecord[gameRecord.length-1]
  if(lastTurn.length > 0){
    let lastAction = lastTurn[lastTurn.length-1]
    lastAction.undo = false
  }else if(gameRecord.length >= 2){
    let previousTurn = gameRecord[gameRecord.length-2]
    let lastAction = previousTurn[previousTurn.length-1]
    lastAction.undo = false
  }
  gameRecord[gameRecord.length-1].push(record)
}
function makeNewTurnRecord(){
  gameRecord.push([])
}
function deleteLastAction(){
  let lastTurn = gameRecord[gameRecord.length-1]
  if(lastTurn.length > 0){
    let lastAction = lastTurn[lastTurn.length-1]
    if(lastAction.undo === true){
      lastTurn.pop()
    }
  }else{
    let previousTurn = gameRecord[gameRecord.length-2]
    let lastAction = previousTurn[previousTurn.length-1]
    if(lastAction.undo === true || game.phase === 'beforedice'){
      gameRecord.pop()
    }
    if(gameRecord.length === 1){
      gameRecord[0].pop()
    }
  }
}
function lastActionUndeletable(){
  let lastTurn = gameRecord[gameRecord.length-1]
  let lastAction
  if(lastTurn.length > 0){
    lastAction = lastTurn[lastTurn.length-1]
  }else{
    let previousTurn = gameRecord[gameRecord.length-2]
    lastAction = previousTurn[previousTurn.length-1]
  }
  lastAction.undo = false
}
function updateDatabase(winner){
  let pl = game.players.length
  //winner更新
  const losersInitialProductivity = {ore:0,grain:0,wool:0,lumber:0,brick:0}
  for(let player of game.players){
    if(player !== winner){
      for(let resource in losersInitialProductivity){
        losersInitialProductivity[resource] += player.initial_productivity[resource]
      }
    }
  }
  const newWinner = "insert into winner (start_time, name, number_of_players, my_number, turn, used_ore, used_grain, used_wool, used_lumber, used_brick, road_on_board, house_on_board, city_on_board, largestarmy, longestroad, owned_point, owned_knight, owned_roadbuild, owned_monopoly, owned_harvest, lastpoint, ore_initial_productivity, grain_initial_productivity, wool_initial_productivity, lumber_initial_productivity, brick_initial_productivity, ore_initial_productivity_of_losers, grain_initial_productivity_of_losers, wool_initial_productivity_of_losers, lumber_initial_productivity_of_losers, brick_initial_productivity_of_losers, negotiate, seven, gameid) values('" + JSON.stringify(game.startTime) + "', '" + winner.name + "', " + String(pl) + ", " + String(winner.number+1) + ", " + board.diceCount.total + ", " + String(winner.totalUse.ore) + ", " + String(winner.totalUse.grain) + ", " + String(winner.totalUse.wool) + ", " + String(winner.totalUse.lumber) + ", " + String(winner.totalUse.brick) + ", " + String(15-winner.token.road) + ", " + String(5-winner.token.house) + ", " + String(4-winner.token.city) + ", " + String(winner.largestArmy) + ", " + String(winner.longestRoad) + ", " + String(winner.progress.point) + ", " + String(winner.progress.knight+winner.used.knight) + ", " + String(winner.progress.roadbuild+winner.used.roadbuild) + ", " + String(winner.progress.monopoly+winner.used.monopoly) + ", " + String(winner.progress.harvest+winner.used.harvest) + ", '" + String(winner.lastPoint) + "', " + winner.initial_productivity.ore + ", " + winner.initial_productivity.grain + ", " + winner.initial_productivity.wool + ", " + winner.initial_productivity.lumber + ", " + winner.initial_productivity.brick + ", " + losersInitialProductivity.ore + ", " + losersInitialProductivity.grain + ", " + losersInitialProductivity.wool + ", " + losersInitialProductivity.lumber + ", " + losersInitialProductivity.brick + ", " + winner.negotiate + ", " + winner.seven + ", '" + game.gameID + "')";
  client.query(newWinner)
  .then((res) => {
  })
  .catch((e) => {
  });
  //loser更新
  for(let player of game.players){
    if(player !== winner){
      const newLoser = "insert into loser (start_time, name, number_of_players, my_number, turn, used_ore, used_grain, used_wool, used_lumber, used_brick, road_on_board, house_on_board, city_on_board, largestarmy, longestroad, owned_point, owned_knight, owned_roadbuild, owned_monopoly, owned_harvest, lastpoint, ore_initial_productivity, grain_initial_productivity, wool_initial_productivity, lumber_initial_productivity, brick_initial_productivity, ore_initial_productivity_of_losers, grain_initial_productivity_of_losers, wool_initial_productivity_of_losers, lumber_initial_productivity_of_losers, brick_initial_productivity_of_losers, negotiate, seven, gameid) values('" + JSON.stringify(game.startTime) + "', '" + player.name + "', " + String(pl) + ", " + String(player.number+1) + ", " + board.diceCount.total + ", " + String(player.totalUse.ore) + ", " + String(player.totalUse.grain) + ", " + String(player.totalUse.wool) + ", " + String(player.totalUse.lumber) + ", " + String(player.totalUse.brick) + ", " + String(15-player.token.road) + ", " + String(5-player.token.house) + ", " + String(4-player.token.city) + ", " + String(player.largestArmy) + ", " + String(player.longestRoad) + ", " + String(player.progress.point) + ", " + String(player.progress.knight+player.used.knight) + ", " + String(player.progress.roadbuild+player.used.roadbuild) + ", " + String(player.progress.monopoly+player.used.monopoly) + ", " + String(player.progress.harvest+player.used.harvest) + ", '" + String(player.lastPoint) + "', " + player.initial_productivity.ore + ", " + player.initial_productivity.grain + ", " + player.initial_productivity.wool + ", " + player.initial_productivity.lumber + ", " + player.initial_productivity.brick + ", " + losersInitialProductivity.ore + ", " + losersInitialProductivity.grain + ", " + losersInitialProductivity.wool + ", " + losersInitialProductivity.lumber + ", " + losersInitialProductivity.brick + ", " + player.negotiate + ", " + player.seven + ", '" + game.gameID + "')";
      client.query(newLoser)
      .then((res) => {
      })
      .catch((e) => {
      });
    }
  }
  let playersName = []
  for(let player of game.players){
    playersName.push(player.name)
  }
  //game更新
  const Record = "insert into game (start_time, players, board, record, gameid) values('" + JSON.stringify(game.startTime) + "', '" + JSON.stringify(playersName) + "', '" + JSON.stringify(board.island) + "', '" + JSON.stringify(gameRecord) + "', '" + game.gameID + "')"
  client.query(Record)
  .then((res) => {
  })
  .catch((e) => {
  });
  if(pl <= 2){
    return
  }
  let w = ''
  let losers = []
  for(let player of game.players){
    if(player === winner){
      w = {name:player.name, rating:player.rating}
    }else{
      losers.push({name:player.name, rating:player.rating})
    }
  }
  //player更新
  for(let player of game.players){
    const query = "select * from player where name = '" + player.name + "'";
    client
    .query(query)
    .then((res) => {
      if(player === winner){
        let winx = 'win' + String(pl)
        res.rows[0][winx] += 1
        res.rows[0].activestreakwins += 1
        if(res.rows[0].activestreakwins > res.rows[0].beststreakwins){
          res.rows[0].beststreakwins = res.rows[0].activestreakwins
        }
        player.rating = rating.winnersNewRating(player, losers)
        if(player.rating > res.rows[0].bestrating){
          res.rows[0].bestrating = player.rating
        }
        const query = "update player set " + winx + " = " + res.rows[0][winx] + ", rating = " + player.rating + ", activestreakwins = " + res.rows[0].activestreakwins + ", beststreakwins = " + res.rows[0].beststreakwins + ", bestrating = " + res.rows[0].bestrating + " where name = '" + player.name + "'";
        client.query(query)
        .then((res) => {
        })
        .catch((e) => {
        });
      }else{
        let losex = 'lose' + String(pl)
        res.rows[0][losex] += 1
        player.rating = rating.losersNewRating(player, w)
        const query = "update player set " + losex + " = " + res.rows[0][losex] + ", rating = " + player.rating + ", activestreakwins = 0 where name = '" + player.name + "'";
        client.query(query)
        .then((res) => {
        })
        .catch((e) => {
        });
      }
    })
    .catch((e) => {
    });
  }
  //gameresult更新
  const query = "select * from gameresult where playersnumber = '" + String(pl) + "'"
  client
  .query(query)
  .then((res) => {
    let pn = 'player' + String(winner.number+1)
    res.rows[0][pn] += 1
    const query = "update gameresult set " + pn + " = " + res.rows[0][pn] + " where playersnumber = " + pl;
    client
    .query(query)
    .then((res) => {
    })
    .catch((e) => {
    });
  })
  .catch((e) => {
  });
}
function total(object){
  let total = 0
  for(let key in object){
      total += object[key]
  }
  return total
}
function makeSelectQuery(columnName, tableName){
  const query = "select " + columnName + " from " + tableName
  return query
}
function randomString(){
  const letter ='abcdefghijklmnopqrstuvwxyz0123456789'
  let string = ''
  let i = 1
  while(i <= 8){
    const number = Math.floor(Math.random() * letter.length)
    string += letter[number]
    i += 1
  }
  return string
}
function returnAllgames(res){
  const query = "select start_time,name,gameid from winner order by start_time";
      client
      .query(query)
      .then((resdata) => {
        if(resdata.rows[0]){
          const games = resdata.rows
          res.render(DOCUMENT_ROOT + "/Search-Games.ejs", {data:games});
        }
      })
      .catch((e) => {
      });
}
function returnStatictics(res){
  const statistics = {winner:{}, loser:{}}
  const exclude_item = ["number_of_players", "my_number", "turn", "ore_initial_productivity_of_losers", "grain_initial_productivity_of_losers", "wool_initial_productivity_of_losers", "lumber_initial_productivity_of_losers", "brick_initial_productivity_of_losers"]
  const query = "select * from winner";
      client
      .query(query)
      .then((resdata) => {
        if(resdata.rows[0]){
          const winnersdata = resdata.rows
          for(let key in winnersdata[0]){
            let totalamount = 0;
            let number = 0;
            if(!exclude_item.includes(key)){
              for(let data of winnersdata){
                if(typeof data[key] === "number"){
                  totalamount += data[key];
                  number++;
                }
              }
            }
            if(typeof totalamount === "number" && Boolean(totalamount) && number !== 0){
              statistics.winner[translate(key)] = totalamount / number;
            }
          }
          let allprogress = statistics.winner[translate('owned_point')] + statistics.winner[translate('owned_knight')] + statistics.winner[translate('owned_roadbuild')] + statistics.winner[translate('owned_monopoly')] + statistics.winner[translate('owned_harvest')]
          statistics.winner[translate('owned_point')] /= allprogress
          statistics.winner[translate('owned_knight')] /= allprogress
          statistics.winner[translate('owned_roadbuild')] /= allprogress
          statistics.winner[translate('owned_monopoly')] /= allprogress
          statistics.winner[translate('owned_harvest')] /= allprogress
        }
        const query2 = "select * from loser";
        client
        .query(query2)
        .then((resdata) => {
          if(resdata.rows[0]){
            const losersdata = resdata.rows
            for(let key in losersdata[0]){
              let totalamount = 0;
              let number = 0;
              if(!exclude_item.includes(key)){
                for(let data of losersdata){
                  if(typeof data[key] === "number"){
                    totalamount += data[key];
                    number++;
                  }
                }
              }
              if(typeof totalamount === "number" && Boolean(totalamount) && number !== 0){
                statistics.loser[translate(key)] = totalamount / number;
              }
            }
            let allprogress = statistics.loser[translate('owned_point')] + statistics.loser[translate('owned_knight')] + statistics.loser[translate('owned_roadbuild')] + statistics.loser[translate('owned_monopoly')] + statistics.loser[translate('owned_harvest')]
            statistics.loser[translate('owned_point')] /= allprogress
            statistics.loser[translate('owned_knight')] /= allprogress
            statistics.loser[translate('owned_roadbuild')] /= allprogress
            statistics.loser[translate('owned_monopoly')] /= allprogress
            statistics.loser[translate('owned_harvest')] /= allprogress
            for(let worl in statistics){
              for(let key in statistics[worl]){
                statistics[worl][key] = Math.round(statistics[worl][key] * 1000)/1000
              }
            }
            const compare = {}
            for(let key in statistics.winner){
              if(statistics.winner[key] > statistics.loser[key]){
                compare[key] = '>'
              }else if(statistics.winner[key] < statistics.loser[key]){
                compare[key] = '<'
              }else{
                compare[key] = '='
              }
            }
            statistics.compare = compare
            res.render(DOCUMENT_ROOT + "/Statistics.ejs", {data:statistics});
          }
        })
        .catch((e) => {
        });
      })
      .catch((e) => {
      });
}
function translate(word){
  switch(word){
      case 'used_ore':
          return '鉄'
      case 'used_grain':
          return '米'
      case 'used_wool':
          return '羊'
      case 'used_lumber':
          return '木'
      case 'used_brick':
          return '煉'
      case 'road_on_board':
          return '道'
      case 'house_on_board':
          return '家'
      case 'city_on_board':
          return '街'
      case 'largestarmy':
          return '騎士賞'
      case 'longestroad':
          return '道賞'
      case 'owned_point':
          return '得点'
      case 'owned_knight':
          return '騎士'
      case 'owned_roadbuild':
          return '街道'
      case 'owned_monopoly':
          return '独占'
      case 'owned_harvest':
          return '収穫'
      case 'ore_initial_productivity':
          return '初期鉄'
      case 'grain_initial_productivity':
          return '初期米'
      case 'wool_initial_productivity':
          return '初期羊'
      case 'lumber_initial_productivity':
          return '初期木'
      case 'brick_initial_productivity':
          return '初期煉'
      case 'negotiate':
          return '交渉'
      case 'seven':
          return 'ダイス7'
  }
}

io.on("connection", (socket)=>{

  //画面の表示
  display.allMightyTo(socket.id)
  /*if(game.phase !== 'nameinputting'){
    setTimeout(()=>{
      io.to(socket.id).emit('pleasetakeover','')
    },3000)
  }*/
  
  //名前の入力
  socket.on("nameInput", (namedata)=>{
    if(!game.arrayHasID(playersName, socket.id) && playersName.length < maxPlayer){
      playersName.push({name:namedata.name, socketID:namedata.socketID})
      io.emit("nameInput", playersName);     
    }
  });

  //スタートボタンクリック
  socket.on('start', (data)=>{
    playersName = shuffle(playersName)
    if(playersName.length >= 1){
      const now = new Date()
      game.startTime = now
      game.gameID = randomString()
      game.gameStart()
      board.islandData = data
      board.resizeBoard(data.size)
      game.progressDeckMake()
      board.makeIsland(data)
      display.buildings()
      display.island()
      display.relativeNodes()
      display.thief()
      display.allPlayerInformation()
      display.resetRate()
      display.deletePlayLog()
      if(victoryPoint !== 10){
        io.emit('not10point',victoryPoint)
      }
    }else{
      display.hideReceivingArea()
    }

  });
    //nodeをクリック
    socket.on('nodeclick',(data)=>{
      let position = board.nodeNumberToPosition(data.nodeNumber)
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
      }else if(game.phase === 'afterdice' || game.phase === 'building' || game.phase === 'setup'){
        if(board.nodeCondition(position) === 'blank'){
          game.turnPlayer.build('house', position)
        }else if(board.nodeCondition(position).type === 'house'){
          game.turnPlayer.build('city', position)
        }else{
          display.hideReceivingArea()
        }
      }else if(game.phase === 'robresource'){
        game.turnPlayer.robResource(position)
      }else{
        display.hideReceivingArea()
      }
    });
    //roadをクリック
    socket.on('roadclick',(data)=>{
      let position = board.roadNumberToPosition(data.roadNumber)
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
      }else if(game.phase === 'afterdice' || game.phase === 'building' || game.phase === 'setup' || game.phase === 'roadbuild1' || game.phase === 'roadbuild2'){
        game.turnPlayer.build('road', position)
      }else{
        display.hideReceivingArea()
      }
    });
    //ダイスボタンをクリック
    socket.on('diceclick',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID|| game.phase !== 'beforedice'){
        display.hideReceivingArea()
      }else{
        board.rollDice()
      }
    });
    //ドローボタンをクリック
    socket.on('drawclick',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
      }else{
        game.turnPlayer.draw()
      }
    });
    //騎士ボタンをクリック
    socket.on('knightclick',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
      }else{
        game.turnPlayer.knightuse()
      }
    });
    //タイルボタンをクリック
    socket.on('thiefmove',(data)=>{
      let position = board.tileButtonNumberToPosition(data.tileButtonNumber)
      board.tileButtonPositionToNumber(position)
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
      }else if(game.phase === 'thiefmove'){
        game.turnPlayer.thiefmove(position)
      }else{
        display.hideReceivingArea()
      }
    });
    //独占ボタンをクリック
    socket.on('monopolybutton',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
      }else if(game.phase === 'afterdice' && game.turnPlayer.progressUse === 0 && game.turnPlayer.progress.monopoly - game.turnPlayer.thisTurnDraw.monopoly >= 1){
        game.phase = 'monopoly'
        display.showMyMonopolyArea(game.turnPlayer.socketID)
        display.hideReceivingArea()
      }else if(game.phase === 'monopoly'){
        game.phase = 'afterdice'
        display.hideMyMonopolyArea(game.turnPlayer.socketID)
        display.hideReceivingArea()
      }else{
        display.hideReceivingArea()
      }
    });
    //独占やめるボタンをクリック
    socket.on('quitmonopoly',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
        return
      }else if(game.phase === 'monopoly'){
        game.phase = 'afterdice'
        display.hideMyMonopolyArea(data.socketID)
        display.hideReceivingArea()
      }else{
        display.hideReceivingArea()
      }
    });
    //独占資源ボタンをクリック
    socket.on('monopoly',(data)=>{
      let resource = data.resource
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
      }else if(game.phase === 'monopoly'){
        game.turnPlayer.monopoly(resource)
      }else{
        display.hideReceivingArea()
      }
    });
    //収穫ボタンをクリック
    socket.on('harvestbutton',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
      }else if(game.phase === 'afterdice' && game.turnPlayer.progressUse === 0 && game.turnPlayer.progress.harvest - game.turnPlayer.thisTurnDraw.harvest >= 1){
        game.phase = 'harvest1'
        display.showMyHarvestArea(game.turnPlayer.socketID)
        display.hideReceivingArea()
      }else if(game.phase === 'harvest1'){
        game.phase = 'afterdice'
        display.hideMyHarvestArea(game.turnPlayer.socketID)
        display.hideReceivingArea()
      }else{
        display.hideReceivingArea()
      }
    });
    //収穫やめるボタンをクリック
    socket.on('quitharvest',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
      }else if(game.phase === 'harvest1'){
        game.phase = 'afterdice'
        display.hideMyHarvestArea(data.socketID)
        display.hideReceivingArea()
      }else{
        display.hideReceivingArea()
      }
    });
    //収穫資源ボタンをクリック
    socket.on('harvest',(data)=>{
      let resource = data.resource
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
      }else if(game.phase === 'harvest1' || game.phase === 'harvest2'){
        game.turnPlayer.harvest(resource)
      }else{
        display.hideReceivingArea()
      }
    });
    //街道建設ボタンをクリック
    socket.on('roadbuildclick',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
      }else if(game.phase === 'afterdice'){
        game.turnPlayer.roadBuild()
      }else{
        display.hideReceivingArea()
      }
    });
    //終了ボタンをクリック
    socket.on('endbuttonclick',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
      }else if(game.phase === 'afterdice' || game.phase === 'building'){
        game.turnPlayer.turnEnd()
      }else{
        display.hideReceivingArea()
      }
    });
    /*//バースト資源ボタンをクリック
    socket.on('burst',(data)=>{
      let resource = data.resource
      let player = game.IDToPlayer(data.socketID)
      if(!game.burstPlayer.includes(player)){
        display.hideReceivingArea()
      }else if(game.phase === 'burst'){
        player.trash(resource)
      }else{
        display.hideReceivingArea()
      }
    });*/
    //バースト決定ボタンをクリック
    socket.on('keepresource',(data)=>{
      let keepresource = data.keepresource
      let player = game.IDToPlayer(data.socketID)
      player.keep(keepresource)
    })
    //貿易ボタンをクリック
    socket.on('tradebuttonclick',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
      }else if(game.phase === 'afterdice'){
        game.phase = 'trade'
        display.showMyTradeArea(game.turnPlayer.socketID)
        display.hideReceivingArea()
      }else if(game.phase === 'trade'){
        game.phase = 'afterdice'
        display.hideMyTradeArea(game.turnPlayer.socketID)
        display.hideReceivingArea()
      }else{
        display.hideReceivingArea()
      }
    });
    //貿易決定ボタンをクリック
    socket.on('tradedecide',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
      }else if(game.phase === 'trade'){
        game.turnPlayer.trade(data)
      }else{
        display.hideReceivingArea()
      }
    });
    //貿易やめるボタンをクリック
    socket.on('quittrade',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
        display.hideReceivingArea()
      }else if(game.phase === 'trade'){
        game.phase = 'afterdice'
        display.hideMyTradeArea(data.socketID)
        display.hideReceivingArea()
      }else{
        display.hideReceivingArea()
      }
    });
    //交渉ボタンをクリック
    socket.on('negotiatebuttonclick',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
      }else if(game.phase === 'afterdice'){
        game.phase = 'negotiate'
        display.showMyNegotiateArea(game.turnPlayer.socketID)
        display.hideReceivingArea()
      }else if(game.phase === 'negotiate'){
        game.phase = 'afterdice'
        display.hideMyNegotiateArea(game.turnPlayer.socketID)
        display.hideReceivingArea()
      }else{
        display.hideReceivingArea()
      }
    });
    //交渉相手ボタンをクリック
    socket.on('propose',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
      }else if(game.phase === 'negotiate'){
        game.phase = 'propose'
        game.proposedata = {proposer:game.turnPlayer, proposee:game.players[data.counterpartnumber], giveresource:data.giveresource, takeresource:data.takeresource}
        display.hideMyNegotiateArea(game.proposedata.proposer.socketID)
        display.showProposeArea()
        display.hideReceivingArea()
        const logdata = {action:'propose', playername:game.turnPlayer.name, proposee:game.proposedata.proposee.name, giveresource:data.giveresource, takeresource:data.takeresource, turnPlayerID:game.turnPlayer.socketID}
        display.playLog(logdata)
      }else{
        display.hideReceivingArea()
      }
    });
    //交渉やめるボタンをクリック
    socket.on('quitnegotiate',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID){
        display.hideReceivingArea()
      }else if(game.phase === 'negotiate'){
        game.phase = 'afterdice'
        display.hideMyNegotiateArea(data.socketID)
        display.hideReceivingArea()
      }else{
        display.hideReceivingArea()
      }
    });
    //同意ボタンをクリック
    socket.on('accept',(data)=>{
      if(data.socketID !== game.proposedata.proposee.socketID){
        display.hideReceivingArea()
      }else if(game.phase === 'propose'){
        game.proposedata.proposer.accepted()
      }else{
        display.hideReceivingArea()
      }
    });
    //断るボタンをクリック
    socket.on('deny',(data)=>{
      if(data.socketID !== game.proposedata.proposee.socketID){
        display.hideReceivingArea()
      }else if(game.phase === 'propose'){
        game.proposedata.proposer.denied()
      }else{
        display.hideReceivingArea()
      }
    });
    //もう一度遊ぶ
    socket.on('newgamebuttonclick', (data)=>{
      game.IDToPlayer(data.socketID).replay = true
      for(let player of game.players){
        if(player.replay === false){
          display.hideReceivingArea()
          return
        }
      }
      game.newGame();
    })
    //初期化
    socket.on('yesbuttonclick', (e)=>{
      initialize()
    })
    //継承,建築フェイズ放棄
    socket.on('takeover', (player)=>{
      let socketID = player.socketID
      for(let p of game.players){
        if(socketID === p.socketID){
          if(socketID === game.players[player.number].socketID){
            p.renounceBuilding()
          }else{
            display.hideReceivingArea()
          }
          return
        }
      }
      game.takeOver(player)
    })
    socket.on('undo', (socketID)=>{
      if(game.phase === 'burst'){
        let myself = game.IDToPlayer(socketID)
        if(myself){
          myself.unDo()
          if(myself.toTrash > 0 && !game.burstPlayer.includes(myself)){
            game.burstPlayer.push(myself)
          }
        }
        display.showBurstArea()
        display.allResource()
      }else if(socketID === game.lastActionPlayer.socketID){
        unDo()
        display.allMighty()
        const logdata = {action:'undo', playername:game.lastActionPlayer.name, turnPlayerID:game.turnPlayer.socketID}
        display.message(logdata)
        display.playLog(logdata)
      }else{
        display.hideReceivingArea()
        display.hideReceivingArea()
      }
    })
    //コンソールに表示
    socket.on('console',()=>{
      io.emit('console', game)
    })

    //過去ゲームデータ送信
    socket.on('replaygame', (data)=>{
      const query = "select * from game where gameid = '" + data.gameID + "'";
      client
      .query(query)
      .then((res) => {
        if(res.rows[0]){
          const {players, board, record} = res.rows[0]
          const game = {players:JSON.parse(players), board:JSON.parse(board), gameRecord:JSON.parse(record)}
          io.to(data.socketID).emit('replaygame',game)
        }
      })
      .catch((e) => {
      });
    })
})
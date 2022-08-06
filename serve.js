const { Console } = require("console");
const { createSocket } = require("dgram");
const { emit, off } = require("process");
const { isStringObject } = require("util/types");
const { brotliCompress } = require("zlib");

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
const properPlayer = 6
let playersName = []
let m = 1
while(m <= maxPlayer){
  playersName.push('')
  m += 1
}
const buildResource = {house:{ore:0,grain:1,wool:1,lumber:1,brick:1}, city:{ore:3,grain:2,wool:0,lumber:0,brick:0}, progress:{ore:1,grain:1,wool:1,lumber:0,brick:0}, road:{ore:0,grain:0,wool:0,lumber:1,brick:1}}
const progress = {knight:20, roadbuild:3, harvest:3, monopoly:3, point:5}
const resourceType = ['ore','mugi','wool','lumber','brick']


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
  renounce:false}
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
  renounce:false}
  };
  recordLog(){
    for(let resource in this.resource){
      this.log.resource[resource] = this.resource[resource]
      this.log.tradeRate[resource] = this.tradeRate[resource]
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
    this.log.largestArmy = this.largestArmy
    this.log.longestRoad = this.longestRoad
    this.log.longestLength = this.longestLength
    this.log.point = this.point
    this.log.progressUse = this.progressUse
    this.log.dice = this.dice
    this.log.toTrash = this.toTrash
    this.log.renounce = this.renounce
  };
  unDo(){
    for(let resource in this.log.resource){
      this.resource[resource] = this.log.resource[resource]
      this.tradeRate[resource] = this.log.tradeRate[resource]
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
    this.largestArmy = this.log.largestArmy
    this.longestRoad = this.log.longestRoad
    this.longestLength = this.log.longestLength
    this.point = this.log.point
    this.progressUse = this.log.progressUse
    this.dice = this.log.dice
    this.toTrash = this.log.toTrash
    this.renounce = this.log.renounce
  }
  build(item, position){
    if(item === 'house'){
      //初期配置
      if(game.phase === 'setup' && this.house.length === this.road.length){
        //既に家がないか,周りに家がないか確認
        if(board.nodeCondition(position) !== 'blank'){
          display.hideReceivingArea()
          return
        }//問題なければ建設
        else{
          recordLog()
          game.lastActionPlayer = this
          this.token.house -= 1
          this.house.push({position:position, nodeNumber: board.nodePositionToNumber(position)})
          board.house.push({type:'house', position:position, nodeNumber: board.nodePositionToNumber(position), owner:this})
          let tiles = board.tilesAroundNode(position)
          for(let tileposition of tiles){
            let tile = board.island[tileposition[0]][tileposition[1]]
            tile.houseOwner.push(this)
          }
        }
        //二軒目なら資源獲得
        if(this.house.length === 2){
          let tiles = board.tilesAroundNode(position)
          for(let tileposition of tiles){
            let tile = board.island[tileposition[0]][tileposition[1]]
            if(tile.produce){
              this.resource[tile.type] += 1
            }
          }
        }
        this.constructPort(position)
        board.longestCheck()
        game.pointReload()
        display.allPlayerInformation()
        display.buildings()
      }
      if(game.phase === 'afterdice'|| game.phase === 'building'){
        //既に家がないか確認
        if(board.nodeCheck(position) !== 'blank'){
          display.hideReceivingArea()
          return
        }
        //資源の確認
        if(!this.resourceCheck(item)){
          display.hideReceivingArea()
          return
        }
        //周りに家がないか確認
        if(board.aroundNodesCheck(position) !== 'blank'){
          display.hideReceivingArea()
          return
        }
        //道がつながっているか確認
        if(!this.IhaveRoadAroundNode(position)){
          display.hideReceivingArea()
          return
        }
        //手元に家があるか確認
        if(this.token[item] === 0){
          display.hideReceivingArea()
          return
        }
        //問題なければ建設
        recordLog()
        game.lastActionPlayer = this
        this.token.house -= 1
        this.house.push({position:position, nodeNumber: board.nodePositionToNumber(position)})
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
        display.allPlayerInformation()
        display.buildings()
      }
    }else if(item === 'city'){
      if(game.phase === 'afterdice'|| game.phase === 'building'){
        //自分の家があるか確認
        if(board.nodeCondition(position).type !== 'house' || board.nodeCondition(position).owner !== this){
          display.hideReceivingArea()
          return
        }
        //資源の確認
        if(!this.resourceCheck(item)){
          display.hideReceivingArea()
          return
        }
        //手元に都市があるか確認
        if(this.token[item] === 0){
          display.hideReceivingArea()
          return
        }
        //問題なければ建設
        recordLog()
        game.lastActionPlayer = this
        this.token.city -= 1
        this.token.house += 1
        this.city.push({position:position, nodeNumber: board.nodePositionToNumber(position)})
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
        display.allPlayerInformation()
        display.buildings()
      }
    }else if(item === 'road'){
      if(game.phase === 'setup' && this.house.length === this.road.length+1){
        //既に道がないか確認
        if(board.roadCheck(position) !== 'blank'){
          display.hideReceivingArea()
          return
        }//どちらかの端に今建てた家があるか確認
        else if(!this.justNowHouse(position)){
          display.hideReceivingArea()
          return
        }
        //問題なければ建設
        recordLog()
        game.lastActionPlayer = this
        this.token.road -= 1
        this.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position)})
        board.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position), owner:this})
        board.longestCheck()
        game.pointReload()
        display.allPlayerInformation()
        display.buildings()
        game.turnEndSetup()
      }else if(game.phase === 'afterdice'|| game.phase === 'building'){
        //既に道がないか確認
        if(board.roadCheck(position) !== 'blank'){
          display.hideReceivingArea()
          return
        }
        //周りに自分の道があるか確認
        if(!this.IhaveRoadAroundRoad(position)){
          display.hideReceivingArea()
          return
        }
        //資源の確認
        if(!this.resourceCheck(item)){
          display.hideReceivingArea()
          return
        }//手元に道があるか確認
        if(this.token[item] === 0){
          display.hideReceivingArea()
          return
        }
        //問題なければ建設
        recordLog()
        game.lastActionPlayer = this
        this.token.road -= 1
        this.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position)})
        board.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position), owner:this})
        this.useResource(item)
        board.longestCheck()
        game.pointReload()
        display.allPlayerInformation()
        display.buildings()
      }else if(game.phase === 'roadbuild1'){
        //既に道がないか確認
        if(board.roadCheck(position) !== 'blank'){
          display.hideReceivingArea()
          return
        }
        //周りに自分の道があるか確認
        if(!this.IhaveRoadAroundRoad(position)){
          display.hideReceivingArea()
          return
        }
        //手元に道があるか確認
        if(this.token[item] === 0){
          display.hideReceivingArea()
          return
        }
        //問題なければ建設
        recordLog()
        game.lastActionPlayer = this
        this.token.road -= 1
        this.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position)})
        board.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position), owner:this})
        board.longestCheck()
        game.pointReload()
        display.allPlayerInformation()
        display.buildings()
        if(this.token.road >= 1){
          game.phase = 'roadbuild2'
        }else{
          game.phase = 'afterdice'
        }
        display.toggleMyButtons(game.turnPlayer.socketID)
      }else if(game.phase === 'roadbuild2'){
        //既に道がないか確認
        if(board.roadCheck(position) !== 'blank'){
          return
        }
        //周りに自分の道があるか確認
        if(!this.IhaveRoadAroundRoad(position)){
          return
        }
        //手元に道があるか確認
        if(this.token[item] === 0){
          return
        }
        //問題なければ建設
        recordLog()
        game.lastActionPlayer = this
        this.token.road -= 1
        this.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position)})
        board.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position), owner:this})
        board.longestCheck()
        game.pointReload()
        display.allPlayerInformation()
        display.buildings()
        game.phase = 'afterdice'
        display.toggleMyButtons(game.turnPlayer.socketID)
      }
    }else{
      display.hideReceivingArea()
    }
    
  };
  draw(){
    if(game.phase === 'afterdice'|| game.phase === 'building'){
      if(game.progressDeck.length === 0){
        display.hideReceivingArea()
        return
      }
      if(!this.resourceCheck('progress')){
        display.hideReceivingArea()
        return
      }
      this.useResource('progress')
      this.progress[game.progressDeck[0]] += 1
      this.thisTurnDraw[game.progressDeck[0]] += 1
      game.progressDeck.splice(0, 1)
      game.pointReload()
      display.allPlayerInformation()
      recordLog()
      game.lastActionPlayer = this
    }
    display.hideReceivingArea()
  };
  knightuse(){
    if(game.phase !== 'beforedice' && game.phase !== 'afterdice'){
      display.hideReceivingArea()
      return
    }
    if(this.progress.knight - this.thisTurnDraw.knight <= 0){
      display.hideReceivingArea()
      return
    }
    if(this.progressUse >= 1){
      display.hideReceivingArea()
      return
    }
    recordLog()
    game.lastActionPlayer = this
    game.phase = 'thiefmove'
    this.progressUse += 1
    this.progress.knight -= 1
    this.used.knight += 1
    this.largestArmyCheck()
    game.pointReload()
    display.allPlayerInformation()
    display.toggleMyButtons(game.turnPlayer.socketID)
    display.hideReceivingArea()
  };
  thiefmove(position){
    if(game.phase !== 'thiefmove'){
      display.hideReceivingArea()
      return
    }
    if(arrayComparison(position, board.thief.position)){
      display.hideReceivingArea()
      return
    }
    recordLog()
    game.lastActionPlayer = this
    display.deleteThief()
    board.thief = board.island[position[0]][position[1]]
    display.thief()
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
    }else{
      game.phase = 'afterdice'
      display.diceBlack()
    }
    display.showMyButtonArea(game.turnPlayer.socketID)
  };
  robResource(position){
    let target = board.nodeCondition(position).owner
    if(target === this){
      display.hideReceivingArea()
      return
    }
    if(target.totalResource() === 0){
      display.hideReceivingArea()
      return
    }
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
    display.allPlayerInformation()
    if(this.dice === 1){
      game.phase = 'beforedice'
    }else{
      game.phase = 'afterdice'
    }
    display.diceBlack()
    display.showMyButtonArea(game.turnPlayer.socketID)
    recordLog()
    game.lastActionPlayer = this
    display.hideReceivingArea()
  };
  monopoly(resource){
    if(game.phase !== 'monopoly'){
      display.hideReceivingArea()
      return
    }
    if(this.progress.monopoly - this.thisTurnDraw.monopoly <= 0){
      display.hideReceivingArea()
      return
    }
    if(this.progressUse >= 1){
      display.hideReceivingArea()
      return
    }
    this.progressUse += 1
    this.progress.monopoly -= 1
    this.used.monopoly += 1
    for(let player of game.players){
      if(player !== this){
        this.resource[resource] += player.resource[resource]
        player.resource[resource] = 0
      }
    }
    game.phase = 'afterdice'
    recordLog()
    game.lastActionPlayer = this
    display.hideMyMonopolyArea(this.socketID)
    display.allPlayerInformation()
    display.hideReceivingArea()
  };
  harvest(resource){
    if(game.phase !== 'harvest1' && game.phase !== 'harvest2'){
      display.hideReceivingArea()
      return
    }
    if(game.phase === 'harvest1'){
      if(this.progress.harvest - this.thisTurnDraw.harvest <= 0){
        display.hideReceivingArea()
        return
      }
      if(this.progressUse >= 1){
        display.hideReceivingArea()
        return
      }
      recordLog()
      game.lastActionPlayer = this
      this.progressUse += 1
      this.progress.harvest -= 1
      this.used.harvest += 1
      this.resource[resource] += 1
      game.phase = 'harvest2'
    }else if(game.phase === 'harvest2'){
      this.resource[resource] += 1
      game.phase = 'afterdice'
      display.hideMyHarvestArea(this.socketID)
    }
    display.allPlayerInformation()
    display.hideReceivingArea()
  }
  roadBuild(){
    if(game.phase !== 'afterdice'){
      display.hideReceivingArea()
      return
    }
    if(this.progress.roadbuild - this.thisTurnDraw.roadbuild <= 0){
      display.hideReceivingArea()
      return
    }
    if(this.progressUse >= 1){
      display.hideReceivingArea()
      return
    }
    recordLog()
    game.lastActionPlayer = this
    this.progressUse += 1
    this.progress.roadbuild -= 1
    this.used.roadbuild += 1
    if(this.token.road >= 1){
      game.phase = 'roadbuild1'
    }
    display.allPlayerInformation()
    display.toggleMyButtons(game.turnPlayer.socketID)
    display.hideReceivingArea()
  }
  turnEnd(){
    recordLog()
    game.lastActionPlayer = this
    this.progressUse = 0
    this.dice = 1
    this.thisTurnDraw = {knight:0, roadbuild:0, harvest:0, monopoly:0, point:0}
    game.turnEnd()
    display.hideReceivingArea()
  }
  trash(resource){
    if(this.resource[resource] < 1){
      display.hideReceivingArea()
      return
    }
    if(this.toTrash >= 1){
      this.resource[resource] -= 1
      this.toTrash -= 1 
    }
    if(this.toTrash === 0){
      discard(this, game.burstPlayer)
      if(game.burstPlayer.length === 0){
        game.phase = 'thiefmove'
        display.hideBurstArea()
      }else{
        display.showBurstArea()
      }
    }else{
      display.showBurstArea()
    }
    display.allPlayerInformation()
    display.hideReceivingArea()
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
    }
  };
  //最大騎士力チェック
  largestArmyCheck(){
    if(this.used.knight >= 3){
      if(game.largestArmyPlayer === ''){
        game.largestArmyPlayer = this
        this.largestArmy = 2
      }else if(this.used.knight > game.largestArmyPlayer.used.knight){
        game.largestArmyPlayer.largestArmy = 0
        this.largestArmy = 2
        game.largestArmyPlayer = this
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
      }
      if(data.exportresource[resource] % this.tradeRate[resource] !== 0){
        display.hideReceivingArea()
        return
      }
      ex += data.exportresource[resource] / this.tradeRate[resource]
      im += data.importresource[resource]
    }
    if(ex !== im){
      display.hideReceivingArea()
      return
    }
    for(let resource in data.exportresource){
      this.resource[resource] -= data.exportresource[resource]
      this.resource[resource] += data.importresource[resource]
    }
    game.phase = 'afterdice'
    display.hideMyTradeArea(data.socketID)
    display.allPlayerInformation()
    display.hideReceivingArea()
  }
  accepted(){
    let data = game.proposedata
    for(let resource in data.giveresource){
      if(data.proposer.resource[resource] < data.giveresource[resource]){
        display.hideReceivingArea()
        return
      }
      if(data.proposee.resource[resource] < data.takeresource[resource]){
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
    game.proposedata = {proposer:'', proposee:'', giveresource:'', takeresource:''}
    display.allPlayerInformation()
    display.hideProposeArea()
    display.showMyButtonArea(game.turnPlayer.socketID)
    recordLog()
    game.lastActionPlayer = this
    display.hideReceivingArea()
  };
  denied(){
    game.phase = 'afterdice'
    game.proposedata = {proposer:'', proposee:'', giveresource:'', takeresource:''}
    display.allPlayerInformation()
    display.hideProposeArea()
    display.showMyButtonArea(game.turnPlayer.socketID)
    display.hideReceivingArea()
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
    display.hideReceivingArea()
  }
}





const board = {island:[[],[],[],[],[],[],[],[],[]],numbers:[[],[],[],[],[],[],[],[],[]],thief:'', house:[], city:[], road:[], nodeLine:[7,16,27,40,53,64,73,80],roadLine:[6,10,18,23,33,39,51,58,70,76,86,91,99,103,109], dice:[],landLine:[3,7,12,18,23,27,30],ports:{oreport:[], grainport:[], woolport:[], lumberport:[], brickport:[],genericport:[]},log:{island:[[],[],[],[],[],[],[],[],[]],thief:'',house:[], city:[], road:[]},islandData:'',
  reset(){
    this.island = [[],[],[],[],[],[],[],[],[]]
    this.numbers = [[],[],[],[],[],[],[],[],[]]
    this.thief = ''
    this.house = []
    this.city = []
    this.road = []
    this.dice = []
    this.ports = {oreport:[], grainport:[], woolport:[], lumberport:[], brickport:[],genericport:[]}
    this.log = {island:[[],[],[],[],[],[],[],[],[]],thief:'',house:[], city:[], road:[]}
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
    this.island = [[],[],[],[],[],[],[],[],[]]
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
    let oceans = ['woolport','woolport','oreport','brickport','lumberport','grainport','genericport','genericport','genericport','genericport','genericport','ocean','ocean','ocean','ocean','ocean','ocean','ocean','ocean','ocean','ocean','ocean']
    lands = shuffle(lands)
    oceans = shuffle(oceans)
    let x = 1
    while(x <= this.island.length){
      let  y = 1
      let row = [0,5,6,7,8,7,6,5,0]
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
              let tile = {type:lands[0],position:[x-1,y-1],houseOwner:[], cityOwner:[],produce:true, direction:0}
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
    let numberChips = [2,2,3,3,3,4,4,4,5,5,5,6,6,6,8,8,8,9,9,9,10,10,10,11,11,11,12,12]
    numberChips = shuffle(numberChips)
    for(let line of this.island){
      for(let tile of line){
        if(tile.type === 'ore'|| tile.type === 'grain'|| tile.type === 'brick'|| tile.type === 'lumber'|| tile.type === 'wool'){
          tile.number = numberChips[0]
          numberChips.splice(0,1)
        }else{
          tile.number = 0
        }
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
    let dice1 = Math.ceil(Math.random()*6);
    let dice2 = Math.ceil(Math.random()*6);
    this.dice = [dice1,dice2];
    game.turnPlayer.dice = 0
    this.produce(dice1+dice2)
    if(dice1 + dice2 === 7){
      game.burstPlayerCheck()
    }else{
      game.phase = 'afterdice'
    }
    display.dice()
    recordLog()
    game.lastActionPlayer = game.turnPlayer
    display.toggleMyButtons(game.turnPlayer.socketID)
    display.hideReceivingArea()
  },
  //資源産出
  produce(add){
   for(let line of this.island){
    for(let tile of line){
      if(tile.number === add && tile !== this.thief){
        for(let owner of tile.houseOwner){
          owner.resource[tile.type] += 1
        }
        for(let owner of tile.cityOwner){
          owner.resource[tile.type] += 2
        }
      }
    }
   }
   display.allPlayerInformation()
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
    let longestPlayer = []
    for(let player of game.players){
      player.longestLength = player.myLongest()
      if(player.longestLength >= 5){
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
    for(let player of game.players){
      player.longestRoad = 0
    }
    game.longestRoadPlayer.longestRoad = 2
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
  initialize(){
    this.island = [[],[],[],[],[],[],[],[],[]]
    this.numbers = [[],[],[],[],[],[],[],[],[]]
    this.thief = ''
    this.house = []
    this.city = []
    this.road = []
    this.dice = []
    this.ports = {oreport:[], grainport:[], woolport:[], lumberport:[], brickport:[], genericport:[]}
    this.islandData = ''
    this.log = {island:[[],[],[],[],[],[],[],[],[]],thief:'',house:[], city:[], road:[]}
  }
}






const game = {maxPlayer:maxPlayer, players:[], turnPlayer:'', phase:'nameinputting', progressDeck:[],board:board,buildingPhase:0,largestArmyPlayer:'',longestRoadPlayer:'',burstPlayer:[],proposedata:{proposer:'', proposee:'', giveresource:'', takeresource:''},renounce:[],log:{turnPlayer:'', phase:'nameinputting', progressDeck:[],buildingPhase:0,largestArmyPlayer:'',longestRoadPlayer:'',burstPlayer:[],proposedata:{proposer:'', proposee:'', giveresource:{ore:0,grain:0,wool:0,lumber:0,brick:0}, takeresource:{ore:0,grain:0,wool:0,lumber:0,brick:0}},renounce:[]},lastActionPlayer:'',
  newGame(){
    for(let player of this.players){
      player.reset()
    }
    board.reset()
    this.reset()
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
    display.hideAllButtons()
  },
  reset(){
    this.turnPlayer = '';
    this.phase = 'setup';
    this.progressDeck = [];
    this.buildingPhase = 0;
    this.largestArmyPlayer = '';
    this.longestRoadPlayer = '';
    this.burstPlayer = [];
    this.proposedata = {proposer:'', proposee:'', giveresource:'', takeresource:''};
    this.renounce = []
    this.log = {turnPlayer:'', phase:'setup', progressDeck:[],buildingPhase:0,largestArmyPlayer:'',longestRoadPlayer:'',burstPlayer:[],proposedata:{proposer:'', proposee:'', giveresource:{ore:0,grain:0,wool:0,lumber:0,brick:0}, takeresource:{ore:0,grain:0,wool:0,lumber:0,brick:0}},renounce:[]}
    this.lastActionPlayer = ''
  },
  recordLog(){
    this.log.turnPlayer = this.turnPlayer
    this.log.phase = this.phase
    this.log.buildingPhase = this.buildingPhase
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
  },
  unDo(){
    this.turnPlayer = this.log.turnPlayer
    this.phase = this.log.phase
    this.buildingPhase = this.log.buildingPhase
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
    let i = 1
    while(i <= maxPlayer){
      playersName[i-1] = ''
      i += 1
    }
    this.turnPlayer = this.players[0]
    this.progressDeckMake();
    display.playerSort();
    display.hideItems();
    display.turnPlayer();
    //////////////
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
    if(game.phase === 'afterdice'){
      if(game.turnPlayer.point >= 10){
        game.gameEnd()
        return
      }
      game.buildingPhase = 0
      game.phase = 'building'
    }
    /////////////
    let old = game.turnPlayer
    if(this.players.indexOf(this.turnPlayer) === this.players.length-1){
      this.turnPlayer = this.players[0];
    } else {
        this.turnPlayer = this.players[this.players.indexOf(this.turnPlayer)+1];
    }
    
    if(this.buildingPhase === this.players.length){
      this.phase = 'beforedice'
    }
    this.buildingPhase += 1
    /////////
    display.turnPlayer()
    display.toggleMyButtons(old.socketID)
    display.toggleMyButtons(game.turnPlayer.socketID)
    if(game.phase === 'building' && game.turnPlayer.renounce === true){
      this.turnPlayer.turnEnd()
    }
  },
  turnEndSetup(){
    if(this.turnPlayer.house.length === 2){
      if(this.turnPlayer === this.players[0]){
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
    display.toggleMyButtons(game.turnPlayer.socketID)
    display.turnPlayer()
  },
  pointReload(){
    for(let player of this.players){
      player.point = player.house.length + player.city.length*2 + player.progress.point + player.largestArmy + player.longestRoad
    }
  },
  gameEnd(){
    game.phase = 'end'
    recordLog()
    display.gameResult()
  },
  burstPlayerCheck(){
    this.burstPlayer = []
    for(let player of this.players){
      if(player.totalResource() >= 8){
        this.burstPlayer.push(player)
        player.toTrash = Math.floor(player.totalResource()/2)
      }
    }
    if(this.burstPlayer.length !== 0){
      this.phase = 'burst'
      recordLog()
      for(let player of game.players){
        player.recordLog()
      }
      display.showBurstArea()
    }else{
      this.phase = 'thiefmove'
    }
    display.toggleMyButtons(game.turnPlayer.socketID)
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
    this.buildingPhase = 0;
    this.largestArmyPlayer = '';
    this.longestRoadPlayer = '';
    this.burstPlayer = [];
    this.proposedata = {proposer:'', proposee:'', giveresource:'', takeresource:''};
    this.renounce = []
    this.lastActionPlayer = ''
  },
}



















const display = {
  hideItems(){
    io.emit('hideItems', game);
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
    io.to(socketID).emit('hideItems', game)
  },
  allResource(){
    io.emit('allResource', game);
  },
  allResourceTo(socketID){
    io.to(socketID).emit('allResource', game);
  },
  allToken(){
    io.emit('allToken',game)
  },
  allTokenTo(socketID){
    io.to(socketID).emit('allToken',game)
  },
  allTitle(){
    io.emit('allTitle',game)
  },
  allTitleTo(socketID){
    io.to(socketID).emit('allTitle',game)
  },
  allProgress(){
    io.emit('allProgress',game)
  },
  allProgressTo(socketID){
    io.to(socketID).emit('allProgress',game)
  },
  allUsed(){
    io.emit('allUsed',game)
  },
  allUsedTo(socketID){
    io.to(socketID).emit('allUsed',game)
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
    io.emit('buildings',game)
  },
  buildingsTo(socketID){
    io.to(socketID).emit('buildings',game)
  },
  thief(){
    let buttonnumber = board.tileButtonPositionToNumber(board.thief.position)
    io.emit('thief', buttonnumber)
  },
  thiefTo(socketID){
    let buttonnumber = board.tileButtonPositionToNumber(board.thief.position)
    io.to(socketID).emit('thief', buttonnumber)
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
    this.showButtonArea()
    this.showMyButtonArea(game.turnPlayer.socketID)
  },
  showBurstArea(){
    let burstPlayer = game.burstPlayer
    io.emit('showburst', burstPlayer)
    this.hideButtonArea()
  },
  hideTradeArea(){
    let e
    io.emit('hidetrade',e)
    this.showButtonArea()
  },
  hideNegotiateArea(){
    let e
    io.emit('hidenegotiate',e)
  },
  hideMyProposeArea(socketID){
    io.to(socketID).emit('hideproposearea', '')
    this.showMyButtonArea(socketID)
  },
  showMyProposeArea(socketID){
    let data  = game.proposedata
    io.to(socketID).emit('showproposearea', data)
    this.hideMyButtonArea(socketID)
  },
  /*hidePlayers(){
    let e
    io.emit('hideplayers', e)
  },*/
  hideMyMonopolyArea(socketID){
    let e
    io.to(socketID).emit('hidemonopoly',e)
    this.showMyButtonArea(socketID)
  },
  showMyMonopolyArea(socketID){
    let e
    io.to(socketID).emit('showmonopoly',e)
    this.hideMyButtonArea(socketID)
  },
  hideMyHarvestArea(socketID){
    let e
    io.to(socketID).emit('hideharvest',e)
    this.showMyButtonArea(socketID)
  },
  showMyHarvestArea(socketID){
    let e
    io.to(socketID).emit('showharvest',e)
    this.hideMyButtonArea(socketID)
  },
  hideMyBurstArea(socketID){
    let e
    io.to(socketID).emit('hideburst',e)
    this.showMyButtonArea(socketID)
  },
  showMyBurstArea(socketID){
    let burstPlayer = game.burstPlayer
    io.to(socketID).emit('showburst',burstPlayer)
    this.hideMyButtonArea(socketID)
  },
  hideMyTradeArea(socketID){
    let e
    io.to(socketID).emit('hidetrade',e)
    this.showMyButtonArea(socketID)
  },
  showMyTradeArea(socketID){
    let e
    io.to(socketID).emit('showtrade',e)
    this.hideMyButtonArea(socketID)
  },
  hideMyNegotiateArea(socketID){
    let e
    io.to(socketID).emit('hidenegotiate',e)
    this.showMyButtonArea(socketID)
  },
  showMyNegotiateArea(socketID){
    let e
    io.to(socketID).emit('shownegotiate',e)
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
    io.emit('gameresult', game)
    this.showGameEndArea()
  },
  showGameEndArea(){
    io.emit('showgameendarea', '')
    this.hideButtonArea()
  },
  hideGameEndArea(){
    io.emit('hidegameendarea', '')
    this.showButtonArea()
  },
  showMyGameEndArea(socketID){
    io.to(socketID).emit('showgameendarea', '')
    this.hideMyButtonArea(socketID)
  },
  hideMyGameEndArea(socketID){
    io.to(socketID).emit('hidegameendarea', '')
    this.showMyButtonArea(socketID)
  },
  showProposeArea(){
    let data = game.proposedata
    io.emit('showproposearea', data)
    display.hideButtonArea()
  },
  hideProposeArea(){
    let e
    io.emit('hideproposearea', e)
    display.showButtonArea()
  },
  initialize(){
    let maxPlayer = game.maxPlayer
    io.emit('yesbuttonclick',maxPlayer)
  },
  turnPlayer(){
    let tn = game.turnPlayer.number
    let phase = game.phase
    let data = {tn:tn,phase:phase}
    io.emit('turnplayer', data)
  },
  turnPlayerTo(socketID){
    let tn = game.turnPlayer.number
    let phase = game.phase
    let data = {tn:tn,phase:phase}
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
    display.toggleMyButtons(socketID)
  },
  hideButtonArea(){
    let e
    io.emit('hidebuttonarea', e)
  },
  showButtonArea(){
    io.emit('showbuttonarea', '')
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
  diceBlackTo(socketID){
    io.to(socketID).emit('diceblack','')
  },
  hidemessageArea(){
    io.emit('hidemessagearea', );
  },
  showMyButton(socketID,string){
    io.to(socketID).emit('showbutton',string)
  },
  hideMyButton(socketID,string){
    io.to(socketID).emit('hidebutton',string)
  },//////
  hideButton(string){
    io.emit('hidebutton',string)
  },
  hideAllButtons(){
    display.hideButton('dice')
    for(let card in progress){
      display.hideButton(card)
    }
    display.hideButton('draw')
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
    let myself = game.IDToPlayer(socketID)
    display.hideMyButton(socketID,'dice')
    for(let card in progress){
      display.hideMyButton(socketID, card)
    }
    display.hideMyButton(socketID,'draw')
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
        display.showMyButton(socketID,'draw')
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
      display.hideMyGameEndArea(socketID);
      display.cleanUpMyBoard(socketID);
      display.deleteMyThief(socketID);
    }else{
      display.showMyField(socketID);
      display.toggleMyButtons(socketID);
      display.hideMyMonopolyArea(socketID);
      display.hideMyHarvestArea(socketID);
      display.hideMyBurstArea(socketID);
      display.hideMyTradeArea(socketID);
      display.hideMyNegotiateArea(socketID);
      display.hideMyProposeArea(socketID);
      display.hideMyGameEndArea(socketID);
      display.myPlayerSort(socketID);
      display.hideMyItems(socketID);
      display.turnPlayerTo(socketID);
      display.cleanUpMyBoard(socketID);
      display.diceTo(socketID);
      display.deleteMyThief(socketID);
      display.thiefTo(socketID);
      display.allPlayerInformationTo(socketID);
      display.renounceTo(socketID);
      display.reloadRate(socketID);
      display.showMyButtonArea(socketID);
      if(socketID === game.turnPlayer.socketID && game.phase === 'monopoly'){
        display.showMyMonopolyArea(socketID)
      }
      if(socketID === game.turnPlayer.socketID && (game.phase === 'harvest1' || game.phase === 'harvest2')){
        display.showMyHarvestArea(socketID)
      }
      if(game.IDToPlayer(socketID).toTrash !== 0 && game.phase === 'burst'){
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
      if(game.phase === 'propose'){
        display.showMyProposeArea(socketID)
      }
      if(game.phase === 'end'){
        display.showMyGameEndArea(socketID)
      }
      display.islandTo(socketID)
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
      display.hideGameEndArea()
      display.cleanUpBoard()
      display.resetRate()
      display.deleteThief()
    }else{
      display.showField()
      display.toggleMyButtons(game.turnPlayer.socketID)
      display.hideMonopolyArea()
      display.hideHarvestArea()
      display.hideBurstArea()
      display.hideTradeArea()
      display.hideNegotiateArea()
      display.hideProposeArea()
      display.hideGameEndArea()
      display.playerSort();
      display.hideItems();
      display.turnPlayer();
      display.cleanUpBoard()
      display.resetRate()
      display.dice()
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
        display.showGameEndArea()
      }
    }
    display.island()
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
    this.hideGameEndArea()
    ////////this.hidePlayers()
    this.cleanUpBoard()
    //this.hideDiceArea()
    this.hidemessageArea()
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
  }
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
  let m = 1
  while(m <= maxPlayer){
    playersName.push('')
    m += 1
  }
  display.initialize()
}
function recordLog(){
  for(let player of game.players){
    player.recordLog()
  }
  board.recordLog()
  game.recordLog()
}
function unDo(){
  game.lastActionPlayer.unDo()
  board.unDo()
  game.unDo()
}

io.on("connection", (socket)=>{

  //画面の表示
  display.allMightyTo(socket.id)
  
  //名前の入力
  socket.on("nameInput", (namedata)=>{
    if(!game.arrayHasID(playersName, socket.id)){
      playersName[namedata.number] = {name:namedata.name, socketID:namedata.socketID};
      io.emit("nameInput", namedata);     
    }
  });

  //スタートボタンクリック
  socket.on('start', (data)=>{
    let i = 1
    while(i <= maxPlayer){
        discard('', playersName);
        i += 1;
    };
    playersName = shuffle(playersName)
    if(playersName.length >= 1){
      game.gameStart()
      board.islandData = data
      board.makeIsland(data)
      display.buildings()
      display.island()
      display.thief()
      display.allPlayerInformation()
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
      }else if(game.phase === 'afterdice' && game.turnPlayer.progressUse === 0 && game.turnPlayer.progress.monopoly >= 1){
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
      }else if(game.phase === 'afterdice' && game.turnPlayer.progressUse === 0 && game.turnPlayer.progress.harvest >= 1){
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
    //バースト資源ボタンをクリック
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
    });
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
        display.log('denied')
        game.proposedata.proposer.denied()
      }else{
        display.hideReceivingArea()
      }
    });
    //もう一度遊ぶ
    socket.on('newgamebuttonclick', (e)=>{
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
            return
          }
        }
      }
      game.takeOver(player)
    })
    socket.on('undo', (socketID)=>{
      if(game.phase === 'burst'){
        let myself = game.IDToPlayer(socketID)
        display.log(myself)
        myself.unDo()
        display.log(myself)
        if(myself.toTrash > 0 && !game.burstPlayer.includes(myself)){
          game.burstPlayer.push(myself)
        }
        display.showBurstArea()
        display.allResource()
      }else if(socketID === game.lastActionPlayer.socketID){
        unDo()
        display.allMighty()
      }else{
        display.hideReceivingArea()
        display.hideReceivingArea()
      }
    })
    //コンソールに表示
    socket.on('console',(e)=>{
      socket.emit('console', game)
      display.hideReceivingArea()
    })
})
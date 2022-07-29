const { Console } = require("console");
const { emit, off } = require("process");
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
let playersName = []
let m = 1
while(m <= maxPlayer){
  playersName.push('')
  m += 1
}
const buildResource = {house:{ore:0,grain:1,wool:1,lumber:1,brick:1}, city:{ore:3,grain:2,wool:0,lumber:0,brick:0}, progress:{ore:1,grain:1,wool:1,lumber:0,brick:0}, road:{ore:0,grain:0,wool:0,lumber:1,brick:1}}
const progress = {knight:20, road:3, harvest:3, monopoly:3, point:5}
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
    this.progress = {knight:0, road:0, harvest:0, monopoly:0, point:0}
    this.used = {knight:0, road:0, harvest:0, monopoly:0, point:0}
    this.thisTurnProgress = 0
    this.largestArmy = 0
    this.longestRoad = 0
    this.point = 0
    this.progressUse = 0
    this.dice = 1
  };
  pointReload(){
    this.point = this.house.length + this.city.length*2 + this.progress.point + this.largestArmy + this.longestRoad
  };
  build(item, position){
    if(item === 'house'){
      //初期配置
      if(game.phase === 'setup' && this.house.length === this.road.length){
        //既に家がないか確認
        if(board.nodeCheck(position) !== 'blank'){
          return
        }//周りに家がないか確認
        else if(board.aroundNodesCheck(position) !== 'blank'){
          return
        }//問題なければ建設
        else{
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
        display.allPlayerInformation()
        display.buildings()
      }
      if(game.phase === 'afterdice'|| game.phase === 'building'){
        //既に家がないか確認
        if(board.nodeCheck(position) !== 'blank'){
          return
        }
        //資源の確認
        if(!this.resourceCheck(item)){
          return
        }
        //周りに家がないか確認
        if(board.aroundNodesCheck(position) !== 'blank'){
          return
        }
        //道がつながっているか確認
        if(!this.IhaveRoadAroundNode(position)){
          return
        }
        //手元に家があるか確認
        if(this.token[item] === 0){
          return
        }
        //問題なければ建設
        this.token.house -= 1
        this.house.push({position:position, nodeNumber: board.nodePositionToNumber(position)})
        board.house.push({type:'house', position:position, nodeNumber: board.nodePositionToNumber(position), owner:this})
        let tiles = board.tilesAroundNode(position)
        this.useResource(item)
        for(let tileposition of tiles){
          let tile = board.island[tileposition[0]][tileposition[1]]
          tile.houseOwner.push(this)
        }
        display.allPlayerInformation()
        display.buildings()
      }
    }
    if(item === 'city'){
      if(game.phase === 'afterdice'|| game.phase === 'building'){
        //自分の家があるか確認
        if(board.nodeCondition(position).type !== 'house' || board.nodeCondition(position).owner !== this){
          return
        }
        //資源の確認
        if(!this.resourceCheck(item)){
          return
        }
        //手元に都市があるか確認
        if(this.token[item] === 0){
          return
        }
        //問題なければ建設
        this.token.city -= 1
        this.city.push({position:position, nodeNumber: board.nodePositionToNumber(position)})
        board.city.push({type:'city', position:position, nodeNumber: board.nodePositionToNumber(position), owner:this})
        let tiles = board.tilesAroundNode(position)
        this.useResource(item)
        for(let tileposition of tiles){
          let tile = board.island[tileposition[0]][tileposition[1]]
          tile.cityOwner.push(this)
        }
        let house = positionToObject(position, this.house)
        discard(house, this.house)
        house = positionToObject(position, board.house)
        discard(house, board.house)
        display.allPlayerInformation()
        display.buildings()
      }
    }
    if(item === 'road'){
      if(game.phase === 'setup' && this.house.length === this.road.length+1){
        //既に道がないか確認
        if(board.roadCheck(position) !== 'blank'){
          return
        }//どちらかの端に今建てた家があるか確認
        else if(!this.justNowHouse(position)){
          return
        }
        //問題なければ建設
        this.token.road -= 1
        this.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position)})
        board.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position), owner:this})
        display.allPlayerInformation()
        display.buildings()
        game.turnEndSetup()
      }
      if(game.phase === 'afterdice'|| game.phase === 'building'){
        //既に道がないか確認
        if(board.roadCheck(position) !== 'blank'){
          return
        }
        //周りに自分の道があるか確認
        if(!this.IhaveRoadAroundRoad(position)){
          return
        }
        //資源の確認
        if(!this.resourceCheck(item)){
          return
        }//手元に道があるか確認
        if(this.token[item] === 0){
          return
        }
        //問題なければ建設
        this.token.road -= 1
        this.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position)})
        board.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position), owner:this})
        this.useResource(item)
        display.allPlayerInformation()
        display.buildings()
      }
      if(game.phase === 'roadbuild1'){
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
        this.token.road -= 1
        this.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position)})
        board.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position), owner:this})
        display.allPlayerInformation()
        display.buildings()
        if(this.token.road >= 1){
          game.phase = 'roadbuild2'
        }else{
          game.phase = 'afterdice'
        }
        return
      }
      if(game.phase === 'roadbuild2'){
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
        this.token.road -= 1
        this.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position)})
        board.road.push({position:position, roadNumber: board.roadPositionToNumber(position), roadDegree: board.roadDegree(position), owner:this})
        display.allPlayerInformation()
        display.buildings()
        game.phase = 'afterdice'
        return
      }
    }
  };
  draw(){
    if(game.phase === 'afterdice'|| game.phase === 'building'){
      if(game.progressDeck.length === 0){
        return
      }
      if(!this.resourceCheck('progress')){
        return
      }
      this.useResource('progress')
      this.progress[game.progressDeck[0]] += 1
      game.progressDeck.splice(0, 1)
      display.allPlayerInformation()
    }
  };
  knightuse(){
    if(game.phase !== 'beforedice' && game.phase !== 'afterdice'){
      return
    }
    if(this.progress.knight <= 0){
      return
    }
    if(this.progressUse >= 1){
      return
    }
    game.phase = 'thiefmove'
    this.progressUse += 1
    this.progress.knight -= 1
    this.used.knight += 1
    display.allPlayerInformation()
  };
  thiefmove(position){
    if(game.phase !== 'thiefmove'){
      return
    }
    if(arrayComparison(position, board.thief.position)){
      return
    }
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
    }else{
      game.phase = 'afterdice'
    }
  };
  robResource(position){
    let target = board.nodeCondition(position).owner
    if(target === this){
      return
    }
    if(target.totalResource() === 0){
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
  };
  monopoly(resource){
    if(game.phase !== 'afterdice'){
      return
    }
    if(this.progress.monopoly <= 0){
      return
    }
    if(this.progressUse >= 1){
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
    display.allPlayerInformation()
  };
  roadBuild(){
    if(game.phase !== 'afterdice'){
      return
    }
    if(this.progress.road <= 0){
      return
    }
    if(this.progressUse >= 1){
      return
    }
    this.progressUse += 1
    this.progress.road -= 1
    this.used.road += 1
    if(this.token.road >= 1){
      game.phase = 'roadbuild1'
    }
    display.allPlayerInformation()
  }
















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
  totalResource(){
    return this.resource.ore + this.resource.wool + this.resource.grain + this.resource.lumber + this.resource.brick
  }
}





const board = {island:[[],[],[],[],[],[],[],[],[]],numbers:[[],[],[],[],[],[],[],[],[]],thief:'', house:[], city:[], road:[], nodeLine:[7,16,27,40,53,64,73,80],roadLine:[6,10,18,23,33,39,51,58,70,76,86,91,99,103,109], dice:[],tileLine:[3,7,12,18,23,27,30],
  makeIsland(){
    this.island = [[],[],[],[],[],[],[],[],[]]
    let lands = ['ore','ore','ore','ore','ore','brick','brick','brick','brick','brick','wool','wool','wool','wool','wool','wool','lumber','lumber','lumber','lumber','lumber','lumber','grain','grain','grain','grain','grain','grain','desert','desert']
    let oceans = ['woolport','woolport','oreport','brickport','lumberport','grainport','genericport','genericport','genericport','genericport','genericport','ocean','ocean','ocean','ocean','ocean','ocean','ocean','ocean','ocean','ocean','ocean']
    lands = shuffle(lands)
    oceans = shuffle(oceans)
    let x = 1
    while(x <= 9){
      let  y = 1
      let row = [0,5,6,7,8,7,6,5,0]
      if(x === 1|| x === 9){
        let i = 1
        while(i <= 4){
          let tile = {type:oceans[0],position:[x-1,y-1],houseOwner:[], cityOwner:[],produce:false}
          board.island[x-1].push(tile)
          oceans.splice(0,1)
          i += 1
          y += 1
        }
      }else{
        while(y <= row[x-1]){
          if(y === 1||y === row[x-1]){
            let tile = {type:oceans[0],position:[x-1,y-1],houseOwner:[], cityOwner:[],produce:false}
            board.island[x-1].push(tile)
            oceans.splice(0,1)            
          }else{
            if(lands[0] !== 'desert'){
              let tile = {type:lands[0],position:[x-1,y-1],houseOwner:[], cityOwner:[],produce:true}
              board.island[x-1].push(tile)
            }else{
              let tile = {type:lands[0],position:[x-1,y-1],houseOwner:[], cityOwner:[],produce:false}
              board.island[x-1].push(tile)
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
    }else if(position[0] <= 7){
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
    if(nodex <= 3){
      if(nodey % 2 === 0){
        side = [nodex - 1, nodey - 1]
      }else{
        side = [nodex + 1, nodey + 1]
      }
    }else if(nodex === 4){
      if(nodey % 2 === 0){
        side = [nodex - 1, nodey - 1]
      }else{
        side = [nodex + 1, nodey]
      }
    }else if(nodex === 5){
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
      if(roadx <= 6){
        return [[roadx/2,roady*2-1], [roadx/2+1, roady*2]]
      }else if(roadx === 8){
        return [[roadx/2,roady*2-1], [roadx/2+1, roady*2-1]]
      }else if(roadx >= 10){
        return [[roadx/2, roady*2], [roadx/2+1, roady*2-1]]
      }
    }
  },
  //nodeの周りのタイル
  tilesAroundNode(nodeposition){
    let x = nodeposition[0]
    let y = nodeposition[1]
    if(x <= 4){
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
    game.phase = 'afterdice'
    game.turnPlayer.dice = 0
    this.produce(dice1+dice2)
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
  //nodeの周りのroad
  roadsArounNode(nodeposition){
    let x = nodeposition[0]
    let y = nodeposition[1]
    if(x <= 4){
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
  //nodeの間のroad
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
      if(tilebuttonnumber <= this.tileLine[x-1]){
        if(x === 1){
          y = number
        }else{
          y = tilebuttonnumber - this.tileLine[x-2]
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
      return this.tileLine[position[0]-2]+position[1]
    }
  },
}








const game = {maxPlayer:maxPlayer, players:[], turnPlayer:'', phase:'nameinputting', progressDeck:[],board:board,
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

  refresh(){
    for(let p of this.players){
        p.refresh();
    }
    this.turnPlayer = ''
    this.phase = 'playing'
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
    /*display.allHands();
    display.field()*/
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
    display.turnPlayer()
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
  island(){
    const island = board.island
    io.emit('island', island)
  },
  hideMyItems(socketID){
    let nop = game.players.length
    io.to(socketID).emit('hidemyitems', nop)
  },
  allResource(){
    io.emit('allResource', game);
  },
  allToken(){
    io.emit('allToken',game)
  },
  allTitle(){
    io.emit('allTitle',game)
  },
  allProgress(){
    io.emit('allProgress',game)
  },
  allUsed(){
    io.emit('allUsed',game)
  },
  allPlayerInformation(){
    this.allResource()
    this.allToken()
    this.allTitle()
    this.allProgress()
    this.allUsed()
  },
  buildings(){
    io.emit('buildings',game)
  },
  thief(){
    let buttonnumber = board.tileButtonPositionToNumber(board.thief.position)
    io.emit('thief', buttonnumber)
  },
  deleteThief(){
    let buttonnumber = board.tileButtonPositionToNumber(board.thief.position)
    io.emit('deletethief', buttonnumber)
  },
  hideMonopolyArea(){
    let e
    io.emit('hidemonopoly',e)
  },
  hideBoard_And_Button(){
    let e
    io.emit('hideBoard_And_Button', e)
  },
  showBoard_And_Button(){
    let e
    io.emit('showBoard_And_Button', e)
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
  /*allmighty(){
    if(game.phase === ''){
    }
  },*/
  log(a){
    io.emit('log', a)
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



io.on("connection", (socket)=>{

  //画面の表示
  if(game.phase === 'nameinputting'){
    io.to(socket.id).emit("nameDisplay", (playersName));
    display.hideBoard_And_Button()
    display.hideMonopolyArea()
  }else{
    display.hideItems();
    display.turnPlayer();
    display.island()
    display.thief()
    display.allPlayerInformation()
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
    playersName = shuffle(playersName)
    if(playersName.length >= 1){
      game.gameStart()
      board.makeIsland()
      display.island()
      display.thief()
      display.allPlayerInformation()

    };
  });
    //nodeをクリック
    socket.on('nodeclick',(data)=>{
      let position = board.nodeNumberToPosition(data.nodeNumber)
      if(data.socketID !== game.turnPlayer.socketID){
        return
      }
      if(game.phase === 'afterdice' || game.phase === 'building' || game.phase === 'setup'){
        if(board.nodeCondition(position) === 'blank'){
          game.turnPlayer.build('house', position)
        }else if(board.nodeCondition(position).type === 'house'){
          game.turnPlayer.build('city', position)
        }
      }
      if(game.phase === 'robresource'){
        game.turnPlayer.robResource(position)
      }
      
    });
    //roadをクリック
    socket.on('roadclick',(data)=>{
      let position = board.roadNumberToPosition(data.roadNumber)
      if(data.socketID !== game.turnPlayer.socketID){
        return
      }
      if(game.phase === 'afterdice' || game.phase === 'building' || game.phase === 'setup' || game.phase === 'roadbuild1' || game.phase === 'roadbuild2'){
        game.turnPlayer.build('road', position)
      }
    });
    //ダイスボタンをクリック
    socket.on('diceclick',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID/* || game.phase !== 'beforedice'*/){
        return
      }else{
        board.rollDice()
      }
    });
    //ドローボタンをクリック
    socket.on('drawclick',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID){
        return
      }else{
        game.turnPlayer.draw()
      }
    });
    //騎士ボタンをクリック
    socket.on('knightclick',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID){
        return
      }else{
        game.turnPlayer.knightuse()
      }
    });
    //タイルボタンをクリック
    socket.on('thiefmove',(data)=>{
      let position = board.tileButtonNumberToPosition(data.tileButtonNumber)
      board.tileButtonPositionToNumber(position)
      if(data.socketID !== game.turnPlayer.socketID){
        return
      }else if(game.phase === 'thiefmove'){
        game.turnPlayer.thiefmove(position)
      }
    });
    //独占資源ボタンをクリック
    socket.on('monopoly',(data)=>{
      let resource = data.resource
      if(data.socketID !== game.turnPlayer.socketID){
        return
      }else if(game.phase === 'afterdice'){
        game.turnPlayer.monopoly(resource)
      }
    });
    //街道建設ボタンをクリック
    socket.on('roadbuildclick',(data)=>{
      if(data.socketID !== game.turnPlayer.socketID){
        return
      }else if(game.phase === 'afterdice'){
        game.turnPlayer.roadBuild()
      }
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





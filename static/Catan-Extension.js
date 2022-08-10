const socket = io();
let board_size
//画面初期化
$('#initializebutton').on('click', function(){
    $('#yesorno').show()
})
$('#yesbutton').on('click', function(){
    let e =''
    socket.emit('yesbuttonclick', e)
})
$('#nobutton').on('click', function(){
    $('#yesorno').hide()
})

//名前の入力発信
$('#nameinputarea').on('click', '.namebutton', function(){
    if($(this).prev().val()){
        myName = $(this).prev().val()
        let nameNumber = Number($(this).prev().data('namenumber'));
        namedata = {name:myName, number:nameNumber, socketID:socket.id}
        socket.emit("nameInput", namedata)
    }
})

//名前の入力受信
socket.on("nameInput", (namedata)=>{
    $(`.player${namedata.number}`).html(`<p><b>${namedata.name}</b></p>`)
})

//スタートボタンクリック発信
$('#gamestartbutton').on('click', function(){
    $(`#receiving_area`).show()
    let size = $(`#size`).val()
    let ore = Number($(`#oretileamount`).val())
    let grain = Number($(`#ricetileamount`).val())
    let wool = Number($(`#wooltileamount`).val())
    let lumber = Number($(`#lumbertileamount`).val())
    let brick = Number($(`#bricktileamount`).val())
    let tileamounts
    if(ore === 0 && grain === 0 && wool === 0 && lumber === 0 && brick === 0){
        if(size === 'large'){
            tileamounts = {ore:5,grain:6,wool:6,lumber:6,brick:5}
        }else if(size === 'regular'){
            tileamounts = {ore:3,grain:4,wool:4,lumber:4,brick:3}
        }
    }else{
        tileamounts = {ore:ore,grain:grain,wool:wool,lumber:lumber,brick:brick}
    }
    let total = 0
    for(resource in tileamounts){
        total += tileamounts[resource]
    }
    /////
    if(size === 'large' && total > 28){
        return
    }else if(size === 'regular' && total > 18){
        return
    }
    const data = {tileamounts:tileamounts,size:size}
    socket.emit('start', data)
})

//入力済みの名前表示
socket.on('nameDisplay', (playersName)=>{
    let i = 1
    for(let player of playersName){
        if(player.name){
            $(`.player${playersName.indexOf(player)}`).html(`<p><b>${player.name}</b></p>`)
        }
        i += 1
    }
})
socket.on('shownameinputarea', (playersName)=>{
    display.showNameInputArea(playersName)
})


socket.on('island', (island)=>{
    display.island(island)
})










socket.on('hideItems', (data)=>{
    display.hideItems(data)
});
socket.on('allResource', (data)=>{
    display.allResource(data)
});
socket.on('allToken', (data)=>{
    display.allToken(data)
});
socket.on('allTitle', (data)=>{
    display.allTitle(data)
});
socket.on('allProgress', (data)=>{
    display.allProgress(data)
});
socket.on('allUsed', (data)=>{
    display.allUsed(data)
});



socket.on('resourceof', (data)=>{
    display.resourceOf(data)
});
socket.on('tokenof', (data)=>{
    display.tokenOf(data)
});
socket.on('titleof', (data)=>{
    display.titleOf(data)
});
socket.on('progressof', (data)=>{
    display.progressOf(data)
});
socket.on('usedof', (data)=>{
    display.usedOf(data)
});



socket.on('buildings', (buildings)=>{
    display.buildings(buildings)
});
socket.on('addhouse', (houseobj)=>{
    display.addHouse(houseobj)
});
socket.on('addcity', (cityobj)=>{
    display.addCity(cityobj)
});
socket.on('addroad', (roadobj)=>{
    display.addRoad(roadobj)
});
socket.on('thief', (buttonnumber)=>{
    display.thief(buttonnumber)
});
socket.on('deletethief', ()=>{
    display.deleteThief()
});
socket.on('hidemonopoly', (e)=>{
    display.hideMonopolyArea()
});
socket.on('hideharvest', (e)=>{
    display.hideHarvestArea()
});
socket.on('hideburst', (e)=>{
    display.hideBurstArea()
});
socket.on('hidetrade', (e)=>{
    display.hideTradeArea()
});
socket.on('hidenegotiate', (e)=>{
    display.hideNegotiateArea()
});
socket.on('showmonopoly', (e)=>{
    display.showMonopolyArea()
});
socket.on('showharvest', (e)=>{
    display.showHarvestArea()
});
socket.on('showburst', (burstPlayer)=>{
    display.showBurstArea(burstPlayer)
});
socket.on('showtrade', (e)=>{
    display.showTradeArea()
});
socket.on('shownegotiate', (e)=>{
    display.showNegotiateArea()
});
socket.on('showproposearea', (data)=>{
    display.showProposeArea(data)
});
socket.on('hideproposearea', (e)=>{
    display.hideProposeArea()
});
socket.on('hideplayers', (e)=>{
    display.hidePlayers()
})
socket.on('hideField', (e)=>{
    display.hideField()
});
socket.on('showField', (e)=>{
    display.showField()
});
socket.on('gameresult', (data)=>{
    display.gameResult(data)
})
socket.on('showgameendarea', ()=>{
    display.showGameEndArea()
})
socket.on('hidegameendarea', ()=>{
    display.hideGameEndArea()
})
socket.on('reloadrate', (data)=>{
    $(`#exportore`).attr(`step`, data.ore)
    $(`#exportgrain`).attr(`step`, data.grain)
    $(`#exportwool`).attr(`step`, data.wool)
    $(`#exportlumber`).attr(`step`, data.lumber)
    $(`#exportbrick`).attr(`step`, data.brick)
}),
socket.on('resetrate', ()=>{
    $(`#exportore`).attr(`step`, 4)
    $(`#exportgrain`).attr(`step`, 4)
    $(`#exportwool`).attr(`step`, 4)
    $(`#exportlumber`).attr(`step`, 4)
    $(`#exportbrick`).attr(`step`, 4)
})
socket.on('yesbuttonclick', (maxPlayer)=>{
    display.initialize(maxPlayer)
});
socket.on('turnplayer', (data)=>{
    display.turnPlayer(data)
})
socket.on('takeover', (player)=>{
    display.takeOver(player)
})
socket.on('log', (a)=>{
    display.log(a)
})
socket.on('playersort', (players)=>{
    display.playerSort(players)
})
socket.on('hidebuttonarea', (e)=>{
    display.hideButtonArea()
})
socket.on('showbuttonarea', (e)=>{
    display.showButtonArea()
})
socket.on('hideyesornobutton',()=>{
    display.hideYesOrNoButton()
})
socket.on('cleanupboard',()=>{
    display.cleanUpBoard()
})
socket.on('dice',(dice)=>{
    display.dice(dice)
})
socket.on('diceblack',()=>{
    display.diceBlack()
})
socket.on('hidemessagearea',()=>{
    display.hidemessageArea()
})
socket.on('showbutton',(string)=>{
    display.showButton(string)
})
socket.on('hidebutton',(string)=>{
    display.hideButton(string)
})
socket.on('renounce',(renounce)=>{
    display.renounce(renounce)
})
socket.on('hidereceivingarea',()=>{
    $(`#receiving_area`).hide();
})
socket.on('resizeboard',(size)=>{
    display.resizeBoard(size)
})
socket.on('hidedicepercentage',()=>{
    display.hideDicePercentage()
})
socket.on('thiefred',()=>{
    $(`#thief`).css(`background-color`, 'rgb(255, 0, 0, 0.6)')
})
socket.on('thiefblack',()=>{
    $(`#thief`).css(`background-color`, 'rgb(0, 0, 0, 0.6)')
})
socket.on('thisturnblack', ()=>{
    $(`#thisturn`).attr('id','')
})
socket.on('addused', (data)=>{
    $(`#player${data.number}used`).append(`<p id="thisturn" class="progresscard ${String(data.progresscard)}card">${translate(String(data.progresscard))}</p>`);
})
socket.on('deck',(data)=>{
    $(`#deck_area`).html(`<div id="deckcase"><div id="deck"></div></div>&nbsp;×${data.number}`)
    $(`#deck`).css(`height`, `${data.height}%`)
})
socket.on('showexhaust',(data)=>{
    $(`#receiving_area`).show();
    $(`#button_area`).append(`<div id="exhaustmessage"></div>`)
    for(let resource of data.exhaust){
        $(`#exhaustmessage`).append(`<p class="resourcecard ${String(resource)}">${translate(String(resource))}</p>`)
    }
    $(`#exhaustmessage`).append(`が枯渇しました`)
    $(`#receiving_area`).hide();
})
socket.on('hideexhaust',()=>{
    $(`#exhaustmessage`).remove()
})
socket.on('relativenodes',(data)=>{
    $(`#receiving_area`).show();
    $(`.relativenode`).removeClass(`relativenode`)
    for(let node of data.nodes){
        $(`#node${node+1}`).addClass(`relativenode`)
    }
    $(`#receiving_area`).hide();
})
socket.on('deleterelativenodes',()=>{
    $(`#receiving_area`).show();
    $(`.relativenode`).removeClass(`relativenode`)
    $(`#receiving_area`).hide();
})











//nodeをクリック
$(`#board_area`).on('click','.nodetouch',function(){
    $(`#receiving_area`).show()
    let nodeNumber = Number($(this).attr('id').slice(9))
    const data = {nodeNumber:nodeNumber, socketID:socket.id}
    socket.emit('nodeclick', data)
});
//roadをクリック
$(`#board_area`).on('click','.road',function(){
    $(`#receiving_area`).show()
    let roadNumber = Number($(this).attr('id').slice(4))
    const data = {roadNumber:roadNumber, socketID:socket.id}
    socket.emit('roadclick', data)
});
//ダイスボタンをクリック
$(`#button_area`).on('click','#dice_button',function(){
    $(`#receiving_area`).show()
    const data = {socketID:socket.id}
    socket.emit('diceclick', data)
});
//発展カードデッキをクリック
$(`#board_area`).on('click','#deck_area',function(){
    $(`#receiving_area`).show()
    const data = {socketID:socket.id}
    socket.emit('drawclick', data)
});
//騎士ボタンをクリック
$(`#button_area`).on('click','#knight_button',function(){
    $(`#receiving_area`).show()
    const data = {socketID:socket.id}
    socket.emit('knightclick', data)
});
//タイルボタンをクリック
$(`#board_area`).on('click','.tile_button',function(){
    $(`#receiving_area`).show()
    let tileButtonNumber = Number($(this).attr('id').slice(11))
    const data = {tileButtonNumber:tileButtonNumber, socketID:socket.id}
    socket.emit('thiefmove', data)
});
//独占ボタンをクリック
$(`#button_area`).on('click','#monopoly_button',function(){
    $(`#receiving_area`).show()
    const data = {socketID:socket.id}
    socket.emit('monopolybutton', data)
});
//独占やめるボタンをクリック
$(`#monopoly_area`).on('click','.quitprogressbutton',function(){
    $(`#receiving_area`).show()
    const data = {socketID:socket.id}
    socket.emit('quitmonopoly', data)
});
//独占資源ボタンをクリック
$(`#monopoly_area`).on(`click`, `.resource_button`, function(){
    $(`#receiving_area`).show()
    let resource = $(this).attr('id').slice(9)
    const data = {resource:resource, socketID:socket.id}
    socket.emit('monopoly', data)
})
//収穫ボタンをクリック
$(`#button_area`).on('click','#harvest_button',function(){
    $(`#receiving_area`).show()
    const data = {socketID:socket.id}
    socket.emit('harvestbutton', data)
});
//収穫やめるボタンをクリック
$(`#harvest_area`).on('click','.quitprogressbutton',function(){
    $(`#receiving_area`).show()
    const data = {socketID:socket.id}
    socket.emit('quitharvest', data)
});
//収穫資源ボタンをクリック
$(`#harvest_area`).on(`click`, `.resource_button`, function(){
    $(`#receiving_area`).show()
    let resource = $(this).attr('id').slice(8)
    const data = {resource:resource, socketID:socket.id}
    socket.emit('harvest', data)
})
//街道建設ボタンをクリック
$(`#button_area`).on('click','#roadbuild_button',function(){
    $(`#receiving_area`).show()
    const data = {socketID:socket.id}
    socket.emit('roadbuildclick', data)
});
//終了ボタンをクリック
$(`#button_area`).on('click','#end_button',function(){
    $(`#receiving_area`).show()
    const data = {socketID:socket.id}
    socket.emit('endbuttonclick', data)
});
//バースト資源ボタンをクリック
$(`#burst_area`).on(`click`, `.resource_button`, function(){
    $(`#receiving_area`).show()
    let resource = $(this).attr('id').slice(6)
    const data = {resource:resource, socketID:socket.id}
    socket.emit('burst', data)
})
//貿易ボタンをクリック
$(`#button_area`).on('click','#trade_button',function(){
    $(`#receiving_area`).show()
    const data = {socketID:socket.id}
    socket.emit('tradebuttonclick', data)
});
//貿易決定ボタンをクリック
$(`#trade_area`).on('click','#tradedecide',function(){
    $(`#receiving_area`).show()
    const exportore = Number($(`#exportore`).val())
    const exportgrain = Number($(`#exportgrain`).val())
    const exportwool = Number($(`#exportwool`).val())
    const exportlumber = Number($(`#exportlumber`).val())
    const exportbrick = Number($(`#exportbrick`).val())
    const exportresource = {ore:exportore,grain:exportgrain,wool:exportwool,lumber:exportlumber,brick:exportbrick}
    const importore = Number($(`#importore`).val())
    const importgrain = Number($(`#importgrain`).val())
    const importwool = Number($(`#importwool`).val())
    const importlumber = Number($(`#importlumber`).val())
    const importbrick = Number($(`#importbrick`).val())
    const importresource = {ore:importore,grain:importgrain,wool:importwool,lumber:importlumber,brick:importbrick}
    const data = {socketID:socket.id, exportresource:exportresource, importresource:importresource}
    socket.emit('tradedecide', data)
});
//貿易やめるボタンをクリック
$(`#trade_area`).on('click','#quittradebutton',function(){
    $(`#receiving_area`).show()
    const data = {socketID:socket.id}
    socket.emit('quittrade', data)
});
//交渉ボタンをクリック
$(`#button_area`).on('click','#negotiate_button',function(){
    $(`#receiving_area`).show()
    const data = {socketID:socket.id}
    socket.emit('negotiatebuttonclick', data)
});
//交渉相手ボタンをクリック
$(`#counterpart`).on('click','.propose_button',function(){
    $(`#receiving_area`).show()
    const counterpartnumber = Number($(this).attr(`id`).slice(2))
    const giveore = Number($(`#giveore`).val())
    const givegrain = Number($(`#givegrain`).val())
    const givewool = Number($(`#givewool`).val())
    const givelumber = Number($(`#givelumber`).val())
    const givebrick = Number($(`#givebrick`).val())
    const giveresource = {ore:giveore,grain:givegrain,wool:givewool,lumber:givelumber,brick:givebrick}
    const takeore = Number($(`#takeore`).val())
    const takegrain = Number($(`#takegrain`).val())
    const takewool = Number($(`#takewool`).val())
    const takelumber = Number($(`#takelumber`).val())
    const takebrick = Number($(`#takebrick`).val())
    const takeresource = {ore:takeore,grain:takegrain,wool:takewool,lumber:takelumber,brick:takebrick}
    const data = {socketID:socket.id, counterpartnumber:counterpartnumber, giveresource:giveresource, takeresource:takeresource}
    let give = false
    let take = false
    for(let key in giveresource){
        if(giveresource[key] > 0){
            give =true
        }
        if(takeresource[key] > 0){
            take = true
        }
    }
    $(`#receiving_area`).hide()
    if(give && take){
        socket.emit('propose', data)
    }
});
//交渉やめるボタンをクリック
$(`#negotiate_area`).on('click','#quitnegotiatebutton',function(){
    $(`#receiving_area`).show()
    const data = {socketID:socket.id}
    socket.emit('quitnegotiate', data)
});
//同意ボタンをクリック
$(`#acceptordeny`).on('click','#accept',function(){
    $(`#receiving_area`).show()
    const data = {socketID:socket.id}
    socket.emit('accept', data)
});
//断るボタンをクリック
$(`#acceptordeny`).on('click','#deny',function(){
    $(`#receiving_area`).show()
    const data = {socketID:socket.id}
    socket.emit('deny', data)
});




//街道ボタンをクリック
$(`#button_area`).on('click','#road_button',function(){
    $(`#receiving_area`).show()
    const data = {socketID:socket.id}
    socket.emit('roadbuttonclick', data)
});
//収穫ボタンをクリック
$(`#button_area`).on('click','#harvest_button',function(){
    $(`#receiving_area`).show()
    const data = {socketID:socket.id}
    socket.emit('harvestclick', data)
});

//継承,建築フェイズ放棄
$('#players').on('click', '.playermark', function(){
    $(`#receiving_area`).show()
    let n = Number($(this).parent().parent().parent().data('number'))
    let player ={number:n, socketID:socket.id}
    socket.emit('takeover', player)
});
//戻す
$(`#board_area`).on('click','#dice_area',function(){
    $(`#receiving_area`).show()
    let socketID = socket.id
    socket.emit('undo',socketID)
})





//もう一度遊ぶ
$('#newgamebutton').on('click',function(){
    $(`#receiving_area`).show()
    let e =''
    socket.emit('newgamebuttonclick', e)
});






//画面表示
const display = {
    hideField(){
        $(`#receiving_area`).show();
        $('#field').hide()
        $(`#receiving_area`).hide()
    },
    showField(){
        $(`#receiving_area`).show();
        $('#field').show()
        $(`#receiving_area`).hide()
      },
    hideItems(game){
        $(`#receiving_area`).show();
        let i = 1
        while(i <= game.maxPlayer){
            $(`#player${i-1}`).show()
            i += 1
        }
        i = game.players.length
        while(i <= game.maxPlayer - 1){
            $(`#player${i}`).hide()
            $(`#to${i}`).hide()
            i += 1
        }
        $('#gamestart').hide()
        $('#nameinputarea').hide();
        $('#size_select').hide();
        $('#tileamounts').hide();
        $('#field').show();
        $(`#receiving_area`).hide();
    },
    island(island){
        $(`#receiving_area`).show()
        $('#field').show()
        let tileNumber = 1
        if(island.length === 9){
            board_size = 'large'
            $('#cs').attr('href',"./Catan-Extension.css")
            $(`#board`).html(`
                <div id="dice_area"></div>
                <div id="receiving_area"><p id="receiving"><b>通信中…</b></p></div>
                <div id="deck_area"><div id="deckcase"><div id="deck"></div></div>&nbsp;×34</div>
                <img id="board_frame" src='./large_board.png'>
                <img id="tile1" class="tilex1 tiley5 tile" data-direction="" src="./ocean.png">
                <img id="tile2" class="tilex1 tiley7 tile" data-direction="" src="./ocean.png">
                <img id="tile3" class="tilex1 tiley9 tile" data-direction="" src="./ocean.png">
                <img id="tile4" class="tilex1 tiley11 tile" data-direction="" src="./ocean.png">
                <img id="tile5" class="tilex2 tiley4 tile" data-direction="" src="./ocean.png">
                <img id="tile6" class="tilex2 tiley6 tile" data-direction="" src="./desert.png">
                <img id="tile7" class="tilex2 tiley8 tile" data-direction="" src="./desert.png">
                <img id="tile8" class="tilex2 tiley10 tile" data-direction="" src="./desert.png">
                <img id="tile9" class="tilex2 tiley12 tile" data-direction="" src="./ocean.png">
                <img id="tile10" class="tilex3 tiley3 tile" data-direction="" src="./ocean.png">
                <img id="tile11" class="tilex3 tiley5 tile" data-direction="" src="./desert.png">
                <img id="tile12" class="tilex3 tiley7 tile" data-direction="" src="./desert.png">
                <img id="tile13" class="tilex3 tiley9 tile" data-direction="" src="./desert.png">
                <img id="tile14" class="tilex3 tiley11 tile" data-direction="" src="./desert.png">
                <img id="tile15" class="tilex3 tiley13 tile" data-direction="" src="./ocean.png">
                <img id="tile16" class="tilex4 tiley2 tile" data-direction="" src="./ocean.png">
                <img id="tile17" class="tilex4 tiley4 tile" data-direction="" src="./desert.png">
                <img id="tile18" class="tilex4 tiley6 tile" data-direction="" src="./desert.png">
                <img id="tile19" class="tilex4 tiley8 tile" data-direction="" src="./desert.png">
                <img id="tile20" class="tilex4 tiley10 tile" data-direction="" src="./desert.png">
                <img id="tile21" class="tilex4 tiley12 tile" data-direction="" src="./desert.png">
                <img id="tile22" class="tilex4 tiley14 tile" data-direction="" src="./ocean.png">
                <img id="tile23" class="tilex5 tiley1 tile" data-direction="" src="./ocean.png">
                <img id="tile24" class="tilex5 tiley3 tile" data-direction="" src="./desert.png">
                <img id="tile25" class="tilex5 tiley5 tile" data-direction="" src="./desert.png">
                <img id="tile26" class="tilex5 tiley7 tile" data-direction="" src="./desert.png">
                <img id="tile27" class="tilex5 tiley9 tile" data-direction="" src="./desert.png">
                <img id="tile28" class="tilex5 tiley11 tile" data-direction="" src="./desert.png">
                <img id="tile29" class="tilex5 tiley13 tile" data-direction="" src="./desert.png">
                <img id="tile30" class="tilex5 tiley15 tile" data-direction="" src="./ocean.png">
                <img id="tile31" class="tilex6 tiley2 tile" data-direction="" src="./ocean.png">
                <img id="tile32" class="tilex6 tiley4 tile" data-direction="" src="./desert.png">
                <img id="tile33" class="tilex6 tiley6 tile" data-direction="" src="./desert.png">
                <img id="tile34" class="tilex6 tiley8 tile" data-direction="" src="./desert.png">
                <img id="tile35" class="tilex6 tiley10 tile" data-direction="" src="./desert.png">
                <img id="tile36" class="tilex6 tiley12 tile" data-direction="" src="./desert.png">
                <img id="tile37" class="tilex6 tiley14 tile" data-direction="" src="./ocean.png">
                <img id="tile38" class="tilex7 tiley3 tile" data-direction="" src="./ocean.png">
                <img id="tile39" class="tilex7 tiley5 tile" data-direction="" src="./desert.png">
                <img id="tile40" class="tilex7 tiley7 tile" data-direction="" src="./desert.png">
                <img id="tile41" class="tilex7 tiley9 tile" data-direction="" src="./desert.png">
                <img id="tile42" class="tilex7 tiley11 tile" data-direction="" src="./desert.png">
                <img id="tile43" class="tilex7 tiley13 tile" data-direction="" src="./ocean.png">
                <img id="tile44" class="tilex8 tiley4 tile" data-direction="" src="./ocean.png">
                <img id="tile45" class="tilex8 tiley6 tile" data-direction="" src="./desert.png">
                <img id="tile46" class="tilex8 tiley8 tile" data-direction="" src="./desert.png">
                <img id="tile47" class="tilex8 tiley10 tile" data-direction="" src="./desert.png">
                <img id="tile48" class="tilex8 tiley12 tile" data-direction="" src="./ocean.png">
                <img id="tile49" class="tilex9 tiley5 tile" data-direction="" src="./ocean.png">
                <img id="tile50" class="tilex9 tiley7 tile" data-direction="" src="./ocean.png">
                <img id="tile51" class="tilex9 tiley9 tile" data-direction="" src="./ocean.png">
                <img id="tile52" class="tilex9 tiley11 tile" data-direction="" src="./ocean.png">
                <div id="node1"  class="node nodex2 nodey4"><div id="nodetouch1" class="nodetouch"></div></div>
                <div id="node2"  class="node nodex1 nodey5"><div id="nodetouch2" class="nodetouch"></div></div>
                <div id="node3"  class="node nodex2 nodey6"><div id="nodetouch3" class="nodetouch"></div></div>
                <div id="node4"  class="node nodex1 nodey7"><div id="nodetouch4" class="nodetouch"></div></div>
                <div id="node5"  class="node nodex2 nodey8"><div id="nodetouch5" class="nodetouch"></div></div>
                <div id="node6"  class="node nodex1 nodey9"><div id="nodetouch6" class="nodetouch"></div></div>
                <div id="node7"  class="node nodex2 nodey10"><div id="nodetouch7" class="nodetouch"></div></div>
                <div id="node8"  class="node nodex4 nodey3"><div id="nodetouch8" class="nodetouch"></div></div>
                <div id="node9"  class="node nodex3 nodey4"><div id="nodetouch9" class="nodetouch"></div></div>
                <div id="node10"  class="node nodex4 nodey5"><div id="nodetouch10" class="nodetouch"></div></div>
                <div id="node11"  class="node nodex3 nodey6"><div id="nodetouch11" class="nodetouch"></div></div>
                <div id="node12"  class="node nodex4 nodey7"><div id="nodetouch12" class="nodetouch"></div></div>
                <div id="node13"  class="node nodex3 nodey8"><div id="nodetouch13" class="nodetouch"></div></div>
                <div id="node14"  class="node nodex4 nodey9"><div id="nodetouch14" class="nodetouch"></div></div>
                <div id="node15"  class="node nodex3 nodey10"><div id="nodetouch15" class="nodetouch"></div></div>
                <div id="node16"  class="node nodex4 nodey11"><div id="nodetouch16" class="nodetouch"></div></div>
                <div id="node17"  class="node nodex6 nodey2"><div id="nodetouch17" class="nodetouch"></div></div>
                <div id="node18"  class="node nodex5 nodey3"><div id="nodetouch18" class="nodetouch"></div></div>
                <div id="node19"  class="node nodex6 nodey4"><div id="nodetouch19" class="nodetouch"></div></div>
                <div id="node20"  class="node nodex5 nodey5"><div id="nodetouch20" class="nodetouch"></div></div>
                <div id="node21"  class="node nodex6 nodey6"><div id="nodetouch21" class="nodetouch"></div></div>
                <div id="node22"  class="node nodex5 nodey7"><div id="nodetouch22" class="nodetouch"></div></div>
                <div id="node23"  class="node nodex6 nodey8"><div id="nodetouch23" class="nodetouch"></div></div>
                <div id="node24"  class="node nodex5 nodey9"><div id="nodetouch24" class="nodetouch"></div></div>
                <div id="node25"  class="node nodex6 nodey10"><div id="nodetouch25" class="nodetouch"></div></div>
                <div id="node26"  class="node nodex5 nodey11"><div id="nodetouch26" class="nodetouch"></div></div>
                <div id="node27"  class="node nodex6 nodey12"><div id="nodetouch27" class="nodetouch"></div></div>
                <div id="node28"  class="node nodex8 nodey1"><div id="nodetouch28" class="nodetouch"></div></div>
                <div id="node29"  class="node nodex7 nodey2"><div id="nodetouch29" class="nodetouch"></div></div>
                <div id="node30"  class="node nodex8 nodey3"><div id="nodetouch30" class="nodetouch"></div></div>
                <div id="node31"  class="node nodex7 nodey4"><div id="nodetouch31" class="nodetouch"></div></div>
                <div id="node32"  class="node nodex8 nodey5"><div id="nodetouch32" class="nodetouch"></div></div>
                <div id="node33"  class="node nodex7 nodey6"><div id="nodetouch33" class="nodetouch"></div></div>
                <div id="node34"  class="node nodex8 nodey7"><div id="nodetouch34" class="nodetouch"></div></div>
                <div id="node35"  class="node nodex7 nodey8"><div id="nodetouch35" class="nodetouch"></div></div>
                <div id="node36"  class="node nodex8 nodey9"><div id="nodetouch36" class="nodetouch"></div></div>
                <div id="node37"  class="node nodex7 nodey10"><div id="nodetouch37" class="nodetouch"></div></div>
                <div id="node38"  class="node nodex8 nodey11"><div id="nodetouch38" class="nodetouch"></div></div>
                <div id="node39"  class="node nodex7 nodey12"><div id="nodetouch39" class="nodetouch"></div></div>
                <div id="node40"  class="node nodex8 nodey13"><div id="nodetouch40" class="nodetouch"></div></div>
                <div id="node41"  class="node nodex9 nodey1"><div id="nodetouch41" class="nodetouch"></div></div>
                <div id="node42"  class="node nodex10 nodey2"><div id="nodetouch42" class="nodetouch"></div></div>
                <div id="node43"  class="node nodex9 nodey3"><div id="nodetouch43" class="nodetouch"></div></div>
                <div id="node44"  class="node nodex10 nodey4"><div id="nodetouch44" class="nodetouch"></div></div>
                <div id="node45"  class="node nodex9 nodey5"><div id="nodetouch45" class="nodetouch"></div></div>
                <div id="node46"  class="node nodex10 nodey6"><div id="nodetouch46" class="nodetouch"></div></div>
                <div id="node47"  class="node nodex9 nodey7"><div id="nodetouch47" class="nodetouch"></div></div>
                <div id="node48"  class="node nodex10 nodey8"><div id="nodetouch48" class="nodetouch"></div></div>
                <div id="node49"  class="node nodex9 nodey9"><div id="nodetouch49" class="nodetouch"></div></div>
                <div id="node50"  class="node nodex10 nodey10"><div id="nodetouch50" class="nodetouch"></div></div>
                <div id="node51"  class="node nodex9 nodey11"><div id="nodetouch51" class="nodetouch"></div></div>
                <div id="node52"  class="node nodex10 nodey12"><div id="nodetouch52" class="nodetouch"></div></div>
                <div id="node53"  class="node nodex9 nodey13"><div id="nodetouch53" class="nodetouch"></div></div>
                <div id="node54"  class="node nodex11 nodey2"><div id="nodetouch54" class="nodetouch"></div></div>
                <div id="node55"  class="node nodex12 nodey3"><div id="nodetouch55" class="nodetouch"></div></div>
                <div id="node56"  class="node nodex11 nodey4"><div id="nodetouch56" class="nodetouch"></div></div>
                <div id="node57"  class="node nodex12 nodey5"><div id="nodetouch57" class="nodetouch"></div></div>
                <div id="node58"  class="node nodex11 nodey6"><div id="nodetouch58" class="nodetouch"></div></div>
                <div id="node59"  class="node nodex12 nodey7"><div id="nodetouch59" class="nodetouch"></div></div>
                <div id="node60"  class="node nodex11 nodey8"><div id="nodetouch60" class="nodetouch"></div></div>
                <div id="node61"  class="node nodex12 nodey9"><div id="nodetouch61" class="nodetouch"></div></div>
                <div id="node62"  class="node nodex11 nodey10"><div id="nodetouch62" class="nodetouch"></div></div>
                <div id="node63"  class="node nodex12 nodey11"><div id="nodetouch63" class="nodetouch"></div></div>
                <div id="node64"  class="node nodex11 nodey12"><div id="nodetouch64" class="nodetouch"></div></div>
                <div id="node65"  class="node nodex13 nodey3"><div id="nodetouch65" class="nodetouch"></div></div>
                <div id="node66"  class="node nodex14 nodey4"><div id="nodetouch66" class="nodetouch"></div></div>
                <div id="node67"  class="node nodex13 nodey5"><div id="nodetouch67" class="nodetouch"></div></div>
                <div id="node68"  class="node nodex14 nodey6"><div id="nodetouch68" class="nodetouch"></div></div>
                <div id="node69"  class="node nodex13 nodey7"><div id="nodetouch69" class="nodetouch"></div></div>
                <div id="node70"  class="node nodex14 nodey8"><div id="nodetouch70" class="nodetouch"></div></div>
                <div id="node71"  class="node nodex13 nodey9"><div id="nodetouch71" class="nodetouch"></div></div>
                <div id="node72"  class="node nodex14 nodey10"><div id="nodetouch72" class="nodetouch"></div></div>
                <div id="node73"  class="node nodex13 nodey11"><div id="nodetouch73" class="nodetouch"></div></div>
                <div id="node74"  class="node nodex15 nodey4"><div id="nodetouch74" class="nodetouch"></div></div>
                <div id="node75"  class="node nodex16 nodey5"><div id="nodetouch75" class="nodetouch"></div></div>
                <div id="node76"  class="node nodex15 nodey6"><div id="nodetouch76" class="nodetouch"></div></div>
                <div id="node77"  class="node nodex16 nodey7"><div id="nodetouch77" class="nodetouch"></div></div>
                <div id="node78"  class="node nodex15 nodey8"><div id="nodetouch78" class="nodetouch"></div></div>
                <div id="node79"  class="node nodex16 nodey9"><div id="nodetouch79" class="nodetouch"></div></div>
                <div id="node80"  class="node nodex15 nodey10"><div id="nodetouch80" class="nodetouch"></div></div>
                <div id="road1" class="road roadx1 roady8"></div>
                <div id="road2" class="road roadx1 roady10"></div>
                <div id="road3" class="road roadx1 roady12"></div>
                <div id="road4" class="road roadx1 roady14"></div>
                <div id="road5" class="road roadx1 roady16"></div>
                <div id="road6" class="road roadx1 roady18"></div>
                <div id="road7" class="road roadx2 roady7"></div>
                <div id="road8" class="road roadx2 roady11"></div>
                <div id="road9" class="road roadx2 roady15"></div>
                <div id="road10" class="road roadx2 roady19"></div>
                <div id="road11" class="road roadx3 roady6"></div>
                <div id="road12" class="road roadx3 roady8"></div>
                <div id="road13" class="road roadx3 roady10"></div>
                <div id="road14" class="road roadx3 roady12"></div>
                <div id="road15" class="road roadx3 roady14"></div>
                <div id="road16" class="road roadx3 roady16"></div>
                <div id="road17" class="road roadx3 roady18"></div>
                <div id="road18" class="road roadx3 roady20"></div>
                <div id="road19" class="road roadx4 roady5"></div>
                <div id="road20" class="road roadx4 roady9"></div>
                <div id="road21" class="road roadx4 roady13"></div>
                <div id="road22" class="road roadx4 roady17"></div>
                <div id="road23" class="road roadx4 roady21"></div>
                <div id="road24" class="road roadx5 roady4"></div>
                <div id="road25" class="road roadx5 roady6"></div>
                <div id="road26" class="road roadx5 roady8"></div>
                <div id="road27" class="road roadx5 roady10"></div>
                <div id="road28" class="road roadx5 roady12"></div>
                <div id="road29" class="road roadx5 roady14"></div>
                <div id="road30" class="road roadx5 roady16"></div>
                <div id="road31" class="road roadx5 roady18"></div>
                <div id="road32" class="road roadx5 roady20"></div>
                <div id="road33" class="road roadx5 roady22"></div>
                <div id="road34" class="road roadx6 roady3"></div>
                <div id="road35" class="road roadx6 roady7"></div>
                <div id="road36" class="road roadx6 roady11"></div>
                <div id="road37" class="road roadx6 roady15"></div>
                <div id="road38" class="road roadx6 roady19"></div>
                <div id="road39" class="road roadx6 roady23"></div>
                <div id="road40" class="road roadx7 roady2"></div>
                <div id="road41" class="road roadx7 roady4"></div>
                <div id="road42" class="road roadx7 roady6"></div>
                <div id="road43" class="road roadx7 roady8"></div>
                <div id="road44" class="road roadx7 roady10"></div>
                <div id="road45" class="road roadx7 roady12"></div>
                <div id="road46" class="road roadx7 roady14"></div>
                <div id="road47" class="road roadx7 roady16"></div>
                <div id="road48" class="road roadx7 roady18"></div>
                <div id="road49" class="road roadx7 roady20"></div>
                <div id="road50" class="road roadx7 roady22"></div>
                <div id="road51" class="road roadx7 roady24"></div>
                <div id="road52" class="road roadx8 roady1"></div>
                <div id="road53" class="road roadx8 roady5"></div>
                <div id="road54" class="road roadx8 roady9"></div>
                <div id="road55" class="road roadx8 roady13"></div>
                <div id="road56" class="road roadx8 roady17"></div>
                <div id="road57" class="road roadx8 roady21"></div>
                <div id="road58" class="road roadx8 roady25"></div>
                <div id="road59" class="road roadx9 roady2"></div>
                <div id="road60" class="road roadx9 roady4"></div>
                <div id="road61" class="road roadx9 roady6"></div>
                <div id="road62" class="road roadx9 roady8"></div>
                <div id="road63" class="road roadx9 roady10"></div>
                <div id="road64" class="road roadx9 roady12"></div>
                <div id="road65" class="road roadx9 roady14"></div>
                <div id="road66" class="road roadx9 roady16"></div>
                <div id="road67" class="road roadx9 roady18"></div>
                <div id="road68" class="road roadx9 roady20"></div>
                <div id="road69" class="road roadx9 roady22"></div>
                <div id="road70" class="road roadx9 roady24"></div>
                <div id="road71" class="road roadx10 roady3"></div>
                <div id="road72" class="road roadx10 roady7"></div>
                <div id="road73" class="road roadx10 roady11"></div>
                <div id="road74" class="road roadx10 roady15"></div>
                <div id="road75" class="road roadx10 roady19"></div>
                <div id="road76" class="road roadx10 roady23"></div>
                <div id="road77" class="road roadx11 roady4"></div>
                <div id="road78" class="road roadx11 roady6"></div>
                <div id="road79" class="road roadx11 roady8"></div>
                <div id="road80" class="road roadx11 roady10"></div>
                <div id="road81" class="road roadx11 roady12"></div>
                <div id="road82" class="road roadx11 roady14"></div>
                <div id="road83" class="road roadx11 roady16"></div>
                <div id="road84" class="road roadx11 roady18"></div>
                <div id="road85" class="road roadx11 roady20"></div>
                <div id="road86" class="road roadx11 roady22"></div>
                <div id="road87" class="road roadx12 roady5"></div>
                <div id="road88" class="road roadx12 roady9"></div>
                <div id="road89" class="road roadx12 roady13"></div>
                <div id="road90" class="road roadx12 roady17"></div>
                <div id="road91" class="road roadx12 roady21"></div>
                <div id="road92" class="road roadx13 roady6"></div>
                <div id="road93" class="road roadx13 roady8"></div>
                <div id="road94" class="road roadx13 roady10"></div>
                <div id="road95" class="road roadx13 roady12"></div>
                <div id="road96" class="road roadx13 roady14"></div>
                <div id="road97" class="road roadx13 roady16"></div>
                <div id="road98" class="road roadx13 roady18"></div>
                <div id="road99" class="road roadx13 roady20"></div>
                <div id="road100" class="road roadx14 roady7"></div>
                <div id="road101" class="road roadx14 roady11"></div>
                <div id="road102" class="road roadx14 roady15"></div>
                <div id="road103" class="road roadx14 roady19"></div>
                <div id="road104" class="road roadx15 roady8"></div>
                <div id="road105" class="road roadx15 roady10"></div>
                <div id="road106" class="road roadx15 roady12"></div>
                <div id="road107" class="road roadx15 roady14"></div>
                <div id="road108" class="road roadx15 roady16"></div>
                <div id="road109" class="road roadx15 roady18"></div>
                <div id="tile_button1" class="tile_button tile_buttonx1 tile_buttony4"></div>
                <div id="tile_button2" class="tile_button tile_buttonx1 tile_buttony6"></div>
                <div id="tile_button3" class="tile_button tile_buttonx1 tile_buttony8"></div>
                <div id="tile_button4" class="tile_button tile_buttonx2 tile_buttony3"></div>
                <div id="tile_button5" class="tile_button tile_buttonx2 tile_buttony5"></div>
                <div id="tile_button6" class="tile_button tile_buttonx2 tile_buttony7"></div>
                <div id="tile_button7" class="tile_button tile_buttonx2 tile_buttony9"></div>
                <div id="tile_button8" class="tile_button tile_buttonx3 tile_buttony2"></div>
                <div id="tile_button9" class="tile_button tile_buttonx3 tile_buttony4"></div>
                <div id="tile_button10" class="tile_button tile_buttonx3 tile_buttony6"></div>
                <div id="tile_button11" class="tile_button tile_buttonx3 tile_buttony8"></div>
                <div id="tile_button12" class="tile_button tile_buttonx3 tile_buttony10"></div>
                <div id="tile_button13" class="tile_button tile_buttonx4 tile_buttony1"></div>
                <div id="tile_button14" class="tile_button tile_buttonx4 tile_buttony3"></div>
                <div id="tile_button15" class="tile_button tile_buttonx4 tile_buttony5"></div>
                <div id="tile_button16" class="tile_button tile_buttonx4 tile_buttony7"></div>
                <div id="tile_button17" class="tile_button tile_buttonx4 tile_buttony9"></div>
                <div id="tile_button18" class="tile_button tile_buttonx4 tile_buttony11"></div>
                <div id="tile_button19" class="tile_button tile_buttonx5 tile_buttony2"></div>
                <div id="tile_button20" class="tile_button tile_buttonx5 tile_buttony4"></div>
                <div id="tile_button21" class="tile_button tile_buttonx5 tile_buttony6"></div>
                <div id="tile_button22" class="tile_button tile_buttonx5 tile_buttony8"></div>
                <div id="tile_button23" class="tile_button tile_buttonx5 tile_buttony10"></div>
                <div id="tile_button24" class="tile_button tile_buttonx6 tile_buttony3"></div>
                <div id="tile_button25" class="tile_button tile_buttonx6 tile_buttony5"></div>
                <div id="tile_button26" class="tile_button tile_buttonx6 tile_buttony7"></div>
                <div id="tile_button27" class="tile_button tile_buttonx6 tile_buttony9"></div>
                <div id="tile_button28" class="tile_button tile_buttonx7 tile_buttony4"></div>
                <div id="tile_button29" class="tile_button tile_buttonx7 tile_buttony6"></div>
                <div id="tile_button30" class="tile_button tile_buttonx7 tile_buttony8"></div>
                <img id="chip1" class="chip tile_buttonx1 tile_buttony4" src="">
                <img id="chip2" class="chip tile_buttonx1 tile_buttony6" src="">
                <img id="chip3" class="chip tile_buttonx1 tile_buttony8" src="">
                <img id="chip4" class="chip tile_buttonx2 tile_buttony3" src="">
                <img id="chip5" class="chip tile_buttonx2 tile_buttony5" src="">
                <img id="chip6" class="chip tile_buttonx2 tile_buttony7" src="">
                <img id="chip7" class="chip tile_buttonx2 tile_buttony9" src="">
                <img id="chip8" class="chip tile_buttonx3 tile_buttony2" src="">
                <img id="chip9" class="chip tile_buttonx3 tile_buttony4" src="">
                <img id="chip10" class="chip tile_buttonx3 tile_buttony6" src="">
                <img id="chip11" class="chip tile_buttonx3 tile_buttony8" src ="">
                <img id="chip12" class="chip tile_buttonx3 tile_buttony10" src ="">
                <img id="chip13" class="chip tile_buttonx4 tile_buttony1" src ="">
                <img id="chip14" class="chip tile_buttonx4 tile_buttony3" src ="">
                <img id="chip15" class="chip tile_buttonx4 tile_buttony5" src ="">
                <img id="chip16" class="chip tile_buttonx4 tile_buttony7" src ="">
                <img id="chip17" class="chip tile_buttonx4 tile_buttony9" src ="">
                <img id="chip18" class="chip tile_buttonx4 tile_buttony11" src ="">
                <img id="chip19" class="chip tile_buttonx5 tile_buttony2" src ="">
                <img id="chip20" class="chip tile_buttonx5 tile_buttony4" src ="">
                <img id="chip21" class="chip tile_buttonx5 tile_buttony6" src ="">
                <img id="chip22" class="chip tile_buttonx5 tile_buttony8" src ="">
                <img id="chip23" class="chip tile_buttonx5 tile_buttony10" src ="">
                <img id="chip24" class="chip tile_buttonx6 tile_buttony3" src ="">
                <img id="chip25" class="chip tile_buttonx6 tile_buttony5" src ="">
                <img id="chip26" class="chip tile_buttonx6 tile_buttony7" src ="">
                <img id="chip27" class="chip tile_buttonx6 tile_buttony9" src ="">
                <img id="chip28" class="chip tile_buttonx7 tile_buttony4" src ="">
                <img id="chip29" class="chip tile_buttonx7 tile_buttony6" src ="">
                <img id="chip30" class="chip tile_buttonx7 tile_buttony8" src ="">
            `)
            for(line of island){
                for(tile of line){
                    $(`#tile${tileNumber}`).attr(`src`, `./${tile.type}.png`)
                    $(`#tile${tileNumber}`).attr(`data-direction`,`${tile.direction}`)
                    tileNumber += 1
                }
            }
            tileNumber = 1
            for(line of island){
                for(tile of line){
                    if(tile.type === 'ore'|| tile.type === 'grain'|| tile.type === 'brick'|| tile.type === 'lumber'|| tile.type === 'wool'|| tile.type === 'desert'){
                        if(tile.type !== 'desert'){
                            $(`#chip${tileNumber}`).attr(`src`, `./${tile.number}.png`)
                        }else{
                            $(`#chip${tileNumber}`).attr(`src`, ``)
                        }
                        tileNumber += 1
                    }
                }
            }
        }else if(island.length === 7){
            board_size = 'regular'
            $('#cs').attr('href',"./regular.css")
            $(`#board`).html(`
                <div id="dice_area"></div>
                <div id="receiving_area"><p id="receiving"><b>通信中…</b></p></div>
                <div id="deck_area"><div id="deckcase"><div id="deck"></div></div>&nbsp;×25</div>
                <img id="board_frame" src='./regular_board.png'>
                <img id="tile1" class="tile" data-direction="" src="./regular_ocean.png">
                <img id="tile2" class="tile" data-direction="" src="./regular_ocean.png">
                <img id="tile3" class="tile" data-direction="" src="./regular_ocean.png">
                <img id="tile4" class="tile" data-direction="" src="./regular_ocean.png">
                <img id="tile5" class="tile" data-direction="" src="./regular_ocean.png">
                <img id="tile6" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile7" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile8" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile9" class="tile" data-direction="" src="./regular_ocean.png">
                <img id="tile10" class="tile" data-direction="" src="./regular_ocean.png">
                <img id="tile11" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile12" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile13" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile14" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile15" class="tile" data-direction="" src="./regular_ocean.png">
                <img id="tile16" class="tile" data-direction="" src="./regular_ocean.png">
                <img id="tile17" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile18" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile19" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile20" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile21" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile22" class="tile" data-direction="" src="./regular_ocean.png">
                <img id="tile23" class="tile" data-direction="" src="./regular_ocean.png">
                <img id="tile24" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile25" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile26" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile27" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile28" class="tile" data-direction="" src="./regular_ocean.png">
                <img id="tile29" class="tile" data-direction="" src="./regular_ocean.png">
                <img id="tile30" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile31" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile32" class="tile" data-direction="" src="./regular_desert.png">
                <img id="tile33" class="tile" data-direction="" src="./regular_ocean.png">
                <img id="tile34" class="tile" data-direction="" src="./regular_ocean.png">
                <img id="tile35" class="tile" data-direction="" src="./regular_ocean.png">
                <img id="tile36" class="tile" data-direction="" src="./regular_ocean.png">
                <img id="tile37" class="tile" data-direction="" src="./regular_ocean.png">
                <div id="node1" class="node"><div id="nodetouch1" class="nodetouch"></div></div>
                <div id="node2" class="node"><div id="nodetouch2" class="nodetouch"></div></div>
                <div id="node3" class="node"><div id="nodetouch3" class="nodetouch"></div></div>
                <div id="node4" class="node"><div id="nodetouch4" class="nodetouch"></div></div>
                <div id="node5" class="node"><div id="nodetouch5" class="nodetouch"></div></div>
                <div id="node6" class="node"><div id="nodetouch6" class="nodetouch"></div></div>
                <div id="node7" class="node"><div id="nodetouch7" class="nodetouch"></div></div>
                <div id="node8" class="node"><div id="nodetouch8" class="nodetouch"></div></div>
                <div id="node9" class="node"><div id="nodetouch9" class="nodetouch"></div></div>
                <div id="node10" class="node"><div id="nodetouch10" class="nodetouch"></div></div>
                <div id="node11" class="node"><div id="nodetouch11" class="nodetouch"></div></div>
                <div id="node12" class="node"><div id="nodetouch12" class="nodetouch"></div></div>
                <div id="node13" class="node"><div id="nodetouch13" class="nodetouch"></div></div>
                <div id="node14" class="node"><div id="nodetouch14" class="nodetouch"></div></div>
                <div id="node15" class="node"><div id="nodetouch15" class="nodetouch"></div></div>
                <div id="node16" class="node"><div id="nodetouch16" class="nodetouch"></div></div>
                <div id="node17" class="node"><div id="nodetouch17" class="nodetouch"></div></div>
                <div id="node18" class="node"><div id="nodetouch18" class="nodetouch"></div></div>
                <div id="node19" class="node"><div id="nodetouch19" class="nodetouch"></div></div>
                <div id="node20" class="node"><div id="nodetouch20" class="nodetouch"></div></div>
                <div id="node21" class="node"><div id="nodetouch21" class="nodetouch"></div></div>
                <div id="node22" class="node"><div id="nodetouch22" class="nodetouch"></div></div>
                <div id="node23" class="node"><div id="nodetouch23" class="nodetouch"></div></div>
                <div id="node24" class="node"><div id="nodetouch24" class="nodetouch"></div></div>
                <div id="node25" class="node"><div id="nodetouch25" class="nodetouch"></div></div>
                <div id="node26" class="node"><div id="nodetouch26" class="nodetouch"></div></div>
                <div id="node27" class="node"><div id="nodetouch27" class="nodetouch"></div></div>
                <div id="node28" class="node"><div id="nodetouch28" class="nodetouch"></div></div>
                <div id="node29" class="node"><div id="nodetouch29" class="nodetouch"></div></div>
                <div id="node30" class="node"><div id="nodetouch30" class="nodetouch"></div></div>
                <div id="node31" class="node"><div id="nodetouch31" class="nodetouch"></div></div>
                <div id="node32" class="node"><div id="nodetouch32" class="nodetouch"></div></div>
                <div id="node33" class="node"><div id="nodetouch33" class="nodetouch"></div></div>
                <div id="node34" class="node"><div id="nodetouch34" class="nodetouch"></div></div>
                <div id="node35" class="node"><div id="nodetouch35" class="nodetouch"></div></div>
                <div id="node36" class="node"><div id="nodetouch36" class="nodetouch"></div></div>
                <div id="node37" class="node"><div id="nodetouch37" class="nodetouch"></div></div>
                <div id="node38" class="node"><div id="nodetouch38" class="nodetouch"></div></div>
                <div id="node39" class="node"><div id="nodetouch39" class="nodetouch"></div></div>
                <div id="node40" class="node"><div id="nodetouch40" class="nodetouch"></div></div>
                <div id="node41" class="node"><div id="nodetouch41" class="nodetouch"></div></div>
                <div id="node42" class="node"><div id="nodetouch42" class="nodetouch"></div></div>
                <div id="node43" class="node"><div id="nodetouch43" class="nodetouch"></div></div>
                <div id="node44" class="node"><div id="nodetouch44" class="nodetouch"></div></div>
                <div id="node45" class="node"><div id="nodetouch45" class="nodetouch"></div></div>
                <div id="node46" class="node"><div id="nodetouch46" class="nodetouch"></div></div>
                <div id="node47" class="node"><div id="nodetouch47" class="nodetouch"></div></div>
                <div id="node48" class="node"><div id="nodetouch48" class="nodetouch"></div></div>
                <div id="node49" class="node"><div id="nodetouch49" class="nodetouch"></div></div>
                <div id="node50" class="node"><div id="nodetouch50" class="nodetouch"></div></div>
                <div id="node51" class="node"><div id="nodetouch51" class="nodetouch"></div></div>
                <div id="node52" class="node"><div id="nodetouch52" class="nodetouch"></div></div>
                <div id="node53" class="node"><div id="nodetouch53" class="nodetouch"></div></div>
                <div id="node54" class="node"><div id="nodetouch54" class="nodetouch"></div></div>
                <div id="road1" class="road"></div>
                <div id="road2" class="road"></div>
                <div id="road3" class="road"></div>
                <div id="road4" class="road"></div>
                <div id="road5" class="road"></div>
                <div id="road6" class="road"></div>
                <div id="road7" class="road"></div>
                <div id="road8" class="road"></div>
                <div id="road9" class="road"></div>
                <div id="road10" class="road"></div>
                <div id="road11" class="road"></div>
                <div id="road12" class="road"></div>
                <div id="road13" class="road"></div>
                <div id="road14" class="road"></div>
                <div id="road15" class="road"></div>
                <div id="road16" class="road"></div>
                <div id="road17" class="road"></div>
                <div id="road18" class="road"></div>
                <div id="road19" class="road"></div>
                <div id="road20" class="road"></div>
                <div id="road21" class="road"></div>
                <div id="road22" class="road"></div>
                <div id="road23" class="road"></div>
                <div id="road24" class="road"></div>
                <div id="road25" class="road"></div>
                <div id="road26" class="road"></div>
                <div id="road27" class="road"></div>
                <div id="road28" class="road"></div>
                <div id="road29" class="road"></div>
                <div id="road30" class="road"></div>
                <div id="road31" class="road"></div>
                <div id="road32" class="road"></div>
                <div id="road33" class="road"></div>
                <div id="road34" class="road"></div>
                <div id="road35" class="road"></div>
                <div id="road36" class="road"></div>
                <div id="road37" class="road"></div>
                <div id="road38" class="road"></div>
                <div id="road39" class="road"></div>
                <div id="road40" class="road"></div>
                <div id="road41" class="road"></div>
                <div id="road42" class="road"></div>
                <div id="road43" class="road"></div>
                <div id="road44" class="road"></div>
                <div id="road45" class="road"></div>
                <div id="road46" class="road"></div>
                <div id="road47" class="road"></div>
                <div id="road48" class="road"></div>
                <div id="road49" class="road"></div>
                <div id="road50" class="road"></div>
                <div id="road51" class="road"></div>
                <div id="road52" class="road"></div>
                <div id="road53" class="road"></div>
                <div id="road54" class="road"></div>
                <div id="road55" class="road"></div>
                <div id="road56" class="road"></div>
                <div id="road57" class="road"></div>
                <div id="road58" class="road"></div>
                <div id="road59" class="road"></div>
                <div id="road60" class="road"></div>
                <div id="road61" class="road"></div>
                <div id="road62" class="road"></div>
                <div id="road63" class="road"></div>
                <div id="road64" class="road"></div>
                <div id="road65" class="road"></div>
                <div id="road66" class="road"></div>
                <div id="road67" class="road"></div>
                <div id="road68" class="road"></div>
                <div id="road69" class="road"></div>
                <div id="road70" class="road"></div>
                <div id="road71" class="road"></div>
                <div id="road72" class="road"></div>
                <div id="tile_button1" class="tile_button"></div>
                <div id="tile_button2" class="tile_button"></div>
                <div id="tile_button3" class="tile_button"></div>
                <div id="tile_button4" class="tile_button"></div>
                <div id="tile_button5" class="tile_button"></div>
                <div id="tile_button6" class="tile_button"></div>
                <div id="tile_button7" class="tile_button"></div>
                <div id="tile_button8" class="tile_button"></div>
                <div id="tile_button9" class="tile_button"></div>
                <div id="tile_button10" class="tile_button"></div>
                <div id="tile_button11" class="tile_button"></div>
                <div id="tile_button12" class="tile_button"></div>
                <div id="tile_button13" class="tile_button"></div>
                <div id="tile_button14" class="tile_button"></div>
                <div id="tile_button15" class="tile_button"></div>
                <div id="tile_button16" class="tile_button"></div>
                <div id="tile_button17" class="tile_button"></div>
                <div id="tile_button18" class="tile_button"></div>
                <div id="tile_button19" class="tile_button"></div>
                <img id="chip1" class="chip" src="">
                <img id="chip2" class="chip" src="">
                <img id="chip3" class="chip" src="">
                <img id="chip4" class="chip" src="">
                <img id="chip5" class="chip" src="">
                <img id="chip6" class="chip" src="">
                <img id="chip7" class="chip" src="">
                <img id="chip8" class="chip" src="">
                <img id="chip9" class="chip" src="">
                <img id="chip10" class="chip" src="">
                <img id="chip11" class="chip" src="">
                <img id="chip12" class="chip" src="">
                <img id="chip13" class="chip" src="">
                <img id="chip14" class="chip" src="">
                <img id="chip15" class="chip" src="">
                <img id="chip16" class="chip" src="">
                <img id="chip17" class="chip" src="">
                <img id="chip18" class="chip" src="">
                <img id="chip19" class="chip" src="">
            `)
            for(line of island){
                for(tile of line){
                    $(`#tile${tileNumber}`).attr(`src`, `./regular_${tile.type}.png`)
                    $(`#tile${tileNumber}`).attr(`data-direction`,`${tile.direction}`)
                    tileNumber += 1
                }
            }
            tileNumber = 1
            for(line of island){
                for(tile of line){
                    if(tile.type === 'ore'|| tile.type === 'grain'|| tile.type === 'brick'|| tile.type === 'lumber'|| tile.type === 'wool'|| tile.type === 'desert'){
                        if(tile.type !== 'desert'){
                            $(`#chip${tileNumber}`).attr(`src`, `./${tile.number}.png`)
                        }else{
                            $(`#chip${tileNumber}`).attr(`src`, ``)
                        }
                        tileNumber += 1
                    }
                }
            }
        }
        
        $(`#receiving_area`).hide()
    },
    allResource(game){
        $(`#receiving_area`).show();
        for(let p of game.players){
            $(`#player${p.number}resource`).html('')
            let numberOfResources = p.resource.ore + p.resource.grain + p.resource.wool + p.resource.lumber + p.resource.brick
            if(p.socketID === socket.id){
                for(r in p.resource){
                    let i = 1
                    while(i <= p.resource[r]){
                        $(`#player${p.number}resource`).append(`<p class="resourcecard ${String(r)}">${translate(String(r))}</p>`);
                        i += 1
                    };
                };
            }else{
                $(`#player${p.number}resource`).append(`資源:${numberOfResources}枚`);
            }
        };
        $(`#receiving_area`).hide();
    },
    resourceOf(data){
        $(`#receiving_area`).show();
        $(`#player${data.number}resource`).html('')
        if(data.socketID === socket.id){
            for(r in data.resource){
                let i = 1
                while(i <= data.resource[r]){
                    $(`#player${data.number}resource`).append(`<p class="resourcecard ${String(r)}">${translate(String(r))}</p>`);
                    i += 1
                };
            };
        }else{
            let numberOfResources = data.resource.ore + data.resource.grain + data.resource.wool + data.resource.lumber + data.resource.brick
            $(`#player${data.number}resource`).append(`資源:${numberOfResources}枚`);
        }
        $(`#receiving_area`).hide();
    },
    allToken(game){
        $(`#receiving_area`).show();
        for(let p of game.players){
            $(`#player${p.number}token`).html(`家:${p.token.house} 街:${p.token.city} 道:${p.token.road}`)
        };
        $(`#receiving_area`).hide();
    },
    tokenOf(data){
        $(`#receiving_area`).show();
        $(`#player${data.number}token`).html(`家:${data.token.house} 街:${data.token.city} 道:${data.token.road}`)
        $(`#receiving_area`).hide();
    },
    allTitle(game){
        $(`#receiving_area`).show();
        for(let p of game.players){
            $(`#player${p.number}title`).html(``)
            if(p.largestArmy === 2){
                $(`#player${p.number}title`).append(`<div class="titlesquare">大</div>`)
            }
            if(p.longestRoad === 2){
                $(`#player${p.number}title`).append(`<div class="titlesquare">長</div>`)
            }
        };
        $(`#receiving_area`).hide();
    },
    titleOf(data){
        $(`#receiving_area`).show();
        $(`#player${data.number}title`).html(``)
        if(data.largestArmy === 2){
            $(`#player${data.number}title`).append(`<div class="titlesquare">大</div>`)
        }
        if(data.longestRoad === 2){
            $(`#player${data.number}title`).append(`<div class="titlesquare">長</div>`)
        }
        $(`#receiving_area`).hide();
    },
    allProgress(game){
        $(`#receiving_area`).show();
        for(let p of game.players){
            $(`#player${p.number}progress`).html(``)
            if(p.socketID === socket.id){
                for(pr in p.progress){
                    let i = 1
                    while(i <= p.progress[pr]){
                        $(`#player${p.number}progress`).append(`<p class="progresscard ${String(pr)}card">${translate(String(pr))}</p>`);
                        i += 1
                    };
                };
            }else{
                for(pr in p.progress){
                    let i = 1
                    while(i <= p.progress[pr]){
                        $(`#player${p.number}progress`).append(`<p class="progresscard back">背</p>`);
                        i += 1
                    };
                };
            }
        };
        $(`#receiving_area`).hide();
    },
    progressOf(data){
        $(`#receiving_area`).show();
        $(`#player${data.number}progress`).html(``)
        if(data.socketID === socket.id){
            for(pr in data.progress){
                let i = 1
                while(i <= data.progress[pr]){
                    $(`#player${data.number}progress`).append(`<p class="progresscard ${String(pr)}card">${translate(String(pr))}</p>`);
                    i += 1
                };
            };
        }else{
            for(pr in data.progress){
                let i = 1
                while(i <= data.progress[pr]){
                    $(`#player${data.number}progress`).append(`<p class="progresscard back">背</p>`);
                    i += 1
                };
            };
        }
        $(`#receiving_area`).hide();
    },
    allUsed(game){
        $(`#receiving_area`).show();
        for(let p of game.players){
            $(`#player${p.number}used`).html(``)
            for(u in p.used){
                let i = 1
                while(i <= p.used[u]){
                    $(`#player${p.number}used`).append(`<p class="progresscard ${String(u)}card">${translate(String(u))}</p>`);
                    i += 1
                };
            };
        };
        $(`#receiving_area`).hide();
    },
    usedOf(data){
        $(`#receiving_area`).show();
        $(`#player${data.number}used`).html(``)
        for(u in data.used){
            let i = 1
            while(i <= data.used[u]){
                $(`#player${data.number}used`).append(`<p class="progresscard ${String(u)}card">${translate(String(u))}</p>`);
                i += 1
            };
        };
        $(`#receiving_area`).hide();
    },
    buildings(buildings){
        $(`#receiving_area`).show()
        for(let house of buildings.house){
            $(`#nodetouch${house.nodeNumber}`).html(`<img id="house${house.nodeNumber}" class="house" src="./house${house.owner.number+1}.png">`)
        }
        if(board_size === 'large'){
            for(let road of buildings.road){
                $(`#road${road.roadNumber}`).html(`<img id="roadtoken${road.roadNumber}" class="roadtoken" src="./road_${road.roadDegree}${road.owner.number+1}.png">`)
            }
        }else if(board_size === 'regular'){
            for(let road of buildings.road){
                $(`#road${road.roadNumber}`).html(`<img id="roadtoken${road.roadNumber}" class="roadtoken" src="./regular_road_${road.roadDegree}${road.owner.number+1}.png">`)
            }
        }
        for(let city of buildings.city){
            $(`#nodetouch${city.nodeNumber}`).html(`<img id="city${city.nodeNumber}" class="city" src="./city${city.owner.number+1}.png">`)
        }
        $(`#receiving_area`).hide()
    },
    addHouse(houseobj){
        $(`#receiving_area`).show()
        $(`#nodetouch${houseobj.nodeNumber}`).html(`<img id="house${houseobj.nodeNumber}" class="house" src="./house${houseobj.ownerNumber+1}.png">`)
        $(`#receiving_area`).hide()
    },
    addCity(cityobj){
        $(`#receiving_area`).show()
        $(`#nodetouch${cityobj.nodeNumber}`).html(`<img id="city${cityobj.nodeNumber}" class="city" src="./city${cityobj.ownerNumber+1}.png">`)
        $(`#receiving_area`).hide()
    },
    addRoad(roadobj){
        $(`#receiving_area`).show()
        if(board_size === 'large'){
            $(`#road${roadobj.roadNumber}`).html(`<img id="roadtoken${roadobj.roadNumber}" class="roadtoken" src="./road_${roadobj.roadDegree}${roadobj.ownerNumber+1}.png">`)
        }else if(board_size === 'regular'){
            $(`#road${roadobj.roadNumber}`).html(`<img id="roadtoken${roadobj.roadNumber}" class="roadtoken" src="./regular_road_${roadobj.roadDegree}${roadobj.ownerNumber+1}.png">`)
        }
        $(`#receiving_area`).hide()
    },
    thief(buttonnumber){
        $(`#receiving_area`).show();
        $(`.tile_button`).html(``)
        $(`#tile_button${buttonnumber}`).html(`<div id="thief"></div>`)
        $(`#receiving_area`).hide();
    },
    deleteThief(){
        $(`#receiving_area`).show();
        $(`.tile_button`).html(``)
        $(`#receiving_area`).hide();
    },
    hideMonopolyArea(){
        $(`#receiving_area`).show();
        $(`#monopoly_area`).hide()
        $(`#receiving_area`).hide();
    },
    showMonopolyArea(){
        $(`#receiving_area`).show();
        $(`#monopoly_area`).show()
        $(`#receiving_area`).hide();
    },
    hideHarvestArea(){
        $(`#receiving_area`).show();
        $(`#harvest_area`).hide()
        $(`#receiving_area`).hide();
    },
    showHarvestArea(){
        $(`#receiving_area`).show();
        $(`#harvest_area`).show()
        $(`#receiving_area`).hide();
    },
    hideBurstArea(){
        $(`#receiving_area`).show();
        $(`#burst_area`).hide()
        $(`#receiving_area`).hide();
    },
    showBurstArea(burstPlayer){
        $(`#receiving_area`).show();
        $(`#burst_area`).show()
        $(`#burst_message`).html(``)
        for(let player of burstPlayer){
            if(player.socketID === socket.id){
                $(`#trash_area`).show()
                $(`#burst_message`).append(`<p id="you_are_bursting"><b>バーストしました<br>あと${player.toTrash}枚捨ててください</b></p>`)
                $(`#receiving_area`).hide();
                return
            }
        }
        $(`#trash_area`).hide()
        let burst = ``
        for(let player of burstPlayer){
            burst += `と${player.name}`
        }
        burst = burst.slice(1)
        $(`#burst_message`).append(`<p><b>${burst}がバースト中です</b></p>`)
        $(`#receiving_area`).hide();
    },
    hideTradeArea(){
        $(`#receiving_area`).show();
        $(`#trade_area`).hide()
        $(`.resourcenumber`).val(``)
        $(`#receiving_area`).hide();
    },
    showTradeArea(){
        $(`#receiving_area`).show();
        $(`#trade_area`).show()
        $(`#receiving_area`).hide();
    },
    hideNegotiateArea(){
        $(`#receiving_area`).show();
        $(`#negotiate_area`).hide()
        $(`.resourcenumber`).val(``)
        $(`#receiving_area`).hide();
    },
    showNegotiateArea(){
        $(`#receiving_area`).show();
        $(`#negotiate_area`).show()
        $(`#receiving_area`).hide();
    },
    showProposeArea(data){
        $(`#receiving_area`).show();
        $(`#propose_area`).show()
        $(`#proposeterm`).html(``)
        $(`#acceptordeny`).hide()
        if(data.proposer.socketID === socket.id){
            $(`#proposeterm`).append(`<div><b>${data.proposee.name}</b>に</div>`)
            $(`#proposeterm`).append(`<div class='giveresource'></div>`)
            $(`#proposeterm`).append(`<div class='takeresource'></div>`)
            for(let resource in data.giveresource){
                let i = 1
                let j = 1
                while(i <= data.giveresource[resource]){
                    $(`#proposeterm .giveresource`).append(`<p class="resourcecard ${String(resource)}">${translate(String(resource))}</p>`);
                    i += 1
                };
                while(j <= data.takeresource[resource]){
                    $(`#proposeterm .takeresource`).append(`<p class="resourcecard ${String(resource)}">${translate(String(resource))}</p>`);
                    j += 1
                };
            };
            $(`#proposeterm .giveresource`).append(`をあげて`)
            $(`#proposeterm .takeresource`).append(`をもらう`)
        }else if(data.proposee.socketID === socket.id){
            $(`#acceptordeny`).show()
            $(`#proposeterm`).append(`<div><b>${data.proposer.name}</b>に</div>`)
            $(`#proposeterm`).append(`<div class='giveresource'></div>`)
            $(`#proposeterm`).append(`<div class='takeresource'></div>`)
            for(let resource in data.giveresource){
                let i = 1
                let j = 1
                while(i <= data.takeresource[resource]){
                    $(`#proposeterm .giveresource`).append(`<p class="resourcecard ${String(resource)}">${translate(String(resource))}</p>`);
                    i += 1
                };
                while(j <= data.giveresource[resource]){
                    $(`#proposeterm .takeresource`).append(`<p class="resourcecard ${String(resource)}">${translate(String(resource))}</p>`);
                    j += 1
                };
            };
            $(`#proposeterm .giveresource`).append(`をあげて`)
            $(`#proposeterm .takeresource`).append(`をもらう`) 
        }else{
            $(`#proposeterm`).append(`<div><b>${data.proposer.name}</b>&nbsp;が&nbsp;<b>${data.proposee.name}</b>&nbsp;に交渉中</div>`)
            $(`#proposeterm`).append(`<div class='giveresource'></div>`)
            $(`#proposeterm`).append(`<div class='takeresource'></div>`)
            for(let resource in data.giveresource){
                let i = 1
                let j = 1
                while(i <= data.giveresource[resource]){
                    $(`#proposeterm .giveresource`).append(`<p class="resourcecard ${String(resource)}">${translate(String(resource))}</p>`);
                    i += 1
                };
                while(j <= data.takeresource[resource]){
                    $(`#proposeterm .takeresource`).append(`<p class="resourcecard ${String(resource)}">${translate(String(resource))}</p>`);
                    j += 1
                };
            };
            $(`#proposeterm .giveresource`).append(`をあげて`)
            $(`#proposeterm .takeresource`).append(`をもらう`)
        }
        $(`#receiving_area`).hide();
    },
    hideProposeArea(){
        $(`#receiving_area`).show();
        $(`#propose_area`).hide()
        $(`#acceptordeny`).hide()
        $(`#proposeterm`).html(``)
        $(`#receiving_area`).hide();
    },
    hidePlayers(){
        $(`#receiving_area`).show();
        $(`#players`).hide()
        $(`#receiving_area`).hide();
    },
    gameResult(data){
        $(`#receiving_area`).show();
        $(`#message_area`).html(`<h1>${data.turnPlayer.name}の勝ちです!</h1>`)
        for(let p of data.players){
            $(`#player${p.number}resource`).html('')
            $(`#player${p.number}progress`).html('')
            let numberOfResources = p.resource.ore + p.resource.grain + p.resource.wool + p.resource.lumber + p.resource.brick
            let numberOfProgress = p.progress.knight + p.progress.road + p.progress.harvest + p.progress.monopoly + p.progress.point
            if(numberOfResources === 0){
                $(`#player${p.number}resource`).html('<p> </p>')
            }
            if(numberOfProgress === 0){
                $(`#player${p.number}progress`).html('<p> </p>')
            }
            for(r in p.resource){
                let i = 1
                while(i <= p.resource[r]){
                    $(`#player${p.number}resource`).append(`<p class="resourcecard ${String(r)}">${translate(String(r))}</p>`);
                    i += 1
                };
            }
            for(pr in p.progress){
                let i = 1
                while(i <= p.progress[pr]){
                    $(`#player${p.number}progress`).append(`<p class="resourcecard ${String(pr)}card">${translate(String(pr))}</p>`);
                    i += 1
                };
            };
        };
        $(`#dice_percentage`).show()
        let total = 0
        for(let number in data.diceCount){
            total += data.diceCount[number]
        }
        $(`#dice_percentage`).html(`2:${Math.round(data.diceCount[2]/total*100)}%<br>3:${Math.round(data.diceCount[3]/total*100)}%<br>4:${Math.round(data.diceCount[4]/total*100)}%<br>5:${Math.round(data.diceCount[5]/total*100)}%<br>6:${Math.round(data.diceCount[6]/total*100)}%<br>7:${Math.round(data.diceCount[7]/total*100)}%<br>8:${Math.round(data.diceCount[8]/total*100)}%<br>9:${Math.round(data.diceCount[9]/total*100)}%<br>10:${Math.round(data.diceCount[10]/total*100)}%<br>11:${Math.round(data.diceCount[11]/total*100)}%<br>12:${Math.round(data.diceCount[12]/total*100)}%`)
        $(`#receiving_area`).hide();
    },
    showGameEndArea(){
        $(`#receiving_area`).show();
        $(`#gameend_area`).show()
        $(`#receiving_area`).hide();
    },
    hideGameEndArea(){
        $(`#receiving_area`).show();
        $(`#gameend_area`).hide();
        $(`#message_area`).html(``);
        $(`#receiving_area`).hide();
    },
    turnPlayer(data){
        $(`#receiving_area`).show();
        let i = 0;
        while(i <= 5){
            $(`#player${i}name`).css('background-color', '');
            i += 1
        }
        if(data.phase !== 'building'){
            $(`#player${data.tn}name`).css('background-color', 'rgb(255, 123, 0)');
        }else{
            $(`#player${data.tn}name`).css('background-color', 'rgba(38, 230, 38, 0.514)');
        }
        $(`#receiving_area`).hide();
    },
    log(a){
        console.log(a)
    },
    ////////////
    playerSort(players){
        $(`#receiving_area`).show();
        let myNumber
        $(`.propose_button`).show()
        $('#playerinformation').html('')
        for(p of players){
            if(p.socketID === socket.id){
                myNumber = p.number
                $(`#to${myNumber}`).hide()
                $('#playerinformation').append(
                    `<div id="player${myNumber}" class="player" data-name="${players[myNumber].name}" data-number="${players[myNumber].number}">
                        <div id="player${myNumber}row1" class="row">
                            <div class="nameline">
                                <div id="player${myNumber}mark" class="playermark player${myNumber}color"><b>${myNumber+1}</b></div>
                                <div id="player${myNumber}name" class="name"><b>${players[myNumber].name}</b></div>
                            </div>
                            <div id="player${myNumber}token" class="token line" >家:${players[myNumber].token.house} 街:${players[myNumber].token.city} 道:${players[myNumber].token.road}</div>
                        </div>
                        <div id="player${myNumber}row2" class="row">
                            <div id="player${myNumber}resource" class="resource line"> </div>
                            <div id="player${myNumber}title" class="title line"> </div>
                        </div>
                        <div id="player${myNumber}row3" class="row">
                            <div id="player${myNumber}progress" class="progress line"> </div>
                            <div id="player${myNumber}used" class="used line"> </div>
                        </div>
                    </div>`
                )
                let i = 1
                while(i <= players.length - 1){
                    if(myNumber === players.length - 1){
                        myNumber = 0
                    }else{
                        myNumber += 1
                    }
                    $(`#to${myNumber}`).html(`${players[myNumber].name}`)
                    $('#playerinformation').append(
                        `<div id="player${myNumber}" class="player" data-name="${players[myNumber].name}" data-number="${players[myNumber].number}">
                            <div id="player${myNumber}row1" class="row">
                                <div class="nameline">
                                    <div id="player${myNumber}mark" class="playermark player${myNumber}color"><b>${myNumber+1}</b></div>
                                    <div id="player${myNumber}name" class="name"><b>${players[myNumber].name}</b>
                                    </div>
                                </div>
                                <div id="player${myNumber}token" class="token line" >家:${players[myNumber].token.house} 街:${players[myNumber].token.city} 道:${players[myNumber].token.road}</div>
                            </div>
                            <div id="player${myNumber}row2" class="row">
                                <div id="player${myNumber}resource" class="resource line"> </div>
                                <div id="player${myNumber}title" class="title line"> </div>
                            </div>
                            <div id="player${myNumber}row3" class="row">
                                <div id="player${myNumber}progress" class="progress line"> </div>
                                <div id="player${myNumber}used" class="used line"> </div>
                            </div>
                        </div>`
                    )
                    i += 1
                }
                $(`#receiving_area`).hide();
                return
            }
        }
        myNumber = 0
        for(p of players){
            $(`#receiving_area`).show();
            $('#playerinformation').append(
                `<div id="player${myNumber}" class="player" data-name="${players[myNumber].name}" data-number="${players[myNumber].number}">
                    <div id="player${myNumber}row1" class="row">
                        <div class="nameline">
                        <div id="player${myNumber}mark" class="playermark player${myNumber}color"><b>${myNumber+1}</b></div>
                        <div id="player${myNumber}name" class="name"><b>${players[myNumber].name}</b></div>
                        </div>
                        <div id="player${myNumber}token" class="token line" >家:${players[myNumber].token.house} 街:${players[myNumber].token.city} 道:${players[myNumber].token.road}</div>
                    </div>
                    <div id="player${myNumber}row2" class="row">
                        <div id="player${myNumber}resource" class="resource line"> </div>
                        <div id="player${myNumber}title" class="title line"> </div>
                    </div>
                    <div id="player${myNumber}row3" class="row">
                        <div id="player${myNumber}progress" class="progress line"> </div>
                        <div id="player${myNumber}used" class="used line"> </div>
                    </div>
                </div>`
            )
            if(myNumber === players.length - 1){
                myNumber = 0
            }else{
                myNumber += 1
            }
        }
        $(`#receiving_area`).hide();
    },
    hideButtonArea(){
        $(`#receiving_area`).show();
        $('#button_area').hide()
        $(`#receiving_area`).hide();
    },
    showButtonArea(){
        $(`#receiving_area`).show();
        $(`#buttons`).show()
        $('#button_area').show()
        $(`#receiving_area`).hide();
    },
    showNameInputArea(playersName){
        $(`#receiving_area`).show();
        $(`#nameinputarea`).show();
        $('#size_select').show();
        $('#tileamounts').show();
        $(`#gamestart`).show()
        $('#nameinputarea').html('<h1>九州の開拓者たち</h1><h2>名前を入力してください</h2>')
        let i = 1
        for(let player of playersName){
            if(player.name){
                $('#nameinputarea').append(`<div class="player${i-1}">
                    <p><b>${player.name}</b></p>
                </div>`)
            }else{
                $('#nameinputarea').append(`<div class="player${i-1}">
                    <div class="playername">
                        <input type="text" class="nameinput" data-namenumber="${i-1}">
                        <input type="button" value="決定" class="namebutton action_button">
                    </div>
                </div>`)
            }
            i += 1
        }
        $(`#receiving_area`).hide();
    },
    hideYesOrNoButton(){
        $(`#receiving_area`).show();
        $(`#yesorno`).hide()
        $(`#receiving_area`).hide();
    },
    cleanUpBoard(){
        $(`#receiving_area`).show();
        $(`.nodetouch`).html(``)
        $(`.road`).html(``)
        $(`.tile_button`).html(``)
        $(`#dice_area`).html(``)
        $(`#receiving_area`).hide();
    },
    dice(dice){
        $(`#receiving_area`).show();
        $(`#dice_area`).show()
        $(`#dice_area`).css(`background-color`, `rgb(131, 221, 131)`)
        $(`#dice_area`).html(`<img class="dice" src="./dice${dice[0]}.png" alt="dice${dice[0]}"><img class="dice" src="./dice${dice[1]}.png" alt="dice${dice[1]}">`)
        if(dice[0]+dice[1] === 7){
            $(`#dice_area`).css(`background-color`, `red`)
        }
        $(`#receiving_area`).hide();
    },
    diceBlack(){
        $(`#receiving_area`).show();
        $(`#dice_area`).css(`background-color`, `rgb(131, 221, 131)`)
        $(`#receiving_area`).hide();
    },
    hidemessageArea(){
        $(`#receiving_area`).show();
        $(`#message_area`).hide()
        $(`#message_area`).html(``)
        $(`#receiving_area`).hide();
    },
    showButton(string){
        $(`#receiving_area`).show();
        $(`#${string}_button`).show()
        $(`#receiving_area`).hide();
    },
    hideButton(string){
        $(`#receiving_area`).show();
        $(`#${string}_button`).hide()
        $(`#receiving_area`).hide();
    },
    renounce(renounce){
        $(`#receiving_area`).show();
        $(`.playermark`).css(`color`,``)
        for(let player of renounce){
            if(player.socketID === socket.id){
                $(`#player${player.number}mark`).css(`color`,`white`)
            }
        }
        $(`#receiving_area`).hide();
    },
    hideDicePercentage(){
        $(`#dice_percentage`).html(``)
        $(`#dice_percentage`).hide()
    },
}


//コンソールに表示
function game(){
    let e = ''
    socket.emit('console',e)
    $(`#receiving_area`).show()
}
function translate(item){
    if(item === 'ore'){
        return '鉄'
    }else if(item === 'grain'){
        return '米'
    }else if(item === 'wool'){
        return '羊'
    }else if(item === 'lumber'){
        return '木'
    }else if(item === 'brick'){
        return '煉'
    }else if(item === 'knight'){
        return '騎'
    }else if(item === 'roadbuild'){
        return '道'
    }else if(item === 'harvest'){
        return '収'
    }else if(item === 'monopoly'){
        return '独'
    }else if(item === 'point'){
        return '点'
    }
}
socket.on('console',(game)=>{
    console.log(game)
})

const socket = io();
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
    let ore = Number($(`#oretileamount`).val())
    let grain = Number($(`#ricetileamount`).val())
    let wool = Number($(`#wooltileamount`).val())
    let lumber = Number($(`#lumbertileamount`).val())
    let brick = Number($(`#bricktileamount`).val())
    let tileamounts
    if(ore === 0 && grain === 0 && wool === 0 && lumber === 0 && brick === 0){
        /////
        tileamounts = {ore:5,grain:6,wool:6,lumber:6,brick:5}
    }else{
        tileamounts = {ore:ore,grain:grain,wool:wool,lumber:lumber,brick:brick}
    }
    let total = 0
    for(resource in tileamounts){
        total += tileamounts[resource]
    }
    /////
    if(total > 28){
        return
    }
    const data = {tileamounts:tileamounts}
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










socket.on('hideItems', (game)=>{
    display.hideItems(game)
});

socket.on('allResource', (game)=>{
    display.allResource(game)
});
socket.on('allToken', (game)=>{
    display.allToken(game)
});
socket.on('allTitle', (game)=>{
    display.allTitle(game)
});
socket.on('allProgress', (game)=>{
    display.allProgress(game)
});
socket.on('allUsed', (game)=>{
    display.allUsed(game)
});
socket.on('buildings', (game)=>{
    display.buildings(game)
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
socket.on('gameresult', (game)=>{
    display.gameResult(game)
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
    console.log('受信')
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
//ドローボタンをクリック
$(`#button_area`).on('click','#draw_button',function(){
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
$(`#dice_area`).on('click',function(){
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
        $('#tileamounts').hide();
        $('#field').show();
        $(`#receiving_area`).hide();
    },
    island(island){
        $(`#receiving_area`).show()
        $('#field').show()
        let tileNumber = 1
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
        console.log('bb')
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
    allToken(game){
        $(`#receiving_area`).show();
        for(let p of game.players){
            $(`#player${p.number}token`).html(`家:${p.token.house} 街:${p.token.city} 道:${p.token.road}`)
        };
    },
    allTitle(game){
        $(`#receiving_area`).show();
        for(let p of game.players){
            $(`#player${p.number}title`).html(``)
            if(p.largestArmy === 2){
                $(`#player${p.number}title`).append(`<p class="titlesquare">大</p>`)
            }
            if(p.longestRoad === 2){
                $(`#player${p.number}title`).append(`<p class="titlesquare">長</p>`)
            }
        };
        $(`#receiving_area`).hide();
    },
    allProgress(game){
        $(`#receiving_area`).show();
        for(let p of game.players){
            $(`#player${p.number}progress`).html(``)
            let numberOfProgress = p.progress.knight + p.progress.road + p.progress.harvest + p.progress.monopoly + p.progress.point
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
    allUsed(game){
        $(`#receiving_area`).show();
        for(let p of game.players){
            $(`#player${p.number}used`).html(``)
            for(u in p.used){
                let i = 1
                while(i <= p.used[u]){
                    $(`#player${p.number}used`).append(`<p class="usedcard ${String(u)}card">${translate(String(u))}</p>`);
                    i += 1
                };
            };
        };
        $(`#receiving_area`).hide();
    },
    buildings(game){
        $(`#receiving_area`).show()
        for(house of game.board.house){
            $(`#nodetouch${house.nodeNumber}`).html(``)
            $(`#nodetouch${house.nodeNumber}`).append(`<img id="house${house.nodeNumber}" class="house" src="./house${house.owner.number+1}.png">`)
        }
        for(road of game.board.road){
            $(`#road${road.roadNumber}`).html(``)
            $(`#road${road.roadNumber}`).append(`<img id="roadtoken${road.roadNumber}" class="roadtoken" src="./road_${road.roadDegree}${road.owner.number+1}.png">`)
        }
        for(city of game.board.city){
            $(`#nodetouch${city.nodeNumber}`).html(``)
            $(`#nodetouch${city.nodeNumber}`).append(`<img id="city${city.nodeNumber}" class="city" src="./city${city.owner.number+1}.png">`)
        }
        console.log('aa')
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
            $(`#proposeterm`).append(`<div>${data.proposee.name}に提案中</div>`)
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
            $(`#proposeterm`).append(`<div>${data.proposer.name}に</div>`)
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
            $(`#proposeterm`).append(`<div>${data.proposer.name}が${data.proposee.name}に交渉中</div>`)
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
    gameResult(game){
        $(`#receiving_area`).show();
        $(`#message_area`).html(`<h1>${game.turnPlayer.name}の勝ちです!</h1>`)
        for(let p of game.players){
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
        $(`#receiving_area`).hide();
    },
    showGameEndArea(){
        $(`#receiving_area`).show();
        $(`#gameend_area`).show()
        $(`#receiving_area`).hide();
    },
    hideGameEndArea(){
        $(`#receiving_area`).show();
        $(`#gameend_area`).hide()
        $(`#message_area`).html(``)
        $(`#receiving_area`).hide();
    },
    turnPlayer(data){
        $(`#receiving_area`).show();
        let i = 0;
        while(i <= 5){
            $(`#player${i}`).css('border', '3px solid black');
            i += 1
        }
        if(data.phase !== 'building'){
            $(`#player${data.tn}`).css('border', '5px solid purple');
        }else{
            $(`#player${data.tn}`).css('border', '5px solid green');
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
        $('#button_area').show()
        $(`#receiving_area`).hide();
    },
    showNameInputArea(playersName){
        $(`#receiving_area`).show();
        $(`#nameinputarea`).show()
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

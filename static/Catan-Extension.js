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
    $(`.player${namedata.number}`).html(`<p><strong>${namedata.name}</strong></p>`)
})

//スタートボタンクリック発信
$('#gamestartbutton').on('click', function(){
    let ore = Number($(`#oretileamount`).val())
    let grain = Number($(`#ricetileamount`).val())
    let wool = Number($(`#wooltileamount`).val())
    let lumber = Number($(`#lumbertileamount`).val())
    let brick = Number($(`#bricktileamount`).val())
    const tileamounts ={ore:ore,grain:grain,wool:wool,lumber:lumber,brick:brick}
    let total = 0
    for(resource in tileamounts){
        total += tileamounts[resource]
    }
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
            $(`.player${playersName.indexOf(player)}`).html(`<p><strong>${player.name}</strong></p>`)
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
socket.on('deletethief', (buttonnumber)=>{
    display.deleteThief(buttonnumber)
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
socket.on('showburst', (e)=>{
    display.showBurstArea()
});
socket.on('showburst', (e)=>{
    display.showBurstArea()
});
socket.on('showtrade', (e)=>{
    display.showTradeArea()
});
socket.on('shownegotiate', (e)=>{
    display.showNegotiateArea()
});
socket.on('showproposing', (data)=>{
    display.showProposing(data)
});
socket.on('showproposed', (data)=>{
    display.showProposed(data)
});
socket.on('hideproposing', (e)=>{
    display.hideProposing()
});
socket.on('hideproposed', (e)=>{
    display.hideProposed()
});
socket.on('hideplayers', (e)=>{
    display.hidePlayers()
})
socket.on('hideBoard_And_Button', (e)=>{
    display.hideBoard_And_Button()
});
socket.on('showBoard_And_Button', (e)=>{
    display.showBoard_And_Button()
});
socket.on('gameresult', (game)=>{
    display.gameResult(game)
})
socket.on('reloadrate', (data)=>{
    $(`#exportore`).attr(`step`, data.ore)
    $(`#exportgrain`).attr(`step`, data.grain)
    $(`#exportwool`).attr(`step`, data.wool)
    $(`#exportlumber`).attr(`step`, data.lumber)
    $(`#exportbrick`).attr(`step`, data.brick)
})
socket.on('yesbuttonclick', (maxPlayer)=>{
    display.initialize(maxPlayer)
});
socket.on('turnplayer', (tn)=>{
    display.turnPlayer(tn)
})
socket.on('turnplayerdelete', ()=>{
    display.turnPlayerDelete()
})
socket.on('takeover', (player)=>{
    display.takeOver(player)
})
socket.on('toggletakeoverbutton',()=>{
    display.toggleTakeOver()
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
socket.on('showgamestartbutton',()=>{
    display.showGameStartButton()
})
socket.on('cleanupboard',()=>{
    display.cleanUpBoard()
})
socket.on('dice',(dice)=>{
    display.dice(dice)
})
socket.on('hidemessagearea',()=>{
    display.hidemessageArea()
})

//nodeをクリック
$(`#board_area`).on('click','.node',function(){
    let nodeNumber = Number($(this).attr('id').slice(4))
    const data = {nodeNumber:nodeNumber, socketID:socket.id}
    socket.emit('nodeclick', data)
});
//roadをクリック
$(`#board_area`).on('click','.road',function(){
    let roadNumber = Number($(this).attr('id').slice(4))
    const data = {roadNumber:roadNumber, socketID:socket.id}
    socket.emit('roadclick', data)
});
//ダイスボタンをクリック
$(`#button_area`).on('click','#dice_button',function(){
    const data = {socketID:socket.id}
    socket.emit('diceclick', data)
});
//ドローボタンをクリック
$(`#button_area`).on('click','#draw_button',function(){
    const data = {socketID:socket.id}
    socket.emit('drawclick', data)
});
//騎士ボタンをクリック
$(`#button_area`).on('click','#knight_button',function(){
    const data = {socketID:socket.id}
    socket.emit('knightclick', data)
});
//タイルボタンをクリック
$(`#board_area`).on('click','.tile_button',function(){
    let tileButtonNumber = Number($(this).attr('id').slice(11))
    const data = {tileButtonNumber:tileButtonNumber, socketID:socket.id}
    socket.emit('thiefmove', data)
});
//独占ボタンをクリック
$(`#button_area`).on('click','#monopoly_button',function(){
    const data = {socketID:socket.id}
    socket.emit('monopolybutton', data)
});
//独占資源ボタンをクリック
$(`#monopoly_area`).on(`click`, `.resource_button`, function(){
    let resource = $(this).attr('id').slice(9)
    const data = {resource:resource, socketID:socket.id}
    socket.emit('monopoly', data)
})
//収穫ボタンをクリック
$(`#button_area`).on('click','#harvest_button',function(){
    const data = {socketID:socket.id}
    socket.emit('harvestbutton', data)
});
//収穫資源ボタンをクリック
$(`#harvest_area`).on(`click`, `.resource_button`, function(){
    let resource = $(this).attr('id').slice(8)
    const data = {resource:resource, socketID:socket.id}
    socket.emit('harvest', data)
})
//街道建設ボタンをクリック
$(`#button_area`).on('click','#roadbuild_button',function(){
    const data = {socketID:socket.id}
    socket.emit('roadbuildclick', data)
});
//終了ボタンをクリック
$(`#button_area`).on('click','#end_button',function(){
    const data = {socketID:socket.id}
    socket.emit('endbuttonclick', data)
});
//バースト資源ボタンをクリック
$(`#burst_area`).on(`click`, `.resource_button`, function(){
    let resource = $(this).attr('id').slice(6)
    const data = {resource:resource, socketID:socket.id}
    socket.emit('burst', data)
})
//貿易ボタンをクリック
$(`#button_area`).on('click','#trade_button',function(){
    const data = {socketID:socket.id}
    socket.emit('tradebuttonclick', data)
});
//貿易決定ボタンをクリック
$(`#trade_area`).on('click','#tradedecide',function(){
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
    console.log(data)
    socket.emit('tradedecide', data)
});
//交渉ボタンをクリック
$(`#button_area`).on('click','#negotiate_button',function(){
    const data = {socketID:socket.id}
    socket.emit('negotiatebuttonclick', data)
});
//交渉相手ボタンをクリック
$(`#counterpart`).on('click','.propose_button',function(){
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
    console.log(data)
    socket.emit('propose', data)
});
//同意ボタンをクリック
$(`#acceptordeny`).on('click','#accept',function(){
    const data = {socketID:socket.id}
    socket.emit('accept', data)
});
//断るボタンをクリック
$(`#acceptordeny`).on('click','#deny',function(){
    const data = {socketID:socket.id}
    socket.emit('deny', data)
});




//街道ボタンをクリック
$(`#button_area`).on('click','#road_button',function(){
    const data = {socketID:socket.id}
    socket.emit('roadbuttonclick', data)
});
//収穫ボタンをクリック
$(`#button_area`).on('click','#harvest_button',function(){
    const data = {socketID:socket.id}
    socket.emit('harvestclick', data)
});

//継承
$('#others').on('click', '.name', function(){
    console.log('継承')
    let n = Number($(this).parent().parent().data('number'))
    let player ={number:n, socketID:socket.id}
    console.log(player)
    socket.emit('takeover', player)
});






//もう一度遊ぶ
$('#newgamebutton').on('click',function(){
    let e =''
    socket.emit('newgamebuttonclick', e)
});






//画面表示
const display = {
    hideBoard_And_Button(){
        $('#board_and_button').hide()
    },
    showBoard_And_Button(){
        $('#board_and_button').show()
      },
    hideItems(game){
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
        $('#players').show();
    },
    island(island){
        $('#board_and_button').show()
        let tileNumber = 1
        for(line of island){
            for(tile of line){
                $(`#tile${tileNumber}`).attr(`src`, `./${tile.type}.png`)
                $(`#tile${tileNumber}`).addClass(`direction${tile.direction}`)
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
    },
    allResource(game){
        for(let p of game.players){
            $(`#player${p.number}resource`).html('')
            let numberOfResources = p.resource.ore + p.resource.grain + p.resource.wool + p.resource.lumber + p.resource.brick
            if(p.socketID === socket.id){
                for(r in p.resource){
                    let i = 1
                    while(i <= p.resource[r]){
                        $(`#player${p.number}resource`).append(`<p class="square ${String(r)}">${translate(String(r))}</p>`);
                        i += 1
                    };
                };
            }else{
                $(`#player${p.number}resource`).append(`資源:${numberOfResources}枚`);
            }
        };
    },
    allToken(game){
        for(let p of game.players){
            $(`#player${p.number}token`).html(`家:${p.token.house} 街:${p.token.city} 道:${p.token.road}`)
        };
    },
    allTitle(game){
        for(let p of game.players){
            $(`#player${p.number}title`).html(``)
            if(p.largestArmy === 2){
                $(`#player${p.number}title`).append(`<p class="square">大</p>`)
            }
            if(p.longestRoad === 2){
                $(`#player${p.number}title`).append(`<p class="square">長</p>`)
            }
        };
    },
    allProgress(game){
        for(let p of game.players){
            $(`#player${p.number}progress`).html('')
            let numberOfProgress = p.progress.knight + p.progress.road + p.progress.harvest + p.progress.monopoly + p.progress.point
            if(p.socketID === socket.id){
                for(pr in p.progress){
                    let i = 1
                    while(i <= p.progress[pr]){
                        $(`#player${p.number}progress`).append(`<p class="square ${String(pr)}card">${translate(String(pr))}</p>`);
                        i += 1
                    };
                };
            }else{
                for(pr in p.progress){
                    let i = 1
                    while(i <= p.progress[pr]){
                        $(`#player${p.number}progress`).append(`<p class="square back">背</p>`);
                        i += 1
                    };
                };
            }
        };
    },
    allUsed(game){
        for(let p of game.players){
            $(`#player${p.number}used`).html('')
            for(u in p.used){
                let i = 1
                while(i <= p.used[u]){
                    $(`#player${p.number}used`).append(`<p class="square ${String(u)}card">${translate(String(u))}</p>`);
                    i += 1
                };
            };
        };
    },
    buildings(game){
        for(house of game.board.house){
            $(`#node${house.nodeNumber}`).html(``)
            $(`#node${house.nodeNumber}`).append(`<img id="house${house.nodeNumber}" class="house" src="./house${house.owner.number+1}.png">`)
        }
        for(road of game.board.road){
            $(`#road${road.roadNumber}`).html(``)
            $(`#road${road.roadNumber}`).append(`<img id="roadtoken${road.roadNumber}" class="roadtoken" src="./road_${road.roadDegree}${road.owner.number+1}.png">`)
        }
        for(city of game.board.city){
            $(`#node${city.nodeNumber}`).html(``)
            $(`#node${city.nodeNumber}`).append(`<img id="city${city.nodeNumber}" class="city" src="./city${city.owner.number+1}.png">`)
        }
    },
    thief(buttonnumber){
        $(`.tile_button`).html(``)
        $(`#tile_button${buttonnumber}`).html(`<div id="thief"></div>`)
    },
    deleteThief(buttonnumber){
        $(`#tile_button${buttonnumber}`).html(``)
    },
    hideMonopolyArea(){
        $(`#monopoly_area`).hide()
    },
    showMonopolyArea(){
        $(`#monopoly_area`).show()
    },
    hideHarvestArea(){
        $(`#harvest_area`).hide()
    },
    showHarvestArea(){
        $(`#harvest_area`).show()
    },
    hideBurstArea(){
        $(`#burst_area`).hide()
    },
    showBurstArea(){
        $(`#burst_area`).show()
    },
    hideTradeArea(){
        $(`#trade_area`).hide()
        $(`.resourcenumber`).val(``)
    },
    showTradeArea(){
        $(`#trade_area`).show()
    },
    hideNegotiateArea(){
        $(`#negotiate_area`).hide()
        $(`.resourcenumber`).val(``)
    },
    showNegotiateArea(){
        $(`#negotiate_area`).show()
    },
    showProposing(data){
        $(`#proposing_area`).show()
        $(`#proposing_area`).html(``)
        $(`#proposing_area`).append(`<div>${data.proposee.name}に</div>`)
        $(`#proposing_area`).append(`<div class='giveresource'></div>`)
        $(`#proposing_area`).append(`<div class='takeresource'></div>`)
        for(let resource in data.giveresource){
            let i = 1
            let j = 1
            while(i <= data.giveresource[resource]){
                $(`#proposing_area .giveresource`).append(`<div class="square ${String(resource)}">${translate(String(resource))}</div>`);
                i += 1
            };
            while(j <= data.takeresource[resource]){
                $(`#proposing_area .takeresource`).append(`<div class="square ${String(resource)}">${translate(String(resource))}</div>`);
                j += 1
            };
        };
        $(`#proposing_area .giveresource`).append(`<div>をあげて</div>`)
        $(`#proposing_area .takeresource`).append(`<div>をもらう</div>`)
    },
    showProposed(data){
        $(`#proposed_area`).show()
        $(`#proposeterm`).html(``)
        $(`#proposeterm`).append(`<div>${data.proposer.name}に</div>`)
        $(`#proposeterm`).append(`<div class='giveresource'></div>`)
        $(`#proposeterm`).append(`<div class='takeresource'></div>`)
        for(let resource in data.giveresource){
            let i = 1
            let j = 1
            while(i <= data.takeresource[resource]){
                $(`#proposeterm .giveresource`).append(`<div class="square ${String(resource)}">${translate(String(resource))}</div>`);
                i += 1
            };
            while(j <= data.giveresource[resource]){
                $(`#proposeterm .takeresource`).append(`<div class="square ${String(resource)}">${translate(String(resource))}</div>`);
                j += 1
            };
        };
        $(`#proposeterm .giveresource`).append(`<div>をあげて</div>`)
        $(`#proposeterm .takeresource`).append(`<div>をもらう</div>`)
    },
    hideProposing(){
        $(`#proposing_area`).hide()
        $(`#proposing_area`).html(``)
    },
    hideProposed(){
        $(`#proposed_area`).hide()
        $(`#proposeterm`).html(``)
    },
    hidePlayers(){
        $(`#players`).hide()
    },
    gameResult(game){
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
                    $(`#player${p.number}resource`).append(`<p class="square ${String(r)}">${translate(String(r))}</p>`);
                    i += 1
                };
            }
            for(pr in p.progress){
                let i = 1
                while(i <= p.progress[pr]){
                    $(`#player${p.number}progress`).append(`<p class="square ${String(pr)}card">${translate(String(pr))}</p>`);
                    i += 1
                };
            };
        };
    },
    turnPlayer(tn){
        let i = 0;
        while(i <= 5){
            $(`#player${i}`).css('border-color', 'black');
            $(`#player${i}`).css('border', '3px solid');
            i += 1
        }
        $(`#player${tn}`).css('border', '5px solid');
        $(`#player${tn}`).css('border-color', 'purple');
    },
    turnPlayerDelete(){
        let i = 0;
        while(i <= 4){
            $(`#player${i}`).css('border-color', 'black');
            $(`#player${i}`).css('border', '3px solid');
            i += 1
        }
    },
    log(a){
        console.log(a)
    },
    playerSort(players){
        console.log(players)
        let myNumber
        $(`.propose_button`).show()
        for(p of players){
            if(p.socketID === socket.id){
                $('#my_area').html('')
                console.log('#my_area消去')
                myNumber = p.number
                $(`#to${myNumber}`).hide()
                console.log('#my_areaに追加')
                $('#my_area').append(
                    `<div id="player${myNumber}" class="player" data-name="${players[myNumber].name}" data-number="${players[myNumber].number}">
                        <div id="player${myNumber}row1" class="row">
                            <div id="player${myNumber}name" class="name"><strong>${myNumber+1}:${players[myNumber].name}</strong></div>
                            <div id="player${myNumber}token" class="token" >家:${players[myNumber].token.house} 街:${players[myNumber].token.city} 道:${players[myNumber].token.road}</div>
                        </div>
                        <div id="player${myNumber}row2" class="row">
                            <div id="player${myNumber}resource" class="resource"></div>
                            <div id="player${myNumber}title" class="title"></div>
                        </div>
                        <div id="player${myNumber}row3" class="row">
                            <div id="player${myNumber}progress" class="progress"></div>
                            <div id="player${myNumber}used" class="used"></div>
                        </div>
                    </div>`
                )
                $('#others').html('')
                console.log('#others消去')
                let i = 1
                while(i <= players.length - 1){
                    if(myNumber === players.length - 1){
                        myNumber = 0
                    }else{
                        myNumber += 1
                    }
                    $(`#to${myNumber}`).html(`${players[myNumber].name}`)
                    console.log('#othersに追加')
                    $('#others').append(
                        `<div id="player${myNumber}" class="player" data-name="${players[myNumber].name}" data-number="${players[myNumber].number}">
                            <div id="player${myNumber}row1" class="row">
                                <div id="player${myNumber}name" class="name"><strong>${myNumber+1}:${players[myNumber].name}</strong></div>
                                <div id="player${myNumber}token" class="token" >家:${players[myNumber].token.house} 街:${players[myNumber].token.city} 道:${players[myNumber].token.road}</div>
                            </div>
                            <div id="player${myNumber}row2" class="row">
                                <div id="player${myNumber}resource" class="resource"></div>
                                <div id="player${myNumber}title" class="title"></div>
                            </div>
                            <div id="player${myNumber}row3" class="row">
                                <div id="player${myNumber}progress" class="progress"></div>
                                <div id="player${myNumber}used" class="used"></div>
                            </div>
                        </div>`
                    )
                    i += 1
                }
                return
            }
        }
        $('#my_area').html('')
        $('#others').html('')
        console.log('#my_area消去')
        console.log('#others消去')
        myNumber = 0
        for(p of players){
            console.log('#othersに追加')
            $('#others').append(
                `<div id="player${myNumber}" class="player" data-name="${players[myNumber].name}" data-number="${players[myNumber].number}">
                    <div id="player${myNumber}row1" class="row">
                        <div id="player${myNumber}name" class="name"><strong>${myNumber+1}:${players[myNumber].name}</strong></div>
                        <div id="player${myNumber}token" class="token" >家:${players[myNumber].token.house} 街:${players[myNumber].token.city} 道:${players[myNumber].token.road}</div>
                    </div>
                    <div id="player${myNumber}row2" class="row">
                        <div id="player${myNumber}resource" class="resource"></div>
                        <div id="player${myNumber}title" class="title"></div>
                    </div>
                    <div id="player${myNumber}row3" class="row">
                        <div id="player${myNumber}progress" class="progress"></div>
                        <div id="player${myNumber}used" class="used"></div>
                    </div>
                </div>`
            )
            if(myNumber === players.length - 1){
                myNumber = 0
            }else{
                myNumber += 1
            }
        }
    },
    hideButtonArea(){
        $('#button_area').hide()
    },
    showButtonArea(){
        $('#button_area').show()
    },
    showNameInputArea(playersName){
        $(`#nameinputarea`).show()
        $('#nameinputarea').html('<h1>九州の開拓者たち</h1><h2>名前を入力してください</h2>')
        let i = 1
        while(i <= playersName.length){
            $('#nameinputarea').append(`<div class="player${i-1}">
                <div class="playername">
                    <input type="text" class="nameinput" data-namenumber="${i-1}">
                    <input type="button" value="決定" class="namebutton">
                </div>
            </div>`)
            i += 1
        }
        $(`#nameinputarea`).append(`<div id="tileamounts" class="numberinput">
            <div>
                <div>鉄</div>
                <input id="oretileamount" type="number" value="5" min="0" max="100" step="1">
            </div>
            <div>
                <div>米</div>
                <input id="ricetileamount" type="number" value="6" min="0" max="100" step="">
            </div>
            <div>
                <div>羊</div>
                <input id="wooltileamount" type="number" value="6" min="0" max="100" step="">
            </div>
            <div>
                <div>木</div>
                <input id="lumbertileamount" type="number" value="6" min="0" max="100" step="">
            </div>
            <div>
                <div>煉</div>
                <input id="bricktileamount" type="number" value="5" min="0" max="100" step="1">
            </div>
        </div>`)
        /*i = 1
        for(let player of playersName){
            if(player.name){
                $(`.player${playersName.indexOf(player)}`).html(`<p><strong>${player.name}</strong></p>`)
            }
            i += 1
        }*/
    },
    hideYesOrNoButton(){
        $(`#yesorno`).hide()
    },
    showGameStartButton(){
        $(`#gamestart`).show()
    },
    cleanUpBoard(){
        $(`.node`).html(``)
        $(`.road`).html(``)
        $(`.tile_button`).html(``)
    },
    dice(dice){
        $(`#message_area`).show()
        $(`#message_area`).html(`<h1 id="dicearea"><div class="dice">${dice[0]}</div><div class="dice">${dice[1]}</div></h1>`)
    },
    hidemessageArea(){
        $(`#message_area`).hide()
        $(`#message_area`).html(``)
    },
}


//コンソールに表示
function game(){
    let e = ''
    socket.emit('console',e)
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
    }else if(item === 'road'){
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

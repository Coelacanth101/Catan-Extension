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
    let e
    socket.emit('start', e)
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
socket.on('hideBoard_And_Button', (e)=>{
    display.hideBoard_And_Button()
});
socket.on('showBoard_And_Button', (e)=>{
    display.showBoard_And_Button()
});







socket.on('myHand', (player)=>{
    display.myHand(player)
});
socket.on('field', (game)=>{
    display.field(game)
});
socket.on('startButton', ()=>{
    display.startButton()
});
socket.on('backgroundAllDelete', ()=>{
    display.backgroundAllDelete()
});
socket.on('backgroundDelete', (card)=>{
    display.backgroundDelete(card)
});
socket.on('handRed', (player)=>{
    display.handRed(player)
});
socket.on('handClear', (player)=>{
    display.handClear(player)
})
/*socket.on('startbuttonclick', (n)=>{
    display.startButtonHide(n)
});*/


socket.on('yesbuttonclick', (maxPlayer)=>{
    display.initialize(maxPlayer)
});
socket.on('turnplayer', (tn)=>{
    display.turnPlayer(tn)
})
socket.on('turnplayerdelete', ()=>{
    display.turnPlayerDelete()
})
socket.on('takeoverbuttonclick', (player)=>{
    display.takeOver(player)
})
socket.on('hidemyitems',(nop)=>{
    display.hideMyItems(nop)
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
    $(`#monopoly_area`).toggle()
});
//独占資源ボタンをクリック
$(`#monopoly_area`).on(`click`, `.monopoly_resource_button`, function(){
    let resource = $(this).attr('id').slice(9)
    console.log(resource)
    const data = {resource:resource, socketID:socket.id}
    socket.emit('monopoly', data)
})
//街道建設ボタンをクリック
$(`#button_area`).on('click','#roadbuild_button',function(){
    const data = {socketID:socket.id}
    socket.emit('roadbuildclick', data)
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




//手札を選択
$('#players').on('click', '.player .hand .card', function(){
    if($(this).parent().parent().data('socketid') === socket.id){
        const cardNumber = Number($(this).attr('id'))
        let data = {cardNumber:cardNumber, socketID:socket.id}
        socket.emit('handclick', data)
    }
});






//もう一度遊ぶ
$('#newgamebutton').on('click',function(){
    let e =''
    socket.emit('newgamebuttonclick', e)
});

//継承
$('#players').on('click', '.player .buttonarea .takeoverbutton', function(){
    let n = Number($(this).data('playernumber'))
    let player ={number:n, socketID:socket.id}
    socket.emit('takeoverbuttonclick', player)
});

//ターン終了
$('#players').on('click', '.player .buttonarea .endbutton', function(){
    if($(this).parent().parent().data('socketid') === socket.id){
        let n = Number($(this).data('playernumber'))
        let player ={number:n, socketID:socket.id}
        socket.emit('endbuttonclick', player)
    }
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
            i += 1
        }
        $('#gamestartbutton').hide()
        $('#newgamebutton').hide();
        $('#nameinputarea').hide();
        $('.startbutton').hide()
        $('#players').show();
        this.toggleTakeOver();
    },
    hideMyItems(nop){
        let i = 1
        while(i <= 5){
            $(`#player${i-1}`).show()
            i += 1
        }
        while(nop <= 4){
            $(`#player${nop}`).hide()
            nop += 1
        }
        $('#gamestartbutton').hide();
        $('#newgamebutton').hide();
        $('#nameinputarea').hide();
        $('#field').show()
        $('#players').show();
    },
    island(island){
        $('#board_and_button').show()
        console.log(island)
        let tileNumber = 1
        for(line of island){
            for(tile of line){
                $(`#tile${tileNumber}`).attr(`src`, `./${tile.type}.png`)
                tileNumber += 1
            }
        }
        tileNumber = 1
        for(line of island){
            for(tile of line){
                if(tile.type === 'ore'|| tile.type === 'grain'|| tile.type === 'brick'|| tile.type === 'lumber'|| tile.type === 'wool'|| tile.type === 'desert'){
                    if(tile.type !== 'desert'){
                        $(`#chip${tileNumber}`).attr(`src`, `./${tile.number}.png`)
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
            if(numberOfResources === 0){
                $(`#player${p.number}resource`).html(' ')
            }
            if(p.socketID === socket.id){
                for(r in p.resource){
                    let i = 1
                    while(i <= p.resource[r]){
                        $(`#player${p.number}resource`).append(`<p class="square ${String(r)}">${translate(String(r))}</p>`);
                        i += 1
                    };
                };
            }else{
                let numberOfResources = p.resource.ore + p.resource.grain + p.resource.wool + p.resource.lumber + p.resource.brick
                $(`#player${p.number}resource`).append(`資源:${numberOfResources}枚`);
                /*for(r in p.resource){
                    let i = 1
                    while(i <= p.resource[r]){
                        $(`#player${p.number}resource`).append(`<p class="square back">背</p>`);
                        i += 1
                    };
                };*/
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
            if(numberOfProgress === 0){
                $(`#player${p.number}progress`).html(' ')
            }
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
            if(p.socketID === socket.id){
                for(u in p.used){
                    let i = 1
                    while(i <= p.used[u]){
                        $(`#player${p.number}used`).append(`<p class="square ${String(u)}card">${translate(String(u))}</p>`);
                        i += 1
                    };
                };
            }else{
                for(u in p.used){
                    let i = 1
                    while(i <= p.resource[u]){
                        $(`#player${p.number}used`).append(`<p class="square back">背</p>`);
                        i += 1
                    };
                };
            }
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
        $(`#tile_button${buttonnumber}`).append(`<div id="thief"></div>`)
    },
    deleteThief(buttonnumber){
        $(`#tile_button${buttonnumber}`).html(``)
    },
    hideMonopolyArea(){
        $(`#monopoly_area`).hide()
    },



    myHand(player){
        $(`#player${player.number}hand`).html('')
        if(player.socketID === socket.id){
            for(c of player.hand){
                $(`#player${player.number}hand`).append(`<img src="./${c}.png" id="${c}" class="player${player.number}card card" alt="${c}">`);
            };
        }else{
            for(c of player.hand){
                $(`#player${player.number}hand`).append(`<img src="./back.png" class="player${player.number}card card">`);
            }
        }
    },
    startButton(){
        $('.startbutton').toggle()
    },
    initialize(maxPlayer){
        $('#gamestartbutton').show()
        $('#nextroundbutton').hide();
        $('#newgamebutton').hide();
        $('#nameinputarea').show();
        $('#field').hide();
        $('#players').hide();
        $('#yesorno').hide()
        $('#nameinputarea').html('<h1>The Game</h1><h2>名前を入力してください</h2>')
        let i = 1
        while(i <= maxPlayer){
            $('#nameinputarea').append(`<div class="player${i-1}">
                <div class="playername">
                    <input type="text" class="nameinput" data-namenumber="${i-1}">
                    <input type="button" value="決定" class="namebutton">
                </div>
            </div>`)
            i += 1
        }
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
    takeOver(player){
        $(`#player${player.number}`).data('socketid', player.socketID)
        this.toggleTakeOver()
    },
    toggleTakeOver(){
        let i = 0;
        let condition = 'watching'
        while(i <= 4){
            if($(`#player${i}`).data('socketid') === socket.id){
                condition = 'playing'
            }
            i += 1
        }
        if(condition === 'playing'){
            $('.takeoverbutton').hide()
        }else{
            $('.takeoverbutton').show()
        }
    },
    showStart(n){
        $(`#startbutton${n}`).show();
        $(`#reversebutton${n}`).show();
    },
    log(a){
        console.log(a)
    },
    playerSort(players){
        let myNumber
        for(p of players){
            if(p.socketID === socket.id){
                $('#my_area').html('')
                myNumber = p.number
                $('#my_area').append(
                    `<div id="player${myNumber}" class="player" data-name="${players[myNumber].name}">
                        <div id="player${myNumber}row1" class="row">
                            <div id="player${myNumber}name" class="name"><strong>${myNumber+1}:${players[myNumber].name}</strong></div>
                            <div id="player${myNumber}token" class="token" >家:${players[myNumber].token.house} 街:${players[myNumber].token.city} 道:${players[myNumber].token.road}</div>
                        </div>
                        <div id="player${myNumber}row2" class="row">
                            <div id="player${myNumber}resource" class="resource"><p class="square lumber">木</p><p class="square lumber">木</p><p class="square lumber">木</p><p class="square brick">煉</p><p class="square ore">鉄</p><p class="square grain">麦</p><p class="square grain">麦</p><p class="square wool">羊</p></div>
                            <div id="player${myNumber}title" class="title">最大騎士力</div>
                        </div>
                        <div id="player${myNumber}row3" class="row">
                            <div id="player${myNumber}progress" class="progress">騎:${players[myNumber].progress.knight} 発:${players[myNumber].progress.harvest} 点:${players[myNumber].progress.point}</div>
                            <div id="player${myNumber}used" class="used"><p class="square">騎</p><p class="square">騎</p><p class="square">騎</p></div>
                        </div>
                    </div>`
                )
                $('#others').html('')
                let i = 1
                while(i <= players.length - 1){
                    if(myNumber === players.length - 1){
                        myNumber = 0
                    }else{
                        myNumber += 1
                    }
                    $('#others').append(
                        `<div id="player${myNumber}" class="player" data-name="${players[myNumber].name}">
                            <div id="player${myNumber}row1" class="row">
                                <div id="player${myNumber}name" class="name"><strong>${myNumber+1}:${players[myNumber].name}</strong></div>
                                <div id="player${myNumber}token" class="token" >家:${players[myNumber].token.house} 街:${players[myNumber].token.city} 道:${players[myNumber].token.road}</div>
                            </div>
                            <div id="player${myNumber}row2" class="row">
                                <div id="player${myNumber}resource" class="resource"><p class="square lumber">木</p><p class="square lumber">木</p><p class="square lumber">木</p><p class="square brick">煉</p><p class="square ore">鉄</p><p class="square grain">麦</p><p class="square grain">麦</p><p class="square wool">羊</p></div>
                                <div id="player${myNumber}title" class="title">最大騎士力</div>
                            </div>
                            <div id="player${myNumber}row3" class="row">
                                <div id="player${myNumber}progress" class="progress">騎:${players[myNumber].progress.knight} 発:${players[myNumber].progress.harvest} 点:${players[myNumber].progress.point}</div>
                                <div id="player${myNumber}used" class="used"><p class="square">騎</p><p class="square">騎</p><p class="square">騎</p></div>
                            </div>
                        </div>`
                    )
                    i += 1
                }
                return
            }
        }
        for(p of players){
            $('#my_area').html('')
            $('#others').html('')
            let i = 1
            let myNumber = 0
            while(i <= players.length - 1){
                if(myNumber === players.length - 1){
                    myNumber = 0
                }else{
                    myNumber += 1
                }
                $('#others').append(
                    `<div id="player${myNumber}" class="player" data-name="${players[myNumber].name}">
                        <div id="player${myNumber}row1" class="row">
                            <div id="player${myNumber}name" class="name"><strong>${myNumber+1}:${players[myNumber].name}</strong></div>
                            <div id="player${myNumber}token" class="token" >家:${players[myNumber].token.house} 街:${players[myNumber].token.city} 道:${players[myNumber].token.road}</div>
                        </div>
                        <div id="player${myNumber}row2" class="row">
                            <div id="player${myNumber}resource" class="resource"><p class="square lumber">木</p><p class="square lumber">木</p><p class="square lumber">木</p><p class="square brick">煉</p><p class="square ore">鉄</p><p class="square grain">麦</p><p class="square grain">麦</p><p class="square wool">羊</p></div>
                            <div id="player${myNumber}title" class="title">最大騎士力</div>
                        </div>
                        <div id="player${myNumber}row3" class="row">
                            <div id="player${myNumber}progress" class="progress">騎:${players[myNumber].progress.knight} 発:${players[myNumber].progress.harvest} 点:${players[myNumber].progress.point}</div>
                            <div id="player${myNumber}used" class="used"><p class="square">騎</p><p class="square">騎</p><p class="square">騎</p></div>
                        </div>
                    </div>`
                )
                i += 1
            }
        }
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
        return '麦'
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


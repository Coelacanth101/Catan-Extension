const socket = io();
let board_size
let record
let endturn
let turn
let actionInTurn
let playerNumber
//決定をクリック
$(`#decide`).on(`click`, function(){
    $(`#receiving_area`).show()
    const data = {gameID:$(`#games`).val(), socketID:socket.id}
    socket.emit('replaygame', data)
})

//firstturnをクリック
$(`#firstturn`).on(`click`, function(){
    turn = 0
    actionInTurn = 0
    renderRecord()
})
//previousturnをクリック
$(`#previousturn`).on(`click`, function(){
    if(turn !== 0){
        turn -= 1
        actionInTurn = 0
        renderRecord()
    }
})
//previousactionをクリック
$(`#previousaction`).on(`click`, function(){
    if(actionInTurn !== 0){
        actionInTurn -= 1
        renderRecord()
    }else if(turn !== 0){
        turn -= 1
        actionInTurn = record[turn].length-1
        renderRecord()
    }
})
//nextactionをクリック
$(`#nextaction`).on(`click`, function(){
    if(actionInTurn !== record[turn].length - 1){
        actionInTurn += 1
        renderRecord()
    }else if(turn !== endturn){
        turn += 1
        actionInTurn = 0
        renderRecord()
    }
})
//nextturnをクリック
$(`#nextturn`).on(`click`, function(){
    if(turn !== endturn){
        turn += 1
        actionInTurn = 0
        renderRecord()
    }
})
//finalturnをクリック
$(`#finalturn`).on(`click`, function(){
    turn = endturn
    actionInTurn = 0
    renderRecord()
})
//movetoをクリック
$(`#moveto`).on(`click`, function(){
    turn = Number($(`#turnselect`).val())
    actionInTurn = 0
    renderRecord()
})

function renderGame(data){
    $('#field').show()
    $('body').attr('background', "./img/wood_pattern1.jpg")
    $(`#receiving_area`).show()
    record = data.gameRecord
    endturn = record.length-1
    turn = 0
    actionInTurn = 0
    playerNumber = record[0][0].players.length

    //ボード作成
    let tileNumber = 1
    if(data.board.length === 9){
        board_size = 'large'
        $('#cs').attr('href',"./Past-Games-Extension.css")
        $(`#board`).html(`
            <div id="dice_area"></div>
            <div id="receiving_area"><img id="receiving" src="./img/loading.gif"></div>
            <div id="deck_area"><div id="deckcase"><div id="deck"></div></div>&nbsp;×34</div>
            <img id="board_frame" src='./img/large_board.png'>
            <img id="tile1" class="tilex1 tiley5 tile" data-direction="" src="./img/ocean.png">
            <img id="tile2" class="tilex1 tiley7 tile" data-direction="" src="./img/ocean.png">
            <img id="tile3" class="tilex1 tiley9 tile" data-direction="" src="./img/ocean.png">
            <img id="tile4" class="tilex1 tiley11 tile" data-direction="" src="./img/ocean.png">
            <img id="tile5" class="tilex2 tiley4 tile" data-direction="" src="./img/ocean.png">
            <img id="tile6" class="tilex2 tiley6 tile" data-direction="" src="./img/desert.png">
            <img id="tile7" class="tilex2 tiley8 tile" data-direction="" src="./img/desert.png">
            <img id="tile8" class="tilex2 tiley10 tile" data-direction="" src="./img/desert.png">
            <img id="tile9" class="tilex2 tiley12 tile" data-direction="" src="./img/ocean.png">
            <img id="tile10" class="tilex3 tiley3 tile" data-direction="" src="./img/ocean.png">
            <img id="tile11" class="tilex3 tiley5 tile" data-direction="" src="./img/desert.png">
            <img id="tile12" class="tilex3 tiley7 tile" data-direction="" src="./img/desert.png">
            <img id="tile13" class="tilex3 tiley9 tile" data-direction="" src="./img/desert.png">
            <img id="tile14" class="tilex3 tiley11 tile" data-direction="" src="./img/desert.png">
            <img id="tile15" class="tilex3 tiley13 tile" data-direction="" src="./img/ocean.png">
            <img id="tile16" class="tilex4 tiley2 tile" data-direction="" src="./img/ocean.png">
            <img id="tile17" class="tilex4 tiley4 tile" data-direction="" src="./img/desert.png">
            <img id="tile18" class="tilex4 tiley6 tile" data-direction="" src="./img/desert.png">
            <img id="tile19" class="tilex4 tiley8 tile" data-direction="" src="./img/desert.png">
            <img id="tile20" class="tilex4 tiley10 tile" data-direction="" src="./img/desert.png">
            <img id="tile21" class="tilex4 tiley12 tile" data-direction="" src="./img/desert.png">
            <img id="tile22" class="tilex4 tiley14 tile" data-direction="" src="./img/ocean.png">
            <img id="tile23" class="tilex5 tiley1 tile" data-direction="" src="./img/ocean.png">
            <img id="tile24" class="tilex5 tiley3 tile" data-direction="" src="./img/desert.png">
            <img id="tile25" class="tilex5 tiley5 tile" data-direction="" src="./img/desert.png">
            <img id="tile26" class="tilex5 tiley7 tile" data-direction="" src="./img/desert.png">
            <img id="tile27" class="tilex5 tiley9 tile" data-direction="" src="./img/desert.png">
            <img id="tile28" class="tilex5 tiley11 tile" data-direction="" src="./img/desert.png">
            <img id="tile29" class="tilex5 tiley13 tile" data-direction="" src="./img/desert.png">
            <img id="tile30" class="tilex5 tiley15 tile" data-direction="" src="./img/ocean.png">
            <img id="tile31" class="tilex6 tiley2 tile" data-direction="" src="./img/ocean.png">
            <img id="tile32" class="tilex6 tiley4 tile" data-direction="" src="./img/desert.png">
            <img id="tile33" class="tilex6 tiley6 tile" data-direction="" src="./img/desert.png">
            <img id="tile34" class="tilex6 tiley8 tile" data-direction="" src="./img/desert.png">
            <img id="tile35" class="tilex6 tiley10 tile" data-direction="" src="./img/desert.png">
            <img id="tile36" class="tilex6 tiley12 tile" data-direction="" src="./img/desert.png">
            <img id="tile37" class="tilex6 tiley14 tile" data-direction="" src="./img/ocean.png">
            <img id="tile38" class="tilex7 tiley3 tile" data-direction="" src="./img/ocean.png">
            <img id="tile39" class="tilex7 tiley5 tile" data-direction="" src="./img/desert.png">
            <img id="tile40" class="tilex7 tiley7 tile" data-direction="" src="./img/desert.png">
            <img id="tile41" class="tilex7 tiley9 tile" data-direction="" src="./img/desert.png">
            <img id="tile42" class="tilex7 tiley11 tile" data-direction="" src="./img/desert.png">
            <img id="tile43" class="tilex7 tiley13 tile" data-direction="" src="./img/ocean.png">
            <img id="tile44" class="tilex8 tiley4 tile" data-direction="" src="./img/ocean.png">
            <img id="tile45" class="tilex8 tiley6 tile" data-direction="" src="./img/desert.png">
            <img id="tile46" class="tilex8 tiley8 tile" data-direction="" src="./img/desert.png">
            <img id="tile47" class="tilex8 tiley10 tile" data-direction="" src="./img/desert.png">
            <img id="tile48" class="tilex8 tiley12 tile" data-direction="" src="./img/ocean.png">
            <img id="tile49" class="tilex9 tiley5 tile" data-direction="" src="./img/ocean.png">
            <img id="tile50" class="tilex9 tiley7 tile" data-direction="" src="./img/ocean.png">
            <img id="tile51" class="tilex9 tiley9 tile" data-direction="" src="./img/ocean.png">
            <img id="tile52" class="tilex9 tiley11 tile" data-direction="" src="./img/ocean.png">
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
            <img id="chip11" class="chip tile_buttonx3 tile_buttony8" src="">
            <img id="chip12" class="chip tile_buttonx3 tile_buttony10" src="">
            <img id="chip13" class="chip tile_buttonx4 tile_buttony1" src="">
            <img id="chip14" class="chip tile_buttonx4 tile_buttony3" src="">
            <img id="chip15" class="chip tile_buttonx4 tile_buttony5" src="">
            <img id="chip16" class="chip tile_buttonx4 tile_buttony7" src="">
            <img id="chip17" class="chip tile_buttonx4 tile_buttony9" src="">
            <img id="chip18" class="chip tile_buttonx4 tile_buttony11" src="">
            <img id="chip19" class="chip tile_buttonx5 tile_buttony2" src="">
            <img id="chip20" class="chip tile_buttonx5 tile_buttony4" src="">
            <img id="chip21" class="chip tile_buttonx5 tile_buttony6" src="">
            <img id="chip22" class="chip tile_buttonx5 tile_buttony8" src="">
            <img id="chip23" class="chip tile_buttonx5 tile_buttony10" src="">
            <img id="chip24" class="chip tile_buttonx6 tile_buttony3" src="">
            <img id="chip25" class="chip tile_buttonx6 tile_buttony5" src="">
            <img id="chip26" class="chip tile_buttonx6 tile_buttony7" src="">
            <img id="chip27" class="chip tile_buttonx6 tile_buttony9" src="">
            <img id="chip28" class="chip tile_buttonx7 tile_buttony4" src="">
            <img id="chip29" class="chip tile_buttonx7 tile_buttony6" src="">
            <img id="chip30" class="chip tile_buttonx7 tile_buttony8" src="">
        `)
        for(line of data.board){
            for(tile of line){
                $(`#tile${tileNumber}`).attr(`src`, `./img/${tile.type}.png`)
                $(`#tile${tileNumber}`).attr(`data-direction`,`${tile.direction}`)
                tileNumber += 1
            }
        }
        tileNumber = 1
        for(line of data.board){
            for(tile of line){
                if(tile.type === 'ore'|| tile.type === 'grain'|| tile.type === 'brick'|| tile.type === 'lumber'|| tile.type === 'wool'|| tile.type === 'desert'){
                    if(tile.type !== 'desert' /*&& tile.number !== 0*/){
                        $(`#chip${tileNumber}`).attr(`src`, `./img/${tile.number}.png`)
                    }else{
                        $(`#chip${tileNumber}`).remove()
                    }
                    tileNumber += 1
                }
            }
        }
    }else if(data.board.length === 7){
        board_size = 'regular'
        $('#cs').attr('href',"./Past-Games-Regular.css")
        $(`#board`).html(`
            <div id="dice_area"></div>
            <div id="receiving_area"><img id="receiving" src="./img/loading.gif"></div>
            <div id="deck_area"><div id="deckcase"><div id="deck"></div></div>&nbsp;×25</div>
            <img id="board_frame" src='./img/regular_board.png'>
            <img id="tile1" class="tile" data-direction="" src="./img/regular_ocean.png">
            <img id="tile2" class="tile" data-direction="" src="./img/regular_ocean.png">
            <img id="tile3" class="tile" data-direction="" src="./img/regular_ocean.png">
            <img id="tile4" class="tile" data-direction="" src="./img/regular_ocean.png">
            <img id="tile5" class="tile" data-direction="" src="./img/regular_ocean.png">
            <img id="tile6" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile7" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile8" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile9" class="tile" data-direction="" src="./img/regular_ocean.png">
            <img id="tile10" class="tile" data-direction="" src="./img/regular_ocean.png">
            <img id="tile11" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile12" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile13" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile14" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile15" class="tile" data-direction="" src="./img/regular_ocean.png">
            <img id="tile16" class="tile" data-direction="" src="./img/regular_ocean.png">
            <img id="tile17" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile18" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile19" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile20" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile21" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile22" class="tile" data-direction="" src="./img/regular_ocean.png">
            <img id="tile23" class="tile" data-direction="" src="./img/regular_ocean.png">
            <img id="tile24" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile25" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile26" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile27" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile28" class="tile" data-direction="" src="./img/regular_ocean.png">
            <img id="tile29" class="tile" data-direction="" src="./img/regular_ocean.png">
            <img id="tile30" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile31" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile32" class="tile" data-direction="" src="./img/regular_desert.png">
            <img id="tile33" class="tile" data-direction="" src="./img/regular_ocean.png">
            <img id="tile34" class="tile" data-direction="" src="./img/regular_ocean.png">
            <img id="tile35" class="tile" data-direction="" src="./img/regular_ocean.png">
            <img id="tile36" class="tile" data-direction="" src="./img/regular_ocean.png">
            <img id="tile37" class="tile" data-direction="" src="./img/regular_ocean.png">
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
        for(line of data.board){
            for(tile of line){
                $(`#tile${tileNumber}`).attr(`src`, `./img/regular_${tile.type}.png`)
                $(`#tile${tileNumber}`).attr(`data-direction`,`${tile.direction}`)
                tileNumber += 1
            }
        }
        tileNumber = 1
        for(line of data.board){
            for(tile of line){
                if(tile.type === 'ore'|| tile.type === 'grain'|| tile.type === 'brick'|| tile.type === 'lumber'|| tile.type === 'wool'|| tile.type === 'desert'){
                    if(tile.type !== 'desert'){
                        $(`#chip${tileNumber}`).attr(`src`, `./img/${tile.number}.png`)
                    }else{
                        $(`#chip${tileNumber}`).remove()
                    }
                    tileNumber += 1
                }
            }
        }
    }
    //ターン選択肢追加
    $('#turn').html('<select name="turnselect" id="turnselect"></select>')
    for(let i = 0; i <= endturn; i++){
        if(i === 0){
            $('#turnselect').append(`<option value="${i}" selected id="turn${i}">${i}</option>`)
        }else if(i !== endturn){
            $('#turnselect').append(`<option value="${i}" id="turn${i}">${i}</option>`)
        }else{
            $('#turnselect').append(`<option value="${i}" id="turn${i}">終局</option>`)
        }
    }
    //プレイヤー表示
    $('#playerinformation').html('')
    let myNumber = 0
    for(let playerName of data.players){
        $('#playerinformation').append(
            `<div id="player${myNumber}" class="player" data-name="${playerName}" data-number="${myNumber}">
                <div id="player${myNumber}row1" class="row">
                    <div class="nameline">
                    <div id="player${myNumber}mark" class="playermark player${myNumber}color"><b>${myNumber+1}</b></div>
                    <div id="player${myNumber}name" class="name showlog"><b>${playerName}</b></div>
                    </div>
                    <div id="player${myNumber}token" class="token line" ><div class="remainedtokennumber"><img class="remainedtoken" src="./img/house${myNumber}.png">:5</div> <div class="remainedtokennumber"><img class="remainedtoken" src="./img/city${myNumber}.png">:4</div> <div class="remainedtokennumber"><img class="remainedtoken" src="./img/regular_road_right_up${myNumber}.png">:15</div></div>
                </div>
                <div id="player${myNumber}row2" class="row">
                    <div id="player${myNumber}resource" class="resource line"></div>
                    <div id="player${myNumber}title" class="title line"></div>
                </div>
                <div id="player${myNumber}row3" class="row">
                    <div id="player${myNumber}progress" class="progress line"></div>
                    <div id="player${myNumber}used" class="used line"></div>
                </div>
            </div>`
        )
        myNumber += 1
    }
    turn = 0
    actionInTurn = 0
    renderRecord()
    //ボタン表示
    $(`#buttons`).show()
    $(`#receiving_area`).hide()
}
function renderRecord(){
    let situation = record[turn][actionInTurn].players
    let pn = 0
    $(`.nodetouch`).html(``)
    $(`.road`).html(``)
    for(let player of situation){
        //token
        $(`#player${pn}token`).html(`<div class="remainedtokennumber"><img class="remainedtoken" src="./img/house${pn}.png">:${player.token.house}</div> <div class="remainedtokennumber"><img class="remainedtoken" src="./img/city${pn}.png">:${player.token.city}</div> <div class="remainedtokennumber"><img class="remainedtoken" src="./img/regular_road_right_up${pn}.png">:${player.token.road}</div>`)
        //resource
        $(`#player${pn}resource`).html('')
        for(let r in player.resource){
            let i = 1
            while(i <= player.resource[r]){
                $(`#player${pn}resource`).append(`<div class="card ${String(r)}"><img src="./img/${r}pict.png" alt="${r}" class="img_for_card"></div>`);
                i += 1
            };
        };
        //title
        $(`#player${pn}title`).html(``)
        if(player.largestArmy === 2){
            $(`#player${pn}title`).append(`<div class="titlesquare"><img src="./img/largestarmy.png" alt="largestarmy" class="img_for_title"></div>`)
        }
        if(player.longestRoad === 2){
            $(`#player${pn}title`).append(`<div class="titlesquare"><img src="./img/longestroad.png" alt="longestroad" class="img_for_title"></div>`)
        }
        //progress
        $(`#player${pn}progress`).html(``)
        for(let pr in player.progress){
            let i = 1
            while(i <= player.progress[pr]){
                $(`#player${pn}progress`).append(`<div class="card ${pr}"><img src="./img/${pr}.png" alt="${pr}" class="img_for_card ${pr}"></div>`);
                i += 1
            };
        };
        //used
        $(`#player${pn}used`).html(``)
        for(let u in player.used){
            let i = 1
            while(i <= player.used[u]){
                $(`#player${pn}used`).append(`<div class="card ${u}"><img src="./img/${u}.png" alt="${u}" class="img_for_card ${u}"></div>`);
                i += 1
            };
        };
        //house
        for(let houseNumber of player.house){
            $(`#nodetouch${houseNumber}`).html(`<img id="house${houseNumber}" class="house" src="./img/house${pn}.png">`)
        }
        //road
        if(board_size === 'large'){
            for(let road of player.road){
                $(`#road${road.roadNumber}`).html(`<img id="roadtoken${road.roadNumber}" class="roadtoken" src="./img/road_${road.roadDegree}${pn}.png">`)
            }
        }else if(board_size === 'regular'){
            for(let road of player.road){
                $(`#road${road.roadNumber}`).html(`<img id="roadtoken${road.roadNumber}" class="roadtoken" src="./img/regular_road_${road.roadDegree}${pn}.png">`)
            }
        }
        //city
        for(let cityNumber of player.city){
            $(`#nodetouch${cityNumber}`).html(`<img id="city${cityNumber}" class="city" src="./img/city${pn}.png">`)
        }
        pn += 1
    }
    //thief
    $(`.tile_button`).html(``)
    $(`#tile_button${record[turn][actionInTurn].thief}`).html(`<div id="thief"></div>`)
    //dice
    if(record[turn][actionInTurn].dice[0]){
        $(`#dice_area`).html(`<img class="dice" src="./img/dice${record[turn][actionInTurn].dice[0]}.png" alt="dice${record[turn][actionInTurn].dice[0]}"><img class="dice" src="./img/dice${record[turn][actionInTurn].dice[1]}.png" alt="dice${record[turn][actionInTurn].dice[1]}">`)
    }else{
        $(`#dice_area`).html(``)
    }
    //deck
    if('progress' in record[turn][actionInTurn]){
        if(board_size === 'large'){
            $(`#deck_area`).html(`<div id="deckcase"><div id="deck"></div></div>&nbsp;×${record[turn][actionInTurn].progress}`)
            $(`#deck`).css(`height`, `${record[turn][actionInTurn].progress/34 * 100}%`)
        }else if(board_size = 'regular'){
            $(`#deck_area`).html(`<div id="deckcase"><div id="deck"></div></div>&nbsp;×${record[turn][actionInTurn].progress}`)
            $(`#deck`).css(`height`, `${record[turn][actionInTurn].progress/25 * 100}%`)
        }
        
    }

    //message
    $(`#message_area`).html(``);
    if(record[turn][actionInTurn].action){
        if(record[turn][actionInTurn].action.action === 'build'){
            if('playernumber' in record[turn][actionInTurn].action){
                if(record[turn][actionInTurn].action.builditem !== 'road'){
                    $(`#message_area`).append(`<div class="message"><b>${record[turn][actionInTurn].action.playername}</b>が<img class="message_icon" src="./img/${record[turn][actionInTurn].action.builditem}${record[turn][actionInTurn].action.playernumber}.png">を建設しました</div>`)
                }else{
                    $(`#message_area`).append(`<div class="message"><b>${record[turn][actionInTurn].action.playername}</b>が<img class="message_icon" src="./img/regular_road_right_up${record[turn][actionInTurn].action.playernumber}.png">を建設しました</div>`)
                }
            }else{
                $(`#message_area`).append(`<div class="message"><b>${record[turn][actionInTurn].action.playername}</b>が${translate(record[turn][actionInTurn].action.builditem)}を建設しました</div>`)
            }
        }else if(record[turn][actionInTurn].action.action === 'draw'){
            $(`#message_area`).append(`<div class="message"><b>${record[turn][actionInTurn].action.playername}</b>が<div class="card ${record[turn][actionInTurn].action.progress}"><img src="./img/${record[turn][actionInTurn].action.progress}.png" alt="${record[turn][actionInTurn].action.progress}" class="img_for_card ${record[turn][actionInTurn].action.progress}"></div>を引きました</div>`)
        }else if(record[turn][actionInTurn].action.action === 'progress'){
            $(`#message_area`).append(`<div class="message"><b>${record[turn][actionInTurn].action.playername}</b>が<div class="card ${record[turn][actionInTurn].action.progress}"><img src="./img/${record[turn][actionInTurn].action.progress}.png" alt="${record[turn][actionInTurn].action.progress}" class="img_for_card ${record[turn][actionInTurn].action.progress}"></div>を使いました</div>`)
        }else if(record[turn][actionInTurn].action.action === 'thiefmove'){
            $(`#message_area`).append(`<div class="message"><b>${record[turn][actionInTurn].action.playername}</b>が盗賊を移動しました</div>`)
        }else if(record[turn][actionInTurn].action.action === 'robresource'){
            $(`#message_area`).append(`<div class="message"><b>${record[turn][actionInTurn].action.playername}</b>が<b>${record[turn][actionInTurn].action.robbed}</b>から<div class="card ${record[turn][actionInTurn].action.resource}"><img src="./img/${record[turn][actionInTurn].action.resource}pict.png" alt="${record[turn][actionInTurn].action.resource}" class="img_for_card"></div>を強奪しました</div>`)
        }else if(record[turn][actionInTurn].action.action === 'monopoly'){
            $(`#message_area`).append(`<div class="message"><b>${record[turn][actionInTurn].action.playername}</b>が<div class="card ${String(record[turn][actionInTurn].action.resource)}"><img src="./img/${record[turn][actionInTurn].action.resource}pict.png" alt="${record[turn][actionInTurn].action.resource}" class="img_for_card"></div>${record[turn][actionInTurn].action.amount}枚を独占しました</div>`)
        }else if(record[turn][actionInTurn].action.action === 'harvest'){
            let harvestResources = ''
            for(let resource of record[turn][actionInTurn].action.resource){
                harvestResources += `<div class="card ${String(resource)}"><img src="./img/${resource}pict.png" alt="${resource}" class="img_for_card"></div>`
            }
            $(`#message_area`).append(`<div class="message"><b>${record[turn][actionInTurn].action.playername}</b>が${harvestResources}を収穫しました</div>`)
        }else if(record[turn][actionInTurn].action.action === 'undo'){
            $(`#message_area`).append(`<div class="message"><b>${record[turn][actionInTurn].action.playername}</b>が取り消しました</div>`)
        }else if(record[turn][actionInTurn].action.action === 'trash'){
            for(let data of record[turn][actionInTurn].action.trashRecord){
                let trash = ''
                for(let resource in data.trashresource){
                    let i = 1
                    while(i <= data.trashresource[resource]){
                        trash += `<div class="card ${String(resource)}"><img src="./img/${resource}pict.png" alt="${resource}" class="img_for_card"></div>`
                        i += 1
                    }
                }
                $(`#message_area`).append(`<div class="message"><b>${data.name}</b>が${trash}を捨てました</div>`)
            }
        }else if(record[turn][actionInTurn].action.action === 'accept'){
            let giveresource = ''
            for(let resource in record[turn][actionInTurn].action.giveresource){
                let i = 1
                while(i <= record[turn][actionInTurn].action.giveresource[resource]){
                    giveresource += `<div class="card ${String(resource)}"><img src="./img/${resource}pict.png" alt="${resource}" class="img_for_card"></div>`
                    i += 1
                }
            }
            let takeresource = ''
            for(let resource in record[turn][actionInTurn].action.takeresource){
                let i = 1
                while(i <= record[turn][actionInTurn].action.takeresource[resource]){
                    takeresource += `<div class="card ${String(resource)}"><img src="./img/${resource}pict.png" alt="${resource}" class="img_for_card"></div>`
                    i += 1
                }
            }
            $(`#message_area`).append(`<div class="message"><b>${record[turn][actionInTurn].action.proposername}</b>の${giveresource}と<b>${record[turn][actionInTurn].action.playername}</b>の${takeresource}を交換しました</div>`)
        }else if(record[turn][actionInTurn].action.action === 'trade'){
            let exportresource = ''
            for(let resource in record[turn][actionInTurn].action.exportresource){
                let i = 1
                while(i <= record[turn][actionInTurn].action.exportresource[resource]){
                    exportresource += `<div class="card ${String(resource)}"><img src="./img/${resource}pict.png" alt="${resource}" class="img_for_card"></div>`
                    i += 1
                }
            }
            let importresource = ''
            for(let resource in record[turn][actionInTurn].action.importresource){
                let i = 1
                while(i <= record[turn][actionInTurn].action.importresource[resource]){
                    importresource += `<div class="card ${String(resource)}"><img src="./img/${resource}pict.png" alt="${resource}" class="img_for_card"></div>`
                    i += 1
                }
            }
            $(`#message_area`).append(`<div class="message"><b>${record[turn][actionInTurn].action.playername}</b>が${exportresource}を${importresource}に換えました</div>`)
        }else if(record[turn][actionInTurn].action.action === 'burst'){
            let burstPlayers = ``
            for(let player of record[turn][actionInTurn].action.players){
                burstPlayers += `と<b>${player.name}</b>`
            }
            burstPlayers = burstPlayers.slice(1)
            $(`#message_area`).append(`<div class="message">${burstPlayers}がバーストしました</div>`)
        }else if(record[turn][actionInTurn].action.action === 'dice'){
            if('dice' in record[turn][actionInTurn]){
                $(`#message_area`).append(`<div class="message"><b>${record[turn][actionInTurn].action.playername}</b>が<img class="message_icon" src="./img/dice${record[turn][actionInTurn].dice[0]}.png"><img class="message_icon" src="./img/dice${record[turn][actionInTurn].dice[1]}.png">を出しました</div>`)
            }else{
                $(`#message_area`).append(`<div class="message"><b>${record[turn][actionInTurn].action.playername}</b>が<img class="message_icon" src="./img/dice.png">を振りました</div>`)
            }
            
        }else if(record[turn][actionInTurn].action.action === 'exhaust'){
            let exhaustresource = ''
            for(let resource of record[turn][actionInTurn].action.exhaust){
                exhaustresource += `<div class="card ${String(resource)}"><img src="./img/${resource}pict.png" alt="${resource}" class="img_for_card"></div>`
            }
            $(`#message_area`).append(`<div class="message">${exhaustresource}が枯渇しました</div>`)
        }else if(record[turn][actionInTurn].action.action === 'turnend'){
            $(`#message_area`).append(`<div class="message"><b>${record[turn][actionInTurn].action.playername}</b>がターンを終了しました</div>`)
        }else if(record[turn][actionInTurn].action.action === 'win'){
            $(`#message_area`).append(`<h1>${record[turn][actionInTurn].action.playername}の勝ちです!</h1>`)
        }
    }
    $(`#turn${turn}`).prop('selected', true);
    let turnPlayerNumber
    $(`.name`).css(`background-color`, ``)
    if(turn === endturn){
        turnPlayerNumber = (turn-1) % playerNumber
    }else if(turn === 0){
        turnPlayerNumber = 1
    }else{
        turnPlayerNumber = turn % playerNumber
    }
    if(turnPlayerNumber !== 0){
        $(`#player${turnPlayerNumber - 1}name`).css(`background-color`, `rgb(255, 123, 0)`)
    }else{
        $(`#player${playerNumber - 1}name`).css(`background-color`, `rgb(255, 123, 0)`)
    }
}

function translate(item){
    if(item === 'house'){
        return '家'
    }else if(item === 'city'){
        return '都市'
    }else if(item === 'road'){
        return '道'
    }
}
function total(object){
    let total = 0
    for(let key in object){
        total += object[key]
    }
    return total
}

socket.on('replaygame',(data)=>{
    $('#field').css('display', 'flex');
    renderGame(data)
})
socket.on('log', (a)=>{
    console.log(a)
})
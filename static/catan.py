import random
from math import ceil
from typing import Coroutine
t = 3
m = 4
h = 4
k = 4
r = 3
s = 1
players = []
numbers = [2,2,3,3,3,4,4,4,5,5,5,6,6,6,8,8,8,9,9,9,10,10,10,11,11,11,12,12]
house_resource = {'tetsu':0,'mugi':1,'hitsuji':1,'ki':1,'renga':1}
city_resource = {'tetsu':3,'mugi':2,'hitsuji':0,'ki':0,'renga':0}
card_resource = {'tetsu':1,'mugi':1,'hitsuji':1,'ki':0,'renga':0}
road_resource = {'tetsu':0,'mugi':0,'hitsuji':0,'ki':1,'renga':1}
resource_type = ('tetsu','mugi','hitsuji','ki','renga')

#プレイヤー
class Player:
    def __init__(self):
        self.resource = {'tetsu':0,'mugi':0,'hitsuji':0,'ki':0,'renga':0}
        self.token = {'house':5,'city':4,'road':15}
        self.house = []
        self.city = []
        self.road = []
        self.card = {'tokuten':0,'kishi':0,'hakken':0,'dokusen':0,'kaido':0}
        self.used_card = {'tokuten':0,'kishi':0,'hakken':0,'dokusen':0,'kaido':0}
        self.largest_army = 0
        self.longest_road = 0
        self.point = len(self.house) + len(self.city)*2 + self.card['tokuten'] + self.largest_army + self.longest_road
        players.append(self)

    #ポイントの更新
    def point_reload(self):
        self.point = len(self.house) + len(self.city)*2 + self.card['tokuten'] + self.largest_army + self.longest_road

    #指定した点に他の家と街がないか確認
    def node_check(self,node):
        for player in players:
            if node in player.house:
                print('そこには家があります')
                return False
            elif node in player.city:
                print('そこには街があります')
                return False
            else:
                continue
        return True

    #指定した辺に他の道がないか確認
    def road_check(self,edge):
        for player in players:
            if edge in player.road:
                print('そこには道があります')
                return False
            else:
                continue
        return True

    #指定した点の周りに家がないか確認
    def around_node_check(self,node):

        all_settler = set()
        for player in players:
            all_settler = all_settler | set(player.house) | set(player.city)
        check = all_settler & set(board.node_around_node(node))
        if not len(check) == 0:
            print('他の家の隣には建てられません')
            return False
        else:
            return True

    #指定した点の周りに道があるか確認
    def edge_around_node_check(self,node):
        check = set(self.road) & set(board.edge_around_node(node))
        if len(check) == 0:
            print('道がつながっていないため建てられません')
            return False
        else:
            return True

    #建設に必要な資源を持っているか確認
    def resource_check(self,build_item):
        if build_item == 'house':
            required_resource = house_resource
        if build_item == 'city':
            required_resource = city_resource
        if build_item == 'road':
            required_resource = road_resource
        if build_item == 'card':
            required_resource = card_resource
        for resource in required_resource:
            if self.resource[resource] >= required_resource[resource]:
                continue
            else:
                print('資源が足りません')
                return False
        return True

    #手元にトークンがあるか確認
    def token_check(self,build_item):
        if self.token[build_item] == 0:
            print(build_item+'が足りません')
            return False
        else:
            return True
    
    #指定した辺に道がつながっているか確認
    def road_connection_check(self,edge):
        roads = list(set(self.road) & set(board.edge_around_edge(edge)))
        for r in roads:
            if board.node_owner(board.node_between_edge(r,edge)) == self:
                continue
            elif not board.node_owner(board.node_between_edge(r,edge)):
                continue
            else:
                roads.remove(r)
        if len(roads) == 0:
            print('道がつながっていません')
            return False
        else:
            return True
    
    #指定した点に自分の家があるか確認
    def house_check(self,node):
        if node in self.house:
            return True
        else:
            print('家がありません')
            return False

    #山札にカードが残っているか確認
    def card_check(self):
        if len(board.card) == 0:
            print('カードがありません')
            return False
        else:
            return True
    
    #自分がカードを持っているか確認
    def card_posession(self,card):
        if self.card[card] == 0:
            print('カードを持っていません')
            return False
        else:
            return True

    #点の周りの自分の道
    def my_road_around_node(self,node):
        return tuple(set(self.road) & set(board.edge_around_node(node)))

    #家の建設
    def house_build(self,node):
        #既に家がないか確認
        if not self.node_check(node): 
            return
        #資源の確認
        elif not self.resource_check('house'):
            return
        #周りに家がないか確認
        elif not self.around_node_check(node):
            return
        #道がつながっているか確認
        elif not self.edge_around_node_check(node):
            return
        #手元に家があるか確認
        elif not self.token_check('house'):
            return
        #問題なければ建設
        self.house.append(node)
        print('家を建てました')
        self.token['house'] -= 1
        for resource in house_resource:
            self.resource[resource] -= house_resource[resource]
        self.point_reload()
        return

    #道の建設
    def road_build(self,edge):
        #既に道がないか確認
        if not self.road_check(edge):
            return
        #資源の確認
        elif not self.resource_check('road'):
            return
        #道がつながっているか確認
        elif not self.road_connection_check(edge):
            return
        #手元に道があるか確認
        elif not self.token_check('road'):
            return
        #問題なければ建設
        self.road.append(edge)
        print('道を建てました')
        self.token['road'] -= 1
        for resource in road_resource:
            self.resource[resource] -= road_resource[resource]
        return
    
    #街の建設
    def city_build(self,node):
        #家があるか確認
        if not self.house_check(node):
            return
        #資源の確認
        elif not self.resource_check('city'):
            return
        #手元に街があるか確認
        elif not self.token_check('city'):
            return
        #問題なければ建設
        self.city.append(node)
        self.house.remove(node)
        print('街を建てました')
        self.token['house'] += 1
        self.token['city'] -= 1
        for resource in road_resource:
            self.resource[resource] -= city_resource[resource]
        self.point_reload()
        return

    #カードを引く
    def card_draw(self):
        #カードが残っているか確認
        if not self.card_check():
            return
        #資源の確認
        elif not self.resource_check('card'):
            return
        #問題なければカードを引く
        self.card[board.card[0]] += 1
        del board.card[0]
        print('カードを引きました')
        for resource in card_resource:
            self.resource[resource] -= card_resource[resource]
        #点数更新
        self.point_reload()
        return

    #カードの使用
    def card_use(self,card):
        #カードを持っているか確認
        if not self.card_posession(card):
            return
        #問題なけれはカードを使用
        if card == 'kishi':
            self.kishi()
            return
        elif card == 'hakken':
            self.hakken()
            return
        elif card == 'dokusen':
            self.dokusen()
            return
        elif card == 'kaido':
            self.kaido()
            return

    #騎士の使用(x,yは移動先のタイル)
    def kishi(self):
        #盗賊の移動
        x = int(input('移動先1'))
        y = int(input('移動先2'))
        board.move_thief(x,y)
        #資源の強奪(x,yは移動先のタイル)
        board.rob(x,y)
        self.card['kishi'] -= 1
        self.used_card['kishi'] += 1
        board.check_largest_army()
        return

    #発見の使用
    def hakken(self):
        for i in range(2):
            resource = input('資源')
            self.resource[resource] += 1
        self.card['hakken'] -= 1
        self.used_card['hakken'] += 1
        return

    #独占の使用
    def dokusen(self):
        resource = input('資源')
        for player in players:
            if not player == self:
                self.resource[resource] += player.resource[resource]
        for player in players:
            if not player == self:
                player[resource] = 0
        self.card['dokusen'] -= 1
        self.used_card['dokusen'] += 1
        return

    #街道の使用
    def kaido(self):
        for i in range(2):
            x = int(input('x'))
            y = int(input('y'))
            road = (x,y)
            #既に道がないか確認
            if not self.road_check(road):
                return
            #周りに自分の道があるか確認
            elif not self.road_connection_check(road):
                return
            #手元に道があるか確認
            elif not self.token_check('road'):
                return
            #問題なければ建設
            self.road.append(road)
            print('道を建てました')
            self.token['road'] -= 1
        self.card['kaido'] -= 1
        self.used_card['kaido'] += 1
        return

    #初期配置一軒目
    def first_initial_placement(self):
        #家の建設
        x = int(input('家の場所x'))
        y = int(input('家の場所y'))
        house = (x,y)
        #既に家がないか確認
        if not self.node_check(house):
            return
        #周りに家がないか確認
        elif not self.around_node_check(house):
            return
        #問題なければ家を建てる
        self.house.append(house)
        print('家を建てました')
        self.token['house'] -= 1
        #道の建設
        w = int(input('道の場所w'))
        z = int(input('道の場所z'))
        road = (w,z)    
        #既に道がないか確認
        if not self.road_check(road):
            return
        #周りに自分の家があるか確認
        elif not road in board.edge_around_node(house):
            print('そこには建てられません')
            return
        #問題なければ建設
        self.road.append(road)
        print('道を建てました')
        self.token['road'] -= 1
        return

    #初期配置二軒目
    def second_initial_placement(self):
        #家の建設
        x = int(input('家の場所x'))
        y = int(input('家の場所y'))
        #既に家がないか確認
        if not self.node_check(x,y):
            return
        #周りに家がないか確認
        elif not self.around_node_check(x,y):
            return
        #問題なければ家を建てる
        self.house.append((x,y))
        print('家を建てました')
        self.token['house'] -= 1
        for i in board.tile_around_node(x,y):
            resource = board.land[i[0]][i[1]]
            if not resource == 'sabaku':
                if not resource == 'umi':
                    self.resource[resource] += 1
        #道の建設
        w = int(input('道の場所w'))
        z = int(input('道の場所z'))        
        #既に道がないか確認
        if not self.road_check(w,z):
            return
        #周りに自分の家があるか確認
        elif not (w,z) in board.edge_around_node(x,y):
            print('そこには建てられません')
            return
        #問題なければ建設
        self.road.append((w,z))
        print('道を建てました')
        self.token['road'] -= 1
        return    

    #道を経由して点から点へ移動
    def move(self,current_node,road):
        if not road in self.my_road_around_node(current_node):
            print('道がありません')
            return False
        else:
            nodes = list(board.node_around_edge(road))
            nodes.remove(current_node)
            return nodes[0]

    #行き止まりかどうか確認
    def dead_end_check(self,node,choosable_road):
        if len(choosable_road) == 0:
            return True
        elif not board.node_owner(node) == self:
                if board.node_owner(node):
                    return True
                else:
                    return False
        else:
            return False
        
    #自分の最長の道の長さ
    def my_longest(self):
        #道に接した点を一つ選択
        longest = 0
        for start_road in self.road:
            for start_node in board.node_around_edge(start_road):
                count = 0
                counted_road = []
                returned_road = []
                #カウント終了まで以下を繰り返し
                current_node = self.move(start_node,start_road)
                counted_road.append(start_road)
                count += 1
                last_road = start_road
                while True:
                    accessable_road = []
                    if not board.node_owner(current_node) == self:
                        if board.node_owner(current_node):
                            accessable_road.append(last_road)
                        else:
                            accessable_road = self.my_road_around_node(current_node)
                    else:
                        accessable_road = self.my_road_around_node(current_node)
                    unpassed_road = list(set(accessable_road) - set(counted_road))
                    unreturned_road = list(set(accessable_road) - set(returned_road))
                    if not len(unpassed_road) == 0:
                        current_node = self.move(current_node,unpassed_road[0])
                        counted_road.append(unpassed_road[0])
                        count += 1
                        last_road = unpassed_road[0]
                        continue
                    elif not len(unreturned_road) == 0:
                            if count > longest:
                                longest = count
                            current_node =  self.move(current_node,unreturned_road[0])
                            returned_road.append(unreturned_road[0])
                            count -= 1
                            continue
                    else:
                        break
        return longest 

#ボード
class RegularBoard:
    def __init__(self):
        #使用するタイルのリストを作成
        self.hex_list=[]
        for i in range(t):
            self.hex_list.append('tetsu')
        for i in range(m):
            self.hex_list.append('mugi')
        for i in range(h):
            self.hex_list.append('hitsuji')
        for i in range(k):
            self.hex_list.append('ki')
        for i in range(r):
            self.hex_list.append('renga')
        for i in range(s):
            self.hex_list.append('sabaku')
        random.shuffle(self.hex_list)
        #タイルを配置
        self.land = [[],[],[],[],[]]
        line_range = (3,4,5,4,3)
        row = 0
        for i in line_range:
            for j in range(i):
                if j == 0:
                    self.land[row].append('umi')
                self.land[row].append(self.hex_list[0])
                del self.hex_list[0]
                if j == i-1:
                    self.land[row].append('umi')
            row += 1
        ocean = ['umi','umi','umi','umi']
        self.land.insert(0,ocean)
        self.land.append(ocean)
        #数字を配置
        random.shuffle(numbers)
        self.land_numbers = [[0,0,0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0,0,0]]
        for i in range(1,6):
            for j in range(line_range[i-1]):
                if self.land[i][j+1] == 'sabaku':
                    self.land_numbers[i].insert(j+1,0)
                else:
                    self.land_numbers[i].insert(j+1,numbers[0])
                    del numbers[0]
        tuple(self.land_numbers)
        #カードをシャッフル
        self.card = ['tokuten','tokuten','tokuten','tokuten','tokuten',
        'hakken','hakken','dokusen','dokusen','kaido','kaido',
        'kishi','kishi','kishi','kishi','kishi','kishi','kishi','kishi','kishi','kishi']
        random.shuffle(self.card)
        #盗賊の位置
        self.thief_position = (0,0)
        #ターン数
        self.turn = 1
        #現在のプレイヤー
        self.current_player = players[(self.turn-1) % len(players)]

    #点の周りのタイル
    def tile_around_node(self,node):
        x = node[0]
        y = node[1]
        if x <= 3:
            if y % 2 == 1:
                return ((x-1, int(y/2)),(x, int(y/2)),(x, int(y/2)+1))
            else:
                return ((x-1, int(y/2)-1),(x-1, int(y/2)),(x, int(y/2)))
        if x >= 4:
            if y % 2 == 1:
                return ((x-1, int(y/2)),(x - 1, int(y/2)+1),(x, int(y/2)))
            else:
                return ((x-1, int(y/2)),(x, int(y/2)-1),(x, int(y/2)))

    #タイルの周りの点
    def node_around_tile(self,tile):
        x = tile[0]
        y = tile[1]
        if x<=2:
            return ((x, 2*y-1),(x,2*y),(x,2*y+1),(x+1,2*y),(x+1, 2*y+1),(x+1,2*y+2))
        if x==3:
            return ((x, 2*y-1),(x,2*y),(x,2*y+1),(x+1,2*y-1),(x+1, 2*y),(x+1,2*y+1))
        if x>=4:
            return ((x,2*y),(x, 2*y+1),(x,2*y+2),(x+1, 2*y-1),(x+1,2*y),(x+1,2*y+1))

    #点の周りの点
    def node_around_node(self,node):
        x = node[0]
        y = node[1]
        if x <= 3:
            a = 1
        else:
            a = -1
        if y % 2 == 0:
            b = 1
        else:
            b = -1
        if x == 3 or x == 4:
            if y % 2 == 1:
                return [(x,y-1),(x,y+1),(x-a*b,y)]
            else:
                return [(x, y-1),(x, y+1),(x- a*b, y - a*a*b)]
        else:
            return [(x, y-1),(x, y+1),(x- a*b, y - a*a*b)]

    #点の周りの辺
    def edge_around_node(self,node):
        x = node[0]
        y = node[1]
        if x <= 3:
            if y % 2 == 1:
                return [(2*x-1, y-1), (2*x-1, y),(2*x,int(y/2)+1)]
            else:
                return [(2*x-1, y-1), (2*x-1, y),(2*(x-1),int(y/2))]
        if x >= 4:
            if y % 2 == 1:
                return [(2*x-1, y-1), (2*x-1, y),(2*(x-1),int(y/2)+1)]
            else:
                return [(2*x-1, y-1), (2*x-1, y),(2*x,int(y/2))]
    
    #辺の周りの辺
    def edge_around_edge(self,edge):
        x = edge[0]
        y = edge[1]
        if x <= 5:
            if x % 2 == 1:
                if y % 2 == 1:
                    return [(x,y-1),(x,y+1),(x-1,y//2+1),(x+1,y//2+1)]
                else:
                    return [(x,y-1),(x,y+1),(x-1,y//2),(x+1,y//2+1)]
            if x % 2 == 0:
                return [(x-1,2*y-2),(x-1,2*y-1),(x+1,2*y-1),(x+1,2*y)]
        if x == 6:
            return [(x-1,2*y-2),(x-1,2*y-1),(x+1,2*y-2),(x+1,2*y-1)]
        if x >= 7:
            if x % 2 == 1:
                if y % 2 == 1:
                    return [(x,y-1),(x,y+1),(x-1,y//2+1),(x+1,y//2+1)]
                else:
                    return [(x,y-1),(x,y+1),(x-1,y//2+1),(x+1,y//2)]
            if x % 2 == 0:
                return [(x-1,2*y-1),(x-1,2*y),(x+1,2*y-2),(x+1,2*y-1)]

    #辺の両端の点
    def node_around_edge(self,edge):
        x = edge[0]
        y = edge[1]
        if x % 2 == 1:
            return ((int(x/2)+1,y),(int(x/2)+1,y+1))
        else:
            if x <= 5:
                return ((int(x/2),2*y-1),(int(x/2)+1,2*y))
            elif x == 6:
                return ((int(x/2),2*y-1),(int(x/2)+1,2*y-1))
            else:
                return ((int(x/2),2*y),(int(x/2)+1,2*y-1))

    #道と道をつなぐ点
    def node_between_edge(self,edge1,edge2):
        node = set(self.node_around_edge(edge1)) & set(self.node_around_edge(edge2))
        if len(node) ==0:
            return
        else:
            return tuple(node)[0]

    #道とつながっている道
    def connected_road(self,road):
        owner = self.road_owner(road)
        roads = list(set(owner.road) & set(self.edge_around_edge(road)))
        for r in roads:
            if self.node_owner(self.node_between_edge(r,road)) == owner:
                continue
            elif not self.node_owner(self.node_between_edge(r,road)):
                continue
            else:
                roads.remove(r)
        return roads

    #資源の産出
    def produce(self,dice):
        #資源を算出するタイル番号
        produce_tile = []
        for i in range(1,6):
            for j in range(len(self.land_numbers[i])):
                if self.land_numbers[i][j] == dice:
                    if not self.thief_position == (i,j):
                        produce_tile.append((i, j))
        print(produce_tile)
        #産出される資源
        produced_resource = []
        for i in range(len(produce_tile)):
            r = self.land[produce_tile[i][0]][produce_tile[i][1]]
            produced_resource.append(r)
        print(produced_resource)
        #資源を産出する交点
        produce_node= []
        for i in range(len(produce_tile)):
            produce_node.append(self.node_around_tile(produce_tile[i][0],produce_tile[i][1]))  
        print(produce_node)
        #資源を配布
        for player in players:
            for tile in range(len(produce_tile)):
                produce_house = set(player.house) & set(produce_node[tile])
                player.resource[produced_resource[tile]] += len(produce_house)
                produce_city = set(player.city) & set(produce_node[tile])
                player.resource[produced_resource[tile]] += len(produce_city) * 2
    
    #盗賊の移動
    def move_thief(self,tile):
        x = tile[0]
        y = tile[1]
        #現在地と別の場所か確認
        if [x,y] == board.thief_position:
            print('盗賊は現在そこにいます')
            return
        #ボード内か確認
        if not 1 <= x <= 5:
            print('盗賊は泳げません')
            return
        elif not 1 <= y <= -abs(x-3)+5:
            print('盗賊は泳げません')
            return
        #問題なければ移動
        board.thief_position = (x,y)

    #指定した点に建物があるプレイヤー
    def node_owner(self,node):        
        for player in players:
            if node in player.house:
                return player
            elif node in player.city:
                return player
            else:
                continue
        return False
    
    #指定した道の持ち主
    def road_owner(self,road):
        for player_number in range(len(players)):
            if road in players[player_number].road:
                return players[player_number]
        return False

    #指定したタイルの周りに建物があるプレイヤー
    def tile_owner(self,tile):
        x = tile[0]
        y = tile[1]
        owner=[]
        n = self.node_around_tile(x,y)
        for node in n:
            for player in players:
                if node in player.house:
                    owner.append(player)
                    break
                elif node in player.city:
                    owner.append(player)
                    break
        return set(owner)
    
    #その中で資源を持っているプレイヤー(自分以外)
    def resource_owner_around_tile(self,tile):
        owner = self.tile_owner(tile)
        target = []
        for player in owner:
            if not player.resource == {'tetsu':0,'mugi':0,'hitsuji':0,'ki':0,'renga':0}:
                target.append(player)
        if self.current_player in target:
            target.remove(self.current_player)
        return target
    
    #指定したプレイヤーから資源を奪う
    def rob_resource(self,chosen_player):
        resource_list=[]
        for resource in resource_type:
            for i in range(chosen_player.resource[resource]):
                resource_list.append(resource)
        if not resource_list == []:
            chosen_resource = random.choice(resource_list)
            chosen_player.resource[chosen_resource] -= 1
            self.current_player.resource[chosen_resource] += 1
        else:
            pass

    #資源の強奪(x,yは移動先のタイル)
    def rob(self,tile):
        if len(self.resource_owner_around_tile(tile)) == 0:
            return
        elif len(self.resource_owner_around_tile(tile)) == 1:
            chosen_player = self.resource_owner_around_tile(tile)[0]
        else:
            while True:
                w = int(input('強奪先1'))
                z = int(input('強奪先2'))
                node = (w,z)
                if not self.node_owner(w,z) in self.resource_owner_around_tile(tile):
                    print('そこからは取れません')
                else:
                    chosen_player = self.node_owner(node)
                    break
        self.rob_resource(chosen_player)
        return

    #バースト処理
    def burst(self):
        for player in players:
            resource_amount = 0
            for resource in resource_type:
                resource_amount += player.resource[resource]
            while resource_amount >= 8:
                t = int(input('鉄'))
                m = int(input('麦'))
                h = int(input('羊'))
                k = int(input('木'))
                r = int(input('レンガ'))
                if t+m+h+k+r == ceil(resource_amount/2):
                    player.resource = {'tetsu':t,'mugi':m,'hitsuji':h,'ki':k,'renga':r}
                    break
                elif t+m+h+k+r < ceil(resource_amount/2):
                    print('捨てすぎです')
                    continue
                else:
                    print('捨てる枚数が足りません')
                    continue        

    #7が出た時の処理
    def seven_process(self):
        self.burst()
        x = int(input('移動先1'))
        y = int(input('移動先2'))
        self.move_thief(x,y)
        self.rob(x,y)

    #サイコロを振る
    def dice(self):
        a = random.randint(1,6)
        b = random.randint(1,6)
        if a+b == 7:
            self.seven_process()
        else:
            self.produce(a+b)

    #最大騎士力の判定
    def check_largest_army(self):
        if self.current_player.used_card['kishi'] >= 3:
            if self.current_player.largest_army == 0:
                for player in players:
                    if player == self.current_player:
                        continue
                    elif player.used_card['kishi'] >= self.current_player.used_card['kishi']:
                        return
                #最大騎士力の移動
                for player in players:
                    player.largest_army = 0
                    player.point_reload()
                self.current_player.largest_army = 2
                self.current_player.point_reload()
    
    #最長交易路の判定
    def check_longest_road(self):
        longest = []
        longest_player = []
        for player in players:
            longest.append(player.my_longest())
        if max(longest) <5:
            for player in players:
                player.longest_road = 0
                return
        else:
            for player in players:
                if player.my_longest() == max(longest):
                    longest_player.append(player)
                else:
                    player.longest_road = 0
            if len(longest_player) == 1:
                longest_player[0].longest_road = 2



        



johan = Player()
taro = Player()
jiro = Player()
board = RegularBoard()
'''
for a in range(len(board.land)):
    print(board.land[a])
for a in range(len(board.land_numbers)):
    print(board.land_numbers[a])
'''

johan.road.append((1,1))
johan.road.append((1,2))
johan.road.append((1,3))
johan.road.append((1,4))
johan.road.append((1,5))
johan.road.append((1,6))
taro.road.append((3,1))
taro.road.append((3,2))
taro.road.append((3,3))
taro.road.append((3,4))
taro.road.append((3,5))
board.check_longest_road()
print(johan.longest_road)
print(taro.longest_road)
taro.road.append((3,6))
taro.road.append((3,7))
board.check_longest_road()
print(johan.longest_road)
print(taro.longest_road)
jiro.house.append((2,6))
board.check_longest_road()
print(johan.longest_road)
print(taro.longest_road)

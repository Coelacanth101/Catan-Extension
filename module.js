function discard(item,list){
    if(list.includes(item)){
        let i = list.indexOf(item);
        list.splice(i, 1);
    }
  }
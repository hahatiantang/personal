
/**
 * 获取台历预览数据
 * */

import * as ActionsType from '../utils/ActionsType';
export function podStore(state = {}, action) {
  switch (action.type) {
    case ActionsType.POD_VIEW:
      return action.store;
    default:
      return state;
  }
}


export function wxConfig(state = {}, action) {
  switch (action.type) {
    case ActionsType.WX_CONFIG:
      return action.store;
    default:
      return state;
  }
}

//书本打印信息
export function printChoiceStore(state = {},action) {
  switch (action.type){
    case ActionsType.PRINT_CHOICE:
      return action.store;
    default:
      return state;
  }
}

//书本价格
export function printPriceStore(state = {},action) {
  switch (action.type){
    case ActionsType.PRINT_PRICE:
      return action.store;
    default:
      return state;
  }
}
/**
 * 文件说明:
 * 详细描述:
 * 创建者: 韩波
 * 创建时间: 2016/10/20
 * 变更记录:
 */
import React,{Component,PropTypes} from 'react';
import reactComposition from 'react-composition'
import _ from 'lodash';
import '../less/memory.less';
class MemoryList extends Component{
  constructor(props){
    super(props);
    this.state = {
      newMemData:props.memoryData,
      deleteKeys:[]
    };
  }

  //根据闰年生成29或者28天
  dayTwenty(year){
    let days = [],
      y = parseInt(year),
      size = (y%4==0 && y%100!=0)||(y%100==0 && y%400==0) ? 29 : 28;
    for (let i=0;i<size;i++) {
      days.push((i+1));
    }
    return days;
  }
  //天数是30天
  dayThirty(){
    let days = [];
    for (let i=0;i<30;i++) {
      days.push((i+1));
    }
    return days;
  }
  //天数是31天
  dayThirtyOne(){
    let days = [];
    for (let i=0;i<31;i++) {
      days.push((i+1));
    }
    return days;
  }

  //通过月份 获取天数
  handelChangeMonth(){
    let m = this.props.memoryData[0].month;
    let dates=[];
    switch (m){
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        dates = this.dayThirtyOne();
        break;
      case 2 :
        dates = this.dayTwenty(2017);
        break;
      default:
        dates = this.dayThirty();
        break;
    }
    return dates;
  }

  //字符限制
  handleLimit(str,len){
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex,"**").length;
    for(var i = 0;i < strLength;i++)     {
      singleChar = str.charAt(i).toString();
      if(singleChar.match(chineseRegex) != null) {
        newLength += 2;
      }else {
        newLength++;
      }
      if(newLength > len) {
        break;
      }
      newStr += singleChar;
    }

    return newStr
  }

  //返回编辑
  handelBack(){
    this.props.handelBackMemory()
  }
  
  //新增纪念日
  handelAddMemory(){
    let baseData={
      month: this.props.memoryData[0].month,
      day: 1,
      intro: '',
      key:true
    };
    let origin = this.state.newMemData.slice(0);
    if(origin.length > 2){
      this.props.handelAlertMsg(true,'每月最多加三条纪念日')
    }else{
      baseData.day = this.handelJudgeDate();
      origin.push(baseData);
      this.setState({
        newMemData:origin
      });
    }
  }

  //新增日期判断
  handelJudgeDate(){
    let origin = this.state.newMemData.slice(0);
    let days = this.handelChangeMonth();
    origin.map((list)=>{
      days.map((day,index)=>{
        if(day == list.day){
          days.splice(index,1)
        }
      });
    });
    return days[0];
  }
  
  //加好了
  handelSaveMem(){
    let flag1 = true,flag2 = true;
    let origin = this.state.newMemData.slice(0);
    let delOrigin = this.state.deleteKeys.slice(0);
    for(let i = 0;i < origin.length;i++){
      if(origin.length != 1) {
        if (!origin[i].intro.trim()) {
          this.props.handelAlertMsg(true, '还有未完成的纪念日哦！');
          flag1 = false;
          break;
        }
      }
    }
    if(flag1){
      let days = [];
      origin.map((list)=>{
        days.push(list.day)
      });
      days = days.sort();
      for(let j = 0;j < days.length;j++){
        if(days[j] == days[j+1]){
          this.props.handelAlertMsg(true,'一天只能记录一个事件哦！');
          flag2 = false;
          break;
        }
      }
    }
    if(flag1&&flag2){
      let ids = [];
      delOrigin.map((list)=>{
        ids.push(list.id)
      });
      let saveData = [];
      origin.map((list)=>{
        let saveObj = {
          month: list.month,
          day: list.day,
          intro: list.intro
        };
        if(origin.length == 1 && !origin[0].intro.trim()) {
          saveObj.key = true
        }
        saveData.push(saveObj)
      });
      let newSave = _.sortBy(saveData,function (item) {
        return item.day;
      });
      let originData = this.handelOriginData(newSave);
      let frontData = this.handelOriginData1(newSave);
      let data = {
        podId:this.props.podCreateStore.book_id,
        calendarId:this.props.queryObj.bookId || '',
        deleteKeys:ids,
        memoryDays:originData,
        front_elements:frontData
      };
      this.props.handelLoading(true,'纪念日添加中');
      this.props.actions.addMemoryAction(data,{
        handSuc:(res)=>{
          this.setState({
            newMemData:newSave
          });
          this.props.handelBtnClick(false);
          this.props.handelMemoryData(res,newSave,delOrigin);
          this.props.handelLoading(false,'');
          this.props.handelBackMemory()
        },
        handErr:()=>{
          this.props.handelLoading(false,'');
          this.props.handelAlertMsg(true,'纪念日添加失败')
        }
      });
    }
  }

  //数据整理
  handelOriginData(saveData){
    let originData = [];
    let calendarData =this.props.podCreateStore;
    let currentIndex = this.props.currentIndex;
    if(this.props.side){
      currentIndex = currentIndex + 1
    }else{

    }
    for(let i=0;i<saveData.length;i++){
      calendarData.content_list[currentIndex].element_list.map((list,index)=>{
        if(list.element_type == 2 && list.element_name.substring(0,4) == 'word'){
          let num = parseInt(this.props.handelDate(list.element_name));
          if(num == saveData[i].day){
            let data = {
              id:saveData[i].id || '',
              month:saveData[i].month,
              day:saveData[i].day,
              intro:saveData[i].intro,
              dataIndex:index,
              element:list
            };
            originData.push(data)
          }
        }
      });
    }
    return originData;
  }
  handelOriginData1(saveData){
    let originData = [];
    let i = 0;
    let calendarData =this.props.podCreateStore;
    let currentIndex = this.props.currentIndex;
    if(this.props.side){

    }else{
      currentIndex = currentIndex - 1
    }
    let calData = _.filter(calendarData.content_list[currentIndex].element_list,(list)=>{
      return list.element_name.substring(0,list.element_name.length-1) == 'word10'
    });
    let newCalData = _.sortBy(calData,function (item) {
      return parseInt(item.element_name.substring(item.element_name.length-1,item.element_name.length));
    });
    newCalData.map((item)=>{
      calendarData.content_list[currentIndex].element_list.map((list,index)=>{
        if(list.element_name == item.element_name){
          if(originData.length < saveData.length){
            let data = {
              intro:saveData[i].intro,
              day:saveData[i].day,
              dataIndex:index,
              element:item
            };
            i++;
            originData.push(data);
          }
        }
      })
    });
    return originData;
  }

  //编辑按钮
  memoryEdit(index){
    let origin = this.state.newMemData.slice(0);
    origin[index].key = true;
    origin[index].del = true;
    this.setState({
      newMemData:origin
    });
  }

  //输入内容
  handelChangeInput(event,index){
    let origin = this.state.newMemData.slice(0);
    let text = event.target.value;
    if (event.reactComposition.composition === false) {
      text = this.handleLimit(text.trim(),10)
    }
    origin[index].intro = text;
    this.setState({
      newMemData:origin
    });
  }

  //选择日期
  handelChangeDay(event,index){
    let days = [];
    let origin = this.state.newMemData.slice(0);
    origin.map((list)=>{
      days.push(list.day)
    });
    if(days.indexOf(parseInt(event.target.value)) > -1){
      this.props.handelAlertMsg(true,'一天只能记录一个事件哦！');
    }else{
      origin[index].day = parseInt(event.target.value);
      this.setState({
        newMemData:origin
      });
    }
  }

  //删除
  handelDelete(index){
    let origin = this.state.newMemData.slice(0);
    let keys = this.state.deleteKeys.slice(0);
    if(origin[index].intro){
      keys.push(origin[index])
    }
    origin.splice(index,1);
    let baseData={
      month: this.props.memoryData[0].month,
      day: 1,
      intro: '',
      key:true
    };
    if(origin.length < 1) {
      origin.push(baseData);
    }
    this.setState({
      newMemData:origin,
      deleteKeys:keys
    });
  }

  render(){
    let self = this;
    let days = this.handelChangeMonth();
    let newMemData = this.state.newMemData.slice(0);
    let memoryHtml = newMemData.map((item,index)=>{
      return (
      item.key ?
        <li className="memoryListLie" key={index}>
          <div className="memoryListLiBoxE">
            <div className="memoryListInBox">
              <span className="memoryListTitle">纪念事件</span>
              <input
                value={item.intro}
                type="text"
                placeholder="最多5个字"
                className="memoryListIn"
                {...reactComposition({
                  onChange: (event)=>{
                    self.handelChangeInput(event,index)
                  },
                  onCompositionEnd: (event)=>{
                    event.reactComposition = {composition: false};
                    self.handelChangeInput(event,index)
                  }
                })}
              />
            </div>
            <div className="memoryListSBox">
              <span className="memoryListTime">选择时间</span>
              <select className="memoryListS" defaultValue={item.month+'月'} disabled="disabled">
                <option value={item.month}>{item.month+'月'}</option>
              </select>
              <select className="memoryList_S" value={item.day} ref="day" onChange={(event)=>this.handelChangeDay(event,index)}>
                {
                  days.map((date,index)=>{
                    return(
                      <option key={index} value={date}>{date}</option>
                    )
                  })
                }
              </select>
            </div>
          </div>
          {item.del ? <div className="memoryListDel" onClick={this.handelDelete.bind(this,index)}></div> : null}
        </li>
        :
        <li className="memoryListLi" key={index}>
          <div className="memoryListLiBox">
            <p className="memoryListLiIntro">{item.intro}</p>
            <p>{item.month+'月'+item.day+'日'}</p>
          </div>
          <div className="memoryListLiEdit" onClick={this.memoryEdit.bind(this,index)}>编辑</div>
        </li>
      )
    });
    return(
      <div className="memoryList">
        <div className="memoryListHead">
          <div className="memoryList_back" onClick={this.handelBack.bind(this)}>
            <img src={require('../images/memoryBack.png')}/>
            <span>返回编辑</span>
          </div>
          <p>添加纪念日</p>
        </div>
        <div className="memoryListBox">
          <ul>
            {memoryHtml}
          </ul>
        </div>
        <div className="memoryListBtnBox">
          <button className="memoryList_btn" onClick={this.handelAddMemory.bind(this)}>新增纪念日</button>
          <button className="memoryList_save" onClick={this.handelSaveMem.bind(this)}>确定</button>
        </div>
      </div>
    )
  }
}
export default MemoryList;
import { createStore } from 'vuex';

export default createStore({
  state: {
    backgroundColor: '#2196f3',
    value: '',
    token:'',
    url:'',
    Current:'',
    HomeData:'',
    UserInfo:'',
    OperatePassState:false,
    Playdata:[
        {'id':1,'name':'特A'},
        {'id':2,'name':'特B'},
        {'id':3,'name':'特码两面'},
        {'id':4,'name':'特码波色'},
        {'id':5,'name':'正码A'},
        {'id':6,'name':'正码B'},
        {'id':7,'name':'总分'},
        {'id':8,'name':'正特A'},
        {'id':9,'name':'正特B'},
        {'id':10,'name':'正特两面'},
        {'id':11,'name':'正特波色'},
        {'id':12,'name':'特肖'},
        {'id':13,'name':'半特'},
        {'id':14,'name':'特头数'},
        {'id':15,'name':'特尾数'},
        {'id':16,'name':'半波'},
        {'id':17,'name':'半波'},
        {'id':18,'name':'半波'},
        {'id':19,'name':'半波'},
        {'id':20,'name':'半半波'},
        {'id':21,'name':'半半波'},
        {'id':22,'name':'半半波'},
        {'id':23,'name':'五行'},
        {'id':24,'name':'一肖中'},
        {'id':25,'name':'一肖不'},
        {'id':26,'name':'正肖'},
        {'id':27,'name':'生肖量'},
        {'id':28,'name':'生肖量'},
        {'id':29,'name':'生肖量'},
        {'id':30,'name':'生肖量'},
        {'id':31,'name':'生肖量'},
        {'id':32,'name':'生肖量'},
        {'id':33,'name':'总肖单双'},
        {'id':34,'name':'总肖单双'},
        {'id':35,'name':'尾数中'},
        {'id':36,'name':'尾数不中'},
        {'id':37,'name':'尾数量'},
        {'id':38,'name':'尾数量'},
        {'id':39,'name':'尾数量'},
        {'id':40,'name':'尾数量'},
        {'id':41,'name':'尾数量'},
        {'id':42,'name':'尾数量'},
        {'id':43,'name':'尾数量'},//總尾單雙
        {'id':44,'name':'尾数量'},//總尾單雙
        {'id':45,'name':'七码'},
        {'id':46,'name':'七码'},
        {'id':47,'name':'七码'},
        {'id':48,'name':'七码'},
        {'id':49,'name':'七码'},
        {'id':50,'name':'七码'},
        {'id':51,'name':'七码'},
        {'id':52,'name':'七码'},
        {'id':53,'name':'七色波'},
        {'id':54,'name':'七色波'},
        {'id':55,'name':'七色波'},
        {'id':56,'name':'四全中'},
        {'id':57,'name':'三全中'},
        {'id':58,'name':'三中二'},
        {'id':59,'name':'二全中'},
        {'id':60,'name':'二中特'},
        {'id':61,'name':'特串'},
        {'id':62,'name':'合肖-二肖'},
        {'id':63,'name':'合肖-三肖'},
        {'id':64,'name':'合肖-四肖'},
        {'id':65,'name':'合肖-五肖'},
        {'id':66,'name':'合肖-六肖'},
        {'id':67,'name':'合肖-七肖'},
        {'id':68,'name':'合肖-八肖'},
        {'id':69,'name':'合肖-九肖'},
        {'id':70,'name':'合肖-十肖'},
        {'id':71,'name':'合肖-十一肖'},
        {'id':72,'name':'二肖连中'},
        {'id':73,'name':'二肖连不中'},
        {'id':74,'name':'三肖连中'},
        {'id':75,'name':'三肖连不中'},
        {'id':76,'name':'四肖连中'},
        {'id':77,'name':'四肖连不中'},
        {'id':78,'name':'五肖连中'},
        {'id':79,'name':'五肖连不中'},
        {'id':80,'name':'二尾连中'},
        {'id':81,'name':'二尾连不中'},
        {'id':82,'name':'三尾连中'},
        {'id':83,'name':'三尾连不中'},
        {'id':84,'name':'四尾连中'},
        {'id':85,'name':'四尾连不中'},
        {'id':86,'name':'五尾连中'},
        {'id':87,'name':'五尾连不中'},
        {'id':88,'name':'四不中'},
        {'id':89,'name':'五不中'},
        {'id':90,'name':'六不中'},
        {'id':91,'name':'七不中'},
        {'id':92,'name':'八不中'},
        {'id':93,'name':'九不中'},
        {'id':94,'name':'十不中'},
        {'id':95,'name':'十一不中'},
        {'id':96,'name':'十二不中'},
        {'id':97,'name':'五中一'},
        {'id':98,'name':'六中一'},
        {'id':99,'name':'七中一'},
        {'id':100,'name':'八五中一'},
        {'id':101,'name':'九中一'},
        {'id':102,'name':'十中一'},
        {'id':103,'name':'一粒任中'},
        {'id':104,'name':'二粒任中'},
        {'id':105,'name':'三粒任中'},
        {'id':106,'name':'四粒任中'},
        {'id':107,'name':'五粒任中'}
    ],
    Groupdata:[
        {'id':1,'name':'特A'},
        {'id':2,'name':'特B'},
        {'id':3,'name':'特码两面'},
        {'id':4,'name':'特码波色'},
        {'id':5,'name':'正码A'},
        {'id':6,'name':'正码B'},
        {'id':7,'name':'总分'},
        {'id':8,'name':'正特A'},
        {'id':9,'name':'正特B'},
        {'id':10,'name':'正特两面'},
        {'id':11,'name':'正特波色'},
        {'id':12,'name':'特肖'},
        {'id':13,'name':'半特'},
        {'id':14,'name':'特头数'},
        {'id':15,'name':'特尾数'},
        {'id':16,'name':'半波'},
        {'id':17,'name':'半半波'},
        {'id':18,'name':'五行'},
        {'id':19,'name':'一肖'},
        {'id':20,'name':'正肖'},
        {'id':21,'name':'生肖量'},
        {'id':22,'name':'尾数中'},
        {'id':23,'name':'尾数量'},
        {'id':24,'name':'七码'},      
        {'id':25,'name':'七色波'},
        {'id':26,'name':'连码'},
        {'id':27,'name':'合肖'},
        {'id':28,'name':'生肖连'},
        {'id':29,'name':'尾数连'},      
        {'id':30,'name':'不中'},
        {'id':31,'name':'多中一'},
        {'id':32,'name':'任中'}
    ],
    Authoritydata:[
       {'name':'账号管理','value':'member'},
       {'name':'赔率设置','value':'odds'},
       {'name':'退水设置','value':'backs'},
       {'name':'控盘管理','value':'kongpan'},
       {'name':'彩盘监控','value':'jiankong'},
       {'name':'报表查看','value':'report'},
       {'name':'彩种管理','value':'lottery'},
       {'name':'通知公告','value':'notice'}
     ]
  },
  mutations: {
    setValue (state, payload) {
      state.value = payload
    },
    setToken (state, payload) {
      state.token = payload
    },
    setUrl (state, payload) {
      state.url = payload
    },
    setUserName (state, payload) {
      state.UserName = payload
    },
    setAuthority(state, payload){
      state.Authority = payload
    },
    setCurrent(state, payload){
      state.Current = payload
    },
    setHomeData(state, payload){
      state.HomeData = payload
    },
    setUserInfo (state, payload) {
      state.UserInfo = payload
    },
    setRule (state, payload) {
      state.Rule = payload
    },
    setOperatePassState (state, payload) {
      state.OperatePassState = payload
    },
    setBackgroundColor (state, payload) {
      state.backgroundColor = payload
    }
  
  },
  actions: {
    updateValue ({ commit }, payload) {
      commit('setValue', payload)
    },
    
  },
  getters: {
   
  },
  modules: {
  },
});

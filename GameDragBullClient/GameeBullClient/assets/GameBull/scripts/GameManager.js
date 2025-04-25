var RopeAnimation = {
    Xoay:["Xoay1Day","Xoay2Day","Xoay3Day","Xoay4Day","Xoay5Day"],
    Quan:["Quan1Day","Quan2Day","Quan3Day","Quan4Day","Quan5Day"]
}
var GameManager = cc.Class({
    extends: cc.Component,

    properties: {
        txtNumberRope: cc.Label,
        txtNumberBet: cc.Label,
        txtUsername: cc.Label,
        txtBalance: cc.Label,
        txtJackpot: cc.Label,
        buttonStartGame: cc.Node,
        boxSetting: cc.Node,
        ropeSpine: sp.Skeleton,
        horsePrefab: cc.Prefab,
        horseRacingTrace: cc.Node,
        ropesPulling: [cc.Node],

    },


    statics:{
        Instance: null
    },

    onLoad(){
        this.loadUserInfo(UserModel);
        this.loadGameInfo(HorseGameModel);
    },

    start () {
        GameManager.Instance = this;
        cc.director.getCollisionManager().enabled = true;
        this.newGame();
        
    },

    resposeNewGame(idsHorse){
        this.isThrowing = false;
        this.idHorseList = idsHorse;
        this.indexHorseCurrent = 0;
        for(let i=0;i<this.idHorseList.length;i++){
            this.spawnHorseNext();
        }
    },

    newGame(){
        this.horsesPulling = null;
        this.idHorseList = [];
        this.indexHorseCurrent = 0;
        this.ropeSpine.node.active = true;
        this.playAnimXoayDay();
        for(let i=0;i<this.ropesPulling.length;i++){
            this.ropesPulling[i].getComponent("Rope").hide();
        }
        this.horseRacingTrace.removeAllChildren();

        SimulateServerGameBull.requestNewGame(this.resposeNewGame.bind(this));
    },

    spawnHorseNext(){
        let posY = HorseGameConfig.posHorseY[parseInt(Math.random()*HorseGameConfig.posHorseY.length)];
        let posX = this.getPosXNext();
        let nodeHorse = cc.instantiate(this.horsePrefab);
        this.horseRacingTrace.addChild(nodeHorse);
        nodeHorse.setPosition(posX, posY);
        let horseComp = nodeHorse.getComponent("Horse");
        horseComp.init(this.indexHorseCurrent,this.idHorseList[this.indexHorseCurrent]);
        this.indexHorseCurrent++;
        if(this.indexHorseCurrent >= this.idHorseList.length) this.indexHorseCurrent = 0;
        horseComp.startRun();
    },

    playAnimXoayDay(){
        this.ropeSpine.node.scale = 1;
        this.ropeSpine.setAnimation(0,RopeAnimation.Xoay[HorseGameModel.numberRopeCurrent-1],true);
    },

    playAnimQuanDay(){
        this.ropeSpine.node.scale = 0.7;
        this.ropeSpine.setAnimation(0,RopeAnimation.Quan[HorseGameModel.numberRopeCurrent-1],false);
    },


    throwRopes(){
        if(this.isThrowing == true) return;
        this.isThrowing = true;
        SimulateServerGameBull.requestResultGame((indexHorseWin)=>{
            this.indexHorseWin = indexHorseWin;
            this.playAnimQuanDay();
            this.stopHorses();

            this.horsesPulling = this.findHorsesNearestCenter(HorseGameModel.numberRopeCurrent);
            this.scheduleOnce(this.handlePullingHorses.bind(this),1.1);
            this.scheduleOnce(this.handleWinloseHorses.bind(this),3);
            this.scheduleOnce(this.newGame.bind(this),10);
        });
    },
    
    handleWinloseHorses(){
        for(let i=0;i<this.horsesPulling.length;i++){
            let horsePulling = this.horsesPulling[i].getComponent("Horse");
            if(this.indexHorseWin.includes(horsePulling.index)){
                horsePulling.win();
            }
            else{
                horsePulling.lose();
                this.ropesPulling[i].getComponent("Rope").hide();
            }
        }
    },

    handlePullingHorses(){
        this.ropeSpine.node.active = false;
        for(let i=0;i<this.horsesPulling.length;i++){
            let horse = this.horsesPulling[i].getComponent("Horse");
            horse.pulling();
            this.ropesPulling[i].getComponent("Rope").show(horse.id,horse.rope);
        }
    },

    findHorsesNearestCenter(numberHorse) {
        // Lấy tất cả con của node hiện tại (hoặc thay thế bằng danh sách ngựa tùy ý)
        let horseNodes = this.horseRacingTrace.children;
    
        // Sắp xếp danh sách node theo khoảng cách tuyệt đối theo trục X đến vị trí (0, 0)
        let sortedHorses = horseNodes.sort((a, b) => {
            return Math.abs(a.x) - Math.abs(b.x);
        });
    
        // Cắt danh sách theo số lượng yêu cầu (tối đa 4 con)
        let nearestHorses = sortedHorses.slice(0, Math.min(HorseGameConfig.numberRopeMax, numberHorse));
    
        return nearestHorses;
    },

    stopHorses(){
        for(let i=0;i<this.horseRacingTrace.children.length;i++){
            this.horseRacingTrace.children[i].getComponent("Horse").stopRun();
        }
    },

    getPosXNext(){
        if(this.horseRacingTrace.children.length == 0){
            let screenWidth = cc.view.getVisibleSize().width;
            return -screenWidth/2;
        }
        else{
            let horseEnd = this.horseRacingTrace.children[this.horseRacingTrace.children.length-1];
            return horseEnd.position.x + HorseGameConfig.paddingHorse;
        }
    },

    spawnHorse(index){
        let screenWidth = cc.view.getVisibleSize().width;
        let spacingX = 300;
        let startX = screenWidth / 2 
        let nodeHorse = cc.instantiate(this.horsePrefab);
        this.horseRacingTrace.addChild(horse);
        nodeHorse.setPosition(startX + 0 * spacingX, 0);
        let horseComp = nodeHorse.getComponent("Horse");
        horseComp.init(index,this.idHorseList[index]);
        horseComp.startRun();
        this.horseList.push(horseComp);
    },

    loadUserInfo(){
        this.txtUsername.string = UserModel.nickname;
        this.txtBalance.string = Helper.numberFormat(UserModel.balance);
    },

    loadGameInfo(){
        HorseGameModel.numberRopeCurrent = HorseGameConfig.numberRopeDefault;
        HorseGameModel.numberBetCurrent = HorseGameConfig.numberBetDefault;

        this.txtNumberRope.string = HorseGameModel.numberRopeCurrent;
        this.txtNumberBet.string = Helper.numberFormat(HorseGameModel.numberBetCurrent);
        this.txtJackpot.string = Helper.numberFormat(HorseGameModel.jackpot);

        this.playAnimXoayDay();
    },



    onClickDecreaseNumberRope(){
        HorseGameModel.numberRopeCurrent--;
        if(HorseGameModel.numberRopeCurrent < HorseGameConfig.numberRopeMin){
            HorseGameModel.numberRopeCurrent = HorseGameConfig.numberRopeMin;
        }
        this.txtNumberRope.string = HorseGameModel.numberRopeCurrent;
        this.playAnimXoayDay();
    },

    onClicIncreaseNumberRope(){
        HorseGameModel.numberRopeCurrent++;
        if(HorseGameModel.numberRopeCurrent > HorseGameConfig.numberRopeMax){
            HorseGameModel.numberRopeCurrent = HorseGameConfig.numberRopeMax;
        }
        this.txtNumberRope.string = HorseGameModel.numberRopeCurrent;
        this.playAnimXoayDay();
    },

    onClickDecreaseNumberBet(){
        HorseGameModel.numberBetCurrent -= HorseGameConfig.numberBetStep;
        if(HorseGameModel.numberBetCurrent < HorseGameConfig.numberBetMin){
            HorseGameModel.numberBetCurrent = HorseGameConfig.numberBetMin;
        }
        this.txtNumberBet.string = Helper.numberFormat(HorseGameModel.numberBetCurrent);
    },

    onClickIncreaseNumberBet(){
        HorseGameModel.numberBetCurrent += HorseGameConfig.numberBetStep;
        if(HorseGameModel.numberBetCurrent > HorseGameConfig.numberBetMax){
            HorseGameModel.numberBetCurrent = HorseGameConfig.numberBetMax;
        }
        this.txtNumberBet.string = Helper.numberFormat(HorseGameModel.numberBetCurrent);
    },

    onClickStartThrowRope(){
        this.throwRopes();
    },

    onClickHome(){

    },
    
    onClickSetting(){
        this.boxSetting.active = !this.boxSetting.active;
    },

    onClickSound(){

    },

    onClickTutorial(){

    },

    onClickHistory(){

    },
});

window.GameManager = GameManager;
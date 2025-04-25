var GameManager = require("GameManager");
cc.Class({
    extends: cc.Component,

    properties: {
        txtNumberRope: cc.Label,
        txtNumberBet: cc.Label,
        txtUsername: cc.Label,
        txtBalance: cc.Label,
        txtJackpot: cc.Label,
        buttonStartGame: cc.Node,
        boxSetting: cc.Node,
        ropeSprite: cc.Sprite,
        ropeSfsList: [cc.SpriteFrame],
        game: GameManager
    },

    onLoad () {
        this.loadUserInfo(UserModel);
        this.loadGameInfo(HorseGameModel);
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

        this.ropeSprite.node.active = true;
        this.ropeSprite.spriteFrame = this.ropeSfsList[HorseGameModel.numberRopeCurrent-1];
    },

    onClickDecreaseNumberRope(){
        HorseGameModel.numberRopeCurrent--;
        if(HorseGameModel.numberRopeCurrent < HorseGameConfig.numberRopeMin){
            HorseGameModel.numberRopeCurrent = HorseGameConfig.numberRopeMin;
        }
        this.txtNumberRope.string = HorseGameModel.numberRopeCurrent;
        this.ropeSprite.spriteFrame = this.ropeSfsList[HorseGameModel.numberRopeCurrent-1];
    },

    onClicIncreaseNumberRope(){
        HorseGameModel.numberRopeCurrent++;
        if(HorseGameModel.numberRopeCurrent > HorseGameConfig.numberRopeMax){
            HorseGameModel.numberRopeCurrent = HorseGameConfig.numberRopeMax;
        }
        this.txtNumberRope.string = HorseGameModel.numberRopeCurrent;
        this.ropeSprite.spriteFrame = this.ropeSfsList[HorseGameModel.numberRopeCurrent-1];
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
        GameManager.Instance.throwRopes();
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

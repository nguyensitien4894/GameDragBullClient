cc.Class({
    extends: cc.Component,

    properties: {
        type: 'normal', // 'rare', 'jackpot'
        spine: sp.Skeleton,
        rope: cc.Node,
        isRunning: false,
        horseSkeletonData: [sp.SkeletonData],
        horseSkeletonDataIdle: [sp.SkeletonData], // cheat for animation team , ThatBai = Idle

    },

    onLoad () {
        this.initPosTargetX(); 
    },

    init(index,id){
        this.index = index;
        this.id = id;

        this.spine.skeletonData = this.horseSkeletonData[id-1];
        this.spine.timeScale = HorseGameConfig.timeScaleHorse[parseInt(Math.random()*HorseGameConfig.timeScaleHorse.length)];
        this.spine.setAnimation(0,"Chay",true);
    },
    

    initPosTargetX(){
        this.posTargetX = 0;
        let screenWidth = cc.view.getVisibleSize().width;
        let horseWidth = this.getWidthHorse();
        this.posTargetX = -screenWidth/2 - horseWidth;
    },

    getWidthHorse(){
        return this.node.width;
    },

    startRun () {
        this.isRunning = true;
        if (this.spine) {
            this.node.scale = 1;
            this.spine.setAnimation(0,"Chay",true);
        }
    },

    stopRun () {
        this.isRunning = false;
        if (this.spine) {
            this.spine.skeletonData = this.horseSkeletonDataIdle[this.id-1];
            this.spine.setAnimation(0, "ThatBai", true); 
        }
    },

    win(){
        cc.Tween.stopAllByTarget(this.spine.node);
        cc.Tween.stopAllByTarget(this.node);
        this.node.scale = 0.8;
        this.spine.skeletonData = this.horseSkeletonData[this.id-1];
        this.spine.setAnimation(0,"ThanhCong",true);
    },

    lose(){
        
        cc.Tween.stopAllByTarget(this.spine.node);
        cc.tween(this.spine.node)
        .to(4,{position:new cc.Vec2(this.spine.node.position.x,0)})
        .start();

        cc.Tween.stopAllByTarget(this.node);
        cc.tween(this.node)
        .to(4,{scale: 0.8})
        .call(()=>{
            this.node.scale = 1;
            this.spine.skeletonData = this.horseSkeletonData[this.id-1];
            this.spine.setAnimation(0,"ThatBai",true);
        })
        .start();
  
    },

    pulling(){
        this.spine.skeletonData = this.horseSkeletonData[this.id-1];
        this.spine.setAnimation(0,"BiKeo",false);
        this.node.scale = 0.8;

        this.spine.skeletonData = this.horseSkeletonData[this.id-1];
        this.spine.addAnimation(1,"PhanKhang",true);
        this.node.scale = 0.8;

        cc.Tween.stopAllByTarget(this.spine.node);
        cc.tween(this.spine.node)
        .to(4,{position:new cc.Vec2(this.spine.node.position.x,this.spine.node.position.y-100)})
        .start();

        cc.Tween.stopAllByTarget(this.node);
        cc.tween(this.node)
        .to(4,{scale: 0.9})
        .start();

        console.error("Checkinggame pulling");
        
    },

    setAnimation(){

    },

    update (dt) {
        if (this.isRunning) {
            this.node.x -= HorseGameConfig.speedHorse * dt;

            // Ra khỏi màn thì tự huỷ
            if (this.node.x < this.posTargetX) {
                this.node.destroy();
                GameManager.Instance.spawnHorseNext();
            }
        }
    },
});
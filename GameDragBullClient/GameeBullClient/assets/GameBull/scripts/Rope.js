cc.Class({
    extends: cc.Component,

    properties: {
        isFollowingHorse:false
    },

    show(idHorse,targetNode){
        this.idHorse = idHorse;
        this.targetNode = targetNode;
        this.isFollowingHorse = true;
        this.node.active = true;
    },

    hide(){
        this.targetNode = null;
        this.isFollowingHorse = false;
        this.node.active = false;
    },

    updateRopeFollow(idHorse,targetNode) {
        if (!targetNode) return;

        // Lấy vị trí world của điểm cố định (gốc dây)
        let ropeStartWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));

        // Lấy vị trí world của node target
        let targetWorldPos = targetNode.convertToWorldSpaceAR(cc.v2(0, 0));
        targetWorldPos.y += HorseGameConfig.spaceHorses[idHorse-1];

        // Tính vector từ gốc đến target
        let dir = targetWorldPos.sub(ropeStartWorldPos);
        let distance = dir.mag();

        // Tính góc (dây mặc định thẳng đứng, trục Y+, nên dùng atan2 theo X và Y)
        let angle = Math.atan2(dir.x, dir.y) * (180 / Math.PI); // xoay quanh gốc để hướng tới target

        // Cập nhật chiều dài và góc xoay của sợi dây
        this.node.height = distance ;
        this.node.angle = -angle; // Đổi dấu vì hệ tọa độ cocos quay theo chiều ngược
    },

    update(dt) {
        if(this.isFollowingHorse) this.updateRopeFollow(this.idHorse,this.targetNode);
    }
});
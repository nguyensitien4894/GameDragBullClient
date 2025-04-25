cc.Class({
    extends: cc.Component,

    properties: {
        ropePrefab: cc.Prefab,
        ropeParent: cc.Node,
        ropeCount: 5, // mặc định
    },

    throwRopes () {
        let spacing = 80;
        let startX = -(this.ropeCount - 1) * spacing / 2;

        for (let i = 0; i < this.ropeCount; i++) {
            let rope = cc.instantiate(this.ropePrefab);
            rope.x = startX + i * spacing;
            rope.y = -200;
            this.ropeParent.addChild(rope);
            rope.getComponent("Rope").throwToTop();
        }
    }
});
var SimulateServerGameBull = {

    requestNewGame(responseCallback){
        let idsHourseLoop = this.generateRandomArray();
        // for(let i=0;i<ServerConfigGameBull.totalHorseRacing;i++){
        //     let idHour = this.randomId();
        //     idsHourseLoop.push(idHour);
        // }

        responseCallback(idsHourseLoop);
    },

    requestResultGame(responseCallback){
        let indexHourseWin = [];
        for(let i=0;i<ServerConfigGameBull.totalHorseWin;i++){
            let indexWin = this.randomIndexWin();
            while(indexHourseWin.includes(indexWin)){
                indexWin = this.randomIndexWin();
            }
            indexHourseWin.push(indexWin);
        }

        responseCallback(indexHourseWin);
    },

    // randomId(){
    //     let rand = Math.random();
    //     for(let i=0;i<ServerConfigGameBull.idsRatioHorse.length;i++){
    //         if(rand <= ServerConfigGameBull.idsRatioHorse[i]){
    //             return ServerConfigGameBull.idsHorse[i];
    //         }
    //     }
    //     return ServerConfigGameBull.idsRatioHorse[0];
    // },

    generateRandomArray() {
        const source = ServerConfigGameBull.idsHorse;
        const maxRepeat = 1;
        const targetLength = ServerConfigGameBull.totalHorseRacing;
    
        // Tạo danh sách chứa mỗi phần tử tối đa 2 lần
        let pool = [];
    
        for (let i = 0; i < maxRepeat; i++) {
            pool = pool.concat(source); // mỗi phần tử có mặt 2 lần
        }
    
        // Tính số lần cần lặp lại toàn bộ pool để đạt 100 phần tử
        const fullRepeats = Math.floor(targetLength / pool.length);
        const remainder = targetLength % pool.length;
    
        let result = [];
    
        for (let i = 0; i < fullRepeats; i++) {
            result = result.concat(this.shuffleArray([...pool])); // mỗi lần phải copy mới để shuffle độc lập
        }
    
        // Xử lý phần dư
        if (remainder > 0) {
            const partialPool = this.shuffleArray([...pool]).slice(0, remainder);
            result = result.concat(partialPool);
        }
    
        return result;
    },

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    randomIndexWin(){
       return parseInt(Math.random()*ServerConfigGameBull.totalHorseRacing+"");
    }
}

window.SimulateServerGameBull = SimulateServerGameBull;
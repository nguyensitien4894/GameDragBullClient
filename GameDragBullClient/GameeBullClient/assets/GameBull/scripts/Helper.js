var Helper = {

    /**
     * Format number có dấu chấm ngăn cách hàng nghìn
     * @param {number} num 
     * @returns {string}
     */
    numberFormat: function(num) {
        if (typeof num !== 'number') return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
};

window.Helper = Helper;
export function currencyFormat(num) {
    if (num) {
        // console.log(num);
        return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    } else {
        return 0;
    }
}

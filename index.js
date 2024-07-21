import {fetchAccountData} from './js/main.js';

async function main() {
    const myData = await fetchAccountData();
    console.log(myData);
}

main();




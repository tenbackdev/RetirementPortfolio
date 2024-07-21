import Account from './account.js';

export let accounts = [];
const apiURLDomainPort = 'http://localhost:5000'

export async function fetchAccountData() {
    const response = await fetch(`${apiURLDomainPort}/balance/historical/365`);
    const data = await response.json();
    console.log(data);
    return data;
}

function initialize() {
    console.log('Placeholder For More Details Later.');
}

document.addEventListener('DOMContentLoaded', initialize);


const urlParams = new URLSearchParams(window.location.search);
const account = urlParams.get('account');
const collection = urlParams.get('collection');
const fields = urlParams.get('fields');

console.log(urlParams)

document.getElementById('account').innerText = account;
document.getElementById('collection').innerText = collection;
document.getElementById('fields').innerText = fields;

var assets = getAssets(account, collection);

async function getAssets(account, collection) {
    let allAssets = new Array();
    let hasMore = true;
    let page = 1;

    while (hasMore) {
        if (account == undefined) {
            throw("Must specify account.")
        }

        let uri = `https://wax.api.atomicassets.io/atomicassets/v1/assets?owner=${account}`;

        if (collection != undefined) {
            uri = uri + `&collection_name=${collection}`;
        }

        uri = uri + `&page=${page}&limit=1000&order=desc&sort=asset_id`;

        const response = await fetch(uri);
        const assets = await response.json();
        console.log(uri);
        allAssets = allAssets.concat(assets.data);
        console.log(assets.data.length, "asset count");
        hasMore = assets.data.length === 1000;
        page = page + 1;
    }

    document.getElementById('assets').innerText = allAssets.length;

    const fieldsArray = fields.split(',');
    const dataTable = document.getElementById('data');
    dataTable.innerHTML = "<tr>" + fieldsArray.map(x => "<th>" + x + "</th>") + "</tr>";

    allAssets.forEach(asset => {
        var dataFields = fieldsArray.map(field => asset[field]);
        var row = document.createElement("tr");
        dataFields.forEach(field => {
            var cell = document.createElement("td");
            cell.innerText = field;
            row.appendChild(cell);
        });
        dataTable.appendChild(row);
    });
}
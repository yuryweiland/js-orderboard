var appSettings = getObjectFromLocalStorage('appSettings');
var orders = [];
var cachedAdvertFiles = [];

var processingOrdersList = document.getElementById('processingOrders');
var readyOrdersList = document.getElementById('readyOrders');
var advertContainer = document.getElementById('advertContainer');

var processingOrdersListFragment = document.createDocumentFragment();
var readyOrdersListFragment = document.createDocumentFragment();
var advertFilesFragment = document.createDocumentFragment();

/**
 * Рендерим внешний вид записи о заказе
 * @param order
 * @returns {HTMLElement}
 */
function renderOrder(order) {
    var orderRecord = document.createElement("div");
    orderRecord.className="order";
    orderRecord.innerHTML = '<p>' + order.orderNumber + '</p>';

    if (order.isLastReady && order.status === 'ready') {
        orderRecord.classList.add('last-ready')
    }

    return orderRecord;
}

/**
 * Рендерим тег с изображением для рекламного блока
 * @param fileUrl
 * @returns {string}
 */
function renderAdvertImage(fileUrl) {
    var advertImageRecord = document.createElement("div");
    advertImageRecord.className="advert-image";
    advertImageRecord.innerHTML = "<img src=" + fileUrl + ">";

    return advertImageRecord;
}

/**
 * Генерируем в html списки заказов ("готовятся" и "готовы")
 */
function generateOrderLists() {
    let processingResult = [];
    let readyResult = [];

    if (orders) {
        getObjectFromLocalStorage('orders').forEach((order) => {

            if (order.status === 'processing') {
                processingResult.push(renderOrder(order));
            } else if (order.status === 'ready') {
                readyResult.push(renderOrder(order));
            }

        });
    }

    for(var i = 0; i < processingResult.length; i++) {
        processingOrdersListFragment.appendChild(processingResult[i]);
    }
    for(var i = 0; i < readyResult.length; i++) {
        readyOrdersListFragment.appendChild(readyResult[i]);
    }

    processingOrdersList.appendChild(processingOrdersListFragment);
    readyOrdersList.appendChild(readyOrdersListFragment);

    reverseChildNodes(processingOrdersList);
    reverseChildNodes(readyOrdersList);

}

/**
 * Отображаем файлы в рекламном блоке
 */
function showAdvertFiles() {
    let advertFilesResult = [];
    let advertFiles = appSettings.advertFiles;

    if (advertFiles.length) {

        advertFiles.forEach((fileUrl) => {
            advertFilesResult.push(renderAdvertImage(fileUrl));
        });

        for(var i = 0; i < advertFilesResult.length; i++) {
            advertFilesFragment.appendChild(advertFilesResult[i]);
        }

        advertContainer.appendChild(advertFilesFragment);
    }
}

/**
 * Обновление данных приложения раз в секунду:
 * - списков заказов "готовятся" и "готовы"
 * - настроек приложения (отображения рекламного блока и тп)
 */
function refreshAppData() {
    //var cachedAdvertFiles = [...getObjectFromLocalStorage('appSettings').advertFiles];

    window.setInterval(function() {
        // Обновление настроек приложения
        getObjectFromLocalStorage('appSettings').enableAdvert ? document.body.classList.add('enable-advert') : document.body.classList.remove('enable-advert');

        // Обновление списков заказов
        processingOrdersList.innerHTML = '';
        readyOrdersList.innerHTML = '';


        // debugger;

        // Обновляем файлы в рекламном блоке только при обновлении их списка в localStorage
        if (JSON.stringify(cachedAdvertFiles) !== JSON.stringify(getObjectFromLocalStorage('appSettings').advertFiles)) {
            cachedAdvertFiles = [...getObjectFromLocalStorage('appSettings').advertFiles];

            advertContainer.innerHTML = '';
            showAdvertFiles();
        }

        generateOrderLists();
    }, 1000);
}

generateOrderLists();
showAdvertFiles();
refreshAppData();

var appSettings = getObjectFromLocalStorage('appSettings');
var orders = [];

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
 * @returns {HTMLElement}
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
    processingOrdersList.innerHTML = '';
    readyOrdersList.innerHTML = '';

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
 * Определяем, показывать ли рекламный блок в табло
 */
function enableAdvertContainer() {
    appSettings.enableAdvert && appSettings.advertFiles.length ?
        document.body.classList.add('enable-advert') :
        document.body.classList.remove('enable-advert');
}

/**
 * Отображаем файлы в рекламном блоке
 */
function showAdvertFiles() {
    let advertFilesResult = [];
    advertContainer.innerHTML = '';

    if (appSettings.advertFiles.length) {

        appSettings.advertFiles.forEach((fileUrl) => {
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
    window.addEventListener('storage', function (e) {

        if (e.key === 'orders' && e.newValue !== e.oldValue) {
            // Обновление списков заказов
            generateOrderLists();
        }

        if (e.key === 'appSettings' && e.newValue !== e.oldValue) {
            // Обновление настроек приложения
            appSettings = getObjectFromLocalStorage('appSettings');
            enableAdvertContainer();
            showAdvertFiles();
        }

    }, false);
}

generateOrderLists();
enableAdvertContainer();
showAdvertFiles();
refreshAppData();
